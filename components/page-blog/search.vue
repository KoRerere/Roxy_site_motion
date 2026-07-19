<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const route = useRoute()
const router = useRouter()
const localePath = useLocalePath()
const inputRef = ref<HTMLInputElement>()
const localValue = ref('')

watch(
  () => route.query.search,
  (s) => {
    localValue.value = s != null ? String(s) : ''
  },
  { immediate: true },
)

function commit() {
  const trimmed = localValue.value.trim()
  const current = route.query.search != null ? String(route.query.search).trim() : ''
  if (trimmed === current)
    return

  const q: Record<string, string | string[]> = { ...route.query } as Record<string, string | string[]>
  if (trimmed)
    q.search = trimmed
  else
    delete q.search

  if (trimmed !== current)
    q.page = '1'

  router.push({
    path: localePath('/blog'),
    query: q,
  })
}

function onKeyup(e: KeyboardEvent) {
  if (e.key === 'Enter')
    commit()
}

const breakpoints = useRxBreakpoints()
const smWidth = breakpoints.smallerOrEqual('sm')

onMounted(() => {
  if (smWidth.value)
    return
  nextTick(() => {
    const el = inputRef.value
    el?.focus()
    el?.select()
  })
})
</script>

<template>
  <div class="search-wrap">
    <div class="search-box">
      <span class="search-icon-slot" aria-hidden="true">
        <RxIcon name="base/rx_ic_magnify" class="search-icon" color="#7D8387" />
      </span>
      <input
        ref="inputRef"
        v-model="localValue"
        type="search"
        enterkeyhint="search"
        autocomplete="off"
        :placeholder="$t('搜索...')"
        @keyup="onKeyup"
        @blur="commit"
      >
    </div>
  </div>
</template>

<style lang="scss" scoped>
.search-wrap {
  position: relative;
  width: 100%;
  max-width: 375px;

  @media (width >= 768px) {
    max-width: 600px;
  }
}

.search-shade {
  position: absolute;
  left: 12px;
  top: 9px;
  width: calc(100% - 24px);
  height: 44px;
  border-radius: 12px;
  opacity: 0.6;
  background: #e3e6e8;
  backdrop-filter: blur(2.5px);
  z-index: 0;
  pointer-events: none;
}

.search-box {
  position: relative;
  z-index: 1;
  display: flex;
  align-items: center;
  height: 48px;
  padding: 0 16px 0 20px;
  column-gap: 12px;
  border-radius: 12px;
  border: 1px solid var(--border-border-inactive, #c7d1d6);
  background: #fff;
  box-shadow: 0 1px 2px rgb(17 18 19 / 4%), 0 4px 14px rgb(4 33 68 / 6%);
}

.search-icon-slot {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
}

.search-box input {
  flex: 1 1 0;
  min-width: 0;
  margin: 0;
  padding: 12px 0;
  border: none;
  border-radius: 0;
  outline: none;
  background: transparent;
  font-size: 16px;
  line-height: 24px;
  letter-spacing: -0.048px;
  color: var(--text-text-primary, #111213);
}

/* 去掉 WebKit 对 search 类型的内边距与装饰，避免占位符与文字垂直错位 */
.search-box input[type='search'] {
  appearance: none;
}

.search-box input[type='search']::-webkit-search-decoration,
.search-box input[type='search']::-webkit-search-cancel-button,
.search-box input[type='search']::-webkit-search-results-button,
.search-box input[type='search']::-webkit-search-results-decoration {
  display: none;
}

.search-box input::placeholder {
  line-height: 24px;
  color: var(--text-text-inactive, #7d8387);
}

.search-icon-slot :deep(.svg) {
  display: block;
  line-height: 0;
}
</style>
