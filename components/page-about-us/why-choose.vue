<script setup lang="ts">
import BScroll from '@better-scroll/core'
import { createReusableTemplate, useDebounceFn, useElementVisibility } from '@vueuse/core'
import { Cursor } from 'motion-plus-vue'
import { motion } from 'motion-v'
import { RxIcon } from '@/components/rx-icon'
import { useRxMaxSm } from '@/composables/useRxBreakpoints'

const containerRef = useTemplateRef<HTMLDivElement>('container')
const contentRef = useTemplateRef<HTMLDivElement>('contentRef')
const { locale } = useRxI18n()
const isMaxSm = useRxMaxSm()
const [DefineTemplate, ReuseTemplate] = createReusableTemplate()
const isVisible = useElementVisibility(contentRef, { threshold: 0.05 })
const { width } = useElementSize(contentRef)
const descMinHeight = ref(0)

const isCursorVisible = ref(false)
const isLeft = ref(false)

const data = [
  {
    title: $t('最先进的指纹模拟技术'),
    desc: $t('我们通过对 AudioContext、Canvas、WebGL、Fonts 等上百个指纹参数进行底层级别的深度模拟，生成与真实设备无限接近的独立浏览器环境，有效规避最严格的平台风控。'),
    image: 'about-us/why-choose1',
  },
  {
    title: $t('企业级的稳定性和速度'),
    desc: $t('基于强大的 Chromium 内核深度优化，RoxyBrowser 保证了企业级的运行稳定性和闪电般的响应速度，即使管理数百个浏览器配置文件也流畅自如。'),
    image: 'about-us/why-choose2',
  },
  {
    title: $t('无缝的团队协作功能'),
    desc: $t('专为团队设计，支持灵活的权限管理、一键转移和窗口同步，让您的团队成员无论身在何处，都能高效、安全地协同工作。'),
    image: 'about-us/why-choose3',
  },
  // {
  //  title: $t('简洁直观的用户体验'),
  //  desc: $t('我们相信强大的功能不必以复杂的操作交互为代价。RoxyBrowser 拥有简洁直观的用户界面，让您在几分钟内即可上手，轻松创建和管理您的浏览器配置文件。'),
  //  image: 'about-us/why-choose4',
  // },
]

const paddingLeft = ref(0)

let bscroll: BScroll | null = null

// 自定义缓动函数 - cubic-bezier(0.175, 0.885, 0.32, 1.275)
const customEase = {
  style: 'cubic-bezier(0.175, 0.885, 0.32, 1.275)',
  fn(t: number): number {
    // cubic-bezier(0.175, 0.885, 0.32, 1.275) 的近似实现
    // 这是一个缓入缓出的贝塞尔曲线
    const c2 = 0.885
    const c3 = 0.32
    const c4 = 1.275

    // 简化的三次贝塞尔曲线计算
    const t2 = t * t
    const t3 = t2 * t
    const mt = 1 - t
    const mt2 = mt * mt

    return 3 * mt2 * t * c2 + 3 * mt * t2 * c3 + t3 * c4
  },
}

function handleSwitchLeft() {
  bscroll?.scrollTo(0, 0, 200, customEase)
}

function handleSwitchRight() {
  bscroll?.scrollTo(bscroll?.maxScrollX || -200, 0, 200, customEase)
}

function initBscroll() {
  // 只能在客户端执行,并且只能存在一个实例
  if (import.meta.server || bscroll)
    return

  console.log('初始化 bscroll')
  const container = document.getElementById('dargger-box')!
  if (container) {
    requestIdleCallback(() => {
      bscroll = new BScroll(container, {
        scrollX: true,
        scrollY: false,
        click: true,
        probeType: 3,
        mouseWheel: true,
        disableMouse: false,
        disableTouch: false,
      })
      window.$bscroll = bscroll
    })
  }
}

function bscrollDestroy() {
  console.log('销毁 bscroll')
  bscroll?.destroy()
  bscroll = null
}

function handleClick() {
  const step = 300
  if (isMaxSm.value || !bscroll)
    return
  if (isLeft.value) {
    bscroll.scrollTo(
      Math.min(bscroll.x + step, 0),
      0,
      200,
      customEase,
    )
  }
  else {
    bscroll.scrollTo(Math.max(bscroll.x - step, bscroll.maxScrollX), 0, 200, customEase)
  }
}

const handleResize = useDebounceFn(() => {
  const { left } = containerRef.value?.getBoundingClientRect() || { left: 0 }
  paddingLeft.value = !isMaxSm.value ? left : 0
  if (!isMaxSm.value) {
    bscrollDestroy()
    initBscroll()
  }
  else {
    handleSwitchRight()
    // setTimeout(bscrollDestroy, 200)
  }
}, 200)

// FIX：解决Curosr因为语言切换，滚动条回到顶部，元素的 mouseleave 不被触发，导致Curosr不消失，停留在界面上
watch(locale, () => {
  isCursorVisible.value = false
})

