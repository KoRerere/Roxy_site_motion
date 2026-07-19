import type { DeployTarget } from '@roxybrowser/jumpserver-deploy'
import type { DeployOptions } from './project-config/types'
import { execSync } from 'node:child_process'
import fs from 'node:fs'
import path from 'node:path'
import process from 'node:process'
import readline from 'node:readline'
import { Client } from 'ssh2'
import {
  createSplitZipPackages,
  JumpServerClient,
  JumpServerDeployer,
  loadDeployEnvFile,
  loadJumpServerConfigFromEnv,
  requireDeployEnv,
} from '@roxybrowser/jumpserver-deploy'
import { getEcosystemConfigs, parseEnvFile } from './utils'

export type { DeployOptions }

const DEPLOY_ENV_FILE = path.join(import.meta.dirname, '../.env.deploy')
const DEPLOY_ENV_HINT = '.env.deploy（参考 .env.deploy.example）'
const OUTPUT_DIR = path.join(import.meta.dirname, '../.output')
const BUILD_INFO_FILE = 'BUILD_INFO.json'

/** persist manifests 最多保留的发版次数（写死） */
const NUXT_PERSIST_RETAIN_COUNT = 10

/** 单次发版的 staging 目录与构建元信息（本地生成，远程验收对照） */
interface DeployContext {
  stagingDirName: string
  buildCommit: string
  buildBranch: string
  builtAt: string
}

loadDeployEnvFile(DEPLOY_ENV_FILE)

/** 远程软链 / PM2 / release 目录解析（name 与线上目录可分离，如 roxy_home_china → roxy_home） */
export interface ResolvedDeployNames {
  packageName: string
  remoteLinkName: string
  pm2Name: string
  releaseName: string
  remotePath: string
  linkAbs: string
  cwd: string
}

export function resolveDeployNames(
  options: Pick<DeployOptions, 'name' | 'remoteLinkName' | 'pm2Name' | 'releaseName' | 'remotePath'>,
): ResolvedDeployNames {
  const remotePath = toPosix(options.remotePath ?? '/root')
  const remoteLinkName = options.remoteLinkName ?? options.name
  const pm2Name = options.pm2Name ?? remoteLinkName
  const releaseName = options.releaseName ?? remoteLinkName
  const linkAbs = `${remotePath}/${remoteLinkName}`
  return {
    packageName: options.name,
    remoteLinkName,
    pm2Name,
    releaseName,
    remotePath,
    linkAbs,
    cwd: linkAbs,
  }
}

/** 读取 git 版本，非 git 仓库时回退为 unknown */
function readGitMeta(): Pick<DeployContext, 'buildCommit' | 'buildBranch'> {
  try {
    const buildCommit = execSync('git rev-parse --short HEAD', { encoding: 'utf-8' }).trim()
    const buildBranch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf-8' }).trim()
    return { buildCommit, buildBranch }
  }
  catch {
    return { buildCommit: 'unknown', buildBranch: 'unknown' }
  }
}

function createDeployContext(releaseName: string): DeployContext {
  const { buildCommit, buildBranch } = readGitMeta()
  return {
    stagingDirName: `${releaseName}__deploy_${Date.now()}`,
    buildCommit,
    buildBranch,
    builtAt: new Date().toISOString(),
  }
}

/** 写入 .output/BUILD_INFO.json，随 zip 上传，供远程发版后自动对版本 */
function writeBuildInfo(options: DeployOptions, ctx: DeployContext, names: ResolvedDeployNames): void {
  const payload = {
    app: options.name,
    link: names.remoteLinkName,
    pm2: names.pm2Name,
    commit: ctx.buildCommit,
    branch: ctx.buildBranch,
    builtAt: ctx.builtAt,
    stagingDir: ctx.stagingDirName,
  }
  fs.writeFileSync(
    path.join(OUTPUT_DIR, BUILD_INFO_FILE),
    `${JSON.stringify(payload, null, 2)}\n`,
  )
}

function toPosix(p: string): string {
  return p.replace(/\\/g, '/')
}

