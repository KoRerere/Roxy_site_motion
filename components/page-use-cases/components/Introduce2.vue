<script setup lang="ts">
import type { Introduce2Props } from './interface'
import Grid from './Grid.vue'
import TryItNow from './TryItNow.vue'

const props = defineProps<Introduce2Props>()
const rgba = computed(() => hexToRgba(props.primaryColor, 0.08))
const rgba2 = computed(() => hexToRgba(props.primaryColor, 0.14))

const tryBtnColor = computed(() => hexToRgba(props.primaryColor, 0.9))
const tryBtnshadowColor = computed(() => hexToRgba(props.primaryColor, 0.3))
</script>

<template>
  <div class="relative bg-gradient">
    <Container class="relative z-10 lg:px-15 md:px-10 sm:px-5 xl:px-22">
      <div class="py-6 flex flex-col gap-10 md:py-0 lg:flex-row">
        <div class="py-0 flex flex-1 flex-col justify-between lg:py-12 md:py-8 xl:py-15">
          <div class="flex flex-col gap-3">
            <p class="text-6 text-black font-600 multilingual-text xl:text-h3 ru-RU:(leading-40px xl:text-8)">
              {{ title }}
            </p>
            <p class="text-4 text-secondary leading-[1.6] font-400 whitespace-pre-line xl:text-4.5 xl:leading-7">
              {{ desc }}
            </p>
          </div>
          <div class="pt-6 flex lg:pt-0">
            <TryItNow class="try-now" />
          </div>
        </div>
        <div class="py-0 w-full lg:py-5 lg:w-542px">
          <!-- <NuxtImg :src="image" format="avif" class="w-full"  densities="x1 x2"
            loading="lazy"
            alt=""
          />  -->
          <img :alt="alt" :src="image" class="w-full" loading="lazy">
        </div>
      </div>
    </Container>
    <Grid :primary-color="primaryColor" class="h-400px w-2000px block bottom-0 left-1/2 absolute z-9 -translate-x-1/2" />
  </div>
</template>

<style scoped>
.bg-gradient {
  background: linear-gradient(180deg, v-bind(rgba) 0%, v-bind(rgba2) 100%), #fff;
}

.try-now {
  color: #fff;
  background-color: v-bind(tryBtnColor);
}

.try-now:hover {
  box-shadow: 0px 2px 8px 0px v-bind(tryBtnshadowColor);
  background-color: v-bind(primaryColor);
}
</style>
