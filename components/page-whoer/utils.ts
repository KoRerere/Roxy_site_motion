import { whoerIpProxy } from '~/utils/whoerIpProxy'

export async function webrtcLeakTest({
  stunUrls = ['stun:stun.l.google.com:19302'],
  timeoutMs = 3000,
} = {}) {
  const pc = new RTCPeerConnection({
    iceServers: [{ urls: stunUrls }],
    iceCandidatePoolSize: 0,
  })

  // 不需要真的传媒体，建一个 dataChannel 就能触发 ICE gather
  pc.createDataChannel('leak-test')

  const results = {
    host: new Set(), // 可能是内网IP，也可能是 mDNS
    srflx: new Set(), // STUN 看到的公网出口
    relay: new Set(), // TURN 中继（有配 TURN 才可能出现）
    all: new Set(),
    raw: [],
  }

  function add(type, value) {
    if (!value)
      return
    results[type]?.add(value)
    results.all.add(value)
  }

  // candidate 行里提取 ip / address（兼容不同格式）
  function parseCandidate(candStr) {
    // 典型格式：
    // candidate:... 1 udp ... 192.168.1.5 56143 typ host ...
    // candidate:... 1 udp ... 203.0.113.5 54400 typ srflx raddr 192.168.1.5 rport ...
    const m = candStr.match(
      /candidate:\S+ \d+ \S+ \d+ ([0-9a-fA-F.:]+) (\d+) typ (\w+)/, // ip/port/type
    )
    if (!m)
      return null
    const [, address, port, typ] = m
    return { address, port: Number(port), typ }
  }

  let done = false

  const donePromise = new Promise((resolve) => {
    pc.onicecandidate = (e) => {
      if (!e.candidate) {
        // gather 完成
        done = true
        resolve()
        return
      }

      const candStr = e.candidate.candidate
      results.raw.push(candStr)

      const parsed = parseCandidate(candStr)
      if (!parsed)
        return

      const { address, typ } = parsed

      // address 可能是 IPv4/IPv6，也可能是 mDNS(但 mDNS 往往不会被这条正则匹配到)
      // 如果你也想收集 mDNS，可以用 e.candidate.address（部分浏览器支持）或更宽松解析
      if (typ === 'host')
        add('host', address)
      else if (typ === 'srflx')
        add('srflx', address)
      else if (typ === 'relay')
        add('relay', address)
      else add('all', address)
    }
  })

  // 触发 gather
  const offer = await pc.createOffer({ offerToReceiveAudio: false, offerToReceiveVideo: false })
  await pc.setLocalDescription(offer)

  // 超时兜底
  await Promise.race([
    donePromise,
    new Promise(r => setTimeout(r, timeoutMs)),
  ])

  pc.close()

  // 输出成数组方便 UI 展示
  return {
    host: [...results.host],
    srflx: [...results.srflx],
    relay: [...results.relay],
    all: [...results.all],
    raw: results.raw,
    completed: done,
  }
}

/** Surfshark 单次请求返回的 IP 条目 */
interface SurfsharkIpEntry {
  ISP: string
  Country: string
  City: string
  IP: string
  Leak: boolean
  CountryCode: string
}

/** ip123.in batch_query 返回的单个 IP 数据 */
interface Ip123Entry {
  ip: string
  country?: string
  country_code?: string
  region?: string
  city?: string
  organization?: string
  asn?: number
  [key: string]: any
}

/** 兼容展示用（ip_data 沿用旧字段名） */
export type IpScanData = Ip123Entry

/** DNS 泄漏测试汇总结果 */
export interface DnsLeakTestResult {
  /** 唯一 IP 数量（DNS Servers） */
  dnsServerCount: number
  /** 唯一 ISP 数量 */
  ispCount: number
  /** 唯一地理位置数量（国家+城市） */
  locationCount: number
  /** 汇总文案，如 "29 DNS Servers, 5 ISP, 1 Locations" */
  summary: string
  /** 每个 IP 的详细信息（来自 ip-scan） */
  details: Array<{ ip: string, ip_data?: IpScanData }>
}

/** 生成短时间内每个用户、每次请求都不同的随机子域（避免用顺序 1、2、3） */
function randomSurfsharkSubdomain(): string {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`
}

/**
 * 1. 循环 3 次，每次请求 https://<随机>.ipv4.surfsharkdns.com/ 拿到一批 ip
 * 2. 每拿到一批 ip 后，立即用这批 ip 逐个请求 ip-scan 检测，检测完再请求下一组（嵌套循环）
 * 3. 汇总成 dnsServerCount, ispCount, locationCount 及 summary
 * @param options.batchQueryBaseUrl 默认走 nginx 反代 /ip123/api/batch_query
 */
export async function dnsLeakTest(options?: { batchQueryBaseUrl?: string }): Promise<DnsLeakTestResult> {
  const BATCH_QUERY_URL = options?.batchQueryBaseUrl ?? whoerIpProxy.ip123BatchQuery

  const ipSet = new Set<string>()
  const details: Array<{ ip: string, ip_data?: IpScanData }> = []
  const ispSet = new Set<string>()
  const locationSet = new Set<string>()

  for (let round = 0; round < 3; round++) {
    // 每次用随机子域，短时间内不同用户、不同轮次都不一样
    const subdomain = randomSurfsharkSubdomain()
    const surfsharkUrl = `https://${subdomain}.ipv4.surfsharkdns.com/`

    let batch: Record<string, SurfsharkIpEntry> = {}
    try {
      const res = await fetch(surfsharkUrl)
      if (!res.ok)
        continue
      batch = await res.json() as Record<string, SurfsharkIpEntry>
    }
    catch {
      continue
    }

    const ips = Object.keys(batch)
    if (ips.length === 0)
      continue

    // 拿到这一批 ip 后，用 ip123.in 批量查询：ips=ip1,ip2,ip3
    ips.forEach(ip => ipSet.add(ip))
    try {
      const url = `${BATCH_QUERY_URL}?ips=${ips.map(ip => encodeURIComponent(ip)).join(',')}`
      const res = await fetch(url)
      const json = await res.json() as { code: number, data?: Record<string, Ip123Entry>, msg?: string }
      if (json.code !== 0 || !json.data) {
        ips.forEach(ip => details.push({ ip }))
        continue
      }
      const dataMap = json.data
      for (const ip of ips) {
        const ipData = dataMap[ip]
        details.push({ ip, ip_data: ipData })
        if (ipData?.organization)
          ispSet.add(String(ipData.organization).trim())
        const loc = [ipData?.country, ipData?.city].filter(Boolean).join(', ')
        if (loc)
          locationSet.add(loc)
      }
    }
    catch {
      ips.forEach(ip => details.push({ ip }))
    }
  }

  const dnsServerCount = ipSet.size
  const ispCount = ispSet.size
  const locationCount = locationSet.size
  const summary = `${dnsServerCount} DNS Servers, ${ispCount} ISP, ${locationCount} Locations`

  return {
    dnsServerCount,
    ispCount,
    locationCount,
    summary,
    details,
  }
}
