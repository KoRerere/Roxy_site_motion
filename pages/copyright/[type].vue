<script setup>
import { 
  CopyrightZhPrivacy, 
  CopyrightZhRefund, 
  CopyrightZhUser, 
  CopyrightEnPrivacy, 
  CopyrightEnRefund, 
  CopyrightEnUser,
  CopyrightEnRenewal
} from '#components'
const { $t, locale } = useRxI18n()
const route = useRoute()

const solutionMap = {
  user: {
    title: $t("使用条款"),
    subtitle: $t("用户协议"),
  },
  privacy: {
    title: $t("使用条款"),
    subtitle: $t("隐私政策"),
  },
  refund: {
    title: $t("使用条款"),
    subtitle: $t("退款协议"),
  },
  renewal: {
    title: $t("使用条款"),
    subtitle: "Auto-Renewal Service Agreement",
  }
}

const solutions = solutionMap[route.params.type] || solutionMap["user"];

const cmpMap = {
  zh: {
    privacy: CopyrightZhPrivacy,
    refund: CopyrightZhRefund,
    user: CopyrightZhUser,
    renewal: CopyrightEnRenewal
  },
  en: {
    privacy: CopyrightEnPrivacy,
    refund: CopyrightEnRefund,
    user: CopyrightEnUser,
    renewal: CopyrightEnRenewal
  },
  ru: {
    privacy: CopyrightEnPrivacy,
    refund: CopyrightEnRefund,
    user: CopyrightEnUser,
    renewal: CopyrightEnRenewal
  }
}

const current = computed(() => (cmpMap[locale.value] || cmpMap.en)[route.params.type])
</script>

<template>
  <div class="w-850px mx-auto max-xl:w-full max-xl:px-15 max-md:px-10 max-sm:px-6 mt-130px pb-15 font-[Heebo]">
    <h1 class="my-4 font-600 text-6">{{ solutions.subtitle }}</h1>
    <component 
      v-if="current" 
      :is="current" 
      class="leading-[27px] [&>p]:mb-10px [&>p]:text-4 [&>h2]:mb-10px [&>h2]:mt-5 [&>h2]:text-4 [&>h3]:mb-10px [&>h3]:text-4" />
  </div>
</template>