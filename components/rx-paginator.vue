<script lang="ts" setup>
interface Props {
  /** 当前偏移量 (0-indexed) */
  first?: number
  /** 总记录数 */
  totalRecords?: number
  /** 每页行数 */
  rows?: number
  /** 只有一页时是否显示 */
  alwaysShow?: boolean
}

const props = withDefaults(defineProps<Props>(), {
  first: 0,
  totalRecords: 0,
  rows: 10,
  alwaysShow: true,
})

const emit = defineEmits<{
  page: [event: { page: number, first: number, rows: number, pageCount: number }]
}>()

const pageCount = computed(() => Math.ceil(props.totalRecords / props.rows) || 1)
const currentPage = computed(() => Math.floor(props.first / props.rows))

const visiblePages = computed(() => {
  const total = pageCount.value
  const current = currentPage.value
  const maxVisible = 5

  if (total <= maxVisible) {
    return Array.from({ length: total }, (_, i) => i)
  }

  let start = Math.max(0, current - Math.floor(maxVisible / 2))
  let end = start + maxVisible

  if (end > total) {
    end = total
    start = end - maxVisible
  }

  return Array.from({ length: end - start }, (_, i) => start + i)
})

const isFirstPage = computed(() => currentPage.value === 0)
const isLastPage = computed(() => currentPage.value >= pageCount.value - 1)

const shouldShow = computed(() => {
  if (props.alwaysShow) return true
  return pageCount.value > 1
})

function goToPage(page: number) {
  if (page < 0 || page >= pageCount.value || page === currentPage.value) return
  emit('page', {
    page,
    first: page * props.rows,
    rows: props.rows,
    pageCount: pageCount.value,
  })
}
</script>

<template>
  <nav v-if="shouldShow" class="rx-paginator">
    <button
      class="rx-paginator__btn rx-paginator__nav"
      :class="{ 'rx-paginator__nav--disabled': isFirstPage }"
      :disabled="isFirstPage"
      @click="goToPage(currentPage - 1)"
    >
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M7 1L1 7l6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>

    <button
      v-for="page in visiblePages"
      :key="page"
      class="rx-paginator__btn rx-paginator__page"
      :class="{ 'rx-paginator__page--active': page === currentPage }"
      @click="goToPage(page)"
    >
      {{ page + 1 }}
    </button>

    <button
      class="rx-paginator__btn rx-paginator__nav"
      :class="{ 'rx-paginator__nav--disabled': isLastPage }"
      :disabled="isLastPage"
      @click="goToPage(currentPage + 1)"
    >
      <svg width="8" height="14" viewBox="0 0 8 14" fill="none">
        <path d="M1 1l6 6-6 6" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" />
      </svg>
    </button>
  </nav>
</template>

<style scoped>
.rx-paginator {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0;
}

.rx-paginator__btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border: none;
  background: transparent;
  cursor: pointer;
  font-size: 14px;
  color: #475569;
  transition: all 0.2s;
  user-select: none;
}

.rx-paginator__page {
  border-radius: 8px;
  border: 1px solid #c7d1d6;
}

.rx-paginator__page:hover:not(.rx-paginator__page--active) {
  background-color: #f1f5f9;
}

.rx-paginator__page--active {
  background: #11a3fd;
  color: #fff;
  border: none;
}

.rx-paginator__nav {
  border-radius: 8px;
  color: black;
}

.rx-paginator__nav:hover:not(.rx-paginator__nav--disabled) {
  background-color: #f1f5f9;
}

.rx-paginator__nav--disabled {
  cursor: not-allowed;
  color: rgba(0, 0, 0, 0.2);
}
</style>
