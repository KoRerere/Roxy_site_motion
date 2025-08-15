<template>
  <page-blog-reading-progress :bottomElement="moreArticlesRef" />

  <BgEffect />

  <Container class="relative z-2 blog-container">
    <div class="pt-25 md:pt-[112px] mb-10" ref="mainRef">
      <div v-if="status === 'pending'" class="flex justify-center items-center h-screen">
        <ProgressSpinner 
          style="width: 50px; height: 50px" 
          strokeWidth="8" 
          fill="transparent"
          animationDuration=".5s" 
          aria-label="Loading..."
        />
      </div>
      <template v-else-if="status === 'success'">
        <div class="flex gap-[34px]">
          <main class="flex-1">
            <nav aria-label="breadcrumb">
              <ol class="list-none flex items-center gap-2 flex-wrap">
                <li 
                  v-for="(breadcrumb, index) in breadcrumbs" 
                  :key="breadcrumb.to"
                  class="flex items-center breadcrumb-item"
                >
                  <template v-if="breadcrumb.separator">
                    <RxIcon name="base/rx_ic_chevron_right" color="#7D8387" />
                  </template>
                  <template v-else>
                    <NuxtLinkLocale 
                      v-if="index < breadcrumbs.length - 1" 
                      :to="breadcrumb.to"
                    >
                      {{ breadcrumb.text }}
                    </NuxtLinkLocale> 
                    <span v-else>{{ breadcrumb.text }}</span>
                  </template>
                </li>
              </ol>
            </nav>
            <article>
              <header>
                <h1 class="article-title text-7 md:text-9">{{ article?.title }}</h1>
                <page-blog-article-meta :article="article" class="mt-[12px] mb-[40px]" />
              </header>
              <section v-html="article?.article" class="blog-article"></section>
            </article>
          </main>

          <aside class="xl:w-[308px] lg:w-[290px] sticky top-[112px] h-[calc(100vh-90px-48px)] hidden lg:block">
            <div class="flex flex-col gap-5 h-full">
              <div 
                class="lg:h-[310px] rounded-2 bg-[url(/blog-aside.png)] bg-no-repeat bg-center bg-cover p-6"
              >
                <div class="flex flex-col justify-between h-full">
                  <div class="flex flex-col gap-6">
                    <div class="flex items-center gap-2">
                      <img src="/logo.svg" alt="Roxybrowser" />
                      <div class="text-[18px] font-700 font-[Archivo]"> RoxyBrowser </div>
                    </div>
                    <ul class="pl-6 list-disc marker:text-[#12A3FC] features">
                      <li>{{ $t('同时运作多个账号') }}</li>
                      <li>{{ $t('隐藏真实网络身份') }}</li>
                      <li>{{ $t('实现精准协同办公') }}</li>
                    </ul> 
                  </div>

                  <NuxtLinkLocale 
                    to="/download" 
                    @click="handleDownload"
                    class="mt-auto w-full h-11 flex items-center justify-center rounded-6px bg-[#33A9FF] text-white"
                  >
                    {{ $t('免费试用') }}
                  </NuxtLinkLocale>
                </div>
              </div>

              <div class=" flex-col flex overflow-hidden rounded-2 border border-solid border-[#C7D1D6] bg-white">
                <div class="px-4 text-5 font-600 font-[Archivo] pt-4 pb-3 leading-[28px] text-[#111213]">
                  {{$t('目录')}}
                </div>

                <ul class="overflow-y-auto flex-1 directory-ul pb-4" ref="scrollRef">
                  <li 
                    v-for="(item, index) in article?.directory.filter(item => item.level < 4)" 
                    :key="item.id" 
                    :data-level="item.level"
                    :style="{ paddingLeft: calculateDirectory(item.level) }"
                    class="list-none cursor-pointer"
                    :class="{ 'active-directory': activeTitle === item.anchor }"
                    :id="'li:' + item.anchor"
                  >
                    <NuxtLink 
                      :to="`#${item.anchor}`" 
                      :class="[
                        'w-full ',
                        item.level > 2 ? 'sub-directory' : 'directory',
                      ]" 
                    >{{ item.title }}</NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div class="mt-10 md:mt-20">
          <div class="flex flex-col gap-10 md:gap-15">
            <div ref="moreArticlesRef" class="text-center text-[#042144] text-5 leading-[1.2] md:text-10 font-700 font-[Archivo]">
              {{ $t('更多文章') }}
            </div>
            
            <div 
              class="grid xl:grid-cols-3 md:grid-cols-2 lg:gap-x-4 md:gap-x-3 gap-y-15 mt-8 more-articles"
            >
              <Card v-for="article in relatedPosts" :article="article" hideExcerpt />
            </div>

            <div class="flex justify-center">
              <NuxtLinkLocale 
                to="/blog" 
                class="h-[52px] w-full max-w-416px flex items-center justify-center text-[#34393D] text-4 font-700 font-[Archivo] border border-[#C7D1D6] rounded-2 border-solid"
              >
                {{ $t('查看所有博客') }}
              </NuxtLinkLocale>
            </div>
          </div>
        </div>

        <PanelDownload2 tag="section" />
      </template>
      <Error v-else />
    </div>
  </Container>
