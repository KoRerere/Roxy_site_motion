<script setup lang="ts">
useSeoMeta({
  title: $t('智能管理PPC与SEM广告活动 | RoxyBrowser'),
  description: $t('最大化付费广告ROI！通过广告验证、竞争对手分析和安全多账号管理，RoxyBrowser让您的搜索广告投放更精准高效。'),
})

const primaryColor = '#5DC672'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器，稳定提升付费广告投放效率'),
  desc: $t('指纹浏览器为广告投手打造隔离、安全的测试环境，避免账户被封、数据异常，让广告更高效、更可控。'),
  coverImage: '/use-cases/sem-ppc/0.png',
  primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 助力团队高效进行付费广告投放'),
  desc: $t('想测广告效果、跨地区验证落地页，又担心账号被封、数据失真？\nRoxyBrowser 提供真实用户环境模拟，帮你规避风险、放大效果，安心跑量。'),
  items: [
    {
      title: $t('真用户视角，更准确验证落地页'),
      desc: $t('广告预览常常和实际展示不一致？\n\n用 RoxyBrowser 模拟不同地区、设备的真实用户访问，精准确认广告位、落地页、跳转路径是否正常。'),
      image: '/use-cases/sem-ppc/1.png',
    },
    {
      title: $t('多账户投放，一键“防关联”'),
      desc: $t('一个电脑管多个广告账户，最怕被平台识别成同一个人。\n\nRoxyBrowser 为每个账户生成独立的浏览环境，安全隔离数据，保护每个账号不被关联。'),
      image: '/use-cases/sem-ppc/2.png',
      wrapperClass: 'bg-white',
    },
    {
      title: $t('跨区域投放，轻松验证本地效果'),
      desc: $t('投放全球市场，想知道不同国家/城市是否真看到广告？\n\nRoxyBrowser 通过代理 IP 模拟任意地理位置，帮你从“当地用户”的视角确认投放效果。'),
      image: '/use-cases/sem-ppc/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff',
    },
    {
      title: $t('悄悄查看竞品广告，不被察觉'),
      desc: $t('频繁查看竞争对手广告，容易被追踪、触发限制？\n\nRoxyBrowser 让你匿名访问广告内容、落地页和漏斗流程，像隐身一样做竞品调研。'),
      image: '/use-cases/sem-ppc/4.png',
      wrapperClass: 'bg-white',
    },
  ],
  primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('用 RoxyBrowser，跑广告更高效'),
  desc: $t('测试创意、切换地区、管理多个账户，全部在独立干净的浏览器环境中完成。为投手量身打造的专属浏览器，效率、安全两不误。'),
  primaryColor,
  image: '/use-cases/sem-ppc/5.png',
  alt: $t('测试创意、切换地区、管理多个账户，全部在独立干净的浏览器环境中完成。为投手量身打造的专属浏览器，效率、安全两不误。'),
}))

const faq = computed(() => ({
  title: $t('什么时候需要指纹浏览器来助力团队进行广告投放？'),
  desc: $t('PPC 投放总是被这些问题困扰？RoxyBrowser 提供干净稳定的环境，保障追踪准确、测试可靠、账户安全，助你高效放量。'),
  items: [
    {
      title: $t('该展示出广告的位置没有显示出来，或加载错误'),
      desc: $t('有时候你明明设置了地区定向，但某些地区的广告就是不展示，或者落地页加载异常。可能不是你设置错了，而是广告平台那边出了小状况。用 RoxyBrowser 模拟当地用户的浏览环境，就能像客户一样真实访问广告，帮你确认投放设置到底有没有问题。'),
    },
    {
      title: $t('需要同时注册或管理多个广告账号，但担心被封号'),
      desc: $t('一个人管多个账号是很多广告投手的日常，但平台很容易怀疑你在“违规操作”，轻则提醒，重则封号连坐。RoxyBrowser 可以为每个账号创建独立干净的浏览环境，就像是多个不同设备、不同人操作一样，大大降低风控风险，让你安心多号管理。'),
    },
    {
      title: $t('总是收到“账号异常”等提醒，甚至被判定为机器人'),
      desc: $t('是不是经常切换账号、频繁登录不同国家的后台，结果不断收到系统提醒“你有异常登录”？这些行为很容易被平台判定为非正常操作。RoxyBrowser 会固定每个账号的使用环境，包括 IP、浏览器信息等，帮你避开这些“红线”，保持操作自然真实。'),
    },
    {
      title: $t('想验证某一地区定向广告在目标市场是否真的命中'),
      desc: $t('你人可能在国内或海外总部，但广告要打到日本、澳洲或东南亚市场，怎么确认当地人能看到？RoxyBrowser 能模拟真实的当地用户，从设备、语言、IP 到地理位置，真实还原用户体验，让你在办公室就能测试目标市场的广告投放情况。'),
    },
  ],
}))

const whyChoose = computed(() => ({
  title: $t('为什么广告投手都在用 RoxyBrowser？'),
  desc: $t('付费投放靠数据说话，环境一乱，再好的策略都白搭。RoxyBrowser 保证你的测试稳定、追踪准确，不让广告投入打水漂。'),
  items: [
    {
      title: $t('模拟真实用户，测试广告更精准'),
      desc: $t('自定义设备、IP 和指纹信息，不只是伪装浏览器，而是真实还原用户访问广告和落地页的行为，确保你的广告命中了正确人群。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('安全管理多个账户，不怕连坐风控 '),
      desc: $t('每个账户都运行在独立的浏览环境中，像多个设备一样互不干扰，账号之间不会“串联”被识别，避免被平台误封或限制。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('API 自动化执行日常任务，效率更高'),
      desc: $t('通过 API 与自动化工具（如 Selenium、Puppeteer）配合，可以批量打开页面、抓取展示效果、截图分析广告落地页，节省大量人工测试时间。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('精准验证地区定向广告的展示效果'),
      desc: $t('投放多个国家和地区的广告，能模拟目标市场的本地用户，实测广告是否如预期展示，是否按设定精准命中受众。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('浏览器环境可共享，团队协作更顺畅'),
      desc: $t('可将配置好的浏览器环境安全分享给团队成员，大家可以同步查看广告展示、测试新素材、分析落地页，团队效率提升一大截。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('高性能浏览体验，不卡顿不掉线'),
      desc: $t('无论你同时开几个窗口，RoxyBrowser 都能稳定运行，不卡顿、不掉线，适合同时进行 A/B 测试、素材审查、账户检查等密集操作。'),
      icon: '/use-cases/security.svg',
    },
  ],
}))

const footerPanel = computed(() => ({
  title: $t('提升广告投放效率，从 RoxyBrowser 开始'),
  desc: $t('精准测试、账号安全、操作高效，一切都在你的掌控之中。'),
  alt: $t('精准测试、账号安全、操作高效，一切都在你的掌控之中。'),
}))
</script>

<template>
  <PageUseCases :header-panel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :why-choose="whyChoose" :footer-panel="footerPanel" />
</template>
