<template>
  <PageUseCases :headerPanel="headerPanel" :introduce="introduce" :introduce2="introduce2" :faq="faq" :whyChoose="whyChoose" :footerPanel="footerPanel" />
</template>

<script setup lang="ts">
useSeoMeta({
  title: $t('大规模进行安全高效网络爬虫 | RoxyBrowser'),
  description: $t('模拟真实用户行为，智能轮换浏览器指纹！确保大规模数据抓取任务持续稳定运行，有效规避反爬机制封锁。'),
})

const primaryColor = '#5DC672'

const headerPanel = computed(() => ({
  title: $t('用指纹浏览器扩展数据抓取规模，高效安全'),
  desc: $t('无需担心封号或被封锁，RoxyBrowser 让你像真实用户一样抓取数据，并支持全流程自动化。'),
  coverImage: '/use-cases/web-scraping/0.png',
  primaryColor: primaryColor,
}))

const introduce = computed(() => ({
  title: $t('RoxyBrowser 赋能大规模、安全稳定的数据抓取'),
  desc: $t('无论是产品数据、价格监测、SEO 研究还是竞品追踪，抓取的关键在于隐匿操作\nRoxyBrowser 为抓取者提供更快、更智能的跨平台工具。'),
  items: [
    {
      title: $t('避开网站的机器人识别系统'),
      desc: $t('网站会检测用户指纹信息，比如 user agent、字体、Canvas、WebGL、时区等。\n\nRoxyBrowser 精准伪装这些参数，让每一次访问看起来都像真实用户。'),
      image: '/use-cases/web-scraping/1.png',
    },
    {
      title: $t('轻松安全地轮换浏览器身份'),
      desc: $t('通过为每个浏览器配置唯一身份，避免账号被封。\n\nRoxyBrowser 为每个抓取环境分配不同的 IP、Cookies 和设备指纹，适合进行大规模的数据抓取行为。'),
      image: '/use-cases/web-scraping/2.png',
      wrapperClass: 'bg-white'
    },
    {
      title: $t('模拟真实用户浏览器行为'),
      desc: $t('与基础脚本不同，RoxyBrowser 支持完整、启用 JavaScript 的浏览体验，可通过行为校验，访问动态页面和反爬机制后的内容。'),
      image: '/use-cases/web-scraping/3.png',
      wrapperClass: 'bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]',
      textColor: '#fff'
    },
    {
      title: $t('全新浏览器指纹，突破抓取限制'),
      desc: $t('即便使用相同 IP，重复模式也容易被识别。\n\nRoxyBrowser 将每个代理配对一个全新的浏览器指纹，降低风险，提升数据吞吐效率。'),
      image: '/use-cases/web-scraping/4.png',
      wrapperClass: 'bg-white'
    }
  ],
  primaryColor: primaryColor,
}))

const introduce2 = computed(() => ({
  title: $t('让大规模的数据抓取更高效、更安全 '),
  desc: $t('通过 RoxyBrowser 高效抓取干净可靠的数据。不被封、不被拦，只收获结果。'),
  primaryColor: primaryColor,
  image: '/use-cases/web-scraping/5.png',
  alt: $t('通过 RoxyBrowser 高效抓取干净可靠的数据。不被封、不被拦，只收获结果。'),
}))

