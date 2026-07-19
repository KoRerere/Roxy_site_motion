<script setup lang="ts">
const { public: { isChinaSite } } = useRuntimeConfig()
useSeoMeta({
  title: $t('关于 RoxyBrowser 指纹浏览器，了解团队使命和初衷'),
  description: $t('RoxyBrowser 团队致力于打造安全可靠的指纹浏览器，保护用户隐私，同时不断创新技术，让每一位用户都能安心、高效地上网。'),
})
</script>

<template>
  <div>
    <div class="w-full left-1/2 absolute z-9 -translate-x-1/2 -top-40px lg:-top-100px md:-top-80px xl:-top-200px">
      <img src="/about-us/bg.svg" class="w-full select-none" draggable="false" alt="">
    </div>
    <PageAboutUsBanner />
    <div class="bg-[#F9FAFB] flex flex-col gap-15 lg:gap-100px">
      <ClientOnly><PageAboutUsDataShowcase /></ClientOnly>
      <PageAboutUsWhoWeAre v-if="!isChinaSite" />
      <div class="py-10 bg-white lg:py-15">
        <PageAboutUsOurValues />
      </div>
      <PageAboutUsWhyChoose />
      <PageAboutUsOurVision />
      <Container><CtaDownloadBtnByPanel2 class="!mb-15 !mt-0 !lg:mb-100px" /></Container>
    </div>
  </div>
</template>
