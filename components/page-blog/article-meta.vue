<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { article, hideReadTime, hideAuthor } = defineProps<{
  article: any
  hideReadTime?: boolean
  hideAuthor?: boolean
}>()

const localePath = useLocalePath()

const authorSlug = computed(() => article.authors?.[0]?.slug)

const authorProfileTo = computed(() => {
  if (!authorSlug.value)
    return ''
  const path = `/blog/author/${authorSlug.value}`
  return localePath(path)
})

const publishDate = computed(() => {
  const publishedAt = new Date(article.published_at)

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  })
  return formatter.format(publishedAt).replace(/-/g, '/')
})

const readingTime = computed(() => {
  return $t('预计阅读：{minutes}分钟', { minutes: article.reading_time })
})
</script>

<template>
  <div class="article-meta">
    <div class="article-meta-item">
      <RxIcon name="base/rx_ic_calendar" />
      {{ publishDate }}
    </div>
    <div class="article-meta-item-divider" />
    <template v-if="!hideReadTime">
      <div class="article-meta-item">
        <RxIcon name="base/rx_ic_time" />
        {{ readingTime }}
      </div>
      <div v-if="!hideAuthor && article.authors?.[0]" class="article-meta-item-divider" />
    </template>
    <template v-if="!hideAuthor && article.authors?.[0]">
      <NuxtLinkLocale v-if="authorProfileTo" :to="authorProfileTo"
        class="article-meta-item article-meta-author-link">
        <img v-if="article.authors[0].profile_image" :src="article.authors[0].profile_image" alt=""
          class="rounded-full h-6 w-6">
        <RxIcon v-else name="base/rx_ic_logo_transparent" size="24" />
        {{ article.authors[0].name }}
      </NuxtLinkLocale>
      <div v-else class="article-meta-item">
        <img v-if="article.authors[0].profile_image" :src="article.authors[0].profile_image" alt=""
          class="rounded-full h-6 w-6">
        <RxIcon v-else name="base/rx_ic_logo_transparent" size="24" />
        {{ article.authors[0].name }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.article-meta {
  margin-top: 20px;
  display: inline-flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 12px 32px;
}

.article-meta-item {
  display: flex;
  align-items: center;
  gap: 8px;
  color: var(--colors-text-text-primary, #111213);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  text-transform: capitalize;
}

.article-meta-item-divider {
  width: 1px;
  height: 18px;
  background-color: #989ca0;
}

.article-meta-author-link {
  text-decoration: none;
  transition: color 0.15s ease;

  &:hover {
    color: #11a3fd;
  }
}
</style>
