<script setup>
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  user: {
    type: String,
    default: '1',
  },
  setp: {
    type: String,
    default: 'useBeforeScan',
  },
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
    text: props.user == '1' ? 'TrailTrek Gear' : 'Social Media Account',
    alt: props.user == '1' ? $t('使用RoxyBrowser管理多个亚马逊账号') : $t('使用RoxyBrowser管理多个Facebook账号'),
  }
})
</script>

<template>
  <div
    :class="cn(
      'rounded-t-5 flex-1 flex-col gap-14px px-2 pt-4 h-378px md:h-468px',
      'border-none md:border-1 md:border-solid md:border-b-0 md:border-black/20 bg-transparent md:bg-black/10',
    )"
    v-bind="$attrs"
  >
    <div class="ml-4 flex gap-2">
      <div
        v-for="i in 3"
        class="rounded-full bg-white/50 h-14px w-14px"
      />
    </div>

    <div class="rounded-t-3 bg-white flex flex-1 flex-col">
      <div class="px-4 py-3 border-1 border-x-0 border-t-0 border-[#DFE5F3] border-solid flex gap-2.5 w-full items-center">
        <img :src="data.labelImage" :alt="data.alt" class="select-none" draggable="false">
        <span class="text-18px font-[Archivo]">{{ data.label }}</span>
      </div>

      <div class="flex flex-1 flex-col gap-3 h-full items-center justify-center">
        <div class="flex flex-col gap-3 items-center">
          <div
            :class="cn(
              'w-72px h-72px relative rounded-full overflow-hidden',
              setp == 'useBefore' ? 'border-2 border-solid border-[#E90C10]' : '',
            )"
          >
            <RxResponsiveImage :name="data.userImage" :alt="data.alt" class="rounded-full h-full w-full" />
            <div
              v-if="setp == 'useBefore'"
              class="text-10 bg-[rgba(217_46_34/.3)] flex h-full w-full items-center left-1/2 top-1/2 justify-center absolute -translate-x-1/2 -translate-y-1/2"
            >
              <RxIcon name="base/rx_ic_error2" size="34" />
            </div>
          </div>
          <span class="font-22px font-[Archivo]">{{ data.text }}</span>
          <span
            :class="cn(
              'px-3 py-1.5 rounded-2 border-1 border-solid flex items-center gap-6px',
              btnClasses,
            )"
          >
            <template v-if="setp == 'useBeforeScan' || setp == 'useAfterScan'">
              <RxSpinner size="16px" />
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
