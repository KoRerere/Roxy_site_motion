<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

const features = [$t('No VPN configs'), $t('No VPN configs'), $t('Zero ban anxiety')]
</script>

<template>
  <div class="max-w-[950px] pt-36 flex flex-col gap-4 justify-center items-center">
    <div class="title">
      Change IP Address with RoxyBrowser
      —Safer, Simpler, Stealthier
    </div>
    <div class="flex items-center gap-4 flex-wrap mx-auto">
      <div v-for="feature in features" :key="feature" class="flex items-center gap-2">
        <rx-icon-svg-icon name="base/rx_ic_check_fill" />
        <span>{{ feature }}</span>
      </div>
    </div>
    <div class="color-secondary text-3.5">
      {{ $t('Seamlessly switch IP and fingerprints together to stay undetected and secure.') }}
    </div>

    <TryItNow class="mt-5" type="primary" />
  </div>
</template>

<style lang="scss" scoped>
.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-family: Archivo;
  font-size: var(--Heading-H2, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H2, 60px);
}
</style>
