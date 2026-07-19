import type { ProjectConfig } from './types'
import { projects } from './registry'

function assertProjectConfig(config: unknown, id: string): asserts config is ProjectConfig {
  if (!config || typeof config !== 'object')
    throw new Error(`[project-config] ${id} 未导出有效配置`)

  const c = config as Partial<ProjectConfig>
  const missing = ['name', 'displayName', 'env', 'buildScript', 'jmsLabel', 'jmsAssetIdEnv'].filter(k => c[k as keyof ProjectConfig] == null)
  if (missing.length > 0)
    throw new Error(`[project-config] ${id} 缺少字段: ${missing.join(', ')}`)

  if (c.env !== 'test' && c.env !== 'prod')
    throw new Error(`[project-config] ${id} env 必须为 test 或 prod`)
}

export function loadProjects(): ProjectConfig[] {
  for (const project of projects)
    assertProjectConfig(project, `${project.displayName}(${project.name})`)
  return [...projects]
}

export { projects } from './registry'
export type { DeployOptions, ProjectConfig, ProjectEnv } from './types'
