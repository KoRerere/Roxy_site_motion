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
  <div class="max-w-250 pt-36 flex flex-col gap-4 justify-center items-center">
    <h1 class="title whitespace-pre-line">
      <rx-i18n-t :keypath="title">
        <template #icon>
          <span>
            <rx-icon-svg-icon class="translate-y-2 rotate-15 w-9 h-9 md:w-14 md:h-14" :name="icon" />
          </span>
        </template>
      </rx-i18n-t>
    </h1>
    <div class="color-secondary text-4 md:text-4.5 leading-28px text-center">
      {{ description }}
    </div>
    <div class="flex items-center gap-x-4 gap-y-2 flex-wrap mx-auto justify-center">
      <div v-for="feature in features" :key="feature" class="flex items-center gap-2">
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
  font-family: Archivo;
  font-size: var(--Heading-H2, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H2, 60px);
}

@media (max-width: 768px) {
  .title {
    color: var(--colors-text-text-primary, #111213);
    text-align: center;
    font-family: Archivo;
    font-size: 28px;
    font-style: normal;
    font-weight: 700;
    line-height: 120%;
    /* 33.6px */
  }
}
</style>
