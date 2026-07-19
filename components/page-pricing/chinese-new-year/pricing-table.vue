<script setup lang="ts">
import { useThrottleFn } from '@vueuse/core'
import currency from 'currency.js'
import { motion } from 'motion-v'
import { RxIcon } from '@/components/rx-icon'
import {
  markFormatter,
  popupFormatter,
  profileMarks,
  profileSteps,
  SubLevelEnum,
  tierList,
} from '../configs'
import Illustrate from '../illustrate.vue'
import { usePricingContext } from '../pricing-context'
import PanelLG from './panel-lg.vue'
import PricingInputNumber from './pricing-input-number.vue'
import RxSlider2 from './rx-slider2.vue'

const { $t, isZh } = useRxI18n()
const { discountedPrice, savePrice, discountDetails, totalDiscount, time } = usePricingContext()

const op = useTemplateRef('op')
let opTimer: NodeJS.Timeout | null = null
let isOpShow = false
function showIllustrate(e: MouseEvent) {
  opTimer && clearTimeout(opTimer)
  !isOpShow && op.value?.show(e)
  isOpShow = true
}

function hideIllustrate() {
  opTimer = setTimeout(() => {
    op.value?.hide()
    isOpShow = false
  }, 250)
}

const modelValue = defineModel<number>({
  default: 10,
})

const { downloadText } = useDownload()
const pricingRef = useTemplateRef<HTMLDivElement>('pricingRef')
const contentRef = ref<Record<string, HTMLDivElement>>({})
const stickyRef = useTemplateRef<HTMLDivElement>('stickyRef')
const columnsRef = ref<Record<string, HTMLDivElement>>({})

const stickyHeight = ref(0)
const packagesLeft = ref<Record<string, number>>({})
const bgHeight = ref(0)
const bgLeft = ref(0)
const curPack = ref(SubLevelEnum.Pro)
const bgWidth = ref(0)
const isSticky = ref(false)
const isShadow = ref(true)

const breakpoints = useRxBreakpoints()
const smWidth = breakpoints.smallerOrEqual('sm')

const selected1 = ref(SubLevelEnum.Basic)
const selected2 = ref(SubLevelEnum.Pro)
const { locale } = useRxI18n()

const windowTexts = computed(() => {
  return locale.value === 'en' ? 'Profiles' : $t('窗口')
})

const _1000 = (1000).toLocaleString()
const _10000 = (10000).toLocaleString()
const _100000 = (100000).toLocaleString()

// 套餐
const packages = computed(() => {
  const __packages = [
    {
      name: $t('免费版'),
      buttonText: $t('免费体验'),
      id: SubLevelEnum.Free,
      price: '0.00',
      value: 0,
      p: `5 ${windowTexts.value}`,
    },
    {
      name: $t('基础版'),
      buttonText: $t('获取基础版'),
      id: SubLevelEnum.Basic,
      price: '0.20',
      value: 100,
      p: `10-100 ${windowTexts.value}`,
    },
    {
      name: $t('专业版'),
      buttonText: $t('获取专业版'),
      id: SubLevelEnum.Pro,
      price: '0.12',
      value: 1000,
      p: `100-${_1000} ${windowTexts.value}`,
    },
    {
      name: $t('商业版'),
      buttonText: $t('获取商业版'),
      id: SubLevelEnum.Business,
      price: '0.08',
      value: 10000,
      p: `${_1000}-${_10000} ${windowTexts.value}`,
    },
    {
      name: $t('企业版'),
      buttonText: $t('获取企业版'),
      id: SubLevelEnum.Enterprise,
      price: '0.03',
      value: 100000,
      p: `${_10000}-${_100000} ${windowTexts.value}`,
    },
  ]
  // if (smWidth.value) {
  //   return [__packages[selected1.value], __packages[selected2.value]]
  // }
  return __packages
})

