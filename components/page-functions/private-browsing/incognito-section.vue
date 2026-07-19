<script setup lang="ts">

</script>

<template>
  <div class="incognito-section">
    <div class="incognito-section-content">
      <h2 class="title multilingual-text">
        {{ $t('为什么普通无痕模式不够安全？') }}
      </h2>
      <div class="description">
        {{ $t('无痕模式只能在你的设备上删除历史记录，它无法阻止网站通过 IP 地址和指纹信息追踪你、记录你的活动。所以，如果你想实现真正的匿名浏览，必须使用反侦测浏览器来隐藏你的真实身份。') }}
      </div>
    </div>
    <RxResponsiveImage name="functions/private-browsing/compare-section-img-1" class="w-full" alt="" />
  </div>
</template>

<style lang="scss" scoped>
.incognito-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  place-items: center;

  @media (max-width: 960px) {
    grid-template-columns: 1fr;
  }
}
.incognito-section-content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 20px;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */

  @media (max-width: 960px) {
    font-size: 20px;
    line-height: 28px;
  }
}

.description {
  color: var(--colors-text-text-primary, #111213);
  white-space: pre-line;
  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */

  @media (max-width: 960px) {
    font-size: 15px;
    line-height: 150%;
  }
}
</style>
