<script setup lang="ts">
import PanelItem from './panel-item.vue'

interface CommonPanelMenuItem {
  icon: string
  title: string
  link: string
  iconSize?: string | number
}

const props = defineProps<{
  title: string
  blogInfo: {
    title: string
    excerpt: string
    feature_image: string
    link: string

  }
  items: CommonPanelMenuItem[][]
}>()

const { isRu } = useRxI18n()

const itemsLength = computed(() => props.items.length)
const itemsWidth = computed(() => {
  if (isRu.value) {
    return '320px'
  }
  return itemsLength.value > 1 ? '260px' : '300px'
})
</script>

<template>
  <div class="common-panel">
    <div class="modules-card">
      <div class="card-title">
        {{ title }}
      </div>
      <div class="flex gap-2">
        <template v-for="item in items" :key="item.title">
          <div class="flex flex-col" :style="{ width: itemsWidth }">
            <PanelItem v-for="feat in item" v-bind="feat" />
          </div>
        </template>
      </div>
    </div>

    <div v-if="blogInfo.link" class="blog-card">
      <div class="card-title">
        <NuxtLinkLocale to="/blog" class="color-[#11A3FD]">
          {{ $t('博客') }}
        </NuxtLinkLocale>
      </div>
      <NuxtLinkLocale :to="blogInfo.link" class="flex flex-col gap-3">
        <RxResponsiveImage :name="blogInfo.feature_image" class="h-30 w-full" />
        <div class="blog-content">
          <div class="blog-title multilingual-text">
            {{ blogInfo.title }}
          </div>
          <div class="blog-excerpt">
            {{ blogInfo.excerpt }}
          </div>
        </div>
      </NuxtLinkLocale>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.common-panel {
  width: 100%;
  display: flex;
  background-color: #fff;
}

.card-title {
  display: flex;
  padding: 8px 0;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-bottom: 0.5px solid var(--colors-border-border-subtle, #c7d1d6);

  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: 12px;
  font-style: normal;
  font-weight: 600;
  line-height: 16px;
  /* 133.333% */
}

.modules-card {
  width: calc(v-bind(itemsLength) * v-bind(itemsWidth) + (v-bind(itemsLength) - 1) * 8px + 32px);
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  gap: 8px;
  padding: 8px 16px 16px 16px;
}

.blog-card {
  width: 240px;
  display: flex;
  align-items: flex-start;
  flex-direction: column;
  padding: 8px 20px 20px 20px;
  gap: 12px;
  background: #f6f7f8;

  .blog-content {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

  .blog-title {
    color: var(--text-text-primary, #111213);
    font-size: 13px;
    font-style: normal;
    font-weight: 600;
    line-height: 18px;
    /* 138.462% */
  }

  .blog-excerpt {
    color: var(--text-text-teriiary, #575d60);
    font-family: Inter;
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;
    /* 150% */
  }
}
</style>
