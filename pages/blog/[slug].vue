<script setup lang="ts">
import type { App } from 'vue'
import type { RxBreadcrumbProps } from '@/components/rx-breadcrumb'
import type { SvgNames } from '@/components/rx-icon'
import { defineCustomElement, h } from 'vue'
import Card from '@/components/page-blog/card.vue'
import Error from '@/components/page-blog/error.vue'
import HeroBanner from '@/components/page-blog/hero-banner.vue'
import { RxIcon } from '@/components/rx-icon'
import CTADownload from '~/components/cta-components/cta-download.vue'
// import MdCodeBlock from '~/components/md-components/md-code-block.vue'
import FaqAccordion from '~/components/faq-accordion.vue'
import { useBlogSeoHead } from '~/composables/useBlogSeoHead'
import { useZoomImage } from '~/composables/useZoomImage'
const { public: { isChinaSite } } = useRuntimeConfig()

const BLOG_FAQ_ANCHOR = 'faq'
/** BlogPosting JSON-LD @id 锚点，与正文 section#article 对应 */
const BLOG_ARTICLE_ANCHOR = 'article'

const config = useRuntimeConfig()
const roxyHomeUrl = computed(() => (config.public.roxyHomeUrl as string) || 'https://roxybrowser.com')

const MdCodeBlock = defineAsyncComponent(() => import('~/components/md-components/md-code-block.vue'))
const nuxtApp = useNuxtApp()
const { $ghost } = nuxtApp
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

// v-html 中的自定义元素会脱离 Nuxt 应用上下文，需共享 provides（含 i18n）
function configureBlogCustomElementApp(app: App) {
  Object.assign(app._context.provides, nuxtApp.vueApp._context.provides)
}

const blogCustomElementOptions = {
  shadowRoot: false,
  configureApp: configureBlogCustomElementApp,
} as const

onMounted(() => {
  if (!customElements.get('cta-download')) {
    const CtaDownloadElement = defineCustomElement({
      extends: CTADownload,
      setup(props, ctx) {
        return () => h(CTADownload, { ...props }, ctx.slots)
      },
    }, blogCustomElementOptions)

    customElements.define('cta-download', CtaDownloadElement)
  }

  if (!customElements.get('md-code-block')) {
    const MdCodeBlockElement = defineCustomElement({
      extends: MdCodeBlock,
      props: {
        code: { type: String, default: '' },
        lang: { type: String, default: '' },
      },
      setup(props, ctx) {
        return () => h(MdCodeBlock, { ...props }, ctx.slots)
      },
    }, blogCustomElementOptions)
    customElements.define('md-code-block', MdCodeBlockElement)
  }
})

useBackTop(useTemplateRef('mainRef'))
const { locale, $t } = useRxI18n()

const route = useRoute()
const slug = route.params.slug as string

const blogSeoHead = useBlogSeoHead(slug)
const siteOrigin = (roxyHomeUrl as string) || ''
const visibleTitle = ref<Record<string, Element>>({})
const scrollRef = useTemplateRef<HTMLUListElement>('scrollRef')
const moreArticlesRef = useTemplateRef('moreArticlesRef')
const localePath = useLocalePath()

if (import.meta.client) {
  history.scrollRestoration = 'manual'
}

// 使用 ref + requestAnimationFrame 更新，避免在 computed 中同步调用 getBoundingClientRect 导致强制重排
const activeTitle = ref<string | undefined>(undefined)

function updateActiveTitleFromVisible() {
  const entries = Object.entries(visibleTitle.value)
  if (entries.length === 0) {
    activeTitle.value = undefined
    return
  }
  const withTop = entries
    .filter(([, el]) => el)
    .map(([id, el]) => ({ id, top: el!.getBoundingClientRect().top }))
  if (withTop.length === 0) {
    activeTitle.value = undefined
    return
  }
  const minTop = Math.min(...withTop.map(r => r.top))
  const active = withTop.find(r => r.top === minTop)
  activeTitle.value = active?.id
}

