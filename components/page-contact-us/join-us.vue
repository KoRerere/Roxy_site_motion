<script setup lang="ts">
import { CONTACT_US_JOIN_ITEMS, CONTACT_US_JOIN_ITEMS_INTERNATIONAL, CONTACT_US_MODULE_HEIGHT } from '@/constants/contact-us'

const { telegramLink } = useTelegram()
const { public: { isChinaSite } } = useRuntimeConfig()

const moduleHeight = CONTACT_US_MODULE_HEIGHT.join

/** 暂时仅展示首张卡片（商务合作） */
const joinItems = computed(() =>
  (isChinaSite ? CONTACT_US_JOIN_ITEMS : CONTACT_US_JOIN_ITEMS_INTERNATIONAL).slice(0, 1),
)

/** Telegram 卡片：按当前语言打开对应用户群 */
function getJoinItemHref(id: string) {
  if (id === 'telegram')
    return telegramLink.value
  return undefined
}
</script>

<template>
  <PageContactUsSectionWrap no-margin-top last>
    <div
      class="contact-us-join"
      :style="{
        '--contact-us-join-h-mobile': `${moduleHeight.mobile}px`,
        '--contact-us-join-h-pc': `${moduleHeight.pc}px`,
      }"
    >
      <div class="contact-us-join__layout">
        <h2 class="contact-us-join__title multilingual-text">
          {{ $t('contactUs.join标题') }}
        </h2>

        <ul class="contact-us-join__cards list-none">
          <li
            v-for="item in joinItems"
            :key="item.id"
            class="contact-us-join__card-cell"
          >
            <component
              :is="item.type === 'telegram' ? 'a' : 'div'"
              :href="item.type === 'telegram' ? getJoinItemHref(item.id) : undefined"
              :target="item.type === 'telegram' ? '_blank' : undefined"
              :rel="item.type === 'telegram' ? 'noopener noreferrer' : undefined"
              class="contact-us-join-card"
              :class="{ 'contact-us-join-card--link': item.type === 'telegram' }"
            >
              <div class="contact-us-join-card__media">
                <img
                  :src="item.imageSrc"
                  :alt="$t(item.labelKey)"
                  class="contact-us-join-card__img"
                  :class="{ 'contact-us-join-card__img--icon': item.type === 'telegram' }"
                  draggable="false"
                >
              </div>
              <span class="contact-us-join-card__label">
                {{ $t(item.labelKey) }}
              </span>
            </component>
          </li>
        </ul>
      </div>
    </div>
  </PageContactUsSectionWrap>
</template>

<style scoped lang="scss">
.contact-us-join {
  min-height: var(--contact-us-join-h-mobile);
}

.contact-us-join__layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.contact-us-join__title {
  color: #111213;
  font-size: 24px;
  font-weight: 700;
}

.contact-us-join__cards {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
  margin: 0;
  padding: 0;
}

/* Figma 卡片：column + 居中 + 圆角边框 */
.contact-us-join-card {
  display: flex;
  width: 100%;
  flex-direction: column;
  align-items: center;
  border-radius: 16px;
  border: 1px solid var(--border-border-strong, #d4dadd);
  background: #fff;
  box-sizing: border-box;
}

.contact-us-join-card--link {
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  transition: box-shadow 0.2s ease;

  &:hover {
    box-shadow: 0 4px 16px rgba(17, 163, 253, 0.12);
  }
}

.contact-us-join-card__media {
  display: flex;
  width: 100%;
  aspect-ratio: 1 / 1;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  border-radius: 20px;
  background: #fff;
}

.contact-us-join-card__img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.contact-us-join-card__img--icon {
  width: 56px;
  height: 56px;
}

.contact-us-join-card__label {
  color: var(--text-text-primary, #1d1e20);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
}

@media (max-width: 639.98px) {
  .contact-us-join {
    min-height: auto;
    padding-bottom: 48px;
  }

  .contact-us-join__layout {
    gap: 20px;
  }

  .contact-us-join__title {
    @apply contact-us-title-mobile;

    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
  }

  .contact-us-join-card {
    padding: 18px;
    gap: 16px;
    border: 1px solid var(--border-border-strong, #d4dadd);
    border-radius: 16px;
  }

  .contact-us-join-card__media {
    width: min(314px, 100%);
    height: 301px;
    border-radius: 20px;
    background: transparent;
  }

  .contact-us-join-card__img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .contact-us-join-card__label {
    @apply contact-us-body-mobile;

    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
    text-align: center;
  }
}

@media (min-width: 768px) {
  .contact-us-join {
    min-height: var(--contact-us-join-h-pc);
  }

  .contact-us-join__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: flex-start;
    gap: clamp(32px, 8vw, 102px);
    min-height: var(--contact-us-join-h-pc);
  }

  .contact-us-join__title {
    @apply contact-us-title-pc;

    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
  }

  .contact-us-join__cards {
    display: flex;
    align-items: flex-start;
    margin: 0;
    padding: 0;
  }

  .contact-us-join__card-cell {
    flex: none;
    width: min(234px, 100%);
  }

  /* Figma 单卡 338px；padding 18/16/1 + gap 16；内容区 304×304 */
  .contact-us-join-card {
    width: min(338px, 100%);
   /*  padding: 18px 16px 1px; */
    gap: 16px;
  }

  .contact-us-join-card__media {
    width: min(304px, 100%);
    height: auto;
    flex-shrink: 0;
    aspect-ratio: 1 / 1;
  }

  .contact-us-join-card__img--icon {
    width: 72px;
    height: 72px;
  }

  .contact-us-join-card__label {
    padding-bottom: 17px;
    font-size: 16px;
    line-height: 24px;
  }
}

@media (min-width: 1280px) {
  .contact-us-join__layout {
    /* 1062 内容区：左 480 + 右 480，中间间距 102px */
    grid-template-columns: 480px 480px;
    gap: 102px;
  }

  .contact-us-join__title {
    flex-shrink: 0;
  }

  .contact-us-join__cards {
    flex-shrink: 0;
    align-self: stretch;
  }

  .contact-us-join__card-cell {
    /* width: 338px; */
  }

  .contact-us-join-card {
    width: 234px;
  }

  .contact-us-join-card__media {
    aspect-ratio: auto;
  }
}
</style>
