<script setup lang="ts">
import { debounce, isString } from 'es-toolkit'
import { RxIcon } from '@/components/rx-icon'
import Accordion from './Accordion/Accordion.vue'
import AccordionItem from './Accordion/AccordionItem.vue'

const props = defineProps<{
  defaultActive?: number
  /** 为 true 时跳过绝对定位高度 hack（博客等页面避免 hydration 后布局错乱） */
  staticLayout?: boolean
  fqaList: {
    title: string
    desc: string | Component | string[]
  }[]
  /** 手风琴外层容器额外类，供单页覆盖 margin 等 */
  class?: string
  /** 单条 FAQ 额外类，供单页覆盖 padding 等 */
  itemClass?: string
  /** 单条 FAQ 标题 h3 额外类，供单页覆盖字体等 */
  itemTitleClass?: string
  /** 单条 FAQ 正文 p 额外类，供单页覆盖字体等 */
  itemContentClass?: string
  /** 单条 FAQ 答案区容器额外类，供单页覆盖问题与答案间距等 */
  itemContentWrapClass?: string
}>()

const emit = defineEmits(['change'])

const faqRef = ref()

const fqaList = computed(() => {
  return props.fqaList.map((item) => {
    return {
      ...item,
      desc: [].concat(item.desc),
    }
  })
})

const initFqaHeight = debounce(async () => {
  if (props.staticLayout)
    return
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

watch(() => props.defaultActive, (newVal) => {
  if (newVal === -1) {
    faqRef.value.closeAll()
  }
  else {
    faqRef.value.setActiveItem(newVal)
  }
})

function handleChange(newVal) {
  setTimeout(() => {
    initFqaHeight()
  }, 50)
  emit('change', newVal)
}

onMounted(() => {
  initFqaHeight()
  window.addEventListener('resize', initFqaHeight)
})

onUnmounted(() => {
  window.removeEventListener('resize', initFqaHeight)
})

defineExpose({
  setActiveItem: (newVal) => {
    faqRef.value.setActiveItem(newVal)
    setTimeout(() => {
      initFqaHeight()
    }, 50)
  },
  closeAll: () => {
    faqRef.value.closeAll()
    setTimeout(() => {
      initFqaHeight()
    }, 50)
  },
})
</script>

<template>
  <div :class="cn('flex-1 max-w-860px w-full transition-min-height duration-200 relative xl:max-w-auto', $props.class)">
    <Accordion ref="faqRef" :default-active class="pr-3 w-full left-0 top-0" @change="handleChange">
      <AccordionItem
        v-for="(c, idx) in fqaList"
        :key="idx"
        :value="idx"
        :class="cn('group py-5 border-x-0 border-b-1 border-t-0 border-b-[#C7D1D6] border-solid cursor-pointer md:pb-28px md:pr-6 md:pt-24px', itemClass)"
      >
        <template #trigger="{ isTrigger }">
          <h3 class="text-16px text-primary leading-30px font-[Inter] font-500 flex w-full items-center justify-between md:text-18px">
            {{ c.title }}
            <span class="ml-6 rounded-2 bg-[#F5F5F5] flex-cc shrink-0 size-6 transition-all duration-200 group-hover:bg-[#EDEDED]">
              <RxIcon v-if="isTrigger" name="base/rx_ic_minus" />
              <RxIcon v-else name="base/rx_ic_plus" />
            </span>
          </h3>
        </template>
        <template #content>
          <div class="pt-3 md:pt-5">
            <template v-for="(text, textIdx) in c.desc" :key="`${idx}-${textIdx}`">
              <!-- Ghost FAQ 答案为 <p> HTML，不可再包一层 <p>，否则 hydration mismatch -->
              <div
                v-if="isString(text)"
                class="text-14px text-secondary whitespace-pre-line md:text-16px max-md:leading-26px md:leading-26px [&_p]:m-0"
                v-html="text"
              />
              <component :is="text" v-else />
            </template>
          </div>
        </template>
      </AccordionItem>
    </Accordion>
  </div>
</template>
