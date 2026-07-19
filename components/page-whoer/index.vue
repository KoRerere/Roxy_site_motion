<script setup lang="ts">
import type { DnsLeakTestResult } from './utils'
import Faq from '../faq.vue'
import SvgIcon from '../rx-icon/svg-icon.vue'
import FAQSection from './FAQSection.vue'
import FingerprintDetectionSection from './FingerprintDetectionSection.vue'
import Header from './header.vue'
import HigherAnonymitySection from './HigherAnonymitySection.vue'
import IpLocationMap from './IpLocationMap.vue'
// import PrivacyEnhancementSuggestionsSection from './PrivacyEnhancementSuggestionsSection.vue'
// import SecurityRiskDetectionSection from './SecurityRiskDetectionSection.vue'
import { whoerIpProxy } from '~/utils/whoerIpProxy'
import { dnsLeakTest, webrtcLeakTest } from './utils'

const isDev = import.meta.dev
const route = useRoute()

const ipInput = ref('')
const ipQueryLoading = ref(false)

/** 从 URL query 读取 ip：?ip=22、?a=44&ip=22、?a=44$ip=22、?a=44$ip=22#xxx */
function getIpParamFromUrl() {
  const qIp = route.query.ip
  if (qIp != null && qIp !== '') {
    const v = (Array.isArray(qIp) ? (qIp[0] ?? '') : String(qIp)).trim()
    if (v)
      return v
  }

  // ?a=44$ip=22 这类写法 route.query 解析不到 ip，再从 search 容错
  if (!import.meta.client)
    return ''

  const query = window.location.search.slice(1).replace(/\$/g, '&')
  return new URLSearchParams(query).get('ip')?.trim() || ''
}

/** ip234.in/ip.json 返回结构 */
interface Ip234JsonResponse {
  ip?: string
  city?: string
  organization?: string
  asn?: number
  network?: string
  country?: string
  country_code?: string
  continent?: string
  continent_code?: string
  postal?: string
  latitude?: number
  longitude?: number
  timezone?: string
  region?: string
  region_code?: string
  region_cn?: string
  [key: string]: any
}

function buildPlaneFromApi(api: Ip234JsonResponse): Array<{ title: string, icon: string, iconColor: string, iconSize: number, data: Array<{ label: string, value: string }> }> {
  const loc = [api.latitude, api.longitude].filter(v => v != null).join(', ')
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : ''
  // const uaShort = ua.length > 32 ? `${ua.slice(0, 32)}...` : ua
  const lang = typeof navigator !== 'undefined' ? navigator.language : ''

  return [
    {
      title: $t('国家城市信息'),
      icon: 'whoer/site',
      iconColor: '#A35CE6',
      iconSize: 24,
      data: [
        { label: $t('国家'), value: api.country ?? '--' },
        { label: $t('地区'), value: api.region ?? '--' },
        { label: $t('城市'), value: api.city ?? '--' },
        { label: $t('位置'), value: loc || '--' },
        { label: $t('时区'), value: api.timezone ?? '--' },
        { label: $t('邮政编码'), value: api.postal ?? '--' },
      ],
    },
    {
      title: $t('网络信息'),
      icon: 'whoer/network',
      iconColor: '#17A143',
      iconSize: 24,
      data: [
        { label: $t('ISP'), value: api.organization ?? '--' },
        { label: $t('ASN'), value: api.asn != null ? String(api.asn) : '--' },
        { label: $t('语言'), value: lang || '--' },
        { label: $t('User Agent'), value: ua || '--' },
        { label: $t('Proxy IP'), value: '--' },
        { label: $t('Blacklist'), value: '--' },
      ],
    },
  ]
}

/** 当前访问者 IP 信息（来自 ip234.in/ip.json 或 search_ip 查询），用于顶部国家/地区与 IP 展示 */
const ip234JsonData = ref<Ip234JsonResponse | null>(null)

/** IP 地理位置经纬度展示（来自 ip234JsonData），如 34.0522°N, 118.2437°W */
const ipLocationCoords = computed(() => {
  const d = ip234JsonData.value
  if (d?.latitude == null || d?.longitude == null)
    return '--'
  const lat = Number(d.latitude)
  const lng = Number(d.longitude)
  return `${lat.toFixed(4)}°${lat >= 0 ? 'N' : 'S'}, ${lng.toFixed(4)}°${lng >= 0 ? 'E' : 'W'}`
})