const pricingScheme = computed(() => {
  const scheme = [
    {
      title: $t('窗口管理'),
      features: [
        {
          name: startWithUpper($t('窗口')),
          desc: $t('独立配置文件，隔离环境，高效管理多账户。'),
          values: ['5', '≤ 100', `≤ ${(1000).toLocaleString()}`, `≤ ${(10000).toLocaleString()}`, `≤ ${(100000).toLocaleString()}`],
        },
        {
          name: $t('窗口转移'),
          desc: $t('支持窗口跨团队无缝迁移。'),
          values: [false, true, true, true, true],
        },
        {
          name: $t('窗口模板'),
          desc: $t('允许用户将调整的参数和选项保存为模板，以便下次快速创建窗口。'),
          values: [false, true, true, true, true],
        },
        {
          name: $t('窗口导出'),
          desc: $t('支持将窗口数据导出为 Excel 和 txt 文件格式。'),
          values: [true, true, true, true, true],
        },
        {
          name: $t('项目数量'),
          desc: $t('支持根据业务需求分组管理您的窗口。'),
          values: ['3', 'infinity', 'infinity', 'infinity', 'infinity'],
        },
        {
          name: $t('操作日志'),
          desc: $t('支持访问并查看操作日志，以监控账户安全并核实操作细节。'),
          values: [
            $t('3天'),
            $t('7天'),
            $t('15天'),
            $t('30天'),
            $t('60天'),
          ],
        },
        {
          name: $t('指纹参数'),
          desc: $t('支持根据具体需求自定义指纹参数。'),
          values: [true, true, true, true, true],
        },
        {
          name: $t('指纹模拟'),
          desc: $t('支持 Windows、macOS、iOS 和 Android 多系统浏览器指纹模拟。'),
          values: [true, true, true, true, true],
        },
        {
          name: $t('数据同步'),
          desc: $t('您的账户数据可以在多台设备上无缝同步。'),
          values: [true, true, true, true, true],
        },
        {
          name: $t('代理 IP 配置'),
          desc: $t('支持导入静态和动态代理 IP，兼容 HTTP、HTTPS、SOCKS5 和 SSH 协议。'),
          values: [true, true, true, true, true],
        },
      ],
      key: '1',
      calcHeight: true,
    },
    {
      title: $t('自动化工具'),
      features: [
        {
          name: $t('窗口同步'),
          desc: $t('旨在通过实现对多个窗口的同时操控来简化工作流程。'),
          values: [false, true, true, true, true],
        },
        {
          name: $t('API 访问'),
          desc: $t('支持与外部应用程序无缝集成。'),
          values: [$t('50r/m'), $t('100r/m'), $t('200r/m'), $t('300r/m'), $t('500r/m')],
        },
      ],
      key: '2',
      calcHeight: true,
    },
    {
      title: $t('团队协作'),
      features: [
        {
          name: $t('空间功能'),
          desc: $t('创建独立团队，确保数据和资源隔离，邀请成员时无需担心复杂权限限制。一键切换团队，实现安全高效协作。'),
          values: [
            { text: $t('$10/团队'), span: 5 },
            { text: $t('$10/团队'), span: 2 },
            { text: $t('$10/团队'), span: 2 },
            { text: $t('$10/团队'), span: 2 },
            { text: $t('$10/团队'), span: 2 },
          ],
        },
        {
          name: $t('团队成员'),
          desc: '/',
          values: [
            { text: $t('$5/成员'), span: 5 },
            { text: $t('$5/成员'), span: 2 },
            { text: $t('$5/成员'), span: 2 },
            { text: $t('$5/成员'), span: 2 },
            { text: $t('$5/成员'), span: 2 },
          ],
        },
        {
          name: $t('邀请&分配'),
          desc: $t('邀请成员加入项目并根据需要分配权限，以确保最大程度的数据安全和简化的工作流程。'),
          values: [
            { text: $t('可定制'), span: 5 },
            { text: $t('可定制'), span: 2 },
            { text: $t('可定制'), span: 2 },
            { text: $t('可定制'), span: 2 },
            { text: $t('可定制'), span: 2 },
          ],
        },
      ],
      key: '3',
      calcHeight: false,
    },
  ]

  if (smWidth.value) {
    const index1 = packages.value.findIndex(item => item.id === selected1.value)
    const index2 = packages.value.findIndex(item => item.id === selected2.value)
    scheme.forEach((item) => {
      item.features.forEach((feature) => {
        feature.values = [feature.values[index1], feature.values[index2]]
      })
    })
  }
  return scheme
})

const selectedOptions1 = computed(() => {
  const newPacks = [...packages.value]
  return newPacks.filter(item => item.id !== selected2.value).map(item => ({ label: item.name, value: item.id }))
})

const selectedOptions2 = computed(() => {
  const newPacks = [...packages.value]
  return newPacks.filter(item => item.id !== selected1.value).map(item => ({ label: item.name, value: item.id }))
})

const gridCols = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
  5: 'grid-cols-5',
}

function processedValues(values) {
  const colSpan = {
    1: 'col-span-1',
    2: 'col-span-2',
    3: 'col-span-3',
    4: 'col-span-4',
    5: 'col-span-5',
  }
  const newValues = []
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] === 'object') {
      newValues.push({
        text: values[i].text,
        class: colSpan[values[i].span],
      })
      i += values[i].span
    }
    else {
      newValues.push({
        text: values[i],
        class: colSpan['1'],
      })
    }
  }
  return newValues
}

const panelData = reactive({
  price: 0,
  min: 0,
  max: 0,
})

watchEffect(() => {
  const plan = modelValue.value === 0 ? tierList.find(item => item.minWindows === 0)! : tierList.find(item => item.minWindows < modelValue.value && item.maxWindows >= modelValue.value)!
  curPack.value = plan.subLevel
  // 边框导致的偏差
  bgLeft.value = packagesLeft.value[plan.subLevel]
  panelData.price = plan.windowPrice
  panelData.min = plan.minWindows
  panelData.max = plan.maxWindows
})

function getCurPack() {
  const plan = modelValue.value === 0 ? tierList.find(item => item.minWindows === 0)! : tierList.find(item => item.minWindows < modelValue.value && item.maxWindows >= modelValue.value)!
  return plan.subLevel
}

function handleClick(id: string) {
  const pack = packages.value.find(item => item.id == id)
  if (pack) {
    modelValue.value = pack.value
  }
}

const dropdownOp = useTemplateRef('dropdownOp')
let dropdownOpTimer: NodeJS.Timeout | null = null
let isDropdownOpShow = false
function showDiscountDetails(event) {
  dropdownOpTimer && clearTimeout(dropdownOpTimer)
  !isDropdownOpShow && dropdownOp.value?.show(event)
  isDropdownOpShow = true
}

function hideDiscountDetails(event) {
  dropdownOpTimer = setTimeout(() => {
    dropdownOp.value?.hide()
    isDropdownOpShow = false
  }, 250)
}

