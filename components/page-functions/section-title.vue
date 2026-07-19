<script setup lang="ts">
defineProps<{
  title: string
  description?: string
}>()
</script>

<template>
  <div class="section-title">
    <h2 class="title multilingual-text">
      {{ title }}
    </h2>
    <div v-if="description" class="description">
      {{ description }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.section-title {
  max-width: 1080px;
  margin: 0 auto;
  white-space: pre-line;
}

html[lang='ru-RU'] .section-title {
  max-width: 1120px;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */

  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.description {
  margin-top: 12px;
  color: var(--colors-text-text-tertiary, #575d60);
  text-align: center;
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
  letter-spacing: -0.054px;

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
  }
}
</style>