const plane = ref<Array<{ title: string, icon: string, iconColor: string, iconSize: number, data: Array<{ label: string, value: string }> }>>([
  {
    title: $t('国家城市信息'),
    icon: 'whoer/site',
    iconColor: '#A35CE6',
    iconSize: 24,
    data: [
      { label: $t('国家'), value: '--' },
      { label: $t('地区'), value: '--' },
      { label: $t('城市'), value: '--' },
      { label: $t('位置'), value: '--' },
      { label: $t('时区'), value: '--' },
      { label: $t('邮政编码'), value: '--' },
    ],
  },
  {
    title: $t('网络信息'),
    icon: 'whoer/network',
    iconColor: '#17A143',
    iconSize: 24,
    data: [
      { label: $t('ISP'), value: '--' },
      { label: $t('ASN'), value: '--' },
      { label: $t('语言'), value: '--' },
      { label: $t('User Agent'), value: '--' },
      { label: $t('Proxy IP'), value: '--' },
      { label: $t('Blacklist'), value: '--' },
    ],
  },
])

function handleInquire() {
  const trimmed = ipInput.value?.trim()
  if (!trimmed)
    return
  ipQueryLoading.value = true
  const url = isDev ? `/api/whoer/ip234?ip=${encodeURIComponent(trimmed)}` : `https://ip234.in/search_ip?ip=${encodeURIComponent(trimmed)}`
  const ip234Promise = fetch(url)
    .then(r => r.json())
    .then((res: { code?: number, data?: Ip234JsonResponse }) => {
      if (res.code === 0 && res.data) {
        ip234JsonData.value = res.data
        plane.value = buildPlaneFromApi(res.data)
      }
    })
    .catch(() => {})
  const channelsPromise = Promise.all([
    checkIpInfo('ip123.in', trimmed),
    checkIpInfo('ip-api', trimmed),
    checkIpInfo('ip2location', trimmed),
  ]).then(([ip123, ipApi, ip2location]) => {
    applyIpCheckChannelResults(ip123, ipApi, ip2location)
  })
  Promise.all([ip234Promise, channelsPromise]).finally(() => {
    ipQueryLoading.value = false
  })
}

/** 单条展示项：field 用于回填时按字段名匹配 API 数据，增删项无需改下标 */
const ipCheckData = [
  { field: 'country', label: $t('国家'), value: '--' },
  { field: 'region', label: $t('地区'), value: '--' },
  { field: 'city', label: $t('城市'), value: '--' },
  { field: 'timezone', label: $t('时区'), value: '--' },
  { field: 'postal', label: $t('邮政编码'), value: '--' },
  { field: 'isp', label: $t('ISP'), value: '--' },
  { field: 'asn', label: $t('ASN'), value: '--' },
  { field: 'language', label: $t('语言'), value: '--' },
  // { field: 'proxyIp', label: $t('Proxy IP'), value: '--' },
  { field: 'longitude', label: $t('经度'), value: '--' },
  { field: 'latitude', label: $t('纬度'), value: '--' },
]

function deepClone(data: any) {
  return JSON.parse(JSON.stringify(data))
}

const ipCheckChannel = reactive(
  {
    'IP123.in': {
      ip: '--',
      data: deepClone(ipCheckData),
    },
    'IP-API': {
      ip: '--',
      data: deepClone(ipCheckData),
    },
    'IP2Location': {
      ip: '--',
      data: deepClone(ipCheckData),
    },
  },
)

const extendRead = [
  {
    label: $t('IP 地址'),
    value: 'https://en.wikipedia.org/wiki/IP_address',
  },
  {
    label: $t('ICP/IP协议栈指纹识别'),
    value: 'https://en.wikipedia.org/wiki/List_of_HTTP_header_fields',
  },
  {
    label: $t('域名系统'),
    value: 'https://en.wikipedia.org/wiki/TCP/IP_stack_fingerprinting',
  },
  {
    label: $t('HTTP头部字段列表'),
    value: 'https://en.wikipedia.org/wiki/Domain_Name_System',
  },
]