function shellQuote(arg: string): string {
  return `'${arg.replace(/'/g, `'\\''`)}'`
}

/**
 * 远程 shell 环境：测试机 pm2=/usr/bin/pm2；正式机 pm2 在 nvm 下。
 * nvm 加载失败必须 || true，不能阻断后续步骤。
 */
function buildRemoteEnvPrefix(): string {
  return [
    'export HOME=/root',
    'export PATH="/usr/local/sbin:/usr/local/bin:/usr/sbin:/usr/bin:/sbin:/bin"',
    'export NVM_DIR=/root/.nvm',
    '[ -s "$NVM_DIR/nvm.sh" ] && . "$NVM_DIR/nvm.sh" && (nvm use default >/dev/null 2>&1 || nvm use node >/dev/null 2>&1 || true) || true',
  ].join('; ')
}

/** 解析 pm2：优先 command -v，其次 /usr/bin/pm2，最后 nvm 目录 */
function buildPm2ResolveBin(): string {
  return [
    'PM2_BIN="$(command -v pm2 2>/dev/null)"',
    '[ -z "$PM2_BIN" ] && [ -x /usr/bin/pm2 ] && PM2_BIN=/usr/bin/pm2',
    '[ -z "$PM2_BIN" ] && [ -d "$NVM_DIR/versions/node" ] && NPM2="$(find "$NVM_DIR/versions/node" -path "*/bin/pm2" -type f 2>/dev/null | head -1)" && [ -n "$NPM2" ] && PM2_BIN="$NPM2"',
    '[ -n "$PM2_BIN" ] && [ -x "$PM2_BIN" ] || { echo "deploy fail: pm2 not found (PATH=$PATH NVM_DIR=$NVM_DIR)" >&2; exit 127; }',
  ].join('; ')
}

/** 远程 init：环境 + PM2_BIN（后续步骤共用，避免子 shell 丢变量） */
function buildRemoteInitBlock(): string {
  return `{ ${buildRemoteEnvPrefix()}; ${buildPm2ResolveBin()}; }`
}

/**
 * 读取 PM2 进程 cwd 并写入 PM2_CWD。
 * 优先 pm2 jlist JSON（稳定）；fallback 解析 describe 表格（兼容 Unicode │ 与 ASCII |）。
 */
function buildPm2ReadCwdAssign(pm2Name: string): string {
  const qName = shellQuote(pm2Name)
  return [
    `PM2_CWD=$("$PM2_BIN" jlist 2>/dev/null | node -e "let l=[];try{l=JSON.parse(require('fs').readFileSync(0,'utf8'))}catch(_){};const p=l.find(x=>x.name===process.argv[1]);process.stdout.write((p&&p.pm2_env&&p.pm2_env.pm_cwd)||'');" ${qName})`,
    `[ -n "$PM2_CWD" ] || PM2_CWD=$("$PM2_BIN" describe ${qName} 2>/dev/null | sed -n '/exec cwd/p' | grep -oE '/[^[:space:]│|]+' | head -1 | xargs)`,
  ].join('; ')
}

/**
 * 软链切换后确保 PM2 跑在新 release：cwd 解析后须与软链 target 一致，不能指向 __rollback。
 * 每个 if/then/fi 须在同一数组项内，避免 join(';') 产生 `then;` 语法错误。
 */
function buildPm2EnsureRunning(pm2Name: string, linkAbs: string): string {
  const qName = shellQuote(pm2Name)
  const qLinkAbs = shellQuote(linkAbs)
  const readCwd = buildPm2ReadCwdAssign(pm2Name)
  const body = [
    `cd ${qLinkAbs}`,
    `LINK_TARGET=$(readlink -f ${qLinkAbs})`,
    `NEED_RESTART=0`,
    `if ! "$PM2_BIN" pid ${qName} >/dev/null 2>&1; then NEED_RESTART=1; fi`,
    `if "$PM2_BIN" describe ${qName} >/dev/null 2>&1; then ${readCwd}; echo "$PM2_CWD" | grep -q '__rollback' && NEED_RESTART=1; [ -n "$PM2_CWD" ] && [ "$(readlink -f "$PM2_CWD" 2>/dev/null || echo "$PM2_CWD")" != "$LINK_TARGET" ] && NEED_RESTART=1; fi`,
    `if [ "$NEED_RESTART" = "1" ]; then "$PM2_BIN" delete ${qName} 2>/dev/null || true; cd ${qLinkAbs} && "$PM2_BIN" start ecosystem.config.js --update-env --cwd ${qLinkAbs}; else "$PM2_BIN" reload ${qName} --update-env 2>/dev/null || "$PM2_BIN" restart ${qName} --update-env 2>/dev/null || { "$PM2_BIN" delete ${qName} 2>/dev/null || true; cd ${qLinkAbs} && "$PM2_BIN" start ecosystem.config.js --update-env --cwd ${qLinkAbs}; }; fi`,
    `sleep 2`,
    `[ -n "$("$PM2_BIN" pid ${qName} 2>/dev/null | head -1 | tr -d "[:space:]")" ] || { echo "deploy fail: pm2 ${pm2Name} not running (PM2_BIN=$PM2_BIN)" >&2; exit 1; }`,
    readCwd,
    `echo "$PM2_CWD" | grep -q '__rollback' && { echo "deploy fail: pm2 cwd must not be __rollback ($PM2_CWD)" >&2; exit 1; }`,
    `[ -n "$PM2_CWD" ] || { echo "deploy fail: cannot read pm2 cwd for ${pm2Name}" >&2; "$PM2_BIN" describe ${qName} >&2; exit 1; }`,
    `[ "$(readlink -f "$PM2_CWD" 2>/dev/null || echo "$PM2_CWD")" = "$LINK_TARGET" ] || { echo "deploy fail: pm2 cwd $PM2_CWD resolves away from ${linkAbs} (target $LINK_TARGET)" >&2; "$PM2_BIN" describe ${qName} >&2; exit 1; }`,
  ].join('; ')
  return `{ ${body}; }`
}

/** 切软链前校验 BUILD_INFO 存在且 commit 与本地一致（错包/损坏包时不切软链） */
function buildBuildInfoCommitVerifyBlock(stagingAbs: string, buildCommit: string): string {
  const qBuildInfoAbs = shellQuote(`${stagingAbs}/${BUILD_INFO_FILE}`)
  const qCommit = shellQuote(buildCommit)
  const body = [
    `test -f ${qBuildInfoAbs} || ${shellFail(`deploy fail: ${BUILD_INFO_FILE} missing in release`)}`,
    `REMOTE_COMMIT=$(sed -n 's/.*"commit"[[:space:]]*:[[:space:]]*"\\([^"]*\\)".*/\\1/p' ${qBuildInfoAbs} | head -1)`,
    `test "$REMOTE_COMMIT" = ${qCommit} || { echo "deploy fail: remote commit $REMOTE_COMMIT != local ${buildCommit}" >&2; exit 1; }`,
  ].join('; ')
  return `{ ${body}; }`
}

/** HTTP 探针（仅告警不 fail）：reload 窗口期 curl 可能短暂失败，不应导致 deploy 失败 */
function buildHttpProbeWarnOnly(port: number): string {
  const url = `http://127.0.0.1:${port}/`
  const curl = `curl -sf -o /dev/null --max-time 15 ${url}`
  const body = [
    'HTTP_OK=0',
    `${curl} && HTTP_OK=1`,
    `[ "$HTTP_OK" != "1" ] && { sleep 3; ${curl} && HTTP_OK=1; }`,
    `[ "$HTTP_OK" != "1" ] && { sleep 3; ${curl} && HTTP_OK=1; }`,
    `[ "$HTTP_OK" != "1" ] && { sleep 3; ${curl} && HTTP_OK=1; }`,
    `[ "$HTTP_OK" != "1" ] && { sleep 3; ${curl} && HTTP_OK=1; }`,
    `[ "$HTTP_OK" != "1" ] && { sleep 3; ${curl} && HTTP_OK=1; }`,
    `[ "$HTTP_OK" = "1" ] || echo "deploy warn: ${url} probe failed but symlink switched (non-fatal)" >&2`,
  ].join('; ')
  return `{ ${body}; }`
}

