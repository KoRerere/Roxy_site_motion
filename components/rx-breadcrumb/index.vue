<template>
  <nav aria-label="breadcrumb">
    <ol class="list-none flex items-center gap-2 flex-wrap">
      <li
        v-for="(breadcrumb, index) in items"
        :key="`breadcrumb-${index}-${breadcrumb.type === 'separator' ? 'sep' : (breadcrumb.path || breadcrumb.title || '')}`"
        class="flex items-center breadcrumb-item"
      >
        <template v-if="breadcrumb.type === 'separator'">
          <slot name="separator">
            <RxIcon name="base/rx_ic_right" color="#7D8387" />
          </slot>
        </template>
        <template v-else>
          <NuxtLinkLocale
            v-if="breadcrumb.path && !breadcrumb.disabled"
            :to="breadcrumb.path"
            class="breadcrumb-link"
          >
            {{ breadcrumb.title }}
          </NuxtLinkLocale>
          <span v-else>{{ breadcrumb.title }}</span>
        </template>
      </li>
    </ol>
  </nav>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { type RxBreadcrumbProps } from './interface'
defineProps<RxBreadcrumbProps>()
</script>

<style lang="scss" scoped>
.breadcrumb-item {
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: var(--body-second, 14px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-body-second, 18px);
  /* 128.571% */

  &:not(:last-of-type):hover {
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: auto;
    text-decoration-thickness: auto;
    text-underline-offset: auto;
    text-underline-position: from-font;
  }
}

.breadcrumb-link {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

.breadcrumb-link:hover {
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: auto;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
}
</style>