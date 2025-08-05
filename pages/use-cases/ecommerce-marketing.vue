<template>
  <PageUseCases :headerPanel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :whyChoose="whyChoose" :footerPanel="footerPanel" />
</template>

<script setup lang="ts">
useSeoMeta({
  title: $t('全平台进行高效的电商营销 | RoxyBrowser'),
  description: $t('隐私保护+高速运行+平台稳定性！为电商卖家打造的浏览器工具，助力智能、安全、高效的跨平台店铺运营。'),
})

const primaryColor = '#AA7EFF'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器，全面提升电商店铺管理效率'),
  desc: $t('RoxyBrowser 专为电商从业者打造，让你安全管理多个店铺、监控竞品动向、测试本地化投放效果，不怕被平台识别。'),
  coverImage: '/use-cases/e-commerce-marketing/0.png',
  primaryColor: primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 保证电商运营效率和账户安全'),
  desc: $t('无论你是管理多个店铺、还是针对不同市场优化运营策略，安全与效率都是关键。\nRoxyBrowser 为电商从业者提供一个更安全、专业的浏览环境，支持测试、分析和多平台运营。'),
  items: [
    {
      title: $t('多账号安全运行，不担心关联封号'),
      desc: $t('像 Amazon、Etsy、eBay 等平台通常禁止同一人运营多个卖家账号，违规可能被永久封禁。\n\nRoxyBrowser 为每个账号创建独立浏览环境，隔离指纹、Cookies、缓存数据，让你在同一设备上安全管理多个店铺，不被平台追踪。'),
      image: '/use-cases/e-commerce-marketing/1.png',
    },
    {
      title: $t('精准测试本地化店铺和广告'),
      desc: $t('想要出海做跨境电商？\n\nRoxyBrowser 可模拟不同国家的语言、设备、IP 和时区，让你真实还原当地买家的访问体验，验证价格显示、结算流程、广告投放是否符合预期，避免数据偏差。'),
      image: '/use-cases/e-commerce-marketing/2.png',
      wrapperClass: 'bg-white'
    },
    {
      title: $t('自动化监控价格与竞品动态'),
      desc: $t('在电商竞争中，掌握对手价格变动和上架节奏尤为重要。\n\nRoxyBrowser 支持接入 Puppeteer、Selenium 等自动化工具，稳定运行采集脚本，不易被封，让你第一时间掌握市场动态。'),
      image: '/use-cases/e-commerce-marketing/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff'
    },
    {
      title: $t('安全分析竞品页面，避免被追踪'),
      desc: $t('频繁查看竞品店铺不仅可能影响对方数据，还可能被平台标记。\n\nRoxyBrowser 隐藏指纹、模拟真实用户行为，让你安心访问 Amazon、AliExpress、Shopify 等平台，研究竞品策略而不被识别。'),
      image: '/use-cases/e-commerce-marketing/4.png',
      wrapperClass: 'bg-white'
    }
  ],
  primaryColor: primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('全方位提升你的电商运营效率'),
  desc: $t('从账号安全到自动化情报采集，RoxyBrowser 为你的电商业务提供所需的保护与灵活性，助力稳健增长。'),
  primaryColor: primaryColor,
  image: '/use-cases/e-commerce-marketing/5.png',
  alt: $t('从账号安全到自动化情报采集，RoxyBrowser 为你的电商业务提供所需的保护与灵活性，助力稳健增长。'),
}))

const faq = computed(() => ({
  title: $t('什么时候指纹浏览器是电商团队的重要帮手？'),
  desc: $t('账号关联封禁和浏览器环境偏差会严重影响电商发展。RoxyBrowser 提供安全隔离环境，支持精准区域模拟，助你放心拓展业务。'),
  items: [
    {
      title: $t('一个店铺账号被封，其他关联账号也跟着受到影响'),
      desc: $t('有些卖家管理两个或多个亚马逊店铺时，常因浏览器指纹或IP地址关联，被平台一夜之间全部封禁。避免使用共享设备数据是防止连锁封号的关键。RoxyBrowser 为每个账号创建完全独立的浏览器环境，配备独特的Cookies和IP，确保账号互不关联，安全独立运营。'),
    },
    {
      title: $t('做支付流程测试，却因为重复次数太多而被风控拦截'),
      desc: $t('在同一浏览器反复测试 Stripe 或 PayPal 结算流程，容易触发反欺诈警报，影响测试质量。\n为避免误判，每次测试都需使用独立浏览器实例。RoxyBrowser 提供干净、无共享缓存的会话，保证支付测试顺畅可信。'),
    },
    {
      title: $t('本地化广告的预览效果和当地用户看到的不一致'),
      desc: $t('仅靠 VPN 无法完全模拟真实的广告个性化投放，导致亚马逊、eBay 广告预览结果不准确。\n准确的广告优化需要模拟真实设备和用户身份。RoxyBrowser 模拟真实指纹和地理位置，呈现更贴近用户的本地化广告预览，助力精准投放。'),
    },
    {
      title: $t('做商品调研的时候，总被个性化数据干扰'),
      desc: $t('浏览历史和追踪器会影响亚马逊、AliExpress等平台的商品搜索结果，掩盖真实市场趋势。\n要获得客观中立的产品调研数据，必须使用干净环境。RoxyBrowser 启动全新会话，无Cookies和追踪器，确保每次调研数据都真实可靠。'),
    },
  ]
}))

const whyChoose = computed(() => ({
  title: $t('为什么电商从业者都在用 RoxyBrowser？'),
  desc: $t('RoxyBrowser 基于真实 Chrome 引擎，支持独立登录和干净数据，适配 Amazon、Shopify、AliExpress 等平台，登录顺畅无报错。'),
  items: [
    {
      title: $t('为电商工作流程量身打造'),
      desc: $t('RoxyBrowser 运行真正的 Chrome 浏览器，使用干净的浏览器配置文件，在 Amazon、Shopify 或任何电商平台上都不会遇到登录问题或兼容性 Bug。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('防止账号关联与封禁'),
      desc: $t('每个卖家账号都完全隔离，使用独立的浏览器指纹和干净的会话环境，有效避免平台检测和封号风险。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('支持将电商任务自动化'),
      desc: $t('支持 Puppeteer 和 Selenium 等自动化工具，稳定执行批量采集、商品编辑、价格监控等任务，轻松提升运营效率。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('精准测试不同地区店铺体验'),
      desc: $t('灵活切换地理位置、语言和设备类型，优化价格、广告投放和结账流程，适配全球市场用户的真实体验。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('团队共同管理，多人协作更安全'),
      desc: $t('支持安全共享浏览器配置文件，团队成员无需重复登录即可管理订单和商品，避免触发 2FA 或平台安全验证。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('高性能与数据安全兼得'),
      desc: $t('RoxyBrowser 高性能引擎支持同时管理数十个店铺账号，依然流畅稳定，适合批量运营和矩阵布局。数据本地存储，隐私安全可控。'),
      icon: '/use-cases/security.svg',
    },
  ]
}))

const footerPanel = computed(() => ({
  title: $t('突破传统浏览器限制，释放电商增长潜力。'),
  desc: $t('用 RoxyBrowser 安全高效地运营店铺、测试市场、超越对手，助你轻松驾驭跨境电商挑战。'),
  alt: $t('用 RoxyBrowser 安全高效地运营店铺、测试市场、超越对手，助你轻松驾驭跨境电商挑战。'),
}))
</script>   