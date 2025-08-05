<template>
  <div class="relative z-10">
    <div class="flex flex-col gap-2 md:px-15 lg:px-108px">
      <h2 class="text-primary text-center section-title">
        {{ title }}
      </h2>
      <p class="text-3.5 md:text-4 xl:text-4.5 leading-20px md:leading-24px xl:leading-28px text-tertiary text-center whitespace-pre-line">{{ desc }}</p>
    </div>

    <div class="flex flex-col gap-10 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
      <div v-for="(item, index) in props.items" :class="cn(
        'rounded-5 flex flex-col-reverse md:flex-row',
        item.wrapperClass,
        {
          'md:flex-row-reverse': isOdd(index),
          'bg-primary': index === 0
        }
      )">
        <div :class="cn(
          'flex flex-col gap-3 xl:gap-5 w-full md:w-1/2 pb-6 max-h-440px',
          'pt-3 sm:pt-5 md:pt-8 lg:pt-12 xl:pt-15',
          'px-6 md:px-8 lg:px-10 xl:px-12'
        )">
          <h3 class="font-[Archivo] font-600 text-18px xl:text-9 leading-6 xl:leading-12 md:mt-5 text-primary" :style="{ color: item.textColor }">{{ item.title }}</h3>
          <p :style="{ color: item.textColor }" class="text-3.75 xl:text-4.5 leading-[1.5] xl:leading-28px font-400 whitespace-pre-line text-secondary">
            {{ item.desc }}
          </p>
        </div>

        <div class="w-full md:w-1/2 overflow-hidden text-center max-h-440px">
          <!-- <NuxtImg 
            :src="item.image" 
            format="avif" 
            class="!aspect-[640/440] w-full" 
            width="1280" 
            densities="x1 x2"
            loading="lazy"
            alt=""
          /> -->
          <img :src="item.image" class="!aspect-[640/440] w-full" loading="lazy" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { IntroduceProps } from './interface';
const props = defineProps<IntroduceProps>()
function isOdd(n: number) {
  return n % 2 === 1 || n % 2 === -1;
}

const rgba1 = computed(() => hexToRgba(props.primaryColor, 0.15))
const rgba2 = computed(() => hexToRgba(props.primaryColor, 0.08))
</script>

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
  border: 2px solid #FFF;
  color: #FFF;
}

.bg-primary {
  background: linear-gradient(180deg, v-bind(rgba1) 0%, v-bind(rgba2) 100%), #FFF;
}
</style>