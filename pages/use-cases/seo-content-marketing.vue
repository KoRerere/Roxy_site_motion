<template>
  <PageUseCases :headerPanel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :whyChoose="whyChoose" :footerPanel="footerPanel" />
</template>

<script setup lang="ts">
useSeoMeta({
  title: $t('掌握SEO内容营销与SERP排名 | RoxyBrowser'),
  description: $t('获取真实市场洞察，规避检测风险！RoxyBrowser助您优化SEO策略，实现可持续的有机增长，精准掌控搜索引擎结果页排名。'),
})

const primaryColor = '#11A3FD'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器做SEO，不再被搜索引擎误导'),
  desc: $t('做 SEO 优化最怕的是数据不准：IP被封、搜索结果偏差、账号被连坐。RoxyBrowser 帮你看清真实排名和数据表现，提高优化效率。'),
  coverImage: '/use-cases/seo/0.png',
  primaryColor: primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 帮你提效 SEO 优化和页面分析'),
  desc: $t('做 SEO 不能光靠经验，数据分析、账号管理、内容采集一个都不能出错。RoxyBrowser 提供全球化浏览环境，让你像本地用户一样操作搜索引擎，数据更准，分析更快，没有“数据失真”或“账号被封”的风险。'),
  items: [
    {
      title: $t('还原真实搜索排名，数据更可信'),
      desc: $t('个性化搜索会影响关键词排名判断，看到的结果常常不准。\n\nRoxyBrowser 为你创建独立浏览器环境，配合新IP，从任何目标地区获取原始、未经干扰的搜索结果，帮你掌握真正的排名情况。'),
      image: '/use-cases/seo/1.png',
    },
    {
      title: $t('轻松进行本地 SEO 审查和分析'),
      desc: $t('用一个IP看不同国家的页面，很难验证内容在各地的实际表现。\n\nRoxyBrowser 可模拟任意城市用户，从排名到页面体验，都能从“本地人”的角度去审查，让你的本地优化更有依据。'),
      image: '/use-cases/seo/2.png',
      wrapperClass: 'bg-white'
    },
    {
      title: $t('稳定抓取关键词和 SERP 数据'),
      desc: $t('关键词抓取经常被封、数据还带偏差？\n\nRoxyBrowser 利用伪装会话跨区域自动采集数据，不被检测，采到的内容干净、准确，更适合做大规模SEO分析。'),
      image: '/use-cases/seo/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff'
    },
    {
      title: $t('多账号操作，一键“防关联”'),
      desc: $t('在同一个浏览器里管理多个 SEO 工具或社媒账号，容易被平台识别串号。\n\nRoxyBrowser 给每个账号一个独立配置，任务之间完全隔离，既安全又稳定，再多账号也能放心用。'),
      image: '/use-cases/seo/4.png',
      wrapperClass: 'bg-white'
    }
  ],
  primaryColor: primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('RoxyBrowser：让 SEO 优化更高效安全'),
  desc: $t('获取更真实的数据、稳定管理多账号、保护操作环境不被干扰。\nRoxyBrowser 让专业 SEO 的每一步都更轻松、更高效。'),
  primaryColor: primaryColor,
  image: '/use-cases/seo/5.png',
  alt: $t('获取更真实的数据、稳定管理多账号、保护操作环境不被干扰。\nRoxyBrowser 让专业 SEO 的每一步都更轻松、更高效。'),
}))

