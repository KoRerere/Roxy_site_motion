<template>
  <div class="xl:max-w-[1320px] xl:mx-auto px-0 md:px-5 lg:px-10 xl:px-0 pt-0 md:pt-110px">
    <div class="pt-110px md:pt-40px xl:pt-15 grid grid-cols-1 md:grid-cols-2 gap-5 text-white rounded-t-0 md:rounded-t-5 rounded-b-5 relative overflow-hidden temp" v-bind="$attrs">
      <div class="flex flex-col justify-between md:gap-5 px-5 lg:px-19 relative z-10 pb-15">
        <div class="flex flex-col gap-5">
          <h1 class="font-[Archivo] text-6 sm:text-8 lg:text-9 xl:text-11 leading-[1.4] md:leading-[1.2] xl:leading-50px font-700">
            {{ title }}
          </h1>
          <p class="xl:text-5 leading-24px xl:leading-32px text-white pb-0 whitespace-pre-line">
            {{ desc }}
          </p>
        </div>
        <div class="hidden md:flex">
          <TryItNow :style="{ color: primaryColor }" />
        </div>
      </div>

      <div class="overflow-hidden pl-5 md:pl-0 relative z-10 cover-image">
        <!-- <NuxtImg :src="coverImage" format="avif" class="wh-full object-cover object-left-top" densities="x1 x2"
          sizes="sm:120vw md:60vw lg:800px"
          loading="lazy"
          alt=""
        /> -->
        <img :src="coverImage" class="wh-full object-cover object-left-top" loading="lazy" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { HeaderPanelProps } from './interface';
import TryItNow from './TryItNow.vue';

const props = defineProps<HeaderPanelProps>()
const rgba = computed(() => hexToRgba(props.primaryColor, 0.6))
const rgba30 = computed(() => hexToRgba(props.primaryColor, 0.3))
const rgba0 = computed(() => hexToRgba(props.primaryColor, 0.0))
</script>

<style scoped>
.temp {
  background: linear-gradient(180deg, v-bind(primaryColor) 0%, v-bind(rgba) 100%), #FFF;
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