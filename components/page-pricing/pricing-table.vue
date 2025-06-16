<template>
  <div>
    <div class="flex sm:hidden gap-10px mt-6 mb-4 sticky top-68px bg-white z-10">
      <RxInputSelect 
        v-model="selected1" 
        :options="selectedOptions1" 
        :filter="false" 
        size="lg"
        optionValue="value"
      />
      <RxInputSelect 
        v-model="selected2" 
        :options="selectedOptions2" 
        :filter="false" 
        size="lg"
        optionValue="value"
      />
    </div>

    <div 
      class="relative border border-solid border-[#C7CDD1] border-1px rounded-3 px-5 overflow-hidden sm:overflow-visible"
      ref="pricingRef"
      v-bind="$attrs"
    >
      <div 
        class="hidden lg:block sticky top-[calc(100vh-68px)] translate-x-[-19px] w-[calc(100%+38px)] z-10"
      >
        <div 
          :class="cn('absolute h-68px top-2px bg-white w-full flex items-center justify-end', {
            'shadow-[0_2px_8px_0_rgba(0_0_0/0.1)]': isShadow
          })"
        >
          <div class="flex items-center gap-5">
            <template v-if="moduleValue >= 10">
              <div class="flex items-center gap-3">
                <div class="text-[#12A3FC] font-700">
                  <span class="text-sub-title font-500 text-primary mr-10px">{{ modelValue }}+5 {{ $t('个窗口') }}</span>
                  <span class="text-6">$</span>
                  <span class="text-9">
                    {{ currency(monthPrice).format().replace('$', '') }}
                  </span>
                </div>
                <div class="flex flex-col gap-1">
                  <div class="text-sub-title text-primary font-[Archivo] flex items-center gap-1">
                    /{{ $t('月') }}
                    <div
                      @click="openHandler" 
                      @mouseenter="openHandler" 
                    >
                      <RxIcon name="base/rx_ic_info" />
                    </div>
                  </div>
                  <div class="text-[#FC9D12] text-3 py-2px px-1 bg-[#FFEEDC] rounded-1" v-if="monthSave > 0">
                    {{ $t('节省') }} {{ currency(monthSave).format() }}
                  </div>
                </div>
              </div>
            </template>
            <template v-else>
              <span class="text-sub-title font-500 text-primary">{{ $t('5个免费窗口') }}</span>
            </template>
            <DownloadBtn class="mr-5 !py-10px !px-22px">{{ $t('立即下载') }}</DownloadBtn>
          </div>
        </div>
      </div>

      <!-- 表格头部 -->
      <div class="hidden sm:block sticky top-72px z-10" ref="stickyRef">
        <div class="flex relative" :class="{ 'packages-container': isSticky }">
          <div class="pricing-column"></div>
          <div 
            v-for="pack in packages" 
            :key="pack.id" 
            :class="cn('pricing-column cursor-pointer', { 'highlight': pack.id === curPack && isSticky })"
            :ref="el => columnsRef[pack.id] = el"
            @click="handleClick(pack.id)"
          >
            <h3 class="text-body font-700 font-[Archivo]">
              {{ pack.name }}
            </h3>
            <p class="text-[#575D60] font-400 text-14px leading-[1.4]">
              {{ pack.p }}
            </p>
          </div>
        </div>

        <div class="slider-container hidden lg:flex h-116px pt-3 pb-6 relative">
          <div class="w-236px !p-0 !border-r-0 flex flex-col gap-3">
            <span class="text-14px font-700 font-[Archivo] leading-18px">{{ $t('额外的窗口数量') }}</span>
            <div>
              <PricingInputNumber 
                v-model="moduleValue"
                :step='{ ...profileSteps }'
                :min="0"
                :max="100000" 
              />
            </div>
          </div>
          <div class="flex-1 flex flex-col gap-3 relative z-10">
            <span class="invisible">1</span>
            <RxSlider2 
              v-model="moduleValue" 
              :scale="0.015"
              :min="0"
              :max="100000" 
              :marks="profileMarks" 
              :step="{ ...profileSteps }" 
              :group="packages"
              :mark-formatter="markFormatter" 
              :popup-formatter="popupFormatter"
              class="rx-slider-2"
            >
              <template #default="{ profile }">
                <div 
                  :class="cn(
                    'bg-white p-3 flex flex-col gap-2',
                    'border border-solid border-[#C7D1D6] rounded-2',
                    'shadow-[0_2px_8px_0_rgba(0_0_0/0.15)]'
                  )" 
                >
                  <template v-if="profile != 0">
                    <div>
                      <span class="text-[#FC9D12] font-600">$ </span>
                      <span class="text-6 text-[#FC9D12] font-600">{{ panelData.price }}</span>
                      <span class="text-primary font-500"> /{{ startWithUpper($t('窗口')) }}</span>
                    </div>
                    <div class="whitespace-pre text-[#A3A9AD] text-3">
                      <rx-i18n-t 
                        :keypath="$t('窗口单价 （{min}-{max} 数量区间）', { 
                          min: panelData.min.toLocaleString(), 
                          max: panelData.max.toLocaleString() 
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
        <div 
          v-for="scheme in pricingScheme" 
          :key="scheme.title" 
          :ref="el => contentRef[scheme.key] = el"
          class="relative z-9"
        >
          <h4 class="section-title">{{ scheme.title }}</h4>
          <div class="feature-list">
            <div v-for="feature in scheme.features" :key="feature.name" class="feature-row">
              <div 
                :class="cn('feature-name', {
                  '!decoration-none': feature.desc == '/'
                })"
              >
                <span v-if="feature.desc !== '/'" v-tooltip.top="{ value: feature.desc, pt: { text: 'min-w-240px' } }">
                  {{ feature.name }}
                </span>
                <span v-else>
                  {{ feature.name }}
                </span>
              </div>
              <div 
                :class="cn('grid h-full flex-1 w-full', gridCols[feature.values.length])"
              >
                <div 
                  v-for="(value, index) in processedValues(feature.values)" 
                  :key="index" 
                  :class="cn('feature-value', value.class)"
                >
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
            width: `${bgWidth}px`
          }"
          :animate="{
            left: `${bgLeft}px`
          }"
          class="hidden sm:block absolute z-8 border-1 border-solid border-[#12A3FC] rounded-3 bg-[linear-gradient(177deg,#FAFDFE_0%,#E4F2FC_113.86%)]"
        ></motion.div>
      </div>

      <img src="/1.svg" class="hidden sm:block absolute top-0 left-50% -translate-x-50% w-full h-full z-8 rounded-3 object-cover" />
    </div>
  </div>

  <Popover 
    ref="op" 
    :pt="{ 
      root: { 
        class: '!border-0 !bg-transparent before:!hidden after:!hidden' 
      }, 
      content: { 
        class: '!p-0' 
      } 
    }"
  >
    <Illustrate class="w-[392px]" />
  </Popover>