watch(visibleTitle, () => {
  if (import.meta.client) {
    requestAnimationFrame(updateActiveTitleFromVisible)
  }
}, { deep: true })

watch(activeTitle, (newVal) => {
  if (newVal) {
    scrollToElement(document.getElementById(`li:${newVal}`)!)
  }
}, { flush: 'post' })

const articleKey = computed(() => `article-${slug}-${locale.value}`)

const { data: article, status, error } = await useAsyncData(articleKey, () =>
  $ghost.posts.read(slug, { language: locale.value }), {
  default: () => ({ article: '', title: '', directory: [], tags: [], faq: null, faqLdJson: null, faqLdJsonScript: null, pageUrl: '' }),
})

if (error.value) {
  navigateTo(localePath('/blog'))
  throw createError({ statusCode: 404, statusMessage: 'Case not found' })
}

// await 完成后用静态值注册，避免 useHead 回调首屏拿不到 faqLdJsonScript
const faqSchemaScript = article.value?.faqLdJsonScript
if (faqSchemaScript) {
  useHead({
    script: [{
      key: 'blog-faq-page',
      type: 'application/ld+json',
      textContent: faqSchemaScript,
      tagPosition: 'head',
    }],
  })
}

const faqList = computed(() => article.value?.faq?.items ?? [])

// 面包屑
const breadcrumbs = computed(() => {
  const defaultBreadcrumbs: RxBreadcrumbProps['items'] = [
    {
      title: $t('首页'),
      path: '/',
    },
    {
      type: 'separator',
    },
    {
      title: $t('博客'),
      path: '/blog',
    },
  ]

  if (article.value && article.value.title) {
    const pathSlug = article.value?.slug?.replace(`${locale.value}-`, '') ?? ''
    defaultBreadcrumbs.push({ type: 'separator' })
    defaultBreadcrumbs.push({
      title: article.value.title,
      path: `/blog/${pathSlug}`,
      disabled: true,
    })
  }

  return defaultBreadcrumbs
})

const blogAuthorCardDate = computed(() => {
  const publishedAt = article.value?.published_at
  if (!publishedAt)
    return ''
  return new Intl.DateTimeFormat('en-CA', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date(publishedAt)).replace(/-/g, '/')
})

const blogAuthorCardReadTime = computed(() => {
  const minutes = article.value?.reading_time
  if (minutes == null)
    return ''
  return $t('预计阅读：{minutes}分钟', { minutes }).trim()
})

const blogAuthorLinkedInHref = computed(() => {
  const w = article.value?.authors?.[0]?.website
  if (w && /linkedin\.com/i.test(w))
    return w
  return ''
})

const blogAuthorProfileTo = computed(() => {
  const s = article.value?.authors?.[0]?.slug
  if (!s)
    return ''
  const path = `/blog/author/${s}`
  return localePath({ path })
})

// 社媒那边需要博客添加的meta标签包括：
// og: title / twitter: title ：就用文章本身的Meta title
// og: description/ twitter: description：用文章本身description
// og: image / twitter: image：用博客封面图
// 博客详情页的多语言 head（hreflang/canonical/og:locale）在此页单独处理，仅输出实际存在的语言版本
// 与列表卡片 article-excerpt 一致：custom_excerpt || excerpt
const blogMetaTitle = computed(() => article.value?.meta_title || article.value?.title || '')
const blogMetaDescription = computed(() =>
  article.value?.custom_excerpt || article.value?.excerpt || '',
)
const blogUrl = computed(() =>
  article.value?.pageUrl || `${roxyHomeUrl.value}${localePath((breadcrumbs.value?.at(-1) as { path?: string })?.path || '')}`,
)
/** BlogPosting 结构化数据 @id，验收要求带 #article 锚点 */
const blogPostingId = computed(() => `${blogUrl.value}#${BLOG_ARTICLE_ANCHOR}`)

