<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

export interface FAQItem {
  title: string
  desc: string
}

const props = withDefaults(
  defineProps<{
    items: FAQItem[]
    defaultActive?: number
  }>(),
  { defaultActive: 0 },
)

const activeIndex = ref(props.defaultActive)

function toggle(index: number) {
  activeIndex.value = activeIndex.value === index ? -1 : index
}
</script>

<template>
  <section>
    <div class="flex flex-col gap-3">
      <div
        v-for="(item, idx) in items"
        :key="idx"
        class="p-6 border border-[#D6D6D6] rounded-4 border-solid cursor-pointer overflow-hidden lg:p-8"
        :class="{ 'is-open': activeIndex === idx }"
        @click="toggle(idx)"
      >
        <div class="flex gap-3 items-center justify-between">
          <h3 class="text-4.5 text-primary leading-32px font-500 m-0 text-left flex-1 lg:text-5.5">
            {{ item.title }}
          </h3>
          <span
            class="inline-flex shrink-0 transition-transform duration-200 items-center justify-center"
            :class="activeIndex === idx ? 'rotate-180' : ''"
          >
            <RxIcon
              name="base/rx_ic_chevron_down"
              size="20"
            />
          </span>
        </div>
        <div
          class="transition-[grid-template-rows] grid duration-200 ease-out"
          :class="activeIndex === idx ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
        >
          <div class="min-h-0 overflow-hidden">
            <p class="text-4 text-secondary leading-28px m-0 pt-4 whitespace-pre-line">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>
