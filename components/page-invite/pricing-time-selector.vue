<script setup lang="ts">
import { usePricingContext } from '@/components/page-pricing/pricing-context'

/** 折扣角标字体：设计稿 DingTalk JinBuTi */
useHead({
  link: [
    {
      rel: 'stylesheet',
      href: 'https://cdn.jsdelivr.net/npm/cn-fontsource-ding-talk-jin-bu-ti-regular/font.css',
    },
  ],
})

const modelValue = defineModel<number>({ default: 30 })

const context = usePricingContext()
const { isZh, isEn } = useRxI18n()

/** 将「30 天」/「30 days」拆成数字与单位，便于分别设字体 */
function parseTimeLabel(label: string) {
  const match = label.trim().match(/^(\d+)\s*(.*)$/)
  if (!match)
    return { num: label, unit: '' }
  return { num: match[1]!, unit: match[2]! }
}

/** 单位文案字体：中文用微软雅黑，英文用 Archivo */
function getUnitFontClass() {
  if (isZh.value)
    return 'invite-pricing-time-label__unit--zh'
  if (isEn.value)
    return 'invite-pricing-time-label__unit--en'
  return 'invite-pricing-time-label__unit--ru'
}

const timeOptionItems = computed(() => {
  return context.timeOptions.map(item => ({
    ...item,
    parsedLabel: parseTimeLabel(item.label),
  }))
})

/** 折扣角标颜色：15%/25% 橙色 #FC9D12，40% 红色 #FC1212 */
function getDiscountBadgeClass(discount: number) {
  if (discount >= 40)
    return 'invite-pricing-time-badge--red'
  return 'invite-pricing-time-badge--orange'
}
</script>

<template>
  <div
    class="invite-pricing-time-selector flex w-full items-stretch overflow-visible rounded-[10px] bg-[#E2E9EE]"
    role="tablist"
    aria-label="subscription duration"
  >
    <button
      v-for="item in timeOptionItems"
      :key="item.value"
      type="button"
      role="tab"
      :aria-selected="modelValue === item.value"
      class="invite-pricing-time-option relative flex min-w-0 flex-1 cursor-pointer items-center justify-center border-0 bg-transparent"
      :class="modelValue === item.value ? 'invite-pricing-time-option--active' : ''"
      @click="modelValue = item.value"
    >
      <span
        v-if="item.discount"
        class="invite-pricing-time-badge"
        :class="getDiscountBadgeClass(item.discount)"
      >
        {{ item.discount }}% Off
      </span>

      <!-- 数字（Archivo）与单位（中文：微软雅黑）分设字体 -->
      <span
        class="invite-pricing-time-label"
        :class="modelValue === item.value ? 'invite-pricing-time-label--active' : ''"
      >
        <span class="invite-pricing-time-label__num">{{ item.parsedLabel.num }}</span>
        <span
          v-if="item.parsedLabel.unit"
          class="invite-pricing-time-label__unit"
          :class="getUnitFontClass()"
        >{{ item.parsedLabel.unit }}</span>
      </span>
    </button>
  </div>
</template>

<style scoped>
/* 移动端：padding / gap 均为 8px（PC 见下方 lg 媒体查询覆盖布局属性） */
.invite-pricing-time-selector {
  padding: 8px;
  gap: 8px;
}

