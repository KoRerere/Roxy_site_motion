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
    ].map(n => ({ title: n })),
  },
  {
    header: $t('指纹浏览器'),
    items: [
      {
        title: $t('✅ 深度修改指纹信息，模拟真实设备差异'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('✅ 独立进程+沙盒隔离，数据0共享'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('✅ 一键批量启动，单机100+账号并行'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('✅ 绑定代理+自动同步地理位置/语言/时区'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('✅ 原生集成Selenium/Puppeteer，环境自动绑定'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('✅ 成员分权/操作审计/环境加密共享'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('✅ 封号率<2%，保障资产安全'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('成本失控，ROI为负'),
        icon: 'icon-fingerprint',
      },
    ],
  },
  {
    header: $t('传统方式 (VPN/代理/虚拟机)'),
    items: [
      {
        title: $t('仅改IP，指纹暴露'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('全局IP污染/Cookie泄漏'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('手工切换IP/系统'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('机房IP暴露/时区语言错乱'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('全局代理干扰脚本'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('共享账号/IP，权责混乱'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('封号率>80%，万元级损失/月'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('需多台设备/虚拟机，￥5000+/账号'),
        icon: 'icon-fingerprint',
      },
    ],
  },
  {
    header: $t('传统方式的致命后果'),
    items: [
      {
        title: $t('风控秒识关联，账号批量封禁'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('操作痕迹交叉，触发风控红标'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('人力成本翻倍，错失商机'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('被标记“虚假流量”，广告账户限流'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('无法规模化运营，业务停滞'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('员工误操作致全军覆没'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('店铺/广告账户永久禁用'),
        icon: 'icon-fingerprint',
      },
      {
        title: $t('成本失控，ROI为负'),
        icon: 'icon-fingerprint',
      },
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
      <div v-for="item in tableData" :key="item.header">
        <div class="header">
          {{ item.header }}
        </div>
        <div class="items">
          <div v-for="item in item.items" :key="item.title">
            {{ item.title }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.antidetect-vs-traditional-panel {
  display: flex;
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
}
</style>
