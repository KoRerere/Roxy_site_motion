<script setup lang="ts">
import Card from '@/components/page-blog/card.vue'
import { RxIcon } from '@/components/rx-icon'

const { $ghost } = useNuxtApp()
const { locale, $t } = useRxI18n()
const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()

const slug = route.params.slug as string
const page = computed(() => Number(route.query.page) || 1)

const authorKey = computed(() => `blog-author-${slug}-${locale.value}-${page.value}`)

interface AuthorPagePayload {
  author: any
  posts: any[]
  meta?: any
}

const { data, status, error } = await useAsyncData(
  authorKey,
  async () => {
    const res = await $ghost.authors.read(slug, { language: locale.value }, { page: page.value, limit: 9 })
    return res as AuthorPagePayload
  },
  { default: () => null },
)


if (error.value) {
  // 勿在 navigateTo 后再 throw，否则客户端易出现 Uncaught (in promise) H3Error
  await navigateTo(localePath('/blog'), { replace: true })
}

useBackTop(useTemplateRef('mainRef'))

const author = computed(() => data.value?.author)
const postsList = computed(() => data.value?.posts ?? [])
const totalRecords = computed(() => data.value?.meta?.pagination?.total ?? 0)
const totalPages = computed(() => data.value?.meta?.pagination?.pages ?? 0)

const authorLinkedInHref = computed(() => {
  const w = author.value?.website
  if (w && /linkedin\.com/i.test(w))
    return w
  return ''
})

const authorBio = computed(() => {
  if (!author.value)
    return ''
  return locale.value === 'zh' ? author.value.location : author.value.bio
})

function plainBio(html: string | undefined) {
  if (!html)
    return ''
  return html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 160)
}

useSeoMeta({
  title: () =>
    author.value?.name
      ? `${author.value.name} — ${$t('博客')}`
      : $t('博客'),
  description: () => plainBio(author.value?.bio) || $t('博客文章'),
})

function updatePage(p: { page: number }) {
  router.push({
    path: route.path,
    query: {
      ...route.query,
      page: p.page + 1,
    },
  })
  setTimeout(() => {
    window.scrollTo(0, 0)
  }, 100)
}

const articlesHeading = computed(() =>
  $t('该作者的全部文章', { name: author.value?.name || '' }),
)
</script>

<template>
  <main ref="mainRef" class="blog-author-page pt-20 relative z-2">
    <BgEffect />
    <div v-if="status === 'pending'" class="flex h-[calc(100dvh-132px)] w-full items-center justify-center">
      <RxSpinner size="50px" />
    </div>
    <template v-else-if="status === 'success' && author">
      <section
        class="author-hero border-b border-[#e2e9ee] border-solid"
      >
        <div
          class="bg-[radial-gradient(ellipse_90%_80%_at_50%_100%,rgba(63,149,255,0.55)_0%,rgba(103,116,255,0.25)_45%,transparent_72%)] opacity-[0.12] pointer-events-none inset-0 absolute"
          aria-hidden="true"
        />
        <div class="mx-auto px-5 py-8 flex flex-col gap-5 max-w-1280px items-center relative lg:px-20 md:(py-10 flex-row gap-9 items-start) xl:px-28">
          <img
            v-if="author.profile_image"
            :src="author.profile_image"
            alt=""
            class="rounded-full shrink-0 h-100px w-100px object-cover md:(h-120px w-120px)"
          >
          <div
            v-else
            class="rounded-full bg-[#f4f5f6] flex shrink-0 h-100px w-100px items-center justify-center md:(h-120px w-120px)"
          >
            <RxIcon name="base/rx_ic_logo_transparent" size="40" />
          </div>
          <div class="flex flex-col gap-7 max-w-[650px] w-full items-center md:items-start">
            <div class="text-center flex flex-col gap-4 w-full md:text-left">
              <h1 class="text-20px text-[#111213] leading-none font-[Inter] font-700 md:text-32px">
                {{ author.name }}
              </h1>
              <div
                v-if="authorBio"
                class="author-bio text-16px text-[#111213] leading-normal font-[Inter] font-400 [&_a]:text-[#11a3fd]"
                v-html="authorBio"
              />
            </div>
            <a
              v-if="authorLinkedInHref"
              :href="authorLinkedInHref"
              target="_blank"
              rel="noopener noreferrer"
              class="rounded-[3px] bg-white inline-flex shrink-0 h-6 w-6 items-center justify-center overflow-hidden"
              aria-label="LinkedIn"
            >
              <RxIcon name="blog/rx_accounts_linkedin" size="24" />
            </a>
            <span
              v-else
              class="rounded-[3px] bg-white opacity-60 inline-flex shrink-0 h-6 w-6 items-center justify-center overflow-hidden"
              aria-label="LinkedIn"
            >
              <RxIcon name="blog/rx_accounts_linkedin" size="24" />
            </span>
          </div>
        </div>
      </section>

      <Container tag="section" class="pb-20 pt-10 md:pt-15">
        <h2
          class="text-26px text-[#111213] leading-9 font-[Archivo] font-700 mb-6 px-1 text-center md:(text-36px leading-12 mb-12)"
        >
          {{ articlesHeading }}
        </h2>
        <div class="xs:grid-cols-1 gap-y-10 grid lg:gap-x-4 md:gap-y-15 md:grid-cols-2 xl:grid-cols-3">
          <Card
            v-for="article in postsList"
            :key="article.id"
            :article="article"
            :hide-author="true"
            :hide-read-time="false"
          />
        </div>
        <div v-if="totalPages > 1" class="mb-8 mt-12 flex justify-center">
          <RxPaginator
            :first="9 * (page - 1)"
            :always-show="false"
            :total-records="totalRecords"
            :rows="9"
            @page="updatePage"
          />
        </div>
      </Container>
    </template>
    <div
      v-else-if="status === 'error'"
      class="py-20 flex flex-col gap-4 items-center justify-center"
    >
      <NuxtLinkLocale to="/blog" class="text-[#11a3fd] font-500">
        {{ $t('查看所有博客') }}
      </NuxtLinkLocale>
    </div>
  </main>
</template>

<style lang="scss" scoped>
.blog-author-page {
  :deep(.blog-author-breadcrumb) {
    color: var(--colors-text-text-tertiary, #575d60);
  }
}

.author-hero {
  position: relative;
  overflow: hidden;
}

.author-bio :deep(p) {
  margin: 0;
}

.author-bio :deep(p + p) {
  margin-top: 0.5em;
}
</style>
