<script setup lang="ts">
import Card from '@/components/page-blog/card.vue'
import Error from '@/components/page-blog/error.vue'
import TagsBar from '@/components/page-blog/tags-bar.vue'
import { DEFAULT_BLOG_POST_LIMIT } from '@/constants/langs'

const { locale } = useRxI18n()
const route = useRoute()
const router = useRouter()
const { $ghost } = useNuxtApp()
const localePath = useLocalePath()

/** 从路径解析 /blog/tag-xxx 中的标签 slug（含 /zh/blog 等多语言前缀） */
function getBlogTagSlugFromPath(path: string): string | null {
  const m = path.match(/\/blog\/tag-([^/?]+)/)
  return m?.[1] ?? null
}

const tagQuery = route.query.tag
if (tagQuery !== undefined && tagQuery !== null && String(tagQuery).trim() !== '') {
  const slug = String(Array.isArray(tagQuery) ? tagQuery[0] : tagQuery).trim()
  const pathSlug = getBlogTagSlugFromPath(route.path)
  const restQuery = { ...route.query } as Record<string, string | string[]>
  delete restQuery.tag
  if (route.params.page && restQuery.page === undefined)
    restQuery.page = String(route.params.page)

  if (pathSlug === slug) {
    if (route.query.tag !== undefined)
      await navigateTo({ path: route.path, query: restQuery }, { redirectCode: 301, replace: true })
  }
  else {
    await navigateTo(
      { path: localePath(`/blog/tag-${slug}`), query: restQuery },
      { redirectCode: 301, replace: true },
    )
  }
}

useSeoMeta({
  title: $t('博客'),
  description: $t('RoxyBrowser 博客旨在给你提供专业教程、最新资讯以及关于多账户管理、联盟营销和隐私保护的技巧指南。'),
})

useBackTop(useTemplateRef('mainRef'))

const defaultQuery = {
  page: Number(route.query.page) || 1,
  limit: DEFAULT_BLOG_POST_LIMIT,
  tag: '',
  search: '',
}

const currentTag = computed(() => route.params.slug as string | undefined)

const loading = ref(false)

function updatePage(page: { page: number }) {
  router.push({ path: localePath(currentTag.value ? `/blog/tag-${currentTag.value}/page/${page.page + 1}` : `/blog/page/${page.page + 1}`) })
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)
}

const requestParams = computed(() => {
  return {
    ...defaultQuery,
    tag: currentTag.value || defaultQuery.tag,
    page: route.params.page || defaultQuery.page,
    search: route.query.search || defaultQuery.search,
  }
})

const postsKey = computed(() =>
  `posts-${locale.value}-${requestParams.value.page}-${requestParams.value.tag}-${requestParams.value.search}`,
)
const { data: posts, status } = useAsyncData(postsKey, async () => {
  try {
    loading.value = true
    const params = toRaw(requestParams.value)
    // if (!import.meta.client) { // 在服务端的时候还要再处理一次
    //   Object.assign(params, route.query)
    // }
    const response = await $ghost.posts.browse(params, {
      language: locale.value,
    })
    // console.log('response', response)

    return response
  }
  catch (err) {
    console.error('Error fetching posts:', err)
    // 处理错误，例如返回一个默认值或抛出错误
    return []
  }
  finally {
    loading.value = false
  }
}, {
  default: () => ({ posts: [] }),
})

const totalRecords = computed(() => {
  return posts.value.meta?.pagination?.total || 0
})

const tagsKey = computed(() => `tags-${locale.value}`)
const { data: tags } = useAsyncData(tagsKey, async () => {
  try {
    const response = await $ghost.tags.browse({}, {
      language: locale.value,
    })

    if (requestParams.value.tag !== '' && !response.find(tag => tag.slug === requestParams.value.tag)) {
      if (import.meta.client) {
        router.push({
          path: localePath('/blog'),
          query: {
            ...route.query,
            tag: '',
          },
        })
      }
      else {
        await navigateTo({
          path: localePath('/blog'),
          query: {
            ...route.query,
            tag: '',
          },
        })
      }
    }

    return response
  }
  catch (err) {
    console.error('Error fetching tags:', err)
    return []
  }
}, {
  default: () => [],
  watch: [requestParams],
})

const blogUnpublish = computed(() => {
  return !requestParams.value.tag && totalRecords.value === 0
})
</script>

<template>
  <main ref="mainRef" class="pt-[132px] relative z-2">
    <BgEffect />
    <div v-if="status === 'pending'" class="flex h-[calc(100dvh-132px)] w-full items-center justify-center">
      <RxSpinner size="50px" />
    </div>
    <template v-else-if="status === 'success'">
      <!-- 当没有文章的时候 -->
      <template v-if="blogUnpublish">
        <div class="flex flex-col items-center justify-center">
          <img src="/blog-coming-soon.png">
          <p class="text-28px text-primary font-700 multilingual-text md:text-h3 max-md:leading-[1.2]">
            Coming Soon
          </p>
          <p class="text-4 text-primary font-400 md:text-body">
            The project is coming soon, please stay tuned
          </p>
          <NuxtLinkLocale to="/" class="text-sub-title text-white mb-150px mt-6 px-6 py-3 rounded-2 bg-[#11A3FD]">
            {{ $t('返回首页') }}
          </NuxtLinkLocale>
        </div>
      </template>

      <template v-else>
        <section class="mb-3 flex flex-col gap-4">
          <div class="text-[16px] text-[#12A3FC] font-700 multilingual-text text-center">
            <span class="px-6 py-1 border-1 border-[#12A3FC] rounded-50px border-solid bg-[rgba(18_163_252/0.1)] inline-block">
              {{ $t('指纹浏览器') }}
            </span>
          </div>
          <h1 class="text-28px text-primary font-700 multilingual-text text-center md:text-h2 max-md:leading-[1.2]">
            {{ $t('博客文章') }}
          </h1>
          <div class="text-4 text-primary text-center md:text-body">
            {{ $t('汇集 RoxyBrowser 最新资讯、技巧与使用指南，一站掌握浏览器指纹防护与多账号操作。') }}
          </div>
        </section>

        <!-- <section class="mt-10 px-4 flex justify-center">
          <Search />
        </section> -->

        <section class="fqa-container pb-8 pt-10">
          <div class="flex justify-center">
            <TagsBar :current-tag="currentTag ?? ''" :tags="tags" />
          </div>
        </section>

        <Container tag="section">
          <div class="xs:grid-cols-1 gap-y-15 grid lg:gap-x-4 md:gap-x-3 md:grid-cols-2 xl:grid-cols-3">
            <Card v-for="article in posts.posts" :key="article.id" :article="article" />
          </div>
          <div class="mb-20 mt-12 flex justify-center">
            <RxPaginator
              :first="9 * (Number(requestParams.page) - 1)"
              :always-show="false"
              :total-records="totalRecords"
              :rows="9"
              @page="updatePage"
            />
          </div>
        </Container>
      </template>
    </template>
    <template v-else-if="status === 'error'">
      <Error />
    </template>
  </main>
</template>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(180deg, #f2fbff 0%, #fff 100%);
  height: 100%;
}
</style>
