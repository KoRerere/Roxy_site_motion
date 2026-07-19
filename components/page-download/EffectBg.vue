<script setup lang="ts">
const { isDark } = useTheme()
const imageName = computed(() => isDark.value ? 'download/bg_dark' : 'download/bg_light')
</script>

<template>
  <div class="box hidden lg:block">
    <div class="effect-bg relative z-10">
      <RxResponsiveImage :name="imageName" class="w-145" />
    </div>
    <div class="effect-bg2 absolute z-9">
      <RxResponsiveImage name="download/macbook" class="effect-bg2-img w-465px" />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.box {
  position: absolute;
  top: 5%;
  left: 50%;
  transform: translateX(-50%);
}

.effect-bg {
  transform: perspective(800px) rotateX(-60deg);
  border-radius: 16px 16px 24px 24px;
  overflow: hidden;
}

.effect-bg2 {
  left: 50%;
  transform: translateY(-50%) rotateX(-190deg) translateX(-50%);
  border-radius: 12px;
  width: 160%;
  display: flex;
  justify-content: center;
  align-items: center;

  picture {
    filter: blur(30px);
    opacity: 0.4;
  }
  -webkit-mask-image: linear-gradient(transparent, black);
  mask-image: linear-gradient(transparent, black);
}

.dark .effect-bg2 {
  mask-image: none;
  -webkit-mask-image: none;
  picture {
    filter: blur(50px);
    opacity: 0.3;
  }
}

.effect-bg2::before {
  content: '';
  position: absolute;
  z-index: 10;
  bottom: 9%;
  width: 55%;
  height: 20px;
  background-color: rgb(255, 255, 255);
  filter: blur(8px);
  left: 50%;
  transform: translateX(-50%);
}

.effect-bg2-img {
  transform: perspective(1200px) rotateX(-60deg);
}

[data-theme='dark'] .effect-bg2::before {
  background-color: rgb(0, 0, 0);
}
</style>
