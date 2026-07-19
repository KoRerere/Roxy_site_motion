/**
 * 只有生产环境才做限制
 * 限频工具函数
 * 用于限制同一 IP 在指定时间窗口内的成功请求次数
 */

const config = useRuntimeConfig()

interface RateLimitWindow {
  windowStart: number
  successCount: number
}

// 全局限频记录（按 IP 存储）
const successWindow = new Map<string, RateLimitWindow>()

export function getClientIP(event: any): string {
  const headers = event.node.req.headers
  const forwarded = headers['x-forwarded-for']
  if (forwarded) {
    return Array.isArray(forwarded) ? forwarded[0] : forwarded.split(',')[0].trim()
  }
  return headers['x-real-ip'] as string || event.node.req.socket.remoteAddress || 'unknown'
}

const windowMs = 10 * 60 * 1000
const maxSuccessPerWindow = 1

/**
 * 检查并更新限频状态
 * @param event H3 事件对象
 * @param isSuccess 当前请求是否成功
 * @param windowMs 时间窗口（毫秒），默认 10 分钟
 * @param maxSuccessPerWindow 每个窗口内最大成功次数，默认 1 次
 * @returns 如果超过限制，抛出 429 错误；否则返回 void
 */
export function checkRateLimit(
  event: any,
  isSuccess: boolean,
): void {
  if (config.NODE_ENV !== 'production')
    return

  if (!isSuccess) {
    // 失败请求不计入限频
    return
  }

  const clientIP = getClientIP(event)
  const now = Date.now()
  const record = successWindow.get(clientIP)

  if (!record || now - record.windowStart > windowMs) {
    console.log('check rate limit, success, lock ip: ', clientIP)
    // 重置窗口并记录本次成功
    successWindow.set(clientIP, { windowStart: now, successCount: 1 })
  }
  else {
    // 在窗口内，检查是否超过限制
    if (record.successCount >= maxSuccessPerWindow) {
      console.log('check rate limit, success, exceed limit, lock ip: ', clientIP)
      throw createError({
        statusCode: 429,
        message: 'rate limit exceeded, please try again later',
      })
    }
    record.successCount += 1
  }

  // 清理过期窗口记录
  const windowAgo = now - windowMs
  for (const [ip, info] of successWindow.entries()) {
    if (info.windowStart < windowAgo) {
      successWindow.delete(ip)
    }
  }
}

export function hasRequest(event: any) {
  if (config.NODE_ENV !== 'production')
    return

  const clientIP = getClientIP(event)
  const record = successWindow.get(clientIP)

  if (record && record.successCount >= maxSuccessPerWindow) {
    console.log('has request, lock ip: ', clientIP)
    throw createError({
      statusCode: 429,
      message: 'rate limit exceeded, please try again later',
    })
  }
}

/**
 * 查询 IP 的限制状态
 * @param ip 要查询的 IP 地址，如果不传则返回所有 IP 的状态
 * @returns 限制状态信息
 */
export function getRateLimitStatus(ip?: string) {
  const now = Date.now()
  const windowAgo = now - windowMs

  // 清理过期窗口记录
  for (const [ipAddr, info] of successWindow.entries()) {
    if (info.windowStart < windowAgo) {
      successWindow.delete(ipAddr)
    }
  }

  // 如果指定了 IP，只返回该 IP 的状态
  if (ip) {
    const record = successWindow.get(ip)
    if (!record) {
      return {
        ip,
        isLimited: false,
        remainingSeconds: 0,
        successCount: 0,
        windowStart: null,
      }
    }

    const elapsed = now - record.windowStart
    const remainingMs = windowMs - elapsed
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
    const isLimited = record.successCount >= maxSuccessPerWindow

    return {
      ip,
      isLimited,
      remainingSeconds,
      successCount: record.successCount,
      windowStart: record.windowStart,
      maxSuccessPerWindow,
      windowMs,
    }
  }

  // 返回所有 IP 的状态
  const allStatus = Array.from(successWindow.entries()).map(([ipAddr, record]) => {
    const elapsed = now - record.windowStart
    const remainingMs = windowMs - elapsed
    const remainingSeconds = Math.max(0, Math.ceil(remainingMs / 1000))
    const isLimited = record.successCount >= maxSuccessPerWindow

    return {
      ip: ipAddr,
      isLimited,
      remainingSeconds,
      successCount: record.successCount,
      windowStart: record.windowStart,
    }
  })

  return {
    total: allStatus.length,
    items: allStatus,
    maxSuccessPerWindow,
    windowMs,
  }
}
