<template>
  <h2 class="text-center text-primary section-title">
    {{ title }}
  </h2>
  <div class="grid grid-cols-1 sm:grid-cols-3 gap-5 mt-6 sm:mt-12">
    <div v-for="item in list" class="flex gap-3">
      <div>
        <RxIcon :name="item.icon" :size="size" :color="primaryColor" />
      </div>
      <div>
        <h3 class="leading-[1.2] text-18px lg:text-h6 font-500 font-[Archivo]">{{ item.title }}</h3>
        <p class="leading-[1.5] text-3 lg:text-body text-[#575D60] font-400">{{ item.desc }}</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RxIcon } from "@/components/rx-icon"

const breakpoints = useRxBreakpoints();
const lgWidth = breakpoints.smallerOrEqual('lg')

const size = computed(() => {
  if (lgWidth.value) {
    return 24
  } else {
    return 36
  }
})

const props = defineProps({
  list: {
    type: Array,
    default: () => []
  },
  title: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: ''
  }
})

</script>

