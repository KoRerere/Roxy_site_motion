<script setup>
import { debounce } from 'es-toolkit'

const currentValue = reactive({
  value: '',
  oldValue: ''
})

const offset = ref(0);

const slide1 = useTemplateRef('slide1');
const slide2 = useTemplateRef('slide2');
const height = ref(0);

const props = defineProps({
  value: {
    type: String,
    required: true
  }
})

const { value } = toRefs(props)

let timer = null;
watchEffect(() => {
  if (currentValue.value === '') {
    currentValue.oldValue = value.value;
    currentValue.value = value.value;
    timer = setTimeout(() => {
      height.value = slide2.value?.getBoundingClientRect().height;
    }, 200)
  } else {
    slide1.value.classList.add('transition-all');
    slide2.value.classList.add('transition-all');
    currentValue.value = currentValue.value;
    currentValue.value = value.value;
    offset.value = -height.value;
    
    timer = setTimeout(() => {
      slide1.value.classList.remove('transition-all');
      slide2.value.classList.remove('transition-all');
      offset.value = 0;
      currentValue.oldValue = currentValue.value;
    }, 1000)
  }
})

const init = debounce(() => {
  height.value = slide2.value?.getBoundingClientRect().height;
}, 100)

watch(value, () => {
  init()
})

onMounted(() => {
  window.addEventListener('resize', init)
  onUnmounted(() => {
    clearTimeout(timer);
    window.removeEventListener('resize', init)
  })
})
</script>

<template>
  <div class="overflow-hidden" v-bind="$attrs" :style="{ height: `${height}px` }">
    <div ref="slide1" :style="{ transform: `translateY(${offset}px)` }">{{ currentValue.oldValue }}</div>
    <div ref="slide2" :style="{ transform: `translateY(${offset}px)` }">{{ currentValue.value }}</div>
  </div>
</template>