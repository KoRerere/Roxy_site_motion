<script setup lang="ts">
const baseImgUrl = 'functions/sector-difference-panel'

const differenceList = [
  {
    title: $t('联盟营销'),
    description: $t('运营多个账号，使用独特的、与地理位置匹配的浏览器指纹。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/1/${i + 1}`),
  },
  {
    title: $t('电商运营'),
    description: $t('隔离每个店铺，为它们提供防篡改环境和本地 IP 地址。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/2/${i + 1}`),
  },
  {
    title: $t('社媒营销'),
    description: $t('每天从 50 多个不同地点发帖，不必担心被垃圾邮件过滤器或地域限制封锁。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/3/${i + 1}`),
  },
  {
    title: $t('SEO优化 & 付费广告投流'),
    description: $t('使用 100+ 个住宅 IP 测试广告，抓取竞争对手数据。零封锁，纯数据。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/4/${i + 1}`),
  },
  {
    title: $t('网络爬虫'),
    description: $t('利用类人指纹和自动轮换代理，轻松绕过反机器人墙。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/5/${i + 1}`),
  },
  {
    title: $t('加密货币交易'),
    description: $t('在 20 多个交易所运行套利机器人，每个机器人都有其所在国家的独立身份。'),
    platforms: Array.from({ length: 10 }, (_, i) => `${baseImgUrl}/6/${i + 1}`),
  },
]
</script>

<template>
  <div class="sector-difference-panel">
    <div class="title">
      {{ $t('RoxyBrowser 保障各业务操作的高效和安全') }}
    </div>
    <div class="difference-list">
      <div v-for="item in differenceList" :key="item.title" class="difference-item">
        <div class="content">
          <div class="difference-item-title">
            {{ item.title }}
          </div>
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

  /* H3 */
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */
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
    background: linear-gradient(0deg, rgba(18, 163, 252, 0.12) 0%, rgba(18, 163, 252, 0.12) 100%), #fff;
    box-shadow: 0 4px 12px 0 rgba(26, 147, 235, 0.4);
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
    font-family: Archivo;
    font-size: var(--Heading-H5, 26px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--line-H5, 36px); /* 138.462% */

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
    line-height: var(--line-body, 28px); /* 155.556% */

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
