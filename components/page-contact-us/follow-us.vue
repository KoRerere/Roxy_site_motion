<script setup lang="ts">
import type { ContactUsSocialItem } from '@/constants/contact-us'
import { RxIcon } from '@/components/rx-icon'
import { CONTACT_US_MODULE_HEIGHT } from '@/constants/contact-us'

const { socialItems } = useContactUsSocial()
const { public: { roxyHomeUrl } } = useRuntimeConfig()

const moduleHeight = CONTACT_US_MODULE_HEIGHT.follow

/** 悬停二维码：按 get_qrcode_info 的 type 缓存 URL */
const qrcodeUrlByType = ref<Record<string, string>>({})
const activeQrcodeId = ref<string | null>(null)

onMounted(async () => {
  const needsApi = socialItems.value.some(item => item.qrcodeOnHover?.apiType)
  document.addEventListener('click', closeActiveQrcode)
  window.addEventListener('scroll', closeActiveQrcode, { passive: true })

  if (!needsApi)
    return

  try {
    const res = await $fetch<{ data?: { type: string, status: number, qrcodeUrl: string }[] }>(
      `${roxyHomeUrl}/app_statistics/get_qrcode_info`,
    )
    for (const entry of res.data ?? []) {
      if (entry.status === 1 && entry.qrcodeUrl)
        qrcodeUrlByType.value[entry.type] = entry.qrcodeUrl
    }
  }
  catch {
    // API 不可用时使用 qrcodeOnHover.src 静态图
  }
})

onBeforeUnmount(() => {
  document.removeEventListener('click', closeActiveQrcode)
  window.removeEventListener('scroll', closeActiveQrcode)
})

function isSocialDisabled(item: ContactUsSocialItem) {
  return item.placeholder || item.disabled || item.link === '#'
}

function isSocialLinkDisabled(item: ContactUsSocialItem) {
  return isSocialDisabled(item)
}

function isSocialHidden(item: ContactUsSocialItem) {
  return item.disabled
}

function getQrcodeSrc(item: ContactUsSocialItem) {
  const cfg = item.qrcodeOnHover
  if (!cfg)
    return ''
  const apiType = cfg.apiType
  if (apiType && qrcodeUrlByType.value[apiType])
    return qrcodeUrlByType.value[apiType]
  return cfg.src ?? ''
}

function closeActiveQrcode() {
  activeQrcodeId.value = null
}

function toggleQrcode(item: ContactUsSocialItem, event: MouseEvent) {
  if (!item.qrcodeOnHover)
    return
  event.stopPropagation()
  activeQrcodeId.value = activeQrcodeId.value === item.id ? null : item.id
}
</script>

