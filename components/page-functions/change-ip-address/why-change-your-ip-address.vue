<script setup lang="ts">
import { useRxI18n } from '~/composables/useRxI18n'
import { useRxWindowSize } from '~/composables/useRxWindowSize'

const { $t } = useRxI18n()
const { width } = useRxWindowSize()

const reasons = [
  {
    title: $t('突破地区限制'),
    description: $t('访问因地域限制而无法观看的节目、网站或服务，畅享全球内容。'),
    icon: 'functions/rx_ic_address',
  },
  {
    title: $t('保护在线隐私'),
    description: $t('通过匿名化技术隐藏真实身份和网络行为，防止个人信息被追踪和泄露。'),
    icon: 'functions/rx_ic_shield',
  },

  {
    title: $t('绕过 IP 封锁'),
    description: $t('通过更换虚拟 IP 地址突破访问限制或黑名单，实现无障碍网络访问。'),
    icon: 'functions/rx_ic_bypass',
  },
  {
    title: $t('运营多个账号'),
    description: $t('管理多个账号，避免因 IP 地址关联而触发平台封禁。'),
    icon: 'functions/rx_ic_people',
  },
  {
    title: $t('安全抓取数据'),
    description: $t('自动更换 IP 地址，安全高效地收集数据，避免被屏蔽或标记。'),
    icon: 'functions/rx_ic_random',
  },
  {
    title: $t('模拟真实用户'),
    description: $t('让你的操作看起来更像真人，避免被反爬虫系统识别为机器人。'),
    icon: 'functions/rx_ic_user',
  },
]
</script>

<template>
  <div class="why-change-your-ip-address">
    <h2 class="title multilingual-text">
      {{ $t('为什么要更换 IP 地址？') }}
    </h2>
    <div class="description">
      {{ $t("你可能正在考虑这些原因：为了访问受限内容、保护隐私，或是保障账号安全。这些在很大程度上都受到你的 IP 地址影响。") }}
    </div>
    <div class="reasons">
      <div v-for="reason in reasons" :key="reason.title" class="reason transition-all duration-200">
        <div class="reason-header">
          <rx-icon-svg-icon :name="reason.icon" :size="width < 768 ? 24 : 36" />
          <h3 class="reason-title multilingual-text">
            {{ reason.title }}
          </h3>
        </div>
        <div class="reason-content">
          <div class="reason-description">
            {{ reason.description }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.why-change-your-ip-address {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 1280px);
  margin-top: 60px;
}

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

.description {
  margin-top: 8px;
  color: var(--colors-text-text-tertiary, #575d60);
  text-align: center;
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px);
  /* 155.556% */

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
  }
}

.reasons {
  width: 100%;
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 1024px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 768px) {
    margin-top: 24px;
    grid-template-columns: repeat(1, 1fr);
  }
}

.reason {
  display: flex;
  height: 220px;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1 0 0;
  border-left: 2px solid transparent;
  /* 只留左边边框 */
  border-image: linear-gradient(180deg, rgba(226, 233, 238, 0) 0%, #e2e9ee 50%, rgba(226, 233, 238, 0) 100%) 30 fill
    stretch;
  /* 应用 border-image */
  border-image-slice: 6;
  /* 切割图片 */

  &:nth-child(3n) {
    border-right: 2px solid transparent;
  }

  &:hover {
    background:
      linear-gradient(142deg, rgba(18, 163, 252, 0.2) 0%, rgba(18, 163, 252, 0) 44.02%),
      var(--colors-background-bg-block, #f1f5f8);
  }

  @media (max-width: 1024px) {
    &:nth-child(2n) {
      border-right: 2px solid transparent;
    }
  }

  @media (max-width: 768px) {
    height: 120px;
    padding: 20px;
    border-right: 2px solid transparent;
  }
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reason-title {
  color: var(--colors-text-text-secondary, #34393d);
  font-size: var(--Heading-H6, 24px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-H6, 36px);
  /* 150% */

  @media (max-width: 768px) {
    font-size: 20px;
    line-height: 28px;
  }
}

html[lang='ru-RU'] {
  .reason-title {
    font-size: 20px;
    line-height: 20px;
    font-weight: 600;
  }
}

.reason-description {
  color: var(--colors-text-text-secondary, #34393d);

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px);
  /* 155.556% */

  @media (max-width: 768px) {
    font-size: 15px;
    line-height: 150%;
  }
}
</style>
