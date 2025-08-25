<script setup lang="ts">

</script>

<template>
  <div class="what-is-ip-address">
    <div class="intro">
      <div class="intro-title">
        {{ $t('什么是 IP 地址？') }}
      </div>
      <div class="intro-content">
        <p>
          {{ $t('IP 地址是你的设备在互联网上的唯一数字身份，就像一个“家庭住址”，让数据可以来回准确地传输。它也能大致透露你的地理位置，确保全球范围内的网络通信和内容传输。') }}
        </p>
      </div>
      <div class="tips">
        {{ $t('但有时候，你的 IP 地址也可能导致你的上网活动受到各种限制。') }}
      </div>
    </div>
    <img src="@/assets/images/functions/earth.png" :alt="$t('什么是 IP 地址？')" class="earth"></img>
  </div>
</template>

<style lang="scss" scoped>
.what-is-ip-address {
  display: flex;
  align-items: center;
  width: min(100%, 1280px);
  position: relative;
  overflow-x: clip;
}

.intro {
  display: flex;
  max-width: 590px;
  flex-direction: column;
  align-items: flex-start;
  gap: 24px;
}

.earth {
  position: absolute;
  right: 60px;
  width: 440px;
  height: 440px;
}

@media (max-width: 1150px) {
  .earth {
    transform: translateX(40%);
  }
}
@media (max-width: 1024px) {
  .earth {
    transform: translateX(70%);
  }
}

@media (max-width: 768px) {
  .earth {
    transform: translateX(90%);
  }
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

  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.intro-content {
  color: var(--colors-text-text-primary, #111213);

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
  }
}

.tips {
  display: flex;
  padding: 10px 16px;
  align-items: center;
  gap: 10px;
  align-self: stretch;
  border-radius: 2px 12px 12px 2px;
  border-left: 4px solid var(--colors-border-border-brand, #11a3fd);
  background: var(--colors-background-bg-info, #def3ff);
  backdrop-filter: blur(6px);
  color: var(--colors-border-border-brand, #11a3fd);
  font-family: Archivo;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--line-body, 28px); /* 155.556% */

  @media (max-width: 1024px) {
    font-size: 15px;
    line-height: 150%;
  }
}
</style>