<template>
  <PageContactUsSectionWrap no-margin-top bordered>
    <div
      class="contact-us-follow"
      :style="{
        '--contact-us-follow-h-mobile': `${moduleHeight.mobile}px`,
        '--contact-us-follow-h-pc': `${moduleHeight.pc}px`,
      }"
    >
      <div class="contact-us-follow__layout">
        <h2 class="contact-us-follow__title multilingual-text">
          {{ $t('contactUs.follow标题') }}
        </h2>

        <ul class="contact-us-follow__icons list-none">
          <li
            v-for="item in socialItems"
            :key="item.id"
            v-show="!isSocialHidden(item)"
            class="contact-us-follow__icon-cell"
          >
            <!-- 悬停展示二维码：无点击跳转 -->
            <div
              v-if="item.qrcodeOnHover"
              class="contact-us-follow__icon contact-us-follow__icon--qrcode"
              :class="{ 'contact-us-follow__icon--qrcode-active': activeQrcodeId === item.id }"
              :aria-label="item.name"
              @click="toggleQrcode(item, $event)"
            >
              <RxIcon
                v-if="item.rxIcon"
                :name="item.rxIcon as any"
                size="40"
                class="contact-us-follow__icon-img contact-us-follow__icon-img--rx"
              />

              <div class="contact-us-follow__qrcode-popover" @click.stop>
                <div class="contact-us-follow__qrcode-box">
                  <img
                    v-if="getQrcodeSrc(item)"
                    :src="getQrcodeSrc(item)"
                    :alt="$t(item.qrcodeOnHover.labelKey)"
                    class="contact-us-follow__qrcode-img"
                    draggable="false"
                  >
                </div>
                <p class="contact-us-follow__qrcode-label">
                  {{ $t(item.qrcodeOnHover.labelKey) }}
                </p>
              </div>
            </div>

            <!-- 普通外链图标 -->
            <component
              :is="isSocialLinkDisabled(item) ? 'span' : 'a'"
              v-else
              :href="isSocialLinkDisabled(item) ? undefined : item.link"
              :aria-label="item.placeholder ? `${item.name} (${$t('（即将上线）')})` : item.name"
              :aria-disabled="isSocialLinkDisabled(item) ? 'true' : undefined"
              :title="item.placeholder ? $t('（即将上线）') : undefined"
              class="contact-us-follow__icon"
              :class="{
                'contact-us-follow__icon--disabled': isSocialLinkDisabled(item),
                'contact-us-follow__icon--tip': item.hoverTipKey,
              }"
              :target="isSocialLinkDisabled(item) ? undefined : '_blank'"
              :rel="isSocialLinkDisabled(item) ? undefined : 'noopener noreferrer'"
            >
              <RxIcon
                v-if="item.rxIcon"
                :name="item.rxIcon as any"
                size="40"
                class="contact-us-follow__icon-img contact-us-follow__icon-img--rx"
                :class="{ 'opacity-40': item.placeholder }"
              />
              <img
                v-else-if="item.icon"
                :src="item.icon"
                :alt="item.name"
                class="contact-us-follow__icon-img"
                :class="{
                  'opacity-40': item.placeholder,
                  'brightness-0': item.invertIcon !== false && !item.placeholder,
                }"
                draggable="false"
              >
              <span v-else class="text-3 text-[#7D8387] font-600">{{ item.name.slice(0, 1) }}</span>

              <div v-if="item.hoverTipKey" class="contact-us-follow__tip-popover">
                {{ $t(item.hoverTipKey) }}
              </div>
            </component>
          </li>
        </ul>
      </div>
    </div>
  </PageContactUsSectionWrap>
</template>

<style scoped lang="scss">
.contact-us-follow {
  min-height: var(--contact-us-follow-h-mobile);
}

.contact-us-follow__layout {
  display: flex;
  flex-direction: column;
  gap: 24px;
  justify-content: center;
}

.contact-us-follow__title {
  color: #111213;
  font-size: 24px;
  font-weight: 700;
}

.contact-us-follow__icons {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 16px;
  margin: 0;
  padding: 0;
  overflow: visible;
}

.contact-us-follow__icon-cell {
  position: relative;
}

.contact-us-follow__icon {
  display: flex;
  width: 48px;
  height: 48px;
  align-items: center;
  justify-content: center;
  border: 1px solid #e7e8eb;
  border-radius: 8px;
  background: #fff;
  box-sizing: border-box;
  cursor: default;
}

.contact-us-follow__icon--qrcode {
  position: relative;
  cursor: pointer;
}

.contact-us-follow__icon--tip {
  position: relative;
}

.contact-us-follow__icon--disabled {
  pointer-events: none;
  cursor: default;
}

.contact-us-follow__icon:not(.contact-us-follow__icon--disabled) {
  cursor: pointer;
}

.contact-us-follow__icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.contact-us-follow__icon-img--rx {
  flex-shrink: 0;
}

/* 悬停二维码浮层（Figma：白底卡片 + 下三角） */
.contact-us-follow__qrcode-popover {
  position: absolute;
  bottom: calc(100% + 5px);
  left: 50%;
  z-index: 20;
  display: flex;


  flex-direction: column;
  align-items: center;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%);
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
}

.contact-us-follow__icon--qrcode:hover .contact-us-follow__qrcode-popover {
  opacity: 1;
  visibility: visible;
}

.contact-us-follow__qrcode-popover::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #fff;
  transform: translateX(-50%);
}

.contact-us-follow__tip-popover {
  position: absolute;
  bottom: calc(100% + 5px);
  left: 50%;
  z-index: 20;
  width: max-content;
  max-width: min(240px, calc(100vw - 32px));
  padding: 12px 12px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.12);
  color: var(--text-text-primary, #1d1e20);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transform: translateX(-50%);
  transition: opacity 0.2s ease, visibility 0.2s ease;
  pointer-events: none;
}

