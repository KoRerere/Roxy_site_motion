<script setup lang="ts">
/** 轮播进度指示器：当前项变宽，内部渐变条随停留时长线性增长 */
defineProps<{
  count: number
  activeIndex: number
  progressFillCss: string
  dark?: boolean
}>()

const emit = defineEmits<{
  select: [index: number]
}>()
</script>

<template>
  <div
    class="carousel-progress px-6 py-4 rounded-[47px] w-fit lg:px-5.5 lg:py-3.5 md:px-5 md:py-3 xl:px-6 xl:py-4"
    :class="[dark ? 'carousel-progress--dark bg-white/10' : 'bg-[#f1f5f8]']"
  >
    <div class="flex gap-2 items-center md:gap-1.5 xl:gap-2">
      <div
        v-for="idx in count"
        :key="idx"
        class="indicator-item rounded-full shrink-0 h-2 cursor-pointer relative overflow-hidden"
        :class="{ 'is-active': activeIndex === idx - 1 }"
        role="button"
        tabindex="0"
        :aria-label="`Go to slide ${idx}`"
        :aria-current="activeIndex === idx - 1 ? 'true' : undefined"
        @click="emit('select', idx - 1)"
        @keydown.enter="emit('select', idx - 1)"
        @keydown.space.prevent="emit('select', idx - 1)"
      >
        <span
          v-if="activeIndex !== idx - 1"
          class="rounded-full bg-[#d4dfe7] h-full w-full block"
        />
        <span v-else class="indicator-track">
          <span class="indicator-progress" :style="{ width: progressFillCss }" />
        </span>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.indicator-item {
  transition:
    width 0.42s cubic-bezier(0.22, 1, 0.36, 1),
    box-shadow 0.2s ease;

  &:not(.is-active) {
    width: 16px;
  }

  &.is-active {
    width: 68px;
  }
}

.indicator-track {
  display: block;
  width: 100%;
  height: 100%;
  border-radius: 999px;
  background-color: #d4dfe7;
  position: relative;
}

.indicator-progress {
  position: absolute;
  left: 0;
  top: 0;
  bottom: 0;
  border-radius: 50px;
  background: #12a3fc;
  width: 0%;
}
</style>