</template>

<script setup lang="ts">
import RxSlider2 from './rx-slider2.vue'
import { RxIcon } from '@/components/rx-icon'
import { 
  profileMarks, 
  profileSteps, 
  markFormatter,
  tierList,
  SubLevelEnum,
  popupFormatter
} from './configs'
import { motion } from 'motion-v'
import { useThrottleFn } from '@vueuse/core'
import PricingInputNumber from './pricing-input-number.vue'
import currency from 'currency.js'
import Illustrate from './illustrate.vue'

const { $t } = useRxI18n()

const props = defineProps({
  monthPrice: {
    type: Number,
    default: 0
  },
  monthSave: {
    type: Number,
    default: 0
  }
})

const op = useTemplateRef('op')

const openHandler = (e: MouseEvent) => {
  op.value?.show(e);
}

const moduleValue = defineModel<number>({
  default: 10
})

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

const breakpoints = useRxBreakpoints();
const smWidth = breakpoints.smallerOrEqual('sm')

const selected1 = ref(SubLevelEnum.Basic);
const selected2 = ref(SubLevelEnum.Pro);
const { locale } = useRxI18n()

const windowTexts = computed(() => {
  return locale.value === 'zh' ? $t('窗口') : 'Profiles'
})

const _1000 = (1000).toLocaleString()
const _10000 = (10000).toLocaleString()
const _100000 = (100000).toLocaleString()

