<script setup lang="ts">
interface Step {
  number: string
  title: string
  description: string
  image?: string
}

defineProps<{
  steps: Step[]
}>()
</script>

<template>
  <div class="flex flex-col gap-10">
    <div
      v-for="step in steps"
      :key="step.number"
      class="flex flex-col gap-4 items-start lg:flex-row"
    >
      <!-- Text content -->
      <div class="py-5 flex flex-1 flex-col gap-4">
        <h3 class="text-20px text-primary leading-[27px] font-600">
          {{ step.number }}、{{ step.title }}
        </h3>
        <p class="text-sub-title text-primary leading-24px pl-7">
          {{ step.description }}
        </p>
      </div>

      <!-- Image -->
      <div class="shrink-0 w-full lg:w-416px">
        <div class="border border-black/6 rounded-2 bg-gray-50 h-240px overflow-hidden">
          <img
            v-if="step.image"
            :src="step.image"
            :alt="step.title"
            class="h-full w-full object-cover"
          >
          <div v-else class="text-14px text-tertiary flex h-full w-full items-center justify-center">
            图片占位符
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
