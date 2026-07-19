<script lang="tsx" setup>
import { NuxtLink } from '#components'
import LiveChat from '@/components/live-chat.vue'
import FaqAccordion from './faq-accordion.vue'

defineProps<{
  fqaList: {
    title: string
    desc: string | string[]
  }[]
  containerClass?: string
  /** 左右栏 flex 容器额外类，供单页覆盖列间距等 */
  rowClass?: string
  /** 标题 h2 额外类，供单页覆盖 margin 等 */
  titleClass?: string
  /** 副标题 p 额外类，供单页覆盖 margin 等 */
  subtitleClass?: string
  /** FAQ 手风琴容器额外类，供单页覆盖 margin 等 */
  accordionClass?: string
  /** FAQ 手风琴单条额外类，供单页覆盖 padding 等 */
  accordionItemClass?: string
  /** FAQ 手风琴单条标题额外类，供单页覆盖字体等 */
  accordionItemTitleClass?: string
  /** FAQ 手风琴单条正文额外类，供单页覆盖字体等 */
  accordionItemContentClass?: string
  /** FAQ 手风琴答案区容器额外类，供单页覆盖问题与答案间距等 */
  accordionItemContentWrapClass?: string
  /** PC 在线支持标题额外类，供单页覆盖 margin 等 */
  supportTitleClass?: string
  /** 移动端在线支持标题额外类（xl:hidden 区块），供单页覆盖 margin 等 */
  mobileSupportTitleClass?: string
}>()

const { telegramLink } = useTelegram()

const { public: { isChinaSite } } = useRuntimeConfig()

// Fix: 打包后会失效
function Comp() {
  const tgNode = isChinaSite
    ? null
    : (
        <div
          class={cn(
            'w-169px h-88px sm:w-160px sm:h-142px',
            'bg-white sm:bg-[#E2E9EE] rounded-2.5 sm:rounded-3',
            'flex justify-center items-center flex-col',
          )}
        >
          <div class="size-8 overflow-hidden sm:size-56px">
            <NuxtLink to={telegramLink.value} target="_blank">
              <img src="/home/rx_ic_telegram2.svg" class="h-full w-full select-none object-cover" draggable="false" alt="telegram" />
            </NuxtLink>
          </div>
          <div class="text-13px text-black text-primary font-[Inter] font-500 pt-4 md:text-5">Telegram</div>
        </div>
      )

  return (
    <div class="flex gap-3 sm:gap-4">
      {tgNode}
      <div
        class={cn(
          'w-169px h-88px sm:w-160px sm:h-142px',
          'bg-white sm:bg-[#E2E9EE] rounded-2.5 sm:rounded-3',
          'flex justify-center items-center flex-col',
        )}
      >
        <LiveChat show-before-ready>
          <div class="size-8 overflow-hidden sm:size-56px">
            <img src="/home/rx_ic_livechat2.svg" class="h-full w-full select-none object-cover" draggable="false" alt="Live-chat" />
          </div>
        </LiveChat>
        <div class="text-13px text-black text-primary font-[Inter] font-500 pt-4 md:text-5">Live-chat</div>
      </div>
    </div>
  )
}
</script>

<template>
  <Container tag="section" v-bind="$attrs">
    <div :class="cn('flex flex-col items-center xl:flex-row xl:items-start', rowClass)">
      <div class="w-full xl:w-5/12">
        <h2 :class="cn('text-6 text-primary font-700 multilingual-text text-center lg:text-h3 sm:text-8 max-lg:leading-[1.2] xl:mt-[28px] xl:text-left xl:w-[90%]', titleClass)">
          {{ $t('常见问题') }}
        </h2>
        <p :class="cn('text-14px text-primary mt-2 text-center md:text-body max-md:leading-normal md:mt-3 xl:text-left', subtitleClass)">
          {{ $t('有疑问？我们随时为您提供帮助。') }}
        </p>
        <div class="hidden xl:block">
          <p :class="cn('text-h5 text-primary font-[Inter] font-500 mb-6 mt-15', supportTitleClass)">
            {{ $t('在线技术支持') }}
          </p>
          <Comp />
        </div>
      </div>

      <FaqAccordion
        :fqa-list="fqaList"
        :class="accordionClass"
        :item-class="accordionItemClass"
        :item-title-class="accordionItemTitleClass"
        :item-content-class="accordionItemContentClass"
        :item-content-wrap-class="accordionItemContentWrapClass"
      />
    </div>

    <div class="w-full !p-0 xl:hidden">
      <p :class="cn('text-4 leading-6 font-500 multilingual-text mb-3 mt-10 text-center md:text-26px md:leading-12 md:mb-6', mobileSupportTitleClass)">
        {{ $t('在线技术支持') }}
      </p>
      <div class="flex justify-center">
        <Comp />
      </div>
    </div>
  </Container>
</template>
