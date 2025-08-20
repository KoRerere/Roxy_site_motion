<template>
  <Container tag="section" v-bind="$attrs">
    <div class="flex flex-col items-center xl:flex-row xl:items-start">
      <div class="w-full xl:w-5/12">
        <h2 class="xl:mt-[28px] xl:w-[90%] text-center xl:text-left text-6 leading-[1.2] sm:text-8 lg:text-h3 font-700 font-[Archivo] text-primary">
          {{ $t('常见问题解答') }}
        </h2>
        <p class="mt-2 md:mt-[12px] xl:text-left text-center text-14px leading-normal md:text-body text-primary">
          {{ $t('有疑问？我们随时为您提供帮助。') }}
        </p>
        <div class="hidden xl:block">
          <p class="mt-15 mb-6 font-[Archivo] font-500 text-h5 text-primary">{{ $t('在线技术支持') }}</p>
          <Comp />
        </div>
      </div>

      <div class="relative max-w-860px w-full xl:max-w-auto flex-1 transition-min-height duration-200">
        <Accordion 
            :defaultActive="0" 
            class="px-3 w-full top-0 left-0" 
            ref="faqRef" 
            @change="handleChange"
          >
            <AccordionItem 
              v-for="(c, idx) in fqaList" 
              :key="idx"
              :value="idx"
              class="py-5 md:py-28px cursor-pointer border-b-1px border-b-[#C7D1D6] border-solid border-x-0 border-t-0"
            >
              <template #trigger="{ isTrigger }">
                <h3 class="w-full flex justify-between items-center font-[Archivo] font-500 text-18px leading-32px md:text-h5 text-primary">
                  {{ c.title }}
                  <span class="ml-6">
                    <RxIcon v-if="isTrigger" name="base/rx_ic_minus"  />
                    <RxIcon v-else name="base/rx_ic_plus" />
                  </span>
                </h3>
              </template>
              <template #content>
                <p class="pt-2 md:pt-6 leading-28px text-4 md:text-body whitespace-pre-line text-secondary">
                <template v-if="isString(c.desc)">
                 {{ c.desc }}
                </template>
                <template v-else>
                  <component :is="c.desc" />
                </template>
              </p>
              </template>
            </AccordionItem>
          </Accordion>
      </div>
    </div>

    <div class="!p-0 w-full xl:hidden">
      <p class="mt-10 mb-3 md:mb-6 text-center font-[Archivo] text-4 md:text-26px font-500 leading-6 md:leading-12">
        {{ $t('在线技术支持') }}
      </p>
      <div class="flex justify-center">
        <Comp />
      </div>
    </div>
  </Container>
</template>

<script lang="tsx" setup>
import LiveChat from '@/components/live-chat.vue'
import { NuxtLink } from '#components'
import Accordion from './Accordion/Accordion.vue'
import AccordionItem from './Accordion/AccordionItem.vue'
import { debounce, isString } from 'es-toolkit'
import { RxIcon } from '@/components/rx-icon'

const { telegramLink } = useTelegram()

interface FAQItem {
  title: string
  desc: string | (() => JSX.Element)
}

interface Props {
  fqaList: FAQItem[]
  containerClass?: string
}

const props = defineProps<Props>()

// Fix: 打包后会失效
const Comp = () => <div class='flex gap-3 sm:gap-4'>
  <div 
    class={cn(
      'w-169px h-88px sm:w-160px sm:h-142px',
      'bg-white sm:bg-[#E2E9EE] rounded-10px sm:rounded-3',
      'flex justify-center items-center flex-col'
    )}
  >
    <div class='size-8 sm:size-56px overflow-hidden'>
      <NuxtLink to={telegramLink.value} target="_blank">
        <img src="/home/rx_ic_telegram2.svg" class={'w-full h-full object-cover select-none'} draggable="false" alt="telegram" />
      </NuxtLink>
    </div>
    <div class='font-[Archivo] text-13px md:text-5 font-500 pt-4 text-black text-primary'>Telegram</div>
  </div>
  <div
    class={cn(
      'w-169px h-88px sm:w-160px sm:h-142px',
      'bg-white sm:bg-[#E2E9EE] rounded-10px sm:rounded-3',
      'flex justify-center items-center flex-col'
    )}
  >
    <LiveChat>
      <div class='size-8 sm:size-56px overflow-hidden'>
        <img src="/home/rx_ic_livechat2.svg" class={'w-full h-full object-cover select-none'} draggable="false" alt="Live-chat" />
      </div>
    </LiveChat>
    <div class='font-[Archivo] text-13px md:text-5 font-500 pt-4 text-black text-primary'>Live-chat</div>
  </div>
</div>

const faqRef = ref()

const initFqaHeight = debounce(async () => {
  if (faqRef.value && faqRef.value.accordionRoot) {
    const accordionRoot = faqRef.value.accordionRoot
    const { height } = accordionRoot.getBoundingClientRect()
    const parentNode = accordionRoot.parentElement
    if (parentNode) {
      const minHeight = Number(parentNode.style.minHeight.split('px')[0])
      if (minHeight > height && minHeight - height > 30) {
        parentNode.style.minHeight = `${height}px`
      }
      if (!minHeight || minHeight < height) {
        parentNode.style.minHeight = `${height}px`
      }
    }
    accordionRoot.style.position = 'absolute'
  }
}, 100)

const handleChange = () => {
  setTimeout(() => {
    initFqaHeight()
  }, 50)
}

onMounted(() => {
  initFqaHeight()
  window.addEventListener('resize', initFqaHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', initFqaHeight)
})

</script>