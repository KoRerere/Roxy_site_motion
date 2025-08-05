<template>
  <div class="relative bg-[#F8FAFB] overflow-hidden">
    <main class="flex flex-col gap-10 lg:gap-15 xl:gap-20 relative z-10">
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

    <img src="/bg-effect.svg" alt="" class="w-full absolute top-0 left-0 z-0 max-h-650px" />
    <img src="/use-cases/bg.svg" class="absolute top-3000px left-50% w-full z-9 select-none" draggable="false" />
    <img src="/use-cases/bg.svg" class="absolute top-3400px -left-50% w-full z-9 select-none" draggable="false" />
  </div>
</template>

<script setup lang="ts">
import HeaderPanel from './components/HeaderPanel.vue';
import Introduce from './components/Introduce.vue';
import Introduce2 from './components/Introduce2.vue';
import FAQ from './components/FAQ.vue';
import WhyChoose from './components/WhyChoose.vue';
import FooterPanel from './components/FooterPanel.vue';
import type { HeaderPanelProps, IntroduceProps, Introduce2Props, FAQProps, WhyChooseProps, FooterPanelProps } from './components/interface';
// background: linear-gradient(0deg, #F8FAFB 0%, #F8FAFB 100%), #1E1C31;
const props = defineProps<{
  headerPanel: HeaderPanelProps
  introduce: IntroduceProps
  introduce2: Introduce2Props
  faq: FAQProps
  whyChoose: WhyChooseProps
  footerPanel: FooterPanelProps
}>()
</script>