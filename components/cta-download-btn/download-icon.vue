<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { downloadIcon } = useDownload()
</script>

<template>
  <RxIcon :name="downloadIcon" v-bind="$attrs" />
</template>
