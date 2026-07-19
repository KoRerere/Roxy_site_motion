<template>
  <Container class="flex flex-col gap-12">
    <h2 class="text-6 text-primary font-700 flex justify-center lg:text-h3">
      <p class="after-div relative">
        {{ $t('行业认可') }}
      </p>
    </h2>
    <div>
      <p class="text-4 text-tertiary leading-24px font-400 text-left lg:text-6 lg:leading-40px md:text-center">
        {{ $t('公司在长期技术研发与跨境业务实践中，多次获得业内和国际权威机构认可，充分体现了 RoxyBrowser 在安全、稳定及高效浏览解决方案领域的领先实力。') }}
      </p>
    </div>
  </Container>
</template>

<style lang="scss" scoped>
.after-div::after {
  content: '';
  display: block;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
  bottom: -16px;
  width: 45%;
  height: 5px;
  border-radius: 55px;
  background: #11a3fd;
}
</style>
