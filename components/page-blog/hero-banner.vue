<script setup lang="ts">
import type { RxBreadcrumbProps } from '@/components/rx-breadcrumb'
import { RxIcon } from '@/components/rx-icon'

const { article } = defineProps<{
  article: any
  breadcrumbs: RxBreadcrumbProps['items']
}>()
</script>

<template>
  <div class="blog-hero-banner">
    <div class="mx-auto max-w-800px md:pl-20px xl:pl-60px">
      <rx-breadcrumb :items="breadcrumbs" />
      <header class="pb-10 md:pb-15">
        <h1 class="article-title multilingual-text md:text-9">
          {{ article?.title }}
        </h1>
      </header>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.blog-hero-banner {
  padding: 120px 20px 0 20px;
  background-image: url('/blog/bg.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.article-title {
  margin-top: 40px;
  color: var(--text-text-primary, #111213);
  font-size: 36px;
  font-style: normal;
  font-weight: 700;
  line-height: 140%;

  @media (max-width: 768px) {
    font-size: 32px;
    line-height: 120%;
  }
}
</style>
