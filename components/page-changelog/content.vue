<script setup lang="ts">
import { DOMParser } from 'linkedom'

const props = defineProps<{
  item: any
}>()

const { locale } = useRxI18n()

const localeMap = {
  zh: 'zh-CN',
  en: 'en',
  ru: 'ru',
}

const contentLocaleMap = {
  zh: 'upgradeContent',
  en: 'upgradeContentEn',
  ru: 'upgradeContentRu',
}

const newFeatureTips = computed(() => {
  return props.item.newFeatureTips[localeMap[locale.value]]?.map((item: any) => item.content) || []
})

function parseHTML(html: string) {
  const raw = (html ?? '').trim()
  const hasHtmlTag = /<html[\s>]/i.test(raw)
  const wrapped = hasHtmlTag
    ? raw
    : `<!DOCTYPE html><html><body>${raw}</body></html>`
  const doc = new DOMParser().parseFromString(wrapped, 'text/html')
  if (!(doc as any).documentElement || !doc.body) {
    const fallback = new DOMParser().parseFromString(`<!DOCTYPE html><html><body>${raw}</body></html>`, 'text/html')
    return fallback
  }
  return doc
}

const medias = computed(() => {
  return newFeatureTips.value.flatMap((html: string) => {
    const doc = parseHTML(html)
    const videoDirect = Array.from(doc.querySelectorAll('video[src]') as NodeListOf<HTMLVideoElement>, v => ({ type: 'video' as const, src: v.src }))
    const videoSource = Array.from(doc.querySelectorAll('video source[src]') as NodeListOf<HTMLSourceElement>, s => ({ type: 'video' as const, src: s.src }))
    const images = Array.from(doc.querySelectorAll('img[src]') as NodeListOf<HTMLImageElement>, img => ({ type: 'image' as const, src: img.src }))

    return [...videoDirect, ...videoSource, ...images]
  })
})

const upgradeContent = computed(() => {
  if (newFeatureTips.value.length === 0) {
    const html = props.item[contentLocaleMap[locale.value]]
    const doc = parseHTML(html)

    // 遍历整个文档，把所有的内联样式全部删除
    doc.querySelectorAll('*').forEach((element: Element) => {
      element.removeAttribute('style')
    })

    return doc.body?.innerHTML ?? ''
  }

  return newFeatureTips.value.map((html: string) => {
    // const parser = new DOMParser()
    const doc = parseHTML(html);

    // 1) 删除所有媒体元素
    (doc.body ?? (doc as any)).querySelectorAll('img,video,audio,source,picture,iframe,embed').forEach((el) => {
      el.remove()
    })

    // 2) 删除空标签（多轮，直到没有可删的空元素）
    function removeEmptyElements(root: Document | Element) {
      const toRemove: Element[] = []
      const isEmpty = (el: Element) => {
        const text = (el.textContent ?? '').replace(/\u00A0/g, '').trim()
        return el.children.length === 0 && text === ''
      }

        ; (root as Element).querySelectorAll?.('*').forEach((el) => {
        if (isEmpty(el)) {
          toRemove.push(el)
        }
      })

      toRemove.forEach((el) => {
        el.remove?.()
      })

      return toRemove.length > 0
    }
    // let changed = true
    // do {
    //   changed = removeEmptyElements(doc)
    // } while (changed)

    const scope = (doc.body ?? (doc as any)) as Element
    while (true) {
      if (!removeEmptyElements(scope))
        break
    }

    // 3) 删除所有内联样式
    scope.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('style')
    })

    return (doc.body?.innerHTML ?? scope.innerHTML)
  }).join('')
})
</script>

<template>
  <div v-if="medias.length > 0" class="zoom-images pb-2 flex gap-3 items-start overflow-x-auto">
    <div v-for="src in medias" :key="src" class="border-1 border-[#E2E9EE] rounded-2 border-solid h-115px overflow-hidden lg:h-50" :class="[medias.length === 1 ? '' : 'shrink-0']">
      <video v-if="src.type === 'video'" class="h-full w-full object-contain object-l" controls>
        <source :src="src.src" type="video/webm">
      </video>
      <img v-if="src.type === 'image'" :src="src.src" class="h-full w-full object-contain object-l" data-zoomable draggable="false">
    </div>
  </div>
  <div class="html-content">
    <section v-html="upgradeContent" />
  </div>
</template>

<style scoped lang="scss">
.zoom-images {
  &::-webkit-scrollbar {
    width: 6px;
    /* 垂直滚动条宽度 */
    height: 6px;
    /* 水平滚动条高度 */
  }

  /* 滚动条滑块 */
  &::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 3px;
  }

  /* 滑块悬停时 */
  &::-webkit-scrollbar-thumb:hover {
    background: #555;
  }

  /* 滚动条轨道 */
  &::-webkit-scrollbar-track {
    background: #c2d5e0;
    border-radius: 6px;
  }
}

.html-content {
  :deep(section) {
    strong {
      color: var(--colors-text-text-secondary, #34393d);
      font-family: Inter;
      font-size: 18px;
      font-weight: 600;
      line-height: 24px;
    }

    p {
      color: var(--colors-text-text-secondary, #34393d);
      font-family: Inter;
      font-size: 16px;
      line-height: 24px !important;
      margin: 10px 0;

      &:not(:has(*)):not(:empty) {
        margin-bottom: 20px;
      }
    }

    ul {
      list-style: disc;
      padding-left: 20px;
      margin: 10px 0;

      li {
        color: var(--colors-text-text-secondary, #34393d);
        font-family: Inter;
        font-size: 16px;
        line-height: 24px !important;
        margin-bottom: 20px;

        &:last-child {
          margin-bottom: 0;
        }
      }
    }

    ol {
      list-style: decimal;
      padding-left: 20px;
      margin: 10px 0;

      li {
        color: var(--colors-text-text-secondary, #34393d);
        font-family: Inter;
        font-size: 16px;
        line-height: 24px !important;
      }
    }
  }
}
</style>