watch([isVisible, width], (newVal) => {
  if (newVal) {
    if (window.innerWidth >= 1024 || window.innerWidth <= 640) {
      descMinHeight.value = 0
      return
    }

    const descs = contentRef.value?.querySelectorAll('.panel-content')
    if (descs) {
      descs.forEach((desc) => {
        const height = desc.getBoundingClientRect().height
        if (height > descMinHeight.value) {
          descMinHeight.value = height
        }
      })
    }
    console.log('descMinHeight', descMinHeight.value)
  }
})

// TODO: 暂时取消动画
// onMounted(() => {
//   handleResize()
//   window.addEventListener('resize', handleResize)
//   const handleMouseMove = (e: MouseEvent) => {
//     isLeft.value = window.innerWidth / 2 > e.clientX
//   }
//   window.addEventListener('mousemove', handleMouseMove)
//   onBeforeUnmount(() => {
//     window.removeEventListener('resize', handleResize)
//     window.removeEventListener('mousemove', handleMouseMove)
//   })
// })

// onBeforeUnmount(() => {
//   bscrollDestroy()
// })
</script>

<template>
  <DefineTemplate v-slot="{ item }">
    <div class="panel-item rounded-2.5 min-w-[280px] w-full relative overflow-hidden lg:rounded-4 lg:w-413px sm:w-313px">
      <RxResponsiveImage :name="item.image" class="h-full w-full object-cover" />
      <div class="panel-content p-5 rounded-2.5 bg-[#E4ECF1] flex flex-col gap-4 bottom-0 left-0 right-0 absolute lg:px-10 lg:pb-11 lg:pt-8 lg:rounded-4" :style="{ minHeight: `${descMinHeight}px` }">
        <h3 class="text-5 text-primary font-600 lg:text-h6">
          {{ item.title }}
        </h3>
        <p class="panel-desc text-3.5 font-400 lg:text-4.5 !max-lg:opacity-100 !max-lg:max-h-50">
          {{ item.desc }}
        </p>
      </div>
    </div>
  </DefineTemplate>
  <div class="flex flex-col gap-6 lg:gap-9.5">
    <Container>
      <div ref="container" class="flex items-center justify-between">
        <h2 class="text-6 text-primary font-700 lg:text-h3">
          {{ $t('为什么选择 RoxyBrowser？') }}
        </h2>
        <!-- <div v-if="!isMaxSm" class="flex gap-6 items-center">
          <div class="switch-btn" @click="handleSwitchLeft">
            <RxIcon name="base/rx_ic_left" />
          </div>
          <div class="switch-btn" @click="handleSwitchRight">
            <RxIcon name="base/rx_ic_chevron_right" />
          </div>
        </div> -->
      </div>
    </Container>
    <Container>
      <div id="dargger-box" class="pt-2.5 flex flex-wrap relative" :style="{ marginLeft: `${paddingLeft}px` }" @mouseenter="isCursorVisible = true" @mouseleave="isCursorVisible = false" @click="handleClick">
        <div ref="contentRef" :class="[!isMaxSm ? 'scroll-container pb-3 flex gap-5 h-full overflow-x-auto _lg:min-w-1792px _sm:min-w-1392px' : 'grid grid-cols-1 gap-6']">
          <ReuseTemplate v-for="item in data" :key="item.title" :item="item" />
        </div>
      </div>
    </Container>
    <!-- <ClientOnly>
      <Cursor
        v-if="isCursorVisible && !isMaxSm"
        class="!rounded-full !overflow-hidden"
      >
        <motion.div :animate="{ rotate: isLeft ? 0 : 180 }" class="text-white bg-black flex size-15 items-center justify-center">
          <RxIcon name="base/cursor-left" size="22" />
        </motion.div>
      </Cursor>
    </ClientOnly> -->
  </div>
</template>

<style scoped>
.switch-btn {
  @apply p-4.5 border-1 border-solid border-[#E2E9EE] rounded-full cursor-pointer flex;
}

.switch-btn:not(.disabled):hover {
  @apply bg-[#F1F5F8];
}

.switch-btn.disabled {
  @apply opacity-40;
}

.panel-item {
  transition: all 0.3s ease;
}

.panel-desc {
  max-height: 0;
  overflow: hidden;
  opacity: 0;
  /**curve=0.175,0.885,0.32,1.275 */
  transition: all 1s cubic-bezier(0.175, 0.885, 0.32, 1.275);
}

.scroll-container {
  &::-webkit-scrollbar {
    width: 6px;
    /* 垂直滚动条宽度 */
    height: 6px;
    /* 水平滚动条高度 */
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  /* 滑块悬停时 */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background: #c2d5e0;
    border-radius: 6px;
  }
}

@media (min-width: 1024px) {
  .panel-item:hover {
    transform: translateY(-10px);
  }

  .panel-item:hover .panel-desc {
    max-height: 160px;
    opacity: 1;
  }
}
</style>
