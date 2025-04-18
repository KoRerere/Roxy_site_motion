<template>
  <div class="relative z-2">
    <div class="mt-[164px]">
      <div class="flex flex-col gap-2">
        <div class="text-[#12A3FC] text-center text-[16px] font-700 font-[Archivo]">Antidetect Browser</div>
        <h1 class="text-[#2E3A48] text-center text-[56px] font-700 font-[Archivo]">RoxyBrowser Blog</h1>
        <div class="text-center text-[#042144] text-[16px]">Keeps you stay ahead in digital security</div>
      </div>
      
      <div class="mt-[60px] flex justify-center">
        <Search />
      </div>

      <div class="mt-[32px] flex justify-center">
        <TagsBar :tags="tags" />
      </div>
      
      <div class="grid xl:grid-cols-3 md:grid-cols-2 xs:grid-cols-1 lg:gap-x-4 md:gap-x-3 gap-y-[60px] mt-[32px]">
        <Card v-for="article in posts.posts" :article="article" :key="article.id" />
      </div>
      <div class="mt-[60px] flex justify-center">
        <div class="w-[320px] blog-pagination">
          <!-- <v-pagination :length="posts.meta?.pagination?.pages" @update:model-value="updatePage"></v-pagination> -->
        </div>
      </div>
    </div>
  </div>

  <div class="absolute top-0 left-0 w-full h-[465px] z-1">
    <div class="bg-gradient"></div>
  </div>
</template>

<script setup lang="ts">
import Search from './components/search.vue'
import TagsBar from './components/tags-bar.vue'
import { ghost } from '@/api'
import { DEFAULT_BLOG_POST_LIMIT } from '@/constants/langs'
import Card from './components/card.vue'

const { locale } = useRoxyI18n()
const route = useRoute()
const router = useRouter()

const requestParams = reactive({
  page: 1,
  limit: DEFAULT_BLOG_POST_LIMIT,
  tag: '',
  search: ''
});

const loading = ref(false);

function updatePage(page) {
  router.push({
    query: {
      ...route.query,
      page: page
    }
  })
}

watch(() => route.query, () => {
  if (route.query) {
    Object.entries(route.query).forEach(([key, value]) => {
      if (requestParams[key] !== value) {
        requestParams[key] = value; 
      }
    })
  }
})

const { data: posts } = useAsyncData('posts', async () => {
  try {
    loading.value = true;
    
    const params = toRaw(requestParams)
    if (!import.meta.client) { // 在服务端的时候还要再处理一次
      // Object.entries(route.query).forEach(([key, value]) => {
      //   if (params[key] !== value) {
      //     params[key] = value; 
      //   }
      // })
      Object.assign(params, route.query)
    }
    const response = await ghost.posts.browse(params);
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
  watch: [requestParams, route]
})

const { data: tags } = useAsyncData('tags', async () => {
  try {
    const response = await ghost.tags.browse();
    console.log("response", response)
    return response;
  } catch (err) {
    console.error('Error fetching tags:', err);
    return [];
  }
}, {
  default: () => [],
  watch: [locale]
})
</script>

<style lang="scss" scoped>
.bg-gradient {
  background: linear-gradient(180deg, #F2FBFF 0%, #FFF 100%);
  height: 100%;
}

.blog-pagination {
  :deep(.v-btn--size-default) {
    --v-btn-height: 24px;
  }

  :deep(.v-btn__overlay) {
    z-index: 0;
  }

  :deep(.v-pagination__prev),
  :deep(.v-pagination__item),
  :deep(.v-pagination__next) {
    margin: 0;
  }

  :deep(.v-pagination__list) {
    align-items: center;
    gap: 6px;
  }

  :deep(.v-pagination__item--is-active .v-btn__overlay) {
    background: var(--blue-500, #11A3FD);
    opacity: 1;
  }

  :deep(.v-btn--disabled) {
    border: none !important;
  }

  :deep(.v-btn) {
    border: 1px solid var(--border-border-inactive, #C7D1D6);
  }

  :deep(.v-pagination__item--is-active .v-btn),
  :deep(.v-pagination__next .v-btn),
  :deep(.v-pagination__prev .v-btn) {
    border: none;
  }

  :deep(.v-pagination__item--is-active .v-btn__content) {
    z-index: 1;
    color: #FFF;
  }

  :deep(.v-btn__content) {
    font-size: 12px;
  }

  :deep(.v-pagination__item) {
    border-radius: 8px;
    background: #FFF;
  }
}
</style>