/** 远程 bash -c 执行（测试机 bash/sh 均可，pm2 在 /usr/bin） */
function wrapRemoteBash(script: string): string {
  return `bash -c ${shellQuote(script)}`
}

/** 远程 shell 失败提示写到 stderr，JumpServer 才能把具体原因带回本地 */
function shellFail(message: string): string {
  return `{ echo ${shellQuote(message)} >&2; exit 1; }`
}

/**
 * 发版成功后清理历史 __deploy_*：只保留当前软链指向的 release。
 * __rollback 为独立目录名，不在此 glob 内，不会被删。
 * 无软链时保留最新的 __deploy_*（仅 cleanup 场景兜底）。
 */
function buildReleasePruneCommand(releaseName: string, linkAbs: string): string {
  const qLinkAbs = shellQuote(linkAbs)
  const deployGlob = `${releaseName}__deploy_*`
  const body = [
    `if [ -L ${qLinkAbs} ]; then CURRENT=$(readlink -f ${qLinkAbs}); else CURRENT=$(readlink -f "$(ls -dt ${deployGlob} 2>/dev/null | head -1)" 2>/dev/null || true); fi`,
    `if [ -n "$CURRENT" ] && [ -d "$CURRENT" ]; then PRUNED=0; for d in ${deployGlob}; do [ -e "$d" ] || continue; [ -d "$d" ] || continue; d_abs=$(readlink -f "$d" 2>/dev/null || echo "$(pwd)/$d"); [ "$d_abs" = "$CURRENT" ] && continue; rm -rf "$d" && PRUNED=$((PRUNED+1)) && echo "deploy prune: removed $d"; done; echo "deploy prune ok: kept $(basename "$CURRENT"), removed $PRUNED old release(s)"; else echo "deploy prune skip: ${releaseName} (no current release)" >&2; fi`,
  ].join('; ')
  return `{ ${body}; }`
}

/** 清理 JumpServer 上传后遗留的 zip 包（不影响 __rollback / 软链目录） */
function buildDeployZipCleanupCommand(packageName: string, remoteLinkName: string): string {
  const zipNames = [...new Set([packageName, remoteLinkName])].flatMap(base => [
    `${base}.zip`,
    `${base}-assets.zip`,
    `${base}-delayed.zip`,
  ])
  const rmArgs = zipNames.map(name => shellQuote(name)).join(' ')
  return `{ rm -f ${rmArgs} 2>/dev/null || true; }`
}

/**
 * 方案 B：rsync release/_nuxt → persist/_nuxt（不用 --ignore-existing，确保 builds/latest.json 更新）。
 * manifest 目录在 persist 根下（不在 _nuxt 内），避免被 Nginx 当作静态资源暴露。
 */
function buildPersistNuxtRsyncBlock(sourceNuxtDir: string, persistPath: string): string {
  const qSource = shellQuote(sourceNuxtDir)
  const qPersistNuxt = shellQuote(`${persistPath}/_nuxt`)
  const qManifestDir = shellQuote(`${persistPath}/manifests`)
  const body = [
    `test -d ${qSource} || ${shellFail(`persist fail: source _nuxt missing: ${sourceNuxtDir}`)}`,
    `mkdir -p ${qManifestDir}`,
    `mkdir -p ${qPersistNuxt}`,
    `rsync -a ${qSource}/ ${qPersistNuxt}/`,
  ].join('; ')
  return `{ ${body}; }`
}

/** 写入本次发版 _nuxt 文件清单（${persistPath}/manifests/{stagingDirName}.lst，供 10 版 GC） */
function buildPersistNuxtManifestBlock(sourceNuxtDir: string, persistPath: string, manifestName: string): string {
  const qSource = shellQuote(sourceNuxtDir)
  const qManifestFile = shellQuote(`${persistPath}/manifests/${manifestName}.lst`)
  const body = [
    `(cd ${qSource} && find . -type f -printf '%P\\n' | LC_ALL=C sort) > ${qManifestFile}`,
    `test -s ${qManifestFile} || ${shellFail(`persist fail: empty manifest ${manifestName}`)}`,
  ].join('; ')
  return `{ ${body}; }`
}

/**
 * 只保留最近 NUXT_PERSIST_RETAIN_COUNT 份 manifest；删除仅属于更旧发版的 chunk 文件。
 * 须在 PM2 reload 之后执行；远程 node 执行（与 pm2 jlist 解析同风格）。
 */
