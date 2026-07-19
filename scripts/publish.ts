import type { ProjectConfig, ProjectEnv } from './project-config/index'
import { spawnSync } from 'node:child_process'
import process from 'node:process'
import { cancel, intro, isCancel, outro, select } from '@clack/prompts'
import { deploy } from './deploy-util'
import { loadProjects } from './project-config/index'
import { createTimer, formatDuration } from './publish-util'

const ENV_GROUP: Record<ProjectEnv, string> = {
  test: '测试环境',
  prod: '生产环境',
}

const ENV_ORDER: ProjectEnv[] = ['test', 'prod']

function buildProjectSelectOptions(candidates: ProjectConfig[]) {
  const envs = ENV_ORDER.filter(env => candidates.some(p => p.env === env))
  const showGroups = envs.length > 1
  const options: Array<{ value: string, label: string, disabled?: boolean }> = []

  for (const env of envs) {
    if (showGroups) {
      options.push({
        value: `__group__${env}`,
        label: ENV_GROUP[env],
        disabled: true,
      })
    }
    for (const p of candidates.filter(c => c.env === env)) {
      options.push({
        value: p.name,
        label: `${showGroups ? '  ' : ''}${p.displayName}(${p.name}) ${p.siteUrl ? `${p.siteUrl}` : ''}`,
      })
    }
  }

  return options
}

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`
  const arg = process.argv.slice(2).find(a => a.startsWith(prefix))
  return arg?.slice(prefix.length)
}

function parseList(value: string | undefined): string[] | undefined {
  if (!value)
    return undefined
  return value.split(',').map(s => s.trim()).filter(Boolean)
}

function filterProjects(
  projects: ProjectConfig[],
  envs?: ProjectEnv[],
  targets?: string[],
): ProjectConfig[] {
  let result = projects

  if (envs?.length)
    result = result.filter(p => envs.includes(p.env))

  if (targets?.length) {
    result = targets
      .map(name => result.find(p => p.name === name || p.id === name))
      .filter((p): p is ProjectConfig => p != null)
  }

  return result
}

async function selectProject(candidates: ProjectConfig[]): Promise<ProjectConfig> {
  if (candidates.length === 1)
    return candidates[0]!

  const choice = await select({
    message: '选择要发布的目标',
    options: buildProjectSelectOptions(candidates),
  })

  if (isCancel(choice)) {
    cancel('已取消')
    process.exit(0)
  }

  const project = candidates.find(p => p.name === choice)
  if (!project)
    throw new Error(`无效选择: ${choice}`)

  return project
}

function runBuild(buildScript: string): void {
  console.log(`\x1B[34m开始构建: pnpm run ${buildScript}\x1B[0m`)
  const result = spawnSync('pnpm', ['run', buildScript], {
    stdio: 'inherit',
    shell: true,
  })
  if (result.status !== 0)
    throw new Error(`构建失败: pnpm run ${buildScript}，退出码 ${result.status ?? 'unknown'}`)
}

async function main() {
  const envList = parseList(parseArg('env')) as ProjectEnv[] | undefined
  const targetList = parseList(parseArg('target'))
  const hasTargetArg = process.argv.slice(2).some(a => a.startsWith('--target='))

  intro('publish')

  const projects = loadProjects()
  if (projects.length === 0) {
    console.error('\x1B[31m未找到任何项目配置\x1B[0m')
    process.exit(1)
  }

  const candidates = filterProjects(projects, envList, hasTargetArg ? targetList : undefined)

  if (candidates.length === 0) {
    console.error('\x1B[31m没有匹配的项目，请检查 --env / --target 参数\x1B[0m')
    process.exit(1)
  }

  let selected: ProjectConfig[]

  if (hasTargetArg) {
    selected = candidates
  }
  else if (candidates.length === 1) {
    selected = candidates
  }
  else {
    const project = await selectProject(candidates)
    selected = [project]
  }

  console.log(`\x1B[36m发布目标: ${selected.map(p => `${p.displayName}(${p.name})`).join(', ')}\x1B[0m`)

  const totalTimer = createTimer()
  let buildDurationMs = 0
  let deployDurationMs = 0

  const buildScripts = [...new Set(selected.map(p => p.buildScript))]
  const buildTimer = createTimer()
  for (const buildScript of buildScripts)
    runBuild(buildScript)
  buildDurationMs = buildTimer.elapsed()
  console.log(`\x1B[32m构建花费时间 ${formatDuration(buildDurationMs)}\x1B[0m`)

  const deployTimer = createTimer()
  for (const project of selected) {
    console.log(`\x1B[34m开始部署: ${project.displayName}(${project.name})\x1B[0m`)
    await deploy(project)
    console.log(`\x1B[32m${project.displayName}(${project.name}) ${project.siteUrl ? ` 前往 ${project.siteUrl} 查看` : ''}\x1B[0m`)
  }
  deployDurationMs = deployTimer.elapsed()

  const totalMs = totalTimer.elapsed()
  console.log()
  outro([
    `Build time: ${formatDuration(buildDurationMs)}`,
    `Deploy time: ${formatDuration(deployDurationMs)}`,
    `Total time: ${formatDuration(totalMs)}`,
  ].join('\n'))
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
