<script setup lang="tsx">
import { RxIcon } from '@/components/rx-icon'
import FaqAccordion from '~/components/faq-accordion.vue'
import HeroBanner from './hero-banner.vue'

interface SearchResultItem {
  title: string
  desc: string
  id?: string
}

const { locale } = useRxI18n()

const faqCategories = computed(() => [
  {
    title: $t('基础知识'),
    key: 'basic-concept',
    list: [
      {
        title: $t('什么是 RoxyBrowser？'),
        desc: $t(`RoxyBrowser 是一款指纹浏览器（也叫反检测浏览器），它可以隐藏或控制你电脑独有的浏览指纹。
一般网站会通过设备类型、操作系统、字体、时区、显卡等隐形数据来追踪用户。而 RoxyBrowser 允许你管理这些信息，让每个浏览器“配置文件”都像是独立的设备。这样，你不仅可以进行多账号管理，还能保护你的真实信息，不被各大平台追踪或封禁。`),
      },
      {
        title: $t('RoxyBrowser 指纹浏览器和普通浏览器有什么不同？'),
        desc: $t(`和 Chrome、Firefox 或 Safari 等普通浏览器不同，指纹浏览器不仅仅是用来浏览网页，它还能控制你设备在网站面前展示的各种技术细节。
比如，你可以修改 User Agent、WebGL 参数、Canvas 指纹、屏幕分辨率等。
这样，每一个浏览器配置文件在网站看来都像是完全不同的设备。普通浏览器会暴露你的真实环境，而指纹浏览器能有效帮助你降低被识别、追踪甚至封禁的风险。`),
      },
      {
        title: $t('为什么要用指纹浏览器？'),
        desc: $t(`大多数人用指纹浏览器是为了管理多个账号，因为很多平台限制一个设备或一个 IP 只能有一个账号。
例如：
广告营销人员用它跑多个广告账户
电商卖家管理多个店铺
社媒运营同时登录客户账号
除此之外，也有人单纯是为了提高隐私，避免被广告商和网站追踪。`),
      },
      {
        title: $t('指纹浏览器可以隐藏哪些信息？'),
        desc: $t(`指纹浏览器能隐藏很多网站用来识别你的数据，包括：操作系统、浏览器版本、时区、字体、语言、WebGL、Canvas 渲染等等。
再配合代理 IP，就能同时隐藏你的真实 IP 地址。
这样，你可以伪装成不同的设备和用户，比起普通浏览器的“无痕模式”或清理 cookies 要强大得多。`),
      },
      {
        title: $t('使用指纹浏览器合法吗？'),
        desc: $t(`合法的，就像 VPN 改变你的 IP 一样，RoxyBrowser 只是修改你的浏览环境，本身并不违法。
关键在于用途：
合法的用途：电商多店铺管理、广告投放、账号运营
违法的用途：虚假身份、诈骗等，就可能触犯法律或平台规则
所以，把它当作一个隐私工具，合理使用就没问题。`),
      },
      {
        title: $t('Roxybrowser 会收集我的人脸识别数据或生物特征吗？'),
        desc: $t('我们非常尊重您的隐私。Roxybrowser 的服务架构不需要、也不会收集、存储或处理您的任何面部图像、指纹或其他生物识别数据。'),
      },
      {
        title: $t('注册或使用服务时，是否强制要求进行人脸验证（刷脸）？'),
        desc: $t('不需要。 我们不强制要求任何形式的生物识别验证。您只需通过邮箱/手机号和密码即可完成注册和登录。为了提高账户安全性，我们建议您开启 2FA（双重身份验证，如 Google Authenticator），但这完全由您自行决定。'),
      },
    ],
  },
  {
    title: $t('操作问题'),
    key: 'how-it-helps',
    list: [
      {
        title: $t('RoxyBrowser 指纹浏览器支持哪些系统？'),
        desc: $t('RoxyBrowser 现已全面支持 Windows、macOS 和 Linux，让用户跨平台无缝协作，实时同步环境与数据。结合精细化的权限分配机制，保障核心资产安全。'),
      },
      {
        title: $t('怎样创建多个“虚拟身份”？'),
        desc: $t(`下载 RoxyBrowser，注册账号后就能新建配置文件。新用户可以<span class="font-bold">免费获取 5 个配置文件</span>。
每个配置文件都有独立的指纹、cookies、本地存储和代理 IP 设置。
在网站看来，它们就是完全不同的设备，你可以同时管理多个账号而不会互相影响。
此外，你还能复制和自定义配置文件，以此来提高办公效率。`),
      },
      {
        title: $t('我能同时管理多个社媒账号或电商账号吗？'),
        desc: $t(`当然可以，这也是很多人选择它的主要原因。
电商卖家可以同时管理多个亚马逊、eBay 店铺，运营人员可以同时跑几十个 Facebook 广告账号，等等。
每个账号都有独立的虚拟配置文件和代理 IP，看起来完全无关，即使都在同一台电脑上操作，也不会被平台轻易识别。`),
      },
      {
        title: $t('RoxyBrowser 指纹浏览器会自动更改 IP 吗？'),
        desc: $t(`浏览器本身不会自动换 IP，但它可以和代理 IP 结合使用。
你可以为每个配置文件绑定不同的代理 IP，看起来就像在不同城市或国家上网。另外，它支持 自动轮换 IP，对爬虫、广告监测或大规模账号管理特别有用。`),
      },
      {
        title: $t('RoxyBrowser 是否支持团队协作？'),
        desc: $t(`RoxyBrowser 有专门的团队功能，可以安全共享配置文件，设置权限，还能云端同步。非常适合营销团队、联盟推广团队和跨国电商公司，让多人协作更安全高效，不会触发平台风控。`),
      },
      {
        title: $t('指纹浏览器能完全防止被网络追踪吗？'),
        desc: $t(`指纹浏览器能大幅降低被追踪的概率，因为它会隐藏指纹、隔离账号。广告商、网站分析工具就很难把你的行为关联起来。
但是，仅仅使用指纹浏览器并不能 100% 防止被追踪，最好的方式是配合代理 IP 一起使用，这样隐私和账号安全效果最好。

现在下载 RoxyBrowser 即赠送 7 天免费试用的代理 IP，一键完成配置！`),
      },
      {
        title: $t('使用指纹浏览器能不能保证我完全不被封号？'),
        desc: $t(`不能保证 100% 不被封，因为平台还会监控用户行为、交易方式等，光靠改指纹不可能完全避免风控。
但 RoxyBrowser 可以减少“技术层面”的风险。如果再加上正常的操作习惯和代理 IP 管理，账号存活率会大幅提升。`),
      },
      {
        title: $t('开多个配置文件会拖慢电脑运行速度吗？'),
        desc: $t(`性能取决于你的电脑配置，以及同时运行的配置文件数量。
RoxyBrowser 已针对窗口多开做了优化，但每个虚拟环境都会占用内存和 CPU。
如果一次开上百个配置文件，可能需要性能强劲的电脑；如果只是小规模使用（几十个以内），一般的笔记本或台式机都能轻松应付。`),
      },
    ],
  },
  {
    title: $t('高级功能'),
    key: 'more-advanced-functions',
    list: [
      {
        title: $t('我能不能自定义浏览器的指纹参数？'),
        desc: $t(`可以，对电脑技术比较了解的用户可以手动调整 Canvas、WebGL、字体、分辨率、语言等参数，让环境和代理 IP 所在地区更匹配。
而对新手来说，RoxyBrowser 也能一键生成真实、可信的指纹数据，快速创建稳定的配置文件。`),
      },
      {
        title: $t('RoxyBrowser 支持导入或导出配置文件吗？'),
        desc: $t(`支持。你可以把浏览器配置文件 导入或导出，方便做备份、换设备，或者和团队共享。
配置文件里包含 cookies、会话数据、代理 IP 设置、指纹参数等，能直接迁移环境，避免重复设置，效率更高。`),
      },
      {
        title: $t('我能不能通过脚本在 RoxyBrowser 里自动执行任务？'),
        desc: $t(`完全可以。RoxyBrowser 提供 API，并能与 Selenium、Puppeteer 等工具对接。这样你就可以自动化执行任务，比如登录、发帖、账号测试等。
这种功能在增长营销、爬虫、质量测试等场景很常见。不过要注意，如果脚本行为太不自然，平台还是可能识别到。`),
      },
      {
        title: $t('RoxyBrowser 可以配合 AI 来使用吗？具体怎么做？'),
        desc: $t(`可以，RoxyBrowser 支持 MCP 协议，可以让 AI 工具直接控制浏览器。
比如，你在 Claude Code 里下达指令：“用配置文件 1–4 打开 4 个窗口，分别注册 Facebook、Instagram、YouTube 和 Twitter 账号。” AI 会自动执行这些操作，不用你手动切换账号。`),
      },
      {
        title: $t('RoxyBrowser 支持窗口同步吗？'),
        desc: $t(`支持，RoxyBrowser 能在不同配置文件之间 同步窗口和标签页。
你可以同时进行多账号操作、监控数据，或者并行做调研，保持工作流程一致，同时节省大量管理时间。`),
      },
    ],
  },
])