function buildPersistNuxtGcCommand(persistPath: string): string {
  const qRetain = shellQuote(String(NUXT_PERSIST_RETAIN_COUNT))
  const qManifestDir = shellQuote(`${persistPath}/manifests`)
  const qNuxtRoot = shellQuote(`${persistPath}/_nuxt`)
  const nodeScript = [
    'const fs=require("fs"),path=require("path");',
    'const retain=parseInt(process.argv[1],10);',
    'const manifestDir=process.argv[2];',
    'const nuxtRoot=process.argv[3];',
    'if(!fs.existsSync(manifestDir)){console.log("persist gc skip: no manifests dir");process.exit(0);}',
    'const all=fs.readdirSync(manifestDir).filter(f=>f.endsWith(".lst"));',
    'if(all.length<=retain){console.log("persist gc skip: "+all.length+" manifest(s)");process.exit(0);}',
    'all.sort((a,b)=>fs.statSync(path.join(manifestDir,b)).mtimeMs-fs.statSync(path.join(manifestDir,a)).mtimeMs);',
    'const keepFiles=all.slice(0,retain),dropFiles=all.slice(retain);',
    'const union=new Set();',
    'for(const f of keepFiles){',
    'for(const line of fs.readFileSync(path.join(manifestDir,f),"utf8").split("\\n")){if(line)union.add(line);}',
    '}',
    'let removed=0;',
    'for(const mf of dropFiles){',
    'for(const rel of fs.readFileSync(path.join(manifestDir,mf),"utf8").split("\\n")){',
    'if(!rel||union.has(rel))continue;',
    'const abs=path.join(nuxtRoot,rel);',
    'try{if(fs.existsSync(abs)&&fs.statSync(abs).isFile()){fs.unlinkSync(abs);removed++;}}catch(_){}',
    '}',
    'fs.unlinkSync(path.join(manifestDir,mf));',
    '}',
    'console.log("persist gc ok: kept "+keepFiles.length+" manifest(s), removed "+removed+" orphan file(s), dropped "+dropFiles.length+" old manifest(s)");',
  ].join('')
  return `node -e ${shellQuote(nodeScript)} ${qRetain} ${qManifestDir} ${qNuxtRoot}`
}

/** persist GC 仅告警不 fail：清理失败不应影响已成功的上线 */
function buildPersistNuxtGcWarnOnlyBlock(persistPath: string): string {
  const gcCommand = buildPersistNuxtGcCommand(persistPath)
  return `{ ${gcCommand} || echo ${shellQuote('deploy warn: persist gc failed (non-fatal)')} >&2; }`
}

/** 发版切软链前：rsync + manifest（失败时软链未动，线上状态安全） */
function buildPersistNuxtPreSymlinkBlock(
  sourceNuxtDir: string,
  persistPath: string,
  manifestName: string,
): string {
  return [
    buildPersistNuxtRsyncBlock(sourceNuxtDir, persistPath),
    buildPersistNuxtManifestBlock(sourceNuxtDir, persistPath, manifestName),
    `echo ${shellQuote(`deploy persist sync ok: ${persistPath} (${manifestName})`)}`,
  ].join(' && ')
}

/** 回滚：仅 rsync，不写 manifest、不 GC（避免误删刚 sync 的旧 chunk） */
function buildPersistNuxtRollbackBlock(sourceNuxtDir: string, persistPath: string): string {
  return [
    buildPersistNuxtRsyncBlock(sourceNuxtDir, persistPath),
    `echo ${shellQuote(`rollback persist sync ok: ${persistPath}`)}`,
  ].join(' && ')
}

/** 清理迁移/发版失败遗留的 __bad_*、__old_*（非线上目录，可安全删除） */
function buildBadLegacyDirCleanupCommand(releaseName: string): string {
  const badGlob = `${releaseName}__bad_*`
  const oldGlob = `${releaseName}__old_*`
  const body = [
    `REMOVED=0`,
    `for d in ${badGlob} ${oldGlob}; do [ -e "$d" ] || continue; rm -rf "$d" && REMOVED=$((REMOVED+1)) && echo "deploy cleanup: removed $d"; done`,
    `[ "$REMOVED" -gt 0 ] && echo "deploy cleanup ok: removed $REMOVED bad/old dir(s) for ${releaseName}" || true`,
  ].join('; ')
  return `{ ${body}; }`
}

/**
 * 发版后远程 shell：软链切换 release，${remoteLinkName} 为 PM2 cwd 固定路径。
 * 方案 B 顺序：校验 staging → BUILD_INFO → sync persist → 写 manifest → 切软链 → PM2 → GC（warn-only）。
 */
