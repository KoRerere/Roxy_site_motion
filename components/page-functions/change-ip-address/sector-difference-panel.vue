<script setup lang="ts">
const { $t } = useRxI18n()
const baseImgUrl = 'functions/sector-difference-panel'

const differenceList = [
  {
    key: 'affiliate',
    title: $t('联盟营销'),
    link: '/use-cases/affiliate-marketing',
    description: $t('运营多个账号，使用独特的、与地理位置匹配的浏览器指纹。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/1/${i + 1}`),
  },
  {
    key: 'ecommerce',
    title: $t('电商运营'),
    link: '/use-cases/ecommerce-marketing',
    description: $t('隔离每个店铺，为它们提供防篡改环境和本地 IP 地址。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/2/${i + 1}`),
  },
  {
    key: 'social',
    title: $t('社媒营销'),
    link: '/use-cases/social-media-marketing',
    description: $t('每天从 50 多个不同地点发帖，不必担心被反垃圾邮件系统或地域限制封锁。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/3/${i + 1}`),
  },
  {
    key: 'seo',
    title1: $t('SEO 优化'),
    title2: $t('广告投流'),
    link1: '/use-cases/seo-content-marketing',
    link2: '/use-cases/paid-search-advertising',
    description: $t('使用 100+ 个住宅 IP 测试广告，抓取竞争对手数据。零封锁，纯数据。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/4/${i + 1}`),
  },
  {
    key: 'scraping',
    title: $t('网络爬虫'),
    link: '/use-cases/web-scraping',
    description: $t('利用真实用户指纹和自动轮换代理 IP，轻松绕过反机器人墙。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/5/${i + 1}`),
  },
  {
    key: 'crypto',
    title: $t('加密货币交易'),
    link: '/use-cases/cryptocurrency-trading',
    description: $t('在 20 多个交易所运行套利机器人，每个机器人都有其所在国家的独立身份。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/6/${i + 1}`),
  },
]
</script>

<template>
  <div class="sector-difference-panel">
    <h2 class="title multilingual-text">
      {{ $t('RoxyBrowser 保障各业务操作的高效和安全') }}
    </h2>
    <div class="difference-list">
      <div v-for="item in differenceList" :key="item.title" class="difference-item transition-all duration-200">
        <div class="content">
          <h3>
            <div v-if="item.key === 'seo'" class="flex gap-2">
              <NuxtLinkLocale :to="item.link1" class="difference-item-title">
                {{ item.title1 }}
              </NuxtLinkLocale>
              <div class="difference-item-title mark !no-underline">
                &
              </div>
              <NuxtLinkLocale :to="item.link2" class="difference-item-title">
                {{ item.title2 }}
              </NuxtLinkLocale>
            </div>
            <NuxtLinkLocale v-else :to="item.link" class="difference-item-title">
              {{ item.title }}
            </NuxtLinkLocale>
          </h3>
          <div class="difference-item-description">
            {{ item.description }}
          </div>
        </div>
        <div class="platform-list">
          <template v-for="platform in item.platforms" :key="platform">
            <rx-icon-svg-icon :name="platform" :size="40" />
          </template>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px);

  /* 120% */
  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.difference-list {
  width: 100%;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 24px;
}

.difference-item {
  display: flex;
  height: 280px;
  padding: 28px 32px;
  flex-direction: column;
  justify-content: space-between;
  align-items: flex-start;
  flex: 1 0 0;
  border-radius: 12px;
  border: 1.5px solid var(--colors-border-border-inactive, #e2e9ee);
  background: var(--colors-background-bg-block, #f1f5f8);

  @media (max-width: 768px) {
    height: 220px;
    padding: 20px;
  }

  &:hover {
    border-radius: 12px;
    border: 1.5px solid #12a3fc;
    background: linear-gradient(0deg, rgba(18, 163, 252, 0.12) 0%, rgba(18, 163, 252, 0.12) 100%);
    box-shadow: 0 4px 12px 0 rgba(26, 147, 235, 0.4);

    .difference-item-title {
      text-decoration: underline;
      text-underline-offset: 5px;

      &:not(.mark):hover {
        color: #12a3fc;
      }
    }
  }

  .content {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
    align-self: stretch;
  }

  &-title {
    color: var(--colors-text-text-primary, #111213);
    font-size: var(--Heading-H5, 26px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--line-H5, 36px);

    @media (max-width: 768px) {
      font-size: 20px;
      line-height: 28px;
    }
  }

  &-description {
    color: var(--colors-text-text-tertiary, #575d60);

    /* body */
    font-family: Inter;
    font-size: var(--body, 18px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-body, 28px);

    @media (max-width: 768px) {
      font-size: 15px;
      line-height: 150%;
    }
  }
}

.platform-list {
  display: flex;
  padding: 6px;
  align-items: flex-start;
  gap: 12px;
}
</style>