const activeCategoryKey = ref(faqCategories.value[0]?.key)
const faqAccordionRef = ref<{ [key: string]: any }>({})
// 为每个分类创建 ref 引用
const categoryRefs = ref<{ [key: string]: HTMLElement }>({})
function setCategoryRef(key) {
  return (el) => {
    if (el) {
      categoryRefs.value[key] = el
    }
  }
}

// 使用 Intersection Observer 监听分类标题的可见性
const observedElements = ref<HTMLElement[]>([])
const visibleCategories = ref(new Set())

// 监听元素的可见性变化
useIntersectionObserver(
  observedElements,
  (entries) => {
    entries.forEach((entry) => {
      const categoryKey = entry.target.getAttribute('data-category-key')
      if (categoryKey) {
        if (entry.isIntersecting) {
          visibleCategories.value.add(categoryKey)
        }
        else {
          visibleCategories.value.delete(categoryKey)
        }
      }
    })

    // 根据可见的分类自动高亮第一个可见的分类
    if (visibleCategories.value.size > 0) {
      const firstVisibleCategory = faqCategories.value.find(category =>
        visibleCategories.value.has(category.key),
      )
      if (firstVisibleCategory && activeCategoryKey.value !== firstVisibleCategory.key) {
        activeCategoryKey.value = firstVisibleCategory.key
      }
    }
  },
  {
    // 设置根边距，使元素在接近视窗顶部时就被认为是可见的
    rootMargin: '-10% 0px -60% 0px',
    threshold: 0.1,
  },
)

