<script setup lang="ts">
import type { RxBreadcrumbProps } from '@/components/rx-breadcrumb'
import { motion } from 'motion-v'
import { useRxMaxLg } from '@/composables/useRxBreakpoints'

const isMaxLg = useRxMaxLg()

const { public: { isChinaSite } } = useRuntimeConfig()
const breadcrumbItems: RxBreadcrumbProps['items'] = [
  {
    title: $t('首页'),
    path: '/',
  },
  {
    type: 'separator',
  },
  {
    title: $t('关于我们'),
    path: '/about-us',
    disabled: true,
  },
]
</script>

<template>
  <Container class="mb-74px pt-88px relative relative lg:mb-136px lg:pt-172px lg:z-12">
    <div class="flex flex-col flex-col-reverse gap-5 lg:flex-row lg:gap-84px xl:gap-128px">
      <div class="flex-1">
        <rx-breadcrumb :items="breadcrumbItems" />
        <h1 class="text-7 text-[#111213] font-700 multilingual-text mt-6 lg:text-h2">
          {{ $t('关于 RoxyBrowser') }}
        </h1>
        <div class="text-sub-title text-[#111213] mt-4 flex flex-col lg:text-features-body">
          <p>{{ $t('RoxyBrowser 创立于 2018 年，深耕跨境出海与全球化业务场景，由多名股东与创始团队联合创立。') }}</p>
          <br>
          <p class="whitespace-pre-line en-US:font-600 ru-RU:font-600">
            {{ $t('我们的股东与团队汇聚全球顶尖人才，包括麻省理工学院（MIT）人工智能博士及来自 Google、Meta（Facebook）、阿里巴巴、腾讯等世界级科技公司的专家，打造了真正的国际化团队。') }}
          </p>
        </div>
      </div>
      <div>
        <div v-if="!isMaxLg" class="relative lg:w-422px xl:w-522px">
          <rx-responsive-image name="about-us/office" />
          <div class="w-136px cursor-pointer translate-y-1/2 bottom-0 left-0 absolute -translate-x-1/2">
            <motion.div
              drag
              :while-hover="{ scale: 1.12 }"
              :while-press="{ scale: 1 }"
              :transition="{ duration: 0.8, type: 'spring' }"
              :drag-constraints="{ left: 0, right: 0, top: 0, bottom: 0 }"
              :drag-transition="{ bounceStiffness: 500, bounceDamping: 20 }"
              :drag-elastic="1"
            >
              <rx-responsive-image name="about-us/logo" />
            </motion.div>
          </div>
        </div>
        <div v-else class="flex w-full justify-center">
          <rx-responsive-image name="about-us/office-moblie" />
        </div>
      </div>
    </div>
  </Container>
</template>
