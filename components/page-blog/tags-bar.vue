<script setup lang="tsx">
const props = withDefaults(defineProps<{
  tags: Tag[]
  currentTag: string
}>(), {
  tags: () => [],
  currentTag: '',
})
const { $t } = useRxI18n()
interface Tag {
  id: string
  name: string
  slug: string
  description: string
}

const moduleValue = defineModel<string>('modelValue', {
  default: '',
})

const tabs = computed(() => {
  const __tags = props.tags.map(t => ({
    label: t.name,
    key: t.slug,
    to: `/blog/tag-${t.slug}`,
    attrs: {
      rel: 'nofollow',
    },
  }))
  __tags.unshift({
    label: $t('全部文章'),
    key: '',
    to: '/blog',
    attrs: {
      rel: 'nofollow',
    },
  })
  return __tags
})

watch(() => props.currentTag, () => {
  moduleValue.value = props.currentTag
}, {
  immediate: true,
})
</script>

<template>
  <div class="tags-bar w-full">
    <RxTabs
      v-model="moduleValue"
      :tabs="tabs"
      class="w-full"
    />
  </div>
</template>
