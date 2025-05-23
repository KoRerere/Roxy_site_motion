<template>
  <div class="pt-10 sm:pt-12 md:pt-16 lg:pt-18 xl:pt-20 relative z-10">
    <h2 class="text-center section-title">
      {{ title }}
    </h2>

    <div class="flex flex-col gap-10 mt-6 md:mt-8 lg:mt-10 xl:mt-12">
      <div 
        v-for="(item, index) in props.list"
        :class="cn(
          'rounded-5 flex flex-col-reverse md:flex-row', 
          item.wrapClass, 
          {
            'md:flex-row-reverse': isOdd(index),
            'bg-primary': index === 0
          }
        )"
      >
        <div 
          :class="cn(
            'flex flex-col gap-3 xl:gap-5 w-full md:w-1/2 pb-6 max-h-440px',
            'pt-3 sm:pt-5 md:pt-8 lg:pt-12 xl:pt-15',
            'px-6 md:px-8 lg:px-10 xl:px-12'
          )"
        >
          <!-- <div>
            <span
              :class="cn(
                'font-[Archivo] font-600 text-3 lg:text-18px inline-flex items-center px-3 lg:px-4 h-6 lg:h-9 rounded-2', 
                item.labelType
              )"
              v-if="item.label"
            >
              {{ item.label }}
            </span>
          </div> -->
          <h3 
            class="font-[Archivo] font-600 text-18px xl:text-9 leading-6 xl:leading-12 md:mt-5" 
            :style="{ color: item.titleColor }"
          >{{ item.title }}</h3>
          <p :style="{ color: item.descColor }" class="text-4 xl:text-5 leading-[160%] xl:leading-8 font-400">
            {{ item.desc }}
          </p>
        </div>

        <div class="w-full md:w-1/2 overflow-hidden text-center max-h-440px">
          <RxResponsiveImage 
            :name="item.image" 
            :alt="item.alt"
            class="aspect-[640/440] w-full" 
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  list: {
    type: Array,
    default: () => ([])
  },
  // 主题颜色
  primaryColor: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  titleColor: {
    type: String,
    default: ''
  },
  descColor: {
    type: String,
    default: ''
  }
})
function isOdd(n) {
  return n % 2 === 1 || n % 2 === -1;
}

const rgba1 = computed(() => hexToRgba(props.primaryColor, 0.1))

const rgba2 = computed(() => hexToRgba(props.primaryColor, 0.04))
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