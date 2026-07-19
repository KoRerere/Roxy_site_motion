<script setup lang="ts">
useSeoMeta({
  title: $t('保障联盟营销收益安全增长 | RoxyBrowser'),
  description: $t('防封号+多账号管理+漏斗优化！通过独有浏览器指纹和地理定位工具，安全提升您的联盟营销转化率与收益。'),
})

const primaryColor = '#11A3FD'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器做全球联盟营销，赚取更多佣金'),
  desc: $t('联盟营销真正的收益来自规模。RoxyBrowser 帮你快速扩张，多账号安全运行，让你的联盟项目横跨平台与地区稳定增长。'),
  coverImage: '/use-cases/affiliate-marketing/0.png',
  primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 助你高效拓展多地区联盟营销'),
  desc: $t('无论你在跑广告、推 offer 还是运营利基网站，联盟营销的成功离不开账号稳定和快速扩展。\nRoxyBrowser 帮助联盟营销者在不被平台风控的前提下，实现更快更安全的增长。'),
  items: [
    {
      title: $t('安全运营多账号，避免账号关联'),
      desc: $t('在同一联盟平台管理多个账号，极容易被识别、封号或延迟结算。\n\nRoxyBrowser 为每个账号生成独立的浏览器环境，隔离指纹、Cookie、IP 和缓存，让你在多账号运营时不被平台追踪。'),
      image: '/use-cases/affiliate-marketing/1.png',
    },
    {
      title: $t('突破地域限制，获取更多流量'),
      desc: $t('许多转化率高的联盟 offer 都有限地区域投放。\n\nRoxyBrowser 可模拟任意国家、设备和语言环境，帮你测试本地广告、打开市场限制，获取更多转化流量。'),
      image: '/use-cases/affiliate-marketing/2.png',
      wrapperClass: 'bg-white',
    },
    {
      title: $t('绕过联盟追踪和访问限制'),
      desc: $t('做联盟竞争情报时常常被平台屏蔽或数据被污染。\n\nRoxyBrowser 模拟真实用户访问路径，让你安全访问隐藏 offer、重定向链路和漏斗页面，不被识别或拉黑。'),
      image: '/use-cases/affiliate-marketing/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff',
    },
    {
      title: $t('账号共享，高效进行团队协作'),
      desc: $t('不论你是个人扩量还是带团队协作，账号共享都是高风险操作。\n\nRoxyBrowser 支持单独配置共享环境，无需共享密码，不触发 2FA 或浏览器识别，安全高效地协同管理联盟项目。'),
      image: '/use-cases/affiliate-marketing/4.png',
      wrapperClass: 'bg-white',
    },
  ],
  primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('用 RoxyBrowser 高效赚佣金'),
  desc: $t('轻松管理多个联盟账号，避免被封号、追踪和数据异常，全面优化投放，让你的联盟收益持续提升。'),
  primaryColor,
  image: '/use-cases/affiliate-marketing/5.png',
  alt: $t('轻松管理多个联盟账号，避免被封号、追踪和数据异常，全面优化投放，让你的联盟收益持续提升。'),
}))

const faq = computed(() => ({
  title: $t('什么时候用指纹浏览器解决联盟营销中的难题？'),
  desc: $t('RoxyBrowser 为联盟营销者、团队和跨境业务量身打造，帮助你突破平台限制，安全扩展项目规模，是你在联盟行业中的秘密武器。'),
  items: [
    {
      title: $t('同一浏览器或 IP 来回切换账号，被平台识别并封号'),
      desc: $t('在同一浏览器或 IP 下频繁切换联盟账号，极易触发平台的可疑行为监测，导致强制验证或直接封号。RoxyBrowser 为每个账号生成独立浏览器指纹，让你在多个联盟网络中安全合规地操作，避免暴露风险。'),
    },
    {
      title: $t('无法准确测试 Smartlink 的地域跳转逻辑'),
      desc: $t('Smartlink 通常依赖访问者的真实地理位置判断跳转路径，普通 VPN 或代理 IP 常因识别不精准而导致测试失效。使用 RoxyBrowser，你可以模拟来自任何国家的真实用户环境，确保 Smartlink 在各地区都能正确跳转。'),
    },
    {
      title: $t('频繁进行落地页测试，数据失真影响广告效果判断'),
      desc: $t('反复测试自己的推广漏斗或落地页，容易制造虚假点击和转化，严重干扰真实数据表现。RoxyBrowser 提供干净隔离的浏览环境，让你不影响正式数据的前提下，完整还原用户访问流程。'),
    },
    {
      title: $t('平台将广告行为识别为异常，频频丢失高价值流量'),
      desc: $t('为联盟项目投放付费广告时，可能会被广告平台识别为异常行为，从而触发封号、暂停投放或追踪错误。RoxyBrowser 能为每个广告活动提供独立且稳定的浏览器指纹，确保广告平台无法将多个账户或行为关联在一起。'),
    },
  ],
}))

const whyChoose = computed(() => ({
  title: $t('为什么联盟营销选 RoxyBrowser？'),
  desc: $t('联盟营销的成功依赖于内容表现和流量质量。RoxyBrowser 帮助 CPA 营销者规避平台风控、保持环境干净、测试全球 offer，同时避免数据污染和账号关联。'),
  items: [
    {
      title: $t('彻底隔离不同项目的浏览环境'),
      desc: $t('RoxyBrowser 为每个联盟项目配置独立浏览器指纹和 Cookie，防止账号互相追踪、归因混乱或触发平台警告。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('稳定投放付费流量不被封'),
      desc: $t('无论是投放 Facebook 广告还是 Google Ads，RoxyBrowser 都能隐藏你的设备指纹和真实 IP，避免账号被限制或流量被拒。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('精准测试全球落地页和转化漏斗'),
      desc: $t('RoxyBrowser 支持模拟全球各地用户环境，预览不同地区看到的页面内容、追踪跳转路径，测试效果真实可靠。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('自动化执行联盟运营任务'),
      desc: $t('RoxyBrowser 支持与 API、Selenium、Puppeteer 等工具集成，批量执行漏斗测试、链接校验、投放检查，省时省力。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('和团队共享环境也安全'),
      desc: $t('无论是测试页面、上传素材还是监控数据，RoxyBrowser 都可安全共享配置给团队成员，无需账号密码，防止误操作或安全风险。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('高性能运行 + 数据本地加密'),
      desc: $t('不同于传统 VM 或低效的指纹工具，RoxyBrowser 运行更快，数据本地加密存储，不上传服务器，确保联盟数据私密可靠。'),
      icon: '/use-cases/security.svg',
    },
  ],
}))

const footerPanel = computed(() => ({
  title: $t('RoxyBrowser 助力你提高联盟收益'),
  desc: $t('用 RoxyBrowser 进行多账号运营、测试全球投放效果、保护账户安全，轻松扩张你的联盟营销规模！'),
  alt: $t('用 RoxyBrowser 进行多账号运营、测试全球投放效果、保护账户安全，轻松扩张你的联盟营销规模！'),
}))
</script>

<template>
  <PageUseCases :header-panel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :why-choose="whyChoose" :footer-panel="footerPanel" />
</template>
