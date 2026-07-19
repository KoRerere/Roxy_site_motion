<script setup lang="ts">
import heroBenefitCheck from '@/assets/svgs/intive/hero-benefit-check.svg?url'

const props = defineProps<{
  badge: string
  title: string
  subtitle: string
  primaryCta: string
  secondaryCta: string
  benefits: ReadonlyArray<{ textKey: string, highlightKey: string }>
  bannerCount: number
  activeBannerIndex: number
}>()

const { $t, isZh, isRu, isEn } = useRxI18n()

/** 文案排版分组：中文 / 西文（英俄共用），不用 html[lang] 全局选择器 */
const typoGroup = computed(() => isZh.value ? 'zh' : 'latin')

/** 副标题 30% 高亮拆分（俄文移动不高亮） */
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

</script>

<template>
  <!-- 仅移动端渲染：与 PC 区块完全独立，勿共用 class -->
  <div class="invite-hero-copy-mobile flex lg:hidden">
    <div class="invite-hero-copy-mobile__badge-wrap">
      <span class="invite-hero-copy-mobile__badge">
        {{ badge }}
      </span>
    </div>
    <h1
      class="invite-hero-copy-mobile__title"
      :class="`invite-hero-copy-mobile__title--${typoGroup}`"
    >
      <!-- 英文移动主标题：Trusted by / 3.79M+ Global Users 两行 -->
      <template v-if="isEn">
        <span class="invite-hero-copy-mobile__title-line">{{ $t('invite.heroMobileRegisterTitleLine1') }}</span>
        <span class="invite-hero-copy-mobile__title-line">{{ $t('invite.heroMobileRegisterTitleLine2') }}</span>
      </template>
      <template v-else>{{ title }}</template>
    </h1>
    <p
      class="invite-hero-copy-mobile__highlight"
      :class="`invite-hero-copy-mobile__highlight--${typoGroup}`"
    >
      <!-- 移动副标题：俄文整句白字；中/英在 30% 处换行 -->
      <template v-if="isRu">{{ subtitle }}</template>
      <template v-else-if="subtitleHasHighlight">
        <span class="invite-hero-copy-mobile__highlight-line">{{ subtitleBeforeHighlight.trim() }}</span>
        <span class="invite-hero-copy-mobile__highlight-line">
          <span
            class="invite-hero-copy-mobile__highlight-rate"
            :class="`invite-hero-copy-mobile__highlight-rate--${typoGroup}`"
          >{{ highlightText }}</span>{{ subtitleAfterHighlight }}
        </span>
      </template>
      <template v-else>{{ subtitle }}</template>
    </p>
    <ul class="invite-hero-copy-mobile__benefits">
      <li
        v-for="item in benefits"
        :key="item.textKey"
        class="invite-hero-copy-mobile__benefit-item"
      >
        <img :src="heroBenefitCheck" alt="" aria-hidden="true" draggable="false" class="invite-hero-copy-mobile__benefit-check">
        <!-- 暂时全语言整句展示，不做关键字高亮 -->
        <span>{{ $t(item.textKey) }}</span>
      </li>
    </ul>
    <div v-if="bannerCount > 1" class="invite-hero-copy-mobile__dots">
      <button
        v-for="index in bannerCount"
        :key="index - 1"
        type="button"
        class="invite-hero-copy-mobile__dot"
        :class="index - 1 === activeBannerIndex ? 'invite-hero-copy-mobile__dot--active' : ''"
        :aria-label="`Go to banner ${index}`"
        @click="emit('goToBanner', index - 1)"
      />
    </div>
  </div>
</template>

<style scoped>
/* 移动端 Hero 文案区；显隐由 invite-hero-critical.css 控制，避免 scoped 滞后 */
.invite-hero-copy-mobile {
  position: relative;
  width: 100%;
  min-width: 0;
  flex-direction: column;
  align-items: center;
  text-align: center;
  /* 默认字体用站点 --family（系统栈），避免 en-US 页继承 Archivo；红框标题单独覆盖 */
  font-family: var(--family);
}

.invite-hero-copy-mobile__badge-wrap {
  display: flex;
  width: 100%;
  justify-content: center;
}