// 套餐
const packages = computed(() => {
  const __packages = [
    {
      "name": $t("免费版"),
      "buttonText": $t("免费体验"),
      "id": SubLevelEnum.Free,
      "price": "0.00",
      value: 0,
      p: '5 ' + windowTexts.value
    },
    {
      "name": $t("基础版"),
      "buttonText": $t("获取基础版"),
      "id": SubLevelEnum.Basic,
      "price": "0.20",
      value: 100,
      p: '10-100 ' + windowTexts.value
    },
    {
      "name": $t("专业版"),
      "buttonText": $t("获取专业版"),
      "id": SubLevelEnum.Pro,
      "price": "0.12",
      value: 1000,
      p: `100-${_1000} ` + windowTexts.value
    },
    {
      "name": $t("商业版"),
      "buttonText": $t("获取商业版"),
      "id": SubLevelEnum.Business,
      "price": "0.08",
      value: 10000,
      p: `${_1000}-${_10000} ` + windowTexts.value
    },
    {
      "name": $t("企业版"),
      "buttonText": $t("获取企业版"),
      "id": SubLevelEnum.Enterprise,
      "price": "0.03",
      value: 100000,
      p: `${_10000}-${_100000} ` + windowTexts.value
    }
  ]
  // if (smWidth.value) {
  //   return [__packages[selected1.value], __packages[selected2.value]]
  // }
  return __packages;
})

const pricingScheme = computed(() => {
  const scheme = [
    {
      title: $t('窗口管理'),
      features: [
        {
          name: startWithUpper($t("窗口")),
          desc: $t("独立配置文件，隔离环境，高效管理多账户。"),
          values: ['5', '≤ 100', '≤ ' + (1000).toLocaleString(), '≤ ' + (10000).toLocaleString(), '≤ ' + (100000).toLocaleString()]
        },
        {
          name: $t('窗口投送'),
          desc: $t("支持窗口跨工作空间无缝迁移。"),
          values: [false, true, true, true, true]
        },
        {
          name: $t('窗口模板'),
          desc: $t("允许用户将调整的参数和选项保存为模板，以便下次快速创建窗口。"),
          values: [false, true, true, true, true]
        },
        {
          name: $t('窗口导出'),
          desc: $t("支持将窗口数据导出为 Excel 和 txt 文件格式。"),
          values: [true, true, true, true, true]
        },
        {
          name: $t('项目数量'),
          desc: $t("支持根据业务需求分组管理您的窗口。"),
          values: ['3', 'infinity', 'infinity', 'infinity', 'infinity']
        },
        {
          name: $t('操作日志'),
          desc: $t("支持访问并查看操作日志，以监控账户安全并核实操作细节。"),
          values: [
            $t('3天'), 
            $t('7天'), 
            $t('15天'), 
            $t('30天'), 
            $t('60天')
          ] 
        },
        {
          name: $t('指纹参数'),
          desc: $t("支持根据具体需求自定义指纹参数。"),
          values: [true, true, true, true, true]
        },
        {
          name: $t('指纹模拟'),
          desc: $t("支持 Windows、macOS、iOS 和 Android 多系统浏览器指纹模拟。"),
          values: [true, true, true, true, true]
        },
        {
          name: $t('数据同步'),
          desc: $t("您的账户数据可以在多台设备上无缝同步。"),
          values: [true, true, true, true, true]
        },
        {
          name: $t('代理配置'),
          desc: $t("支持导入静态和动态代理，兼容 HTTP、HTTPS、SOCKS5 和 SSH 协议。"),
          values: [true, true, true, true, true]
        }
      ],
      key: '1',
      calcHeight: true,
    },
    {
      title: $t('自动化工具'),
      features: [
        {
          name: $t('窗口同步'),
          desc: $t("旨在通过实现对多个窗口的同时操控来简化工作流程。"),
          values: [false, true, true, true, true]
        },
        {
          name: $t('API 访问'),
          desc: $t("支持与外部应用程序无缝集成。"),
          values: [$t('50r/m'), $t('100r/m'), $t('200r/m'), $t('300r/m'), $t('500r/m')]
        }
      ],
      key: '2',
      calcHeight: true,
    },
    {
      title: $t('团队协作'),
      features: [
        {
          name: $t('空间功能'),
          desc: $t("创建独立工作空间，确保数据和资源隔离，邀请成员时无需担心复杂权限限制。一键切换工作空间，实现安全高效协作。"),
          values: [
            { text: $t('$10/工作空间'), span: 5 },
            { text: $t('$10/工作空间'), span: 2 },
            { text: $t('$10/工作空间'), span: 2 },
            { text: $t('$10/工作空间'), span: 2 },
            { text: $t('$10/工作空间'), span: 2 },
          ]
        },
        {
          name: $t('团队成员'),
          desc: "/",
          values: [
          { text: $t('$5/成员'), span: 5 },
            { text: $t('$5/成员'), span: 2 },
            { text: $t('$5/成员'), span: 2 },
            { text: $t('$5/成员'), span: 2 },
            { text: $t('$5/成员'), span: 2 },
          ]
        },
        {
          name: $t('邀请&分配'),
          desc: $t("邀请成员加入项目并根据需要分配权限，以确保最大程度的数据安全和简化的工作流程。"),
          values: [
          { text: $t('可定制'), span: 5 },
            { text: $t('可定制'), span: 2 },
            { text: $t('可定制'), span: 2 },
            { text: $t('可定制'), span: 2 },
            { text: $t('可定制'), span: 2 },
          ]
        }
      ],
      key: '3',
      calcHeight: false,
    }
  ]

  if (smWidth.value) {
    const index1 = packages.value.findIndex(item => item.id === selected1.value);
    const index2 = packages.value.findIndex(item => item.id === selected2.value);
    scheme.forEach(item => {
      item.features.forEach(feature => {
        feature.values = [feature.values[index1], feature.values[index2]]
      })
    })
  }
  return scheme;
})

