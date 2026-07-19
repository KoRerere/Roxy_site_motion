<script setup lang="ts">
import { CONTACT_US_CONTENT_WIDTH, CONTACT_US_SECTION_GAP } from '@/constants/contact-us'

defineProps<{
  /** Banner 后首模块：距 Banner 100px */
  first?: boolean
  /** 取消与上一模块的间距（由 divider / border 接管） */
  noMarginTop?: boolean
  /** 模块上下各一条分隔线（Follow Us 用） */
  bordered?: boolean
  /** 页末模块：距下方 100px（Join Us 用） */
  last?: boolean
}>()

const sectionStyle = {
  '--contact-us-content-width': `${CONTACT_US_CONTENT_WIDTH}px`,
  '--contact-us-section-gap': `${CONTACT_US_SECTION_GAP}px`,
} as const
</script>

<template>
  <section
    class="contact-us-section"
    :class="{
      'contact-us-section--first': first,
      'contact-us-section--no-margin-top': noMarginTop,
      'contact-us-section--bordered': bordered,
      'contact-us-section--last': last,
    }"
    :style="sectionStyle"
  >
    <div class="contact-us-section__inner">
      <slot />
    </div>
  </section>
</template>

<style scoped lang="scss">
/* 参考 use-cases 的 Container：中小屏保留安全边距，超大屏再锁定设计稿宽度 */
.contact-us-section {
  padding: 0 16px;
}

.contact-us-section__inner {
  width: 100%;
  box-sizing: border-box;
  margin: 0 auto;
}

.contact-us-section--first {
  margin-top: var(--contact-us-section-gap);
}

.contact-us-section + .contact-us-section {
  margin-top: var(--contact-us-section-gap);
}

.contact-us-section--no-margin-top {
  margin-top: 0;
}

/* Join Us：页末距下方 100px */
.contact-us-section--last {
  margin-bottom: var(--contact-us-section-gap);
}

@media (max-width: 639.98px) {
  .contact-us-section {
    padding: 0 20px;
  }

  .contact-us-section--first {
    margin-top: 24px;
  }

  .contact-us-section--last {
    margin-bottom: 0;
  }
}

@media (min-width: 768px) {
  .contact-us-section {
    padding: 0 40px;
  }
}

@media (min-width: 1024px) {
  .contact-us-section {
    padding: 0 60px;
  }
}

@media (min-width: 1280px) {
  .contact-us-section {
    padding: 0;
    margin-bottom: 100px;
  }

  .contact-us-section__inner {
    width: var(--contact-us-content-width);
    max-width: 100%;
  }
}
</style>
