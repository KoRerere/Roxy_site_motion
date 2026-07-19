<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { CONTACT_US_MODULE_HEIGHT } from '@/constants/contact-us'

const { isZh } = useRxI18n()

const moduleHeight = CONTACT_US_MODULE_HEIGHT.about
</script>

<template>
  <!-- first：距 Banner 100px；宽度与其它模块共用 section-wrap 1062px -->
  <PageContactUsSectionWrap first>
    <div
      class="contact-us-about"
      :style="{
        '--contact-us-about-h-mobile': `${moduleHeight.mobile}px`,
      }"
    >
      <!-- PC：左右 flex；左栏 flex + space-between（标题上、logo 下） -->
      <div class="contact-us-about__layout">
        <div class="contact-us-about__aside">
          <h2 class="contact-us-about__title">
            {{ $t('contactUs.about标题') }}
          </h2>
          <RxIcon
            name="contact-us/icon-about"
            size="72"
            class="contact-us-about__logo"
          />
        </div>

        <div
          class="contact-us-about__body"
          :class="{ 'font-[Inter]': !isZh }"
        >
          <p>{{ $t('contactUs.about段落1') }}</p>
          <p>{{ $t('contactUs.about段落2') }}</p>
        </div>
      </div>

      <!-- 移动端底部分隔线 -->
      <div class="contact-us-about__divider" />
    </div>
  </PageContactUsSectionWrap>
</template>

<style scoped lang="scss">

/* 左右两栏 */
.contact-us-about__layout {
  display: flex;
  flex-direction: column;
}

/* 左栏：标题 + logo，PC 上 space-between */
.contact-us-about__aside {
  display: flex;
  flex-shrink: 0;
  flex-direction: column;
  gap: 16px;
}

.contact-us-about__title {
  color: var(--text-text-primary, #1d1e20);
  font-family: Archivo, sans-serif;
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px);
}

.contact-us-about__logo {
  width: 72px;
  height: 72px;
  flex-shrink: 0;
}

/* 右栏：两段正文，间距 20px */
.contact-us-about__body {
  display: flex;
  flex: 1;
  flex-direction: column;
  gap: 20px;
  overflow: hidden;
  color: #34393d;
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
}

.contact-us-about__divider {
  margin-top: 24px;
  width: 100%;
  height: 1px;
  background: #11a3fd;
}

@media (max-width: 639.98px) {
  .contact-us-about {
    min-height: auto;
  }

  .contact-us-about__aside {
    gap: 0;
  }

  .contact-us-about__title {
    color: var(--text-text-primary, #1d1e20);
    font-family: Archivo, sans-serif;
    font-size: var(--Heading-H6, 24px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--line-H6, 36px);
    margin-bottom: 24px;
  }

  .contact-us-about__logo {
    width: 48px;
    height: 48px;
    margin: 24px 0 0;
  }

  .contact-us-about__body {
    margin-top: 24px;
    gap: 20px;
    color: var(--text-text-primary, #1d1e20);
    font-family: Inter, sans-serif;
    font-size: var(--body, 18px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-body, 28px);
  }

  .contact-us-about__divider {
    display: none;
  }
}

@media (min-width: 768px) {


  .contact-us-about__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
    gap: clamp(32px, 8vw, 102px);
  }

  .contact-us-about__aside {
    justify-content: space-between;
  }

  .contact-us-about__body {
    /* Figma body：18px / 28px，主色 #1D1E20；仅 PC，移动端样式后续单独调整 */
    align-self: stretch;
    color: var(--text-text-primary, #1d1e20);
    font-size: var(--body, 18px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-body, 28px);
  }

  .contact-us-about__divider {
    display: none;
  }
}

@media (min-width: 1280px) {
  .contact-us-about__layout {
    /* 1062 内容区：左 480 + 右 480，中间间距 102px */
    grid-template-columns: 480px 480px;
    gap: 102px;
  }

  .contact-us-about__aside {
    flex-shrink: 0;
    min-height: var(--contact-us-about-h-pc);
  }

  .contact-us-about__body {
    flex: none;
    flex-shrink: 0;
  }
}
</style>
