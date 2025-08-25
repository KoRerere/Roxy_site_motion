<template>
  <Container class="px-5 md:px-10 lg:px-15 xl:px-108px flex flex-col gap-10 pb-8">
    <div class="flex flex-col gap-2">
      <h2 class="text-6 leading-[28px] lg:text-h3 text-primary text-center font-[Archivo]">
        {{ title }}
      </h2>
      <p class="text-3.5 leading-[20px] lg:text-body text-tertiary text-center whitespace-pre-line">
        {{ desc }}
      </p>
    </div>
    <Accordion :items="items" />
  </Container>
</template>


<script setup lang="ts">
import type { FAQProps } from './interface';
import Accordion from './accordion/index.vue';

defineProps<FAQProps>()
</script>