// 在组件挂载后设置观察的元素
onMounted(() => {
  nextTick(() => {
    observedElements.value = Object.values(categoryRefs.value)
    faqAccordionRef.value[activeCategoryKey.value]?.setActiveItem?.(0)
  })
})

function handleSearchResultClick(item: SearchResultItem) {
  const category = faqCategories.value.find(category => category.list.some(list => list.title === item.id))
  if (category) {
    activeCategoryKey.value = category.key
    const cateIndex = category.list.findIndex(list => list.title === item.id)
    faqAccordionRef.value[category.key]?.setActiveItem?.(cateIndex)
    setTimeout(() => {
      const targetElement = categoryRefs.value[category.key]?.nextElementSibling?.querySelector(`div.group:nth-child(${cateIndex + 1})`)
      scrollToCategory(targetElement as HTMLElement, 20)
    }, 350)
  }
}

let scrollToCategoryTimer
function handleCategoryClick(key: string) {
  activeCategoryKey.value = key

  faqAccordionRef.value[key]?.setActiveItem?.(0)

  clearTimeout(scrollToCategoryTimer)
  scrollToCategoryTimer = setTimeout(() => {
    scrollToCategory(categoryRefs.value[key]!)
  }, 350)
}

function scrollToCategory(targetElement: HTMLElement, offset: number = 0) {
  // 滚动到对应的分类位置，距离顶部120px
  if (targetElement) {
    const docTop = document.documentElement.scrollTop
    const { top } = targetElement.getBoundingClientRect()
    const scrollToPosition = top + docTop - (window.innerWidth > 1024 ? 120 : 140) + offset
    window.scrollTo({
      top: scrollToPosition,
      behavior: 'smooth',
    })
  }
}