function buildSymlinkPostDeployCommand(
  names: ResolvedDeployNames,
  stagingDirName: string,
  buildCommit: string,
  httpPort?: number,
  nuxtPersistPath?: string,
): string {
  const { remotePath, remoteLinkName, pm2Name, releaseName, linkAbs, packageName } = names
  const stagingAbs = `${remotePath}/${stagingDirName}`
  const stagingNuxtAbs = `${stagingAbs}/public/_nuxt`
  const rollbackAbs = `${remotePath}/${releaseName}__rollback`
  const qStagingAbs = shellQuote(stagingAbs)
  const qStagingNuxtAbs = shellQuote(stagingNuxtAbs)
  const qLinkAbs = shellQuote(linkAbs)
  const qRollbackAbs = shellQuote(rollbackAbs)
  const qRemotePath = shellQuote(remotePath)
  const persistPath = nuxtPersistPath ? toPosix(nuxtPersistPath) : undefined

  const httpProbe = typeof httpPort === 'number' && httpPort > 0
    ? buildHttpProbeWarnOnly(httpPort)
    : null

  const persistPreSymlink = persistPath
    ? buildPersistNuxtPreSymlinkBlock(stagingNuxtAbs, persistPath, stagingDirName)
    : null

  const persistGc = persistPath
    ? buildPersistNuxtGcWarnOnlyBlock(persistPath)
    : null

  const buildInfoVerify = buildBuildInfoCommitVerifyBlock(stagingAbs, buildCommit)

  const innerScript = [
    buildRemoteInitBlock(),
    `cd ${qRemotePath}`,
    `test -d ${qStagingAbs} || ${shellFail(`staging dir missing: ${stagingAbs}`)}`,
    `test -f ${shellQuote(`${stagingAbs}/server/index.mjs`)} || ${shellFail(`staging incomplete: ${stagingAbs}/server/index.mjs`)}`,
    `test -f ${shellQuote(`${stagingAbs}/ecosystem.config.js`)} || ${shellFail(`staging incomplete: ${stagingAbs}/ecosystem.config.js`)}`,
    buildInfoVerify,
    ...(persistPreSymlink
      ? [`test -d ${qStagingNuxtAbs} || ${shellFail(`staging incomplete: ${stagingNuxtAbs}`)}`, persistPreSymlink]
      : []),
    `if [ -d ${qLinkAbs} ] && [ ! -L ${qLinkAbs} ]; then rm -rf ${qRollbackAbs}; (mv ${qLinkAbs} ${qRollbackAbs} || mv ${qLinkAbs} "${releaseName}__bad_$(date +%s)") || { echo "deploy fail: cannot move legacy directory ${linkAbs}" >&2; ls -la ${qRemotePath} >&2; exit 1; }; fi`,
    `OLD=""`,
    `if [ -L ${qLinkAbs} ]; then OLD=$(readlink -f ${qLinkAbs} 2>/dev/null || true); rm -f ${qLinkAbs}; fi`,
    `[ ! -e ${qLinkAbs} ] || { echo "deploy fail: ${linkAbs} still exists after migration" >&2; ls -la ${qLinkAbs} >&2; exit 1; }`,
    `ln -sn ${qStagingAbs} ${qLinkAbs}`,
    `if [ -n "$OLD" ] && [ -d "$OLD" ] && [ "$OLD" != "${rollbackAbs}" ] && [ "$OLD" != "${stagingAbs}" ]; then rm -rf ${qRollbackAbs} && mv "$OLD" ${qRollbackAbs}; fi`,
    `mkdir -p ${shellQuote(`${linkAbs}/logs`)}`,
    buildPm2EnsureRunning(pm2Name, linkAbs),
    `echo "deploy symlink ok: ${remoteLinkName} -> ${stagingDirName}"`,
    `CURRENT=$(readlink -f ${qLinkAbs})`,
    `test "$CURRENT" = ${qStagingAbs} || { echo "deploy fail: symlink points to $CURRENT, expected ${stagingAbs}" >&2; ls -la ${qLinkAbs} >&2; exit 1; }`,
    ...(httpProbe ? [httpProbe] : []),
    `echo "deploy verify ok: ${remoteLinkName} (pm2 ${pm2Name}) -> ${stagingDirName} (commit ${buildCommit})"`,
    ...(persistGc ? [persistGc] : []),
    buildReleasePruneCommand(releaseName, linkAbs),
    buildDeployZipCleanupCommand(packageName, remoteLinkName),
    buildBadLegacyDirCleanupCommand(releaseName),
  ].join(' && ')

  return wrapRemoteBash(innerScript)
}

/**
 * 回滚：软链指回 __rollback 实体目录后 reload。
 * 方案 B 顺序：sync rollback/_nuxt → persist → 切软链 → PM2。
 */
function buildSymlinkRollbackCommand(
  names: ResolvedDeployNames,
  rollbackDirName: string,
  nuxtPersistPath?: string,
): string {
  const { remotePath, remoteLinkName, pm2Name, linkAbs } = names
  const rollbackAbs = `${remotePath}/${rollbackDirName}`
  const rollbackNuxtAbs = `${rollbackAbs}/public/_nuxt`
  const qLinkAbs = shellQuote(linkAbs)
  const qRollbackAbs = shellQuote(rollbackAbs)
  const qRollbackNuxtAbs = shellQuote(rollbackNuxtAbs)
  const persistPath = nuxtPersistPath ? toPosix(nuxtPersistPath) : undefined

  const persistPreSymlink = persistPath
    ? buildPersistNuxtRollbackBlock(rollbackNuxtAbs, persistPath)
    : null

  const innerScript = [
    buildRemoteInitBlock(),
    `test -d ${qRollbackAbs} || ${shellFail(`rollback dir missing: ${rollbackAbs}`)}`,
    `test -f ${shellQuote(`${rollbackAbs}/server/index.mjs`)} || ${shellFail(`rollback incomplete: ${rollbackAbs}/server/index.mjs`)}`,
    `cd ${shellQuote(remotePath)}`,
    ...(persistPreSymlink
      ? [`test -d ${qRollbackNuxtAbs} || ${shellFail(`rollback incomplete: ${rollbackNuxtAbs}`)}`, persistPreSymlink]
      : []),
    `[ -L ${qLinkAbs} ] && rm -f ${qLinkAbs}`,
    `[ ! -e ${qLinkAbs} ] || { echo "rollback fail: ${linkAbs} is not a symlink" >&2; exit 1; }`,
    `ln -sn ${qRollbackAbs} ${qLinkAbs}`,
    `mkdir -p ${shellQuote(`${linkAbs}/logs`)}`,
    buildPm2EnsureRunning(pm2Name, linkAbs),
    `echo "rollback ok: ${remoteLinkName} symlink -> ${rollbackDirName}"`,
  ].join(' && ')

  return wrapRemoteBash(innerScript)
}

