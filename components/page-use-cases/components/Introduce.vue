<script setup lang="ts">
import type { IntroduceProps } from './interface'

const props = defineProps<IntroduceProps>()
function isOdd(n: number) {
  return n % 2 === 1 || n % 2 === -1
}

const rgba1 = computed(() => hexToRgba(props.primaryColor, 0.15))
const rgba2 = computed(() => hexToRgba(props.primaryColor, 0.08))
</script>

<template>
  <div class="relative z-10">
    <div class="flex flex-col gap-2 lg:px-108px md:px-15 ru-RU:md:px-12">
      <h2 class="section-title text-primary text-center">
        {{ title }}
      </h2>
      <p class="text-3.5 text-tertiary leading-20px text-center whitespace-pre-line md:text-4 xl:text-4.5 md:leading-24px xl:leading-28px">
        {{ desc }}
      </p>
    </div>

    <div class="mt-6 flex flex-col gap-10 lg:mt-10 md:mt-8 xl:mt-12">
      <div
        v-for="(item, index) in props.items" :key="index"
        :class="cn(
          'rounded-5 flex flex-col-reverse md:flex-row',
          item.wrapperClass,
          {
            'md:flex-row-reverse': isOdd(index),
            'bg-primary': index === 0,
          },
        )"
      >
        <div
          :class="cn(
            'flex flex-col gap-3 xl:gap-5 w-full md:w-1/2 pb-6 max-h-440px',
            'pt-3 sm:pt-5 md:pt-8 lg:pt-12 xl:pt-15 ru-RU:(lg:pt-10 xl:pt-12)',
            'px-6 md:px-8 lg:px-10 xl:px-12',
          )"
        >
          <h3 class="text-18px text-primary leading-6 font-600 multilingual-text xl:text-9 xl:leading-12 md:mt-5 ru-RU:(xl:text-8 md:mt-0)" :style="{ color: item.textColor }">
            {{ item.title }}
          </h3>
          <p :style="{ color: item.textColor }" class="text-3.75 text-secondary leading-[1.5] font-400 whitespace-pre-line xl:text-4.5 xl:leading-28px">
            {{ item.desc }}
          </p>
        </div>

        <div class="text-center max-h-440px w-full overflow-hidden md:w-1/2">
          <!-- <NuxtImg
            :src="item.image"
            format="avif"
            class="!aspect-[640/440] w-full"
            width="1280"
            densities="x1 x2"
            loading="lazy"
            alt=""
          /> -->
          <img :src="item.image" class="w-full !aspect-[640/440]" loading="lazy">
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.primary {
  background: v-bind(primaryColor);
  color: #fff;
}

.outlined {
  border: 2px solid v-bind(primaryColor);
  color: v-bind(primaryColor);
}

@media (max-width: 640px) {
  .outlined {
    border-width: 1px;
  }
}

.white {
  border-radius: 8px;
  border: 2px solid #fff;
  color: #fff;
}

.bg-primary {
  background: linear-gradient(180deg, v-bind(rgba1) 0%, v-bind(rgba2) 100%), #fff;
}
</style>
