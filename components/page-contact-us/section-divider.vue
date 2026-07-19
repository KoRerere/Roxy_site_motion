<script setup lang="ts">
import { CONTACT_US_CONTENT_WIDTH, CONTACT_US_SECTION_GAP } from '@/constants/contact-us'

const dividerStyle = {
  '--contact-us-content-width': `${CONTACT_US_CONTENT_WIDTH}px`,
  '--contact-us-section-gap': `${CONTACT_US_SECTION_GAP}px`,
} as const
</script>

<template>
  <!-- About Roxy 与 Company Information 之间的分隔线；PC 样式见 Figma -->
  <div
    class="contact-us-section-divider"
    :style="dividerStyle"
    aria-hidden="true"
  />
</template>

<style scoped lang="scss">
/* 移动端：不显示线条，用 100px 顶距补偿 sibling 选择器失效 */
.contact-us-section-divider {
  margin-top: var(--contact-us-section-gap);
  height: 0;
}

@media (max-width: 639.98px) {
  .contact-us-section-divider {
    height: 1px;
    margin: 40px 20px;
    background: var(--border-border-strong, #d4dadd);
  }
}

@media (min-width: 768px) {
  .contact-us-section-divider {
    /* Figma：1px #D4DADD，上下各 80px；Company Information 不再单独 margin-top */
    width: auto;
    height: 1px;
    margin: 80px 40px;
    background: var(--border-border-strong, #d4dadd);
    align-self: stretch;
  }
}

@media (min-width: 1024px) {
  .contact-us-section-divider {
    margin-right: 60px;
    margin-left: 60px;
  }
}

@media (min-width: 1280px) {
  .contact-us-section-divider {
    width: var(--contact-us-content-width);
    max-width: 100%;
    margin-right: auto;
    margin-left: auto;
  }
}
</style>
