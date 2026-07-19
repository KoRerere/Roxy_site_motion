<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

defineProps<{
  title: string
  icon: string
  description: string
  features: string[]
}>()
</script>

<template>
  <div class="pt-36 flex flex-col gap-4 max-w-250 items-center justify-center ru-RU:max-w-300">
    <h1 class="title multilingual-text whitespace-pre-line">
      <rx-i18n-t :keypath="title">
        <template #icon>
          <span>
            <rx-icon-svg-icon class="h-9 w-9 translate-y-2 rotate-15 md:h-14 md:w-14" :name="icon" />
          </span>
        </template>
      </rx-i18n-t>
    </h1>
    <div class="text-4 color-secondary leading-28px text-center md:text-4.5">
      {{ description }}
    </div>
    <div class="mx-auto flex flex-wrap gap-x-4 gap-y-2 items-center justify-center">
      <div v-for="feature in features" :key="feature" class="flex gap-2 items-center">
        <rx-icon-svg-icon name="base/rx_ic_check_fill" />
        <span>{{ feature }}</span>
      </div>
    </div>

    <TryItNow class="mt-5 z-10" type="primary" />
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-size: var(--Heading-H2, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H2, 60px);
}

@media (max-width: 768px) {
  .title {
    color: var(--colors-text-text-primary, #111213);
    text-align: center;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    /* 33.6px */
  }
}
</style>
