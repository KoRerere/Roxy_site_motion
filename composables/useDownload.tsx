import { useLocalStorage } from '@vueuse/core'
import { toast } from 'vue-sonner'
import { detectPlatform as __detectPlatform, getOS, Platform } from '@/utils/detect-platform'
import downloadStyle from './useDownload.module.css'

/**
 * 下载相关的 composable
 * 统一管理下载逻辑，包括版本信息获取、平台检测、下载链接生成等
 */

export interface VersionInfo {
  winVersion: string
  winReleaseTime: string
  macVersion: string
  macReleaseTime: string
}

export interface DownloadItem {
  fileName: string
  text: string
  link: string
  class?: string
  effect?: boolean
  platform: Platform
}

export interface PlatformDownload {
  latestVersion: string
  releaseDate: string
  download: DownloadItem[]
  p: string
  icon: string
}

// export type Platform = 'Windows-64' | 'Windows-32' | 'macOS-apple' | 'macOS-intel'

// function detectAppleSilicon() {
//   const canvas = document.createElement('canvas')
//   const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

//   return gl?.getExtension?.('WEBKIT_WEBGL_compressed_texture_pvrtc')
// }

export function useDownload() {
  const { public: { appDownloadUrl, roxyHomeUrl, ENV } } = useRuntimeConfig()
  const { $t, locale } = useRxI18n()
  const route = useRoute()
  const localePath = useLocalePath()

  const isDev = ENV === 'development'
  // 默认版本信息
  const defaultReleaseTime = '--'
  const defaultVersion = '--'

  // 版本信息状态
  const versionInfo = reactive<VersionInfo>({
    winReleaseTime: defaultReleaseTime,
    winVersion: defaultVersion,
    macReleaseTime: defaultReleaseTime,
    macVersion: defaultVersion,
  })

  // 下载参数
  const roxy_partner = ref('')
  const code = ref('')
  const landingPage = ref('')
  const source = ref('')
  const conversionPage = ref('')
  const visitorId = useLocalStorage('visitorId', '')

  // 下载代码后缀
  const downloadUrlSuffix = computed(() => {
    return `-H-${code.value || ''}__${visitorId.value || ''}`
  })

  /** 下载文案 */
  // const downloadText = computed(() => {
  //   const os = getOS()
  //   const isPc = os === 'Windows' || os === 'macOS' || os === 'Linux'

  //   if (isPc) {
  //     return $t('下载 {os} 版本', { os })
  //   }

  //   return $t('下载 RoxyBrowser')
  // })

  // Fix: Hydration
  const downloadText = ref($t('下载 RoxyBrowser'))
  onMounted(() => {
    const os = getOS()
    const isPc = os === 'Windows' || os === 'macOS' || os === 'Linux'
    if (isPc) {
      downloadText.value = $t('下载 {os} 版本', { os })
    }
  })

  /** 下载图标 */
  const downloadIcon = computed(() => {
    const os = getOS()

    if (os === 'Windows') {
      return 'base/rx_site_os_windows'
    }

    if (os === 'macOS') {
      return 'base/rx_site_os_macOS'
    }

    if (os === 'Linux') {
      return 'base/rx_site_os_Linux'
    }

    return 'base/rx_ic_download'
  })

  /**
   * 从 sessionStorage 加载下载参数
   */
  const loadDownloadParams = () => {
    roxy_partner.value = sessionStorage.getItem('roxy_partner') || ''
    code.value = localStorage.getItem('code') || ''
    landingPage.value = sessionStorage.getItem('landingPage') || window.$landingPage || ''
    source.value = sessionStorage.getItem('source') || window.$source || ''
  }

  /**
   * 获取版本信息
   */
  const fetchVersionInfo = async (): Promise<void> => {
    try {
      const result = await fetch(`${roxyHomeUrl}/app_statistics/get_official_website_version_data_config`)
      if (result.ok) {
        const data = await result.json()
        if (data.code === 0 && data.data) {
          versionInfo.winReleaseTime = data.data?.winReleaseTime || defaultReleaseTime
          versionInfo.winVersion = data.data?.winVersion || defaultVersion
          versionInfo.macReleaseTime = data.data?.macReleaseTime || defaultReleaseTime
          versionInfo.macVersion = data.data?.macVersion || defaultVersion
        }
      }
    }
    catch (error) {
      console.warn('获取版本信息失败:', error)
    }
  }

  /** 用户行为追踪事件 */
  const trackUserBehavior = async (platform: Platform) => {
    const time = Number.parseInt(String(Date.now() / 1000))

    const params = {
      uuid: visitorId.value + String(time), // 用户唯一标识
      language: locale.value, // 用户语言，例如en, zh, ru
      landingPagePath: landingPage.value, // 落地页
      conversionPagePath: conversionPage.value, // 转化页
      channelSourceUrl: source.value, // 渠道来源的完整URL
      operatingSystem: platform.split('-')[0], // 操作系统
      // 事件类型 'download_click':下载, 'install_complete'：安装完整, 'app_open'：打开APP, 'registration_complete'：注册完成
      eventType: 'download_click',
    }
    await fetch(`${roxyHomeUrl}/app_tracking_event`, {
      method: 'POST',
      body: JSON.stringify(params),
      headers: {
        'Content-Type': 'application/json',
      },
    })
  }

  /**
   * 生成下载文件名
   */
  const generateFileName = (platform: string, arch: string, version: string, releaseTime: string): string => {
    const formattedDate = releaseTime.replace(/\//g, '_')

    if (platform === 'Windows') {
      const archSuffix = arch === '64' ? 'x64' : 'x86'
      return `RoxyBrowser_${archSuffix}_${version}_${formattedDate}${downloadUrlSuffix.value}.exe`
    }
    else if (platform === 'macOS') {
      const archSuffix = arch === 'apple' ? 'apple' : 'intel'
      return `RoxyBrowser_${archSuffix}_${version}_${formattedDate}${downloadUrlSuffix.value}.pkg`
    }
    else if (platform === 'Linux') {
      return `RoxyBrowser_${arch}_${version}_${formattedDate}${downloadUrlSuffix.value}.deb`
    }

    return ''
  }

  /**
   * 生成下载链接
   */
  const generateDownloadLink = (platform: Platform, version: string): string => {
    const baseUrl = `${appDownloadUrl}/app-download/${platform}-latest`
    const time = Number.parseInt(String(Date.now() / 1000))
    const params = new URLSearchParams({
      'roxy-partner': roxy_partner.value,
      'code': code.value,
      'visitorId': visitorId.value + String(time),
      'version': version,
      'downloadInfo': JSON.stringify({
        conversionPage: conversionPage.value, // 转化页
        landingPage: landingPage.value, // 落地页
        source: source.value, // 渠道来源
        language: locale.value,
        os: platform,
      }),
    })
    return `${baseUrl}?${params.toString()}`
  }

  /**
   * 获取所有平台的下载信息
   */
  const getDownloadVersions = computed((): PlatformDownload[] => {
    return [
      {
        latestVersion: $t('最新版本：{version}', { version: versionInfo.winVersion }),
        releaseDate: $t('发布日期：{date}', { date: versionInfo.winReleaseTime }),
        download: [
          {
            class: downloadStyle['window-64'],
            fileName: generateFileName('Windows', '64', versionInfo.winVersion, versionInfo.winReleaseTime),
            text: $t('Windows 64 位版本'),
            link: generateDownloadLink(Platform.Windows64, versionInfo.winVersion),
            effect: true,
            platform: Platform.Windows64,
            icon: 'base/rx_site_os_windows',
          },
          {
            class: downloadStyle.outlined,
            fileName: generateFileName('Windows', '32', versionInfo.winVersion, versionInfo.winReleaseTime),
            text: $t('Windows 32 位版本'),
            link: generateDownloadLink(Platform.Windows32, versionInfo.winVersion),
            platform: Platform.Windows32,
            icon: 'base/rx_site_os_windows',
          },
        ],
        p: $t('最低版本要求：\nWindows 10 或更高版本。'),
        icon: '/download/os_windows.svg',
      },
      {
        latestVersion: $t('最新版本：{version}', { version: versionInfo.macVersion }),
        releaseDate: $t('发布日期：{date}', { date: versionInfo.macReleaseTime }),
        download: [
          {
            class: downloadStyle['apple-silicon'],
            fileName: generateFileName('macOS', 'apple', versionInfo.macVersion, versionInfo.macReleaseTime),
            text: $t('macOS (Apple 芯片)'),
            link: generateDownloadLink(Platform.macOSApple, versionInfo.macVersion),
            platform: Platform.macOSApple,
            icon: 'base/rx_site_os_macOS',
          },
          {
            class: downloadStyle.outlined,
            fileName: generateFileName('macOS', 'intel', versionInfo.macVersion, versionInfo.macReleaseTime),
            text: $t('macOS (Intel 芯片)'),
            link: generateDownloadLink(Platform.macOSIntel, versionInfo.macVersion),
            platform: Platform.macOSIntel,
            icon: 'base/rx_site_os_macOS',
          },
        ],
        p: $t('最低版本要求：\nmacOS 12 Monterey 或更高版本。'),
        icon: '/download/os_macOS.svg',
      },
      {
        latestVersion: $t('最新版本：{version}', { version: versionInfo.winVersion }),
        releaseDate: $t('发布日期：{date}', { date: versionInfo.winReleaseTime }),
        download: [
          {
            class: downloadStyle.outlined,
            fileName: generateFileName('Linux', '64', versionInfo.winVersion, versionInfo.winReleaseTime),
            text: $t('Linux(64 位版本)'),
            link: generateDownloadLink(Platform.Linux64, versionInfo.winVersion),
            platform: Platform.Linux64,
            icon: 'base/rx_site_os_Linux',
          },
        ],
        p: $t('最低版本要求：\nLinux (Ubuntu Desktop 22.04) 或更高版本。'),
        icon: '/download/os_linux.svg',
      },
    ]
  })

  /**
   * 检测用户平台
   */
  const detectPlatform = async (): Promise<Platform | null> => {
    if (typeof window === 'undefined')
      return null

    return __detectPlatform()
  }

  function detectMobile() {
    const isTouch = ('ontouchstart' in window) || navigator.maxTouchPoints > 0

    const ua = navigator.userAgent.toLowerCase()
    const isMobileUA = /iphone|ipod|android.*mobile|windows.*phone|blackberry.*mobile/i.test(ua)

    // 如果是触摸设备或者 UA 含移动关键字
    return isTouch || isMobileUA
  }

  /**
   * 根据平台获取对应的下载信息
   */
  const getDownloadInfoByPlatform = (platform: Platform) => {
    const downloads = getDownloadVersions.value

    if (platform.startsWith('Windows')) {
      const windowsDownload = downloads[0]
      const arch = platform === Platform.Windows64 ? 0 : 1
      return windowsDownload.download[arch]
    }
    else if (platform.startsWith('macOS')) {
      const macDownload = downloads[1]
      const arch = platform === Platform.macOSApple ? 0 : 1
      return macDownload.download[arch]
    }
    else if (platform.startsWith('Linux')) {
      const linuxDownload = downloads[2]
      return linuxDownload.download[0]
    }

    return null
  }

  /**
   * 检查是否达到下载限制，如果没有达到则返回 true，否则返回 false
   */
  const checkDownloadLimit = async (): Promise<boolean> => {
    const checkUrl = `${roxyHomeUrl}/app_statistics/check_ip_download_limit`

    try {
      const { code, msg } = await fetch(checkUrl, {
        headers: {
          language: locale.value === 'zh' ? 'zh-CN' : locale.value,
        },
      })
        .then(res => res.json())

      if (code !== 0) {
        console.warn('下载限制', msg)
        toast.error(msg)
        return false
      }
      else {
        return true
      }
    }
    catch (error) {
      console.warn('下载限制检查失败:', error)
      return true
    }
  }

  /**
   * 下载指定的平台
   */
  const downloadPlatform = async (platform: Platform) => {
    const isDownloadLimit = await checkDownloadLimit()
    if (!isDownloadLimit) {
      return
    }

    const downloadInfo = getDownloadInfoByPlatform(platform)

    if (!downloadInfo) {
      console.warn('无法获取下载信息')
      return
    }

    trackUserBehavior(platform)

    const link = document.createElement('a')
    link.href = downloadInfo.link
    link.download = downloadInfo.fileName
    // link.target = '_blank'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * 触发自动下载
   */
  const triggerAutoDownload = async (): Promise<void> => {
    const platform = await detectPlatform()
    if (!platform) {
      console.warn('无法检测到支持的平台')
      return
    }

    await downloadPlatform(platform)
    // const isDownloadLimit = await checkDownloadLimit()
    // if (!isDownloadLimit) {
    //   return
    // }

    // const downloadInfo = getDownloadInfoByPlatform(platform)

    // if (!downloadInfo) {
    //   console.warn('无法获取下载信息')
    //   return
    // }

    // trackUserBehavior(platform)

    // const link = document.createElement('a')
    // link.href = downloadInfo.link
    // link.download = downloadInfo.fileName
    // // link.target = '_blank'
    // link.style.display = 'none'
    // document.body.appendChild(link)
    // link.click()
    // document.body.removeChild(link)
  }

  /**
   * 初始化下载相关数据
   */
  const initializeDownload = async () => {
    if (detectMobile() && !route.name?.includes?.('download')) {
      navigateTo(localePath('/download'))
      return Promise.reject(new Error('skip download for mobile device'))
    }

    conversionPage.value = location.pathname
    loadDownloadParams()
    if (!visitorId.value) {
      const fp = await getFingerprint()
      const result = await fp.get()
      visitorId.value = result.visitorId
    }
    await fetchVersionInfo()
    await nextTick()
  }

  return {
    versionInfo: readonly(versionInfo),
    roxy_partner: readonly(roxy_partner),
    code: readonly(code),
    downloadUrlSuffix,
    downloadText,
    downloadIcon,
    getDownloadVersions,
    fetchVersionInfo,
    generateFileName,
    generateDownloadLink,
    detectPlatform,
    detectMobile,
    getDownloadInfoByPlatform,
    triggerAutoDownload,
    initializeDownload,
    checkDownloadLimit,
    downloadPlatform,
  }
}
