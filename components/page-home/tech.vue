<script setup>
import { useIntersectionObserver } from '@vueuse/core'
import { ref } from 'vue'
import Cursor from './components/Cursor.vue'
import FingerprintTechnologyCanvas from './components/FingerprintTechnologyCanvas.vue'
import HyperMotionText from './components/HyperMotionText.vue'

const breakpoints = useRxBreakpoints()
const mdWidth = breakpoints.smallerOrEqual('md')

const duch = computed(() => {
  if (!mdWidth.value) {
    return `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,###,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,########################,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,############,,,,,,,#############,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,#######,,,,,,,,,,,,,,,,,,,,,,,#######,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,##,,,,,,,,,,,##########,,,,,,,,,,##,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,########################,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,##########,,,,,,,,,,,,##########,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,#######,,,,,,,,,,,,,,,,,,,,,,,,#######,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,######,,,,,,,###############,,,,,,,,######,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,#####,,,,,,########################,,,,,,#####,,,,,,,,,,,,,,
,,,,,,,,,,,,#####,,,,,#######,,,,,,,,,,,,,,,########,,,,,#####,,,,,,,,,,,,
,,,,,,,,,,,####,,,,,#####,,,,,,,,,,,,,,,,,,,,,,,######,,,,,####,,,,,,,,,,,
,,,,,,,,,,,,##,,,,#####,,,,,,###############,,,,,,,#####,,,,##,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,####,,,,,#####################,,,,,#####,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,####,,,,######,,,,,,,,,,,,,,#####,,,,,####,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,####,,,,#####,,,,,,######,,,,,,#####,,,,####,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,####,,,,####,,,,,############,,,,,####,,,,####,,,,,,,,,,,,,,
,,,,,,,,,,,,,,####,,,####,,,,#####,,,,,######,,,,####,,,####,,,,,,,,,,,,,,
,,,,,,,,,,,,,####,,,,###,,,,####,,,,,,,,,#####,,,####,,,,####,,,,,,,,,,,,,
,,,,,,,,,,,,,####,,,,###,,,,###,,,,###,,,,####,,,,###,,,,####,,,,,,,,,,,,,
,,,,,,,,,,,,,####,,,####,,,,###,,,,###,,,,,###,,,,###,,,,####,,,,,,,,,,,,,
,,,,,,,,,,,,,####,,,,###,,,,###,,,,####,,,,####,,,,,,,,,####,,,,,,,,,,,,,,
,,,,,,,,,,,,,####,,,,###,,,,####,,,,###,,,,,#####,,,,,#####,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,###,,,,####,,,####,,,,#####,,,,#############,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,####,,,,###,,,,####,,,,,####,,,,,,,#####,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,###,,,,####,,,,####,,,,,#####,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,###,,,,,####,,,,#####,,,,,#########,,###,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,####,,,,,#####,,,,,,############,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,#####,,,,,#####,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,#####,,,,,#######,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,####,,,,,,,,#######,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,RoxyBrowser creates a unique digital identity for each account,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`
  }
  else {
    return `,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,############,,,,,,,,,,,,,,
,,,,,,,,,,####,,,,,,,,,,,!###!,,,,,,,,,,
,,,,,,,,,,,,,,############,,,,,,,,,,,,,,
,,,,,,,,,,####,,,,,,,,,,,,####,,,,,,,,,,
,,,,,,,,###,,,############,,,###,,,,,,,,
,,,,,,###,,###:,,,,,,,,,,####,,###,,,,,,
,,,,,,,,,,##,,,##########,,,##,,,,,,,,,,
,,,,,,,,;##,,##!,,,,,,,,###,,##,,,,,,,,,
,,,,,,,,##,,##,,########,,##,,##,,,,,,,,
,,,,,,,##,,##,,##,,,,,,##,,##,,##,,,,,,,
,,,,,,,##,,##,,##,,##,,##,,#:,,##,,,,,,,
,,,,,,,##,,##,,##,,##:,,###,####,,,,,,,,
,,,,,,,,##,,##,,##,,=##,,,,;,,,,,,,,,,,,
,,,,,,,,,#,,,##,,###,,########,,,,,,,,,,
,,,,,,,,,,,,,,##,,,###,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,!#,,,,,###,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`
  }
})

const textContainer = useTemplateRef('textContainer')
const showText = ref(false)
useIntersectionObserver(textContainer, ([{ isIntersecting }]) => {
  showText.value = isIntersecting
})

const { $t } = useRxI18n()