</template>

<script setup lang="ts">
import { formatArticleReadingTime } from '@/components/page-blog/utils'
import FooterPanel from '@/components/page-use-cases/components/FooterPanel.vue'
import Card from '@/components/page-blog/card.vue'
import { useRoxySeoMeta } from '@/layouts/hooks/useRoxySeoMeta'
import { RxIcon } from '@/components/rx-icon'
import Error from '@/components/page-blog/error.vue'
import { useDownload } from '~/composables/useDownload'

useBackTop(useTemplateRef('mainRef'))

const { $md, $extractKeywords, $ghost } = useNuxtApp()
const { locale, $t } = useRxI18n()
const { initializeDownload, triggerAutoDownload } = useDownload()

const route = useRoute()
const slug = route.params.slug as string
const visibleTitle = ref({})
const scrollRef = ref(null)
const moreArticlesRef = ref(null)
const localePath = useLocalePath()

useRoxySeoMeta({
  // 重置掉这个字段，拿文章内部的keywords去实现
  keywords: null
})

const activeTitle = computed(() => {
  const rects = Object.values(visibleTitle.value).map(item => item.getBoundingClientRect())
  const tops = rects.map(item => item.top)
  const minTop = Math.min(...tops)
  const index = rects.findIndex(item => item.top === minTop)
  return Object.keys(visibleTitle.value)[index]
})

watch(activeTitle, (newVal) => {
  if (newVal) {
    scrollToElement(document.getElementById('li:' + newVal))
  }
})

const { data: article, status } = useAsyncData('article' + locale.value, async () => {
  try {
    const response = await $ghost.posts.read(slug, {
      language: locale.value
    });
    if (!response?.lexical) return {};
    const lexical = JSON.parse(response.lexical);

    const keywords: string[] = [];
    lexical.root.children.forEach(item => {
      if (item.type === 'paragraph') {
        item.children.forEach(child => {
          const r = $extractKeywords(child.text);
          r && keywords.push(r)
        })
      }
    })

    const markdown = lexical.root.children
      .filter((item) => item.type === 'markdown')
      .map((item) => item.markdown)
      .join('')

    const result = await $md(markdown)

    useHead({
      meta: [
        {
          name: "title",
          content: response.meta_title
        },
        {
          name: 'description',
          content: response.meta_description
        },
        ...keywords.map(keyword => ({
          name: 'keywords',
          content: keyword
        }))
      ]
    });

    const feature_image = response.feature_image
    if (feature_image) {
      const featureImageURL = new URL(feature_image)
      console.log('featureImageURL', featureImageURL)
      const paths = featureImageURL.pathname.split('/')
      // TODO: 这里可以做响应式图片
    }

    return {
      article: result.html,
      directory: result.directory || [],
      ...response
    }
  } catch (err) {
    return navigateTo(localePath('/blog'))
  }
}, {
  default: () => ({ article: '', title: '', directory: [] }),
  watch: [locale]
})

