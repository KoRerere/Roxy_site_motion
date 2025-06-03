export * from './basic'

export const startWithUpper= (string: string) => {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

export const getLocalStorage = (key: string, defaultValue: any) => {
  const data = localStorage.getItem(key);
  try {
    return JSON.parse(data || defaultValue)
  } catch (error) {
    return defaultValue
  }
}

export const setLocalStorage = (key: string, value: any) => {
  localStorage.setItem(key, typeof value === 'object' ? JSON.stringify(value) : value)
}