const list = computed(() => {
  return [
    {
      title: $t('全方位账户防护体系_'),
      content: $t('海量指纹参数供自定义调试，根据业务需求轻松模拟真实环境，为多账号提供完全保障。'),
      // title: 'Account Protection_',
      // content: 'Duis nisi tellus, auctor et cursus id, mollis non neque. Donec vel placerat nisi, vitae molestie ligula. Nam nec metus efficitur, tempor ante at, ornare erat.',
      img: 'home/tech-item-1',
    },
    {
      title: $t('端到端加密传输_'),
      content: $t('采用 AES-256、RSA、SHA-512 等加密协议，实现端到端数据加密隧道。'),
      // title: 'Encryption Transfer_',
      // content: 'Duis nisi tellus, auctor et cursus id, mollis non neque. Donec vel placerat nisi, vitae molestie ligula. Nam nec metus efficitur, tempor ante at, ornare erat.',
      img: 'home/tech-item-2',
    },
    {
      title: $t('行业领先匿名技术_'),
      content: $t('内核通过知名指纹检测工具，包括 Fingerprint，CreepJS 等权威站点。'),
      // title: 'Industry-leading Anonymity_',
      // content: 'Duis nisi tellus, auctor et cursus id, mollis non neque. Donec vel placerat nisi, vitae molestie ligula. Nam nec metus efficitur, tempor ante at, ornare erat.',
      img: 'home/tech-item-3',
    },
  ]
})
</script>

<template>
  <div class="tech-container text-white bg-[#050F1E] w-full">
    <Container
      class="gap-10 grid grid-cols-1 min-h-100vh items-center xl:grid-cols-2 xl:h-100vh xl:max-h-950px"
    >
      <div class="mt-5 flex col-span-1 justify-center xl:mt-0">
        <ClientOnly>
          <FingerprintTechnologyCanvas
            :duch="duch"
            main-color="#41B1FF"
            other-color="#485F7F"
            change-color="#425166"
            :font-size="12"
            :line-height="14"
            :change-number="150"
            :change-speed="80"
          />
        </ClientOnly>
      </div>
      <div class="flex col-span-1 justify-start">
        <div class="flex flex-col items-center md:w-80% xl:w-auto md:items-start">
          <div
            ref="textContainer"
            class="flex min-h-10 w-full items-center justify-center md:justify-start"
          >
            <ClientOnly>
              <template v-if="showText">
                <HyperMotionText
                  tag="h2"
                  class="text-JetBrains-mono text-4 font-400 md:text-6 en-US:font-[JetBrains_Mono] ru-RU:font-[Montserrat]"
                  :text="$t('何以信赖 RoxyBrowser?')"
                  :typing-speed="50"
                  random-text="!@#$%^&*()_+=1234567890abcdefghijkl"
                  :random-refresh-speed="40"
                />
                <Cursor />
              </template>
            </ClientOnly>
          </div>
          <p class="description text-[20px] text-[#ffffff5e] font-400 mt-4 text-center sm:text-left">
            {{ $t('我们通过多种安全措施保护您的在线数据。') }}
          </p>
          <ul class="mt-6 md:mt-4">
            <li
              v-for="item in list"
              :key="item.title"
              class="stack-item py-6 flex flex-col gap-5 relative after:bg-[linear-gradient(90deg,rgba(255,255,255,0)_0%,rgba(255,255,255,1)_20%,rgba(255,255,255,0)_100%)] after:opacity-20 md:flex-row md:gap-22px after:h-px after:w-full after:block after:pointer-events-none after:content-[''] after:bottom-0 after:left-0 after:absolute last:after:hidden"
            >
              <div class="stack-left flex gap-4 w-full">
                <div class="stack-icon flex h-25px items-center justify-center">
                  <img src="/home/tech-icon.svg" alt="" class="max-w-unset select-none" draggable="false">
                </div>
                <div class="stack-content flex flex-col gap-3">
                  <h3 class="caption text-5 text-white leading-[25.6px] font-400 not-italic en-US:font-[JetBrains_Mono] ru-RU:font-[Montserrat]">
                    {{ item.title }}
                  </h3>
                  <p class="details text-14px text-white/60 leading-normal font-400 not-italic">
                    {{ item.content }}
                  </p>
                </div>
              </div>
              <div class="pl-25px flex shrink-0 w-325px md:pl-0 md:w-240px md:justify-end">
                <RxResponsiveImage :name="item.img" class="w-full" alt="" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  </div>
</template>
