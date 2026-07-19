<script setup lang="ts">
import { useRxWindowSize } from '~/composables/useRxWindowSize'

const { width } = useRxWindowSize()
interface Feature {
  icon: string
  title: string
}

const features: Feature[] = [
  {
    icon: 'functions/manage-multiple-accounts/info-card-img-1',
    title: $t('同一设备频繁切换账号，被识别为账号关联，导致全部禁用。'),
  },
  {
    icon: 'functions/manage-multiple-accounts/info-card-img-2',
    title: $t('用相同 IP 注册多个账号，触发平台风控系统，导致 IP 被标记。'),
  },
  {
    icon: 'functions/manage-multiple-accounts/info-card-img-3',
    title: $t('设备指纹被识别，即便使用了代理 IP，账号仍然被批量封禁。'),
  },
  {
    icon: 'functions/manage-multiple-accounts/info-card-img-4',
    title: $t('多人使用同一账号，登录信息反复变动，平台识别出异常。'),
  },
]
</script>

<template>
  <section class="showcase-section">
    <div class="flex-bc w-full">
      <div class="flex flex-col gap-2 w-full max-[960px]:text-center">
        <h2 class="title multilingual-text">
          {{ $t('为什么你的账号反复被封禁？') }}
        </h2>
        <div class="description">
          {{ $t('各大平台变得越来越智能，它们能够更精准地检测到多账号操作。一旦某个账号被识别出异常，所有存在关联的账号都可能瞬间被禁用。') }}
        </div>
      </div>
      <div v-if="width >= 960" class="px-16 pb-6">
        <RxResponsiveImage name="functions/manage-multiple-accounts/showcase-img1" class="max-w-[393px]" :alt="$t('为什么你的账号反复被封禁？')" />
      </div>
    </div>
    <div class="gap-5 grid grid-cols-1 w-full lg:grid-cols-2">
      <div v-for="feature in features" :key="feature.title" class="features-item">
        <div class="features-item-title multilingual-text">
          {{ feature.title }}
        </div>
        <RxResponsiveImage :name="feature.icon" class="features-item-img" />
      </div>
    </div>
  </section>
</template>

<style lang="scss" scoped>
.showcase-section {
  display: flex;
  flex-direction: column;
  gap: 48px;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */

  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.description {
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
  letter-spacing: -0.054px;

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
  }
}

.features-item {
  display: flex;
  padding: 24px 28px;
  justify-content: space-between;
  align-items: center;
  flex: 1 0 0;
  align-self: stretch;
  border-radius: 12px;
  border: 1.5px solid var(--colors-border-border-inactive, #e2e9ee);
  background: var(--colors-background-bg-block, #f1f5f8);
  transition: box-shadow 0.15s ease-in-out;

  @media (max-width: 960px) {
    padding: 12px 8px 12px 16px;
  }

  &:hover {
    box-shadow: 0 4px 12px 0 rgba(152, 156, 160, 0.2);

    .features-item-img {
      scale: 1.03;
    }
  }

  :deep(.features-item-img) {
    transition: scale 0.3s ease-in-out;
    height: 154px;
    object-fit: contain;

    img {
      max-width: unset;
      height: 154px;
    }

    @media (max-width: 960px) {
      height: 80px;

      img {
        height: 80px;
      }
    }
  }

  .features-item-title {
    max-width: 400px;
    color: var(--colors-text-text-primary, #111213);
    font-size: var(--Heading-H6, 24px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--line-H6, 36px); /* 150% */

    @media (max-width: 960px) {
      color: var(--colors-text-text-secondary, #34393d);
      font-size: 18px;
      font-style: normal;
      line-height: 26px; /* 144.444% */
    }
  }
}
</style>
