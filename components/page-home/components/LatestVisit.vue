<script setup>
import { lbSetTimeout } from '~/utils/basic'

const { $t } = useRxI18n()
const emit = defineEmits(['update:value'])
const cities = computed(() => [$t('北京'),$t('上海'),$t('广州'),$t('深圳'),$t('成都'),$t('香港'),$t('台北'),$t('东京'),$t('大阪'),$t('福冈'),$t('札幌'),$t('首尔'),$t('釜山'),$t('济州'),$t('仰光'),$t('河内'),$t('胡志明市'),$t('曼谷'),$t('清迈'),$t('新加坡'),$t('马尼拉'),$t('达卡'),$t('乌兰巴托'),$t('台南'),$t('澳门'),$t('纽约'),$t('洛杉矶'),$t('芝加哥'),$t('多伦多'),$t('墨西哥城'),$t('里约热内卢'),$t('布宜诺斯艾利斯'),$t('圣保罗'),$t('温哥华'),$t('迈阿密'),$t('伦敦'),$t('巴黎'),$t('柏林'),$t('罗马'),$t('马德里'),$t('阿姆斯特丹'),$t('维也纳'),$t('布拉格'),$t('巴塞罗那'),$t('布鲁塞尔')])

const intervalCofig = reactive({
  delay: 5000,
  stop: () => { },
  setDelay: () => { }
})

const setDelay = () => {
  const delay = rangRandom(5, 10) * 1000
  intervalCofig.setDelay(delay)
}

const getSubListByRandom = (list, length = 15) => {
  const min = 0
  const max = list.length - 1
  return Array.from({ length }, () => list[rangRandom(min, max)])
}

const duration = 500

const chunk = ref([])
const animate = ref(false)

const reAddData = () => {
  const _chunk = getSubListByRandom(cities.value, 3)
  chunk.value.push(..._chunk)
}

const showMarquee = () => {
  animate.value = true
  setDelay()
  setTimeout(() => {
    chunk.value.shift()
    animate.value = false
    if (chunk.value.length < 2) {
      reAddData()
    }
  }, duration)
}

const unwatch = watch(
  () => chunk.value[0],
  (value) => {
    emit('update:value', value)
  }
)

onMounted(() => {
  if (cities.value.length) {
    reAddData()
    const [stop, setDelay] = lbSetTimeout(showMarquee, intervalCofig.delay)
    intervalCofig.stop = stop
    intervalCofig.setDelay = setDelay
  }
})

onUnmounted(() => {
  unwatch()
  intervalCofig.stop()
})
</script>

<template>
  <div 
    class=" overflow-hidden w-full h-12 lg:h-18" 
    :style="{ '--duration': `${duration / 1000}s` }" 
    v-bind="$attrs"
    >
    <div class="transition-all duration-[var(--duration)] -mt-12 lg:-mt-18" :class="{ marquee_top: animate }">
      <div v-for="citie in chunk" class="flex">
        <div class="cities-item-name text-white">{{ citie }}</div>
      </div>
    </div>
  </div>
</template>