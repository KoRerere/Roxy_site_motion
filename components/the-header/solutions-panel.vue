<template>
  <div class="flex flex-col text-white">
    <NuxtLinkLocale to="/solutions/e-commerce">
      <div
        class="w-255px p-3 pb-4 bg-[radial-gradient(149.47%_89.09%_at_125.91%_100%,_#12FCFC_0%,_#12A3FC_100%)] rounded-1"
      >
        <div class="text-14px leading-18px font-600 font-[Archivo]">{{ $t('电子商务') }}</div>
        <p class="text-3 font-400 mt-10px">
          {{ $t('安全运营电商平台店铺，稳定拓展市场规模') }}
        </p>
      </div>
    </NuxtLinkLocale>

    <NuxtLinkLocale to="/solutions/social-networks">
      <div class="mt-3 relative w-255px h-214px">
        <div class="absolute p-3 top-0 left-0 flex flex-col gap-6px">
          <div class="text-14px leading-18px font-600 font-[Archivo]">{{ $t('社媒营销') }}</div>
          <div class="text-note font-400">
            {{ $t('轻松管理社交平台账号，精准优化营销策略') }}
          </div>
        </div>
        <RxResponsiveImage name='header/social-networks' class="w-full" alt="" />
      </div>
    </NuxtLinkLocale>
  </div>

  <div class="min-w-220px flex flex-col">
    <PanelItem 
      v-for="feat in coreFeatures" 
      v-bind="feat"
    />
  </div>

  <div class="min-w-220px flex flex-col">
    <PanelItem 
      v-for="feat in mainFeatures" 
      v-bind="feat"
    />
  </div>
</template>

<script setup>
import PanelItem from "./panel-item.vue";

const props = defineProps({
  is1: {
    type: Boolean,
    default: false,
  },
});

const coreFeatures = computed(() => [
  {
    icon: "menu/privacy-defense",
    title: $t("隐私防护"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/privacy-defense",
  },
  {
    icon: "menu/social-networks",
    title: $t("社交网络"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/social-networks",
  },
  {
    icon: "menu/affiliate-market",
    title: $t("联盟营销"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/affiliate-market",
  },
  {
    icon: "menu/web-scraping",
    title: $t("数据采集"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/web-scraping",
  },
  {
    icon: "menu/e-commerce",
    title: $t("电子商务"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/e-commerce",
  },
  {
    icon: "menu/crypto-gains",
    title: $t("加密收益"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/crypto-gains",
  },
]);

const mainFeatures = computed(() => [
  {
    icon: "menu/traffic-trade",
    title: $t("流量获利"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/traffic-trade",
  },
  {
    icon: "menu/ad-strategy",
    title: $t("广告策略"),
    desc: "Praesent vitae convallis quam",
    link: "/solutions/ad-strategy",
  }
]);
</script>