const faq = computed(() => ({
  title: $t('什么时候需要指纹浏览器帮你提高SEO工作效率？'),
  desc: $t('账号被封、身份被关联、搜索结果不真实？\nRoxyBrowser 用隐身身份和精准、可扩展的搜索环境，帮你解决所有让你头疼的问题！'),
  items: [
    {
      title: $t('IP频繁被封，关键词和其他数据总是爬不下来'),
      desc: $t('爬关键词、抓搜索结果、采集竞品数据，起初一切正常，但运行一段时间后就经常出错。IP 被封、任务中断，影响整个工作节奏。\nRoxyBrowser 会自动切换浏览器指纹和代理IP，让你的请求看起来像来自不同的“真人用户”，即便是大批量抓取，也能持续稳定运行，绕开平台检测。'),
    },
    {
      title: $t('运营多个账号，因被识别成“关联/可疑”而全部被封'),
      desc: $t('你是不是试过注册几个SEO工具或社交账号，结果刚登录就被系统识别成“同一个人”，不是验证码弹不停，就是直接封号？\nRoxyBrowser 会为每个账号提供一个独立的浏览环境，就像每个账号都是在不同设备上登录的。账号之间完全隔离，不会被平台串联判断为“一个人”，运营更安心。'),
    },
    {
      title: $t('经常浏览竞品网站，结果被识别出来并被设置了反监控'),
      desc: $t('SEO人谁不关注竞品？但总是用同一个浏览器反复访问他们的网站，很容易被埋点、cookie 或第三方脚本识别出来，甚至可能被对方反监控。\nRoxyBrowser 会自动清理指纹、切换身份，还能屏蔽追踪器，让你安安静静做调研，不留痕迹、不被发现。'),
    },
    {
      title: $t('做A/B测试、页面优化，却总是无法获取准确真实的信息 '),
      desc: $t('有时候你以为页面没问题，其实用户看到的版本早就被缓存、个性化算法或历史记录干扰了。测试数据不准，决策就容易出错。\nRoxyBrowser 能模拟不同地区、不同设备的用户浏览行为，帮你从“真实用户视角”审视页面表现。无论是测试内容分发，还是转化路径体验，数据都更可靠。'),
    },
  ]
}))

const whyChoose = computed(() => ({
  title: $t('为什么 SEO 专家都在用 RoxyBrowser？'),
  desc: $t('RoxyBrowser 不只是一个浏览器，它更像是为SEO量身打造的“隐身战甲”。无论你是在做关键词调研、运营账号、还是抓取内容，它都能提供一个更灵活、安全、高效的工作环境。'),
  items: [
    {
      title: $t('独立指纹，自定义浏览器身份'),
      desc: $t('每个窗口都是一个全新用户上线。你可以自由配置IP、操作系统、分辨率、语言、字体，甚至Canvas指纹，最大限度模拟真实用户。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('管理多个账号，互不干扰'),
      desc: $t('RoxyBrowser 把每个账号都放在独立的环境里运行，像给它们一个个独立办公室，互不干扰、互不感染，极大降低被平台连坐的风险。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('支持API，自动化采集更省力'),
      desc: $t('将 RoxyBrowser 接入自己的SEO工具系统，实现自动化操作，比如定时抓关键词、查竞品、检测收录、截图报告等。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('一键同步多个浏览器窗口'),
      desc: $t('RoxyBrowser 的同步功能可以一键控制多个环境同时执行相同动作。只需设定一次，多个浏览器同步完成任务，效率翻倍。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('多人同一窗口，方便团队协作'),
      desc: $t('浏览器环境可以安全地分享给团队成员使用。多人同时使用一账号的SEO工具，不用担心会因“超出可用设备数量”而被强制登出。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('高安全、高性能、高效率'),
      desc: $t('内置的高性能引擎+智能资源隔离机制，即使长时间运行，也能保持稳定输出，不掉线、不宕机，真正实现全天候高负载作业。'),
      icon: '/use-cases/security.svg',
    },
  ]
}))

const footerPanel = computed(() => ({
  title: $t('像本地用户一样做全球SEO'),
  desc: $t('模拟任意地区和设备，查看用户真正看到的内容。适合做本地SEO、页面审查和跨地域测试。'),
  alt: $t('模拟任意地区和设备，查看用户真正看到的内容。适合做本地SEO、页面审查和跨地域测试。'),
}))
</script>