function resolveRemoteZipFilename(name: string, remoteZipFilename?: string): string {
  return remoteZipFilename ?? `${name}.zip`
}

/** 延后部署：预渲染 HTML 与 _payload.json 最后更新，避免页面引用尚未落地的 _nuxt 资源 */
function isDelayedDeployFile(relativePath: string): boolean {
  const normalized = relativePath.replace(/\\/g, '/')
  return normalized.endsWith('.html') || normalized.endsWith('_payload.json')
}

/** 合并 env 与 ecosystem，生成 getEcosystemConfigs 的参数（含 cwd / pm2Name） */
export function buildEcosystemPayload(
  options: Pick<DeployOptions, 'name' | 'ecosystem' | 'envFile' | 'remoteLinkName' | 'pm2Name' | 'releaseName' | 'remotePath'>,
  names?: ResolvedDeployNames,
): Recordable {
  const resolved = names ?? resolveDeployNames(options)
  const { ecosystem = {}, envFile } = options
  const envFromFile = envFile ? parseEnvFile(envFile) : {}
  const ecoEnv = ecosystem.env
  const mergedEnv = {
    ...envFromFile,
    ...(typeof ecoEnv === 'object' && ecoEnv !== null ? ecoEnv : {}),
  }
  const { env: _omitEnv, ...ecosystemRest } = ecosystem
  return {
    ...ecosystemRest,
    name: ecosystemRest.name ?? resolved.pm2Name,
    cwd: resolved.cwd,
    ...(Object.keys(mergedEnv).length > 0 ? { env: mergedEnv } : {}),
  }
}

/** 将 ecosystem 配置写入 `.output/ecosystem.config.js`（需先完成 build 产出 `.output`） */
export function writeEcosystemConfig(
  options: Pick<DeployOptions, 'name' | 'ecosystem' | 'envFile' | 'remoteLinkName' | 'pm2Name' | 'releaseName' | 'remotePath'>,
  names?: ResolvedDeployNames,
): void {
  const resolved = names ?? resolveDeployNames(options)
  const payload = buildEcosystemPayload(options, resolved)
  const content = `module.exports = ${JSON.stringify(getEcosystemConfigs(payload), null, 2)}`.trim()
  fs.writeFileSync(path.join(OUTPUT_DIR, 'ecosystem.config.js'), content)
}

const SSH_READY_TIMEOUT_MS = 30_000
const SSH_KEEPALIVE_INTERVAL_MS = 10_000

function resolveHttpProbePort(options: DeployOptions): number | undefined {
  const port = options.ecosystem?.env?.PORT
  if (typeof port === 'number')
    return port
  if (typeof port === 'string' && /^\d+$/.test(port))
    return Number.parseInt(port, 10)
  return undefined
}

function buildDeployTarget(options: DeployOptions, ctx: DeployContext): DeployTarget {
  const names = resolveDeployNames(options)
  const remoteBasePath = `${names.remotePath}/${ctx.stagingDirName}`

  const postDeployCommand = buildSymlinkPostDeployCommand(
    names,
    ctx.stagingDirName,
    ctx.buildCommit,
    resolveHttpProbePort(options),
    options.nuxtPersistPath,
  )

  return {
    label: options.jmsLabel,
    assetId: requireDeployEnv(options.jmsAssetIdEnv, DEPLOY_ENV_HINT),
    remoteBasePath,
    postDeployCommand,
  }
}

/** 回滚：软链指回 {releaseName}__rollback 实体目录（发版脚本自动保留上一版） */
export function buildRollbackCommand(
  options: Pick<DeployOptions, 'name' | 'remoteLinkName' | 'pm2Name' | 'releaseName' | 'remotePath' | 'nuxtPersistPath'>,
): string {
  const names = resolveDeployNames(options)
  const rollbackDirName = `${names.releaseName}__rollback`
  return buildSymlinkRollbackCommand(names, rollbackDirName, options.nuxtPersistPath)
}

/**
 * 一次性修复遗留实体目录：将 ${appName} 改为指向 __deploy_* 的软链。
 * 国际站 roxy_home_dev 在切软链发版前需先执行一次。
 */
export function buildFixDeploySymlinkCommand(
  options: Pick<DeployOptions, 'name' | 'remoteLinkName' | 'pm2Name' | 'releaseName' | 'remotePath'>,
  stagingDirName?: string,
): string {
  const names = resolveDeployNames(options)
  const { remotePath, remoteLinkName, pm2Name, releaseName, linkAbs } = names
  const qRemotePath = shellQuote(remotePath)
  const qLinkAbs = shellQuote(linkAbs)

  const stagingInit = stagingDirName
    ? `STAGING=${shellQuote(`${remotePath}/${stagingDirName}`)}`
    : `STAGING=$(ls -dt "${releaseName}__deploy_"* 2>/dev/null | head -1)`

  const innerScript = [
    buildRemoteInitBlock(),
    `cd ${qRemotePath}`,
    stagingInit,
    `[ -n "$STAGING" ] && [ -d "$STAGING" ] || { echo "fix fail: no ${releaseName}__deploy_* dir under ${remotePath}" >&2; ls -la ${qRemotePath} >&2; exit 1; }`,
    `echo "fix: staging=$STAGING"`,
    `if [ -d ${qLinkAbs} ] && [ ! -L ${qLinkAbs} ]; then mv ${qLinkAbs} "${releaseName}__bad_$(date +%s)" || exit 1; echo "fix: moved legacy directory"; fi`,
    `[ -L ${qLinkAbs} ] && rm -f ${qLinkAbs}`,
    `[ ! -e ${qLinkAbs} ] || { echo "fix fail: ${linkAbs} still exists" >&2; ls -la ${qLinkAbs} >&2; exit 1; }`,
    `ln -sn "$STAGING" ${qLinkAbs}`,
    `CURRENT=$(readlink -f ${qLinkAbs})`,
    `test "$CURRENT" = "$(readlink -f "$STAGING")" || { echo "fix fail: symlink -> $CURRENT" >&2; exit 1; }`,
    buildPm2EnsureRunning(pm2Name, linkAbs),
    `echo "fix ok: ${remoteLinkName} (pm2 ${pm2Name}) -> $(basename "$STAGING")"`,
  ].join(' && ')

  return wrapRemoteBash(innerScript)
}

