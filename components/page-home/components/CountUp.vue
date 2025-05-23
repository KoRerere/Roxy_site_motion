<template>
  <CountUp 
    :start-val="realNumData.oldVal" 
    :end-val="realNumData.val" 
    :options="{ enableScrollSpy: true, scrollSpyOnce: true }"
    v-bind="$attrs"
  />
</template>

<script setup lang="ts">
import CountUp from "vue-countup-v3";
const realNumData = reactive({
  oldVal: 0,
  val: 0
})

const props = defineProps({
  cacheKey: {
    type: String,
    required: true
  }
})

const cacheKey = computed(() => {
  return props.cacheKey
})

let timer: NodeJS.Timeout | null = null;
const selfIncreasing = () => {
  const delay = rangRandom(5, 10) * 1000;
  timer && clearTimeout(timer)
  if (realNumData.val <= 0) {
    // 从缓存中获取，如果没有就随机生成一个
    realNumData.val = +atob(localStorage.getItem(cacheKey.value)) || rangRandom(4 * 10 ** 6, 5 * 10 ** 6)
  }
  timer = setTimeout(() => {
    const countNum = Math.abs(rangRandom(10, 30));
    realNumData.oldVal = realNumData.val;
    realNumData.val = realNumData.val + countNum;
    localStorage.setItem(cacheKey.value, btoa(realNumData.val));
    selfIncreasing()
  }, delay);
}

onMounted(() => {
  selfIncreasing()
})

onUnmounted(() => {
  clearTimeout(timer);
  timer = null;
});
</script>

<style lang="scss" scoped>

</style>