const faqList = [
  {
    title: $t('这个工具是做什么用的？'),
    desc: $t('这个工具可以为你提供有关任何特定 IP 地址的详尽信息。不仅如此，它还会检查你的浏览器指纹以及潜在的隐私问题，例如 DNS 和 WebRTC 泄漏。'),
  },
  {
    title: $t('什么是 IP 地址？'),
    desc: $t('你可以把 IP 地址看成一个用于识别连接到互联网的每个设备的特殊数字。它可以说是一个“数字回执地址”，大数据正是由它找到你的电脑。同时，它也会向每个网站透露你的物理位置和互联网服务提供商（ISP）。'),
  },
  {
    title: $t('什么是浏览器指纹？'),
    desc: $t('除了 IP 地址，网站还会通过你使用的浏览器抓取“指纹”，其中包含屏幕分辨率、浏览器语言等信息。即使你的 IP 地址被隐藏，一组特定的指纹设置组合仍然能以惊人的准确度定位并追踪你的上网行为。'),
  },
  {
    title: $t('我可不可以改变自己的 IP 地址或浏览器指纹？'),
    desc: $t('可以。你可以通过使用 VPN 或代理 IP 来隐藏你的 IP 地址。除了隐藏 IP，使用像 RoxyBrowser 这样的防检测浏览器还可以伪装你的浏览器指纹。这些都是保护你互联网个人信息的强大工具。'),
  },
  {
    title: $t('什么是 DNS 泄漏和 WebRTC 泄漏？'),
    desc: $t('DNS 泄漏是指你的浏览器没有通过安全的 VPN 隧道，而是直接向你的网络运营商服务器发送请求。WebRTC 泄漏则基本上是让网站能够通过实时通信协议获取你的真实 IP 地址。这两者都是威胁互联网隐私的严重问题。'),
  },
  {
    title: $t('如何修复 DNS 泄漏和 WebRTC 泄漏？'),
    desc: $t('要修复 DNS 泄漏，你可以把 DNS 设置为私有提供商，或者使用能自动路由 DNS 的浏览器。对于 WebRTC，你可以在自己浏览器的顶级设置中将其关闭。最可靠的解决方案是使用像 RoxyBrowser 这样的防检测浏览器，它从底层层面处理好了这些协议，确保没有任何数据外泄。'),
  },
  {
    title: $t('IPv4 和 IPv6 两者有什么区别？'),
    desc: $t('互联网协议第 4 版 (IPv4) 是目前应用最广泛的 IP 类型，采用 32 位格式（例如 192.168.1.1），可提供约 43 亿个地址。\n而互联网协议第 6 版 (IPv6) 采用 128 位字母数字格式（例如 2001:0db8...），可提供近乎无限的地址。\n与 IPv4 将家中所有设备隐藏在一个路由器地址后不同，IPv6 对隐私不太友好，因为家中的每个设备通常都会获得它独有的 IP 地址。'),
  },
]

const faqList2 = [
  {
    title: $t('什么是 Whoer.net？'),
    desc: $t('Whoer.net 是一款全面的在线 IP 检测工具。它通过分析你的 IP 地址、地理位置及浏览器指纹，而且据此给出你的“匿名评分”，让你了解自己在网上泄露了多少隐私信息。'),
  },
  {
    title: $t('Whoer 和别的 IP 检测工具有什么不同？'),
    desc: $t('除了基础的 IP 信息外，Whoer 还会进行深度的浏览器指纹分析、时区一致性检查以及 WebRTC 泄漏检测等。其匿名评分能直接反映你的在线隐私安全状况，这也是为什么 Whoer.net 被更广泛地用于测试 VPN 和代理 IP 服务器的匿名性如何。'),
  },
  {
    title: $t('Whoer 是怎么收集你的数据的？'),
    desc: $t('Whoer 通过很多方式收集数据，包括检查你的请求头（Request Headers）、JavaScript API、WebRTC 以及 Canvas 指纹。'),
  },
  {
    title: $t('Whoer 检测工具会存储我的数据吗？'),
    desc: $t('本页面的 Whoer 检测工具完全在你的浏览器内运行。一切和检测相关的数据仅显示在你的屏幕上，绝对不会发送和储存到服务器或任何地方。'),
  },
  {
    title: $t('为什么我在 Whoer.net 上的匿名评分这么低？'),
    desc: $t('Whoer 匿名评分过低可能是由以下原因造成的：1) 未使用 VPN 或代理 IP，导致真实 IP 地址泄露；2) 浏览器语言与 IP 地址所属地区不匹配；3) 存在 WebRTC 泄漏或 DNS 泄漏等。'),
  },
  {
    title: $t('Whoer 能帮我提高匿名评分吗？'),
    desc: $t('Whoer 本身只能显示而无法直接提高你的匿名评分。但你可以通过使用像 RoxyBrowser 这样的防检测浏览器，或手动配置正确的代理 IP 设置来提升你的匿名评分。'),
  },
  {
    title: $t('我可以在 Android 或 iOS 设备上使用 Whoer 吗？'),
    desc: $t('当然可以。Whoer 适用于任何有浏览器的操作系统，包括 Windows、Android、iOS 和 macOS。'),
  },
]

