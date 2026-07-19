<template>
  <Container class="pt-12 lg:pt-18 md:pt-15 xl:pt-22">
    <h3 class="text-6 font-700 text-center lg:text-h2 en-US:font-[Archivo]">
      {{ $t('权威合规认证・安全保障') }}
    </h3>
    <p class="text-3.5 mt-2 text-center text-center lg:text-body">
      {{ $t('RoxyBrowser 荣获 SOC 2/Widevine/ISO/GDPR 认证。关注 RoxyBrowser，获取最新的安全认证信息。') }}
    </p>

    <div class="px-15 pt-6 gap-5 grid grid-cols-2 xl:(px-48 pt-12) lg:(gap-20 gap-30) md:grid-cols-4">
      <RxResponsiveImage
        v-for="url in ['home/certification/alcpa', 'home/certification/3pl', 'home/certification/iso', 'home/certification/gdpr']"
        :key="url"
        :name="url"
        class="h-full w-full object-cover"
        alt="certification"
      />
    </div>
  </Container>
</template>
