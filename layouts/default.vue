<template>
  <slot></slot>
</template>

<script setup>
import { useCustomHead } from './hooks/useCustomHead'
import { useRoxySeoMeta } from './hooks/useRoxySeoMeta'

useCustomHead()
useRoxySeoMeta()
</script>