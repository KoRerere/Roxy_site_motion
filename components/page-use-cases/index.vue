<script setup lang="ts">
import type { FAQProps, FooterPanelProps, HeaderPanelProps, Introduce2Props, IntroduceProps, WhyChooseProps } from './components/interface'
import FAQ from './components/FAQ.vue'
import FooterPanel from './components/FooterPanel.vue'
import HeaderPanel from './components/HeaderPanel.vue'
import Introduce2 from './components/Introduce2.vue'
import Introduce from './components/Introduce.vue'
import WhyChoose from './components/WhyChoose.vue'
// background: linear-gradient(0deg, #F8FAFB 0%, #F8FAFB 100%), #1E1C31;
defineProps<{
  headerPanel: HeaderPanelProps
  introduce: IntroduceProps
  introduce2: Introduce2Props
  faq: FAQProps
  whyChoose: WhyChooseProps
  footerPanel: FooterPanelProps
}>()
</script>

<template>
  <div class="bg-[#F8FAFB] relative overflow-hidden">
    <main class="flex flex-col gap-10 relative z-10 lg:gap-15 xl:gap-20">
      <HeaderPanel v-bind="headerPanel" />
      <Container>
        <Introduce v-bind="introduce" />
      </Container>
      <Introduce2 v-bind="introduce2" />
      <FAQ v-bind="faq" class="relative z-10" />
      <Container>
        <WhyChoose v-bind="whyChoose" />
      </Container>
      <Container>
        <FooterPanel v-bind="footerPanel" />
      </Container>
    </main>

    <img src="/bg-effect.svg" alt="" class="max-h-650px w-full left-0 top-0 absolute z-0">
    <img src="/use-cases/bg.svg" class="w-full select-none left-50% top-3000px absolute z-9" draggable="false" alt="">
    <img src="/use-cases/bg.svg" class="w-full select-none top-3400px absolute z-9 -left-50%" draggable="false" alt="">
  </div>
</template>
