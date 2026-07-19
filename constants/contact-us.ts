import businessQrcode from '@/assets/images/contact-us/wx_buessness_qrcode.png?url'
import internationalBusinessQrcode from '@/assets/images/contact-us/fs_buessness_qrcode.png?url'
import wechatQrcode from '@/assets/images/contact-us/wx_gongzonghao_qrcode.png?url'

/** Contact Us 页静态数据（社媒链复用 footer，Discord 待补资源） */

/** 各语言 URL 后缀一致；中文 canonical / hreflang 指向独立域名 .cn */
export const CONTACT_US_PATH = '/contact-us'

/** Banner 卡片与下方各模块 PC 内容区统一宽度（Figma 1062px，与 banner.vue 一致） */
export const CONTACT_US_CONTENT_WIDTH = 1062

/** Banner 与各内容模块、模块之间的垂直间距（Figma 100px） */
export const CONTACT_US_SECTION_GAP = 100

export interface ContactUsSocialItem {
  id: string
  name: string
  link: string
  icon?: string
  /** 无 icon 时渲染占位块 */
  placeholder?: boolean
  /** footer 白色 SVG 需反色；彩色图标设为 false */
  invertIcon?: boolean
  /** RxIcon 名称（assets/svgs），优先于 icon 公网路径 */
  rxIcon?: string
  /** 无外链时禁用点击（仍正常展示图标） */
  disabled?: boolean
  /** 鼠标悬停展示二维码（仅配置项生效） */
  qrcodeOnHover?: {
    labelKey: string
    /** 静态二维码图；可被 API 覆盖 */
    src?: string
    /** get_qrcode_info 返回的 type 字段（如 wechat / youtube） */
    apiType?: string
  }
  /** 鼠标悬停展示纯文字提示 */
  hoverTipKey?: string
}

/** 英文 / 俄文：6 个社媒；图标 assets/svgs/contact-us/ic-*.svg */
export const CONTACT_US_SOCIAL_INTERNATIONAL: ContactUsSocialItem[] = [
  {
    id: 'youtube',
    name: 'Youtube',
    link: 'https://www.youtube.com/@RoxyBrowser',
    rxIcon: 'contact-us/ic-youtube',
    invertIcon: false,
  },
  {
    id: 'facebook',
    name: 'Facebook',
    link: 'https://www.facebook.com/roxybrowser/',
    rxIcon: 'contact-us/ic-Facebook',
    invertIcon: false,
  },
  {
    id: 'instagram',
    name: 'Instagram',
    link: 'https://instagram.com/RoxyBrowser',
    rxIcon: 'contact-us/ic-instagram',
    invertIcon: false,
  },
  {
    id: 'tiktok',
    name: 'TikTok',
    link: 'https://tiktok.com/@RoxyBrowser',
    rxIcon: 'contact-us/ic-tiktok',
    invertIcon: false,
  },
  {
    id: 'x',
    name: 'X',
    link: 'https://x.com/RoxyBrowser',
    rxIcon: 'contact-us/ic_site_x',
    invertIcon: false,
  },
  {
    id: 'discord',
    name: 'Discord',
    link: '#',
    rxIcon: 'contact-us/ic-discord',
    invertIcon: false,
    /** Discord 邀请链接待确认 */
    disabled: true,
  },
]

/**
 * 中文站 Follow Us：微信 → 小红书 → 哔哩哔哩（顺序固定）
 * 图标：assets/svgs/contact-us/ic-*.svg
 */
export const CONTACT_US_SOCIAL_ZH: ContactUsSocialItem[] = [
  {
    id: 'wechat',
    name: '微信',
    link: '#',
    rxIcon: 'contact-us/ic-wechat',
    invertIcon: false,
    qrcodeOnHover: {
      labelKey: 'contactUs.follow微信二维码',
      src: wechatQrcode,
      apiType: 'wechat',
    },
  },
  {
    id: 'redbook',
    name: '小红书',
    link: 'https://xhslink.com/m/8YD98XWAWg2',
    rxIcon: 'contact-us/ic-redBook',
    invertIcon: false,
    hoverTipKey: 'contactUs.follow点击关注小红书',
  },
  {
    id: 'bilibili',
    name: '哔哩哔哩',
    link: 'https://b23.tv/17Z3pOL',
    rxIcon: 'contact-us/ic-bilibili',
    invertIcon: false,
    hoverTipKey: 'contactUs.follow点击关注哔哩哔哩',
  },
]

export const CONTACT_US_COMPANY_INTERNATIONAL = {
  name: 'LINKV TECH PTE. LTD.',
  address: '20 Cecil Street, #14-00 & #15-00, PLUS Building, Singapore 049705',
  telephone: '+447745818521',
  customerServiceEmail: 'support@roxybrowser.com',
} as const

export const CONTACT_US_COMPANY_ZH = {
  name: '矩阵智核科技（深圳）有限公司',
  address: '深圳市福田区沙头街道天安社区深南大道6033号金运世纪大厦12A',
  telephone: '0755-28394012',
  customerServiceEmail: 'support@roxybrowser.com',
} as const

/** Join Us 卡片类型：二维码展示 / Telegram 外链 */
export type ContactUsJoinItemType = 'qrcode' | 'telegram'

export interface ContactUsJoinItem {
  id: string
  labelKey: string
  type: ContactUsJoinItemType
  /** 卡片主图（public 路径） */
  imageSrc: string
}

/** Join Us：商务微信码、Telegram 群、公众号运营码（与 footer-cn-social 资源一致） */
export const CONTACT_US_JOIN_ITEMS: ContactUsJoinItem[] = [
  {
    id: 'business',
    labelKey: 'contactUs.join商务合作',
    type: 'qrcode',
    imageSrc: businessQrcode,
  },
  {
    id: 'telegram',
    labelKey: 'contactUs.joinTelegram用户群',
    type: 'telegram',
    imageSrc: '/home/rx_ic_telegram2.svg',
  },
  {
    id: 'operation',
    labelKey: 'contactUs.join运营',
    type: 'qrcode',
    imageSrc: wechatQrcode,
  },
]

export const CONTACT_US_JOIN_ITEMS_INTERNATIONAL: ContactUsJoinItem[] = [
  {
    id: 'business',
    labelKey: 'contactUs.join商务合作',
    type: 'qrcode',
    imageSrc: internationalBusinessQrcode,
  },
  {
    id: 'telegram',
    labelKey: 'contactUs.joinTelegram用户群',
    type: 'telegram',
    imageSrc: '/home/rx_ic_telegram2.svg',
  },
  {
    id: 'operation',
    labelKey: 'contactUs.join运营',
    type: 'qrcode',
    imageSrc: wechatQrcode,
  },
]

/** 各模块内容区高度（不含 padding，与 Figma 标注一致） */
export const CONTACT_US_MODULE_HEIGHT = {
  /** PC 背景图层高度 420px；内容区标注 556px */
  banner: { mobile: 498, pc: 556, pcBg: 420 },
  about: { mobile: 404, pc: 216 },
  company: { mobile: 798, pc: 348 },
  follow: { mobile: 285, pc: 70 },
  join: { mobile: 1239, pc: 381 },
} as const
