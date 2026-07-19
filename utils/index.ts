export * from './basic'

export function startWithUpper(string: string) {
  return string.charAt(0).toUpperCase() + string.slice(1)
}

export function getLocalStorage(key: string, defaultValue: any) {
  if (import.meta.client) {
    const data = localStorage.getItem(key)
    try {
      return JSON.parse(data || defaultValue)
    }
    catch (error) {
      return defaultValue
    }
  }
  return defaultValue
}

export function setLocalStorage(key: string, value: any) {
  if (import.meta.client) {
    localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
  }
}
