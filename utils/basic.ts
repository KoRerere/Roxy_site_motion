import clsx, { type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'
export const cn = (...classes: ClassValue[]) => twMerge(clsx(...classes))

export function copyText(text: string) {
  if (navigator.clipboard) {
    navigator.clipboard.writeText(text).then(() => {
      console.log('Text copied to clipboard');
    }).catch(err => {
      console.error('Failed to copy text: ', err);
    });
  } else {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
  }
}

export function setRoxyCookie(name: string, value: string, hours: number) {
  const date = new Date();
  date.setTime(date.getTime() + hours * 60 * 60 * 1000);
  document.cookie = `${name}=${value}; expires=${date.toUTCString()}; path=/`;
}

export function getRoxyCookie(name: string) {
  const cookies = document.cookie.split('; ');
  for (let i = 0; i < cookies.length; i++) {
    const [key, value] = cookies[i].split('=');
    if (key === name) {
      return value;
    }
  }
  return null;
}

export function getFontFamily(code: string): string {
  const fontFamily = {
    zh: 'var(--zhFamily)',
    en: 'var(--enFamily)',
    ru: 'var(--ruFamily)'
  }
  return (fontFamily as any)[code] || fontFamily.zh
}

export function rangRandom(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function lbSetTimeout(
  fn: () => void,
  t: number
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
  hex = hex.replace(/^#/, '');

  // 如果是三位简写形式，扩展成六位
  if (hex.length === 3) {
    hex = hex.split('').map(char => char + char).join('');
  }

  // 解析 RGB 分量
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);

  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}