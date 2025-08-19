<script setup lang="ts">
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'

const features = [$t('No VPN configs'), $t('No VPN configs'), $t('Zero ban anxiety')]
</script>

<template>
  <div class="max-w-[950px] mx-auto pt-36 flex flex-col gap-4 justify-center items-center">
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

    <TryItNow class="try-now" />
  </div>

  <div class="what-is-ip-address">
    <div class="intro">
      <div class="intro-title">
        {{ $t('What Is an IP Address?') }}
      </div>
      <div class="intro-content">
        <p>
          {{ $t("An IP address is your device's unique digital identifier on the internet. It's like a street address, allowing data to be sent to and from your device.") }}
        </p>
        <p>
          {{ $t('It also provides a general idea of your geographic location, enabling online communication and content delivery worldwide.') }}
        </p>
      </div>
    </div>
    <div class="tips">
      {{ $t('But sometimes, your IP address can also lead to restrictions on your online activity.') }}
    </div>
    <img src="@/assets/images/functions/what-is-ip-address.png" alt=""></img>
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

.try-now {
  margin-top: 20px;
  color: #fff;
  border-radius: 8px;
  border: 1px solid rgba(255, 255, 255, 0);
  background: linear-gradient(0deg, #12a3fc 0%, #12a3fc 100%), linear-gradient(99deg, #238aff 67.78%, #f9b3b4 107.9%);
}
</style>
