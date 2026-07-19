import { whoerIpProxy } from './whoerIpProxy'

/**
 * 搜索指定IP地址的信息
 * @param {string} ip - 要查询的IP地址
 * @returns {Promise<object>} 返回IP信息数据
 */
export async function searchIP(ip) {
  const response = await fetch(whoerIpProxy.ip123SearchIpPage, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ ip }),
  })

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()

  if (result.code === 0 && result.data) {
    return handleResult(result.data)
  }
  else {
    throw new Error(result.msg || 'API返回未知错误')
  }
}

/**
 * 获取当前用户的IP信息
 * @returns {Promise<object>} 返回当前用户的IP信息
 */
export async function getCurrentIP() {
  const response = await fetch(`https://travel-eye.org/ip.json`)

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`)
  }

  const result = await response.json()

  // 处理返回数据 - 支持两种格式
  if (result.ip) {
    // 直接返回数据对象（包含ip字段）
    return handleResult(result)
  }
  else if (result.code === 0 && result.data) {
    // 包装格式
    return handleResult(result.data)
  }
  else {
    console.warn('初始化接口返回数据格式异常:', result)
    throw new Error('获取IP信息失败')
  }
}

function handleResult(result) {
  if (result.country_code === 'HK' || result.country_code === 'TW') {
    result.country += ',China'
  }

  return result
}
