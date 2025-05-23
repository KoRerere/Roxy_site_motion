
<script setup lang="ts">
import { LiveChatWidget, useWidgetIsReady } from "@livechat/widget-vue";
import type { EventHandlerPayload } from "@livechat/widget-vue"; 

const isWidgetReady = useWidgetIsReady()
const visibility = ref<'maximized' | 'minimized' | 'hidden'>('hidden')

const userName = '[Roxy]-游客'
const sessionVariables = {
  username: `[Roxy]-`,
}


function toggleChatVisible() {
  visibility.value = visibility.value === 'maximized' ? 'hidden' : 'maximized'
}

function handleVisibilityChanged(data) {
  visibility.value = data.visibility
}
</script>

<template>
  <div class="cursor-pointer" @click="toggleChatVisible">
    <div 
      :style="{
        opacity: isWidgetReady ? 1 : 0.4,
        cursor: isWidgetReady ? 'pointer' : 'not-allowed'
      }"
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