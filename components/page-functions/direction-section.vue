<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'
import { useRxWindowSize } from '~/composables/useRxWindowSize'
import SectionTitle from './section-title.vue'

defineProps<{
  title: string
  description: string
  introList: {
    title: string
    cover: string
    showDownloadBtn?: boolean
    descItems: string[]
  }[]
}>()

const { width } = useRxWindowSize()
</script>

<template>
  <div class="direction-section">
    <SectionTitle :title="title" :description="description" />

    <div class="intro-list">
      <div v-for="item in introList" :key="item.title" class="intro-item">
        <div class="intro-item-content">
          <h3 class="intro-item-title multilingual-text">
            {{ item.title }}
          </h3>
          <RxResponsiveImage v-if="width < 960" :name="item.cover" class="max-w-full w-full" alt="" />
          <div class="intro-item-desc-list">
            <div v-for="desc in item.descItems" :key="desc" class="intro-item-desc">
              {{ desc }}
            </div>
            <TryItNow v-if="item.showDownloadBtn && width >= 960" type="primary" class="w-fit" />
          </div>
        </div>
        <RxResponsiveImage v-if="width >= 960" :name="item.cover" class="max-w-full w-full" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.intro-list {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 80px;
  align-self: stretch;

  @media (max-width: 960px) {
    gap: 40px;
  }
}

.intro-item {
  width: 100%;
  display: flex;
  gap: 48px;

  &:nth-child(even) {
    flex-direction: row-reverse;

    .intro-item-content {
      padding: 48px 60px 0 0;
    }
  }

  & > * {
    width: 50%;
  }

  @media (max-width: 960px) {
    flex-direction: column;

    & > * {
      width: 100%;
    }

    .intro-item-content {
      padding: 0 !important;
    }
  }
}

.intro-item-content {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 48px 0 0 60px;

  @media (max-width: 960px) {
    gap: 12px;
  }
}

.intro-item-title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */ /* 120% */

  @media (max-width: 960px) {
    color: var(--colors-text-text-secondary, #34393d);
    font-size: 20px;
    font-style: normal;
    font-weight: 600;
    line-height: 28px; /* 140% */
  }
}

.intro-item-desc-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.intro-item-desc {
  color: var(--colors-text-text-secondary, #34393d);
  white-space: pre-wrap;
  word-break: break-word;
  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */

  @media (max-width: 960px) {
    color: var(--colors-text-text-secondary, #34393d);
    font-family: Inter;
    font-size: 15px;
    font-style: normal;
    font-weight: 400;
    line-height: 150%; /* 22.5px */
  }
}
</style>