/** ipcheck 接口返回的 data 结构（各 channel 字段可能略有差异） */
interface IpCheckApiData {
  ip?: string
  country?: string
  region?: string
  city?: string
  latitude?: number | string
  longitude?: number | string
  timezone?: string
  postal?: string
  organization?: string
  isp?: string
  asn?: number | string
  language?: string
  [key: string]: any
}

async function checkIpInfo(channel: string, ip?: string): Promise<IpCheckApiData | undefined> {
  const url = whoerIpProxy.ipcheckQuery
  const body = ip ? { channel, ip } : { channel }
  const response = await fetch(url, {
    method: 'POST',
    body: JSON.stringify(body),
    headers: { 'Content-Type': 'application/json' },
  })
  const result = await response.json().catch(() => null)
  if (result?.code === 200 && result?.data)
    return result.data
  if (response.ok && result?.data)
    return result.data
  return undefined
}

/** 按 field 从 API 取值的映射，增删 ipCheckData 项时只需改这里或保持 field 一致 */
const ipCheckFieldGetters: Record<string, (api: IpCheckApiData) => string> = {
  country: api => api.country ?? '--',
  region: api => api.region ?? '--',
  city: api => api.city ?? '--',
  timezone: api => api.timezone ?? (api as any).time_zone ?? '--',
  postal: api => api.postal ?? '--',
  isp: api => api.organization ?? api.isp ?? '--',
  asn: api => api.asn != null ? String(api.asn) : '--',
  language: api => (api.language ?? (typeof navigator !== 'undefined' ? navigator.language : '')) || '--',
  proxyIp: () => '--',
  longitude: api => api.longitude != null ? String(api.longitude) : '--',
  latitude: api => api.latitude != null ? String(api.latitude) : '--',
}

/** 将 ipcheck 接口返回的 data 转成 ipCheckChannel 所需的 { ip, data }，按 field 匹配回填 */
function mapIpCheckResultToChannel(api: IpCheckApiData | undefined): { ip: string, data: Array<{ field: string, label: string, value: string }> } {
  const base = deepClone(ipCheckData)
  if (!api) {
    return { ip: '--', data: base }
  }
  base.forEach((item: { field: string, label: string, value: string }) => {
    const getter = ipCheckFieldGetters[item.field]
    item.value = getter ? getter(api) : '--'
  })
  return {
    ip: api.ip ?? '--',
    data: base,
  }
}

function applyIpCheckChannelResults(
  ip123: IpCheckApiData | undefined,
  ipApi: IpCheckApiData | undefined,
  ip2location: IpCheckApiData | undefined,
) {
  Object.assign(ipCheckChannel['IP123.in'], mapIpCheckResultToChannel(ip123))
  Object.assign(ipCheckChannel['IP-API'], mapIpCheckResultToChannel(ipApi))
  Object.assign(ipCheckChannel.IP2Location, mapIpCheckResultToChannel(ip2location))
}

const dnsLeakTestData = ref<DnsLeakTestResult | null>(null)