const blogPostingAuthors = computed(() => {
  const authors = article.value?.authors
  if (!Array.isArray(authors))
    return []
  return authors
    .filter((a: { name?: string }) => a?.name)
    .map((a: { name: string, slug?: string }) => ({
      '@type': 'Person',
      'name': a.name,
      ...(a.slug ? { url: `${roxyHomeUrl.value}${localePath(`/blog/author/${a.slug}`)}` } : {}),
    }))
})

useHead(() => {
  const scripts: { key: string, type: string, textContent: string }[] = [
    {
      key: 'blog-breadcrumb',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BreadcrumbList',
        'itemListElement': breadcrumbs.value.filter(n => n.path).map((n, index) => ({
          '@type': 'ListItem',
          'position': index + 1,
          'name': n.title,
          'item': `${roxyHomeUrl.value}${localePath(n.path!)}`,
        })),
      }),
    },
    {
      key: 'blog-posting',
      type: 'application/ld+json',
      textContent: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        '@id': blogPostingId.value,
        'mainEntityOfPage': {
          '@type': 'WebPage',
          '@id': blogUrl.value,
        },
        'url': blogUrl.value,
        'headline': article.value?.title ?? '',
        'description': blogMetaDescription.value,
        'image': {
          '@type': 'ImageObject',
          'url': article.value?.feature_image ?? '',
          'width': 1200,
          'height': 630,
        },
        'datePublished': article.value?.published_at ?? '',
        'dateModified': article.value?.published_at ?? '',
        'identifier': blogUrl.value,
        ...(blogPostingAuthors.value.length
          ? { author: blogPostingAuthors.value }
          : {}),
        'publisher': {
          '@type': 'Organization',
          'name': isChinaSite ? 'Roxy浏览器' : 'RoxyBrowser',
          'logo': {
            '@type': 'ImageObject',
            'url': `${roxyHomeUrl.value}/logo.svg`,
            'width': 600,
            'height': 60,
          },
          'sameAs': [
            'https://x.com/RoxyBrowser',
            'https://www.youtube.com/@RoxyBrowser',
            'https://tiktok.com/@RoxyBrowser',
            'https://www.facebook.com/roxybrowser/',
            'https://instagram.com/RoxyBrowser',
          ],
        },
      }),
    },
  ]

  return {
    title: blogMetaTitle.value,
    link: [
      { rel: 'stylesheet', href: '/fonts/fonts-roboto.css' },
      ...(blogSeoHead.link.value ?? []),
    ],
    meta: [
      {
        name: 'title',
        content: blogMetaTitle.value,
      },
      {
        name: 'description',
        content: blogMetaDescription.value,
      },
      {
        property: 'og:title',
        content: blogMetaTitle.value,
      },
      {
        property: 'og:description',
        content: blogMetaDescription.value,
      },
      {
        property: 'og:image',
        content: article.value?.feature_image,
      },
      {
        property: 'twitter:title',
        content: blogMetaTitle.value,
      },
      {
        property: 'twitter:description',
        content: blogMetaDescription.value,
      },
      {
        property: 'twitter:image',
        content: article.value?.feature_image,
      },
      ...blogSeoHead.meta.value,
    ],
    script: scripts,
  }
})

const socialMediaList: { name: string, link: string, icon: SvgNames }[] = [
  {
    name: 'X',
    link: `https://twitter.com/intent/tweet?url=${blogUrl.value}&text=${article.value.title}`,
    icon: 'blog/rx_site_x',
  },
  {
    name: 'Facebook',
    link: `https://www.facebook.com/sharer/sharer.php?u=${blogUrl.value}`,
    icon: 'blog/rx_site_facebook',
  },
  {
    name: 'LinkedIn',
    link: `https://www.linkedin.com/shareArticle?mini=true&url=${blogUrl.value}&title=${article.value.title}`,
    icon: 'blog/rx_site_linklin',
  },
]

