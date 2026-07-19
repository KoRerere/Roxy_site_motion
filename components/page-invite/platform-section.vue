<script setup lang="ts">
import { useIntersectionObserver } from '@vueuse/core'
import { platformList } from '@/components/page-home/components/config'
import Marquee from '@/components/page-home/components/Marquee.vue'
import darkBg from '@/assets/svgs/intive/Dark.svg?url'

const sectionRef = ref<HTMLElement | null>(null)
/** 进入视口后再挂载 PC Logo 轮播，减少首屏请求 */
const showPlatformMedia = ref(false)
/** 区块是否在视口内，用于暂停/恢复轮播 */
const isPlatformVisible = ref(false)

const { stop } = useIntersectionObserver(
  sectionRef,
  ([entry]) => {
    const visible = entry?.isIntersecting ?? false
    isPlatformVisible.value = visible
    if (visible)
      showPlatformMedia.value = true
  },
  { rootMargin: '120px 0px' },
)

onBeforeUnmount(() => stop())
</script>

<template>
  <section
    ref="sectionRef"
    class="invite-platform-section relative w-full overflow-hidden py-[24px] text-white lg:(min-h-[198px] pb-[42px] pt-[48px])"
  >
    <!-- 背景 SVG 铺满区块（渐变/光晕）；移动端白点由下方点阵层单独铺满 -->
    <img
      class="invite-platform-bg pointer-events-none absolute inset-0 z-0 h-full w-full"
      :src="darkBg"
      alt=""
      aria-hidden="true"
    >
    <!-- 移动端：白点阵铺满整个模块（Dark.svg 点阵仅覆盖下半区，无法随模块增高） -->
    <div
      class="invite-platform-dots pointer-events-none absolute inset-0 z-0 lg:hidden"
      aria-hidden="true"
    />

    <!-- PC 渐隐：铺满 section 全高 + 左右边缘，非仅 Logo 行高度 -->
    <div
      class="invite-platform-edge-fade pointer-events-none absolute inset-0 z-2 hidden lg:block"
      aria-hidden="true"
    />

    <!-- 标题限宽；Logo 行全宽 -->
    <Container class="invite-platform-inner relative z-1">
      <h2 class="text-center text-white font-[Inter] text-[16px] leading-[16px] font-600 lg:(text-[18px] leading-[28px] font-400)">
        {{ $t('invite.platformTitle') }}
      </h2>
    </Container>

    <div class="invite-platform-logos-shell relative z-1 w-full lg:(mt-[8px])">
      <Container>
        <div class="invite-platform-logos mt-[16px] h-[40px] lg:(mt-0 h-[72px])">
          <div class="invite-platform-logos-pc hidden h-full w-full lg:block">
            <ClientOnly>
              <PageInvitePlatformMedia
                v-if="showPlatformMedia"
                class="h-full w-full"
                :active="isPlatformVisible"
              />
            </ClientOnly>
          </div>

          <Marquee v-if="showPlatformMedia" class="[--duration:20s] lg:hidden">
            <ul class="m-0 list-none flex items-center gap-[24px] p-0">
              <li v-for="item in platformList" :key="item">
                <img
                  loading="lazy"
                  :src="item"
                  alt=""
                  draggable="false"
                  class="h-[40px] w-[80px] select-none object-contain"
                >
              </li>
            </ul>
          </Marquee>
        </div>
      </Container>
    </div>
  </section>
</template>

<style scoped>
.invite-platform-bg {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center bottom;
}

/* 移动端：12px 间距 4px 白点，对齐 Dark.svg 点阵规格，铺满模块高度 */
@media (max-width: 1023.98px) {
  .invite-platform-dots {
    background-image: radial-gradient(circle, rgba(255, 255, 255, 0.3) 2px, transparent 2px);
    background-size: 12px 12px;
    opacity: 0.4;
    mix-blend-mode: overlay;
  }
}

/* 玻璃底：10% 白叠层 + #050608 深色底，与注册卡片 invite-form-shell 同色板 */
.invite-platform-section {
  background:
    linear-gradient(0deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.1) 100%),
    linear-gradient(180deg, #050608 0%, #050608 100%),
    linear-gradient(180deg, #050608 0%, #050608 207.97%);
  backdrop-filter: blur(30px);
}

/* 顶部分割线：Figma Border colors 线性渐变 #FFF 0% → 20% → 20% → 0% */
.invite-platform-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  z-index: 3;
  height: 1px;
  background: linear-gradient(
    to right,
    rgba(255, 255, 255, 0) 0%,
    rgba(255, 255, 255, 0.2) 25%,
    rgba(255, 255, 255, 0.2) 75%,
    rgba(255, 255, 255, 0) 100%
  );
  pointer-events: none;
}

.invite-platform-logos {
  width: 100%;
}

/* PC 渐隐贴 section 全宽左右边缘（绿框），非 Container 内 Logo 旁（红框） */
@media (min-width: 1024px) {
  .invite-platform-edge-fade::before,
  .invite-platform-edge-fade::after {
    content: '';
    position: absolute;
    top: 0;
    bottom: 0;
    width: 240px;
    pointer-events: none;
  }

  .invite-platform-edge-fade::before {
    left: 0;
    background: linear-gradient(to right, #050608 -60%, transparent 100%);
  }

  .invite-platform-edge-fade::after {
    right: 0;
    background: linear-gradient(to left, #050608 -60%, transparent 100%);
  }
}
</style>
