<script setup lang="ts">
import { useWindowSize } from '@vueuse/core'
import SectionTitle from '../section-title.vue'

const { width } = useWindowSize()

const introList = [
  {
    title: $t('隐藏你的真实身份'),
    cover: 'functions/private-browsing/info-section-img-1',
    descItems: [
      $t('用 RoxyBrowser 轻松创建虚拟身份，自定义浏览器指纹信息，让每个操作都像真实用户一样自然。'),
      $t('你的真实信息永远不会被暴露、被追踪，或与你的线上活动相关联，网站只能看到和记录你的假身份。'),
    ],
  },
  {
    title: $t('浏览记录绝不外泄'),
    cover: 'functions/private-browsing/info-section-img-2',
    descItems: [
      $t('使用 RoxyBrowser 时，你的所有浏览记录都密封在独立的窗口配置里。关闭窗口后，任何痕迹都不会泄露到你的主浏览器或桌面。'),
      $t('没有历史记录共享，没有浏览痕迹残留，实现真正的“无痕浏览”。'),
    ],
  },
  {
    title: $t('每个窗口均为“不同用户”'),
    cover: 'functions/private-browsing/info-section-img-3',
    descItems: [
      $t('你可以打开任意数量的窗口，每个窗口都有独立的 IP 和数字指纹，让你可以在同一台设备上操作多个不同身份的账号。'),
      $t('没有交叉污染，没有身份暴露，安心切换、随心使用。'),
    ],
  },
]
</script>

<template>
  <div class="mask-section">
    <SectionTitle :title="$t('隐身上网，从此不留痕迹')" :description="$t('和普通无痕模式不同，RoxyBrowser 每次打开都会给你一个全新的、无法追踪的身份。')" />

    <div class="intro-list">
      <div v-for="item in introList" :key="item.title" class="intro-item">
        <div class="intro-item-content">
          <h3 class="intro-item-title">
            {{ item.title }}
          </h3>
          <RxResponsiveImage v-if="width < 960" :name="item.cover" class="w-full" alt="" />
          <div class="intro-item-desc-list">
            <div v-for="desc in item.descItems" :key="desc" class="intro-item-desc">
              {{ desc }}
            </div>
          </div>
        </div>
        <RxResponsiveImage v-if="width >= 960" :name="item.cover" class="w-full" alt="" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.intro-list {
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

  /* H4 */
  font-family: Archivo;
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */ /* 120% */

  @media (max-width: 960px) {
    color: var(--colors-text-text-secondary, #34393d);
    font-family: Archivo;
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
