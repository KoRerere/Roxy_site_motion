<script setup lang="ts">
type Props = {
  title: string
}

withDefaults(defineProps<Props>(), {
  title: '',
})

const message = defineModel()
</script>

<template>
  <client-only>
    <div class="flex flex-col mt-8 gap-2 py-3 pl-9 pr-7 message" v-if="message">
      <div class="flex items-center position-relative">
      <svgo-rx_ic_info_fill class="absolute alert-icon"></svgo-rx_ic_info_fill>
      <span class="message-text">{{ title }}</span>
      <svgo-rx_ic_delete class="absolute close-icon" @click="message = false"></svgo-rx_ic_delete>
      </div>
      <div class="message-description">
        <slot />
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped>
.message {
  border-radius: var(--radius-md, 6px);
  background: var(--Color-blue-100, #E8F5FC);

  &-text {
    color: var(--Colors-Text-text-primary, #171C1F);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: normal;
  }

  &-description {
    color: var(--Colors-Text-text-secondary, #575D61);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: 18px;

  }

  .close-icon,
  .alert-icon {
    font-size: 16px;
  }

  .alert-icon {
    left: -24px;
    color: #12A3FC;
  }

  .close-icon {
    right: -16px;
    color: #7C8387;
    cursor: pointer;
  }
}

</style>