onMounted(() => {
  const resize = () => {
    let contentHeight = 0
    pricingScheme.value.forEach((item) => {
      const dom = contentRef.value[item.key]
      if (item.calcHeight && dom) {
        contentHeight += dom.getBoundingClientRect().height
      }
    })
    const __stickyHeight = stickyRef.value?.getBoundingClientRect().height
    stickyHeight.value = __stickyHeight || 0
    bgHeight.value = contentHeight + __stickyHeight

    const pricingRect = pricingRef.value?.getBoundingClientRect()

    packages.value.forEach((item) => {
      const dom = columnsRef.value[item.id]
      if (dom) {
        const rect = dom.getBoundingClientRect()
        // 边框导致的偏差
        bgWidth.value = rect.width + 1
        // padding 20 + border
        packagesLeft.value[item.id] = rect.left - pricingRect.left - 22
      }
    })

    const curPack = getCurPack()
    bgLeft.value = packagesLeft.value[curPack]
  }

  resize()
  window.addEventListener('resize', resize)

  const handleSticky = useThrottleFn(() => {
    const el = stickyRef.value!
    const rect = el.getBoundingClientRect()
    const computedTop = Number.parseFloat(window.getComputedStyle(el).top || '0')
    isSticky.value = rect.top <= computedTop

    const pricingRect = pricingRef.value?.getBoundingClientRect()
    isShadow.value = pricingRect?.bottom > window.innerHeight
  }, 50)

  handleSticky()

  window.addEventListener('scroll', handleSticky)

  // const { scrollY } = useScroll({
  //   target: pricingRef.value
  // })

  // useMotionValueEvent(scrollY, 'change', (latest) => {
  //   isShadow.value = !(latest > 720);
  // })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleSticky)
    window.removeEventListener('resize', resize)
  })
})

function getFreeIps() {
  return Math.floor(currency(discountedPrice.value).multiply(time.value / 30).value / 7)
}
</script>

