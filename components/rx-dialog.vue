<script lang="ts" setup>
interface Props {
  visible?: boolean
  modal?: boolean
  pt?: {
    root?: string
    mask?: string
    [key: string]: any
  }
}

const props = withDefaults(defineProps<Props>(), {
  visible: false,
  modal: true,
})

const emit = defineEmits(['update:visible'])

const slots = useSlots()

function close() {
  emit('update:visible', false)
}

function onMaskClick(e: MouseEvent) {
  if (e.target === e.currentTarget) {
    close()
  }
}

function onKeyDown(e: KeyboardEvent) {
  if (e.key === 'Escape') {
    close()
  }
}

watch(() => props.visible, (val) => {
  if (import.meta.server) return
  if (val) {
    document.body.style.overflow = 'hidden'
    document.addEventListener('keydown', onKeyDown)
  }
  else {
    document.body.style.overflow = ''
    document.removeEventListener('keydown', onKeyDown)
  }
})

onUnmounted(() => {
  if (import.meta.server) return
  document.body.style.overflow = ''
  document.removeEventListener('keydown', onKeyDown)
})
</script>

<template>
  <Teleport to="body">
    <Transition name="rx-dialog-fade">
      <div
        v-if="visible"
        class="rx-dialog-mask"
        :class="[{ 'rx-dialog-mask--modal': modal }, pt?.mask]"
        @click="onMaskClick"
      >
        <!-- container slot: replaces entire dialog chrome -->
        <template v-if="slots.container">
          <slot name="container" />
        </template>

        <!-- default dialog with header/content/footer -->
        <div
          v-else
          class="rx-dialog"
          :class="pt?.root"
          :style="$attrs.style"
        >
          <div v-if="slots.header" class="rx-dialog__header">
            <slot name="header" />
            <button class="rx-dialog__close" @click="close">
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <path d="M1 1l12 12M13 1L1 13" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" />
              </svg>
            </button>
          </div>
          <div class="rx-dialog__content">
            <slot />
          </div>
          <div v-if="slots.footer" class="rx-dialog__footer">
            <slot name="footer" />
          </div>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<style scoped>
.rx-dialog-mask {
  position: fixed;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.rx-dialog-mask--modal {
  background-color: rgba(0, 0, 0, 0.4);
}

.rx-dialog {
  background: #fff;
  border-radius: 12px;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15);
  max-height: 90vh;
  overflow-y: auto;
  position: relative;
}

.rx-dialog__header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px 0;
}

.rx-dialog__close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border: none;
  background: transparent;
  cursor: pointer;
  color: #6b7280;
  border-radius: 4px;
  transition: background-color 0.2s;
  flex-shrink: 0;
}

.rx-dialog__close:hover {
  background-color: #f3f4f6;
}

.rx-dialog__content {
  padding: 20px 24px;
}

.rx-dialog__footer {
  padding: 0 24px 20px;
}

/* Transition */
.rx-dialog-fade-enter-active,
.rx-dialog-fade-leave-active {
  transition: opacity 0.2s ease;
}

.rx-dialog-fade-enter-from,
.rx-dialog-fade-leave-to {
  opacity: 0;
}
</style>
