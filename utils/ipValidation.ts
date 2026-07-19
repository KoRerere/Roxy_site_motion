// IPv4 正则表达式
const ipv4Regex = /^(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)(\.(25[0-5]|2[0-4]\d|1\d\d|[1-9]?\d)){3}$/

// IPv6 正则表达式
const ipv6Regex = /^((?:[0-9A-F]{1,4}:){7}(?:[0-9A-F]{1,4}|:)|(?:[0-9A-F]{1,4}:){1,7}:|(?:[0-9A-F]{1,4}:){1,6}:[0-9A-F]{1,4}|(?:[0-9A-F]{1,4}:){1,5}(?::[0-9A-F]{1,4}){1,2}|(?:[0-9A-F]{1,4}:){1,4}(?::[0-9A-F]{1,4}){1,3}|(?:[0-9A-F]{1,4}:){1,3}(?::[0-9A-F]{1,4}){1,4}|(?:[0-9A-F]{1,4}:){1,2}(?::[0-9A-F]{1,4}){1,5}|[0-9A-F]{1,4}:(?::[0-9A-F]{1,4}){1,6}|:(?::[0-9A-F]{1,4}){1,7}|:)(?:%.+)?$/i

/**
 * 验证IP地址是否有效（支持IPv4和IPv6）
 * @param {string} ip - 要验证的IP地址
 * @returns {boolean} 是否为有效的IP地址
 */
export function isValidIP(ip) {
  if (!ip || typeof ip !== 'string') {
    return false
  }

  return ipv4Regex.test(ip.trim()) || ipv6Regex.test(ip.trim())
}

/**
 * 验证是否为IPv4地址
 * @param {string} ip - 要验证的IP地址
 * @returns {boolean} 是否为有效的IPv4地址
 */
export function isValidIPv4(ip) {
  if (!ip || typeof ip !== 'string') {
    return false
  }

  return ipv4Regex.test(ip.trim())
}

/**
 * 验证是否为IPv6地址
 * @param {string} ip - 要验证的IP地址
 * @returns {boolean} 是否为有效的IPv6地址
 */
export function isValidIPv6(ip) {
  if (!ip || typeof ip !== 'string') {
    return false
  }

  return ipv6Regex.test(ip.trim())
}
