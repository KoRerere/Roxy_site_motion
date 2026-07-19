<script setup lang="ts">
import Marquee from '~/components/page-home/components/Marquee.vue'
import { useRxWindowSize } from '~/composables/useRxWindowSize'
import { $t } from '~/utils/$t'
import SectionTitle from '../section-title.vue'

const { width } = useRxWindowSize()

const features = [
  {
    title: $t('社交媒体运营'),
    description: $t('在 Facebook、Instagram 等社交平台上，同时管理多个账号，高效发布内容、互动粉丝，并保持账号独立，避免交叉关联或被封号风险。'),
    icon: 'functions/multiple-accounts/img1',
    link: '/use-cases/social-media-marketing',
  },
  {
    title: $t('付费广告投流'),
    description: $t('在 Google Ads、Facebook Ads 等广告平台上，为不同广告活动或客户同时管理多个广告账号，实现精准投放，同时保障账号安全和数据独立。'),
    icon: 'functions/multiple-accounts/img2',
    link: '/use-cases/paid-search-advertising',
  },
  {
    title: $t('电商运营'),
    description: $t('在 Amazon、eBay、Etsy 等电商平台上高效运营多个店铺，管理商品、订单和库存，同时保持各店铺数据独立，降低运营风险。'),
    icon: 'functions/multiple-accounts/img3',
    link: '/use-cases/ecommerce-marketing',
  },
  {
    title: $t('联盟营销'),
    description: $t('同时处理多个联盟账号和推广活动，有效分散风险，独立跟踪数据和收益，让每个账号都能安全运营，提升整体营销效率。'),
    icon: 'functions/multiple-accounts/img4',
    link: '/use-cases/affiliate-marketing',
  },
]

const bgIcons = computed(() => {
  const allIcons = Array.from({ length: 24 }, (_, i) => `functions/manage-multiple-accounts/${`${i + 1}`.padStart(2, '0')}`)
  const reversedIcons = [...allIcons].reverse()

  return [
    allIcons,
    reversedIcons,
    reversedIcons.slice(12).concat(reversedIcons.slice(0, 12)),
    allIcons.slice(12).concat(allIcons.slice(0, 12)),
  ]
})
</script>

<template>
  <div class="trusted-section">
    <div class="px-29 flex flex-col gap-4 max-2xl:px-0">
      <div class="tag-title">
        {{ $t('一款浏览器，满足所有需求') }}
      </div>

      <SectionTitle
        class="mt-5"
        :title="$t('专为多类平台打造，深受各行各业信赖。')"
        :description="$t('覆盖各大平台，包含各业务需求，RoxyBrowser 让多账号运营更安全、更高效。')"
      />
    </div>

    <div class="features-list-container">
      <div v-if="width >= 960" class="features-list-container-bg">
        <Marquee v-for="(icons, index) of bgIcons" :key="index" :reverse="index % 2 === 0" class="flex gap-8 [--duration:200s]">
          <template v-for="icon of icons" :key="icon">
            <RxResponsiveImage :name="icon" class="features-item-icon size-30" />
          </template>
        </Marquee>
      </div>
      <div class="features-list">
        <div
          v-for="(feature, index) in features"
          :key="feature.title"
          class="features-item"
          @click="navigateTo($localePath(feature.link))"
        >
          <div class="features-item-content">
            <NuxtLinkLocale :to="feature.link">
              <h3 class="features-item-title multilingual-text">
                {{ feature.title }}
              </h3>
            </NuxtLinkLocale>
            <div class="features-item-description">
              {{ feature.description }}
            </div>
          </div>
          <rx-icon-svg-icon :name="feature.icon" :size="width >= 960 ? 140 : 80" color="#C7D1D6" class="features-item-icon opacity-50" />
        </div>
      </div>
    </div>

    <div v-if="width < 960" class="platform-list">
      <template v-for="n of bgIcons[0]" :key="n">
        <RxResponsiveImage :name="n" class="platform-item-icon size-15" />
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.trusted-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 960px) {
    padding: 0 20px;
    gap: 24px;
  }
}

.tag-title {
  display: flex;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  border-radius: 50px;
  border: 1px solid #11a3fd;
  color: var(--colors-text-text-brand, #11a3fd);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px; /* 150% */
  width: fit-content;
  margin: 0 auto;

  @media (max-width: 960px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.features-list-container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 600px;
  padding: 90px 0;
  overflow: hidden;

  @media (max-width: 960px) {
    height: auto;
    padding: 0;
  }

  .features-list-container-bg {
    display: flex;
    flex-direction: column;
    gap: 32px;
    position: absolute;
    top: 0;
    left: 50%;
    height: 100%;
    z-index: 0;
    overflow: hidden;
    opacity: 0.12;
    transform: translateX(-50%);

    &::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: radial-gradient(50% 50% at 50% 50%, #f1f5f8 71.38%, rgba(241, 245, 248, 0) 100%);
    }
  }
}

.features-list {
  max-width: 1280px;
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 20px;
  z-index: 3;

  @media (max-width: 960px) {
    grid-template-columns: repeat(1, 1fr);
  }
}

.features-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 28px 32px;
  border-radius: 12px;
  border: 1.5px solid var(--colors-border-border-inactive, #e2e9ee);
  background: #fff;
  position: relative;
  transition: all 0.15s ease;
  cursor: pointer;

  @media (max-width: 960px) {
    padding: 20px 24px;

    .features-item-icon {
      position: absolute;
      right: 24px;
      top: 24px;
      opacity: 0.15;
    }
  }

  &:hover {
    border: 1.5px solid var(--colors-border-border-brand, #11a3fd);
    background: linear-gradient(180deg, #c4e7fd 0%, #ecf7fe 100%), #fff;

    .features-item-icon {
      color: var(--colors-text-text-link, #11a3fd);
    }

    .features-item-title {
      text-decoration-line: underline;
      text-decoration-style: solid;
      text-decoration-skip-ink: none;
      text-decoration-thickness: 6%;
      text-underline-offset: 25%;
      text-underline-position: from-font;
      color: var(--colors-text-text-link, #11a3fd);
    }
  }
}

.features-item-content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  z-index: 10;
  align-self: flex-start;
}

.features-item-title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H5, 26px);
  font-style: normal;
  font-weight: 600;
  line-height: var(--line-H5, 36px); /* 138.462% */
  @media (max-width: 960px) {
    font-size: 20px;
    line-height: 28px; /* 140% */
  }
}

.features-item-description {
  color: var(--colors-text-text-tertiary, #575d60);

  /* sub-title */
  font-family: Inter;
  font-size: var(--sub-title, 16px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-sub-title, 24px); /* 150% */

  @media (max-width: 960px) {
    font-size: 15px;
    line-height: 150%; /* 22.5px */
  }
}

.platform-list {
  justify-items: center;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 12px;
  position: relative;

  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    right: 0;
    height: 100px;
    background: linear-gradient(180deg, rgba(248, 250, 251, 0) 0%, #f8fafb 100%);
  }
}
</style>
