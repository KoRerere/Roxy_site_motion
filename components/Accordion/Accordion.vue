<script setup>
import { provide, ref } from 'vue'

const props = defineProps({
  defaultActive: {
    type: Number,
    default: -1,
  },
})

const emit = defineEmits(['change'])

const accordionRoot = ref(null)
const activeItem = ref(props.defaultActive)
function setActiveItem(itemValue) {
  activeItem.value = activeItem.value === itemValue ? null : itemValue
  emit('change', activeItem.value)
}

provide('accordionContext', {
  activeItem,
  setActiveItem,
})

// 暴露内部状态和方法给父组件
defineExpose({
  accordionRoot,
  setActiveItem,
  closeAll() {
    activeItem.value = null
  },
})
</script>

<template>
  <div ref="accordionRoot" v-bind="$attrs">
    <slot />
  </div>
</template>
