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

/** 移动端 PanelLG 额外类，供单页覆盖 margin 等 */
const { mobilePanelClass } = defineProps<{
  mobilePanelClass?: string
}>()
const { $t, isZh } = useRxI18n()
const { discountedPrice, savePrice, discountDetails, totalDiscount } = usePricingContext()

const modelValue = defineModel<number>({
  default: 10,
})

const { downloadText } = useDownload()
const pricingRef = useTemplateRef<HTMLDivElement>('pricingRef')
const contentRef = ref<Record<string, HTMLDivElement>>({})
const stickyRef = useTemplateRef<HTMLDivElement>('stickyRef')
/** PC 底部价格栏 sticky 容器，用于判断是否吸附在视口底部 */
const bottomStickyRef = useTemplateRef<HTMLDivElement>('bottomStickyRef')
const columnsRef = ref<Record<string, HTMLDivElement>>({})

const stickyHeight = ref(0)
const packagesLeft = ref<Record<string, number>>({})
const bgHeight = ref(0)
const bgLeft = ref(0)
const curPack = ref(SubLevelEnum.Pro)
const bgWidth = ref(0)
const isSticky = ref(false)
const isShadow = ref(false)

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
    const topStickyEl = stickyRef.value
    if (topStickyEl) {
      const rect = topStickyEl.getBoundingClientRect()
      const computedTop = Number.parseFloat(window.getComputedStyle(topStickyEl).top || '0')
      isSticky.value = rect.top <= computedTop
    }

    // 底部价格栏吸附到视口底部时才加阴影
    const bottomStickyEl = bottomStickyRef.value
    const pricingRect = pricingRef.value?.getBoundingClientRect()
    if (bottomStickyEl && pricingRect) {
      const rect = bottomStickyEl.getBoundingClientRect()
      const stickyTop = Number.parseFloat(window.getComputedStyle(bottomStickyEl).top || '0')
      isShadow.value = rect.top <= stickyTop + 1 && pricingRect.bottom > window.innerHeight
    }
    else {
      isShadow.value = false
    }
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
  return Math.floor(discountedPrice.value / 7)
}
</script>

<template>
  <div>
    <PanelLG
      v-model="modelValue"
      :class="cn('mt-5 grid lg:hidden', mobilePanelClass)"
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
      <div
        ref="bottomStickyRef"
        class="w-[calc(100%+40px)] hidden top-[calc(100vh-68px-34px)] sticky z-10 lg:block -translate-x-20px"
      >
        <div class="h-17 w-full top-32px absolute">
          <div
            :class="cn('h-17 bg-white w-full flex items-center justify-between px-5 transition-shadow duration-200', {
              'shadow-[0_2px_8px_0_rgba(0_0_0/0.1)]': isShadow,
            })"
          >
            <div class="font-500 flex gap-2.5 items-center ru-RU:(flex-col gap-1 items-start)">
              {{ $t('{num} 个窗口', { num: modelValue > 0 ? `5 + ${modelValue}` : 5 }) }}
            </div>
            <div class="flex gap-5 items-center">
              <template v-if="modelValue >= 10">
                <div class="flex gap-3 items-center">
                  <RxTooltip
                    trigger="hover"
                    placement="top"
                    tooltip-content-class="!bg-white"
                    :offset="10"
                  >
                    <template #content>
                      <div class="p-3 flex flex-col gap-2.5 w-240px ru-RU:w-300px">
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
                    </template>
                    <div
                      class="text-4.5 text-primary leading-26px font-[Archivo] font-600 inline-flex gap-1 hidden cursor-pointer items-center -mb-3 xl:flex !ru-RU:hidden [&_div]:hover:rotate-180"
                    >
                      {{ $t('详细折扣信息') }}
                      <div class="flex transition-transform duration-150 items-center justify-center">
                        <RxIcon name="base/rx_ic_chevron_down" />
                      </div>
                    </div>
                  </RxTooltip>
                  <div class="text-4 text-white leading-24px font-[Inter] font-700 px-3 rounded-full bg-[#F53838] hidden -mb-2.5 xl:block">
                    {{ $t('{discount}% 折扣', { discount: `-${totalDiscount}` }) }}
                  </div>
                  <div class="text-[#12A3FC] font-700">
                    <span class="text-6">$</span>
                    <span class="text-9">
                      {{ currency(discountedPrice).format().replace('$', '') }}
                    </span>
                  </div>
                  <div class="flex flex-col">
                    <div class="text-sub-title text-primary font-[Inter] flex gap-1 items-center">
                      /{{ $t('月') }}
                      <RxTooltip
                        trigger="hover"
                        placement="top"
                        tooltip-content-class="!bg-transparent"
                        :offset="10"
                      >
                        <template #content>
                          <div class="p-0">
                            <Illustrate class="w-[392px]" />
                          </div>
                        </template>
                        <div class="cursor-pointer">
                          <RxIcon name="base/rx_ic_info" />
                        </div>
                      </RxTooltip>
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
                <span v-if="feature.desc !== '/'">
                  <RxTooltip
                    trigger="hover"
                    placement="top"
                    :offset="10"
                  >
                    <template #content>
                      <div class="text-white px-2.5 py-1 max-w-200px">{{ feature.desc }}</div>
                    </template>
                    <span class="underline underline-offset-2 decoration-dotted cursor-pointer">
                      {{ feature.name }}
                    </span>
                  </RxTooltip>
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
</template>

<style scoped lang="scss">
// .discount-details-tooltip {
//   background-color: #fff !important;
//   color: #000 !important;
//   border: 1px solid #e0e0e0 !important;
//   border-radius: 8px !important;
//   box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1) !important;
// }

// .discount-details-tooltip .text-primary {
//   color: #12A3FC !important;
// }

// .discount-details-tooltip {
//   color: #FD9F12 !important;
// }

.feature-desc-tooltip {
  min-width: 240px !important;
  background-color: rgba(51, 51, 51, 0.95) !important;
  color: #fff !important;
  border-radius: 4px !important;
  padding: 8px 12px !important;
}

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
