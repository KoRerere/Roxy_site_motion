<script setup lang="ts">
import { DEFAULT_LANGUAGE } from '@/constants'

const props = defineProps({
  article: {
    type: Object,
    required: true,
  },
  hideExcerpt: {
    type: Boolean,
    default: false,
  },
  hideFooter: {
    type: Boolean,
    default: false,
  },
  hideAuthor: {
    type: Boolean,
    default: false,
  },
  /** 与博客列表卡一致时设为 true（默认），作者页等需要展示阅读时间时设为 false */
  hideReadTime: {
    type: Boolean,
    default: true,
  },
})
const localePath = useLocalePath()
const { locale } = useI18n()
const slug = computed(() => {
  if (locale.value === DEFAULT_LANGUAGE) {
    return props.article.slug
  }
  else {
    return props.article.slug.replace(`${locale.value}-`, '')
  }
})

// 有 footer 时模板固定为：外层 div + 内层 NuxtLink（仅图/标题/摘要）+ meta，避免与作者 NuxtLinkLocale 嵌套，
// 也避免按 authors 是否齐全在 SSR/客户端走不同分支导致 hydration 错位。
</script>

<template>
  <!-- hideFooter：无 meta，整块链到文章 -->
  <NuxtLink
    v-if="hideFooter"
    :to="localePath(`/blog/${slug}`)"
    class="rounded-2 w-full cursor-pointer overflow-hidden"
  >
    <div class="h-50 overflow-hidden lg:h-[256px] md:h-[199px] xl:h-[244px]">
      <img :src="article.feature_image" alt="article cover" class="rounded-t-2 h-full w-full object-cover object-center">
    </div>
    <div class="px-4 py-[14px] flex flex-col overflow-hidden">
      <div class="mb-3 mt-1.5">
        <div class="article-title truncate">
          {{ article.title }}
        </div>
        <div v-if="!hideExcerpt" class="article-excerpt">
          {{ article.custom_excerpt || article.excerpt }}
        </div>
      </div>
    </div>
  </NuxtLink>
  <div
    v-else
    class="rounded-2 flex flex-col w-full cursor-pointer overflow-hidden"
  >
    <NuxtLink
      :to="localePath(`/blog/${slug}`)"
      class="text-inherit no-underline w-full block"
    >
      <div class="h-50 overflow-hidden lg:h-[256px] md:h-[199px] xl:h-[244px]">
        <img :src="article.feature_image" alt="article cover" class="rounded-t-2 h-full w-full object-cover object-center">
      </div>
      <div class="px-4 pt-[14px] flex flex-col overflow-hidden">
        <div class="mb-3 mt-1.5">
          <div class="article-title truncate">
            {{ article.title }}
          </div>
          <div v-if="!hideExcerpt" class="article-excerpt">
            {{ article.custom_excerpt || article.excerpt }}
          </div>
        </div>
      </div>
    </NuxtLink>
    <div class="article-info px-4 pb-[14px]">
      <page-blog-article-meta
        :article="article"
        :hide-read-time="hideReadTime"
        :hide-author="hideAuthor"
      />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.article-tag {
  color: var(--border-border-brand, #11a3fd);
  font-size: 14px;
  font-weight: 500;
  padding: 4px 10px;
  border-radius: 4px;
  border: 1px solid #12a3fc;
  background: var(--blue-25, #f5fbff);
}

.article-title {
  color: var(--text-text-primary, #111213);
  font-size: 22px;
  font-weight: 500;
  line-height: 28px;
}

.article-excerpt {
  color: var(--text-text-teriiary, #575d60);
  font-size: 16px;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
  margin-top: 6px;
}

.article-info {
  color: var(--text-text-inactive, #7d8387);
  font-size: 14px;
}
</style>
