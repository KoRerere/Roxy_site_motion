<script setup lang="ts">
import PagePartnersPartnerGrid from '@/components/page-partners/PartnerGrid.vue'

useSeoMeta({
  title: $t('RoxyBrowser 合作伙伴'),
  description: $t('加入 Roxybrowser 伙伴生态，解锁指纹浏览器 + 跨境工具 / 支付 / 代理 IP 的协同增长新机遇。'),
})
</script>

<template>
  <div class="bg-white relative overflow-hidden">
    <!-- Background image -->
    <div class="bottom-[-10.94%] left-0 right-0 top-0 absolute z-0 overflow-hidden">
      <img src="/partners/partner-bg-1.jpg" alt="" class="h-80 min-w-full block object-cover">
    </div>

    <!-- Main content -->
    <div class="pb-20 pt-100px relative z-10 lg:pt-130px">
      <!-- Title section -->
      <Container class="mb-10.5 flex flex-col gap-4 items-center lg:mb-12">
        <h1 class="text-h5 text-primary font-[Archivo] font-700 text-center lg:text-h3">
          {{ $t('RoxyBrowser 合作伙伴') }}
        </h1>
        <p class="text-sub-title text-secondary leading-24px text-center max-w-[1064px]">
          {{ $t('加入 Roxybrowser 伙伴生态，解锁指纹浏览器 + 跨境工具 / 支付 / 代理 IP 的协同增长新机遇。') }}
        </p>
      </Container>

      <!-- Partner cards grid -->
      <Container>
        <PagePartnersPartnerGrid />
      </Container>
    </div>
  </div>
</template>
