<script setup lang="ts">
import { useAiAutomationDemo } from './use-ai-automation-demo'

const {
  showDesktopVideo,
  showMobilePlayer,
  isMobile,
  videoSrc,
  videoPoster,
  desktopVideoRef,
  mobileVideoRef,
  closeDesktopDemo,
  closeMobileDemo,
  cleanupDemoPlayers,
} = useAiAutomationDemo()

function setDesktopVideoRef(el: unknown) {
  desktopVideoRef.value = el as typeof desktopVideoRef.value
}

function setMobileVideoRef(el: unknown) {
  mobileVideoRef.value = el as typeof mobileVideoRef.value
}

onUnmounted(() => {
  cleanupDemoPlayers()
})
</script>

<template>
  <Teleport to="body">
    <div
      v-if="showDesktopVideo && !isMobile"
      class="ai-automation-body-overlay"
      role="dialog"
      :aria-label="$t('查看Demo')"
      @click.self="closeDesktopDemo"
    >
      <div class="ai-automation-body-overlay__panel">
        <RxVideo
          :ref="setDesktopVideoRef"
          :autoplay="false"
          auto-start
          show-close
          fullscreen
          :src="videoSrc"
          :poster="videoPoster"
          @close="closeDesktopDemo"
        />
      </div>
    </div>
  </Teleport>

  <!-- 移动端：全屏 RxVideo -->
  <Teleport to="body">
    <div
      v-if="showMobilePlayer && isMobile"
      class="ai-automation-mobile-overlay"
      role="dialog"
      :aria-label="$t('查看Demo')"
    >
      <RxVideo
        :ref="setMobileVideoRef"
        :autoplay="false"
        show-close
        fullscreen
        :src="videoSrc"
        :poster="videoPoster"
        @close="closeMobileDemo"
      />
    </div>
  </Teleport>
</template>

<style lang="scss" scoped>
.ai-automation-body-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 24px;
  background: rgba(0, 0, 0, 0.5);

  &__panel {
    width: min(94vw, 1280px);
    border: 6px solid rgba(255, 255, 255, 0.6);
    border-radius: 12px;
    overflow: hidden;
    background: #000;
    aspect-ratio: 16 / 9;
  }
}

.ai-automation-mobile-overlay {
  position: fixed;
  inset: 0;
  z-index: 1000;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #000;

  :deep(.video-player) {
    width: 100%;
    height: 100%;
    max-width: 100vw;
    max-height: 100vh;
  }
}
</style>
