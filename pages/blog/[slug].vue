<template>
  <BgEffect />

  <Container class="relative z-2">
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
                  class="flex items-center"
                >
                  <template v-if="breadcrumb.separator">
                    <RxIcon name="base/rx_ic_chevron_right" color="#7D8387" />
                  </template>
                  <template v-else>
                    <NuxtLinkLocale 
                      v-if="index < breadcrumbs.length - 1" 
                      :to="breadcrumb.to"
                      class="text-[#7D8387]"
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
                <h1 v-show="false">{{ article?.title }}</h1>
                <img :src="article?.feature_image" :alt="article?.title" class="w-full my-6" />
                <div class="mb-5 text-[#7D8387] text-[14px]">
                  {{ formatArticleReadingTime(article) }}
                </div>
              </header>
              <section v-html="article?.article" class="blog-article"></section>
            </article>
          </main>

          <aside class="xl:w-[308px] lg:w-[290px] sticky top-[90px] h-[calc(100vh-90px-48px)] hidden lg:block">
            <div class="flex flex-col gap-2 h-full">
              <div 
                class="lg:h-[310px] mt-12 rounded-2 bg-[url(/blog-aside.png)] bg-no-repeat bg-center bg-cover p-6"
              >
                <div class="flex flex-col justify-between h-full">
                  <div class="flex flex-col gap-6">
                    <div class="flex items-center gap-2">
                      <img src="/logo.svg" alt="Roxybrowser" />
                      <div class="text-[18px] font-700 font-[Archivo]"> {{ $t('RoxyBrowser') }} </div>
                    </div>
                    <p class="text-[#2C2E30] font-500 leading-[160%]">
                      Advanced antidetect browser safeguarding digital identities while optimizing business workflows.
                    </p>
                    <!-- <ul class="list-none">
                      <li class="aside-plan-li">Top Anti-Correlation Tech</li>
                      <li class="aside-plan-li">Boost work efficiency</li>
                      <li class="aside-plan-li">Pro Fingerprint Management</li>
                    </ul> -->
                  </div>

                  <NuxtLinkLocale 
                    to="/download" 
                    @click="handleDownload"
                    class="mt-15 w-full h-10 flex items-center justify-center rounded-6px bg-[#33A9FF] text-white"
                  >
                    {{ $t('免费下载') }}
                  </NuxtLinkLocale>
                </div>
              </div>

              <div class="p-3 flex-1 flex-col flex overflow-hidden">
                <div class="text-6 font-600 font-[Archivo] py-5 border-bottom">
                  Content
                </div>

                <ul class="overflow-y-auto flex-1 directory-ul" ref="scrollRef">
                  <li 
                    v-for="(item, index) in article?.directory" 
                    :key="item.id" 
                    :style="{ paddingLeft: calculateDirectory(item.level) }"
                    class="list-none cursor-pointer"
                    :id="'li:' + item.anchor"
                  >
                    <NuxtLink 
                      :to="`#${item.anchor}`" 
                      :class="[
                        'w-full ',
                        item.level > 2 ? 'sub-directory' : 'directory border-top',
                        activeTitle === item.anchor ? 'aside-tip' : ''
                      ]"
                      :style="{
                        paddingBottom: calculatePadding(article.directory[index + 1])
                      }"
                    >{{ item.title }}</NuxtLink>
                  </li>
                </ul>
              </div>
            </div>
          </aside>
        </div>

        <div class="mt-10 md:mt-20">
          <div class="flex flex-col gap-10 md:gap-15">
            <div class="text-center text-[#042144] text-5 leading-[1.2] md:text-10 font-700 font-[Archivo]">
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

        <PanelDownload2 />
      </template>
      <Error v-else />
    </div>
  </Container>
</template>

<script setup lang="ts">
import { formatArticleReadingTime } from '@/components/page-blog/utils'
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
      text: $t('博客'),
      to: '/blog'
    }
  ]

  if (articleTag.value && articleTag.value?.slug) {
    defaultBreadcrumbs.push({ separator: true })
    defaultBreadcrumbs.push({
      text: articleTag.value.name,
      to: `/blog?tag=${articleTag.value?.slug}`
    })
  }

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
    return `${(level - 2) * 20}px`
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
onMounted(() => {
  if (import.meta.client) {
    if (article.value && article.value?.article) {
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

    onBeforeUnmount(() => {
      if (observer) {
        observer.disconnect()
      }
    })
  }
})

const handleDownload = async () => {
  await initializeDownload()
  triggerAutoDownload()
}

</script>

<style lang="scss">
html {
  scroll-behavior: smooth;
  scroll-padding-top: 80px; /* 全局生效，顶部留 80px */
}

.blog-article {
  a {
    // 继承父元素颜色
    color: inherit;
  }

  display: flex;
  flex-direction: column;
  gap: 20px;
  
  font-size: 16px;

  h1 {
    color: var(--text-text-primary, #111213);
    font-size: 34px;
    font-weight: 600;
  }

  h2 {
    color: var(--text-text-primary, #111213);
    font-size: 28px;
    font-weight: 600;
  }

  h3 {
    color: var(--text-text-primary, #111213);
    font-size: 24px;
    font-weight: 600;
  }

  h4 {
    color: var(--text-text-primary, #111213);
    font-size: 20px;
    font-weight: 600;
  }

  p {
    color: var(--text-text-primary, #111213);
    font-weight: 400;
  }

  a {
    color: var(--blue-500, #11A3FD);
    font-weight: 400;
    line-height: 30px;
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: 25%;
    text-underline-position: from-font;
  }

  em {
    color: #000;
    font-weight: 400;
    line-height: 30px;
  }

  ol, ul {
    padding: 20px;
    padding-left: 30px;
  }

  ol li::marker {
    content: counter(list-item) " ";
    color: #111213;
  }

  li {
    line-height: 1.5;
  }

  img {
    width: 100%;
  }

  b {
    font-weight: 700;
  }

  table {
    border: 1px solid #F1F5F8;
    border-collapse: collapse;
    thead {
      background-color: #F1F5F8;
      height: 50px;
      text-align: left;

      th {
        color: var(--text-text-primary, #111213);
        font-size: 16px;
        font-weight: 600;
        
      }
    }

    th, td {
      border: none;
      padding: 0 20px;
    }

    tr {
      height: 54px;
    }

    tr:not(:last-child) {
      border-bottom: 1px solid var(--netural-100, #F1F5F8);
    }
  }
  
  iframe {
    aspect-ratio: 16 / 9 !important;
  }
}

.border-bottom {
  border-bottom: 1px solid rgba(0, 0, 0, 0.10);
}

.border-top {
  border-top: 1px solid rgba(0, 0, 0, 0.10);
}

.directory-ul {
  li:first-child a {
    border-top: 0;
  }
}

.directory {
  color: var(--text-text-secondary, #34393D);
  font-family: Archivo;
  font-size: 14px;
  padding-top: 16px;
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

.aside-tip {
  color: var(--blue-500, #11A3FD);
  font-feature-settings: 'liga' off, 'calt' off;
  font-family: Archivo;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 21px */
  letter-spacing: -0.042px;
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: 6%; /* 0.84px */
  text-underline-offset: auto;
  text-underline-position: from-font;
}

@media (max-width: 1440px) {
  .more-articles a:last-child {
    display: none;
  }
}
</style>
