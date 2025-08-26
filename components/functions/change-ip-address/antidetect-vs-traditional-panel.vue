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
      $t('浏览器指纹伪装'),
      $t('环境完全隔离'),
      $t('批量管理效率'),
      $t('IP 与指纹匹配真实性'),
      $t('自动化支持'),
      $t('团队协作安全'),
      $t('账号安全成本'),
      $t('硬件投入'),
    ],
  },
  {
    header: 'RoxyBrowser',
    headerIcon: 'functions/logo',
    headerClass: 'roxybrowser',
    itemIcon: 'functions/site_ic_check',
    bulge: true,
    items: [
      $t('深度修改指纹信息，模拟真实设备差异'),
      $t('独立进程+沙盒隔离，数据 0 共享'),
      $t('一键批量启动，单机 100+ 账号并行'),
      $t('绑定代理+自动同步地理位置/语言/时区'),
      $t('原生集成 Selenium/Puppeteer，环境自动绑定'),
      $t('成员分权/操作审计/环境加密共享'),
      $t('封号率<2%，保障资产安全'),
      <div class={styles['to-pricing-btn']}>
        <NuxtLinkLocale to="/pricing">
          <div class="flex items-center gap-1">
            <span>{$t('查看价格方案')}</span>
            <rx-icon-svg-icon name="base/rx_ic_right" size="20" />
          </div>
        </NuxtLinkLocale>
      </div>,
    ],
  },
  {
    header: $t('传统方式 (VPN/代理/虚拟机)'),
    itemIcon: 'functions/site_ic_error',
    items: [
      $t('仅改 IP，指纹暴露'),
      $t('全局 IP 污染/Cookie 泄漏'),
      $t('手动切换 IP/系统'),
      $t('机房 IP 暴露/时区语言错乱'),
      $t('全局代理干扰脚本'),
      $t('共享账号/IP，权责混乱'),
      $t('封号率>80%，万元级损失/月'),
      $t('需多台设备/虚拟机，￥5000+/账号'),
    ],
  },
  {
    header: $t('传统方式的致命后果'),
    items: [
      $t('风控秒识关联，账号批量封禁'),
      $t('操作痕迹交叉，触发风控红标'),
      $t('人力成本翻倍，错失商机'),
      $t('被标记“虚假流量”，广告账户限流'),
      $t('无法规模化运营，业务停滞'),
      $t('员工误操作致全军覆没'),
      $t('店铺/广告账户永久禁用'),
      $t('成本失控，ROI 为负'),
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
        {{ $t('为什么 RoxyBrowser 是更换 IP 地址的最佳工具') }}
      </div>
      <h2 class="title">
        {{ $t('反侦测浏览器 vs. 传统方法') }}
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
  display: flex;
  width: fit-content;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(175, 183, 187, 0.2);

  .col {
    display: flex;
    flex-direction: column;
    flex: 1;
    flex-shrink: 0;

    &:first-child {
      flex-grow: 0.9;

      .cell.hover {
        &:last-of-type {
          border-end-start-radius: 20px;
        }
      }
    }

    &:last-child {
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
