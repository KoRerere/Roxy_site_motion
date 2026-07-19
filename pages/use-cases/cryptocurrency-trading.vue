<script setup lang="ts">
useSeoMeta({
  title: $t('给加密货币交易加一层保障 | RoxyBrowser'),
  description: $t('突破平台限制，隐匿交易痕迹！通过指纹轮换和安全环境隔离，保障钱包测试/空投活动等加密操作隐私与稳定性。'),
})

const primaryColor = '#FFA057'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器，安全管理多个加密货币账户'),
  desc: $t('同时操作多个钱包与交易所账户，不再触发风控系统。RoxyBrowser 为你构建一层隐形保护，抵御中心化平台监控。'),
  coverImage: '/use-cases/crypto-trading/0.png',
  primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 保障加密货币交易的效率和安全'),
  desc: $t('从钱包管理、空投参与到多链 DApp 使用，加密操作的关键是保持隐身。\nRoxyBrowser 帮你避开平台追踪、Sybil 检测和地域限制。'),
  items: [
    {
      title: $t('设置独立指纹，安全运行多账户'),
      desc: $t('很多交易所和空投活动会限制相同设备指纹的钱包。\n\nRoxyBrowser 为每个钱包分配独立设备身份，让你安全管理数十个账户。你不再需要频繁清缓存或更换设备，大大提升管理效率。'),
      image: '/use-cases/crypto-trading/1.png',
    },
    {
      title: $t('隔离链上数据，防止信息泄露'),
      desc: $t('从换币到铸造 NFT，每个链上动作都会留下行为轨迹。\n\nRoxyBrowser 隔离 cookies、本地存储、IP 等信息，全程保护你的隐私。这让你在使用 DEX 或参与流动性池时更加安心可靠。'),
      image: '/use-cases/crypto-trading/2.png',
      wrapperClass: 'bg-white',
    },
    {
      title: $t('搭建干净环境，安全测试各种应用'),
      desc: $t('不管你是开发者还是白帽研究者，DApp 测试都需要干净环境。\n\nRoxyBrowser 支持多个链的兼容性测试、防钓鱼审核与 QA 流程。你可以灵活切换测试网络与用户身份，复现更多真实场景。'),
      image: '/use-cases/crypto-trading/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff',
    },
    {
      title: $t('自动化扩展空投与 NFT 脚本'),
      desc: $t('执行空投任务、NFT 铸造或节点参与脚本需并行操作多个会话。\n\nRoxyBrowser 允许你在隔离环境中自动化操作，不触发反机器人系统。无论是批量创建钱包还是定时触发操作，都能轻松应对。'),
      image: '/use-cases/crypto-trading/4.png',
      wrapperClass: 'bg-white',
    },
  ],
  primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('保护你的每一个加密操作环节'),
  desc: $t('无论是申领空投还是测试新钱包，RoxyBrowser 都能保障你的操作安全、顺畅进行。'),
  primaryColor,
  image: '/use-cases/crypto-trading/5.png',
  alt: $t('无论是申领空投还是测试新钱包，RoxyBrowser 都能保障你的操作安全、顺畅进行。'),
}))

const faq = computed(() => ({
  title: $t('什么时候用指纹浏览器来保护你的钱包和交易？'),
  desc: $t('空投封号、钱包测试失败、IP 异常……这些问题正在破坏你的加密工作流程。RoxyBrowser 正是你解决这些难题的隐秘利器。'),
  items: [
    {
      title: $t('用同一个IP 地址进行操作，触发中心化交易所风控'),
      desc: $t('当多个账户在同一 IP 下频繁登录，交易所容易识别为关联操作。就算账号属于不同人，也可能被误判为作弊。RoxyBrowser 提供独立代理 IP 管理与隔离环境，确保每个账户的登录行为彼此独立，避免因 IP 重叠引发平台风控误伤。'),
    },
    {
      title: $t('平台识别出多个设备指纹复用，快速关联账户'),
      desc: $t('浏览器设备指纹一旦重复，平台就能轻易识别出账户之间的技术联系。尤其是频繁操作的账户，更容易被快速标记。RoxyBrowser 支持每个账号使用独立、真实感强的浏览器指纹，大幅降低被平台建立关联的风险。'),
    },
    {
      title: $t('空投猎人行为相似，被平台取消资格'),
      desc: $t('重复注册、相似行为轨迹会被项目方识别为“刷空投”。即使只是使用了同一个浏览器环境，也可能被批量拉黑。RoxyBrowser 能为每个空投任务分配不同环境，模拟自然用户行为，帮助你安全参与多个项目，不被判定为作弊。'),
    },
    {
      title: $t('提现行为出现异常，平台快速冻结账户'),
      desc: $t('一旦新号刚注册就尝试大额提现，配合异常环境极易触发平台风控。账户不仅可能被冻结，还会失去资金。RoxyBrowser 提供接近真实用户的浏览器行为与环境，帮助你更安全地操作账户资产，降低平台审查风险。'),
    },
  ],
}))

const whyChoose = computed(() => ({
  title: $t('为什么选择 RoxyBrowser 保障加密交易'),
  desc: $t('在竞争激烈的加密环境中，普通反侦测工具无法满足需求。\nRoxyBrowser 提供交易所级隐匿、防关联的浏览环境，专为高风险操作打造。'),
  items: [
    {
      title: $t('顶级伪装能力，模拟真实交易者身份'),
      desc: $t('RoxyBrowser 伪装设备信息，轻松对抗 Binance 和 Coinbase 风控系统。这确保你的多账户操作更安全可靠。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('环境完全隔离，防止数据泄露风险'),
      desc: $t('RoxyBrowser 将交易所、DeFi 和钱包活动分开管理，杜绝 IP 和 Cookie 泄露，避免合规警示。保护你的交易行为不被平台追踪。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('自动化接口，支持多种交易脚本'),
      desc: $t('将 RoxyBrowser API 集成至交易机器人和空投脚本，结合行为模拟与 TLS 轮换，轻松规避检测。助你实现安全高效的自动化操作。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('智能养号流程，构建合规账户历史'),
      desc: $t('RoxyBrowser 模拟真实用户行为，逐步入金与随机交易，降低新账户被冻结的风险。为你的账户建立可信赖的使用记录。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('运行速度快，抢先执行关键交易'),
      desc: $t('在比特币闪崩时，RoxyBrowser 迅速执行止损和套利，避免延迟导致的资金损失。让你在关键时刻赢得先机。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('团队安全访问，满足合规审计'),
      desc: $t('支持机构账户权限配置，防止内部泄密，适用于管理 Fireblocks 等高安全钱包。保障团队协作安全无忧。'),
      icon: '/use-cases/security.svg',
    },
  ],
}))

const footerPanel = computed(() => ({
  title: $t('一个浏览器，满足所有 Web3 操作'),
  desc: $t('无论是开发、推广、测试还是增长，RoxyBrowser 都能适应你的 Web3 需求，保护你不被暴露。'),
  alt: $t('无论是开发、推广、测试还是增长，RoxyBrowser 都能适应你的 Web3 需求，保护你不被暴露。'),
}))
</script>

<template>
  <PageUseCases :header-panel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :why-choose="whyChoose" :footer-panel="footerPanel" />
</template>