/** 远程清理：删除多余 __deploy_* 与上传 zip（不触碰 __rollback / 当前软链） */
export function buildRemoteCleanupDeployReleasesCommand(names: ResolvedDeployNames): string {
  const qRemotePath = shellQuote(names.remotePath)
  const innerScript = [
    `cd ${qRemotePath}`,
    `echo "cleanup: ${names.remoteLinkName} (${names.releaseName})"`,
    buildReleasePruneCommand(names.releaseName, names.linkAbs),
    buildDeployZipCleanupCommand(names.packageName, names.remoteLinkName),
    buildBadLegacyDirCleanupCommand(names.releaseName),
  ].join(' && ')
  return wrapRemoteBash(innerScript)
}

/** 同一台机器上批量清理多个 release 前缀（一次 SSH） */
export function buildRemoteCleanupDeployReleasesBatchCommand(namesList: ResolvedDeployNames[]): string {
  const first = namesList[0]
  if (!first)
    throw new Error('cleanup batch: namesList 为空')
  const qRemotePath = shellQuote(first.remotePath)
  const innerScript = [
    `cd ${qRemotePath}`,
    ...namesList.flatMap(names => [
      `echo "cleanup: ${names.remoteLinkName} (${names.releaseName})"`,
      buildReleasePruneCommand(names.releaseName, names.linkAbs),
      buildDeployZipCleanupCommand(names.packageName, names.remoteLinkName),
      buildBadLegacyDirCleanupCommand(names.releaseName),
    ]),
  ].join(' && ')
  return wrapRemoteBash(innerScript)
}

/** SSH 远程清理 deploy 遗留 release / zip */
export async function cleanupDeployReleases(options: DeployOptions | DeployOptions[]): Promise<void> {
  const list = Array.isArray(options) ? options : [options]
  const grouped = new Map<string, { projects: DeployOptions[], names: ResolvedDeployNames[] }>()

  for (const project of list) {
    const assetId = requireDeployEnv(project.jmsAssetIdEnv, DEPLOY_ENV_HINT)
    const names = resolveDeployNames(project)
    const groupKey = `${assetId}:${names.remotePath}`
    const bucket = grouped.get(groupKey) ?? { projects: [], names: [] }
    bucket.projects.push(project)
    bucket.names.push(names)
    grouped.set(groupKey, bucket)
  }

  for (const { projects, names } of grouped.values()) {
    const lead = projects[0]
    if (!lead)
      continue
    const label = projects.map(p => p.displayName).join('、')
    console.log(`正在清理 ${label}（${lead.jmsLabel}）远程 deploy 遗留…`)
    const command = names.length === 1
      ? buildRemoteCleanupDeployReleasesCommand(names[0]!)
      : buildRemoteCleanupDeployReleasesBatchCommand(names)
    await runRemoteShellCommand(lead, command)
  }

  const display = list.map(p => p.displayName).join('、')
  console.log('\x1B[32m%s\x1B[0m', `${display} deploy 遗留清理完成。`)
}

/** SSH 到远程执行 buildFixDeploySymlinkCommand */
export async function fixDeploySymlink(
  options: DeployOptions,
  stagingDirName?: string,
): Promise<void> {
  const names = resolveDeployNames(options)
  console.log(`正在修复 ${options.displayName}（${names.remoteLinkName} / pm2 ${names.pm2Name}）远程软链…`)
  await runRemoteShellCommand(options, buildFixDeploySymlinkCommand(options, stagingDirName))
  console.log('\x1B[32m%s\x1B[0m', `${options.displayName} 软链修复完成，可重新 deploy。`)
}

function buildRemoteTarget(options: DeployOptions): Pick<DeployTarget, 'label' | 'assetId'> {
  return {
    label: options.jmsLabel,
    assetId: requireDeployEnv(options.jmsAssetIdEnv, DEPLOY_ENV_HINT),
  }
}

/** 经 JumpServer SSH 在远程执行 shell 命令 */
export async function runRemoteShellCommand(
  options: DeployOptions,
  command: string,
): Promise<void> {
  const jmsConfig = loadJumpServerConfigFromEnv({ envFileHint: DEPLOY_ENV_HINT })
  const target = buildRemoteTarget(options)
  const client = JumpServerClient.fromConfig(jmsConfig)

  console.log(`正在连接 ${target.label} 执行远程命令…`)
  const token = await client.createConnectionToken(target.assetId, jmsConfig.systemUsername)

  try {
    await new Promise<void>((resolve, reject) => {
      const conn = new Client()
      const timer = setTimeout(() => {
        conn.end()
        reject(new Error(`SSH 连接超时（${SSH_READY_TIMEOUT_MS / 1000}s）`))
      }, SSH_READY_TIMEOUT_MS)

      conn.on('error', (err: Error) => {
        clearTimeout(timer)
        conn.end()
        reject(err)
      })

      conn.on('ready', () => {
        clearTimeout(timer)
        conn.exec(command, (err: Error | undefined, stream) => {
          if (err) {
            conn.end()
            reject(err)
            return
          }

          let stderr = ''
          stream.on('data', (data: Buffer) => process.stdout.write(data))
          stream.stderr.on('data', (data: Buffer) => {
            stderr += data.toString()
            process.stderr.write(data)
          })
          stream.on('close', (code: number) => {
            conn.end()
            if (code !== 0) {
              reject(new Error(`远程命令执行失败 (exit ${code})：${stderr || command}`))
              return
            }
            resolve()
          })
        })
      })

      conn.connect({
        host: jmsConfig.host,
        port: jmsConfig.port,
        username: `JMS-${token.id}`,
        password: token.value,
        readyTimeout: SSH_READY_TIMEOUT_MS,
        keepaliveInterval: SSH_KEEPALIVE_INTERVAL_MS,
      })
    })
  }
  finally {
    try {
      await client.expireConnectionToken(token.id)
    }
    catch (error) {
      console.warn(`销毁 Connection Token 失败（${token.id}）：`, error)
    }
  }
}

