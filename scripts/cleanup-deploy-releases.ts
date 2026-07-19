import type { ProjectConfig } from './project-config/types'
import process from 'node:process'
import { cleanupDeployReleases } from './deploy-util'
import { loadProjects } from './project-config/index'

/** 测试机三应用同机，一次 SSH 批量清理 */
const TEST_SERVER_TARGETS = ['roxy_home_dev', 'roxy_home_cn_dev', 'roxy_home_m_dev'] as const

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`
  const arg = process.argv.slice(2).find(a => a.startsWith(prefix))
  return arg?.slice(prefix.length)
}

function hasFlag(name: string): boolean {
  return process.argv.slice(2).includes(`--${name}`)
}

function findProject(target: string, projects: ProjectConfig[]): ProjectConfig | undefined {
  return projects.find(p => p.id === target || p.name === target)
}

function printHelp(projects: ProjectConfig[]) {
  console.log('用法: pnpx tsx ./scripts/cleanup-deploy-releases.ts [--target=<项目 name>] [--all-test]\n')
  console.log('远程删除多余 __deploy_*、__bad_*、__old_* 与上传 zip；保留当前软链 release 与 __rollback。\n')
  console.log('示例:')
  console.log('  --target=roxy_home_dev          清理单个应用')
  console.log('  --all-test                      清理测试机三应用（一次 SSH）\n')
  console.log('可用目标:')
  for (const p of projects) {
    console.log(`  --target=${p.name}  ${p.displayName} (${p.id})`)
  }
}

const target = parseArg('target')
const allTest = hasFlag('all-test')
const projects = loadProjects()

if (!target && !allTest) {
  printHelp(projects)
  process.exit(1)
}

if (target && allTest) {
  console.error('请只指定 --target 或 --all-test 之一。\n')
  printHelp(projects)
  process.exit(1)
}

const selected = allTest
  ? TEST_SERVER_TARGETS.map(name => findProject(name, projects)).filter((p): p is ProjectConfig => !!p)
  : [findProject(target!, projects)].filter((p): p is ProjectConfig => !!p)

if (selected.length === 0) {
  console.error(`未找到目标: ${target ?? TEST_SERVER_TARGETS.join(', ')}\n`)
  printHelp(projects)
  process.exit(1)
}

if (allTest && selected.length !== TEST_SERVER_TARGETS.length) {
  console.error('测试机目标配置不完整，请检查 project-config。\n')
  process.exit(1)
}

await cleanupDeployReleases(allTest ? selected : selected[0])