// 文章的tags
const articleTag = computed(() => {
  if (article.value && article.value.tags) {
    const tags = article.value.tags.filter(t => t.description.includes(`{${locale.value}}`))
    return tags[0];
  }
  return {
    name: '',
    slug: ''
  }
})

// 面包屑
const breadcrumbs = computed(() => {
  const defaultBreadcrumbs = [
    {
      text: $t('首页'),
      to: '/'
    },
    {
      separator: true
    },
    {
      text: $t('博客'),
      to: '/blog'
    }
  ]

  // if (articleTag.value && articleTag.value?.slug) {
  //   defaultBreadcrumbs.push({ separator: true })
  //   defaultBreadcrumbs.push({
  //     text: articleTag.value.name,
  //     to: `/blog?tag=${articleTag.value?.slug}`
  //   })
  // }

  if (article.value && article.value.title) {
    defaultBreadcrumbs.push({ separator: true })
    defaultBreadcrumbs.push({
      text: article.value.title,
      to: `/blog/${article.value?.slug}`
    })
  }

  return defaultBreadcrumbs
}, [locale.value])

const relatedPosts = ref([])
watchEffect(async () => {
  const response = await $ghost.posts.browse({
    tag: articleTag.value?.slug,
    limit: 10,
    page: 1
  }, {
    language: locale.value
  });
  // 随机在文章列表里面取三个文章出来
  relatedPosts.value = response.posts.sort(() => Math.random() - 0.5).slice(0, 3)
})

function calculateDirectory(level) {
  if (level > 2) {
    return `${(level - 2) * 20 + 20}px`
  }
}

function calculatePadding(next) {
  if (!next || next.level == 2) {
    return '16px';
  }
}

function scrollToElement(element) {
  const parentRect = scrollRef.value.getBoundingClientRect();
  const elementRect = element.getBoundingClientRect();

  // 获取父元素的滚动位置
  const parentScrollTop = scrollRef.value.scrollTop;

  // 计算目标元素相对于父元素的顶部距离（考虑父元素的滚动偏移）
  const distanceToParentTop = elementRect.top - parentRect.top + parentScrollTop;

  scrollRef.value.scrollTo({
    top: distanceToParentTop - parentRect.height + elementRect.height,
    behavior: 'smooth'
  })
}