function requestRollbackAnswer(options: DeployOptions) {
  return new Promise<void>((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const confirmAnswer = options.displayName
    rl.question(`您正准备回滚${options.displayName}，请输入 "${confirmAnswer}" 确认：`, (answer) => {
      rl.close()
      if (answer === confirmAnswer) {
        console.log('验证成功，开始回滚…')
        resolve()
      }
      else {
        console.log('验证码错误，程序退出。')
        reject(new Error('验证码错误，程序退出。'))
      }
    })
  })
}

/** 回滚到 deploy 自动保留的 {name}__rollback 目录 */
export async function rollback(options: DeployOptions): Promise<void> {
  if (options.isProd) {
    await requestRollbackAnswer(options)
  }

  const names = resolveDeployNames(options)
  const rollbackDirName = `${names.releaseName}__rollback`
  const rollbackPath = `${names.remotePath}/${rollbackDirName}`
  const command = buildRollbackCommand(options)

  console.log(`回滚目标：${rollbackPath}`)
  await runRemoteShellCommand(options, command)
  console.log('\x1B[32m%s\x1B[0m', `${options.displayName}回滚完成！`)
  console.log(`\x1B[33m当前线上软链：${names.linkAbs}\x1B[0m`)
  console.log(`\x1B[33m失败版本已移至：${names.remotePath}/${names.releaseName}__bad_*\x1B[0m`)
}

function requestAnswer(options: DeployOptions) {
  return new Promise<void>((resolve, reject) => {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    })
    const confirmAnswer = options.displayName
    rl.question(`您正准备发${options.displayName}环境，请输入 "${confirmAnswer}" 确认（这只是简单的验证，防止不小心执行错命令）：`, (answer) => {
      rl.close()
      if (answer === confirmAnswer) {
        console.log('验证成功，继续执行下一步...')
        resolve()
      }
      else {
        console.log('验证码错误，程序退出。')
        reject(new Error('验证码错误，程序退出。'))
      }
    })
  })
}

export async function deploy(options: DeployOptions): Promise<void> {
  if (options.isProd) {
    await requestAnswer(options)
  }

  const names = resolveDeployNames(options)
  const deployCtx = createDeployContext(names.releaseName)

  writeEcosystemConfig(options, names)
  writeBuildInfo(options, deployCtx, names)

  console.log(`构建版本：${deployCtx.buildCommit} (${deployCtx.buildBranch})`)
  console.log(`远程 release：${deployCtx.stagingDirName}`)
  console.log(`线上软链：${names.linkAbs}`)
  console.log(`PM2 进程：${names.pm2Name}`)
  if (options.nuxtPersistPath) {
    console.log(`_nuxt persist：${toPosix(options.nuxtPersistPath)}（保留 ${NUXT_PERSIST_RETAIN_COUNT} 版 manifest）`)
  }

  console.log('正在打包 .output 资源…')
  const zipBaseName = resolveRemoteZipFilename(options.name, options.remoteZipFilename).replace(/\.zip$/i, '')
  const packages = createSplitZipPackages({
    sourceDir: OUTPUT_DIR,
    isDelayedFile: isDelayedDeployFile,
    assetsZipName: `${zipBaseName}-assets.zip`,
    delayedZipName: `${zipBaseName}-delayed.zip`,
    assetsLabel: `${options.displayName}（资源包）`,
    delayedLabel: `${options.displayName}（HTML）`,
  })

  const jmsConfig = loadJumpServerConfigFromEnv({ envFileHint: DEPLOY_ENV_HINT })
  const deployer = new JumpServerDeployer({
    client: JumpServerClient.fromConfig(jmsConfig),
    jumpServerHost: jmsConfig.host,
    jumpServerPort: jmsConfig.port,
  })

  await deployer.deploy({
    targets: [buildDeployTarget(options, deployCtx)],
    packages,
    systemUsername: jmsConfig.systemUsername,
  })

  const message = options.successMessage ?? `${options.displayName}部署完成！`
  console.log('\x1B[32m%s\x1B[0m', message)

  const rollbackPath = `${names.remotePath}/${names.releaseName}__rollback`
  console.log(`\x1B[33m线上软链：${names.linkAbs} -> ${deployCtx.stagingDirName}\x1B[0m`)
  console.log(`\x1B[33m构建版本：${deployCtx.buildCommit} (${deployCtx.buildBranch})\x1B[0m`)
  console.log(`\x1B[33m上一版已保留至：${rollbackPath}\x1B[0m`)
  console.log(`\x1B[33m快速回滚：pnpx tsx ./scripts/rollback.ts --target=${options.name}\x1B[0m`)

  if (options.afterDeploy) {
    await options.afterDeploy()
  }
}