onMounted(() => {
  useZoomImage('.blog-article img[data-zoomable]')
})

// 文章的tags
const articleTag = computed(() => {
  if (article.value && article.value.tags) {
    const tags = article.value.tags.filter((t: any) => t.description?.includes(`{${locale.value}}`))
    return tags[0]
  }
  return {
    name: '',
    slug: '',
  }
})

const relatedPosts = ref<any[]>([])
watchEffect(async () => {
  const response = await $ghost.posts.browse({
    filter: `tag:${articleTag.value?.slug}`,
    limit: 10,
    page: 1,
  }, {
    language: locale.value,
  })
  // 随机在文章列表里面取三个文章出来
  relatedPosts.value = response.posts.filter((item: any) => item.slug !== slug).sort(() => Math.random() - 0.5).slice(0, 3)
})

function calculateDirectory(level: number) {
  if (level > 2) {
    return `${(level - 2) * 16 + 16}px`
  }
}

function scrollToElement(element: Element) {
  if (!scrollRef.value)
    return

  // 将布局读取和滚动推迟到下一帧，避免在 Vue 更新 DOM（如 active-directory 类）后立即读几何属性导致强制重排
  requestAnimationFrame(() => {
    if (!scrollRef.value)
      return
    const parentRect = scrollRef.value.getBoundingClientRect()
    const elementRect = element.getBoundingClientRect()
    const parentScrollTop = scrollRef.value.scrollTop
    const distanceToParentTop = elementRect.top - parentRect.top + parentScrollTop
    scrollRef.value.scrollTo({
      top: distanceToParentTop - parentRect.height + elementRect.height,
      behavior: 'smooth',
    })
  })
}

let observer: IntersectionObserver | null = null
watch(article, () => {
  if (import.meta.client) {
    if (article.value && article.value?.article && !observer) {
      observer = new IntersectionObserver((entries, _observer) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // 当元素进入视口时执行的操作
            // console.log('元素进入视口了！', entry.target.id);
            visibleTitle.value[entry.target.id] = entry.target
          }
          else {
            // 当元素离开视口时执行的操作
            // console.log('元素离开视口了！', entry.target.id);
            delete visibleTitle.value[entry.target.id]
          }
        })
      }, {
        root: null, // 默认为 null，表示视口
        rootMargin: '0px', // 可调整触发范围
        threshold: 0.5, // 元素至少 50% 可见时触发
      })
      nextTick(() => {
        setTimeout(() => {
          article.value.directory.forEach((item: any) => {
            const anchor = document.getElementById(item.anchor)
            if (anchor)
              observer?.observe(anchor)
            if (item.children) {
              item.children.forEach((child: any) => {
                const anchor = document.getElementById(child.anchor)
                if (anchor)
                  observer?.observe(anchor)
              })
            }
          })
        }, 200)
      })
    }
  }
}, { immediate: true })

onBeforeUnmount(() => {
  if (observer) {
    observer.disconnect()
    observer = null
  }
})
</script>

