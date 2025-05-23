<template>
  <div v-bind="$attrs">
    <h2 class="text-center section-title">
      {{ title }}
    </h2>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 md:gap-x-4 md:gap-y-5 mt-5 sm:mt-12">
      <div 
        class="bg-white rounded-3 border-2 border-solid border-[#EBEAEC] px-6 pb-5 sm:pb-6" 
        v-for="item in list" 
        :key="item.title"
      >
        <div class="h-72px sm:h-120px flex items-center justify-center">
          <RxIcon :name="item.icon" :size="size" />
        </div>
        <div class="flex flex-col gap-2 sm:gap-3">
          <h3 class="text-center text-18px lg:text-6 font-[Archivo] font-500 text-[#042144]">{{ item.title }}</h3>
          <p class="text-center text-14px lg:text-18px font-400 text-[#575D60]">{{ item.desc }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RxIcon } from "@/components/rx-icon"

const breakpoints = useRxBreakpoints();
const smWidth = breakpoints.smallerOrEqual('sm')

const size = computed(() => {
  if (smWidth.value) {
    return 40
  } else {
    return 72
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
  }
})

</script>