<script setup lang="ts">
const props = defineProps<{
  modelValue?: boolean,
}>()

</script>

<template>
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
      <div class="tips">
        {{ $t('But sometimes, your IP address can also lead to restrictions on your online activity.') }}
      </div>
    </div>
    <img src="@/assets/images/functions/earth.png" :alt="$t('What Is an IP Address?')" class="size-110"></img>
  </div>
</template>

<style lang="scss" scoped>
.what-is-ip-address {
  display: flex;
  gap: 130px;
  align-items: center;
  width: min(100%, 1280px);
}

.intro {
  display: flex;
  width: 590px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.intro-title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;

  /* H3 */
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */
  letter-spacing: -0.8px;
}

.intro-content {
  color: var(--colors-text-text-primary, #111213);

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
}

.tips {
  display: flex;
  padding: 10px 16px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 2px 12px 12px 2px;
  border-left: 4px solid var(--colors-border-border-subtle, #c7d1d6);
  background:
    linear-gradient(0deg, var(--colors-background-bg-info, #def3ff) 0%, var(--colors-background-bg-info, #def3ff) 100%),
    var(--colors-background-bg-block, #f1f5f8);
  backdrop-filter: blur(6px);
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Archivo;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-body, 28px); /* 155.556% */
}
</style>