<template>
  <div>
    <page-blog-reading-progress :bottom-element="moreArticlesRef" />

    <div ref="mainRef" class="blog-container mb-10">
      <div v-if="status === 'pending'" class="flex h-screen items-center justify-center">
        <RxSpinner size="50px" />
      </div>
      <template v-else-if="status === 'success'">
        <div class="flex gap-[34px]">
          <main class="flex-1 min-w-0 w-full">
            <HeroBanner :article :breadcrumbs />

            <article class="mt-10 px-5 flex justify-center">
              <aside class="shrink-0 h-fit max-h-[calc(100vh-90px-48px)] w-[240px] hidden top-[112px] sticky min-[1060px]:block">
                <div class="flex flex-col gap-5">
                  <div class="rounded-2 bg-white flex flex-col max-h-[calc(100vh-90px-48px)] overflow-hidden">
                    <div class="text-5 text-[#111213] leading-28px font-600 multilingual-text px-4 pb-3">
                      {{ $t('目录') }}
                    </div>

                    <ul ref="scrollRef" class="directory-ul pb-4 flex-1 overflow-y-auto">
                      <template v-for="(item) in article?.directory.filter((item: any) => item.level < 4)" :key="item.id">
                        <li
                          :id="`li:${item.anchor}`" :data-level="item.level"
                          :style="{ paddingLeft: calculateDirectory(item.level) }" class="list-none cursor-pointer"
                          :class="{ 'active-directory': activeTitle === item.anchor }"
                        >
                          <NuxtLink
                            :to="`#${item.anchor}`" class="w-full" :class="[
                              item.level > 2 ? 'sub-directory' : 'directory',
                            ]"
                          >
                            {{ item.title }}
                          </NuxtLink>
                        </li>
                        <ul class="sub-directory-ul" :class="{ active: activeTitle === item.anchor || item.children?.some(child => activeTitle === child.anchor) }">
                          <li
                            v-for="child in item.children" :id="`li:${child.anchor}`" :key="child.id"
                            :data-level="child.level" class="list-none cursor-pointer" :class="{ 'active-directory': activeTitle === child.anchor }"
                            :style="{ paddingLeft: calculateDirectory(item.level + 1) }"
                          >
                            <NuxtLink
                              :to="`#${child.anchor}`" class="w-full" :class="[
                                child.level > 2 ? 'sub-directory' : 'directory',
                              ]"
                            >
                              {{ child.title }}
                            </NuxtLink>
                          </li>
                        </ul>
                      </template>
                    </ul>
                  </div>
                </div>
              </aside>

              <div class="blog-article">
                <div
                  v-if="article.authors?.[0]"
                  class="font-[Inter] mb-6 flex gap-4 items-center"
                >
                  <img
                    v-if="article.authors[0].profile_image"
                    :src="article.authors[0].profile_image"
                    alt=""
                    class="rounded-full shrink-0 h-56px w-56px object-cover"
                  >
                  <div
                    v-else
                    class="rounded-full bg-[#f4f5f6] flex shrink-0 h-56px w-56px items-center justify-center"
                  >
                    <RxIcon name="base/rx_ic_logo_transparent" size="24" />
                  </div>
                  <div class="flex flex-1 flex-col gap-2 min-w-0">
                    <div class="flex flex-wrap gap-4 items-center">
                      <NuxtLinkLocale
                        v-if="blogAuthorProfileTo"
                        :to="blogAuthorProfileTo"
                        class="text-18px text-[#11a3fd] leading-normal font-500 underline underline-offset-2 decoration-solid transition-opacity md:text-20px hover:opacity-90" style="text-underline-position: under;"
                      >
                        {{ article.authors[0].name }}
                      </NuxtLinkLocale>
                      <a
                        v-else-if="article.authors[0].website"
                        :href="article.authors[0].website"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="text-18px text-[#11a3fd] leading-normal font-500 underline underline-offset-2 decoration-solid transition-opacity hover:opacity-90"
                      >
                        {{ article.authors[0].name }}
                      </a>
                      <span
                        v-else
                        class="text-18px text-[#11a3fd] leading-normal font-500"
                      >
                        {{ article.authors[0].name }}
                      </span>
                      <a
                        v-if="blogAuthorLinkedInHref"
                        :href="blogAuthorLinkedInHref"
                        target="_blank"
                        rel="noopener noreferrer"
                        class="rounded-[3px] bg-white inline-flex shrink-0 h-5 w-5 items-center justify-center overflow-hidden"
                        aria-label="LinkedIn"
                      >
                        <RxIcon name="blog/rx_accounts_linkedin" size="20" />
                      </a>
                      <span
                        v-else
                        class="rounded-[3px] bg-white inline-flex shrink-0 h-5 w-5 items-center justify-center overflow-hidden"
                      >
                        <RxIcon name="blog/rx_accounts_linkedin" size="20" />
                      </span>
                    </div>
                    <div
                      v-if="blogAuthorCardDate || blogAuthorCardReadTime"
                      class="text-14px text-tertiary leading-none font-400 flex flex-wrap gap-2 items-center md:text-16px"
                    >
                      <span v-if="blogAuthorCardDate">{{ blogAuthorCardDate }}</span>
                      <span
                        v-if="blogAuthorCardDate && blogAuthorCardReadTime"
                        class="rounded-full bg-[#575d60] shrink-0 h-1 w-1"
                        aria-hidden="true"
                      />
                      <span v-if="blogAuthorCardReadTime">{{ blogAuthorCardReadTime }}</span>
                    </div>
                  </div>
                </div>
                <div class="mb-10 bg-[#C7D1D6] h-1px w-full" />
                <section :id="BLOG_ARTICLE_ANCHOR" v-html="article?.article" />
                <div v-if="faqList.length" class="blog-article-faq">
                  <h2 :id="BLOG_FAQ_ANCHOR" class="mr-3 mt-10 pb-6 border-x-0 border-b-1 border-t-0 border-b-[#C7D1D6] border-solid">
                    {{ article.faq?.title || $t('常见问题') }}
                  </h2>
                  <FaqAccordion :fqa-list="faqList" static-layout class="!max-w-full" />
                </div>
              </div>

              <aside class="shrink-0 flex-col h-360px w-[240px] hidden top-[112px] justify-between sticky min-[1300px]:flex">
                <div class="flex flex-col gap-5">
                  <div class="p-6 rounded-2 flex bg-cover bg-center bg-no-repeat lg:h-[300px]">
                    <img
                      src="/blog/ad-card.svg"
                      alt=""
                      class="w-full inset-0 absolute object-cover"
                      fetchpriority="high"
                      loading="eager"
                      decoding="async"
                    >
                    <div class="flex flex-col w-full justify-between relative z-10">
                      <NuxtLinkLocale
                        class="text-white mt-auto rounded-1.5 bg-[#33A9FF] flex h-11 w-full cursor-pointer items-center justify-center"
                        to="/download"
                        @click.capture="redirectMobileDownloadToLogin"
                      >
                        {{ $t('免费使用') }}
                      </NuxtLinkLocale>
                    </div>
                  </div>
                </div>

                <div class="flex gap-3 w-full items-center justify-center">
                  <template v-for="item in socialMediaList" :key="item.name">
                    <NuxtLinkLocale :to="item.link" target="_blank">
                      <RxIcon :name="item.icon" size="36" />
                    </NuxtLinkLocale>
                  </template>
                </div>
              </aside>
            </article>
          </main>
        </div>

        <Container>
          <div class="mt-10 md:mt-20">
            <div class="flex flex-col gap-10 md:gap-15">
              <div
                ref="moreArticlesRef"
                class="text-5 text-[#042144] leading-[1.2] font-700 multilingual-text text-center md:text-10"
              >
                {{ $t('更多文章') }}
              </div>

              <div class="more-articles mt-8 gap-y-15 grid lg:gap-x-4 md:gap-x-3 md:grid-cols-2 xl:grid-cols-3">
                <Card v-for="item in relatedPosts" :key="item.slug" :article="item" />
              </div>

              <div class="flex justify-center">
                <NuxtLinkLocale
                  to="/blog"
                  class="text-4 text-[#34393D] font-700 multilingual-text border border-[#C7D1D6] rounded-2 border-solid flex h-52px max-w-416px w-full items-center justify-center"
                >
                  {{ $t('查看所有博客') }}
                </NuxtLinkLocale>
              </div>
            </div>
          </div>
        </Container>
      </template>
      <Error v-else />
    </div>
  </div>
