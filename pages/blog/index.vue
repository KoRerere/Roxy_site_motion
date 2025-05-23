<template>
  <BgEffect />

  <main class="relative z-2 pt-[132px]" ref="mainRef">
    <div v-if="status === 'pending'" class="flex justify-center items-center w-full h-[calc(100dvh-132px)]">
      <ProgressSpinner 
        style="width: 50px; height: 50px" 
        strokeWidth="8" 
        fill="transparent"
        animationDuration=".5s" 
        aria-label="Loading..."
      />
    </div>
    <template v-else-if="status === 'success'">
      <!-- 当没有文章的时候 -->
      <template v-if="blogUnpublish">
        <div class="flex flex-col items-center justify-center">
          <img src="/blog-coming-soon.png" />
          <p class="text-primary text-28px leading-[1.2] md:text-h3 font-700 font-[Archivo]">Coming Soon</p>
          <p class="text-primary font-400 text-4 md:text-body">The project is coming soon, please stay tuned</p>
          <NuxtLinkLocale to="/" class="mt-6 mb-150px text-sub-title text-white py-3 px-6 bg-[#11A3FD] rounded-2">
            {{ $t('返回首页') }}
          </NuxtLinkLocale>
        </div>
      </template>
      
      <template v-else>
        <section class="flex flex-col gap-4">
          <div class="text-[#12A3FC] text-center text-[16px] font-700 font-[Archivo]">
            <span class="inline-block py-1 px-6 border-1 border-[#12A3FC] border-solid rounded-50px bg-[rgba(18_163_252/0.1)]">
              {{ $t('指纹浏览器') }}
            </span>
          </div>
          <h1 class="text-primary text-center text-28px leading-[1.2] md:text-h2 font-700 font-[Archivo]">
            RoxyBrowser Blog
          </h1>
          <div class="text-center text-primary text-4 md:text-body">
            Keeps you stay ahead in digital security
          </div>
        </section>
        
        <section class="mt-10 flex justify-center">
          <Search v-model="requestParams.search" />
        </section>

        <section class="fqa-container pt-10 pb-8">
          <div class="flex justify-center">
            <TagsBar :tags="tags" v-model="requestParams.tag" />
          </div>
        </section>

        <Container tag="section">
          <div class="grid xl:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 lg:gap-x-4 md:gap-x-3 gap-y-15">
            <Card v-for="article in posts.posts" :article="article" :key="article.id" />
          </div>
          <div class="my-15 flex justify-center blog-pagination">
            <Paginator 
              :alwaysShow="false"
              :totalRecords="totalRecords"
              @page="updatePage" 
              :rows="9" 
            />
          </div>
        </Container>

        <PanelDownload2 tag="section" />
      </template>
    </template>
    <template v-else-if="status === 'error'">
      <Error />
    </template>
  </main>
</template>

<script setup lang="ts">
import Search from '@/components/page-blog/search.vue'
import TagsBar from '@/components/page-blog/tags-bar.vue'
import { DEFAULT_BLOG_POST_LIMIT } from '@/constants/langs'
import Card from '@/components/page-blog/card.vue'
import Paginator from 'primevue/paginator'
import Error from '@/components/page-blog/error.vue'

const { locale } = useRxI18n()
const route = useRoute()
const router = useRouter()
const { $ghost } = useNuxtApp()
const localePath = useLocalePath()

useBackTop(useTemplateRef('mainRef'))

const defaultQuery = {
  page: 1,
  limit: DEFAULT_BLOG_POST_LIMIT,
  tag: '',
  search: ''
}

const requestParams = reactive({ ...defaultQuery });

const loading = ref(false);

function updatePage(page) {
  router.push({
    query: {
      ...route.query,
      page: page.page + 1
    }
  })
}

watch(() => route.query, () => {
  requestParams.tag = route.query.tag || defaultQuery.tag;
  requestParams.page = route.query.page || defaultQuery.page;
  requestParams.search = route.query.search || defaultQuery.search;
}, { immediate: true })

const { data: posts, status } = useAsyncData('posts', async () => {
  try {
    loading.value = true;
    
    const params = toRaw(requestParams)
    if (!import.meta.client) { // 在服务端的时候还要再处理一次
      Object.assign(params, route.query)
    }

    const response = await $ghost.posts.browse(params, {
      language: locale.value
    });

    return response;
  } catch (err) {
    console.error('Error fetching posts:', err);
    // 处理错误，例如返回一个默认值或抛出错误
    return [];
  } finally {
    loading.value = false;
  }
}, {
  default: () => ({ posts: [] }),
  watch: [requestParams]
})

const totalRecords = computed(() => {
  return posts.value.meta?.pagination?.total || 0
})

const { data: tags } = useAsyncData('tags', async () => {
  try {
    const response = await $ghost.tags.browse({}, {
      language: locale.value
    });

    if (requestParams.tag !== '' && !response.find(tag => tag.slug === requestParams.tag)) {
      if (import.meta.client) {
        router.push({
          path: localePath('/blog'),
          query: {
            ...route.query,
            tag: ''
          }
        })
      } else {
        await navigateTo({
          path: localePath('/blog'),
          query: {
            ...route.query,
            tag: ''
          }
        })
      }
    }

    return response;
  } catch (err) {
    console.error('Error fetching tags:', err);
    return [];
  }
}, {
  default: () => [],
  watch: [requestParams]
})

const blogUnpublish = computed(() => {
  return !requestParams.tag && totalRecords.value === 0
})
</script>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(180deg, #F2FBFF 0%, #FFF 100%);
  height: 100%;
}

.blog-pagination {
  :deep(.p-paginator-first) {
    display: none;
  }
  :deep(.p-paginator-last) {
    display: none;
  }

  :deep(.p-paginator-next) {
    color: black;
    border-radius: 8px;
  }

  :deep(.p-paginator-prev) {
    color: black;
    border-radius: 8px;
  }

  :deep(.p-paginator-prev.p-disabled) {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.2);
  }

  :deep(.p-paginator-next.p-disabled) {
    cursor: not-allowed;
    color: rgba(0, 0, 0, 0.2);
  }

  :deep(.p-paginator-page) {
    border-radius: 8px;
    border: 1px solid #C7D1D6;
  }

  :deep(.p-paginator-page.p-paginator-page-selected) {
    background: #11A3FD;
    color: #FFF;
    border: none;
  }

  :deep(.p-paginator) {
    padding: 0;
  }
}
</style>