function handleCategoryChange(key: string) {
  faqCategories.value.forEach((category) => {
    if (category.key !== key) {
      faqAccordionRef.value[category.key].closeAll()
    }
  })
}

provide('search-content-context', {
  faqCategories,
  handleSearchResultClick,
})
</script>

<template>
  <HeroBanner />
  <Container class="pb-15 pt-6 flex flex-col gap-10 items-center lg:pt-18">
    <div class="faq-categories max-lg:flex-col !max-lg:gap-2">
      <!-- PC端 -->
      <div class="faq-categories-list !max-lg:hidden">
        <template v-for="category in faqCategories" :key="category.key">
          <div class="faq-categories-item" :class="{ active: activeCategoryKey === category.key }" @click="handleCategoryClick(category.key)">
            <div class="faq-categories-item-title">
              {{ category.title }}
            </div>
            <RxIcon name="base/rx_ic_right" size="20" />
          </div>
        </template>
      </div>

      <!-- 移动端 -->
      <div class="faq-categories-list-mobile !max-lg:flex">
        <template v-for="category in faqCategories" :key="category.key">
          <div class="faq-categories-item" :class="{ active: activeCategoryKey === category.key }" @click="handleCategoryClick(category.key)">
            <div class="faq-categories-item-title">
              {{ category.title }}
            </div>
          </div>
        </template>
      </div>

      <div class="faq-content max-lg:mt-4">
        <template v-for="category in faqCategories" :key="`${locale}-${category.key}`">
          <div
            :ref="setCategoryRef(category.key)"
            class="title multilingual-text"
            :data-category-key="category.key"
          >
            {{ category?.title }}
          </div>
          <FaqAccordion
            :ref="(el) => faqAccordionRef[category.key] = el"
            :data-accordion-key="category.key"
            :fqa-list="category?.list || []"
            @change="handleCategoryChange(category.key)"
          />
        </template>
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.faq-categories {
  width: 100%;
  display: flex;
  gap: 48px;
}

.faq-categories-list {
  position: sticky;
  top: 120px;
  display: flex;
  width: 308px;
  flex-direction: column;
  align-self: flex-start;
  gap: 12px;
}

.faq-categories-item {
  display: flex;
  padding: 16px 12px 16px 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
  cursor: pointer;
  transition: background 0.15s ease;

  svg {
    color: #7d8387;
  }

  &:hover {
    background: #eaeff4;
    svg {
      color: var(--colors-icon-icon-primary, #2c2e30);
    }
  }

  &.active {
    background: #e7f6ff;
    svg {
      color: var(--colors-icon-icon-primary, #2c2e30);
    }
  }
}

.faq-categories-list-mobile {
  position: sticky;
  top: 80px;
  display: none;
  align-items: flex-start;
  gap: 8px;
  overflow-x: auto;
  padding-bottom: 8px;
  z-index: 10;
  background: #fff;

  .faq-categories-item {
    display: flex;
    padding: 8px 12px;
    align-items: center;
    border-radius: 8px;
    border: 1px solid var(--colors-border-border-subtle, #c7d1d6);
    white-space: nowrap;
    word-break: keep-all;
    color: var(--colors-text-text-primary, #111213);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 500;
    line-height: 20px; /* 142.857% */

    &.active {
      border: 1px solid var(--colors-border-border-brand, #11a3fd);
      background: #e7f6ff;
    }
  }
}

.faq-content {
  flex: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    color: var(--colors-text-text-primary, #111213);
    font-size: var(--Heading-H5, 26px);
    font-style: normal;
    font-weight: 600;
    line-height: var(--line-H5, 36px); /* 138.462% */

    &:not(:first-child) {
      margin-top: 72px;

      @media (max-width: 1024px) {
        margin-top: 40px;
      }
    }
  }
}
</style>
