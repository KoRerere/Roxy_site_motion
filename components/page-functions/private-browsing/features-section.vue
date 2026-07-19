<script setup lang="ts">
import { RxIconSvgIcon } from '#components'
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'
import { useRxWindowSize } from '~/composables/useRxWindowSize'
import SectionTitle from '../section-title.vue'
import ParticlesEffect from './components/Slim.vue'
import TyndallEffect from './components/TyndallEffect.vue'

const { width } = useRxWindowSize()
</script>

<template>
  <div class="features-section">
    <div class="px-29 flex flex-col gap-4 max-2xl:px-0">
      <div class="tag-title">
        {{ $t('一款浏览器，满足所有需求') }}
      </div>

      <SectionTitle
        class="mt-5"
        :title="$t('全方位保障工作和个人浏览的隐私安全')"
        :description="$t('RoxyBrowser 助你工作更高效专注，生活自由私密。')"
      />
    </div>

    <div class="features-list">
      <div class="features-item browse">
        <div class="features-item-content">
          <h3 class="features-item-title">
            {{ $t('访问敏感网站') }}
          </h3>
          <div class="features-item-description">
            {{ $t('安心浏览，不暴露真实身份和痕迹。') }}
          </div>
          <TryItNow v-if="width >= 960" type="primary" />
        </div>
        <div class="features-item-cover">
          <RxResponsiveImage name="functions/private-browsing/feature-card-img-1" class="w-full" alt="" />
        </div>
      </div>
      <div class="features-item block">
        <TyndallEffect>
          <div class="features-item-content">
            <RxIconSvgIcon name="functions/rx_ic_shield_2" :size="width >= 960 ? 36 : 28" />
            <h3 class="features-item-title">
              {{ $t('屏蔽广告追踪') }}
            </h3>
            <div class="features-item-description">
              {{ $t('阻止广告商收集行为数据，不再受到精准推送的骚扰。') }}
            </div>
          </div>
          <template #particles>
            <ParticlesEffect
              :density="256"
              :size="1.5"
              class="h-full w-full [mask-image:radial-gradient(50%_50%,white,transparent_85%)] inset-x-0 bottom-0 absolute z-10"
            />
          </template>
        </TyndallEffect>
      </div>
      <div class="features-item shop">
        <div class="features-item-content">
          <RxIconSvgIcon name="functions/rx-ic-wallet" :size="width >= 960 ? 36 : 28" />
          <h3 class="features-item-title">
            {{ $t('避开网购“差价套路”') }}
          </h3>
          <div class="features-item-description">
            {{ $t('不再让电商平台根据你的比价行为临时涨价，确保你看到的价格都真实可靠。') }}
          </div>
        </div>
      </div>
      <div class="features-item identities">
        <div class="features-item-content">
          <h3 class="features-item-title multilingual-text">
            {{ $t('全平台多账号管理') }}
          </h3>
          <div class="features-item-description">
            {{ $t('无论是社交媒体、电商还是游戏，你都可以为每个账号创建独立环境，无需担心被平台识别或关联。') }}
          </div>
        </div>
        <div class="features-item-cover">
          <RxResponsiveImage name="functions/private-browsing/feature-card-img-2" class="w-full" alt="" />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
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

.features-list {
  width: 100%;
  display: grid;
  gap: 16px;
  grid-template-areas:
    'browse block identities'
    'browse shop identities';
  grid-template-columns: repeat(3, 1fr);

  @media (max-width: 960px) {
    grid-template-areas: 'block shop' 'browse identities' 'browse identities';
    grid-template-columns: 1fr 1fr;
  }

  @media (max-width: 768px) {
    grid-template-areas: 'browse' 'block' 'shop' 'identities';
    grid-template-columns: 1fr;
  }
}

.features-item {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  border-radius: 16px;
  background: #f3f4f6;
  gap: 24px;
  overflow: hidden;
}

/* 区域映射 */
.browse {
  grid-area: browse;
}
.block {
  grid-area: block;
  background: radial-gradient(203.9% 110.35% at 75.91% 0%, #4080d5 10.95%, #050523 100%);

  .features-item-content,
  .features-item-title,
  .features-item-description {
    color: #fff;
  }

  .features-item-content {
    padding: 28px 32px 28px 32px;
  }
}
.shop {
  grid-area: shop;
  .features-item-content {
    padding: 28px 32px 28px 32px;
  }
}
.identities {
  grid-area: identities;
  background: linear-gradient(180deg, #e6f5ff 0%, #b5e0fe 100%);
}

.features-item-content {
  display: flex;
  flex-direction: column;
  gap: 16px;
  align-items: flex-start;
  align-self: stretch;
  padding: 28px 32px 0 32px;
  z-index: 10;

  @media (max-width: 960px) {
    gap: 12px;

    .features-item-description {
      margin-top: -4px;
    }
  }
}

.features-item-title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H5, 26px);
  font-style: normal;
  font-weight: 600;
  line-height: var(--line-H5, 36px); /* 138.462% */

  @media (max-width: 960px) {
    font-size: 20px;
    line-height: 28px;
  }
}

.features-item-description {
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */

  @media (max-width: 960px) {
    font-size: 15px;
    line-height: 150%;
  }
}

.features-item-cover {
  padding-left: 20px;
  transition: scale 0.3s ease-in-out;

  &:hover {
    scale: 1.03;
  }
}
</style>
