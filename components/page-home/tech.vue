<template>
  <div class="bg-[#050F1E] text-white">
    <Container
      class="min-h-100vh xl:max-h-950px xl:h-100vh grid grid-cols-1 xl:grid-cols-2 items-center gap-10"
    >
      <div class="col-span-1 mt-5 xl:mt-0 flex justify-center">
        <ClientOnly>
          <FingerprintTechnologyCanvas
            :duch="duch"
            :mainColor="'#41B1FF'"
            :otherColor="'#485F7F'"
            :changeColor="'#425166'"
            :fontSize="12"
            :lineHeight="14"
            :changeNumber="150"
            :changeSpeed="80"
          />
        </ClientOnly>
      </div>
      <div class="col-span-1 flex justify-center">
        <div class="flex flex-col items-center md:items-start md:w-80% xl:w-auto">
          <div
            class="flex justify-center md:justify-start items-center min-h-10 w-full"
            ref="textContainer"
          >
            <ClientOnly>
              <template v-if="showText">
                <HyperMotionText
                  tag="h2"
                  class="text-4 md:text-6 font-400 text-chivo-mono"
                  :text="$t('何以信赖 RoxyBrowser?')"
                  :typingSpeed="50"
                  randomText="!@#$%^&*()_+=1234567890abcdefghijkl"
                  :randomRefreshSpeed="40"
                />
                <Cursor />
              </template>
            </ClientOnly>
          </div>
          <p class="text-14px md:text-4 mt-4 text-center sm:text-left text-white/60">
            {{ $t('我们通过多种安全措施保护您的在线数据。') }}
          </p>
          <ul class="mt-6 md:mt-4">
            <li 
              v-for="item in list" 
              class="flex flex-col md:flex-row gap-5 md:gap-22px py-6 relative stack-item"
            >
              <div class="w-full flex gap-4">
                <div class="h-25px flex items-center justify-center">
                  <img src="/home/tech-icon.svg" alt="" class="select-none" draggable="false" />
                </div>
                <div class="flex flex-col gap-2px">
                  <h3 class="text-5 text-nowrap font-400 text-chivo-mono">
                    {{ item.title }}
                  </h3>
                  <p class="text-white/80 text-14px leading-[22.4px]">
                    {{ item.content }}
                  </p>
                </div>
              </div>
              <div class="max-w-325px md:max-w-240px pl-25px md:pl-0 flex md:justify-end">
                <RxResponsiveImage :name='item.img' class="w-full" alt="" />
              </div>
            </li>
          </ul>
        </div>
      </div>
    </Container>
  </div>
</template>

<script setup>
import HyperMotionText from "./components/HyperMotionText.vue";
import Cursor from "./components/Cursor.vue";
import FingerprintTechnologyCanvas from "./components/FingerprintTechnologyCanvas.vue";
import { ref } from "vue";
import { useIntersectionObserver } from "@vueuse/core";

const breakpoints = useRxBreakpoints();
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
,,,,,,Roxybrowser creates a unique digital identity for each account,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,,`
  } else {
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

const textContainer = useTemplateRef("textContainer");
const showText = ref(false);
useIntersectionObserver(textContainer, ([{ isIntersecting }]) => {
  showText.value = isIntersecting;
});

const { $t } = useRxI18n()

const list = computed(() => {
  return [
    {
      title: $t('全方位账户防护体系_'),
      content: $t('海量指纹参数供自定义调试，根据业务需求轻松模拟真实环境，为多账号提供完全保障。'),
      // title: 'Account Protection_',
      // content: 'Duis nisi tellus, auctor et cursus id, mollis non neque. Donec vel placerat nisi, vitae molestie ligula. Nam nec metus efficitur, tempor ante at, ornare erat.',
      img: 'home/tech-item-1'
    },
    {
      title: $t('量子级加密传输_'),
      content: $t('采用 AES-256、RSA、SHA-512 等加密协议，实现端到端数据加密隧道。'),
      // title: 'Encryption Transfer_',
      // content: 'Duis nisi tellus, auctor et cursus id, mollis non neque. Donec vel placerat nisi, vitae molestie ligula. Nam nec metus efficitur, tempor ante at, ornare erat.',
      img: 'home/tech-item-2'
    },
    {
      title: $t('行业领先匿名技术_'),
      content: $t('内核通过知名指纹检测工具，包括 Fingerprint，CreepJS 等权威站点。'),
      // title: 'Industry-leading Anonymity_',
      // content: 'Duis nisi tellus, auctor et cursus id, mollis non neque. Donec vel placerat nisi, vitae molestie ligula. Nam nec metus efficitur, tempor ante at, ornare erat.',
      img: 'home/tech-item-3'
    }
  ]
})
</script>

<style lang="scss" scoped>
.tech-container {
  width: 100%;
  height: 100vh;
  background: #050f1e;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.description {
  font-weight: 400;
  font-size: 20px;
  color: #ffffff5e;
}

.content-container {
  width: 1440px;
  display: flex;
  flex-direction: row;
  flex-direction: flex-start;
  gap: 48px;

  .ascii-container {
    width: 50%;
    height: 100%;
  }
}

.stack-item:not(:last-child) {
  &::after {
    content: "";
    display: block;
    width: 100%;
    height: 1px;
    opacity: 0.2;
    background: linear-gradient(
      90deg,
      rgba(255, 255, 255, 0) 0%,
      rgba(255, 255, 255, 1) 20%,
      rgba(255, 255, 255, 0) 100%
    );
    position: absolute;
    bottom: 0;
    left: 0;
  }

  .stack-left {
    // width: 60%;
    // display: flex;
    // flex-direction: row;
    // gap: 16px;

    .stack-icon {
      height: 25px;
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .stack-content {
      display: flex;
      flex-direction: column;
      gap: 12px;
    }

    .caption {
      color: #fff;
      font-family: "Chivo Mono";
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 25.6px;
    }

    .details {
      color: rgba(255, 255, 255, 0.6);
      font-size: 14px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.5;
    }
  }
}

.text-chivo-mono {
  font-family: 'Chivo Mono';
}
</style>
