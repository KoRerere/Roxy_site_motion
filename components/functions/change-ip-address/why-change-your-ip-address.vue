<script setup lang="ts">
import { RxIcon } from '~/components/rx-icon'

const reasons = [
  {
    title: $t('突破地区限制'),
    description: $t('访问你所在地区被屏蔽的节目、网站或服务。'),
    icon: 'functions/rx_ic_address',
  },
  {
    title: $t('保持在线隐私'),
    description: $t('隐藏你的真实身份，避免被追踪，保持匿名。'),
    icon: 'functions/rx_ic_shield',
  },

  {
    title: $t('绕过 IP 封锁'),
    description: $t('切换 IP 以绕过防火墙、访问频率限制或黑名单。'),
    icon: 'functions/rx_ic_bypass',
  },
  {
    title: $t('运营多个账号'),
    description: $t('管理多个账号，避免因 IP 地址关联而触发平台封禁。'),
    icon: 'functions/rx_ic_people',
  },
  {
    title: $t('安全抓取数据'),
    description: $t('自动更换 IP 地址，安全高效地收集数据，避免被屏蔽或标记。 '),
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
    <div class="title">
      {{ $t('为什么要更换 IP 地址？') }}
    </div>
    <div class="description">
      {{ $t("你可能正在考虑这些原因：为了访问受限内容、保护隐私，或是保障账号安全。这些绝大程度地受到你的IP地址影响。") }}
    </div>
    <div class="reasons">
      <div v-for="reason in reasons" :key="reason.title" class="reason">
        <div class="reason-header">
          <RxIcon :name="reason.icon" size="36" />
          <div class="reason-title">
            {{ reason.title }}
          </div>
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
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;

  /* H3 */
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */
}

.description {
  margin-top: 8px;
  color: var(--colors-text-text-tertiary, #575d60);
  text-align: center;
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
}

.reasons {
  width: 100%;
  margin-top: 48px;
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(348px, 1fr));
}

.reason {
  display: flex;
  height: 220px;
  padding: 40px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  flex: 1 0 0;
  border-left: 2px solid transparent; /* 只留左边边框 */
  border-image: linear-gradient(180deg, rgba(226, 233, 238, 0) 0%, #e2e9ee 50%, rgba(226, 233, 238, 0) 100%) 30 fill
    stretch; /* 应用 border-image */
  border-image-slice: 6; /* 切割图片 */

  &:hover {
    background:
      linear-gradient(142deg, rgba(18, 163, 252, 0.2) 0%, rgba(18, 163, 252, 0) 44.02%),
      var(--colors-background-bg-block, #f1f5f8);
  }
}

.reason-header {
  display: flex;
  align-items: center;
  gap: 12px;
}

.reason-title {
  color: var(--colors-text-text-secondary, #34393d);
  font-family: Archivo;
  font-size: var(--Heading-H6, 24px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-H6, 36px); /* 150% */
}

.reason-description {
  color: var(--colors-text-text-secondary, #34393d);

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
}
</style>
