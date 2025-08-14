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
}

export interface PlatformDownload {
  latestVersion: string
  releaseDate: string
  download: DownloadItem[]
  p: string
  icon: string
}

export type Platform = 'Windows-64' | 'Windows-32' | 'macOS-apple' | 'macOS-intel'

export const useDownload = () => {
  const { public: { appDownloadUrl, roxyHomeUrl } } = useRuntimeConfig()
  const { $t, locale } = useRxI18n()

  // 默认版本信息
  const defaultReleaseTime = '2025/05/30'
  const defaultVersion = '3.4.9'

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

  // 下载代码后缀
  const downloadCode = computed(() => code.value ? `-H-${code.value}` : '')

  /**
   * 从 sessionStorage 加载下载参数
   */
  const loadDownloadParams = () => {
    roxy_partner.value = sessionStorage.getItem('roxy_partner') || ''
    code.value = sessionStorage.getItem('code') || ''
    landingPage.value = sessionStorage.getItem("landingPage") || window.$landingPage || ''
    source.value = sessionStorage.getItem("source") || window.$source || ''
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
    } catch (error) {
      console.warn('获取版本信息失败:', error)
    }
  }

  /**
   * 生成下载文件名
   */
  const generateFileName = (platform: string, arch: string, version: string, releaseTime: string): string => {
    const formattedDate = releaseTime.replace(/\//g, '_')
    const downloadCodeSuffix = downloadCode.value

    if (platform === 'Windows') {
      const archSuffix = arch === '64' ? 'x64' : 'x86'
      return `RoxyBrowser_${archSuffix}_${version}_${formattedDate}${downloadCodeSuffix}.exe`
    } else if (platform === 'macOS') {
      const archSuffix = arch === 'apple' ? 'apple' : 'intel'
      return `RoxyBrowser_${archSuffix}_${version}_${formattedDate}${downloadCodeSuffix}.pkg`
    }

    return ''
  }

  /**
   * 生成下载链接
   */
  const generateDownloadLink = (platform: Platform, version: string): string => {
    const baseUrl = `${appDownloadUrl}/app-download/${platform}-latest`
    const params = new URLSearchParams({
      'roxy-partner': roxy_partner.value,
      'code': code.value,
      'version': version,
      'downloadInfo': JSON.stringify({
        conversionPage: conversionPage.value,//转化页
        landingPage: landingPage.value,//落地页
        source: source.value,//渠道来源
        language: locale.value,
        os: platform
      })
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
            fileName: generateFileName('Windows', '64', versionInfo.winVersion, versionInfo.winReleaseTime),
            text: '64 bits',
            link: generateDownloadLink('Windows-64', versionInfo.winVersion),
            effect: true
          },
          {
            fileName: generateFileName('Windows', '32', versionInfo.winVersion, versionInfo.winReleaseTime),
            text: '32 bits',
            link: generateDownloadLink('Windows-32', versionInfo.winVersion),
          }
        ],
        p: $t('最低版本要求：\nWindows 10 或更高版本。'),
        icon: '/download/os_windows.svg'
      },
      {
        latestVersion: $t('最新版本：{version}', { version: versionInfo.macVersion }),
        releaseDate: $t('发布日期：{date}', { date: versionInfo.macReleaseTime }),
        download: [
          {
            fileName: generateFileName('macOS', 'apple', versionInfo.macVersion, versionInfo.macReleaseTime),
            text: 'Apple Silicon',
            link: generateDownloadLink('macOS-apple', versionInfo.macVersion),
          },
          {
            fileName: generateFileName('macOS', 'intel', versionInfo.macVersion, versionInfo.macReleaseTime),
            text: 'Intel',
            link: generateDownloadLink('macOS-intel', versionInfo.macVersion),
          }
        ],
        p: $t('最低版本要求：\nmacOS 10.12 或更高版本。'),
        icon: '/download/os_macOS.svg'
      }
    ]
  })

  /**
   * 检测用户平台
   */
  const detectPlatform = async (): Promise<Platform | null> => {
    if (typeof window === 'undefined') return null

    // 优先使用 navigator.userAgentData.getHighEntropyValues 来获取系统信息
    if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
      const data = await navigator.userAgentData.getHighEntropyValues(["architecture", "bitness", "wow64"])
      if (data.platform === 'macOS') {
        if (data.architecture === 'arm') {
          return 'macOS-apple'
        } else {
          return 'macOS-intel'
        }
      }

      if (data.platform === 'Windows') {
        if (data.wow64) {  // 32位程序运行在64位系统上
          return 'Windows-64'
        }

        if (data.bitness === '64') {
          return 'Windows-64'
        } else if (data.bitness === '32') {
          return 'Windows-32'
        }
      }
    }

    const userAgent = window.navigator.userAgent
    const platform = window.navigator.platform

    if (platform.includes('Mac') || userAgent.includes('Mac')) {
      if (userAgent.includes('Intel Mac') || platform.includes('Intel')) {
        return 'macOS-intel'
      }
      return 'macOS-apple'
    }

    if (platform.includes('Win') || userAgent.includes('Windows')) {
      if (userAgent.includes('WOW64') || userAgent.includes('Win64') || userAgent.includes('x64')) {
        return 'Windows-64'
      }
      return 'Windows-32'
    }

    return null
  }

  /**
   * 根据平台获取对应的下载信息
   */
  const getDownloadInfoByPlatform = (platform: Platform) => {
    const downloads = getDownloadVersions.value

    if (platform.startsWith('Windows')) {
      const windowsDownload = downloads[0]
      const arch = platform === 'Windows-64' ? 0 : 1
      return windowsDownload.download[arch]
    } else if (platform.startsWith('macOS')) {
      const macDownload = downloads[1]
      const arch = platform === 'macOS-apple' ? 0 : 1
      return macDownload.download[arch]
    }

    return null
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

    const downloadInfo = getDownloadInfoByPlatform(platform)
    if (!downloadInfo) {
      console.warn('无法获取下载信息')
      return
    }

    const link = document.createElement('a')
    link.href = downloadInfo.link
    link.download = downloadInfo.fileName
    link.target = '_blank'
    link.style.display = 'none'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  /**
   * 初始化下载相关数据
   */
  const initializeDownload = async () => {
    conversionPage.value = location.pathname
    loadDownloadParams()
    await fetchVersionInfo()
    await nextTick()
  }

  return {
    versionInfo: readonly(versionInfo),
    roxy_partner: readonly(roxy_partner),
    code: readonly(code),
    downloadCode,
    getDownloadVersions,
    fetchVersionInfo,
    generateFileName,
    generateDownloadLink,
    detectPlatform,
    getDownloadInfoByPlatform,
    triggerAutoDownload,
    initializeDownload
  }
}