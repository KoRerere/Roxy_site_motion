<script setup lang="ts">
import { UseElementSize } from '@vueuse/components'
import cover1 from '@/assets/images/functions/ip-fingerprint-guard-cover-1.png'
import cover2 from '@/assets/images/functions/ip-fingerprint-guard-cover-2.png'
import cover3 from '@/assets/images/functions/ip-fingerprint-guard-cover-3.png'
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'
import { useRxI18n } from '~/composables/useRxI18n'

const { $t } = useRxI18n()
const features = [
  {
    title: $t('支持各种代理 IP，切换全球地址'),
    description: $t('RoxyBrowser 让你即时获取全球任何 IP 地址，精准定位到你需要的区域。无论是住宅代理 IP、移动代理 IP 还是数据中心代理 IP，都可以自由选择，在几秒钟内切换不同地区。'),
    cover: cover1,
    details: [
      {
        label: $t('任意代理 IP 类型：'),
        description: $t('住宅、移动或数据中心代理 IP。'),
      },
      {
        label: $t('全球覆盖：'),
        description: $t('按需切换 195+ 个国家的 IP 地址。'),
      },
      {
        label: $t('精准匹配：'),
        description: $t('精准锁定特定城市或运营商，确保 IP 地址的真实性。'),
      },
    ],
  },
  {
    title: $t('更换指纹，真正实现“隐身”'),
    description: $t('RoxyBrowser 会为每个会话自动生成唯一的、与代理 IP 地址匹配的浏览器指纹，完美模拟真实用户。告别那些能被轻易识别的“代理模式”或 IP 和指纹不匹配问题。'),
    cover: cover2,
    reverse: true,
    details: [
      {
        label: $t('动态指纹：'),
        description: $t('显卡、字体、操作系统——所有数据都与 IP 地址匹配并随机化。'),
      },
      {
        label: $t('完美同步：'),
        description: $t('消除 IP 和指纹不匹配带来的风险警报。'),
      },
      {
        label: $t('自动或自定义：'),
        description: $t('一键自动生成真实指纹，也支持手动定制。'),
      },
    ],
  },

  {
    title: $t('使用多个窗口，隔离不同任务'),
    description: $t('在 RoxyBrowser 中可以同时运行无限个独立的浏览会话，每个窗口都拥有自己独立的 IP 地址 + 浏览器指纹组合。互不影响，杜绝数据交叉污染。'),
    cover: cover3,
    details: [
      {
        label: $t('身份隔离：'),
        description: $t('每个标签页都拥有独特的 IP 和指纹。'),
      },
      {
        label: $t('零数据泄露：'),
        description: $t('会话之间实行严格的数字隔离。'),
      },
      {
        label: $t('支持批量操作：'),
        description: $t('同时管理 100+ 个账号或任务，毫不费力。'),
      },
    ],
  },

]
</script>

<template>
  <div class="ip-fingerprint-guard">
    <h2 class="title multilingual-text">
      {{ $t('RoxyBrowser：一键同步，IP 和指纹同时换') }}
    </h2>
    <div class="description">
      {{ $t("告别身份割裂，RoxyBrowser 可以确保你的浏览器指纹也随之改变，让平台无法检测到 IP 和指纹不匹配的异常，避免触发封禁。") }}
    </div>
    <UseElementSize v-slot="{ width }">
      <div class="features">
        <div v-for="feature in features" :key="feature.title" class="feature-item" :class="{ reverse: feature.reverse }">
          <div class="feature-item-content">
            <h3 class="feature-item-title multilingual-text">
              {{ feature.title }}
            </h3>
            <img v-if="width < 768" :src="feature.cover" :alt="feature.title" class="feature-item-cover"></img>
            <div class="feature-item-description">
              {{ feature.description }}
            </div>
            <div class="feature-item-details">
              <div v-for="detail in feature.details" :key="detail.label" class="feature-item-detail">
                <rx-icon-svg-icon name="base/rx_ic_check_fill" class="mt-1" />
                <div class="feature-item-detail-content">
                  <div>
                    <span class="feature-item-detail-label">{{ detail.label }}</span>
                    <span class="feature-item-detail-description">{{ detail.description }}</span>
                  </div>
                </div>
              </div>
            </div>
            <TryItNow v-if="width >= 768" type="primary" class="w-fit" />
          </div>
          <img v-if="width >= 768" :src="feature.cover" :alt="feature.title" class="feature-item-cover"></img>
        </div>
      </div>
    </UseElementSize>
  </div>
</template>

<style lang="scss" scoped>
.ip-fingerprint-guard {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: min(100%, 1280px);
  container-type: inline-size;
}

.title {
  max-width: 1056px;
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px);
  /* 120% */
  letter-spacing: -0.8px;

  @media (max-width: 1024px) {
    font-size: 28px;
    line-height: 36px;
  }
}

.description {
  max-width: 1056px;
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

.features {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 48px;

  @media (max-width: 768px) {
    gap: 36px;
  }
}

.feature-item {
  display: flex;
  gap: 60px;
  width: 100%;

  &.reverse {
    flex-direction: row-reverse;
  }
}

.feature-item-content {
  margin-top: 48px;
  display: flex;
  flex-direction: column;
  gap: 20px;
  width: 50%;

  @media (max-width: 1024px) {
    margin-top: 36px;
    gap: 12px;
  }
}

.feature-item-cover {
  width: 50%;
}

@container (max-width: 768px) {
  .feature-item {
    flex-wrap: wrap;
  }

  .feature-item-content,
  .feature-item-cover {
    width: 100%;
  }
}

.feature-item-title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px);
  /* 133.333% */

  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.feature-item-description {
  color: var(--colors-text-text-secondary, #34393d);

  /* body */
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

.feature-item-details {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.feature-item-detail {
  display: flex;
  gap: 12px;
}

.feature-item-detail-content {
  display: flex;
  gap: 4px;

  @media (max-width: 1200px) {
    flex-direction: column;
  }
}

.feature-item-detail-label {
  color: var(--colors-text-text-secondary, #34393d);
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 600;
  line-height: var(--line-body, 28px);
  /* 155.556% */
  white-space: nowrap;

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
    /* 22.5px */
  }
}

.feature-item-detail-description {
  color: var(--colors-text-text-secondary, #34393d);
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px);
  /* 155.556% */

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
    /* 22.5px */
  }
}
</style>
