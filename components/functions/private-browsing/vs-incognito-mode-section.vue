<script setup lang="tsx">
import { NuxtLinkLocale } from '#components'
import { useMouseInElement } from '@vueuse/core'
import { isString } from 'es-toolkit'
import { Translation } from 'vue-i18n'

const styles = useCssModule()
const rootElRef = useTemplateRef<HTMLDivElement>('rootEl')
const { isOutside } = useMouseInElement(rootElRef)
const hoverIndex = ref(0)

const tableData = [
  {
    header: $t('功能对比'),
    items: [
      $t('身份伪装'),
      $t('IP 保护'),
      $t('跨站追踪'),
      $t('反侦测'),
      $t('登录隐私'),
      $t('多账号管理'),
      $t('突破限制'),
      $t('配置文件控制'),
      $t('真实隐私等级'),
    ],
  },
  {
    header: 'RoxyBrowser',
    headerIcon: 'functions/logo',
    headerClass: 'roxybrowser',
    itemIcon: 'functions/site_ic_check',
    bulge: true,
    items: [
      $t('伪造全新的设备指纹'),
      $t('通过高质量代理隐藏真实 IP'),
      $t('隔离每个会话环境（每个窗口都像一个不同的真实用户）'),
      $t('模拟人类行为（随机化操作），不易被识别'),
      $t('用不同窗口隔离多个账号的登录信息'),
      $t('同时运行多个账号，无封号风险'),
      $t('使用代理访问有地域限制的内容'), 
      $t('配置窗口可完全自定义，如代理、时区等'), 
      $t('真正实现匿名浏览，不被记录真实信息'), 
    ],
  }, 
  {
    header: $t('无痕模式'),
    items: [
      $t('暴露真实设备特征（操作系统、屏幕分辨率、字体等）'),
      $t('暴露真实 IP（网络服务商/公司会记录你的访问）'),
      $t('广告商能将你在不同网站上的活动关联起来'),
      $t('重复且独特的行为模式容易被识别为机器人'),
      $t('所有登录信息都共享同一个浏览器会话'),
      $t('每个平台只能登录一个账号'),
      $t('无法绕过内容封锁或地区限制'),
      $t('无法控制浏览器指纹或会话环境'),
      $t('只能隐藏同一设备上的人的本地浏览记录'),
    ],
  },

]

watch(isOutside, (val) => {
  if (val) {
    hoverIndex.value = -1
  }
})

function handleMouseOver(index: number) {
  hoverIndex.value = index
}
</script>

<template>
  <div ref="rootEl" class="flex flex-col gap-12">
    <div class="flex flex-col gap-4 justify-center items-center">
      <div class="why-text">
        {{ $t('差异一目了然') }}
      </div>
      <h2 class="title">
        {{ $t('RoxyBrowser vs. 普通无痕模式') }}
      </h2>
    </div>
    <div class="scroll-container">
      <div class="table-container">
        <div v-for="col in tableData" :key="col.header" class="col" :class="{ bulge: col.bulge }">
          <div class="header">
            <template v-if="col.headerIcon">
              <rx-icon-svg-icon :name="col.headerIcon" :size="36" class="ml-9" />
            </template>
            <span :class="col.headerClass">{{ col.header }}</span>
          </div>
          <div v-for="(item, index) in col.items" :key="item" class="cell" :class="{ 'hover': hoverIndex === index }" @mouseover="handleMouseOver(index)">
            <template v-if="isString(item)">
              <template v-if="col.itemIcon">
                <rx-icon-svg-icon :name="col.itemIcon" class="md:text-6 text-5" />
              </template>
              {{ item }}
            </template>
            <template v-else>
              <component :is="item" />
            </template>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.to-pricing-btn {
  display: flex;
  width: 317px;
  padding: 12px 20px 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 4px;
  flex-shrink: 0;
  border-radius: 8px;
  background: linear-gradient(0deg, #fff 0%, #fff 100%), linear-gradient(99deg, #238aff 67.78%, #f9b3b4 107.9%);
  color: var(--colors-text-text-link, #11a3fd);
  font-family: Inter;
  font-size: 18px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* 133.333% */
  white-space: nowrap;
  cursor: pointer;

  @media (max-width: 1024px) {
    font-size: 16px;
  }
}
</style>

<style lang="scss" scoped>
.why-text {
  width: fit-content;
  display: flex;
  padding: 6px 16px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  border: 1px solid #11a3fd;
  color: var(--colors-text-text-brand, #11a3fd);
  text-align: center;
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 24px;
  /* 150% */
  letter-spacing: -0.048px;

  @media (max-width: 768px) {
    font-size: 14px;
    line-height: 20px;
  }
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;

  /* H3 */
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px);
  /* 120% */

  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.scroll-container {
  width: 100%;
  padding: 30px 0 42px;
  overflow-x: hidden;
  overflow-y: hidden;

  @media (max-width: 1500px) {
    overflow-x: auto;

    .table-container {
      width: max-content;
    }
  }

  &::-webkit-scrollbar {
    width: 6px;
    /* 垂直滚动条宽度 */
    height: 6px;
    /* 水平滚动条高度 */
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  /* 滑块悬停时 */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background: #c2d5e0;
    border-radius: 6px;
  }
}

.table-container {
  width: 100%;
  display: flex;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(175, 183, 187, 0.2);

  .col {
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-shrink: 0;
    @media (max-width: 960px) {
      flex: 0.8;
    }

    &:first-child {
      @media (max-width: 960px) {
        flex: 0.7;
      }

      .cell.hover {
        &:last-of-type {
          border-end-start-radius: 20px;
        }
      }
    }

    &:last-child {
      @media (max-width: 960px) {
        flex: 0.9;
      }

      .cell.hover {
        &:last-of-type {
          border-end-end-radius: 20px;
        }
      }
    }

    &.bulge {
      margin-top: -20px;
      margin-bottom: -20px;
      justify-content: center;
      flex: 1.2;
      border-radius: 24px;
      background: radial-gradient(50% 50% at 50% 50%, #0a90f2 0%, #33a9ff 100%);
      box-shadow:
        0 2px 24px 0 rgba(51, 169, 255, 0.2),
        0 2px 12px 0 rgba(51, 169, 255, 0.3);

      .cell,
      .header {
        color: white;
        border-bottom: 1px solid rgba(255, 255, 255, 0.2);
      }

      .cell.hover {
        background: rgba(255, 255, 255, 0.12);
      }
    }

    .cell,
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      height: 72px;
      padding: 0 28px;
      border-bottom: 1px solid var(--colors-border-border-inactive, #e2e9ee);
    }

    .header {
      gap: 8px;
      color: var(--colors-text-text-primary, #111213);
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 26px;
      /* 144.444% */
      letter-spacing: -0.054px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.2);

      .roxybrowser {
        color: #fff;
        font-family: Archivo;
        font-size: 26px;
        font-style: normal;
        font-weight: 700;
        line-height: normal;
      }
    }

    .cell {
      color: var(--colors-text-text-secondary, #555759);
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 500;
      line-height: 26px;
      transition: background 0.15s ease;
      border-bottom: 1px solid var(--colors-border-border-inactive, #e2e9ee);

      &:last-child {
        border-bottom: none;
      }

      &.hover {
        background: rgba(17, 163, 253, 0.12);
      }
    }

    .cell,
    .header {
      @media (max-width: 1024px) {
        padding: 14px 16px;
        height: 60px;
        font-size: 14px;
        font-weight: 500;
        line-height: 20px;
      }
    }
  }
}
</style>
