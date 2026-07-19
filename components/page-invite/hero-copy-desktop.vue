<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import heroBenefitCheck from '@/assets/svgs/intive/hero-benefit-check.svg?url'

const props = defineProps<{
  badge: string
  title: string
  subtitle: string
  highlight: string
  primaryCta: string
  secondaryCta: string
  benefits: ReadonlyArray<{ textKey: string, highlightKey: string }>
  bannerCount: number
  activeBannerIndex: number
}>()

const { $t, isZh, isRu } = useRxI18n()

/** 文案排版分组：中文 / 西文（英俄共用），不用 html[lang] 全局选择器 */
const typoGroup = computed(() => isZh.value ? 'zh' : 'latin')

/** 副标题 30% 高亮拆分（俄文 PC 不高亮） */
const highlightText = computed(() => $t('invite.heroDiscountSubtitleHighlight'))
const subtitleHighlightIndex = computed(() => props.subtitle.indexOf(highlightText.value))
const subtitleBeforeHighlight = computed(() => {
  if (subtitleHighlightIndex.value === -1)
    return props.subtitle
  return props.subtitle.slice(0, subtitleHighlightIndex.value)
})
const subtitleAfterHighlight = computed(() => {
  if (subtitleHighlightIndex.value === -1)
    return ''
  return props.subtitle.slice(subtitleHighlightIndex.value + highlightText.value.length)
})
const subtitleHasHighlight = computed(() => subtitleHighlightIndex.value !== -1)

const emit = defineEmits<{
  goToBanner: [index: number]
}>()

const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()
</script>

<template>
  <!-- 仅 PC 端渲染：与移动端区块完全独立，勿共用 class -->
  <div class="invite-hero-copy-desktop hidden lg:flex">
    <span class="invite-hero-copy-desktop__badge">
      {{ badge }}
    </span>
    <h1
      class="invite-hero-copy-desktop__title"
      :class="`invite-hero-copy-desktop__title--${typoGroup}`"
    >
      {{ title }}
    </h1>
    <p
      class="invite-hero-copy-desktop__highlight"
      :class="`invite-hero-copy-desktop__highlight--${typoGroup}`"
    >
      <!-- PC 副标题：俄文整句白字；中/英拆分 30% 渐变 -->
      <template v-if="isRu">{{ subtitle }}</template>
      <template v-else-if="subtitleHasHighlight">
        {{ subtitleBeforeHighlight }}<span
          class="invite-hero-copy-desktop__highlight-rate"
          :class="`invite-hero-copy-desktop__highlight-rate--${typoGroup}`"
        >{{ highlightText }}</span>{{ subtitleAfterHighlight }}
      </template>
      <template v-else>{{ subtitle }}</template>
    </p>
    <ul class="invite-hero-copy-desktop__benefits">
      <li
        v-for="item in benefits"
        :key="item.textKey"
        class="invite-hero-copy-desktop__benefit-item"
        :class="`invite-hero-copy-desktop__benefit-item--${typoGroup}`"
      >
        <img :src="heroBenefitCheck" alt="" aria-hidden="true" draggable="false" class="invite-hero-copy-desktop__benefit-check">
        <!-- 暂时全语言整句展示，不做关键字高亮 -->
        <span>{{ $t(item.textKey) }}</span>
      </li>
    </ul>
    <!-- 1123px 以下隐藏，与 the-header MOBILE_HEADER_MEDIA 一致 -->
    <div class="invite-hero-copy-desktop__actions">
      <NuxtLinkLocale
        to="/download"
        class="invite-hero-copy-desktop__btn-primary"
        @click.capture="redirectMobileDownloadToLogin"
      >
        {{ primaryCta }}
        <RxIcon name="base/rx_ic_chevron_right" size="20" color="#fff" />
      </NuxtLinkLocale>
      <NuxtLinkLocale
        to="/"
        class="invite-hero-copy-desktop__btn-secondary"
      >
        {{ secondaryCta }}
        <RxIcon name="base/rx_ic_chevron_right" size="20" color="#fff" />
      </NuxtLinkLocale>
    </div>
    <div v-if="bannerCount > 1" class="invite-hero-copy-desktop__dots">
      <button
        v-for="index in bannerCount"
        :key="index - 1"
        type="button"
        class="invite-hero-copy-desktop__dot"
        :class="index - 1 === activeBannerIndex ? 'invite-hero-copy-desktop__dot--active' : ''"
        :aria-label="`Go to banner ${index}`"
        @click="emit('goToBanner', index - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
