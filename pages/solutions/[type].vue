<template>
  <main ref="mainRef" style="background: linear-gradient(0deg, #F8FAFB 0%, #F8FAFB 100%), #1E1C31;" class="pb-10">
    <Temp v-bind="data" />
  </main>
</template>

<script setup>
import Temp from '@/components/page-solutions/Temp.vue'
import { useText } from '@/components/page-solutions/useText'

const data = useText()
useBackTop(useTemplateRef('mainRef'))

</script>