/* PC 端整体：w 402（内容 386 + padding 8*2）/ h-56 / p-8 / gap-8 / 居中 */
@media (min-width: 1024px) {
  .invite-pricing-time-selector {
    box-sizing: border-box;
    display: flex;
    align-items: center;
    width: 402px;
    max-width: 100%;
    height: 56px;
    margin-left: auto;
    margin-right: auto;
    padding: 8px;
    gap: 8px;
    border-radius: 16px;
    background-color: #F1F5F8;
  }

  /* PC 选项：h-40 适配容器内高，选中 padding 12px 24px */
  .invite-pricing-time-option {
    height: 40px;
    min-height: 40px;
    border-radius: 12px;
    padding: 12px 24px;
  }

  /* PC 选中项：radius 12px / 背景 #FFF */
  .invite-pricing-time-option--active {
    background: #fff;
    box-shadow: none;
  }

  /* PC 天数文案：数字 Archivo / 单位按语言分字体，选中 #000 */
  .invite-pricing-time-label {
    display: inline-flex;
    align-items: center;
    gap: 4px;
    text-align: center;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.8);
  }

  .invite-pricing-time-label--active {
    color: #000;
  }

  .invite-pricing-time-label__num {
    font-family: Archivo, sans-serif;
    font-size: 16px;
    font-weight: 600;
    font-style: normal;
    line-height: normal;
  }

  .invite-pricing-time-label__unit {
    font-size: 16px;
    font-weight: 600;
    font-style: normal;
    line-height: normal;
  }

  .invite-pricing-time-label__unit--zh {
    font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', var(--zhFamily);
  }

  .invite-pricing-time-label__unit--en {
    font-family: Archivo, sans-serif;
  }

  .invite-pricing-time-label__unit--ru {
    font-family: Montserrat, var(--ruFamily);
  }
}

/* 移动端选项与文案（PC 见上方 lg 媒体查询） */
@media (max-width: 1023.98px) {
  /* 设计稿：高 36px / padding 8px 20px / radius 8px */
  .invite-pricing-time-option {
    box-sizing: border-box;
    height: 36px;
    min-height: 36px;
    border-radius: 8px;
    padding: 8px 20px;
  }

  .invite-pricing-time-option--active {
    background: #fff;
    box-shadow: 0 2px 8px rgba(16, 24, 40, 0.08);
  }

  .invite-pricing-time-label {
    display: inline-flex;
    align-items: center;
    gap: 2px;
    text-align: center;
    white-space: nowrap;
    color: rgba(0, 0, 0, 0.8);
  }

  .invite-pricing-time-label--active {
    color: #000;
  }

  .invite-pricing-time-label__num {
    font-family: Archivo, sans-serif;
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    line-height: normal;
  }

  .invite-pricing-time-label__unit {
    font-size: 14px;
    font-weight: 600;
    font-style: normal;
    line-height: normal;
  }

  .invite-pricing-time-label__unit--zh {
    font-family: 'Microsoft YaHei UI', 'Microsoft YaHei', var(--zhFamily);
  }

  .invite-pricing-time-label__unit--en {
    font-family: Archivo, sans-serif;
  }

  .invite-pricing-time-label__unit--ru {
    font-family: Montserrat, var(--ruFamily);
  }

  /* 移动端折扣角标：宽 48 / 右上 top -16px right -4.5px */
  .invite-pricing-time-badge {
    width: 48px;
    top: -16px;
    right: -4.5px;
    left: auto;
    transform: none;
    font-size: 10px;
  }
}

/* 角标共享：设计稿 padding 上4 左右6 / 高20 / radius 5px */
.invite-pricing-time-badge {
  position: absolute;
  z-index: 1;
  box-sizing: border-box;
  display: inline-flex;
  height: 20px;
  padding-top: 4px;
  padding-right: 6px;
  padding-bottom: 4px;
  padding-left: 6px;
  align-items: center;
  justify-content: center;
  border-radius: 5px;
  font-family: 'DingTalk JinBuTi', Inter, sans-serif;
  font-weight: 400;
  font-style: normal;
  line-height: normal;
  color: #fff;
  white-space: nowrap;
}

/* PC 端折扣角标：右上角定位 */
@media (min-width: 1024px) {
  .invite-pricing-time-badge {
    top: -16px;
    right: -10px;
    left: auto;
    transform: none;
    font-size: 12px;
  }

  /* 40% 角标：设计稿 right -13px（橙色系为 -10px） */
  .invite-pricing-time-badge--red {
    right: -13px;
  }
}

/* 折扣角标背景色（设计稿 radius 5px 见上方 .invite-pricing-time-badge） */
.invite-pricing-time-badge--orange {
  background-color: #FC9D12;
}

.invite-pricing-time-badge--red {
  background-color: #FC1212;
}
</style>