const faq = computed(() => ({
  title: $t('什么时候用指纹浏览器保证大规模获取数据的进程？'),
  desc: $t('常规抓取工具能提取数据，却无法做到真正隐藏自己。没有像 RoxyBrowser 这样的隐形保护层，你的抓取工作很容易被封、被限或失败。'),
  items: [
    {
      title: $t('用同一IP提交了几次请求，结果被限制访问或直接封禁'),
      desc: $t('大多数网站都不喜欢你用同一个 IP 反复抓取，轻则限速，重则直接封掉。如果你的工具不支持代理轮换和指纹伪装，几次请求就会被盯上。RoxyBrowser 每次抓取都用不同代理和浏览器身份，持续稳定不掉线。'),
    },
    {
      title: $t('设备指纹太相似，导致平台快速关联账户并封号'),
      desc: $t('如果使用相同的浏览器配置运行多个爬虫，会留下明显的行为模式，平台很快就能识别出来，从而导致账号被限流甚至 IP 被拉黑。RoxyBrowser 每次会话都会随机化关键浏览器标识，确保你的操作在每次爬取中都保持匿名且无法关联。'),
    },
    {
      title: $t('明明用了 VPN，但还是访问不了部分国外页面'),
      desc: $t('仅靠 VPN 抓取受地理限制的页面或本地化优惠往往无法成功。网站会检测你完整的访问环境，而不仅是 IP 地址。RoxyBrowser 通过调整设备语言、时区和系统设置，让你模拟任何国家的真实用户，从而稳定获取区域数据。'),
    },
    {
      title: $t('已经用了共享或公共代理，但仍然暴露身份 '),
      desc: $t('即使使用轮换代理，如果浏览器指纹没有变化，也可能暴露你的真实访问会话。网站会忽略 IP，直接识别出重复的环境。RoxyBrowser 每次都会为代理分配一个全新指纹和干净的浏览器实例，实现全方位隐身操作。'),
    },
  ]
}))

const whyChoose = computed(() => ({
  title: $t('为什么选 RoxyBrowser 提高爬虫安全性'),
  desc: $t('想要稳定、大规模地提取可靠数据，隐蔽性和稳定性缺一不可。RoxyBrowser 为专业爬虫操作提供双重保障。'),
  items: [
    {
      title: $t('伪装真实浏览器指纹'),
      desc: $t('可自定义 WebGL、时区、字体、Canvas 等核心指纹参数，使每个自动化会话看起来都像真人操作，避免因指纹重复而被目标网站识别和封禁。'),
      icon: '/use-cases/fingerprint.svg',
    },
    {
      title: $t('运行隔离的网页爬虫会话'),
      desc: $t('每个浏览器配置文件都拥有独立的指纹、缓存和 Cookie 环境，确保不同任务之间互不干扰，避免数据交叉污染和被平台批量识别。'),
      icon: '/use-cases/profile.svg',
    },
    {
      title: $t('兼容主流爬虫框架自动化'),
      desc: $t('RoxyBrowser 原生支持 Puppeteer、Selenium、Playwright，运行带界面的浏览器环境，有效突破 JS 限制，提升数据提取成功率。'),
      icon: '/use-cases/api.svg',
    },
    {
      title: $t('抓取全球地区定向内容'),
      desc: $t('可模拟不同国家和地区的用户设置，如语言、IP、时区，轻松解锁被地理限制的网页内容，获取本地化数据资源。'),
      icon: '/use-cases/sync.svg',
    },
    {
      title: $t('协作完成大规模爬虫项目'),
      desc: $t('支持团队安全共享浏览器配置，无需共享账号密码，也不会触发二次验证，适合多人协同执行批量数据采集任务。'),
      icon: '/use-cases/team.svg',
    },
    {
      title: $t('无需虚拟机也能保持高隐匿性'),
      desc: $t('无需部署资源消耗大的虚拟机，RoxyBrowser 本地运行即可提供高匿名性和稳定性，适用于高频率的数据抓取任务。'),
      icon: '/use-cases/security.svg',
    },
  ]
}))

const footerPanel = computed(() => ({
  title: $t('立即尝试 RoxyBrowser，安全抓取无忧'),
  desc: $t('无风险开始抓取，无需担心封号或拦截。\nRoxyBrowser 让你轻松扩展抓取任务，获取干净数据。'),
  alt: $t('无风险开始抓取，无需担心封号或拦截。\nRoxyBrowser 让你轻松扩展抓取任务，获取干净数据。'),
}))
</script>