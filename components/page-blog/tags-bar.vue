<template>
  <div class="tags-bar w-full">
    <RxTabs 
      :tabs="tabs" 
      v-model="moduleValue" 
      class="w-full"
    />
  </div>
</template>

<script setup lang="tsx">
const { $t } = useRxI18n();
type Tag = {
  id: string
  name: string
  slug: string
  description: string
}

const props = withDefaults(defineProps<{
  tags: Tag[]
}>(), {
  tags: () => []
})

const moduleValue = defineModel<string>('modelValue', { 
  required: true,
  default: ''
})

const tabs = computed(() => {
  const __tags = props.tags.map(t => ({
    label: t.name,
    key: t.slug,
    to: `/blog?tag=${t.slug}`
  }))
  __tags.unshift({
    label: $t('全部'),
    key: '',
    to: "/blog"
  })
  return __tags
})

</script>