const webrtcLeakTestData = ref<{
  asn: number
  city: string
  continent: string
  continent_code: string
  country: string
  country_code: string
  ip: string
  latitude: string
  longitude: string
  metro_code: string
  network: string
  organization: string
  postal: string
  region: string
  region_code: string
  timezone: string
}>({
  asn: 0,
  city: '',
  continent: '',
  continent_code: '',
  country: '',
  country_code: '',
  ip: '',
  latitude: '',
  longitude: '',
  metro_code: '',
  network: '',
  organization: '',
  postal: '',
  region: '',
  region_code: '',
  timezone: '',
})

/** 仅执行 DNS 泄漏测试（用于首屏与「检测」按钮） */
function runDnsLeakTest(): Promise<void> {
  return dnsLeakTest({ batchQueryBaseUrl: whoerIpProxy.ip123BatchQuery })
    .then((result) => {
      dnsLeakTestData.value = result
    })
    .catch(() => {
      dnsLeakTestData.value = null
    })
}

const isLeakTestRunning = ref(false)

function handleRunLeakTests() {
  if (isLeakTestRunning.value)
    return
  isLeakTestRunning.value = true
  runDnsLeakTest().finally(() => {
    isLeakTestRunning.value = false
  })
}

onMounted(() => {
  const urlIp = getIpParamFromUrl()
  if (urlIp) {
    ipInput.value = urlIp
    handleInquire()
  }
  else {
    // 地址栏无 ip 时，拉当前访客 IP 信息
    const ip234JsonUrl = isDev ? '/api/whoer/ip234-json' : 'https://ip234.in/ip.json'
    fetch(ip234JsonUrl)
      .then(r => r.json())
      .then((data: Ip234JsonResponse) => {
        ip234JsonData.value = data
        plane.value = buildPlaneFromApi(data)
      })
      .catch(() => {})

    Promise.all([checkIpInfo('ip123.in'), checkIpInfo('ip-api'), checkIpInfo('ip2location')]).then(
      ([ip123, ipApi, ip2location]) => applyIpCheckChannelResults(ip123, ipApi, ip2location),
    )
  }

  webrtcLeakTest().then((res) => {
    const ip = String(res.srflx[0] ?? '')
    if (!ip)
      return
    const url = isDev ? `/api/whoer/ip234?ip=${encodeURIComponent(ip)}` : `https://ip234.in/search_ip?ip=${encodeURIComponent(ip)}`
    fetch(url).then(r => r.json()).then((res) => {
      if (res.code === 0)
        webrtcLeakTestData.value = res.data
    })
  })

  isLeakTestRunning.value = true
  runDnsLeakTest().finally(() => {
    isLeakTestRunning.value = false
  })
})
</script>