const selectedOptions1 = computed(() => {
  const newPacks = [...packages.value];
  return newPacks.filter(item => item.id !== selected2.value).map(item => ({ label: item.name, value: item.id }));
})

const selectedOptions2 = computed(() => {
  const newPacks = [...packages.value];
  return newPacks.filter(item => item.id !== selected1.value).map(item => ({ label: item.name, value: item.id }));
})

const gridCols = {
  '1': 'grid-cols-1',
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
}

const processedValues = (values) => {
  const colSpan = {
    '1': 'col-span-1',
    '2': 'col-span-2',
    '3': 'col-span-3',
    '4': 'col-span-4',
    '5': 'col-span-5',
  }
  const newValues = []
  for (let i = 0; i < values.length; i++) {
    if (typeof values[i] === 'object') {
      newValues.push({
        text: values[i].text,
        class: colSpan[values[i].span]
      })
      i += values[i].span;
    } else {
      newValues.push({
        text: values[i],
        class: colSpan['1']
      });
    }
  }
  return newValues;
}

const panelData = reactive({
  price: 0,
  min: 0,
  max: 0,
})

watchEffect(() => {
  const plan = moduleValue.value === 0 ? tierList.find(item => item.minWindows === 0)! : tierList.find(item => item.minWindows < moduleValue.value && item.maxWindows >= moduleValue.value)!;
  curPack.value = plan.subLevel;
  // 边框导致的偏差
  bgLeft.value = packagesLeft.value[plan.subLevel] + 1;
  panelData.price = plan.windowPrice;
  panelData.min = plan.minWindows;
  panelData.max = plan.maxWindows;
})

const getCurPack = () => {
  const plan = moduleValue.value === 0 ? tierList.find(item => item.minWindows === 0)! : tierList.find(item => item.minWindows < moduleValue.value && item.maxWindows >= moduleValue.value)!;
  return plan.subLevel;
}

const handleClick = (id: string) => {
  const pack = packages.value.find(item => item.id == id)
  if (pack) {
    moduleValue.value = pack.value
  }
}

