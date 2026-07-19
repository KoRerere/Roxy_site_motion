<template>
  <div class="flex flex-col gap-3 lg:gap-5" v-bind="$attrs">
    <div v-for="item in faqItems"
      class="bg-white rounded-2 lg:rounded-3 border-1 border-solid border-white hover:border-[#11A3FD] py-3 lg:py-5 px-4 lg:px-6 accordion-item cursor-pointer transition-all duration-500"
      @click="moduleValue === item.key ? moduleValue = '' : moduleValue = item.key" :key="item.key">
      <div :class="cn('flex items-center justify-between', moduleValue === item.key && 'accordion-item-active')">
        <h3 class="text-4 leading-22px lg:text-5 lg:leading-[36px] font-500 text-primary accordion-item-title">
          <template v-if="typeof item.title === 'string'">{{ item.title }}</template>
          <component v-else :is="item.title"></component>
        </h3>
        <RxIcon :class="{ 'rotate-180': moduleValue === item.key }" class="transition-all duration-300" name="base/rx_ic_chevron_down" size="24" />
      </div>
      <div class="grid box-border overflow-hidden list" :class="{ opened: moduleValue === item.key }">
        <div class="relative list-content">
          <p class="accordion-item-content pt-3 text-3.5 leading-[1.6] lg:text-sub-title whitespace-pre-line text-secondary">
            <template v-if="typeof item.desc === 'string'">{{ item.desc }}</template>
            <component v-else :is="item.desc"></component>
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import type { AccordionProps } from './interface'

const props = defineProps<AccordionProps>()

const moduleValue = defineModel('0')

const faqItems = computed(() => {
  return props.items.map((item, index) => ({ ...item, key: index.toString() }))
})

</script>

<style scoped lang="scss">
.list {
  grid-template-rows: 0fr;
  transition: all 0.1s ease-in-out;

  &.opened {
    grid-template-rows: 1fr;
  }

  &-content {
    min-height: 0;
  }
}
</style>