<template>
  <div>
    <PanelLG
      v-model="modelValue"
      :show-illustrate="showIllustrate"
      :hide-illustrate="hideIllustrate"
      :show-dropdown="showDiscountDetails"
      :hide-dropdown="hideDiscountDetails"
      class="mt-10 grid lg:hidden"
    />

    <div class="mb-4 mt-6 bg-white flex gap-2.5 top-68px sticky z-10 sm:hidden">
      <RxInputSelect
        v-model="selected1"
        :options="selectedOptions1"
        :filter="false"
        size="lg"
        v-bind="{ optionValue: 'value' }"
      />
      <RxInputSelect
        v-model="selected2"
        :options="selectedOptions2"
        :filter="false"
        size="lg"
        v-bind="{ optionValue: 'value' }"
      />
    </div>

    <div ref="pricingRef" class="px-5 border border-1px border-[#C7CDD1] rounded-3 border-solid relative overflow-hidden sm:overflow-visible" v-bind="$attrs">
      <!-- 底部显示价格的区域 -->
      <div class="w-[calc(100%+40px)] hidden top-[calc(100vh-68px-44px)] sticky z-10 lg:block -translate-x-20px">
        <div class="h-[calc(68px+44px)] w-full absolute">
          <div
            class="text-4 text-white py-2 flex gap-3 w-full items-center justify-center" :style="{
              background: 'radial-gradient(101.35% 75.07% at 50% 100%, rgba(246, 104, 55, 0.90) 0%, rgba(246, 104, 55, 0.00) 100%), linear-gradient(0deg, #B61E0F 0%, #B61E0F 100%), #B61E0F',
            }"
          >
            <img src="/activity/chinese-new-year/icon_new_year_petal.svg" alt="chinese-new-year" class="w-5">
            <p>
              <span class="font-[Archivo]">{{ $t('Roxy 新年好礼：') }}</span>
              <span class="text-4 leading-22px font-[Inter] font-700">{{ $t('窗口套餐订阅 / 续费获赠等额兑换码 或 每消费 $7.00，解锁 1 个团队成员席位') }}</span>
            </p>
            <img src="/activity/chinese-new-year/icon_new_year_petal.svg" alt="chinese-new-year" class="w-5">
          </div>
          <div
            :class="cn('h-68px top-44px bg-white w-full flex items-center justify-between px-5 rounded-b-3', {
              'shadow-[0_2px_8px_0_rgba(0_0_0/0.1)]': isShadow,
            })"
          >
            <div class="flex gap-2.5 items-center ru-RU:(flex-col gap-1 items-start)">
              <svg v-if="isZh" width="80" height="26" viewBox="0 0 80 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="80" height="26" rx="6" fill="#FF0019" />
                <rect width="80" height="26" rx="6" fill="url(#paint0_radial_7545_38994)" />
                <path d="M16.624 7.704L16.464 9.016H10.112L10.256 7.704H12.704L12.384 6.392H13.92L14.272 7.704H16.624ZM17.456 8.712C17.4987 8.328 17.5947 8.04533 17.744 7.864C17.904 7.68267 18.1547 7.57067 18.496 7.528C18.9227 7.47467 19.6053 7.36267 20.544 7.192C21.216 7.064 22.0373 6.888 23.008 6.664L22.832 8.184C21.6587 8.46133 20.3733 8.68533 18.976 8.856L18.688 11.192H23.104L22.944 12.584H21.68L20.88 20.168H19.424L20.224 12.584H18.528L18.32 14.328C18.2027 15.4053 17.9733 16.52 17.632 17.672C17.3013 18.8133 16.9547 19.6773 16.592 20.264L15.152 19.832C15.4613 19.288 15.7013 18.7813 15.872 18.312H14.656L14.064 15.656H15.344L15.936 18.168C16.3627 17.0587 16.656 15.768 16.816 14.296L17.456 8.712ZM16.448 12.44H13.824L13.696 13.704H16.08L15.904 15.048H13.552L13.136 19.048C13.0293 19.8267 12.6293 20.1893 11.936 20.136C11.2747 20.072 10.6933 19.9813 10.192 19.864L10.368 18.488C10.6667 18.5733 11.0133 18.6427 11.408 18.696C11.44 18.7067 11.4773 18.712 11.52 18.712C11.6053 18.712 11.664 18.6373 11.696 18.488L12.064 15.048H9.44L9.6 13.704H12.208L12.352 12.44H9.408L9.584 11.128H11.296L10.88 9.384H12.144L12.608 11.128H13.84L14.528 9.384H15.824L15.168 11.128H16.592L16.448 12.44ZM9.968 15.64H11.328L10.032 18.648H8.592L9.968 15.64ZM31.232 20.248L31.648 16.408H25.136L25.312 14.952H27.12L27.424 12.44C27.4773 11.992 27.616 11.672 27.84 11.48C28.0747 11.288 28.416 11.192 28.864 11.192H32.208L32.432 9.096H28.96C28.448 9.88533 27.9627 10.5947 27.504 11.224H25.52C26.7147 9.58133 27.776 7.96533 28.704 6.376H30.592L29.84 7.672H38.688L38.512 9.096H34.048L33.824 11.192H37.84L37.664 12.584H33.664L33.424 14.952H38.752L38.576 16.408H33.264L32.864 20.248H31.232ZM32.048 12.584H28.96L28.656 14.952H31.792L32.048 12.584ZM45.184 6.424C44.9707 7.416 44.8 8.184 44.672 8.728H46.016C46.8267 8.728 47.232 9.192 47.232 10.12C47.232 10.5147 47.1733 10.9467 47.056 11.416C46.9387 11.8853 46.768 12.4987 46.544 13.256C46.256 14.2267 45.8667 15.16 45.376 16.056C45.8667 16.5467 46.4853 17.2133 47.232 18.056L45.968 18.968L45.248 18.136L44.56 17.368C43.8667 18.392 43.024 19.3413 42.032 20.216L40.624 19.464C41.7547 18.4613 42.72 17.384 43.52 16.232C43.328 16.0293 42.96 15.6667 42.416 15.144L42.128 14.872C41.968 14.7333 41.8507 14.6053 41.776 14.488C41.7013 14.36 41.664 14.2213 41.664 14.072C41.664 13.9227 41.7067 13.72 41.792 13.464C42.208 12.1733 42.528 11.0907 42.752 10.216H41.52L41.68 8.728H43.12C43.28 8.088 43.4347 7.32 43.584 6.424H45.184ZM54.976 13.832H51.856L51.264 18.984C51.2 19.432 51.056 19.7467 50.832 19.928C50.608 20.12 50.2987 20.2 49.904 20.168C49.1467 20.104 48.3467 19.9013 47.504 19.56L47.728 18.104C48.432 18.3493 49.0293 18.504 49.52 18.568C49.5413 18.5787 49.568 18.584 49.6 18.584C49.6533 18.584 49.6853 18.568 49.696 18.536C49.7173 18.4933 49.7333 18.4293 49.744 18.344L50.288 13.832H47.136L47.312 12.392H50.464L50.64 10.904L52.656 8.632H48.096L48.256 7.224H53.52C53.7973 7.224 54.0267 7.27733 54.208 7.384C54.4 7.48 54.5333 7.608 54.608 7.768C54.6507 7.85333 54.672 7.96 54.672 8.088C54.672 8.39733 54.5387 8.70667 54.272 9.016L52.144 11.384L52.032 12.392H55.152L54.976 13.832ZM44.288 10.216C43.8827 11.6453 43.504 12.8933 43.152 13.96L43.456 14.232C43.7973 14.5307 44.064 14.776 44.256 14.968C44.9173 13.6667 45.3867 12.2213 45.664 10.632L45.696 10.376C45.696 10.312 45.6747 10.2693 45.632 10.248C45.5893 10.2267 45.5147 10.216 45.408 10.216H44.288ZM63.856 9.88C63.3547 10.7333 62.7947 11.5013 62.176 12.184C62.912 12.792 63.6373 13.4907 64.352 14.28L63.168 15.304C62.6453 14.6213 62.1173 14.024 61.584 13.512L60.8 20.104H59.248L59.968 14.184C59.296 14.696 58.5707 15.1867 57.792 15.656L56.688 14.552C58.032 13.7627 59.0827 13.032 59.84 12.36C60.6933 11.592 61.3973 10.7867 61.952 9.944C62.0053 9.88 62.032 9.816 62.032 9.752C62.032 9.656 61.92 9.608 61.696 9.608H58.208L58.384 8.136H60.528L60.064 6.344H61.664L62.128 8.136H62.848C63.2533 8.136 63.5627 8.216 63.776 8.376C64 8.536 64.112 8.76 64.112 9.048C64.112 9.304 64.0267 9.58133 63.856 9.88ZM65.936 6.488H67.6L66.176 18.184C66.1653 18.216 66.16 18.2587 66.16 18.312C66.16 18.3867 66.1813 18.44 66.224 18.472C66.2773 18.4933 66.3627 18.504 66.48 18.504H67.2C67.6693 18.504 68.2667 18.4453 68.992 18.328C69.7707 18.2 70.3147 18.072 70.624 17.944L70.448 19.672C70.1707 19.7467 69.6267 19.8373 68.816 19.944C68.1333 20.0293 67.5307 20.072 67.008 20.072H65.76C65.312 20.072 64.976 19.9333 64.752 19.656C64.528 19.3893 64.4373 19.0267 64.48 18.568L65.936 6.488Z" fill="white" />
                <defs>
                  <radialGradient id="paint0_radial_7545_38994" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(40 26) scale(66.3629 24.3074)">
                    <stop stop-color="#FF9A4E" />
                    <stop offset="1" stop-color="#FF9A4E" stop-opacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              <svg v-else width="122" height="26" viewBox="0 0 122 26" fill="none" xmlns="http://www.w3.org/2000/svg">
                <rect width="122" height="26" rx="6" fill="#FF0019" />
                <rect width="122" height="26" rx="6" fill="url(#paint0_radial_7545_38996)" />
                <path d="M10.2284 7.56H12.0364L16.8684 16.408L16.9484 16.552L18.0524 7.56H19.8604L18.3884 19.576H16.5804L11.7324 10.76L11.6684 10.616L10.5644 19.576H8.75644L10.2284 7.56ZM25.4604 10.6C26.5591 10.6 27.3858 10.8613 27.9404 11.384C28.5058 11.896 28.7884 12.6587 28.7884 13.672C28.7884 13.9067 28.7724 14.1627 28.7404 14.44L28.5644 15.88H22.5964V15.896C22.5751 16.1307 22.5644 16.2907 22.5644 16.376C22.5644 16.92 22.7191 17.3253 23.0284 17.592C23.3484 17.848 23.8818 17.976 24.6284 17.976H25.4124C25.9671 17.976 26.8098 17.928 27.9404 17.832L27.7644 19.496C26.8258 19.592 25.9831 19.64 25.2364 19.64H24.4524C23.1618 19.64 22.2124 19.3787 21.6044 18.856C21.0071 18.3333 20.7084 17.5653 20.7084 16.552C20.7084 16.3067 20.7244 16.056 20.7564 15.8L20.9164 14.456C21.0658 13.176 21.4871 12.216 22.1804 11.576C22.8738 10.9253 23.8604 10.6 25.1404 10.6H25.4604ZM26.9164 14.328V14.312C26.9378 14.0773 26.9484 13.9067 26.9484 13.8C26.9484 13.288 26.8098 12.8987 26.5324 12.632C26.2658 12.3653 25.8391 12.232 25.2524 12.232H24.9324C23.6738 12.232 22.9591 12.9307 22.7884 14.328H26.9164ZM29.9629 10.664H31.8029L32.6669 17.912H32.9709L35.4349 11.464H37.8189L38.7469 17.912H39.0509L41.7229 10.664H43.5629L40.5549 18.904C40.3949 19.352 40.0856 19.576 39.6269 19.576H37.9789C37.7443 19.576 37.5523 19.5067 37.4029 19.368C37.2536 19.24 37.1629 19.048 37.1309 18.792L36.4269 13.416L34.4109 18.904C34.2509 19.3307 33.9576 19.5547 33.5309 19.576H31.8349C31.6003 19.576 31.4083 19.5067 31.2589 19.368C31.1096 19.24 31.0189 19.048 30.9869 18.792L29.9629 10.664ZM51.5727 14.456L47.9087 7.56H50.1647L52.5807 12.568H52.8207L56.3887 7.56H58.7087L53.4447 14.504L52.8367 19.576H50.9487L51.5727 14.456ZM63.3354 10.6C64.4341 10.6 65.2608 10.8613 65.8154 11.384C66.3808 11.896 66.6634 12.6587 66.6634 13.672C66.6634 13.9067 66.6474 14.1627 66.6154 14.44L66.4394 15.88H60.4714V15.896C60.4501 16.1307 60.4394 16.2907 60.4394 16.376C60.4394 16.92 60.5941 17.3253 60.9034 17.592C61.2234 17.848 61.7568 17.976 62.5034 17.976H63.2874C63.8421 17.976 64.6848 17.928 65.8154 17.832L65.6394 19.496C64.7008 19.592 63.8581 19.64 63.1114 19.64H62.3274C61.0368 19.64 60.0874 19.3787 59.4794 18.856C58.8821 18.3333 58.5834 17.5653 58.5834 16.552C58.5834 16.3067 58.5994 16.056 58.6314 15.8L58.7914 14.456C58.9408 13.176 59.3621 12.216 60.0554 11.576C60.7488 10.9253 61.7354 10.6 63.0154 10.6H63.3354ZM64.7914 14.328V14.312C64.8128 14.0773 64.8234 13.9067 64.8234 13.8C64.8234 13.288 64.6848 12.8987 64.4074 12.632C64.1408 12.3653 63.7141 12.232 63.1274 12.232H62.8074C61.5488 12.232 60.8341 12.9307 60.6634 14.328H64.7914ZM70.0459 19.576C69.2459 19.576 68.6059 19.352 68.1259 18.904C67.6459 18.4453 67.4059 17.8533 67.4059 17.128C67.4059 16.968 67.4113 16.8453 67.4219 16.76C67.5179 16.0987 67.6886 15.576 67.9339 15.192C68.1793 14.7973 68.5313 14.5147 68.9899 14.344C69.4593 14.1627 70.0726 14.072 70.8299 14.072H73.5179L73.5339 13.944C73.5446 13.8907 73.5499 13.816 73.5499 13.72C73.5499 13.304 73.4113 12.968 73.1339 12.712C72.8566 12.456 72.4246 12.328 71.8379 12.328H71.4219C70.4726 12.328 69.6193 12.3547 68.8619 12.408L69.1019 10.776L69.5659 10.744C69.7366 10.7333 70.0353 10.7173 70.4619 10.696C70.8993 10.6747 71.2779 10.664 71.5979 10.664H72.0299C73.1286 10.664 73.9606 10.9253 74.5259 11.448C75.0913 11.9707 75.3739 12.6693 75.3739 13.544C75.3739 13.64 75.3633 13.8053 75.3419 14.04L74.6859 19.576H70.0459ZM69.2459 16.952C69.2459 17.2613 69.3313 17.5013 69.5019 17.672C69.6833 17.832 69.9393 17.912 70.2699 17.912H73.0539L73.3259 15.672L70.6699 15.656C70.2646 15.6453 69.9393 15.7253 69.6939 15.896C69.4593 16.056 69.3153 16.344 69.2619 16.76L69.2459 16.952ZM82.3709 12.408C81.7096 12.3867 81.2829 12.376 81.0909 12.376C80.4083 12.376 79.8963 12.5413 79.5549 12.872C79.2136 13.192 79.0003 13.7253 78.9149 14.472L78.2749 19.576H76.4349L77.0589 14.52C77.2189 13.1653 77.6243 12.184 78.2749 11.576C78.9363 10.968 79.9443 10.664 81.2989 10.664C81.8323 10.664 82.2856 10.68 82.6589 10.712L82.3709 12.408ZM92.1864 17.88C92.7198 17.88 93.3331 17.8427 94.0264 17.768L94.4264 14.6H91.5784L91.7864 12.84H96.5224L95.7224 19.368C94.3144 19.5493 93.0771 19.64 92.0104 19.64H91.1784C89.6318 19.6293 88.5064 19.3253 87.8024 18.728C87.1091 18.1307 86.7624 17.1867 86.7624 15.896C86.7624 15.576 86.7891 15.1653 86.8424 14.664L87.0824 12.536C87.2318 11.3627 87.5198 10.4133 87.9464 9.688C88.3731 8.96267 88.9758 8.42933 89.7544 8.088C90.5331 7.74667 91.5251 7.57067 92.7304 7.56H93.1624C94.4531 7.56 95.6851 7.576 96.8584 7.608L96.6344 9.384L95.3064 9.352C94.1758 9.33067 93.3918 9.32 92.9544 9.32H92.4744C91.6958 9.32 91.0718 9.432 90.6024 9.656C90.1331 9.86933 89.7704 10.2 89.5144 10.648C89.2691 11.096 89.0984 11.6933 89.0024 12.44L88.7144 14.76C88.6718 15.1867 88.6504 15.4747 88.6504 15.624C88.6504 16.424 88.8531 17 89.2584 17.352C89.6744 17.6933 90.3838 17.8693 91.3864 17.88H92.1864ZM98.8269 9.464L99.0669 7.544H101.163L100.923 9.464H98.8269ZM99.5629 19.576H97.7229L98.8269 10.664H100.667L99.5629 19.576ZM110.843 12.376L110.347 16.456C110.336 16.5307 110.331 16.632 110.331 16.76C110.331 17.4747 110.683 17.832 111.387 17.832C111.685 17.832 112.219 17.8213 112.987 17.8L112.779 19.544C112.352 19.5653 111.819 19.576 111.179 19.576C110.304 19.576 109.627 19.3787 109.147 18.984C108.667 18.5893 108.427 18.0027 108.427 17.224C108.427 17.1387 108.437 16.9787 108.459 16.744L108.987 12.376H105.387L104.507 19.576H102.667L103.547 12.376H101.691L101.899 10.664H103.755L103.835 10.008C104.069 8.12 105.157 7.176 107.099 7.176C107.579 7.176 108.139 7.20267 108.779 7.256L108.523 8.952L107.995 8.92C107.483 8.89867 107.173 8.888 107.067 8.888C106.597 8.888 106.256 9.00533 106.043 9.24C105.829 9.464 105.696 9.816 105.643 10.296L105.595 10.664H109.211L109.483 8.392H111.323L111.051 10.664H113.771L113.563 12.376H110.843Z" fill="white" />
                <defs>
                  <radialGradient id="paint0_radial_7545_38996" cx="0" cy="0" r="1" gradientUnits="userSpaceOnUse" gradientTransform="translate(61 26) scale(101.203 24.3074)">
                    <stop stop-color="#FF9A4E" />
                    <stop offset="1" stop-color="#FF9A4E" stop-opacity="0" />
                  </radialGradient>
                </defs>
              </svg>

              <div class="font-500 flex gap-1 items-center">
                <RxI18nT :keypath="$t('赠送 {num} 个成员 / {profile} 个窗口兑换码', { num: '{num}', profile: '{profile}' })">
                  <template #num>
                    <span class="text-4.5 text-[#11A3FD]">{{ getFreeIps() }}</span>
                  </template>
                  <template #profile>
                    <span class="text-4.5 text-[#11A3FD]">{{ modelValue }}</span>
                  </template>
                </RxI18nT>
              </div>
            </div>
            <div class="flex gap-5 items-center">
              <template v-if="modelValue >= 10">
                <div class="flex gap-3 items-center">
                  <div
                    class="text-4.5 text-primary leading-26px font-[Archivo] font-600 inline-flex gap-1 hidden cursor-pointer items-center xl:flex !ru-RU:hidden [&_div]:hover:rotate-180"
                    @click="showDiscountDetails"
                    @mouseenter="showDiscountDetails"
                    @mouseleave="hideDiscountDetails"
                  >
                    {{ $t('详细折扣信息') }}
                    <div class="flex transition-transform duration-150 items-center justify-center">
                      <RxIcon name="base/rx_ic_chevron_down" />
                    </div>
                  </div>
                  <div class="text-4 text-white leading-24px font-[Inter] font-700 px-3 rounded-full bg-[#F53838] hidden xl:block">
                    {{ $t('{discount}% 折扣', { discount: `-${totalDiscount}` }) }}
                  </div>
                  <div class="text-[#12A3FC] font-700">
                    <span class="text-6">$</span>
                    <span class="text-9">
                      {{ currency(discountedPrice).format().replace('$', '') }}
                    </span>
                  </div>
                  <div class="flex flex-col gap-1">
                    <div class="text-sub-title text-primary font-[Inter] flex gap-1 items-center">
                      /{{ $t('月') }}
                      <div @click="showIllustrate" @mouseenter="showIllustrate" @mouseleave="hideIllustrate">
                        <RxIcon name="base/rx_ic_info" />
                      </div>
                    </div>
                    <div v-if="savePrice > 0" class="text-3 text-[#FC9D12] px-1 py-2px rounded-1 bg-[#FFEEDC]">
                      {{ $t('节省') }} {{ currency(savePrice).format() }}
                    </div>
                  </div>
                </div>
              </template>
              <template v-else>
                <span class="text-sub-title text-primary font-500">{{ $t('5个免费窗口') }}</span>
              </template>
              <CtaDownloadBtnByHome class="!px-22px !py-2.5">
                {{ downloadText }}
              </CtaDownloadBtnByHome>
            </div>
          </div>
        </div>
      </div>

      <!-- 表格头部 -->
      <div ref="stickyRef" class="hidden top-72px sticky z-10 sm:block">
        <div class="flex relative" :class="{ 'packages-container': isSticky }">
          <div class="pricing-column" />
          <div
            v-for="pack in packages"
            :key="pack.id"
            :ref="el => columnsRef[pack.id] = el"
            :class="cn('pricing-column cursor-pointer', { highlight: pack.id === curPack && isSticky })"
            @click="handleClick(pack.id)"
          >
            <h3 class="text-body font-[Archivo] font-700">
              {{ pack.name }}
            </h3>
            <p class="text-14px text-[#575D60] leading-[1.4] font-400">
              {{ pack.p }}
            </p>
          </div>
        </div>

        <div class="slider-container pb-6 pt-3 h-116px hidden relative lg:flex">
          <div class="flex flex-col gap-3 w-236px !p-0 !border-r-0">
            <span class="text-14px leading-18px font-700 multilingual-text">{{ $t('额外的窗口数量') }}</span>
            <div>
              <PricingInputNumber v-model="modelValue" :step="{ ...profileSteps }" :min="0" :max="100000" />
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-3 relative z-10">
            <span class="invisible">1</span>
            <RxSlider2
              v-model="modelValue" :scale="0.015" :min="0" :max="100000" :marks="profileMarks" :step="{ ...profileSteps }" :group="packages" :mark-formatter="markFormatter"
              :popup-formatter="popupFormatter" class="rx-slider-2"
            >
              <template #default="{ profile }">
                <div
                  :class="cn(
                    'bg-white p-3 flex flex-col gap-2',
                    'border border-solid border-[#C7D1D6] rounded-2',
                    'shadow-[0_2px_8px_0_rgba(0_0_0/0.15)]',
                  )"
                >
                  <template v-if="profile !== 0">
                    <div>
                      <span class="text-[#FC9D12] font-600">$ </span>
                      <span class="text-6 text-[#FC9D12] font-600">{{ panelData.price }}</span>
                      <span class="text-primary font-500"> /{{ startWithUpper($t('窗口')) }}</span>
                    </div>
                    <div class="text-3 text-[#A3A9AD] whitespace-pre">
                      <rx-i18n-t
                        :keypath="$t('窗口单价 （{min}-{max} 数量区间）', {
                          min: panelData.min.toLocaleString(),
                          max: panelData.max.toLocaleString(),
                        })"
                      />
                    </div>
                  </template>
                  <template v-else>
                    {{ $t('5个免费窗口') }}
                  </template>
                </div>
              </template>
            </RxSlider2>
          </div>
        </div>
      </div>

      <div class="pricing-content relative z-9">
        <div v-for="scheme in pricingScheme" :key="scheme.title" :ref="el => contentRef[scheme.key] = el" class="relative z-9">
          <h4 class="section-title ru-RU:text-5.5">
            {{ scheme.title }}
          </h4>
          <div class="feature-list">
            <div v-for="feature in scheme.features" :key="feature.name" class="feature-row">
              <div
                :class="cn('feature-name', {
                  '!decoration-none': feature.desc === '/',
                })"
              >
                <span v-if="feature.desc !== '/'" v-tooltip.top="{ value: feature.desc, pt: { text: 'min-w-240px' } }">
                  {{ feature.name }}
                </span>
                <span v-else>
                  {{ feature.name }}
                </span>
              </div>
              <div :class="cn('grid h-full flex-1 w-full', gridCols[feature.values.length])">
                <div v-for="(value, index) in processedValues(feature.values)" :key="index" :class="cn('feature-value', value.class)">
                  <template v-if="typeof value.text === 'boolean'">
                    <RxIcon v-if="value.text" filled name="base/rx_ic_check" />
                    <RxIcon v-else filled name="base/rx_ic_close" />
                  </template>
                  <template v-else-if="value.text === 'infinity'">
                    <RxIcon filled name="base/rx_ic_infinity" />
                  </template>
                  <template v-else>
                    {{ value.text }}
                  </template>
                </div>
              </div>
            </div>
          </div>
        </div>

        <motion.div
          :style="{
            height: `${bgHeight + 12}px`,
            top: `-${stickyHeight + 12}px`,
            width: `${bgWidth}px`,
          }" :animate="{
            left: `${bgLeft}px`,
          }" class="border-1 border-[#12A3FC] rounded-3 border-solid bg-[linear-gradient(177deg,#FAFDFE_0%,#E4F2FC_113.86%)] hidden absolute z-8 sm:block"
        />
      </div>

      <img src="/1.svg" class="rounded-3 h-full w-full hidden left-50% top-0 absolute z-8 object-cover sm:block -translate-x-50%" alt="">
    </div>
  </div>

  <Popover
    ref="op" :pt="{
      root: {
        class: '!border-0 !bg-transparent before:!hidden after:!hidden',
      },
      content: {
        class: '!p-0',
      },
    }"
  >
    <div @mouseleave="hideIllustrate" @mouseenter="showIllustrate">
      <Illustrate class="w-[392px]" />
    </div>
  </Popover>

  <Popover
    ref="dropdownOp"
    :pt="{
      root: {
        class: 'before:!hidden after:!hidden',
      },
    }"
  >
    <div class="flex flex-col gap-2.5 w-240px ru-RU:w-300px" @mouseleave="hideDiscountDetails" @mouseenter="showDiscountDetails">
      <div
        v-for="(item, index) in discountDetails.filter(item => !item.hide)"
        :key="index"
        class="leading-24px font-500 flex items-center justify-between"
      >
        <template v-if="!item.component">
          <span class="text-4 text-primary" :class="item.labelClass">{{ item.label }}</span>
          <span class="text-4.5 text-[#FD9F12]" :class="item.valueClass">-{{ item.value }}%</span>
        </template>
        <component :is="item.component" v-else v-bind="item" />
      </div>
    </div>
  </Popover>
