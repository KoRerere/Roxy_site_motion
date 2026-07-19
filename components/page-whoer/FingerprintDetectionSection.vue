<script setup lang="tsx">
import type { PropType } from 'vue'
import type { SvgNames } from '../rx-icon/svg-icon-types'
import { toast } from 'vue-sonner'
import { defineComponent } from 'vue'
import SvgIcon from '../rx-icon/svg-icon.vue'

const props = withDefaults(
  defineProps<{
    /** 硬件规格卡片 */
    hardware?: SpecCard
    /** 软件环境卡片 */
    software?: SpecCard
    /** 指纹哈希值，不传则使用客户端生成的指纹 */
    fingerprintHash?: string
  }>(),
  {
    hardware: undefined,
    software: undefined,
    fingerprintHash: undefined,
  },
)

export interface SpecItem {
  label: string
  value: string
}

export interface SpecCard {
  title: string
  icon: SvgNames
  data: SpecItem[]
}

/** 硬件规格卡片（带深色头部的两列 label-value 布局） */
const HardwareSpecCard = defineComponent({
  name: 'HardwareSpecCard',
  props: {
    card: { type: Object as PropType<SpecCard>, required: true },
  },
  setup(props) {
    return () => (
      <div class="border-1 border-[#0A96E1] rounded-4 border-solid bg-[#111213] flex flex-col overflow-hidden lg:rounded-8">
        <div class="px-6 py-6 bg-[#00385B] flex gap-3 items-center lg:px-8">
          <SvgIcon name={props.card.icon} size="24" color="#C7D1D6" />
          <p class="text-5 text-white font-600 m-0 lg:text-5.5">
            {props.card.title}
          </p>
        </div>
        <div class="text-4 p-8 flex flex-row gap-8 min-w-0">
          <div class="text-left flex shrink-0 flex-col gap-1 gap-5">
            {props.card.data.map(item => (
              <p key={item.label} class="text-[#7D8387] leading-24px m-0">
                {item.label}
                :
              </p>
            ))}
          </div>
          <div class="text-left flex flex-1 flex-col gap-1 gap-5 min-w-0">
            {props.card.data.map(item => (
              <p key={item.label} class="text-[#E2E9EE] leading-24px font-700 m-0 truncate" title={item.value}>
                {item.value}
              </p>
            ))}
          </div>
        </div>
      </div>
    )
  },
})

const hashDisplay = ref('')
const copySuccess = ref(false)

/** 从浏览器 API 获取硬件规格（仅与设备/GPU/屏幕等硬件相关的指纹指标，Battery 为异步） */
async function getHardwareSpec(): Promise<SpecItem[]> {
  const screenRes = typeof screen !== 'undefined'
    ? `${screen.width}×${screen.height} (Available: ${screen.availWidth}×${screen.availHeight})`
    : '--'
  const devicePixelRatio = typeof window !== 'undefined' ? String(window.devicePixelRatio ?? '--') : '--'
  const colorDepth = typeof screen !== 'undefined' ? `${screen.colorDepth}-bit` : '--'
  const hardwareConcurrency = typeof navigator !== 'undefined' && navigator.hardwareConcurrency != null
    ? String(navigator.hardwareConcurrency)
    : '--'
  const deviceMemory = typeof navigator !== 'undefined' && 'deviceMemory' in navigator && (navigator as { deviceMemory?: number }).deviceMemory != null
    ? `${(navigator as { deviceMemory: number }).deviceMemory} GB`
    : '--'
  let webglRenderer = '--'
  let webglVendor = '--'
  if (typeof document !== 'undefined') {
    try {
      const canvas = document.createElement('canvas')
      const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl') as WebGLRenderingContext | null
      if (gl) {
        const standardRenderer = gl.getParameter(gl.RENDERER)
        const vendor = gl.getParameter(gl.VENDOR)
        if (standardRenderer)
          webglRenderer = String(standardRenderer)
        if (vendor)
          webglVendor = String(vendor)
      }
    }
    catch {
      // ignore
    }
  }

  return [
    { label: $t('屏幕分辨率'), value: screenRes },
    { label: $t('设备像素比'), value: devicePixelRatio },
    { label: $t('色深'), value: colorDepth },
    { label: $t('CPU 核心数'), value: hardwareConcurrency },
    { label: $t('设备内存'), value: deviceMemory },
    { label: $t('WebGL 渲染器'), value: webglRenderer },
    { label: $t('WebGL 厂商'), value: webglVendor },
  ]
}

/** 获取当前系统时间字符串（用于静态初始值与动态刷新） */
function getCurrentSystemTimeString(): string {
  if (typeof Date === 'undefined')
    return '--'
  try {
    const now = new Date()
    return new Intl.DateTimeFormat(undefined, {
      dateStyle: 'medium',
      timeStyle: 'medium',
    }).format(now)
  }
  catch {
    return new Date().toLocaleString()
  }
}

