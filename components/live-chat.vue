
<script setup lang="ts">
import { LiveChatWidget, useWidgetIsReady } from "@livechat/widget-vue";
import type { EventHandlerPayload } from "@livechat/widget-vue"; 
import { countryCode } from '@/store';

const isWidgetReady = useWidgetIsReady()
const visibility = ref<'maximized' | 'minimized' | 'hidden'>('hidden')
const { locale } = useRxI18n()

const userName = '[Roxy]-游客'
const sessionVariables = {
  username: `[Roxy]-`,
}

const styles = computed(() => {
  if (countryCode.value === 'CN') {
    return {
      opacity: 1,
      cursor: 'pointer',
    }
  } else if (isWidgetReady.value) {
    return {
      opacity: 1,
      cursor: 'pointer',
    }
  } else {
    return {
      opacity: 0.4,
      cursor: 'not-allowed',
    }
  }
})

const toLiveChat = computed(() => {
  if (locale.value === 'zh') {
    return 'https://secure.livechatinc.com/licence/18087441/v2/open_chat.cgi?groups=6'
  } else {
    return 'https://secure.livechatinc.com/licence/18087441/v2/open_chat.cgi?groups=5'
  }
})

function toggleChatVisible() {
  if (countryCode.value === 'CN') {
    window.open(toLiveChat.value, '_blank')
  } else {
    visibility.value = visibility.value === 'maximized' ? 'hidden' : 'maximized'
  }
}

function handleVisibilityChanged(data) {
  visibility.value = data.visibility
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
    <LiveChatWidget
      license="18087441"
      :customerName="userName"
      :sessionVariables="sessionVariables"
      :visibility="visibility"
      @visibility-changed="handleVisibilityChanged"
    />
  </div>
</template>

<style>

</style>