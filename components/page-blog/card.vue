<template>
  <NuxtLink
    :to="localePath(`/blog/${slug}`)" 
    class="cursor-pointer rounded-[8px] overflow-hidden w-full"
    external
  >
    <div class="xl:h-[244px] lg:h-[256px] md:h-[199px] h-[200px] overflow-hidden">
      <img :src="article.feature_image" class="w-full h-full object-contain object-center rounded-t-2" />
    </div>
    <div class="px-4 py-[14px] flex flex-col overflow-hidden">
      <!-- <div class="flex gap-2">
        <div 
          v-for="t in article.tags.filter(t => t.description.includes(`{${locale}}`))"
          class="article-tag"
        >
          {{ t.name }}
        </div>
      </div> -->
      <div class="mt-1.5 mb-3">
        <div class="article-title truncate">{{ article.title }}</div>
        <div class="article-excerpt" v-if="!hideExcerpt">{{ article.custom_excerpt || article.excerpt }}</div>
      </div>
      <div class="article-info">
        <page-blog-article-meta :article="article" hide-read-time  />
      </div>
    </div>
  </NuxtLink>
</template>

<script setup lang="ts">
import { formatArticleReadingTime } from './utils'
import { DEFAULT_LANGUAGE } from '@/constants'

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

const slug = computed(() => {
  if (locale.value === DEFAULT_LANGUAGE) {
    return props.article.slug
  } else {
    return props.article.slug.replace(`${locale.value}-`, '')
  }
})

</script>

<style lang="scss" scoped>
.article-tag {
  color: var(--border-border-brand, #11A3FD);
  font-size: 14px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #12A3FC;
  background: var(--blue-25, #F5FBFF);
}

.article-title {
  color: var(--text-text-primary, #111213);
  font-size: 22px;
  font-weight: 500;
  line-height: 28px; 
}

.article-excerpt {
  color: var(--text-text-teriiary, #575D60);
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
  font-size: 14px;
}
</style>