.invite-hero-copy-mobile__badge {
  display: inline-flex;
  width: fit-content;
  max-width: 100%;
  align-items: center;
  justify-content: center;
  border-radius: 9999px;
  padding: 4px 12px;
  background: linear-gradient(100deg, #3FAAF6 0%, #F359DC 50%, #F28FB0 100%);
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  line-height: 14px;
  text-align: center;
}

/* 主标题基础：三色渐变字（中/西文共用） */
.invite-hero-copy-mobile__title {
  margin-top: 12px;
  text-align: center;
  font-style: normal;
  background: linear-gradient(90deg, #0092EB 0%, #FBCBCB 50%, #F241FF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.invite-hero-copy-mobile__title--zh {
  font-family: "IBM Plex Sans SC", sans-serif;
  font-size: 40px;
  font-weight: 700;
  line-height: 56px;
}

.invite-hero-copy-mobile__title--latin {
  font-family: Archivo, sans-serif;
  font-size: 34px;
  font-weight: 700;
  line-height: 45px;
}

/* 英文移动主标题两行换行 */
/* 主标题 / 副标题强制换行（英文主标题、中/英副标题 30% 处分行） */
.invite-hero-copy-mobile__title-line,
.invite-hero-copy-mobile__highlight-line {
  display: block;
}

/* 副标题基础：白字居中 */
.invite-hero-copy-mobile__highlight {
  margin-top: 4px;
  text-align: center;
  font-style: normal;
  color: #fff;
  -webkit-text-fill-color: currentColor;
}

.invite-hero-copy-mobile__highlight--zh {
  font-family: "IBM Plex Sans SC", sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 48px;
}

.invite-hero-copy-mobile__highlight--latin {
  font-family: Archivo, sans-serif;
  font-size: 28px;
  font-weight: 700;
  line-height: 40px;
}

/* 副标题 30%：蓝紫渐变字 */
.invite-hero-copy-mobile__highlight-rate {
  background: linear-gradient(90deg, #0092EB 0%, #F241FF 100%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.invite-hero-copy-mobile__highlight-rate--zh {
  font-family: "IBM Plex Sans SC", sans-serif;
  font-size: 36px;
  font-weight: 700;
  line-height: 48px;
}

.invite-hero-copy-mobile__highlight-rate--latin {
  font-family: Archivo, sans-serif;
  font-size: 32px;
  font-weight: 700;
  line-height: 40px;
}

.invite-hero-copy-mobile__benefits {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  margin: 24px 0 0;
  padding: 0;
  list-style: none;
}

.invite-hero-copy-mobile__benefit-item {
  display: flex;
  width: 100%;
  align-items: flex-start;
  gap: 4px;
  color: #fff;
  font-size: 14px;
  font-weight: 500;
  line-height: 150%;
  text-align: left;
}

.invite-hero-copy-mobile__benefit-check {
  flex-shrink: 0;
  width: 16px;
  height: 16px;
  margin-top: 2px;
}

/* 卖点关键字高亮色：设计 token --colors-text-text-brand */
:global(.invite-hero-benefit-highlight) {
  color: var(--colors-text-text-brand, #11A3FD);
}

.invite-hero-copy-mobile__actions {
  display: flex;
  width: 100%;
  gap: 12px;
  margin-top: 24px;
}

.invite-hero-copy-mobile__btn-primary,
.invite-hero-copy-mobile__btn-secondary {
  display: inline-flex;
  height: 48px;
  min-width: 0;
  flex: 1;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 16px;
  line-height: 18px;
  box-sizing: border-box;
  white-space: nowrap;
  cursor: pointer;
}

.invite-hero-copy-mobile__btn-primary {
  background: linear-gradient(0deg, #12A3FC 0%, #12A3FC 100%), linear-gradient(99deg, #238AFF 67.78%, #F9B3B4 107.9%);
  color: #fff;
  font-weight: 500;
  box-shadow: 0 4px 16px 0 rgba(18, 163, 252, 0.36);
}

.invite-hero-copy-mobile__btn-primary:hover {
  background: #1a7fd9;
}

.invite-hero-copy-mobile__btn-secondary {
  border: 1px solid rgba(255, 255, 255, 0.12);
  background: rgba(67, 73, 91, 0.8);
  color: #fff;
  font-weight: 500;
}

.invite-hero-copy-mobile__btn-secondary:hover {
  background: rgba(78, 85, 106, 0.9);
}

.invite-hero-copy-mobile__dots {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
}

.invite-hero-copy-mobile__dot {
  height: 8px;
  width: 8px;
  border: none;
  border-radius: 9999px;
  background: rgba(255, 255, 255, 0.45);
  cursor: pointer;
  transition: all 0.2s;
}

.invite-hero-copy-mobile__dot--active {
  width: 32px;
  background: #fff;
}
</style>
