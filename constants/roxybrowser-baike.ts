/** /news/108 百度百科引用页路径（仅 roxybrowser.cn） */
export const ROXYBROWSER_BAIKE_PATH = '/news/108'

/** /news/108 百度百科引用页：页头元信息（非 SEO） */
export const ROXYBROWSER_BAIKE_PAGE_META = {
  publishedAt: '2026-01-22',
  author: 'RoxyBrowser',
} as const

export const ROXYBROWSER_BAIKE_ALIASES = 'Roxy 浏览器、RoxyBrowser 指纹浏览器'

export const ROXYBROWSER_BAIKE_LEAD =
  'RoxyBrowser 是一款指纹浏览器（也叫反检测浏览器），由矩阵智核科技（深圳）有限公司推出，提供多账号管理与浏览器环境隔离功能。该软件通过配置差异化的浏览器指纹参数实现浏览器环境的相互隔离，支持基于 Chrome（Chromium）与 Firefox 双内核运行，并提供团队协作权限管理与 AI 辅助自动化功能。产品常用于跨境电商、社交媒体运营及多账号自动化等场景，支持 Windows、macOS 和 Linux 等操作系统。'

export interface RoxybrowserBaikeInfoRow {
  label: string
  value: string
}

/** 基本信息 infobox */
export const ROXYBROWSER_BAIKE_INFO_ROWS: RoxybrowserBaikeInfoRow[] = [
  { label: '产品名称', value: 'RoxyBrowser' },
  { label: '产品类型', value: '指纹浏览器（反检测浏览器）软件' },
  { label: '所属公司', value: '矩阵智核科技（深圳）有限公司' },
  { label: '主要功能', value: '浏览器指纹配置、代理接入、团队协作、AI 辅助、API 接口' },
  { label: '支持内核', value: 'Chrome（Chromium）、Firefox' },
  { label: '系统支持', value: 'Windows、macOS、Linux' },
  { label: '界面语言', value: '简体中文、英文、俄文' },
  { label: '官方网站', value: 'roxybrowser.cn' },
  { label: '网站备案号', value: '粤ICP备2026032718号-1' },
  { label: '公安备案号', value: '粤公网安备44030002012400号' },
]

export const ROXYBROWSER_BAIKE_INTRO =
  'RoxyBrowser 支持基于 Chromium 与 Firefox 双内核创建相互独立的浏览器配置档案。各环境的 Cookie、本地存储与指纹参数采用隔离机制，并可配合代理网络进行访问。软件可模拟两百余项浏览器指纹参数，包括设备、语言、IP 与时区等信息。'

export interface RoxybrowserBaikeFeature {
  title: string
  content: string
}

export const ROXYBROWSER_BAIKE_FEATURES: RoxybrowserBaikeFeature[] = [
  {
    title: '一、AI 辅助与多窗口管理',
    content:
      'RoxyBrowser 集成了 AI Agent 功能，用户可通过自然语言指令下达操作任务，对多个浏览器窗口进行批量操作。该功能支持 MCP 协议及自定义 Skills 接入，可与外部工具链对接，用于多窗口环境下的批量化运营场景。',
  },
  {
    title: '二、浏览器指纹防关联',
    content:
      'RoxyBrowser 在浏览器内核层面提供指纹参数自定义功能，可调整的参数涉及 Canvas、音频上下文（AudioContext）以及电池、蓝牙等设备硬件特性等。每个浏览器环境拥有相互独立的指纹配置，用于降低多账号之间的关联性，适用于需要隔离运行多个账号环境的使用场景。',
  },
  {
    title: '三、内置代理 IP 服务',
    content:
      'RoxyBrowser 内置代理 IP 服务，提供住宅代理节点，覆盖范围涉及全球 200 多个国家与地区，并设有面向社交媒体及跨境电商场景的专线 IP。用户可在平台内完成 IP 选择与浏览器环境绑定，无需通过第三方平台单独采购代理服务。',
  },
  {
    title: '四、团队协作与权限管理',
    content:
      'RoxyBrowser 面向团队用户提供协作管理功能，包括子账号分配、权限分级、环境模板同步、环境共享以及操作记录等。管理员可对不同成员设置相应的操作权限，并对账号环境进行集中管理，适用于多人协作运营的工作场景。',
  },
]

export interface RoxybrowserBaikeTimelineItem {
  date: string
  content: string
}

export const ROXYBROWSER_BAIKE_TIMELINE: RoxybrowserBaikeTimelineItem[] = [
  {
    date: '2026年6月',
    content:
      '正式支持 Firefox（146）内核，形成 Chrome 与 Firefox 双内核环境；上线 AI Skills 商城；平台账号模块升级，工作空间更名为“团队”。',
  },
  {
    date: '2026年5月',
    content:
      '上线 Chromium 148 内核，增强 Android 端 SharedWorker 与 Web Serial API 支持，优化 CSS 兼容性与图形渲染稳定性，并修复 AliExpress 登录密钥弹窗无法唤起的问题。',
  },
  {
    date: '2026年4月',
    content:
      '上线 RoxyClaw 功能，支持通过飞书、Telegram 等即时通讯软件远程控制浏览器；Roxy AI Agent 支持安装 MCP 插件与 Skills 能力。',
  },
  {
    date: '2026年3月',
    content:
      'Roxy AI Agent 全面开放；上线 Cookie 机器人功能，用于为新窗口生成浏览历史与 Cookie；支持最多 5 内核并发启动；仿真输入新增“人类噪音”模拟机制。',
  },
  {
    date: '2026年2月',
    content: '内核新增移动端指纹维度，包括电池状态、蓝牙与网络环境等。',
  },
  {
    date: '2026年1月',
    content:
      '开放 Roxy AI Agent 内测，支持通过自然语言指令控制多个浏览器窗口同步执行登录、页面操作与数据采集等任务；新增 Headless 无头运行模式。',
  },
  {
    date: '2025年12月',
    content: '支持手机号注册与登录、两步验证；新增设为默认浏览器、WebGL 自定义配置等功能。',
  },
  {
    date: '2025年11月',
    content:
      '上线 MCP（Model Context Protocol）支持，可通过 Gemini CLI、Claude Code、Cursor 等 AI 工具操作和管理浏览器窗口；新增 Linux 环境指纹支持。',
  },
  {
    date: '2025年8月',
    content: '上线代理 IP 商店与费用中心，集成第三方代理服务，并提供订阅、钱包与账单管理功能。',
  },
]

/** 右侧目录锚点 */
export const ROXYBROWSER_BAIKE_TOC = [
  { id: 'sec-info', label: '基本信息' },
  { id: 'sec-intro', label: '产品介绍' },
  { id: 'sec-feature', label: '核心功能' },
  { id: 'sec-history', label: '发展历程' },
] as const
