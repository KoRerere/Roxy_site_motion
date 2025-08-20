<script setup lang="ts">
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
    header: $t('指纹浏览器'),
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
      $t('成本失控，ROI为负'),
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
    <div class="title">
      {{ $t('反侦测浏览器 vs. 传统方法') }}
    </div>
    <div class="table-container">
      <div v-for="col in tableData" :key="col.header" class="col" :class="{ bulge: col.bulge }">
        <div class="header">
          {{ col.header }}
        </div>
        <div v-for="item in col.items" :key="item" class="cell">
          <template v-if="col.itemIcon">
            <rx-icon-svg-icon :name="col.itemIcon" :size="24" />
          </template>
          {{ item }}
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.antidetect-vs-traditional-panel {
  display: flex;
  flex-direction: column;
  gap: 72px;
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

    &.bulge {
      border-radius: 24px;
      background: radial-gradient(50% 50% at 50% 50%, #0a90f2 0%, #33a9ff 100%);
      box-shadow:
        0 2px 24px 0 rgba(51, 169, 255, 0.2),
        0 2px 12px 0 rgba(51, 169, 255, 0.3);
      transform: scale(1.03, 1.05);

      .cell,
      .header {
        color: white;
      }
    }

    .cell,
    .header {
      display: flex;
      align-items: center;
      gap: 16px;
      width: 305px;
      height: 72px;
      padding: 0 28px;
      border-bottom: 1px solid var(--colors-border-border-inactive, #e2e9ee);
    }

    .header {
      color: var(--colors-text-text-primary, #111213);
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 600;
      line-height: 26px; /* 144.444% */
      letter-spacing: -0.054px;
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
    }
  }
}
</style>
