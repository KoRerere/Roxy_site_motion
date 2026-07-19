import type { ProjectConfig } from './project-config/types'
import process from 'node:process'
import { fixDeploySymlink } from './deploy-util'
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
  console.log('用法: pnpx tsx ./scripts/fix-deploy-symlink.ts --target=<项目 id 或 PM2 name> [--staging=<__deploy_ 目录名>]\n')
  console.log('将远程遗留实体目录改为软链（指向最新或指定的 __deploy_* release）。\n')
  console.log('可用目标:')
  for (const p of projects) {
    console.log(`  --target=${p.name}  ${p.displayName} (${p.id})`)
  }
}

const target = parseArg('target')
const staging = parseArg('staging')
const projects = loadProjects()

if (!target) {
  printHelp(projects)
  process.exit(1)
}

const project = findProject(target, projects)
if (!project) {
  console.error(`未找到目标: ${target}\n`)
  printHelp(projects)
  process.exit(1)
}

await fixDeploySymlink(project, staging)