</template>

<style scoped lang="scss">
.rx-slider-2 {
  :deep(.mark-1) {
    display: none;
  }
}

.pricing-column {
  padding: 12px 0px 12px 16px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  box-sizing: border-box;
}

@media (max-width: 1024px) {
  .pricing-column:first-child {
    display: none;
  }

  .pricing-column:first-child,
  .feature-name {
    width: auto !important;
  }

  .pricing-column:nth-of-type(2) {
    border-left: none !important;
  }
}

.pricing-column:first-child,
.feature-name {
  width: 236px;
}

.pricing-column:not(:first-child) {
  flex: 1;
}

.pricing-column:not(:first-child) {
  border-left: 1px solid rgba(199, 205, 209, 0.2);
}

.pricing-column.highlight {
  @apply bg-[#0A9966]/6;
}

// .pricing-column.highlight + .pricing-column {
//   border-left-color: #1dc94d;
//   border-left-width: 2px;
// }

// .pricing-column.highlight {
//   border-left: 2px solid #1dc94d;
// }

// .pricing-column.highlight:last-child {
//   border-right: 2px solid #1dc94d;
// }

.section-title {
  height: 50px;
  line-height: 50px;
  position: relative;

  color: #042144;
  font-size: 18px;
  font-weight: 600;
}

.packages-container::before,
.packages-container::after,
.slider-container::before,
.slider-container::after,
.section-title::before,
.section-title::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 20px;
  top: 0;
}