.contact-us-follow__tip-popover::after {
  content: '';
  position: absolute;
  bottom: -8px;
  left: 50%;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-top: 8px solid #fff;
  transform: translateX(-50%);
}

.contact-us-follow__icon--tip:hover .contact-us-follow__tip-popover {
  opacity: 1;
  visibility: visible;
}

.contact-us-follow__qrcode-box {
  display: flex;
  width: 168px;
  height: 168px;
  align-items: center;
  justify-content: center;
  border-radius: 8px;
  background: #e7e8eb;
  overflow: hidden;
}

.contact-us-follow__qrcode-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.contact-us-follow__qrcode-label {
  margin: 4px 0 12px 0;
  color: var(--text-text-primary, #1d1e20);
  font-size: 14px;
  font-weight: 500;
  line-height: 20px;
  text-align: center;
}

@media (max-width: 639.98px) {
  .contact-us-follow {
    min-height: auto;
  }

  .contact-us-follow__layout {
    gap: 20px;
  }

  .contact-us-follow__title {
    @apply contact-us-title-mobile;

    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
  }

  .contact-us-follow__icons {
    grid-template-columns: repeat(3, minmax(0, 1fr));
    gap: 12px;
  }

  .contact-us-follow__icon {
    width: 100%;
    height: 108.667px;
    padding: 34px 34.667px 34.667px 34px;
    border: 1px solid var(--border-border-strong, #d4dadd);
    border-radius: 8px;
  }

  .contact-us-follow__icon--qrcode:hover .contact-us-follow__qrcode-popover {
    opacity: 0;
    visibility: hidden;
  }

  .contact-us-follow__icon--qrcode.contact-us-follow__icon--qrcode-active .contact-us-follow__qrcode-popover {
    opacity: 1;
    visibility: visible;
    pointer-events: auto;
  }

  .contact-us-follow__qrcode-img {
    pointer-events: auto;
    user-select: auto;
    -webkit-touch-callout: default;
  }

  .contact-us-follow__icon-img {
    width: 40px;
    height: 40px;
    object-fit: contain;
  }

  .contact-us-follow__icon-cell:nth-child(3n + 1) .contact-us-follow__qrcode-popover {
    left: 0;
    transform: none;
  }

  .contact-us-follow__icon-cell:nth-child(3n + 1) .contact-us-follow__qrcode-popover::after {
    left: 54px;
  }

  .contact-us-follow__icon-cell:nth-child(3n) .contact-us-follow__qrcode-popover {
    right: 0;
    left: auto;
    transform: none;
  }

  .contact-us-follow__icon-cell:nth-child(3n) .contact-us-follow__qrcode-popover::after {
    right: 54px;
    left: auto;
    transform: none;
  }
}

@media (min-width: 640px) {
  .contact-us-follow {
    min-height: var(--contact-us-follow-h-pc);
  }

  .contact-us-follow__layout {
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
    align-items: center;
    gap: clamp(32px, 8vw, 102px);
    min-height: var(--contact-us-follow-h-pc);
  }

  .contact-us-follow__title {
    @apply contact-us-title-pc;

    color: var(--text-text-primary, #1d1e20);
    font-style: normal;
  }

  .contact-us-follow__icons {
    display: flex;
    min-width: 0;
    flex-wrap: wrap;
    align-items: flex-start;
    gap: 12px;
    margin: 0;
    padding: 0;
  }

  .contact-us-follow__icon {
    width: 70px;
    height: 70px;
    padding: 15px;
    aspect-ratio: 1 / 1;
    border-radius: 8px;
    border: 1px solid var(--border-border-strong, #d4dadd);
  }

  .contact-us-follow__icon-img {
    width: 100%;
    height: 100%;
    max-width: 40px;
    max-height: 40px;
    object-fit: contain;
  }
}

@media (min-width: 1280px) {
  .contact-us-follow__layout {
    grid-template-columns: 480px 480px;
    gap: 102px;
  }

  .contact-us-follow__title {
    flex-shrink: 0;
  }

  .contact-us-follow__icons {
    flex-shrink: 0;
    align-self: stretch;
  }
}
</style>
