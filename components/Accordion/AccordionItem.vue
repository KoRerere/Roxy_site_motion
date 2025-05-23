<template>
  <div v-bind="$attrs" @click="toggle">
    <div
      class="flex items-center justify-between w-full"
    >
      <slot name="trigger" :isTrigger="props.value == activeItem" />
    </div>

    <Transition
      name="accordion"
      @enter="enter"
      @after-enter="afterEnter"
      @before-leave="beforeLeave"
      @leave="leave"
    >
      <div v-show="isActive" class="overflow-hidden">
        <div ref="content" class="">
          <slot name="content" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { inject, computed, ref } from 'vue'

const props = defineProps({
  value: {
    type: Number,
    required: true
  }
})

const { activeItem, setActiveItem } = inject('accordionContext')
const isActive = computed(() => activeItem.value === props.value)
const content = ref(null)

const toggle = () => {
  setActiveItem(props.value)
}

const enter = (el) => {
  el.style.height = '0'
  requestAnimationFrame(() => {
    el.style.height = `${content.value.scrollHeight}px`
  })
}

const afterEnter = (el) => {
  el.style.height = null
}

const beforeLeave = (el) => {
  el.style.height = `${el.scrollHeight}px`
}

const leave = (el) => {
  requestAnimationFrame(() => {
    el.style.height = '0'
  })
}
</script>

<style>
/* .accordion-enter-active,
.accordion-leave-active {
  transition: height 0.3s ease-out;
  overflow: hidden;
} */

.accordion-enter-active {
  transition: height 0.2s ease-out;
  overflow: hidden;
}

.accordion-leave-active {
  transition: height 0.15s ease-out;
  overflow: hidden;
}
</style>