<script setup lang="ts">
const { $t } = useRxI18n()

const { isEn } = useRxI18n()
</script>

<template>
  <div class="trusted-proxies-access">
    <div class="content flex flex-col gap-4.5 md:gap-2.5 xl:gap-5">
      <div>
        <h2 class="text-6 color-[#111213] leading-7 font-600 multilingual-text text-center md:text-8.5 xl:text-10 md:leading-11 xl:leading-12 md:font-700">
          {{ $t('内置于 RoxyBrowser，一键使用') }}
        </h2>
        <div class="text-3.5 color-[#111213] leading-5.5 mt-2 text-center md:text-4.5 md:leading-7">
          {{ $t('告别复杂流程与第三方中间商，下载软件、选择 IP、创建窗口，三步即可开启防关联。') }}
        </div>
      </div>
      <img v-if="isEn" src="@/assets/images/functions/trusted-proxies-access-example.png" alt="trusted-proxies-access" class="w-full">
      <img v-else src="@/assets/images/functions/trusted-proxies-access-example-zh.png" alt="trusted-proxies-access" class="w-full">
    </div>
    <div class="mask" />
  </div>
</template>

<style lang="scss" scoped>
.trusted-proxies-access {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 100px 0;
  width: 100%;
  background-image: url('@/assets/images/functions/trusted-proxies-access-bg.png');
  background-color: radial-gradient(86.21% 231.94% at 50% 0%, rgba(18, 163, 252, 0.12) 0%, rgba(18, 163, 252, 0) 70%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
  z-index: 1;

  &:after {
    content: '';
    position: absolute;
    inset: 0;
    background: radial-gradient(86.21% 231.94% at 50% 0%, rgba(18, 163, 252, 0.12) 0%, rgba(18, 163, 252, 0) 70%);
    z-index: -2;
  }

  @media (max-width: 1024px) {
    padding: 40px 16px 0;
  }
}

.content {
  max-width: 1080px;
}

.mask {
  position: absolute;
  height: 120px;
  background: linear-gradient(180deg, rgba(248, 250, 251, 0) 0%, #f8fafb 80%);
  bottom: -1px;
  left: 0;
  right: 0;
}
</style>
