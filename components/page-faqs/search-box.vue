<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon';
import { useEventListener } from '@vueuse/core';

interface SearchResultItem {
    title: string
    desc: string
    id?: string
}


const { faqCategories, handleSearchResultClick } = inject<any>('search-content-context')

const tips: string[] = []
const documents = ref<any[]>([])
const searchResultElRef = useTemplateRef('searchResultEl');

const searchResult = ref<SearchResultItem[]>([]);
const searchValue = ref('');
const selectedIndex = ref(-1);

onMounted(() => {
    if (import.meta.client) {
        const docs = faqCategories.value.flatMap((category: any) =>
            category.list.map((item: any) => ({ ...item, id: item.title, category: category.title }))
        )
        documents.value = docs
    }
})

watch(searchValue, (value) => {
    if (value && value.trim().length > 0) {
        const q = value.trim().toLowerCase()
        const results = documents.value
            .map((doc: any) => {
                const title = String(doc.title || '')
                const desc = String(doc.desc || '')
                const titleL = title.toLowerCase()
                const descL = desc.toLowerCase()
                let score = 0
                if (titleL.includes(q)) score += 5
                if (titleL.startsWith(q)) score += 6
                if (descL.includes(q)) score += 3
                return score > 0 ? { ...doc, score } : null
            })
            .filter(Boolean)
            .sort((a: any, b: any) => b.score - a.score)

        // 高亮关键词
        searchResult.value = results.map((item: any) => ({
            title: highlight(item.title, value.trim()),
            desc: item.desc,
            id: item.id
        }))
        
        // 如果支持 CSS Custom Highlight API，在下一个 tick 应用高亮
        if (supportsCSSHighlights) {
            nextTick(() => {
                if (searchResultElRef.value) {
                    highlightWithCSS(searchResultElRef.value as HTMLElement, value.trim())
                }
            })
        }
    } else {
        searchResult.value = []
        // 清除高亮
        if (supportsCSSHighlights && currentHighlight) {
            CSS.highlights.delete('search-highlight')
            currentHighlight = null
        }
    }
    // 重置选中索引
    selectedIndex.value = -1
})


// 检查浏览器是否支持 CSS Custom Highlight API
const supportsCSSHighlights = typeof CSS !== 'undefined' && 'highlights' in CSS

// 存储当前的高亮对象
let currentHighlight: Highlight | null = null

function createHighlightRanges(element: HTMLElement, query: string): Range[] {
  if (!query || query.trim().length === 0) return []
  
  const trimmedQuery = query.trim()
  const keywords = new Set<string>()
  
  // 添加完整查询词
  keywords.add(trimmedQuery)
  
  // 添加空格分割的词
  trimmedQuery.split(/\s+/).filter(Boolean).forEach(word => keywords.add(word))
  
  // 对于中文查询，添加每个字符
  const chineseChars = trimmedQuery.match(/[\u4e00-\u9fa5]/g)
  if (chineseChars) {
    chineseChars.forEach(char => keywords.add(char))
  }
  
  // 转换为数组并按长度排序（长的先匹配）
  const sortedKeywords = Array.from(keywords).sort((a, b) => b.length - a.length)
  
  const ranges: Range[] = []
  
  // 遍历元素中的所有文本节点
  const walker = document.createTreeWalker(
    element,
    NodeFilter.SHOW_TEXT
  )
  
  let node: Node | null
  while (node = walker.nextNode()) {
    const textNode = node as Text
    const text = textNode.nodeValue || ''
    
    sortedKeywords.forEach(keyword => {
      if (keyword.length > 0) {
        const regex = new RegExp(keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'gi')
        let match: RegExpExecArray | null
        
        while ((match = regex.exec(text)) !== null) {
          const range = new Range()
          range.setStart(textNode, match.index)
          range.setEnd(textNode, match.index + keyword.length)
          ranges.push(range)
        }
      }
    })
  }
  
  return ranges
}

function highlightWithCSS(element: HTMLElement, query: string): void {
  // 清除之前的高亮
  if (currentHighlight && supportsCSSHighlights) {
    CSS.highlights.delete('search-highlight')
    currentHighlight = null
  }
  
  if (!query || query.trim().length === 0) return
  
  if (supportsCSSHighlights) {
    // 使用 CSS Custom Highlight API
    const ranges = createHighlightRanges(element, query)
    if (ranges.length > 0) {
      currentHighlight = new Highlight(...ranges)
      CSS.highlights.set('search-highlight', currentHighlight)
    }
  }
}

function highlight(text: string, query: string): string {
  // 如果支持 CSS Custom Highlight API，返回原始文本
  // 高亮将通过 CSS 处理
  if (supportsCSSHighlights) {
    return text
  }
  
  // 降级到传统的 HTML 高亮方案
  if (!query || query.trim().length === 0) return text
  
  const trimmedQuery = query.trim()
  const keywords = new Set<string>()
  
  // 添加完整查询词
  keywords.add(trimmedQuery)
  
  // 添加空格分割的词
  trimmedQuery.split(/\s+/).filter(Boolean).forEach(word => keywords.add(word))
  
  // 对于中文查询，添加每个字符
  const chineseChars = trimmedQuery.match(/[\u4e00-\u9fa5]/g)
  if (chineseChars) {
    chineseChars.forEach(char => keywords.add(char))
  }
  
  // 转换为数组并按长度排序（长的先匹配）
  const sortedKeywords = Array.from(keywords).sort((a, b) => b.length - a.length)
  
  let result = text
  sortedKeywords.forEach(keyword => {
    if (keyword.length > 0) {
      // 转义特殊字符
      const escapedKeyword = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      const regex = new RegExp(`(${escapedKeyword})`, 'gi')
      result = result.replace(regex, '<span class="highlight-keyword">$1</span>')
    }
  })
  
  return result
}

