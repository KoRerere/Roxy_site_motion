<script setup lang="ts">
/** 顶部渐变光晕背景，近似 Figma gradient 实例 */
</script>

<template>
  <div class="feature-carousel-bg pointer-events-none inset-0 absolute overflow-hidden" aria-hidden="true">
    <div class="feature-carousel-bg__wash" />
    <div class="feature-carousel-bg__blob feature-carousel-bg__blob--cyan" />
    <div class="feature-carousel-bg__blob feature-carousel-bg__blob--pink" />
    <div class="feature-carousel-bg__blob feature-carousel-bg__blob--violet" />
  </div>
</template>

<style lang="scss" scoped>
.feature-carousel-bg {
  background: rgba(255, 255, 255, 0.12);

  /* 移动端：光晕上移并略透明，对齐 Figma gradient 39830:32605 */
  @media (max-width: 767px) {
    opacity: 0.6;

    .feature-carousel-bg__blob--cyan {
      width: 72%;
      left: 50%;
      top: -42%;
      transform: translateX(-50%);
    }

    .feature-carousel-bg__blob--pink {
      width: 56%;
      right: -20%;
      top: -8%;
    }

    .feature-carousel-bg__blob--violet {
      width: 44%;
      right: 10%;
      bottom: 28%;
    }
  }
}

.feature-carousel-bg__wash {
  position: absolute;
  inset: 0;
  background: #fff;
}

.feature-carousel-bg__blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.55;
}

.feature-carousel-bg__blob--cyan {
  width: 52%;
  height: 58%;
  left: 5%;
  top: -28%;
  background: radial-gradient(circle, rgb(63 170 246 / 45%) 0%, transparent 70%);
}

.feature-carousel-bg__blob--pink {
  width: 48%;
  height: 52%;
  right: -8%;
  top: 18%;
  background: radial-gradient(circle, rgb(243 89 220 / 38%) 0%, transparent 72%);
}

.feature-carousel-bg__blob--violet {
  width: 36%;
  height: 40%;
  right: 22%;
  bottom: -12%;
  background: radial-gradient(circle, rgb(18 163 252 / 32%) 0%, transparent 70%);
}
</style>
