<template>
  <NuxtLinkLocale 
    class="relative hover-before p-2"
    :to="link"
  >
    <div class="relative z-2 flex gap-2 items-center">
      <span class="p-2 rounded-1 flex items-center justify-center">
        <RxIcon :name="icon" size="20" color="#2E3A48" />
      </span>
      <h3 class="text-13px text-primary font-500">{{ title }}</h3>
      <!-- <div class="flex flex-col gap-1">
        <h3 class="text-13px text-[#111213] font-500">{{ title }}</h3>
        <p class="text-12px text-[#575D60] font-400 max-w-240px">{{ desc }}</p>
      </div> -->
    </div>
  </NuxtLinkLocale>
</template>

<script setup>
import { RxIcon } from "@/components/rx-icon";

const props = defineProps({
  link: String,
  icon: String,
  title: String,
  desc: String,
})
</script>

<style scoped>
.hover-before:hover {
  border-radius: 4px;
  background-color: #F5F7F9;
}
</style>