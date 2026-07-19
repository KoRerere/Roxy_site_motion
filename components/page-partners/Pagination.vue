<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { cn } from '@/utils'

const currentPage = ref(1)
const totalPages = ref(5)

const pages = computed(() => {
  const result: (number | string)[] = []
  if (totalPages.value <= 7) {
    for (let i = 1; i <= totalPages.value; i++) {
      result.push(i)
    }
  } else {
    if (currentPage.value <= 3) {
      for (let i = 1; i <= 3; i++) {
        result.push(i)
      }
      result.push('...')
      result.push(totalPages.value)
    } else if (currentPage.value >= totalPages.value - 2) {
      result.push(1)
      result.push('...')
      for (let i = totalPages.value - 2; i <= totalPages.value; i++) {
        result.push(i)
      }
    } else {
      result.push(1)
      result.push('...')
      result.push(currentPage.value - 1)
      result.push(currentPage.value)
      result.push(currentPage.value + 1)
      result.push('...')
      result.push(totalPages.value)
    }
  }
  return result
})

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page
  }
}

function prevPage() {
  if (currentPage.value > 1) {
    currentPage.value--
  }
}

function nextPage() {
  if (currentPage.value < totalPages.value) {
    currentPage.value++
  }
}
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- Previous button -->
    <button
      :disabled="currentPage === 1"
      :class="cn(
        'size-36px rounded-2 flex items-center justify-center',
        currentPage === 1
          ? 'bg-white border border-[#C7D1D6]'
          : 'bg-white',
      )"
      @click="prevPage"
    >
      <RxIcon name="base/rx_ic_left" size="16" />
    </button>

    <!-- Page numbers -->
    <template v-for="page in pages" :key="page">
      <button
        v-if="typeof page === 'number'"
        :class="cn(
          'size-36px rounded-2 flex items-center justify-center text-12px font-500',
          currentPage === page
            ? 'bg-[#11A3FD] text-white'
            : 'bg-white border border-[#C7D1D6] text-primary',
        )"
        @click="goToPage(page)"
      >
        {{ page }}
      </button>
      <span v-else class="size-36px flex items-center justify-center text-12px text-primary">
        {{ page }}
      </span>
    </template>

    <!-- Next button -->
    <button
      :disabled="currentPage === totalPages"
      :class="cn(
        'size-36px rounded-2 flex items-center justify-center',
        currentPage === totalPages
          ? 'bg-white border border-[#C7D1D6]'
          : 'bg-white',
      )"
      @click="nextPage"
    >
      <RxIcon name="base/rx_ic_right" size="16" />
    </button>
  </div>
</template>

