<script setup lang="ts">
import type { HeaderPanelProps } from './interface'
import TryItNow from './TryItNow.vue'

const props = defineProps<HeaderPanelProps>()
const rgba = computed(() => hexToRgba(props.primaryColor, 0.6))
const rgba30 = computed(() => hexToRgba(props.primaryColor, 0.3))
const rgba0 = computed(() => hexToRgba(props.primaryColor, 0.0))
</script>

<template>
  <div class="px-0 pt-0 xl:mx-auto lg:px-10 md:px-5 xl:px-0 md:pt-110px xl:max-w-[1440px]">
    <div class="temp text-white pt-110px rounded-b-5 rounded-t-0 gap-5 grid grid-cols-1 relative overflow-hidden md:pt-40px xl:pt-15 md:rounded-t-5 md:grid-cols-2" v-bind="$attrs">
      <div class="px-5 pb-15 flex flex-col justify-between relative z-10 lg:px-19 md:gap-5">
        <div class="flex flex-col gap-5">
          <h1 class="text-6 leading-[1.4] font-700 multilingual-text lg:text-9 sm:text-8 xl:text-11 md:leading-[1.2] xl:leading-50px ru-RU:xl:text-9">
            {{ title }}
          </h1>
          <p class="text-white leading-24px pb-0 whitespace-pre-line xl:text-5 xl:leading-32px">
            {{ desc }}
          </p>
        </div>
        <div class="hidden md:flex">
          <TryItNow :style="{ color: primaryColor }" />
        </div>
      </div>

      <div class="cover-image pl-5 relative z-10 overflow-hidden md:pl-0">
        <!-- <NuxtImg :src="coverImage" format="avif" class="wh-full object-cover object-left-top" densities="x1 x2"
          sizes="sm:120vw md:60vw lg:800px"
          loading="lazy"
          alt=""
        /> -->
        <img :src="coverImage" class="wh-full object-cover object-left-top" loading="lazy" alt="">
      </div>
    </div>
  </div>
</template>

<style scoped>
.temp {
  background: linear-gradient(180deg, v-bind(primaryColor) 0%, v-bind(rgba) 100%), #fff;
}

.cover-image::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 33%;
  background: linear-gradient(180deg, v-bind(rgba0) 0%, v-bind(rgba30) 100%);
}

.temp::before,
.temp::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 50%;
  aspect-ratio: 1;
  border-radius: 50%;
  z-index: 0;
}

.temp::before {
  top: 60%;
  left: -10%;
  background: v-bind(primaryColor);
  opacity: 0.6;
}

.temp::after {
  top: 60%;
  left: 50%;
  transform: translateX(-50%);
  background: v-bind(primaryColor);
}
</style>
