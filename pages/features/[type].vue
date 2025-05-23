<template>
  <BgEffect />
  <main ref="mainRef">
    <IntroduceTemplate v-bind="data" />
  </main>
</template>

<script setup lang="ts">
import { useText } from '@/components/page-features/text'

const route = useRoute()

const data = useText(route.params.type);
useBackTop(useTemplateRef('mainRef'));

useHead({
  meta: [
    {
      name: 'description',
      content: data.metaDescription
    }
  ]
})
</script>