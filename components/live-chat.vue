
<script setup lang="ts">
import { useWidgetIsReady } from "@livechat/widget-vue";
import { countryCode } from '@/store';

const isWidgetReady = useWidgetIsReady()
const visibility = ref<'maximized' | 'minimized' | 'hidden'>('hidden')

const styles = computed(() => {
  if (isWidgetReady.value) {
    return {
      display: 'block',
    }
  } else {
    return {
      display: 'none',
    }
  }
})

// const toLiveChat = computed(() => {
//   if (locale.value === 'zh') {
//     return 'https://secure.livechatinc.com/licence/18087441/v2/open_chat.cgi?groups=6'
//   } else {
//     return 'https://secure.livechatinc.com/licence/18087441/v2/open_chat.cgi?groups=5'
//   }
// })

function toggleChatVisible() {
  // if (countryCode.value === 'CN') {
  //   window.open(toLiveChat.value, '_blank')
  // } else {
  //   LiveChatWidget.call("maximize");
  // }

  LiveChatWidget.call("maximize");
}
</script>

<template>
  <div class="cursor-pointer" @click="toggleChatVisible">
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