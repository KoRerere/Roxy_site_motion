<template>
  <div class="bg-gradient relative">
    <Container class="sm:px-5 md:px-10 lg:px-15 xl:px-22 relative z-10">
      <div class="flex gap-10 flex-col lg:flex-row py-6 md:py-0">
        <div class="flex flex-col justify-between py-0 md:py-8 lg:py-12 xl:py-15 flex-1">
          <div class="flex flex-col gap-3">
            <p class="text-6 xl:text-h3 text-black font-[Archivo] font-600">{{ title }}</p>
            <p class="text-4 xl:text-4.5 leading-[1.6] xl:leading-7 font-400 whitespace-pre-line text-secondary">{{ desc }}</p>
          </div>
          <div class="pt-6 lg:pt-0 flex">
            <TryItNow class="try-now" />
          </div>
        </div>
        <div class="py-0 w-full lg:py-5 lg:w-542px">
          <!-- <NuxtImg :src="image" format="avif" class="w-full"  densities="x1 x2"
            loading="lazy"
            alt=""
          />  -->
          <img :alt="alt" :src="image" class="w-full" loading="lazy" />
        </div>
      </div>
    </Container>
    <Grid :primaryColor="primaryColor" class="block absolute left-1/2 bottom-0 -translate-x-1/2 w-2000px h-400px z-9" />
  </div>
</template>

<script setup lang="ts">
import type { Introduce2Props } from './interface';
import TryItNow from './TryItNow.vue';
import Grid from './Grid.vue';
const props = defineProps<Introduce2Props>()
const rgba = computed(() => hexToRgba(props.primaryColor, 0.08))
const rgba2 = computed(() => hexToRgba(props.primaryColor, 0.14))

const tryBtnColor = computed(() => hexToRgba(props.primaryColor, 0.9))
const tryBtnshadowColor = computed(() => hexToRgba(props.primaryColor, 0.3))
</script>

<style scoped>
.bg-gradient {
  background: linear-gradient(180deg, v-bind(rgba) 0%, v-bind(rgba2) 100%), #FFF;
}


.try-now {
  color: #FFF;
  background-color: v-bind(tryBtnColor);
}

.try-now:hover {
  box-shadow: 0px 2px 8px 0px v-bind(tryBtnshadowColor);
  background-color: v-bind(primaryColor);
}
</style>