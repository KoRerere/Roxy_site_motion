<template>
  <div class="xl:max-w-[1320px] xl:mx-auto px-0 md:px-5 lg:px-10 xl:px-0 pt-0 md:pt-110px">
    <div 
      class="pt-110px md:pt-40px xl:pt-15 grid grid-cols-1 md:grid-cols-2 gap-5 text-white rounded-t-0 md:rounded-t-5 rounded-b-5 relative overflow-hidden temp"  
      v-bind="$attrs"
    >
      <div class="flex flex-col gap-3 md:gap-5 pl-5 lg:pl-76px relative z-10">
        <div>
          <span 
            class="font-700 font-[Archivo] leading-5 py-1 px-6 border-1 border-solid border-white rounded-50px bg-white/10 inline-block"
          >
            Antidetect Browser
          </span>
        </div>
        <h1 class="font-[Archivo] text-7 sm:text-9 lg:text-10 leading-[1.4] md:leading-[1.2] xl:text-h2 font-700 whitespace-pre-wrap">
          {{ title?.replace('$', '') }}
        </h1>
        <p class="leading-28px text-white pb-0 md:pb-15">
          {{ desc }}
        </p>
      </div>

      <div class="overflow-hidden pl-5 md:pl-0  cover-image relative z-10">
        <RxResponsiveImage :name="coverImage" class="wh-full object-cover object-left-top" />
        <!-- <img :src="coverImage" class="wh-full object-cover object-left-top" /> -->
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  // label: {
  //   type: String,
  //   default: ''
  // },
  title: {
    type: String,
    default: ''
  },
  desc: {
    type: String,
    default: ''
  },
  coverImage: {
    type: String,
    default: ''
  },
  primaryColor: {
    type: String,
    default: ''
  }
})

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

.temp::before, .temp::after {
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