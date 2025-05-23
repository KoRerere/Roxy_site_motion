<template>
  <img src="/bg-effect.svg" alt="" class="w-full absolute top-0 left-0 z-0 max-h-650px" />

  <section class="xl:w-[1320px] xl:mx-auto px-0 md:px-5 lg:px-10 xl:px-0 pt-0 md:pt-110px">
    <div 
      :class="cn(
        'text-white rounded-t-0 md:rounded-t-5 rounded-b-5 relative overflow-hidden temp',
        'pt-24 md:pt-10',
        'px-5 sm:px-6 md:px-8 lg:px-10 xl:px-12',
        'pb-5 md:pb-10 lg:pb-12 xl:pb-15'
      )"  
      v-bind="$attrs"
    >
      <div class="relative z-10 flex flex-col justify-center items-center gap-4">
        <div class="flex justify-center">
          <span 
            class="font-700 font-[Archivo] leading-5 py-1 px-6 border-1 border-solid border-white rounded-50px bg-white/10 inline-block"
          >
            {{ label }}
          </span>
        </div>
        <h1 class="text-center font-[Archivo] text-7 sm:text-12 leading-[1.4] sm:leading-60px font-700">
          {{ title }}
        </h1>
        <p class="text-center leading-28px lg:w-70%">
          {{ desc }}
        </p>
      </div>

      <div class="temp2"></div>
    </div>
  </section>

  <Container tag="section">
    <Explore :list="exploreList" :title="exploreTitle" :primaryColor="primaryColor" />
    <PanelDownload2 />
  </Container>
</template>

<script setup>
import Explore from '@/components/IntroduceTemplate/Explore.vue'

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  desc: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  exploreTitle: {
    type: String,
    required: true,
  },
  exploreList: {
    type: Array,
    required: true,
  },
  primaryColor: {
    type: String,
    required: true,
  }
})

const rgba = computed(() => hexToRgba(props.primaryColor || '#11A3FD', 0.6))
</script>

<style scoped>
.temp {
  background: linear-gradient(180deg, v-bind(primaryColor) 0%, v-bind(rgba) 100%), #FFF;
}

.temp::before, .temp::after {
  content: '';
  position: absolute;
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

.temp2 {
  position: absolute;
  top: 60%;
  right: -10%;
  width: 50%;
  aspect-ratio: 1;
  border-radius: 50%;
  z-index: 0;
  background: v-bind(primaryColor);
  opacity: 0.6;
}

@media (max-width: 768px) {
  .temp::before, .temp::after, .temp2 {
    top: 55%;
  }
}

@media (max-width: 1024px) {
  .temp::before, .temp::after, .temp2 {
    top: 70%;
  }
}

@media (max-width: 640px) {
  .temp::before {
    left: -50%;
  }
  .temp::after {
    left: 100%;
  }
  .temp2 {
    right: 0;
  }
  .temp::before, .temp::after, .temp2 {
    top: 90%;
    width: 100%;
  }
}
</style>