/* PC 端 Hero 文案区；显隐由 invite-hero-critical.css 控制，避免 scoped 滞后 */
.invite-hero-copy-desktop {
  position: relative;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  /* 默认字体用站点 --family（系统栈），避免 en-US 页继承 Archivo；红框标题单独覆盖 */
  font-family: var(--family);
}

.invite-hero-copy-desktop__badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 6px 16px;
  background: linear-gradient(100deg, #3FAAF6 0%, #F359DC 50%, #F28FB0 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: normal;
  transform: rotate(-6deg);
}

/* 主标题基础：三色渐变字（中/西文共用） */
.invite-hero-copy-desktop__title {
  width: 100%;
  font-style: normal;
  background: linear-gradient(90deg, #0092EB 0%, #FBCBCB 50%, #F241FF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.invite-hero-copy-desktop__title--zh {
  font-size: 48px;
  font-weight: 700;
  line-height: 66px;
}

.invite-hero-copy-desktop__title--latin {
  font-family: Archivo, sans-serif;
  font-size: 44px;
  font-weight: 700;
  line-height: 66px;
}

/* 副标题基础：白字 */
.invite-hero-copy-desktop__highlight {
  width: 100%;
  font-style: normal;
  color: #fff;
  -webkit-text-fill-color: currentColor;
}

.invite-hero-copy-desktop__highlight--zh {
  font-size: 40px;
  font-weight: 700;
  line-height: 60px;
}

.invite-hero-copy-desktop__highlight--latin {
  font-family: Archivo, sans-serif;
  font-size: 32px;
  font-weight: 600;
  line-height: 60px;
}

/* 副标题 30%：蓝紫渐变字 */
.invite-hero-copy-desktop__highlight-rate {
  background: linear-gradient(90deg, #0092EB 0%, #F241FF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.invite-hero-copy-desktop__highlight-rate--zh {
  font-family: "IBM Plex Sans SC", sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 60px;
}

.invite-hero-copy-desktop__highlight-rate--latin {
  font-family: Archivo, sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 60px;
}

.invite-hero-copy-desktop__benefits {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 12px;
  margin: 32px 0 0;
  padding: 0;
  list-style: none;
}

.invite-hero-copy-desktop__benefit-item {
  display: flex;
  align-items: flex-start;
  gap: 8px;
  color: #fff;
  font-weight: 500;
}

/* 中文卖点：20px / 30px */
.invite-hero-copy-desktop__benefit-item--zh {
  font-size: 20px;
  line-height: 30px;
}

/* 英文/俄文卖点：18px / 28px */
.invite-hero-copy-desktop__benefit-item--latin {
  font-size: 18px;
  line-height: 28px;
}



.invite-hero-copy-desktop__benefit-check {
  flex-shrink: 0;
  width: 20px;
  height: 20px;
  margin-top: 4px;
}

/* 卖点关键字高亮色：设计 token --colors-text-text-brand */
:global(.invite-hero-benefit-highlight) {
  color: var(--colors-text-text-brand, #11A3FD);
}

.invite-hero-copy-desktop__actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 15px;
  margin-top: 40px;
}

/* 1123px 以下隐藏，与 the-header MOBILE_HEADER_MEDIA 一致；需 !important 压过 invite-hero-critical.css */
@media (max-width: 1123px) {
  .invite-hero-copy-desktop__actions {
    display: none !important;
  }
}

.invite-hero-copy-desktop__btn-primary,
.invite-hero-copy-desktop__btn-secondary {
  display: inline-flex;
  height: 48px;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 8px;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: pointer;
}

.invite-hero-copy-desktop__btn-primary {
  width: fit-content;
  padding: 0 48px;
  background: linear-gradient(0deg, #12A3FC 0%, #12A3FC 100%), linear-gradient(99deg, #238AFF 67.78%, #F9B3B4 107.9%);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
  box-shadow: 0 4px 16px 0 rgba(18, 163, 252, 0.36);
}

.invite-hero-copy-desktop__btn-primary:hover {
  background: #1a7fd9;
}

.invite-hero-copy-desktop__btn-secondary {
  padding: 0 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(67, 73, 91, 0.8);
  color: #fff;
  font-size: 16px;
  font-weight: 500;
}

.invite-hero-copy-desktop__btn-secondary:hover {
  background: rgba(78, 85, 106, 0.9);
}

.invite-hero-copy-desktop__dots {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 8px;
  margin-top: 20px;
}

.invite-hero-copy-desktop__dot {
  height: 8px;
  width: 8px;
  border: none;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: all 0.2s;
}

.invite-hero-copy-desktop__dot--active {
  width: 32px;
  background: #fff;
}
</style>
