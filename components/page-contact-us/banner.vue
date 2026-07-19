<script setup lang="ts">
import { useWidgetIsReady } from '@livechat/widget-vue'
import bannerBg from '@/assets/svgs/contact-us/banner-bg.svg?url'
import iconBannerHeadphone from '@/assets/svgs/contact-us/ic-banner-headphone.svg?url'

const { isZh } = useRxI18n()
const isWidgetReady = useWidgetIsReady()

/** 打开 LiveChat 在线客服（逻辑与 components/live-chat.vue 一致） */
function onContactSupportClick() {
  if (!isWidgetReady.value)
    return
  if (typeof window !== 'undefined' && (window as any).LiveChatWidget) {
    (window as any).LiveChatWidget.call('maximize')
  }
}
</script>

<template>
  <section class="contact-us-banner">
    <!-- 通栏背景：banner-bg.svg，PC 宽 100% 高 420px -->
    <img
      :src="bannerBg"
      class="contact-us-banner__bg"
      alt=""
      aria-hidden="true"
    >

    <div class="contact-us-banner__inner">
      <div class="contact-us-banner__panel-wrap">
        <!-- 跨顶边：一半在卡片外、一半在卡片内（Figma 73×73） -->
        <img
          :src="iconBannerHeadphone"
          class="contact-us-banner__icon"
          alt=""
          aria-hidden="true"
        >

        <div class="contact-us-banner__panel">
          <!-- 水波纹 canvas 背景（ClientOnly 避免 SSR 无 canvas） -->
          <ClientOnly>
            <PageContactUsBannerRippleCanvas />
          </ClientOnly>

          <div class="contact-us-banner__content">
            <h1
              class="contact-us-banner__title"
              :class="{ 'multilingual-text': !isZh }"
            >
              {{ $t('contactUs.banner标题') }}
            </h1>

            <p
              class="contact-us-banner__desc"
              :class="{ 'font-[Inter]': !isZh }"
            >
              {{ $t('contactUs.banner描述') }}
            </p>

            <button
              type="button"
              class="contact-us-banner__btn"
              :class="{ 'font-[Inter]': !isZh }"
              @click="onContactSupportClick"
            >
              {{ $t('contactUs.banner按钮') }}
            </button>

         <!--    <p class="contact-us-banner__tagline">
              {{ $t('contactUs.banner标语') }}
            </p> -->
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped lang="scss">
/* ========== 移动端（<768px）========== */
.contact-us-banner {
  position: relative;
  padding: 0 16px;
  background: #fff;
}

.contact-us-banner__bg {
  display: none;
}

.contact-us-banner__inner {
  width: 100%;
}

/* 外层包裹：允许图标超出卡片顶边显示 */
.contact-us-banner__panel-wrap {
  position: relative;
  /* 为跨顶边图标上半部分预留空间 */
  margin-top: 37px;
  width: 100%;
}

.contact-us-banner__icon {
  position: absolute;
  top: 0;
  left: 50%;
  z-index: 3;
  width: 73px;
  height: 73px;
  transform: translate(-50%, -50%);
  pointer-events: none;
}

.contact-us-banner__panel {
  position: relative;
  z-index: 1;
  width: 100%;
  height: 498px;
  border-radius: 16px;
  overflow: hidden;
  isolation: isolate;
  /* canvas 未就绪时的底色 */
  background-color: #fff;
}

.contact-us-banner__content {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-start;
  box-sizing: border-box;
  height: 100%;
  /* 跨顶边图标在卡片内占 36.5px（73 / 2） */
  padding-top: 37px;
}

.contact-us-banner__title {
  margin-bottom:8px;
  color: #1d1e20;
  font-size: 28px;
  font-weight: 700;
  line-height: 1.25;
  text-align: center;
}

