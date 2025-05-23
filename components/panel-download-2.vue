<template>
  <Container class="rounded-3 lg:rounded-10 overflow-hidden relative my-8 lg:my-10">
    <div class="absolute top-0 left-0 right-0 bottom-0 z-9">
      <RxResponsiveImage 
        name="download/panel-bg" 
        alt="" 
        class="w-full h-full object-cover" 
      />
      <div class="absolute top-0 left-0 right-0 bottom-0 z-10 bg-black/10"></div>
    </div>

    <div class="flex items-center flex-col pt-30px pb-10 relative z-10">
      <RxIcon name="base/rx_ic_logo" size="72" />
      <div class="my-6 text-center">
        <h2 class="section6-title">{{ $t('隐私保护，从 RoxyBrowser 启航') }}</h2>
        <p class="section6-desc">{{ $t('匿名浏览，远离追踪') }}</p>
      </div>
      <NuxtLinkLocale class="flex items-center gap-2 text-white text-14px py-3 px-4 bg-[#11A3FD] rounded-6px" to="/download">
        <RxIcon name="base/rx_ic_download" class="text-white" />
        {{ $t('立即下载') }} 
      </NuxtLinkLocale>
    </div>
  </Container>
</template>

<script setup>
import { RxIcon } from '@/components/rx-icon'
</script>

<style lang="scss" scoped>
.section6 {
  &-title {
    color: #FFF;
    font-family: Archivo;
    font-size: 40px;
    font-style: normal;
    font-weight: 700;
    line-height: 40px; /* 100% */
  }

  &-desc {
    color: #FFF;
    font-family: Archivo;
    font-size: 24px;
    font-style: normal;
    font-weight: 400;
    line-height: 48px;
  }
}

.download-button {
  color: #FFF;
  font-size: 14px;
  line-height: 20px;
  display: flex;
  align-items: center;
  span {
    text-decoration: none !important;
    text-decoration-line: none !important;
    -webkit-text-decoration-line: none !important;
  }
}

.magic {
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, .1);
}

@media (min-width: 1024px) and (max-width: 1440px) {
  .section6 {
    &-title {
      font-size: 36px;
    }
  }
}

@media (min-width: 768px) and (max-width: 1024px) {
  .section6 {
    &-title {
      font-size: 28px;
      line-height: 32px;
    }

    &-desc {
      font-size: 20px;
      line-height: 32px;
    }
  }
}

@media (min-width: 0px) and (max-width: 768px) {
  .section6 {
    &-title {
      font-family: Archivo;
      font-size: 20px;
      line-height: 24px; /* 120% */
    }

    &-desc {
      font-size: 18px;
      line-height: 32px;
    }
  }
}
</style>