let observer = null
watch(article, () => {
  if (import.meta.client) {
    if (article.value && article.value?.article && !observer) {
      observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            // 当元素进入视口时执行的操作
            console.log('元素进入视口了！', entry.target.id);
            visibleTitle.value[entry.target.id] = entry.target
          } else {
            // 当元素离开视口时执行的操作
            console.log('元素离开视口了！', entry.target.id);
            delete visibleTitle.value[entry.target.id]
          }
        });
      }, {
        root: null, // 默认为 null，表示视口
        rootMargin: '0px', // 可调整触发范围
        threshold: 0.5 // 元素至少 50% 可见时触发
      });
      nextTick(() => {
        setTimeout(() => {
          article.value.directory.forEach(item => {
            const anchor = document.getElementById(item.anchor)
            if (anchor) observer.observe(anchor)
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

const handleDownload = async () => {
  await initializeDownload()
  triggerAutoDownload()
}

</script>

<style scoped lang="scss">
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* 全局生效，顶部留 80px */
}

.features {
  li {
    color: #000;
    font-family: Inter;
    font-size: 18px;
    font-style: normal;
    font-weight: 500;
    line-height: 200%; /* 36px */
  }
}

.blog-container {

  .article-title {
    margin-top: 40px;
    color: var(--text-text-primary, #111213);
    font-family: Inter;
    font-style: normal;
    font-weight: 600;
    line-height: 160%; /* 57.6px */
    letter-spacing: -0.108px;
  } 


  .breadcrumb-item {
    color: var(--colors-text-text-tertiary, #575D60);
    font-family: Inter;
    font-size: var(--body-second, 14px);
    font-style: normal;
    font-weight: 500;
    line-height: var(--line-body-second, 18px); /* 128.571% */
    

    &:not(:last-of-type):hover {
      text-decoration-line: underline;
      text-decoration-style: solid;
      text-decoration-skip-ink: auto;
      text-decoration-thickness: auto;
      text-underline-offset: auto;
      text-underline-position: from-font;
    }
  } 

  :deep(.blog-article) {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 20px;

    a {
      // 继承父元素颜色
      color: inherit;
    }

    display: flex;
    flex-direction: column;
    gap: 20px;
    
    font-size: 16px;

    h2, h3, h4 {
      scroll-margin-top: 80px;
    }

    h1 {
      color: var(--text-text-primary, #111213);
      font-size: 34px;
      font-weight: 600;
    }

    h2 {
      color: var(--text-text-primary, #111213);
      font-family: Inter;
      font-size: 28px;
      font-style: normal;
      font-weight: 600;
      line-height: 160%; /* 44.8px */
      letter-spacing: -0.084px;

      @media (max-width: 768px) {
        font-size: 22px;
      }
    }

    h3 {
      color: var(--text-text-primary, #111213);
      font-family: Inter;
      font-size: 24px;
      font-style: normal;
      font-weight: 600;
      line-height: 150%; /* 36px */
      letter-spacing: -0.072px;

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
      line-height: 150%; /* 30px */
      letter-spacing: -0.06px;

      @media (max-width: 768px) {
        font-size: 16px;
      }
    }

    p {
      color: var(--text-text-primary, #111213);
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 400;
      line-height: 180%; /* 28.8px */
      letter-spacing: -0.048px;

    }

    img {
      max-width: 100%;
      display: block;
      margin: 0 auto;
    }

    a {
      color: var(--colors-text-text-link, #11A3FD);
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

      &:hover {
        color: var(--colors-text-text-link-hover, #0282D4);
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
      }
    }

    em {
      color: #000;
      font-weight: 400;
      line-height: 30px;
    }

    ol, ul {
      padding: 0 20px;
      padding-left: 40px;
    }

    ol li::marker {
      content: counter(list-item) ".  ";
      color: var(--text-text-primary, #111213);
      text-align: center;
      font-family: Inter;
      font-size: 16px;
      font-style: normal;
      font-weight: 600;
      line-height: 30px; /* 187.5% */
      letter-spacing: -0.048px;
    }

    li {
      line-height: 1.5;
    }

    img {
      max-width: 100%;
      border-radius: 8px;
    }

    b {
      font-weight: 700;
    }

    table {
      width: 100%;
      border: 1px solid #F1F5F8;
      border-collapse: collapse;
      thead {
        background-color: #F1F5F8;
        height: 50px;
        text-align: left;
 
      }

      th, td {
        border: none;
        padding: 0 20px;
        height: 54px; 
        vertical-align:middle;
      } 

      tr {
        height: 54px;
      }

      tr:not(:last-child) {
        border-bottom: 1px solid var(--netural-100, #F1F5F8);
      }
    }

    blockquote {
      border-left: 4px solid #11A3FD;
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


.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.10);
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.10);
}

.directory-ul {
  li {
    display: flex;
    padding: 12px 16px;
    flex-direction: column;
    justify-content: center;
    align-items: flex-start;
    gap: 16px;
    align-self: stretch;
    border-left: 3px solid transparent;
    background: transparent;

    &.active-directory {
      border-left: 3px solid #11A3FD;
      background: rgba(18, 163, 252, 0.06);

      a,a:hover {
       color: var(--colors-text-text-brand, #11A3FD);
      }
    }
  
    a {
      color: var(--colors-text-text-tertiary, #575D60);
      font-feature-settings: 'liga' off, 'calt' off;
      font-family: Inter;
      font-size: var(--body-second, 14px);
      font-style: normal;
      font-weight: 400;
      line-height: var(--line-body-second, 18px); /* 128.571% */
      

      &:hover {
        color: var(--colors-text-text-primary, #111213);
      }
    }
  }
} 

.directory {
  color: var(--text-text-secondary, #34393D);
  font-family: Archivo;
  font-size: 14px;
  display: inline-block;
}

.sub-directory {
  color: var(--text-text-teriiary, #575D60);
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
  background-color: #12A3FC;
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