<template>
  <!-- <Header /> -->
  <main class="bg-[#0C1B2D]">
    <img src="/whoer/bg.svg" alt="" class="w-full left-0 top-0 absolute z-0">
    <Container class="relative z-10">
      <section class="pb-8 pt-30 text-center lg:(px-35 pb-18 pt-32)">
        <div class="text-white flex flex-col gap-1 items-center">
          <h1 class="text-8 font-[Archivo] font-700 lg:text-h1">
            {{ $t('Whoer.net：检查你的 IP 地址与匿名度') }}
          </h1>
          <p class="section-description text-white max-w-[826px]">
            {{ $t('使用 Whoer.net，只需几秒钟即可检查你的 IP 地址和在线匿名度。了解你的浏览器是否在泄露隐私数据，获取提升隐私安全的方法！') }}
          </p>
        </div>
        <div class="mt-6 flex justify-center lg:mt-8">
          <div class="rounded-2 bg-white flex max-w-[826px] w-full items-stretch justify-center overflow-hidden">
            <input
              v-model="ipInput"
              type="text"
              class="text-4 px-4 py-3.5 outline-none rounded-2 border-none flex-1 min-w-0 placeholder:text-[#7D8387] lg:px-8 lg:py-4.5"
              :placeholder="$t('请输入 IP 地址')"
              @keydown.enter="handleInquire"
            >
            <button
              type="button"
              class="text-14px text-white font-600 px-9 py-3.5 border-none bg-[#11a3fd] cursor-pointer whitespace-nowrap transition-colors duration-200 lg:py-4.5 hover:bg-[#1a7fd9] disabled:opacity-60 disabled:cursor-not-allowed"
              :disabled="ipQueryLoading"
              @click="handleInquire"
            >
              {{ ipQueryLoading ? $t('查询中...') : $t('立即查询') }}
            </button>
          </div>
        </div>
      </section>

      <section class="text-white mb-8 p-6 border-1 border-[#367698] rounded-3 border-solid bg-[rgba(12,26,43,0.05)] relative z-10 backdrop-blur-4 lg:(mb-18 p-12 rounded-8)">
        <div class="text-h5 font-600 flex flex-col gap-4 lg:font-700">
          <p class="flex gap-2 items-center">
            <SvgIcon :name="ip234JsonData?.country_code ? `country-code/${ip234JsonData.country_code}` : 'base/rx_ic_earth'" size="32" />
            {{ ip234JsonData?.country ?? '--' }}{{ ip234JsonData?.region ? `, ${ip234JsonData.region}` : '' }}
          </p>
          <p>
            {{ $t('My IP') }}: {{ ip234JsonData?.ip ?? '--' }}
          </p>
        </div>

        <div class="mt-5 gap-6 grid grid-cols-1 lg:(mt-6 grid-cols-2)">
          <div v-for="item in plane" :key="item.title" class="p-4 border-1 border-[#38657E] rounded-2 border-solid flex flex-col gap-4 lg:(px-8 py-6 rounded-6 gap-6)">
            <p class="text-body font-500 flex gap-2 items-center lg:text-h6">
              <SvgIcon :name="item.icon" :color="item.iconColor" size="1em" />
              {{ item.title }}
            </p>
            <div class="bg-[#38657E] h-1px" />
            <div class="text-4 font-700 flex flex-col gap-4">
              <div v-for="data in item.data" :key="data.label" class="flex flex-col gap-1 justify-between lg:flex-row">
                <p class="text-[#7D8387] font-[Inter]">
                  {{ data.label }}：
                </p>
                <p class="text-white font-[JetBrains_Mono] font-700 max-w-80 ellipsis-1">
                  {{ data.value }}
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-6 flex flex-col gap-3 w-full lg:mt-8">
          <div class="text-h6 font-600 flex flex-col gap-2 w-full justify-between lg:(flex-row gap-0)">
            <p class="max-lg:text-4.5">
              {{ $t('IP 地理位置可视化') }}
            </p>
            <p class="max-lg:text-3.5">
              {{ ipLocationCoords }}
            </p>
          </div>

          <div class="h-50 lg:h-373px">
            <IpLocationMap
              v-if="ip234JsonData?.country_code"
              :latitude="ip234JsonData?.latitude ?? null"
              :longitude="ip234JsonData?.longitude ?? null"
              :country-code="ip234JsonData?.country_code ?? null"
            />
          </div>
        </div>

        <div class="mt-4 gap-4 grid grid-cols-1 lg:(mt-8 gap-6 grid-cols-2)">
          <div class="px-8 py-4.5 border-1 border-[#38657E] rounded-4 border-solid flex flex-1 flex-col gap-1">
            <div class="text-4 text-[#7D8387] font-600">
              {{ $t('WebRTC 隐私泄露测试：') }}
            </div>
            <div class="text-4 text-white font-700 flex gap-2 items-center">
              <SvgIcon :name="webrtcLeakTestData.country_code ? `country-code/${webrtcLeakTestData.country_code}` : 'base/rx_ic_earth'" size="20" color="#11A3FD" />
              {{ webrtcLeakTestData.ip ?? '--' }}
            </div>
          </div>

          <div class="px-6 py-4.5 border-1 border-[#38657E] rounded-4 border-solid flex flex-1 flex-col gap-2 justify-between lg:(px-8 flex-row items-center)">
            <div class="flex flex-col gap-1">
              <div class="text-4 text-[#7D8387] font-600">
                {{ $t('DNS 解析检测：') }}
              </div>
              <div class="text-4 text-white font-700 flex gap-2 items-center">
                <template v-if="isLeakTestRunning">
                  --
                </template>
                <template v-else>
                  <SvgIcon name="base/rx_ic_check_fill" size="24" />
                  {{ dnsLeakTestData?.summary ?? '--' }}
                </template>
              </div>
            </div>

            <div
              class="text-3 text-white font-500 px-2 py-1.5 text-center rounded-1 min-w-20.5 w-20.5 select-none transition-opacity"
              :class="isLeakTestRunning ? 'cursor-not-allowed pointer-events-none bg-[#11A3FD]/60' : 'cursor-pointer bg-[#11A3FD]'"
              @click="handleRunLeakTests"
            >
              {{ isLeakTestRunning ? $t('检测中') : $t('检测') }}
            </div>
          </div>
        </div>
      </section>
    </Container>

    <div id="0" class="py-8 rounded-t-4 bg-[#F7F8F9] scroll-mt-5 lg:py-18 lg:rounded-t-14">
      <Container class="flex flex-col gap-6 lg:gap-12">
        <div class="flex flex-col gap-1 lg:gap-3">
          <h2 class="section-title text-center">
            {{ $t('不同 IP 通道下的 IP 信息') }}
          </h2>
          <p class="section-description">
            {{ $t('您的 IP 信息已通过多个数据源进行交叉验证，以确保检测结果的准确性。') }}
          </p>
        </div>

        <div class="gap-6 grid grid-cols-1 lg:grid-cols-3">
          <div v-for="item in Object.keys(ipCheckChannel).map(key => ({ type: key, ...(ipCheckChannel[key]) }))" :key="item.type" class="rounded-4 bg-white flex-1">
            <div class="px-6 py-4.5 border-b-1 border-[#DDD] border-b-solid flex items-center justify-between">
              <p class="text-5.5 text-primary font-600">
                {{ item.type }}
              </p>
              <div class="text-4 text-[#11A3FD] font-[JetBrains_Mono] font-700">
                {{ item.ip }}
              </div>
            </div>

            <div class="text-4 p-6 flex flex-col gap-4">
              <div v-for="data in item.data" :key="data.label" class="flex justify-between">
                <p class="text-inactive">
                  {{ data.label }}：
                </p>
                <p class="text-primary font-[JetBrains_Mono] font-700 max-w-200px ellipsis-1">
                  {{ data.value || '--' }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>

    <div id="1" class="scroll-mt-10">
      <FingerprintDetectionSection />
    </div>

    <div class="bg-[#F7F8F9]">
      <Container class="flex flex-col gap-6 lg:gap-12">
        <div class="py-8 bg-[#F7F8F9] lg:py-18">
          <div class="flex flex-col gap-3">
            <h2 class="section-title text-center">
              {{ $t('延伸阅读') }}
            </h2>
            <p class="section-description">
              {{ $t('您的 IP 信息已通过多个数据源进行交叉验证，以确保检测结果的准确性') }}
            </p>
          </div>

          <div class="mt-6 gap-4 grid grid-cols-1 lg:(mt-12 gap-[24px_16px] grid-cols-2) md:mt-10">
            <div v-for="item in extendRead" :key="item.label" class="px-6 py-5 rounded-4 bg-white flex gap-3 items-center justify-between lg:px-8">
              <div class="flex flex-col gap-1">
                <p class="text-4.5 font-500 lg:text-5.5">
                  {{ item.label }}
                </p>
                <p class="text-4 text-inactive font-500 break-all">
                  {{ item.value }}
                </p>
              </div>

              <a class="text-[#11A3FD] flex gap-1 whitespace-nowrap items-center" :href="item.value" target="_blank" rel="nofollow">
                <span class="text-4 font-500">{{ $t('详情') }}</span>
                <SvgIcon name="base/rx_ic_chevron_right" size="20" color="#11A3FD" />
              </a>
            </div>
          </div>

          <div class="mt-4 lg:mt-8">
            <FAQSection :items="faqList" :default-active="0" />
          </div>
        </div>
      </Container>
    </div>

    <!-- <SecurityRiskDetectionSection />

    <PrivacyEnhancementSuggestionsSection /> -->

    <HigherAnonymitySection />

    <div id="2" class="py-8 bg-white scroll-mt-10 lg:py-16">
      <Faq :fqa-list="faqList2" />
    </div>
  </main>
</template>
