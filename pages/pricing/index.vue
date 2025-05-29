<template>
  <div class="text-[#FFF] relative bg-[linear-gradient(180deg,#152B54_0%,#222F55_94.67%)]">
    <ClientOnly>
      <Aurora class="absolute top-0 left-0 w-full h-full !lg:h-240px" :speed="0.5" />
      <RisingStar class="!h-full" />
    </ClientOnly>

    <Container class="relative z-10 overflow-hidden">
      <h1 class="text-center text-9 leading-snug sm:text-h2 font-700 pt-120px sm:pt-[132px]">
        {{ $t('升级你的体验') }}
      </h1>
      <!-- <p class="text-center text-14px sm:text-sub-title font-400 mt-5">
        {{ $t('7天免费试用，无需绑定支付信息') }}
      </p> -->
    </Container>

    <div class="flex justify-center md:hidden mt-10 pb-6">
      <PricingButtonGroup2  v-model="ratioValue" />
    </div>

    <div class="hidden md:block mt-15">
      <PricingButtonGroup class="" v-model="ratioValue" />
    </div>
  </div>

  <Container>
    <div class="hidden lg:flex justify-between mt-10">
      <h2>{{ $t('价格计算') }}</h2>
      <!-- <div class="flex items-center gap-10px">
        <div class="text-[#FC9D12] font-700">
          <span class="text-sub-title font-500 text-primary mr-10px">{{ profile }}+5 {{ $t('窗口') }}</span>
          <span class="text-6">$</span>
          <span class="text-9">
            {{ currency(monthPrice).format().replace('$', '') }}
          </span>
        </div>
        <div class="flex flex-col gap-1">
          <div class="text-sub-title text-primary font-[Archivo] flex items-center gap-1">
            /{{ $t('月') }}
            <div
              @click="openHandler" 
              @mouseenter="openHandler" 
            >
              <RxIcon name="base/rx_ic_info" />
            </div>
          </div>
          <div class="text-[#FC9D12] text-3 py-2px px-1 bg-[#FFEEDC] rounded-1">{{ $t('节省') }} {{ currency(monthSave).format() }}</div>
        </div>
      </div> -->
    </div>

    <PanelLG 
      class="grid lg:hidden mt-10" 
      :month-price="monthPrice"
      :month-save="monthSave"
      :min="packData.min"
      :max="packData.max"
      :price="packData.price"
      v-model="profile"
    />

    <PricingTable class="mt-10 lg:mt-4 lg:pb-20 lg:mb-20" v-model="profile" :month-price="monthPrice" :month-save="monthSave" />

    <div class="pt-102px pb-20 block lg:hidden">
      <PanelDownload>RoxyBrowser</PanelDownload>
    </div>
  </Container>
  
  <div 
    style="background: radial-gradient(100% 100% at 50% 0%, #E8EFF2 0%, #FFF 100%);" 
    ref="mainRef"
  >
    <Container>
      <PlayMode />
    </Container>
    <Faq :fqa-list="faqList" class="fqa-container" />
    <Container>
      <PanelDownload2 />
    </Container>
  </div>
</template>

<script setup lang="ts">
import PricingButtonGroup2 from '~/components/page-pricing/pricing-button-group2.vue'
import PricingButtonGroup from '~/components/page-pricing/pricing-button-group.vue'
import PricingTable from '~/components/page-pricing/pricing-table.vue'
import PlayMode from '~/components/page-pricing/play-mode.vue'
import RisingStar from "~/components/page-home/components/RisingStar.vue";
import { usePricing } from '~/components/page-pricing/configs'
import PanelLG from '~/components/page-pricing/panel-lg.vue'

const {
  profile,
  ratioValue,
  monthPrice,
  monthSave,
  packData
} = usePricing()

const Aurora = computed(() => {
  return defineAsyncComponent(() => import('@/components/page-home/components/Aurora.vue'))
})

const faqList = computed(() => [
  {
    title: $t('是否有免费试用？'),
    desc: $t('新用户可激活一次 7 天免费试用，包含 10 个窗口和所有功能。')
  },
  {
    title: $t('我应该选择什么方案？'),
    desc: $t('根据您的业务需求或账号数量选择合适的订阅套餐。您可在体验完整功能后再决定最适合的方案。')
  },
  {
    title: $t('工作空间是什么？'),
    desc: $t('通过隔离数据和资源，工作空间为您提供安全无忧的协作环境，无需繁琐的权限设置即可有效防止关键信息泄露。您可以一键切换不同工作空间，保持工作高效流畅，同时确保数据和权限的严格隔离。')
  },
  {
    title: $t('我可以调整订阅套餐吗？'),
    desc: $t('是的，您可以根据业务需求随时升级订阅套餐。')
  },
  {
    title: $t('如果没有继续订阅会有什么影响？'),
    desc: $t('请放心，您的所有窗口数据将全部保留，但可启动的窗口数量限制为最初创建的5个。')
  }
])

onErrorCaptured((e) => {
  console.log('onErrorCaptured', e)
  return false
})

</script>

<style scoped>
.aurora {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 0;
}
</style>