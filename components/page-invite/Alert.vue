<script lang="ts" setup>
import { RxIcon } from '@/components/rx-icon'
import type { PropType, CSSProperties } from 'vue'

const props = defineProps({
  type: {
    type: String as PropType<'success' | 'info' | 'warn' | 'error'>,
    default: 'success',
  },
  title: {
    type: String,
    default: '',
  },
  content: {
    type: String,
    default: '',
  },
  closable: {
    type: Boolean,
    default: true,
  },
})

const emit = defineEmits(['close'])

const visibleModel = defineModel('visible', { default: true })

const iconMap: Record<string, [string, any]> = {
  success: ['#1CC94D', 'base/rx_ic_check_fill'],
  info: ['#12A3FC', 'base/rx_ic_info_fill'],
  warn: ['#FC9D12', 'base/rx_ic_warn_fill'],
  error: ['#F53838', 'base/rx_ic_delete_fill'],
}

const styles = computed<CSSProperties>(() => {
  return {
    backgroundColor: {
      success: '#EBFCF0',
      info: '#E8F5FC',
      warn: '#FFF5E6',
      error: '#FCEDED',
    }[props.type],
    // border: `1px solid ${hexToRgba(iconMap[props.type][0], 0.3)}`,
  }
})

const iconProps = computed(() => {
  const [color, icon] = iconMap[props.type]
  return {
    color,
    icon,
  }
})

function handleClose() {
  visibleModel.value = false
  emit('close')
}
</script>

<template>
  <Transition>
    <div v-if="visibleModel" class="rx-alert" v-bind="$attrs" :style="styles">
      <slot name="tips-icon">
        <span :style="{ color: iconProps.color }">
          <RxIcon :name="iconProps.icon" />
        </span>
      </slot>
      <div class="rx-alert-body">
        <div v-if="title || $slots.title" class="rx-alert__title">
          <slot name="title">
            {{ title }}
          </slot>
        </div>
        <div v-if="content || $slots.content" class="rx-alert__content">
          <slot name="content">
            {{ content }}
          </slot>
        </div>
      </div>
      <div v-if="closable" class="rx-alert-close" @click="handleClose">
        <slot name="close-icon">
          <RxIcon name="base/rx_ic_delete" />
        </slot>
      </div>
    </div>
  </Transition>
</template>

<style lang="scss" scoped>
.v-enter-active,
.v-leave-active {
  transition: opacity 0.5s ease;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}

:where(.rx-alert) {
  display: flex;
  width: 100%;
  padding: var(--spacing-xl, 12px);
  align-items: flex-start;
  gap: 10px;
  border-radius: var(--radius-md, 6px);
  background: var(--Color-green-100, #ebfcf0);
  overflow: hidden;
  transition: height 0.2s;

  &.hide {
    height: 0 !important;
    padding: 0 !important;
    border: none !important;
  }

  .rx-alert-body {
    flex: auto;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;

    .rx-alert__title {
      color: var(--Colors-Text-text-primary, #171c1f);
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .rx-alert__content {
      color: var(--Colors-Text-text-secondary, #575d61);
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      /* 150% */
    }
  }

  .rx-alert-close {
    width: 16px;
    height: 16px;
    cursor: pointer;
    color: rgba(0, 0, 0, 0.45);
    transition: color 0.2s;

    &:hover {
      color: rgba(0, 0, 0, 0.88);
    }
  }
}
</style>
