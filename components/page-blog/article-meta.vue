<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { article } = defineProps<{
  article: any,
  hideReadTime?: boolean
}>()
console.log('article', article)
const publishDate = computed(() => {
  const publishedAt = new Date(article.published_at)

  const formatter = new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit'
  }); 
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
    <div class="article-meta-item-divider">｜</div>
   <template v-if="!hideReadTime">
    <div  class="article-meta-item">
      <RxIcon name="base/rx_ic_time" />
      {{ readingTime }}
    </div>
    <div class="article-meta-item-divider">｜</div>
   </template>
    <div class="article-meta-item">
      {{ $t('作者：{name}', { name: article.authors?.[0]?.name }) }}
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-meta {
  margin-top: 20px;
  display: inline-flex;
  align-items: center;
  gap: 12px;

  @media (max-width: 768px) {
    gap: 6px;
  }
}

.article-meta-item {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 128.571% */
  text-transform: capitalize;
}

.article-meta-item-divider {
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 18px; /* 128.571% */
  color: #e2e2e2;
}
</style>