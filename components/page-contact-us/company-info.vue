<script setup lang="ts">
import { CONTACT_US_COMPANY_INTERNATIONAL, CONTACT_US_COMPANY_ZH, CONTACT_US_MODULE_HEIGHT } from '@/constants/contact-us'

const moduleHeight = CONTACT_US_MODULE_HEIGHT.company
const { isZh } = useRxI18n()

const companyInfo = computed(() => isZh.value ? CONTACT_US_COMPANY_ZH : CONTACT_US_COMPANY_INTERNATIONAL)
</script>

<template>
  <PageContactUsSectionWrap no-margin-top>
    <div
      class="contact-us-company"
      :style="{
        '--contact-us-company-h-mobile': `${moduleHeight.mobile}px`,
        '--contact-us-company-h-pc': `${moduleHeight.pc}px`,
      }"
    >
      <div class="contact-us-company__layout">
        <!-- 左栏：标题 + 办公图 -->
        <div class="contact-us-company__left">
          <h2 class="contact-us-company__title multilingual-text">
            {{ $t('contactUs.company标题') }}
          </h2>

          <div class="contact-us-company__image">
            <RxResponsiveImage
              name="contact-us/company-img"
              class="contact-us-company__image-media"
              :alt="$t('contactUs.company标题')"
            />
          </div>
        </div>

        <!-- 右栏：公司信息列表 -->
        <dl class="contact-us-company__right">
          <div class="contact-us-company__item">
            <dt class="contact-us-company__label">
              {{ $t('contactUs.company公司名称') }}
            </dt>
            <dd class="contact-us-company__value">
              {{ companyInfo.name }}
            </dd>
          </div>
          <div class="contact-us-company__item">
            <dt class="contact-us-company__label contact-us-company__label--primary">
              {{ $t('contactUs.company地址') }}
            </dt>
            <dd class="contact-us-company__value">
              {{ companyInfo.address }}
            </dd>
          </div>
          <div class="contact-us-company__item">
            <dt class="contact-us-company__label contact-us-company__label--primary">
              {{ $t('contactUs.company电话') }}
            </dt>
            <dd class="contact-us-company__value">
              {{ companyInfo.telephone }}
            </dd>
          </div>
          <div class="contact-us-company__item">
            <dt class="contact-us-company__label">
              {{ $t('contactUs.company客户服务') }}
            </dt>
            <dd class="contact-us-company__value">
              {{ companyInfo.customerServiceEmail }}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  </PageContactUsSectionWrap>
</template>

<style scoped lang="scss">
.contact-us-company {
  min-height: var(--contact-us-company-h-mobile);
}

.contact-us-company__layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-us-company__title {
  color: #111213;
  font-size: 24px;
  font-weight: 700;
}

.contact-us-company__image {
  overflow: hidden;
  border-radius: 12px;
  aspect-ratio: 4 / 3;
  width: 100%;
}

.contact-us-company__right {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin: 0;
}

.contact-us-company__item {
  display: flex;
  flex-direction: column;
}

.contact-us-company__label {
  color: #111213;
  font-weight: 600;
}

.contact-us-company__value {
  margin: 0;
  color: #34393d;
  font-size: 14px;
  line-height: 20px;
}

.contact-us-company__link {
  color: inherit;
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

@media (max-width: 639.98px) {
  .contact-us-company {
    min-height: auto;
  }

  .contact-us-company__layout {
    gap: 0;
  }

  .contact-us-company__left {
    display: flex;
    flex-direction: column;
    display: contents;
  }

  .contact-us-company__title {
    @apply contact-us-title-mobile;

    order: 1;
    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
  }

  .contact-us-company__image {
    order: 3;
    width: min(348px, 100%);
    height: auto;
    margin-top: 32px;
    border-radius: 20px;
    aspect-ratio: 348 / 244.147;
  }

  .contact-us-company__right {
    order: 2;
    margin-top: 24px;
    gap: 32px;
    font-family: Inter, sans-serif;
  }

  .contact-us-company__item {
    gap: 4px;
  }

  .contact-us-company__label {
    @apply contact-us-info-label;

    color: var(--text-text-secondary, #353739);
    font-style: normal;
  }

  .contact-us-company__label--primary {
    color: var(--text-text-primary, #1d1e20);
  }

  .contact-us-company__value {
    @apply contact-us-info-value;

    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
  }
}

@media (min-width: 768px) {
  .contact-us-company {
    min-height: 348px;
  }

  .contact-us-company__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: stretch;
    gap: clamp(32px, 8vw, 102px);
    min-height: var(--contact-us-company-h-pc);
  }

  .contact-us-company__left {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    min-height: var(--contact-us-company-h-pc);
  }

  .contact-us-company__title {
    /* Figma H4：仅 PC */
    color: var(--text-text-primary, #1d1e20);
    font-family: Archivo, sans-serif;
    font-size: var(--Heading-H4, 36px);
    font-style: normal;
    font-weight: 700;
    line-height: var(--line-H4, 48px);
  }

  .contact-us-company__image {
    position: relative;
    flex: none;
    width: min(348px, 100%);
    aspect-ratio: 348 / 244.147;
    border-radius: 20px;
    background: #d9d9d9;
  }

  /* Figma 背景裁切：125.67% / 111.565%，偏移 -22px / -28.235px */
  .contact-us-company__image-media {
    position: absolute;
    top: -28.235px;
    left: -22px;
    width: 125.67%;
    height: 111.565%;
    max-width: none;
    object-fit: cover;
  }

  .contact-us-company__right {
    justify-content: center;
    font-family: Inter, sans-serif;
    /* Figma：每个信息大块之间 32px */
    gap: 32px;
  }

  /* Figma：标签与内容之间 4px */
  .contact-us-company__item {
    gap: 4px;
  }

  /* Figma sub-title：标签行 */
  .contact-us-company__label {
    color: var(--text-text-secondary, #353739);
    font-size: var(--sub-title, 16px);
    font-style: normal;
    font-weight: 400;
    line-height: var(--line-sub-title, 24px);
  }

  /* Address 标签用 primary 色 */
  .contact-us-company__label--primary {
    color: var(--text-text-primary, #1d1e20);
  }

  /* Figma body：内容行 */
  .contact-us-company__value {
    color: var(--text-text-primary, #1d1e20);
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: var(--line-body, 28px);
  }
}

@media (min-width: 1280px) {
  .contact-us-company__layout {
    /* 1062 内容区：左 480 + 右 480，中间间距 102px */
    grid-template-columns: 480px 480px;
    gap: 102px;
  }

  .contact-us-company__left {
    flex-shrink: 0;
  }

  .contact-us-company__right {
    flex-shrink: 0;
  }
}
</style>
