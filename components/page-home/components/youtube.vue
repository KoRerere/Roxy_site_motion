<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const { locale } = useRxI18n()

// const videoUrl = computed(() => {
//   return locale.value === 'zh'
//     ? 'https://player.bilibili.com/player.html?bvid=BV1rTqWBxEFq&page=1&autoplay=0'
//     : 'https://www.youtube.com/embed/P881zIopTjY?autoplay=0'
// })
const videoUrl = ref<string>()

const mediaHome = computed(() => {
  return locale.value === 'zh'
    ? 'https://space.bilibili.com/3690978955233294'
    : 'https://www.youtube.com/@RoxyBrowser'
})

const target = useTemplateRef('target')
useIntersectionObserver(
  target,
  ([entry], observerElement) => {
    if (!videoUrl.value && entry?.isIntersecting) {
      videoUrl.value = locale.value === 'zh'
        ? 'https://player.bilibili.com/player.html?bvid=BV1rTqWBxEFq&page=1&autoplay=0'
        : 'https://www.youtube.com/embed/P881zIopTjY?autoplay=0'
    }
  },
)
</script>

<template>
  <Container>
    <div ref="target" class="text-primary py-10 flex flex-col gap-9 justify-center lg:(py-20 flex-row gap-104px) xl:px-10">
      <div class="flex flex-1 flex-col items-center justify-center lg:items-start">
        <h2 class="text-6 font-700 text-center lg:text-h4 en-US:font-[Archivo] lg:text-left">
          {{ $t('🚀 行业认可 — RoxyBrowser 荣获知名科技创作者 RandomButCool 推荐') }}
        </h2>
        <p class="text-3.5 mt-2 text-center lg:text-body lg:mt-5 lg:text-left">
          {{ $t('RoxyBrowser 深受全球用户信赖，并因其快速、安全、可靠的浏览体验而持续获得认可。') }}
        </p>
        <a class="text-3.5 text-[#11A3FD] leading-24px font-500 flex gap-1 cursor-pointer items-center lg:text-4.5 lg:mt-10 md:mt-2" :href="mediaHome" target="_blank">
          {{ $t('更多 RoxyBrowser 视频') }}
          <RxIcon name="base/rx_ic_chevron_right" size="20" />
        </a>
      </div>
      <div class="rounded-4.5 h-391px w-full relative overflow-hidden lg:w-446px md:h-520px">
        <iframe
          width="100%"
          height="100%"
          :src="videoUrl"
          title="video player"
          frameborder="0"
          loading="lazy"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
        />
      </div>
    </div>
  </Container>
</template>