const handleSearch = () => {
}

const handleTipClick = (tip: string) => {
    searchValue.value = tip;
    handleSearch();
}

function handleResultClick(item: SearchResultItem) {
    searchValue.value = ''
    handleSearchResultClick(item)
}

// 键盘导航处理函数
const handleKeyDown = (event: KeyboardEvent) => {
    if (!searchValue.value || searchResult.value.length === 0) return
    
    switch (event.key) {
        case 'ArrowDown':
            event.preventDefault()
            selectedIndex.value = selectedIndex.value < searchResult.value.length - 1 
                ? selectedIndex.value + 1 
                : 0
            break
        case 'ArrowUp':
            event.preventDefault()
            selectedIndex.value = selectedIndex.value > 0 
                ? selectedIndex.value - 1 
                : searchResult.value.length - 1
            break
        case 'Enter':
            event.preventDefault()
            if (selectedIndex.value >= 0 && selectedIndex.value < searchResult.value.length) {
                const selectedItem = searchResult.value[selectedIndex.value]
                if (selectedItem) {
                    handleResultClick(selectedItem)
                }
            }
            break
        case 'Escape':
            event.preventDefault()
            searchValue.value = ''
            selectedIndex.value = -1
            break
    }
}

// 使用 useEventListener 监听键盘事件
useEventListener('keydown', handleKeyDown)
</script>

<template>
  <div class="search-box">
        <div class="search-input-wrapper">
            <RxIcon name="base/rx_ic_magnify" class="search-prefix-icon" color="#7D8387" />
            <input
            :placeholder="$t('搜索')" 
            v-model="searchValue" 
            class="search-input"
            @keyup.enter="handleSearch" 
            /> 

            <div v-if="searchValue" ref="searchResultEl" class="search-result">
                <template v-for="(item, index) in searchResult" :key="item.title">
                    <div 
                        class="search-result-item cursor-pointer" 
                        :class="{ 
                            'bg-[#EAEFF4]': selectedIndex === index,
                            'hover:bg-[#EAEFF4]': selectedIndex !== index
                        }"
                        @click="handleResultClick(item)"
                    >
                        <div class="search-result-item-title" v-html="item.title"></div> 
                    </div> 
                </template>
                <div v-if="searchResult.length === 0">
                    <div class="search-result-item justify-center">
                            {{ $t('没有找到相关结果') }}
                    </div>
                </div>
            </div>
        </div>
        <div v-if="false" class="search-tips">
            <div class="search-tips-title">
                You may be searching for:
            </div>
            <div class="search-tips-list">
                <div class="search-tips-item" v-for="tip in tips" :key="tip" @click="handleTipClick(tip)">
                    {{ tip }}
                </div>
            </div>
        </div>
     </div>
</template>

<style lang="scss" scoped>
.search-box {
  display: flex;
  max-width: calc(100vw - 32px);
  width: 720px;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;

  /* CSS Custom Highlight API 样式 */
  ::highlight(search-highlight) {
    font-weight: 500;
    color: var(--colors-text-text-brand, #11a3fd);
  }

  /* 降级方案：传统的 HTML 高亮 */
  :deep(.highlight-keyword) {
    font-weight: 500;
    color: var(--colors-text-text-brand, #11a3fd);
    background-color: rgba(17, 163, 253, 0.1);
  }
}

.search-input-wrapper {
  width: 100%;
  height: 48px;
  display: flex;
  padding: 6px 6px 6px 20px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  position: relative;

  @media (max-width: 768px) {
    height: 44px;
  }
}

.search-result {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  width: 100%;
  max-height: 400px;
  z-index: 20;
  border-radius: 12px;
  border: 1px solid var(--colors-border-border-inactive, #e2e9ee);
  background: #fff;
  box-shadow:
    0 8.06px 8.06px 0 rgba(78, 78, 78, 0.06),
    0 16px 40px 0 rgba(0, 0, 0, 0.04);
  overflow-y: auto;
}

.search-result-item {
  display: flex;
  padding: 16px 20px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  color: var(--colors-text-text-secondary, #34393d);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: 22px; /* 137.5% */
  letter-spacing: -0.048px;

  :deep(mark) {
    color: var(--colors-text-text-primary, #111213);
  }
}

.search-prefix-icon {
  position: absolute;
  left: 20px;
  top: 50%;
  transform: translateY(-50%);
  z-index: 2;
}

.search-input {
  position: absolute;
  inset: 0;
  display: flex;
  padding: 6px 120px 6px 42px;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  border-radius: 50px;
  border: 1.5px solid var(--colors-border-border-inactive, #e2e9ee);
  background: #fff;
  outline: none;
  color: var(--colors-text-text-primary, #111213);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px; /* 137.5% */

  &:focus-visible {
    border: 1.5px solid var(--colors-border-border-brand, #11a3fd);
  }

  &::placeholder {
    color: var(--colors-text-text-inactive, #7d8387);
    font-weight: 400;
  }
}

.search-tips {
  display: flex;
  padding-left: 20px;
  align-items: center;
  gap: 12px;
}

.search-tips-title {
  color: var(--colors-text-text-primary, #111213);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 142.857% */
}

.search-tips-list {
  display: flex;
  align-items: center;
  gap: 8px;
}

.search-tips-item {
  display: flex;
  padding: 4px 10px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 50px;
  background: var(--colors-background-bg-block, #f1f5f8);
  color: var(--colors-text-text-secondary, #34393d);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  cursor: pointer;
}
</style>