/** 从浏览器 API 获取软件环境（应用版本/产品使用 User-Agent Client Hints，不再用已弃用 API） */
async function getSoftwareSpec(): Promise<SpecItem[]> {
  const systemTime = getCurrentSystemTimeString()

  // 时区
  let timeZone = '--'
  if (typeof Intl !== 'undefined') {
    try {
      const formatter = new Intl.DateTimeFormat(undefined, { timeZoneName: 'long' })
      const parts = formatter.formatToParts(new Date())
      const tzName = parts.find(p => p.type === 'timeZoneName')?.value ?? Intl.DateTimeFormat().resolvedOptions().timeZone
      const offset = -new Date().getTimezoneOffset()
      const sign = offset >= 0 ? '+' : '-'
      const hours = Math.floor(Math.abs(offset) / 60)
      const mins = Math.abs(offset) % 60
      timeZone = `${tzName} (UTC${sign}${hours}${mins ? `:${String(mins).padStart(2, '0')}` : ''})`
    }
    catch {
      timeZone = Intl.DateTimeFormat().resolvedOptions().timeZone ?? '--'
    }
  }

  // 是否启用 JavaScript（能执行到此处即已启用）
  const jsEnabled = typeof window !== 'undefined' ? $t('是') : '--'

  const userAgent = typeof navigator !== 'undefined' ? navigator.userAgent : '--'

  return [
    { label: $t('系统时间'), value: systemTime },
    { label: $t('时区'), value: timeZone },
    { label: $t('语言'), value: navigator.language },
    { label: $t('平台'), value: navigator.platform },
    { label: $t('产品'), value: navigator.appName },
    { label: 'User Agent', value: userAgent },
    { label: $t('是否启脚本'), value: jsEnabled },
  ]
}

const defaultHardware = ref<SpecCard>({
  title: $t('硬件规格'),
  icon: 'whoer/hardware',
  data: [],
})

const defaultSoftware = ref<SpecCard>({
  title: $t('软件环境'),
  icon: 'whoer/software',
  data: [],
})

const hardwareCard = computed(() => props.hardware ?? defaultHardware.value)
const softwareCard = computed(() => props.software ?? defaultSoftware.value)

const sampleHash = '--'

/** 占位哈希，SSR 或未获取到指纹时显示 */
hashDisplay.value = sampleHash

let systemTimeTimer: ReturnType<typeof setInterval> | null = null

onMounted(async () => {
  if (!props.hardware) {
    const hardwareData = await getHardwareSpec()
    defaultHardware.value = { ...defaultHardware.value, data: hardwareData }
  }
  if (!props.software) {
    const softwareData = await getSoftwareSpec()
    defaultSoftware.value = { ...defaultSoftware.value, data: softwareData }
    const systemTimeLabel = $t('系统时间')
    systemTimeTimer = setInterval(() => {
      defaultSoftware.value = {
        ...defaultSoftware.value,
        data: defaultSoftware.value.data.map(item =>
          item.label === systemTimeLabel ? { ...item, value: getCurrentSystemTimeString() } : item,
        ),
      }
    }, 1000)
  }

  if (props.fingerprintHash) {
    hashDisplay.value = props.fingerprintHash
    return
  }
  try {
    const fp = await getFingerprint()
    if (fp?.get) {
      const { visitorId } = await fp.get()
      if (visitorId)
        hashDisplay.value = visitorId
    }
  }
  catch {
    // 保持 sampleHash 占位
  }
})

onUnmounted(() => {
  if (systemTimeTimer) {
    clearInterval(systemTimeTimer)
    systemTimeTimer = null
  }
})

watch(() => props.fingerprintHash, (v) => {
  if (v)
    hashDisplay.value = v
}, { immediate: true })

async function copyHash() {
  if (!hashDisplay.value || copySuccess.value)
    return
  try {
    await navigator.clipboard.writeText(hashDisplay.value)
    copySuccess.value = true
    toast.success($t('复制成功'), { description: hashDisplay.value })
    setTimeout(() => {
      copySuccess.value = false
    }, 2000)
  }
  catch {
    // fallback for older browsers
    copySuccess.value = false
  }
}
</script>

<template>
  <section class="py-8 text-center flex flex-col gap-12 from-[#0C1B2D] to-[#215799] bg-gradient-to-b lg:py-18">
    <Container>
      <div class="flex flex-col gap-3 items-center">
        <h2 class="section-title text-[#D4DADD]">
          {{ $t('浏览器指纹检测') }}
        </h2>
        <p class="section-description text-[#C7D1D6]">
          {{ $t('分析浏览器可追踪特征，了解网站如何识别您的身份。') }}
        </p>
      </div>

      <div class="mt-6 gap-4 grid grid-cols-1 lg:(mt-14 gap-6) md:(mt-10 grid-cols-2)">
        <HardwareSpecCard :card="hardwareCard" />
        <HardwareSpecCard :card="softwareCard" />
      </div>

      <div class="mt-12 items-center">
        <div class="flex flex-col gap-1 items-center">
          <h3 class="text-5.5 text-[#D4DADD] font-[Archivo] font-700 m-0 lg:text-h4">
            {{ $t('您的浏览器指纹哈希') }}
          </h3>
          <p class="text-3.5 text-[#D4DADD] m-0 lg:text-body">
            {{ $t('建议使用 RoxyBrowser 指纹浏览器以更好地保护您的隐私。') }}
          </p>
        </div>
        <div
          class="mt-6 px-6 py-3 rounded-2 bg-[#111213] flex gap-3 w-full items-center"
        >
          <span class="text-3.5 text-[#11A3FD] font-[JetBrains_Mono] font-500 flex-1 lg:text-6">
            {{ hashDisplay }}
          </span>
          <button
            type="button"
            class="text-[#11A3FD] flex cursor-pointer transition-opacity items-center hover:opacity-80"
            :aria-label="$t('复制')"
            @click="copyHash"
          >
            <SvgIcon name="base/rx_ic_copy" size="20" color="#11A3FD" />
          </button>
        </div>
      </div>
    </Container>
  </section>
</template>