.slider-container::before,
.packages-container::before {
  left: -19px !important;
  width: 19px;
  // border-radius: 0 0 0 12px;
}

.packages-container::before,
.section-title::before,
.slider-container::before {
  left: -20px;
}

.packages-container::after,
.section-title::after,
.slider-container::after {
  right: -20px;
}

.section-title,
.section-title::before,
.section-title::after {
  background: #f4f5f6;
}

.slider-container,
.slider-container::after,
.slider-container::before {
  background-color: #fff;
}

.packages-container,
.packages-container::after,
.packages-container::before {
  background-color: #fff;
}

.feature-name {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;

  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-skip-ink: auto;
  text-decoration-color: #c7cdd1;

  text-decoration-thickness: 10%;
  /* 1.6px */
  text-underline-offset: 25%;
  /* 4px */
  text-underline-position: from-font;
  white-space: pre;
  border-right: 1px solid rgba(199, 205, 209, 0.2);
  white-space: pre-wrap;
}

/* .feature-name  span {
  word-wrap:break-word;
} */

.feature-desc {
  color: var(--Color-neutrals-300, #c7cdd1);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px;
  /* 133.333% */
}

.feature-row {
  height: 54px;
  display: flex;
  align-items: center;
}

@media (max-width: 1024px) {
  .feature-row {
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    height: auto;
  }

  .feature-name,
  .feature-value {
    height: 54px !important;
    border-right: none !important;
  }
}

.feature-row:hover {
  // background: rgba(51, 169, 255, 0.1) !important;
}

.feature-row:hover .highlight,
.feature-row:hover .highlight::after {
  // background: transparent !important;
}

.feature-values {
  flex: 1;
  display: flex;
  align-items: center;
  height: 100%;
}

.feature-value {
  flex: 1;
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature-value.highlight {
  background: linear-gradient(0deg, #fffbf6 0%, #fffbf6 100%), #fff;
}

.feature-value:not(:last-child) {
  border-right: 1px solid rgba(199, 205, 209, 0.2);
}
</style>
