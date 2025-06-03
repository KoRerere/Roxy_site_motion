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
  count: {
    type: Number,
    required: true
  }
})

const { count } = toRefs(props)

watchEffect(() => {
  if (realNumData.oldVal === 0) {
    realNumData.oldVal = count.value;
  } else {
    realNumData.oldVal = realNumData.val;
  }
  realNumData.val = count.value;
})
</script>

<style lang="scss" scoped>

</style>