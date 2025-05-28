<template>
  <div 
    :class="cn(
      'rounded-t-5 flex-1 flex-col gap-14px px-2 pt-4 h-378px md:h-468px',
      'border-none md:border-1 md:border-solid md:border-b-0 md:border-black/20 bg-transparent md:bg-black/10'
    )"
    v-bind="$attrs"
  >
    <div class="flex gap-2 ml-4">
      <div 
        v-for="i in 3" 
        class="w-14px h-14px rounded-full bg-white/50"
      ></div>
    </div>

    <div class="bg-white rounded-t-3 flex-1 flex flex-col">
      <div class="py-3 px-4 w-full flex items-center gap-10px border-1 border-solid border-[#DFE5F3] border-t-0 border-x-0">
        <img :src="data.labelImage" alt="" class="select-none" draggable="false" />
        <span class="text-18px font-[Archivo]">{{ data.label }}</span>
      </div>

      <div class="flex flex-col items-center justify-center flex-1 h-full gap-3">
        <div class="flex flex-col items-center gap-3">
          <div 
            :class="cn(
              'w-72px h-72px relative rounded-full overflow-hidden',
              setp == 'useBefore' ? 'border-2 border-solid border-[#E90C10]' : ''
            )"
          >
            <RxResponsiveImage :name='data.userImage' class="rounded-full w-full h-full" />
            <div 
              class="absolute w-full h-full top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-[rgba(217_46_34/.3)] flex items-center justify-center text-10" 
              v-if="setp == 'useBefore'"
            >
              <RxIcon name="base/rx_ic_error2" size="34" />
            </div>
          </div>
          <span class="font-22px font-[Archivo]">{{ data.text }}</span>
          <span 
            :class="cn(
              'px-3 py-6px rounded-2 border-1 border-solid flex items-center gap-6px', 
              btnClasses
            )"
          >
            <template v-if="setp == 'useBeforeScan' || setp == 'useAfterScan'">
              <ProgressSpinner 
                style="width: 16px; height: 16px" 
                strokeWidth="4" 
                fill="transparent"
                :animationDuration="'.5s'"
                aria-label="Loading..."
              />
              <span>Testing</span>
            </template>

            <template v-else-if="setp == 'useBefore'">
              <RxIcon name="base/rx_ic_close" size="16" />
              <span>Block</span>
            </template>

            <template v-else-if="setp == 'useAfter'">
              <RxIcon name="base/rx_ic_check" size="16" />
              <span>Normal</span>
            </template>
          </span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  user: {
    type: String,
    default: '1'
  },
  setp: {
    type: String,
    default: 'useBeforeScan'
  }
})

const btnClasses = computed(() => {
  if (props.setp == 'useBeforeScan' || props.setp == 'useAfter') {
    return 'border-[#DDE2EC]'
  }

  if (props.setp == 'useBefore') {
    return 'border-[#E90C10] bg-[#FEE8E7]'
  }
})

const data = computed(() => {
  return {
    label: props.user == '1' ? 'Amazon' : 'Facebook',
    labelImage: props.user == '1' ? '/home/amazon.svg' : '/home/facebook.svg',
    userImage: props.user == '1' ? 'using/user-avatar-1' : 'using/user-avatar-2',
    text: props.user == '1' ? 'TrailTrek Gear' : 'Social Media Account'
  }
})
</script>

