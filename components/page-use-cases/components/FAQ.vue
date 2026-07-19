<script setup lang="ts">
import type { FAQProps } from './interface'
import Accordion from './accordion/index.vue'

defineProps<FAQProps>()
</script>

<template>
  <Container class="px-5 pb-8 flex flex-col gap-10 lg:px-15 md:px-10 xl:px-108px">
    <div class="flex flex-col gap-2">
      <h2 class="section-title text-primary text-center">
        {{ title }}
      </h2>
      <p class="text-3.5 text-tertiary text-center whitespace-pre-line lg:text-body max-lg:leading-[20px]">
        {{ desc }}
      </p>
    </div>
    <Accordion :items="items" />
  </Container>
</template>
