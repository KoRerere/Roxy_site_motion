<template>
  <div class="tags-bar w-full">
    <RoxyTabs 
      :tabs="tabs" 
      v-model="activeTagSlug" 
      class="w-full"
    >
      <template #tab-item="{ tab }">
        <NuxtLinkLocale 
          :to="`/blog?tag=${tab.key}`"
          class="tag-item"
          :class="[
            activeTagSlug === tab.key ? 'active' : ''
          ]"
        >{{tab.label}}</NuxtLinkLocale>
      </template>
    </RoxyTabs>
  </div>
</template>

<script setup lang="tsx">
import { NuxtLinkLocale } from '#components';
import { useI18n } from 'vue-i18n';

const route = useRoute();
const { t } = useI18n();
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

const activeTagSlug = ref(route.query?.tag || '')

const tabs = computed(() => {
  activeTagSlug.value;
  const __tags = props.tags.map(t => ({
    label: t.name,
    key: t.slug,
  }))
  __tags.unshift({
    label: t('All'),
    key: '',
  })
  return __tags
})

</script>

<style lang="scss" scoped>
.tags-bar {
  display: flex;
  align-items: center;
  gap: 10px;
  white-space:nowrap;
}

.tag-item {
  padding: 8px 14px;
  border-radius: 8px;
  color: #4D5562;
  font-size: 14px;
}

.tag-item.active {
  background-color: #F1F5F8;
  color: #121826;
  font-size: 15px;
}
</style>