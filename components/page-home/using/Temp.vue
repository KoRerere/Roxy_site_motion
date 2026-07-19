<script setup>
import { useIntersectionObserver } from '@vueuse/core'
import { RxIcon } from '@/components/rx-icon'
import Panel from './panel.vue'

const props = defineProps({
  label: {
    type: String,
    default: '',
  },
  title: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  setp1: {
    type: String,
    default: '',
  },
  setp2: {
    type: String,
    default: '',
  },
  lableClasses: {
    type: String,
    default: '',
  },
  titleClasses: {
    type: String,
    default: '',
  },
})

const setp = ref(props.setp1)
const bgLinearGradient = computed(() => {
  if (setp.value == 'useBeforeScan' || setp.value == 'useAfterScan') {
    return 'linear-gradient-default'
  }

  if (setp.value == 'useBefore') {
    return 'linear-gradient-error'
  }

  if (setp.value == 'useAfter') {
    return 'linear-gradient-complete'
  }
})

const breakpoints = useRxBreakpoints()
const lgWidth = breakpoints.smallerOrEqual('lg')

const target = useTemplateRef('target')
const scanLeftRef = useTemplateRef('scanLeftRef')
const scanRightRef = useTemplateRef('scanRightRef')

function handleLeftAnimationEnd() {
  if (!scanLeftRef.value || !scanRightRef.value)
    return

  scanLeftRef.value.classList.remove('sacn-left-animation')
  scanLeftRef.value.removeEventListener('animationiteration', handleLeftAnimationEnd)

  scanRightRef.value.classList.add('sacn-right-animation')
  scanRightRef.value.addEventListener('animationiteration', handleRightAnimationEnd)
}

function handleRightAnimationEnd() {
  if (!scanRightRef.value)
    return

  scanRightRef.value.classList.remove('sacn-right-animation')
  // 移除事件监听器之前先检查元素是否还存在
  if (scanRightRef.value && scanRightRef.value.parentNode) {
    scanRightRef.value.removeEventListener('animationiteration', handleRightAnimationEnd)
  }

  // 赋值修改就报错
  setp.value = props.setp2
}

function startAnimation() {
  if (!scanLeftRef.value)
    return

  scanLeftRef.value.addEventListener('animationiteration', handleLeftAnimationEnd)
  scanLeftRef.value.classList.add('sacn-left-animation')
}

const { stop } = useIntersectionObserver(
  target,
  ([entry]) => {
    if (entry.intersectionRatio >= 0.9) {
      // 完全进入了
      startAnimation()
      stop()
    }
  },
  {
    threshold: [0.1, 0.9],
  },
)

onBeforeUnmount(() => {
  // console.log('组件卸载了？？？')
  if (scanLeftRef.value && scanLeftRef.value.parentNode) {
    scanLeftRef.value.removeEventListener('animationiteration', handleLeftAnimationEnd)
  }
  if (scanRightRef.value && scanRightRef.value.parentNode) {
    scanRightRef.value.removeEventListener('animationiteration', handleRightAnimationEnd)
  }
})

onErrorCaptured((e) => {
  console.log('onErrorCaptured', e)
  return false
})
</script>

<template>
  <div
    ref="target"
    :class="cn(
      'grid grid-cols-12 gap-5',
      'px-3 pb-0 pt-5 md:px-50px md:py-9',
      $attrs.class,
    )"
  >
    <div class="text-center flex flex-col gap-5 col-span-12 md:text-left md:col-span-5">
      <div class="font-500 pt-0 flex justify-center md:pt-11 md:block">
        <div class="rounded-5 bg-[#F3F4F7] flex size-72px items-center justify-center lg:size-100px">
          <RxIcon :name="label" :size="lgWidth ? 48 : 72" />
        </div>
      </div>
      <h3
        :class="cn(
          'text-primary section-title whitespace-pre-line',
          titleClasses,
        )"
      >
        {{ title }}
      </h3>
      <p class="text-14px text-primary font-400 md:text-features-body">
        {{ desc }}
      </p>
    </div>

    <div
      :class="cn(
        'col-span-12 md:col-span-7 rounded-t-5 md:rounded-3 p-0 md:px-10 md:pt-10 flex gap-3 relative overflow-hidden',
        bgLinearGradient,
      )"
    >
      <Panel user="1" :setp="setp" class="flex" />
      <Panel user="2" :setp="setp" class="hidden xl:flex" />

      <div ref="scanLeftRef" class="scan-left" />
      <div ref="scanRightRef" class="scan-right" />
    </div>
  </div>
</template>

<style scoped>
.scan-left {
  border-right: 4px solid #16a87c;
  background: linear-gradient(90deg, rgba(22, 168, 124, 0) 0%, rgba(22, 168, 124, 0.2) 100%);
  width: 50%;
  height: 100%;
  position: absolute;
  left: -100%;
  top: 0;
  /* 只播放一次 */
  /* animation: scan 1s linear infinite; */
}

.sacn-left-animation {
  animation: scanLeft 0.8s linear infinite;
}

@keyframes scanLeft {
  0% {
    left: -100%;
  }

  100% {
    left: 100%;
  }
}

.scan-right {
  border-left: 4px solid #16a87c;
  background: linear-gradient(90deg, rgba(22, 168, 124, 0.2) 100%, rgba(22, 168, 124, 0) 0%);
  width: 50%;
  height: 100%;
  position: absolute;
  right: -100%;
  top: 0;
  /* 只播放一次 */
  /* animation: scan 1s linear infinite; */
}

.sacn-right-animation {
  animation: scanRight 0.8s linear infinite;
}

@keyframes scanRight {
  0% {
    right: -100%;
  }

  100% {
    right: 100%;
  }
}

.linear-gradient-default {
  background: linear-gradient(180deg, #f8fafb 0%, #f2f6f8 100%);
}

.linear-gradient-error {
  background: linear-gradient(180deg, #fed7d7 0%, #fff0f0 100%), linear-gradient(180deg, #f8fafb 0%, #f2f6f8 100%);
}

.linear-gradient-complete {
  background: linear-gradient(180deg, var(--colors-background-bg-brand, #11a3fd) 0%, #dcf1ff 100%), #fff;
}

@media (max-width: 640px) {
  .linear-gradient-error {
    background: #fee8e7;
  }

  .linear-gradient-complete {
    background: #9ad8fe;
  }
}
</style>
