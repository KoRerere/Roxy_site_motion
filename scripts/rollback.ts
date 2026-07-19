import type { ProjectConfig } from './project-config/types'
import process from 'node:process'
import { rollback } from './deploy-util'
import { loadProjects } from './project-config/index'

function parseArg(name: string): string | undefined {
  const prefix = `--${name}=`
  const arg = process.argv.slice(2).find(a => a.startsWith(prefix))
  return arg?.slice(prefix.length)
}

function findProject(target: string, projects: ProjectConfig[]): ProjectConfig | undefined {
  return projects.find(p => p.id === target || p.name === target)
}

function printHelp(projects: ProjectConfig[]) {
  console.log('用法: pnpx tsx ./scripts/rollback.ts --target=<项目 id 或 PM2 name>\n')
  console.log('将线上目录切换为 deploy 保留的 {name}__rollback 上一版。\n')
  console.log('可用目标:')
  for (const p of projects) {
    console.log(`  --target=${p.name}  ${p.displayName} (${p.id})`)
  }
}

const target = parseArg('target')
const projects = loadProjects()

if (!target) {
  printHelp(projects)
  process.exit(1)
}

const project = findProject(target, projects)
if (!project) {
  console.error(`未找到回滚目标: ${target}\n`)
  printHelp(projects)
  process.exit(1)
}

await rollback(project)