onMounted(() => {
  const resize = () => {
    let contentHeight = 0
    pricingScheme.value.forEach(item => {
      const dom = contentRef.value[item.key]
      if (item.calcHeight && dom) {
        contentHeight += dom.getBoundingClientRect().height
      }
    })
    const __stickyHeight = stickyRef.value?.getBoundingClientRect().height
    stickyHeight.value = __stickyHeight || 0
    bgHeight.value = contentHeight + __stickyHeight;

    const pricingRect = pricingRef.value?.getBoundingClientRect()

    packages.value.forEach(item => {
      const dom = columnsRef.value[item.id];
      if (dom) {
        const rect = dom.getBoundingClientRect()
        // 边框导致的偏差
        bgWidth.value = rect.width + 1
        // padding 20 + border
        packagesLeft.value[item.id] = rect.left - pricingRect.left - 22
      }
    })

    const curPack = getCurPack()
    bgLeft.value = packagesLeft.value[curPack];
  }

  resize();
  window.addEventListener('resize', resize);

  const handleSticky = useThrottleFn(function () {
    const el = stickyRef.value!;
    const rect = el.getBoundingClientRect();
    const computedTop = parseFloat(window.getComputedStyle(el).top || '0');
    isSticky.value = rect.top <= computedTop;

    const pricingRect = pricingRef.value?.getBoundingClientRect();
    isShadow.value = pricingRect?.bottom > window.innerHeight
  }, 50)

  handleSticky();

  window.addEventListener('scroll', handleSticky);

  // const { scrollY } = useScroll({
  //   target: pricingRef.value
  // })

  // useMotionValueEvent(scrollY, 'change', (latest) => {
  //   isShadow.value = !(latest > 720);
  // })

  onUnmounted(() => {
    window.removeEventListener('scroll', handleSticky);
    window.removeEventListener('resize', resize);
  })
})
</script>

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
}

@media (max-width: 1024px) {
  .pricing-column:first-child {
    display: none;
  }

  .pricing-column:first-child, .feature-name {
    width: auto !important;
  }

  .pricing-column:nth-of-type(2) {
    border-left: none !important;
  }
}

.pricing-column:first-child, .feature-name {
  width: 236px;
}

.pricing-column:not(:first-child) {
  flex: 1;
}

.pricing-column:not(:first-child) {
  border-left: 1px solid rgba(199, 205, 209, 0.20);
}

.pricing-column.highlight {
  background: #F3FAFE;
  border-left-color: #12A3FC;
  border-left-width: 1px;
}

.pricing-column.highlight + .pricing-column {
  border-left-color: #12A3FC;
  border-left-width: 1px;
}

.pricing-column.highlight {
  border-left: 1px solid #12A3FC;
}

.pricing-column.highlight:last-child {
  border-right: 1px solid #12A3FC;
}

.section-title {
  height: 50px;
  line-height: 50px;
  position: relative;

  color: #042144;
  font-size: 18px;
  font-weight: 600;
}

.packages-container::before, .packages-container::after, 
.slider-container::before, .slider-container::after, 
.section-title::before, .section-title::after {
  content: '';
  position: absolute;
  height: 100%;
  width: 20px;
  top: 0;
}

.slider-container::before, .packages-container::before {
  left: -19px !important;
  width: 19px;
  // border-radius: 0 0 0 12px;
}

.packages-container::before, .section-title::before, .slider-container::before {
  left: -20px;
}

.packages-container::after, .section-title::after, .slider-container::after {
  right: -20px;
}

.section-title, .section-title::before, .section-title::after {
  background: #F4F5F6;
}

.slider-container, .slider-container::after, .slider-container::before {
  background-color: #FFF;
}

.packages-container, .packages-container::after, .packages-container::before {
  background-color: #FFF;
}

.feature-name {
  box-sizing: border-box;
  height: 100%;
  display: flex;
  align-items: center;

  text-decoration-line: underline;
  text-decoration-style: dotted;
  text-decoration-skip-ink: auto;
  text-decoration-color: #C7CDD1;

  text-decoration-thickness: 10%; /* 1.6px */
  text-underline-offset: 25%; /* 4px */
  text-underline-position: from-font;
  white-space: pre;
  border-right: 1px solid rgba(199, 205, 209, 0.20);
  white-space: pre-wrap;
}

/* .feature-name  span {
  word-wrap:break-word;
} */

.feature-desc {
  color: var(--Color-neutrals-300, #C7CDD1);
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: 16px; /* 133.333% */
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

  .feature-name, .feature-value {
    height: 54px !important;
    border-right: none !important;
  }
}

.feature-row:hover {
  // background: rgba(51, 169, 255, 0.1) !important;
}

.feature-row:hover .highlight, .feature-row:hover .highlight::after {
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
  background: linear-gradient(0deg, #FFFBF6 0%, #FFFBF6 100%), #FFF;
}

.feature-value:not(:last-child) {
  border-right: 1px solid rgba(199, 205, 209, 0.20);
}
</style>