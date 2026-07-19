<script setup lang="ts">
import product1 from '@/assets/images/functions/roxy-ip/product1.svg?url'
import product11 from '@/assets/images/functions/roxy-ip/product1_1.svg?url'
import product2 from '@/assets/images/functions/roxy-ip/product2.svg?url'
import product22 from '@/assets/images/functions/roxy-ip/product2_1.svg?url'
import product3 from '@/assets/images/functions/roxy-ip/product3.svg?url'
import product33 from '@/assets/images/functions/roxy-ip/product3_1.svg?url'
import product4 from '@/assets/images/functions/roxy-ip/product4.svg?url'
import product44 from '@/assets/images/functions/roxy-ip/product4_1.svg?url'
import { useRxI18n } from '~/composables/useRxI18n'

const { $t } = useRxI18n()

const reasons = [
  {
    title: $t('行业领先的 IP 数量'),
    description: $t('超 9000 万原生住宅 IP 资源，覆盖 200 + 国家和地区，支持城市级精准定位，满足全球业务场景需求。'),
    img1: product1,
    img2: product11,
  },
  {
    title: $t('行业领先的 IP 速度'),
    description: $t('直播级网络传输速度，最高支持 100Mb 带宽，断线可享退款保障，告别卡顿与断连困扰。'),
    img1: product2,
    img2: product22,
  },
  {
    title: $t('行业领先的 IP 质量'),
    description: $t('电商、社媒场景 IP 通过率 100%，IP 经过多轮纯度与匿名性测试，杜绝 IP 黑名单风险。'),
    img1: product3,
    img2: product33,
  },
  {
    title: $t('行业更低的 IP 价格'),
    description: $t('低至 $4/IP/月，相比行业同类产品价格降低 50%，低成本搭建稳定防关联运营环境。'),
    img1: product4,
    img2: product44,
  },
]
</script>

<template>
  <Container class="pt-9 flex flex-col items-center xl:pb-20 xl:pt-20 md:pb-15 md:pt-15">
    <h2 class="text-6 color-[#111213] leading-7 font-600 multilingual-text text-center xl:text-10 md:text-8.5 xl:leading-12 md:leading-11 md:font-700">
      {{ $t('产品核心优势') }}
    </h2>
    <div class="text-3.5 color-[#34393D] leading-5 mt-2 text-center md:text-4.5 md:leading-7">
      {{ $t("浏览器指纹隔离 + 超纯净住宅 IP 双管齐下，从根源规避平台关联判定，保障多账号独立运营安全。") }}
    </div>
    <div class="mt-8 gap-5 grid xl:mt-12 md:gap-4 md:grid-cols-2">
      <div v-for="reason in reasons" :key="reason.title" class="item pa-5 pb-6 flex flex-col gap-6 relative overflow-hidden xl:pa-10 md:pa-8 xl:pb-12">
        <img :src="reason.img1" :alt="reason.title" class="w-12 aspect-square block md:w-15">
        <img :src="reason.img2" :alt="reason.title" class="w-45 aspect-square block absolute md:w-60 -right-40px -top-40px -md:top-50px">
        <div class="flex flex-col gap-2 md:gap-2.5">
          <h3 class="item-title text-4.5 multilingual-text md:text-6">
            {{ reason.title }}
          </h3>
          <div class="item-description text-3.75 md:text-4.5">
            {{ reason.description }}
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.item {
  border-radius: 20px;
  background: #fff;
  box-shadow: 0 4px 16px 0 rgba(175, 183, 187, 0.2);

  &-title {
    color: #111213;
    font-family: Archivo;
    font-weight: 600;
    line-height: 1.5;
  }

  &-description {
    color: #575d60;
    line-height: 1.5;
  }
}
</style>
