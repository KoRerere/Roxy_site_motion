<script setup lang="ts">
import { useWidgetIsReady } from '@livechat/widget-vue'

/**
 * showBeforeReady: true = 未加载完成时也显示 slot，但降低透明度且不可点击；加载完成后恢复正常
 * showBeforeReady: false（默认）= 仅在 livechat 加载完成后才显示 slot
 */
const props = withDefaults(
  defineProps<{
    showBeforeReady?: boolean
  }>(),
  {
    showBeforeReady: false,
  },
)

const isWidgetReady = useWidgetIsReady()

const styles = computed(() => {
  if (isWidgetReady.value) {
    return {
      display: 'block',
      opacity: 1,
      pointerEvents: 'auto' as const,
    }
  }
  if (props.showBeforeReady) {
    return {
      display: 'block',
      opacity: 0.5,
      pointerEvents: 'none' as const,
    }
  }
  return {
    display: 'none',
  }
})

function toggleChatVisible() {
  if (!isWidgetReady.value)
    return
  // @livechat/widget-vue 底层仍然使用 window.LiveChatWidget API
  if (typeof window !== 'undefined' && (window as any).LiveChatWidget) {
    (window as any).LiveChatWidget.call('maximize')
  }
}
</script>

<template>
  <div
    class="cursor-pointer"
    :style="{
      cursor: isWidgetReady ? 'pointer' : 'default',
      pointerEvents: props.showBeforeReady && !isWidgetReady ? 'none' : 'auto',
    }"
    @click="toggleChatVisible"
  >
    <div
      :style="styles"
      v-bind="$attrs"
    >
      <slot />
    </div>
  </div>
</template>

<style>

</style>
