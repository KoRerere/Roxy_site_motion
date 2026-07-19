import type { ClassValue } from 'clsx'
import clsx from 'clsx'
import { twMerge } from 'tailwind-merge'

export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes))

export function copyText(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard')
    }).catch((err) => {
      console.error('Failed to copy text: ', err)
    })
  }
  else {
    const textArea = document.createElement('textarea')
    textArea.value = text
    document.body.appendChild(textArea)
    textArea.select()
    document.execCommand('copy')
    document.body.removeChild(textArea)
  }
}

export function setRoxyCookie(name: string, value: string, hours: number, domain?: string) {
  if (typeof document === 'undefined')
    return
  const date = new Date()
  date.setTime(date.getTime() + hours * 60 * 60 * 1000)
  console.log('setRoxyCookie', `${name}=${value}; expires=${date.toUTCString()}; path=/${domain ? `; domain=${domain}` : ''}`)
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/${domain ? `; domain=${domain}` : ''}`
}

export function getRoxyCookie(name: string) {
  if (typeof document === 'undefined')
    return null
  const cookies = document.cookie.split('; ')
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=')
    if (key === name) {
      return value
    }
  }
  return null
}

export function getFontFamily(code: string): string {
  const fontFamily = {
    zh: 'var(--zhFamily)',
    en: 'var(--enFamily)',
    ru: 'var(--ruFamily)',
  }
  return (fontFamily as any)[code] || fontFamily.zh
}

export function rangRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function lbSetTimeout(
  fn: () => void,
  t: number,
): [() => void, (delay: number) => void] {
  let _timer: ReturnType<typeof setTimeout>
  let _delay = +t || 0
  function interval() {
    fn.call(null)
    _timer = setTimeout(interval, _delay)
  }
  interval()
  const stop = () => clearTimeout(_timer)
  const setDelay = (delay: number) => (_delay = +delay || 5000)
  return [stop, setDelay]
}

export function hexToRgba(hex: string, alpha = 1) {
  // 去掉井号
  hex = hex.replace(/^#/, '')

  // 如果是三位简写形式，扩展成六位
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('')
  }

  // 解析 RGB 分量
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  return `rgba(${r}, ${g}, ${b}, ${alpha})`
}

export function isWebGLSupported() {
  try {
    const canvas = document.createElement('canvas')
    return !!(
      window.WebGLRenderingContext
      && (canvas.getContext('webgl') || canvas.getContext('experimental-webgl'))
    )
  }
  catch (e) {
    return false
  }
}

/**
 * base64url -> Uint8Array
 */
function base64UrlToUint8(str: string) {
  const base64 = str
    .replace(/-/g, '+')
    .replace(/_/g, '/')
    .padEnd(str.length + (4 - (str.length % 4)) % 4, '=')

  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i)
  }

  return bytes
}
/**
 * base64url -> JSON
 */
export function decodeState(str: string) {
  try {
    const bytes = base64UrlToUint8(str)
    const json = new TextDecoder().decode(bytes)
    return JSON.parse(json)
  }
  catch (_) {
    return {}
  }
}
