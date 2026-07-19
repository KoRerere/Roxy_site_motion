import type { ProjectConfig } from './types'
import chinaDev from './china-dev'
import chinaProd from './china-prod'
import internationalDev from './international-dev'
import internationalProd from './international-prod'
import mobileDev from './mobile-dev'
import mobileProd from './mobile-prod'

export const projects: ProjectConfig[] = [
  internationalDev,
  internationalProd,
  chinaDev,
  chinaProd,
  mobileDev,
  mobileProd,
]
