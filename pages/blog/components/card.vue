<template>
  <NuxtLink
    :to="localePath(`/blog/${article.slug}`)" 
    class="cursor-pointer rounded-[8px] overflow-hidden w-full"
    external
  >
    <div class="xl:h-[244px] lg:h-[256px] md:h-[199px] xs:h-[260px] overflow-hidden">
      <img :src="article.feature_image" class="w-full" />
    </div>
    <div class="px-4 py-[14px] flex flex-col gap-3 overflow-hidden">
      <div class="flex gap-2">
        <div 
          v-for="t in article.tags.filter(t => t.description.includes(`{${locale}}`))"
          class="article-tag"
        >
          {{ t.name }}
        </div>
      </div>
      <div >
        <div class="article-title truncate">{{ article.title }}</div>
        <div class="article-excerpt" v-if="!hideExcerpt">{{ article.custom_excerpt || article.excerpt }}</div>
      </div>
      <div class="article-info">
        {{ formatArticleReadingTime(article) }}
      </div>
    </div>
  </NuxtLink>
</template>

<script setup>
import { formatArticleReadingTime } from '../utils'
const localePath = useLocalePath()
const { locale } = useI18n()
const props = defineProps({
  article: {
    type: Object,
    required: true
  },
  hideExcerpt: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
.article-tag {
  color: var(--border-border-brand, #11A3FD);
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #12A3FC;
  background: var(--blue-25, #F5FBFF);
}

.article-title {
  color: var(--text-text-primary, #111213);
  font-family: Inter;
  font-size: 22px;
  font-weight: 500;
  line-height: 28px; 
}

.article-excerpt {
  color: var(--text-text-teriiary, #575D60);
  font-family: Inter;
  font-size: 16px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 6px;
}

.article-info {
  color: var(--text-text-inactive, #7D8387);
  font-family: Inter;
  font-size: 14px;
}
</style>
