<script setup lang="ts">

</script>

<template>
  <div class="download-now">
    <div class="title">
      {{ $t('使用 RoxyBrowser 更换 IP，真正实现隐身。') }}
    </div>
    <NuxtLinkLocale to="/download" class="download-btn">
      <rx-icon-svg-icon name="functions/site_ic_download" />
      {{ $t('立即下载') }}
    </NuxtLinkLocale>
  </div>
</template>

<style lang="scss" scoped>
.download-now {
  display: flex;
  flex-direction: column;
  gap: 25px;
  padding: 40px 60px;
  background-image: url('@/assets/images/functions/download-now-bg.svg');
  border-radius: 8px;
  @media (max-width: 768px) {
    padding: 24px;
    gap: 20px;
  }
}

.title {
  color: #fff;
  text-align: center;

  /* H4 */
  font-family: Archivo;
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */
  @media (max-width: 1024px) {
    font-size: 24px;
    line-height: 28px;
  }
}

.download-btn {
  display: inline-flex;
  padding: 12px 24px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  background: rgba(255, 255, 255, 0.9);
  color: var(--colors-text-text-link, #11a3fd);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 20px; /* 125% */
}
</style>
