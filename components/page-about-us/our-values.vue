<script setup lang="ts">
import type { SvgNames } from '@/components/rx-icon'
import { RxIcon } from '@/components/rx-icon'

const data: { icon: SvgNames, title: string, desc: string }[] = [
  {
    icon: 'about-us/rx_ic_people',
    title: $t('国际化研发与服务团队'),
    desc: $t('全球布局，快速响应，多元化经验'),
  },
  {
    icon: 'about-us/tech-innovators',
    title: $t('顶尖技术实力'),
    desc: $t('MIT 博士及世界级科技公司背景，深耕浏览器底层技术'),
  },
  {
    icon: 'about-us/transparent-partners',
    title: $t('高效业务支持'),
    desc: $t('支持多环境、多账户操作，助力全球化业务增长'),
  },
  {
    icon: 'about-us/security-uncompromised',
    title: $t('安全与稳定'),
    desc: $t('严格隐私保护与设备隔离，保障全球用户业务安全'),
  },
  {
    icon: 'about-us/rx-ic-earth',
    title: $t('丰富跨境经验'),
    desc: $t('多年跨境电商与全球化业务实践，熟悉各地合规与风控策略'),
  },
]
</script>

<template>
  <Container class="py-10 flex flex-col gap-10 justify-between xl:flex-row">
    <h2 class="text-6 font-700 lg:text-h3">
      <p class="after-div inline-block relative">
        {{ $t('我们的核心优势') }}
      </p>
    </h2>
    <div class="gap-6 grid grid-cols-1 lg:gap-10 xl:gap-15 lg:grid-cols-2">
      <div v-for="item in data" :key="item.title" class="flex flex-col gap-8 lg:w-394px">
        <div class="flex gap-2 items-start lg:gap-3">
          <span class="text-5.5 mt-1 lg:text-7">
            <RxIcon :name="item.icon" :style="{ fontSize: 'inherit' }" />
          </span>
          <div class="flex flex-col gap-2 lg:gap-3">
            <p class="text-5 text-primary font-500 lg:text-h6">
              {{ item.title }}
            </p>
            <p class="text-3.5 text-tertiary font-400 lg:text-body">
              {{ item.desc }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.after-div::after {
  content: '';
  display: block;
  position: absolute;
  left: 0;
  bottom: -12px;
  width: 45%;
  height: 5px;
  border-radius: 55px;
  background: #11a3fd;
}
</style>
