<template>
  <div 
    :class="cn(
      'grid grid-cols-12 gap-5', 
      'px-3 pb-0 pt-5 md:px-50px md:py-9',
      $attrs.class
    )" 
    ref="target"
  >
    <div class="col-span-12 md:col-span-5 flex flex-col gap-5 text-center md:text-left">
      <div class="flex md:block justify-center pt-0 md:pt-11 font-500">
        <div class="size-72px lg:size-100px flex items-center justify-center bg-[#F3F4F7] rounded-5">
          <RxIcon :name="label" :size="lgWidth ? 48 : 72" />
        </div>
      </div>
      <h3 
        :class="cn(
          'text-primary section-title whitespace-pre-line',
          titleClasses
        )"
      >
        {{ title }}
      </h3>
      <p class="text-14px md:text-features-body text-primary font-400">
        {{ desc }}
      </p>
    </div>

    <div 
      :class="cn(
        'col-span-12 md:col-span-7 rounded-t-5 md:rounded-3 p-0 md:px-10 md:pt-10 flex gap-3 relative overflow-hidden',
        bgLinearGradient
      )"
    >
      <Panel user="1" :setp="setp" class="flex" />
      <Panel user="2" :setp="setp" class="hidden xl:flex" />

      <div class="scan-left" ref="scanLeftRef"></div>
      <div class="scan-right" ref="scanRightRef"></div>
    </div>
  </div>
</template>

<script setup>
import Panel from './panel.vue'
import { useIntersectionObserver } from '@vueuse/core'
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  setp1: {
    type: String,
    default: ''
  },
  setp2: {
    type: String,
    default: ''
  },
  lableClasses: {
    type: String,
    default: ''
  },
  titleClasses: {
    type: String,
    default: ''
  }
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

const breakpoints = useRxBreakpoints();
const lgWidth = breakpoints.smallerOrEqual('lg')

const target = useTemplateRef('target')
const scanLeftRef = useTemplateRef('scanLeftRef');
const scanRightRef = useTemplateRef('scanRightRef');

const handleLeftAnimationEnd = () => {
  if (!scanLeftRef.value || !scanRightRef.value) return;
  
  scanLeftRef.value.classList.remove('sacn-left-animation')
  scanLeftRef.value.removeEventListener('animationiteration', handleLeftAnimationEnd)
  
  scanRightRef.value.classList.add('sacn-right-animation')
  scanRightRef.value.addEventListener('animationiteration', handleRightAnimationEnd)
}

const handleRightAnimationEnd = () => {
  if (!scanRightRef.value) return;

  scanRightRef.value.classList.remove('sacn-right-animation')
  // 移除事件监听器之前先检查元素是否还存在
  if (scanRightRef.value && scanRightRef.value.parentNode) {
    scanRightRef.value.removeEventListener('animationiteration', handleRightAnimationEnd)
  }

  // 赋值修改就报错
  setp.value = props.setp2
}

const startAnimation = () => {
  if (!scanLeftRef.value) return;
  
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
    threshold: [0.1, 0.9]
  }
)

onBeforeUnmount(() => {
  console.log('组件卸载了？？？')
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

<style scoped>
.scan-left {
  border-right: 4px solid #16A87C;
  background: linear-gradient(90deg, rgba(22, 168, 124, 0.00) 0%, rgba(22, 168, 124, 0.20) 100%);
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
  border-left: 4px solid #16A87C;
  background: linear-gradient(90deg, rgba(22, 168, 124, 0.20) 100%, rgba(22, 168, 124, 0.00) 0%);
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
  background: linear-gradient(180deg, #F8FAFB 0%, #F2F6F8 100%);
}

.linear-gradient-error {
  background: linear-gradient(180deg, #FED7D7 0%, #FFF0F0 100%), linear-gradient(180deg, #F8FAFB 0%, #F2F6F8 100%);
}

.linear-gradient-complete {
  background: linear-gradient(180deg, var(--colors-background-bg-brand, #11A3FD) 0%, #DCF1FF 100%), #FFF;
}

@media (max-width: 640px) {
  .linear-gradient-error {
    background: #FEE8E7;
  }

  .linear-gradient-complete {
    background: #9AD8FE;
  }
}
</style>