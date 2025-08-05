<template>
  <PageUseCases :headerPanel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :whyChoose="whyChoose" :footerPanel="footerPanel" />
</template>

<script setup lang="ts">
useSeoMeta({
  title: $t('安全扩展社交媒体营销规模 | RoxyBrowser'),
  description: $t('多账号零封禁风险！专为SMM团队设计的防检测浏览器，支持跨平台自动化协作与批量运营，实现安全规模增长。'),
})

const primaryColor = '#FFA057'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器，安全高效扩大社媒营销影响力'),
  desc: $t('RoxyBrowser 让社交媒体营销团队轻松管理多个账号、自动化执行任务，不被平台风控系统识别。\n不管你是做广告投放、私信拓客，还是增长运营，都能安全扩量、不留痕迹。'),
  coverImage: '/use-cases/social-media-marketing/0.png',
  primaryColor: primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 帮运营人员更安全地做社媒营销'),
  desc: $t('在 Facebook、Instagram、LinkedIn 等平台上做营销，多账号安全和“拟人化”操作是关键。\nRoxyBrowser 让你像真实用户一样运行每个账号，避免风控，一路扩量无阻。'),
  items: [
    {
      title: $t('安全管理多个社媒账号'),
      desc: $t('每个账号都在独立浏览器环境中运行，配有独立指纹、cookie 和代理设置。\n\n不论你运营 10 个还是 1000 个账号，RoxyBrowser 都能让它们互不关联，不被平台串号识别。'),
      image: '/use-cases/social-media-marketing/1.png',
    },
    {
      title: $t('每个账号都是一个“真实用户”'),
      desc: $t('你可以自定义浏览器指纹、时区、系统设置等，加上住宅或移动代理，模拟真实设备访问社交平台。\n\n每个账号都具备完整“人设”，不再轻易被平台判定为机器操作。'),
      image: '/use-cases/social-media-marketing/2.png',
      wrapperClass: 'bg-white'
    },
    {
      title: $t('跨地区运营，轻松做本地化'),
      desc: $t('扩展到新市场，需要切换不同 IP、时区和语言环境？RoxyBrowser 支持模拟全球任意地区的访问环境，\n\n帮你运营本地账号、测试内容投放，而不会触发平台的地理风控。'),
      image: '/use-cases/social-media-marketing/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff'
    },
    {
      title: $t('自动化执行，不担心被封号 '),
      desc: $t('发帖、点赞、数据抓取这些重复动作，不用再手动做。\n\nRoxyBrowser 支持 Puppeteer、Selenium 等自动化工具，让你一边扩量，一边保持“真人”行为轨迹，降低封号风险。'),
      image: '/use-cases/social-media-marketing/4.png',
      wrapperClass: 'bg-white'
    }
  ],
  primaryColor: primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('高效扩展社交媒体营销，从 RoxyBrowser 开始'),
  desc: $t('启动投放、管理账号、扩大受众，全都更轻松。\nRoxyBrowser 给你的营销团队提供安全、干净的操作环境，放心跑量，不被平台干扰。'),
  primaryColor: primaryColor,
  image: '/use-cases/social-media-marketing/5.png',
  alt: $t('启动投放、管理账号、扩大受众，全都更轻松。\nRoxyBrowser 给你的营销团队提供安全、干净的操作环境，放心跑量，不被平台干扰。'),
}))

const faq = computed(() => ({
  title: $t('什么时候指纹浏览器是社交媒体运营的“刚需”？'),
  desc: $t('频繁更换 IP？总是登录失败？账号被误封？这些问题一再影响投放和增长节奏。\n用 RoxyBrowser，彻底解决这些痛点。'),
  items: [
    {
      title: $t('一个社媒账号被封，其他关联账号也跟着受到影响'),
      desc: $t('社媒平台（像 Meta、TikTok）会用设备指纹识别账号之间的关联。一旦其中一个账号被封，其它关联的主页、广告账户甚至运营账号也可能中招。RoxyBrowser 通过指纹伪装和环境隔离，确保每个账号都在独立空间中运行，互不干扰，最大程度降低封号连坐的风险。'),
    },
    {
      title: $t('批量互动做增长，却被平台识别为“刷量”？'),
      desc: $t('点赞、评论、关注是运营中常见的增长策略，但一旦批量操作不自然，很容易被平台识别为刷量。RoxyBrowser 支持行为模拟，让账号行为看起来更像真人操作，有助于提升权重、建立“社会认同”信号，而不被误判为违规。'),
    },
    {
      title: $t('想测试本地化内容，却看不到当地用户视角？'),
      desc: $t('不同地区的社交内容展示不一样。RoxyBrowser 支持精准代理+设备指纹模拟，真实还原特定国家或地区的用户浏览体验，帮助你验证内容本地化是否到位，让 A/B 测试更贴近真实用户行为。'),
    },
    {
      title: $t('一个账号多人用，协作方便但容易触发风控？ '),
      desc: $t('团队成员共同运营一个账号，频繁更换 IP 和设备，很容易被平台当成“异常登录”。RoxyBrowser 提供浏览器环境共享功能，同一个账号环境可以多人协作、权限分明，不易被风控识别，大大降低封号风险。'),
    },
  ]
}))

const whyChoose = computed(() => ({
  title: $t('为什么社媒营销人都在用 RoxyBrowser？'),
  desc: $t('管理多个社交账号常常面临封号和延迟风险。RoxyBrowser 通过模拟真实用户行为，并为每个账号提供独立环境，保障操作安全，助你高效扩展全球营销。'),
  items: [
    {
      title: $t('创建更像“真人”的社媒账号'),
      desc: $t('平台识别机器人愈发智能，RoxyBrowser 支持定制浏览器指纹和设备参数，生成更真实的账号行为，降低被识别风险。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('多账号隔离运行，防止关联封号'),
      desc: $t('同一设备频繁切换账号容易触发风控。RoxyBrowser 为每个账号建立独立环境，有效防止 Facebook、Instagram 等平台的账号关联。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('支持自动化操作，省力又高效'),
      desc: $t('RoxyBrowser 内置完整 API，可配合自动化工具实现建号、发帖、互动、数据采集等操作，在保持“真人”行为模式的前提下，高效拓展账号矩阵。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('模拟真实地区访问，提升本地化效果'),
      desc: $t('不同地区所呈现出来的内容会有差异。RoxyBrowser 可设定 IP 和设备环境，真实预览目标用户所见内容，优化社媒投放策略。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('多人协作共享账号，不触发风控'),
      desc: $t('一个账号多人使用容易触发平台风控。RoxyBrowser 支持环境共享机制，团队成员可在一致的浏览器配置下访问账号，降低风控风险，提升协作效率。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('流畅运行多账号，适合矩阵增长'),
      desc: $t('无论是几十个账号还是上百个账号同时在线，RoxyBrowser 都能保持稳定、高性能运行，适合做规模化社媒矩阵、裂变增长与全渠道投放。'),
      icon: '/use-cases/security.svg',
    },
  ]
}))

const footerPanel = computed(() => ({
  title: $t('从今天开始，提升社媒运营的效率和安全性'),
  desc: $t('从发帖排程、广告测试到账号管理，一站式完成。\n用 RoxyBrowser，打造安全、高效、可扩展的社交媒体运营体系。'),
  alt: $t('从发帖排程、广告测试到账号管理，一站式完成。\n用 RoxyBrowser，打造安全、高效、可扩展的社交媒体运营体系。')
}))
</script>