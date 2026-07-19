export enum Platform {
  Windows64 = 'Windows-64',
  Windows32 = 'Windows-32',
  macOSApple = 'macOS-apple',
  macOSIntel = 'macOS-intel',
  Linux64 = 'Linux-64',
}

function detectAppleSilicon() {
  const canvas = document.createElement('canvas')
  const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl')

  return gl?.getExtension?.('WEBKIT_WEBGL_compressed_texture_pvrtc')
}

export async function detectPlatform(): Promise<Platform | null> {
  if (typeof window === 'undefined')
    return null

  // 优先使用 navigator.userAgentData.getHighEntropyValues 来获取系统信息
  if (navigator.userAgentData && navigator.userAgentData.getHighEntropyValues) {
    const data = await navigator.userAgentData.getHighEntropyValues(['architecture', 'bitness', 'wow64'])
    if (data.platform === 'macOS') {
      if (data.architecture === 'arm') {
        return Platform.macOSApple
      }
      else {
        return Platform.macOSIntel
      }
    }

    if (data.platform === 'Windows') {
      if (data.wow64) { // 32位程序运行在64位系统上
        return Platform.Windows64
      }

      if (data.bitness === '64') {
        return Platform.Windows64
      }
      else if (data.bitness === '32') {
        return Platform.Windows32
      }
    }
  }

  const userAgent = window.navigator.userAgent
  const platform = window.navigator.platform

  if (platform.includes('Mac') || userAgent.includes('Mac')) {
    if (/Safari/.test(userAgent) && detectAppleSilicon()) {
      return Platform.macOSApple
    }
    if (userAgent.includes('Intel Mac') || platform.includes('Intel')) {
      return Platform.macOSIntel
    }
    return Platform.macOSApple
  }

  if (platform.includes('Win') || userAgent.includes('Windows')) {
    if (userAgent.includes('WOW64') || userAgent.includes('Win64') || userAgent.includes('x64')) {
      return Platform.Windows64
    }
    return Platform.Windows32
  }

  if (platform.includes('Linux') || userAgent.includes('Linux')) {
    return Platform.Linux64
  }

  return null
}

export function getOS() {
  if (typeof window === 'undefined') {
    return ''
  }

  const userAgent = window.navigator.userAgent.toLowerCase()

  if (userAgent.includes('android'))
    return 'Android'
  if (userAgent.includes('iphone') || userAgent.includes('ipad'))
    return 'iOS'
  if (userAgent.includes('windows nt'))
    return 'Windows'
  if (userAgent.includes('mac os x'))
    return 'macOS'
  if (userAgent.includes('linux'))
    return 'Linux'

  return 'Unknown'
}
