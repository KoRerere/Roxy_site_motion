<script setup>
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  link: String,
  icon: String,
  desc: String,
  title: {
    type: [Object, String, Function],
    default: undefined,
  },
  iconSize: {
    type: [String, Number],
    default: 20,
  },
})
</script>

<template>
  <NuxtLinkLocale
    class="hover-before py-3 pl-1.5 pr-3 relative"
    :to="link"
  >
    <div class="flex gap-2 relative z-2">
      <span class="p-2 rounded-1 flex justify-center">
        <RxIcon :name="icon" :size="iconSize" color="#2E3A48" />
      </span>
      <div class="flex flex-col gap-1">
        <component
          :is="title"
          v-if="title && typeof title && typeof title !== 'string'"
        />
        <h3
          v-else
          class="text-14px text-primary font-500"
        >
          {{ title }}
        </h3>
        <p v-if="desc" class="text-12px text-tertiary font-400">
          {{ desc }}
        </p>
      </div>
    </div>
  </NuxtLinkLocale>
</template>

<style scoped>
.hover-before:hover {
  border-radius: 8px;
  background-color: #f5f7f9;
}
</style>