.contact-us-banner__desc {
  margin-bottom:40px;
  align-self: stretch;
  width: 100%;
  padding: 0 16px;
  color: var(--text-text-secondary, #353739);
  font-size: 14px;
  font-weight: 400;
  line-height: 20px;
  text-align: center;
}

.contact-us-banner__btn {
  min-width: 140px;
  padding: 10px 20px;
  border: 1px solid #e7e8eb;
  border-radius: 8px;
  background: #fff;
  color: var(--text-text-primary, #1d1e20);
  font-size: 14px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
  cursor: pointer;
}

.contact-us-banner__tagline {
  margin: 0;
  margin-top: auto;
  padding-bottom: 24px;
  color: #575d60;
  font-size: 12px;
  line-height: 16px;
  text-align: center;
}

/* ========== 小屏移动端（<640px）：只覆盖移动端，不影响已确认的平板 / PC ========== */
@media (max-width: 639.98px) {
  .contact-us-banner {
    padding-bottom: 25px;
  }

  .contact-us-banner__bg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 333px;
    object-fit: cover;
    object-position: center top;
    pointer-events: none;
  }

  .contact-us-banner__inner {
    position: relative;
    z-index: 2;
    padding-top: 114px;
  }

  .contact-us-banner__panel-wrap {
    margin-top: 31px;
  }

  .contact-us-banner__icon {
    width: 62px;
    height: 62px;
  }

  .contact-us-banner__panel {
    height: 338px;
    border-radius: 20px;
    background: rgba(18, 163, 252, 0.10);
  }

  .contact-us-banner__content {
    padding: 60px 24px 16px;
  }

  .contact-us-banner__title {
    @apply contact-us-banner-title-mobile;

    margin: 0 0 12px;
    font-style: normal;
  }

  .contact-us-banner__desc {
    @apply contact-us-banner-desc-mobile;

    width: 100%;
    max-width: 306px;
    margin: 0 0 53px;
    padding: 0;
    align-self: center;
    font-style: normal;
  }

  .contact-us-banner__btn {
    @apply contact-us-button-text;

    min-width: 149px;
    padding: 12px 20px;
    border-radius: 6px;
    font-style: normal;
  }

  .contact-us-banner__tagline {
    @apply contact-us-note-mobile;

    margin-top: 8px;
    padding-bottom: 0;
    font-style: normal;
  }
}

/* ========== PC（≥768px）========== */
@media (min-width: 768px) {
  .contact-us-banner {
    min-height: 556px;
    padding: 0 40px;
    background: #fff;
  }

  /* 外层通栏背景图 */
  .contact-us-banner__bg {
    display: block;
    position: absolute;
    top: 0;
    left: 0;
    z-index: 0;
    width: 100%;
    height: 420px;
    object-fit: cover;
    object-position: center top;
    pointer-events: none;
  }

  .contact-us-banner__inner {
    position: relative;
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: flex-start;
    /* 水平居中；距顶 198px（原型稿），避免 fixed header 压住文字 */
    padding-top: 198px;
    box-sizing: border-box;
    min-height: 556px;
    margin: 0 auto;
  }

  .contact-us-banner__panel-wrap {
    width: 100%;
    max-width: 1062px;
    /* PC 卡片距顶 198px，图标向上叠入通栏背景区 */
    margin-top: 0;
  }

  .contact-us-banner__panel {
    width: 100%;
    height: 306px;
    border-radius: 20px;
  }

  .contact-us-banner__content {
    padding: 75px clamp(40px, 16vw, 207px) 0;
    justify-content: flex-start;
  }

  .contact-us-banner__title {
    width: 100%;
    font-size: 36px;
    line-height: 48px;
  }

  .contact-us-banner__desc {
    padding: 0;
    font-size: var(--sub-title, 16px);
    line-height: var(--line-sub-title, 24px);
  }

  .contact-us-banner__tagline {
    display: none;
  }
}

@media (min-width: 1024px) {
  .contact-us-banner {
    padding: 0 60px;
  }
}

@media (min-width: 1280px) {
  .contact-us-banner {
    padding: 0;
  }

  .contact-us-banner__inner {
    max-width: 1280px;
  }

  .contact-us-banner__content {
    /* 图标底 (36.5px) + 标题间距 78px；左右 206/207px（1062 内容区） */
    padding: 75px 207px 0 206px;
  }
}
</style>