</template>

<style>
html {
  scroll-behavior: smooth;
}

html[lang='ru-RU'] .blog-container .blog-article section p:not(.custom) {
  font-size: 18px;
}
</style>

<style scoped lang="scss">
.features {
  li {
    color: #000;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 200%;
    /* 36px */
  }
}

article {
  font-family: 'Roboto';
}

.blog-container {
  &.news-article {
    .blog-article {
      :deep(section) {
        img:not(.custom) {
          padding: 20px 0;
          clip-path: inset(20px 0 20px 0 round 8px);

          @media (max-width: 768px) {
            padding: 18px 0;
            clip-path: inset(18px 0 18px 0 round 8px);
          }
        }

        h3 {
          color: #11a3fd;
        }
      }
    }
  }

  .blog-article {
    width: 100%;
    max-width: 680px;
    margin: 0 60px;
    display: flex;
    flex-direction: column;
    font-size: 16px;

    @media (max-width: 1300px) {
      margin-right: 0;
    }

    @media (max-width: 1060px) {
      margin: 0;
      border-left: none;
    }

    #faq {
      color: #111213;
      font-family: Inter;
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 160%; /* 44.8px */
      scroll-margin-top: 80px;

      @media (max-width: 768px) {
        font-size: 24px;
        line-height: 120%;
      }
    }

    :deep(section) {
      a {
        // 继承父元素颜色
        color: inherit;
      }

      h2,
      h3,
      h4 {
        scroll-margin-top: 80px;
      }

      h1 {
        color: var(--text-text-primary, #111213);
        font-size: 34px;
        font-weight: 600;
      }

      h2 {
        color: var(--text-text-primary, #111213);
        font-family: Roboto;
        font-size: 28px;
        font-style: normal;
        font-weight: 700;
        letter-spacing: 0;
        line-height: 160%;
        margin: 36px 0 12px;

        @media (max-width: 768px) {
          font-size: 24px;
          line-height: 120%;
        }
      }

      h3 {
        color: var(--text-text-primary, #111213);

        line-height: 150%;
        font-family: 'Roboto';
        margin: 32px 0 8px 0;
        font-size: 20px;
        font-weight: 600;

        @media (max-width: 768px) {
          font-size: 20px;
        }
      }

      h4 {
        color: var(--text-text-primary, #111213);
        font-family: Inter;
        font-size: 20px;
        font-style: normal;
        font-weight: 600;
        line-height: 150%;
        /* 30px */
        letter-spacing: -0.06px;

        @media (max-width: 768px) {
          font-size: 16px;
        }
      }

      p {
        word-break: break-word;
      }

      p:not(.custom) {
        color: var(--text-text-primary, #111213);
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 160%;
        margin-bottom: 16px;
        font-family: 'Roboto';
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
      }

      img:not(.custom) {
        max-width: 100%;
        display: block;
        margin: 0 auto;
      }

      a {
        color: var(--colors-text-text-link, #11a3fd);
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 400;
        line-height: 30px;
        letter-spacing: -0.048px;
        text-decoration-style: solid;
        text-decoration-skip-ink: auto;
        text-decoration-thickness: auto;
        text-underline-offset: 25%;
        text-underline-position: from-font;

        text-decoration: none;
        display: inline; /* 必须是 inline 或 inline-block（inline 更常见） */
        background-image: linear-gradient(currentColor, currentColor);
        background-repeat: no-repeat;
        background-size: 0% 2px;
        background-position: left 100%;
        transition: background-size 0.28s ease;
        /* 关键：让折行的片段保留各自的背景 */
        -webkit-box-decoration-break: clone;
        box-decoration-break: clone;

        &:hover {
          color: var(--colors-text-text-link-hover, #0282d4);
          font-family: Inter;
          font-size: 16px;
          font-style: normal;
          font-weight: 400;
          line-height: 30px;
          letter-spacing: -0.048px;
          text-decoration-style: solid;
          text-decoration-skip-ink: auto;
          text-decoration-thickness: auto;
          text-underline-offset: 25%;
          text-underline-position: from-font;
          background-size: 100% 2px;
        }
      }

      em {
        color: #000;
        font-weight: 400;
        line-height: 30px;
      }

      ol,
      ul {
        padding: 12px 20px 12px 40px;
        list-style-type: disc;
      }

      ol li::marker {
        content: counter(list-item) '.  ';
        color: var(--text-text-primary, #111213);
        text-align: center;
        font-family: Inter;
        font-size: 16px;
        font-style: normal;
        font-weight: 600;
        line-height: 30px;
        /* 187.5% */
        letter-spacing: -0.048px;
      }

      li {
        line-height: 160%;
        margin: 0 0 8px 0;
      }

      img:not(.custom) {
        max-width: 100%;
        padding: 36px 64px;
        clip-path: inset(36px 64px 36px 64px round 8px);

        @media (max-width: 768px) {
          padding: 12px 12px;
          clip-path: inset(12px 12px 12px 12px round 8px);
        }
      }

      b {
        font-weight: 700;
      }

      .table-wrapper {
        width: 100%;
        overflow-x: auto;
      }

      table {
        width: 100%;
        border: 1px solid #f1f5f8;
        border-collapse: collapse;
        border-spacing: 0;
        vertical-align: top;
        white-space: nowrap;
        margin: 36px 0;

        thead {
          background-color: #f1f5f8;
          height: 50px;
          text-align: left;
        }

        th,
        td {
          border: none;
          padding: 0 20px;
          height: 54px;
          vertical-align: middle;
        }

        tr {
          height: 54px;
        }

        tr:not(:last-child) {
          border-bottom: 1px solid var(--netural-100, #f1f5f8);
        }
      }

      blockquote {
        margin-top: 20px;
        margin-bottom: 20px;
        border-left: 4px solid #11a3fd;
        border-radius: 4px;
        padding-left: 1rem;
        color: #555;
        font-style: italic;
        background: rgba(17, 163, 253, 0.06);
        display: flex;
        padding: 20px;
        align-items: center;
        gap: 20px;
        flex: 1 0 0;
      }

      iframe {
        aspect-ratio: 16 / 9 !important;
      }
    }
  }
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

.directory-ul {
  li {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    border-left: 3px solid transparent;
    background: transparent;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 8px;
    padding-bottom: 8px;

    &.active-directory {
      border-left: 3px solid #11a3fd;
      background: rgba(18, 163, 252, 0.06);

      a,
      a:hover {
        color: var(--colors-text-text-brand, #11a3fd);
      }
    }

    a {
      color: var(--colors-text-text-tertiary, #575d60);
      font-feature-settings:
        'liga' off,
        'calt' off;
      font-family: 'Roboto';
      font-size: var(--body-second, 14px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--line-body-second, 18px);
      /* 128.571% */

      &:hover {
        color: var(--colors-text-text-primary, #111213);
      }
    }
  }

  .sub-directory-ul {
    height: 0;
    overflow: hidden;
    transition: height 0.25s ease-in-out;

    &.active {
      height: auto;
      height: calc-size(auto, size);
    }
  }
}

.directory {
  color: var(--text-text-secondary, #34393d);
  font-family: Archivo;
  font-size: 14px;
  display: inline-block;
}

.sub-directory {
  color: var(--text-text-teriiary, #575d60);
  font-family: Archivo;
  font-size: 12px;
  display: inline-block;
  line-height: 2;
}

.aside-plan-li::after {
  content: '';
  position: absolute;
  height: 6px;
  width: 6px;
  background-color: #12a3fc;
  border-radius: 50%;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
}

.aside-plan-li {
  position: relative;
  padding-left: 14px;
  font-size: 18px;
  color: #000;
  font-weight: 500;

  white-space: nowrap;
}

@media (max-width: 1440px) {
  .more-articles a:last-child {
    display: none;
  }
}
</style>
