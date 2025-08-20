<script setup lang="tsx">
import { NuxtLinkLocale } from '#components'
import { isString } from 'es-toolkit'
import { Translation } from 'vue-i18n'

const styles = useCssModule()

const tableData = [
  {
    header: $t('功能对比'),
    items: [
      $t('浏览器指纹伪装'),
      $t('环境完全隔离'),
      $t('批量管理效率'),
      $t('IP与指纹匹配真实性'),
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
      $t('独立进程+沙盒隔离，数据0共享'),
      $t('一键批量启动，单机100+账号并行'),
      $t('绑定代理+自动同步地理位置/语言/时区'),
      $t('原生集成Selenium/Puppeteer，环境自动绑定'),
      $t('成员分权/操作审计/环境加密共享'),
      $t('封号率<2%，保障资产安全'),
      <div class={styles['to-pricing-btn']}>
        <Translation keypath={$t('仅需软件订阅费，{view}', { view: '{view}' })}>
          {{
            view: () => <NuxtLinkLocale to="/pricing">{$t('点击查看付费套餐') }</NuxtLinkLocale>,
          }}
        </Translation>
      </div>,
    ],
  },
  {
    header: $t('传统方式 (VPN/代理/虚拟机)'),
    itemIcon: 'functions/site_ic_error',
    items: [
      $t('仅改IP，指纹暴露'),
      $t('全局IP污染/Cookie泄漏'),
      $t('手工切换IP/系统'),
      $t('机房IP暴露/时区语言错乱'),
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
      $t('成本失控，ROI为负'),
    ],
  },

]
</script>

<template>
  <div class="antidetect-vs-traditional-panel">
    <div class="flex flex-col gap-4">
      <div class="why-text">
        {{ $t('为什么 RoxyBrowser 是更换 IP 地址的最佳工具') }}
      </div>
      <div class="title">
        {{ $t('反侦测浏览器 vs. 传统方法') }}
      </div>
    </div>
    <div class="table-container">
      <div v-for="col in tableData" :key="col.header" class="col" :class="{ bulge: col.bulge }">
        <div class="header">
          <template v-if="col.headerIcon">
            <rx-icon-svg-icon :name="col.headerIcon" :size="36" class="ml-9" />
          </template>
          <span :class="col.headerClass">{{ col.header }}</span>
        </div>
        <div v-for="item in col.items" :key="item" class="cell">
          <template v-if="isString(item)">
            <template v-if="col.itemIcon">
              <rx-icon-svg-icon :name="col.itemIcon" :size="24" />
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
</template>

<style module>
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
  line-height: 24px; /* 133.333% */
  white-space: nowrap;
  cursor: pointer;
}
</style>

<style lang="scss" scoped>
.antidetect-vs-traditional-panel {
  display: flex;
  flex-direction: column;
  gap: 72px;
}

.why-text {
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
  line-height: 24px; /* 150% */
  letter-spacing: -0.048px;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;

  /* H3 */
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */
}

.table-container {
  display: flex;
  width: 100%;
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(175, 183, 187, 0.2);

  .col {
    display: flex;
    flex-direction: column;
    flex: 1;

    &:first-child {
      flex: 0.9;
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
      }

      .cell:nth-child(4) {
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
      line-height: 26px; /* 144.444% */
      letter-spacing: -0.054px;

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
      line-height: 26px; /* 144.444% */
      letter-spacing: -0.054px;

      &:last-child {
        border-bottom: none;
      }

      &:nth-child(4) {
        background: rgba(17, 163, 253, 0.12);
      }
    }
  }
}
</style>
