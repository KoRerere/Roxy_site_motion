<script setup lang="ts">
import type { Swiper as SwiperClass } from 'swiper/types'
import { useIntersectionObserver } from '@vueuse/core'
// import required modules
import { Autoplay, Navigation, Pagination } from 'swiper/modules'
// Import Swiper Vue.js components
import { Swiper, SwiperSlide } from 'swiper/vue'
import TryItNow from '~/components/page-use-cases/components/TryItNow.vue'
import { useRxWindowSize } from '~/composables/useRxWindowSize'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/pagination'

import 'swiper/css/navigation'

const swiperRef = ref<SwiperClass>()
const targetIsVisible = ref(false)
const { width } = useRxWindowSize()
const target = useTemplateRef<HTMLDivElement>('target')
useIntersectionObserver(
  target,
  ([entry]) => {
    // 当元素的可见比例 >= 0.8 时认为满足条件
    targetIsVisible.value = entry?.intersectionRatio >= 0.8
  },
  {
    threshold: Array.from({ length: 101 }, (_, i) => i / 100), // 0 ~ 1 分段
  },
)

const modules = [Autoplay, Pagination, Navigation]

const slides = [
  {
    img: 'functions/private-browsing/operation-card-img-1',
    title: $t('下载并注册'),
    description: [
      $t('首先，在电脑下载并安装 RoxyBrowser，然后注册一个账号。'),
      $t('软件支持 Windows 和 macOS 系统。'),
    ],
  },
  {
    img: 'functions/private-browsing/operation-card-img-2',
    title: $t('创建窗口配置'),
    description: [
      $t('在 RoxyBrowser 中创建一个窗口，填写基础信息并设置浏览器指纹。'),
      $t('如果你想更换 IP 地址，只需添加代理 IP。记得同时更新指纹信息，确保所有身份标识的一致性和安全性。'),
    ],
  },
  {
    img: 'functions/private-browsing/operation-card-img-3',
    title: $t('开始匿名浏览'),
    description: [
      $t('保存配置后，点击“打开”。新的窗口将以你的虚拟身份启动，你可以匿名访问任何网站，不会暴露任何真实信息。'),
    ],
  },
]

const slideIndex = ref(0)

watch(targetIsVisible, (visible) => {
  console.log('targetIsVisible', visible)
  if (visible) {
    restartAutoplay()
  }
}, {
  immediate: true,
  flush: 'post',
})

function restartAutoplay() {
  if (swiperRef.value) {
    swiperRef.value.autoplay.stop()
    swiperRef.value.slideTo(0, 0)
    swiperRef.value.activeIndex = 0
    swiperRef.value.autoplay.start()
  }
}

function onTransitionEnd(swiper: SwiperClass) {
  const slide = swiper.slides[swiper.activeIndex]
  slide?.classList.add('ani-slide')
}

function onInit(swiper: SwiperClass) {
  const slide = swiper.slides[0]
  slide?.classList.add('ani-slide')
}

function onTransitionStart(swiper: SwiperClass) {
  for (let i = 0; i < swiper.slides.length; i++) {
    const slide = swiper.slides[i]
    slide?.classList.remove('ani-slide')
  }
}

// 当 autoplay 进行时，获取剩余时间百分比
function onAutoplayTimeLeft(swiper: SwiperClass, time: number, progress: number) {
  const bullets = document.querySelectorAll(
    '.custom-pagination .swiper-pagination-bullet i',
  )
  bullets.forEach((el, index) => {
    if (index === swiper.realIndex) {
      el.style.width = `${(1 - progress) * 100}%`
    }
    else {
      el.style.width = '0%'
    }
  })
}

function onSlideChange(swiper: SwiperClass) {
  slideIndex.value = swiper.realIndex
  // 切换时清空其他 bullet 的进度
  const bullets = document.querySelectorAll(
    '.custom-pagination .swiper-pagination-bullet i',
  )
  bullets.forEach((el, index) => {
    if (index !== swiper.realIndex) {
      el.style.width = '0%'
    }
  })
}

function setSwiper(swiper: SwiperClass) {
  swiperRef.value = swiper
}
</script>

<template>
  <div ref="target" class="carousel-gallery-section">
    <h2 class="multilingual-text section-title">
      <rx-i18n-t :keypath="$t('{text}使用 RoxyBrowser 保护你的在线隐私', { text: '{text}' })">
        <template #text>
          <span class="text">{{ $t('只需 3 步！') }}</span>
        </template>
      </rx-i18n-t>
    </h2>
    <div class="w-full relative">
      <Swiper
        :space-between="0"
        :centered-slides="true"
        :navigation="{
          nextEl: '.custom-next',
          prevEl: '.custom-prev',
        }"
        :autoplay="{
          delay: 10000,
          disableOnInteraction: false,
        }"
        :pagination=" {
          el: '.custom-pagination',
          clickable: true,
          renderBullet: (index, className) => {
            return `<span class='${className}'><i></i></span>`;
          },
        }"
        :grab-cursor="true"
        :modules="modules"
        @swiper="setSwiper"
        @autoplay-time-left="onAutoplayTimeLeft"
        @transition-end="onTransitionEnd"
        @slide-change="onSlideChange"
        @transition-start="onTransitionStart"
        @init="onInit"
      >
        <template v-for="(item, index) in slides" :key="index">
          <SwiperSlide>
            <div class="carousel-gallery-item">
              <div class="carousel-gallery-item-content flex-5">
                <div class="step-tag">
                  {{ $t('步骤') }} {{ index + 1 }}
                </div>
                <div class="step-title multilingual-text">
                  {{ item.title }}
                </div>
                <div class="step-description">
                  <template v-for="desc in item.description">
                    <p>{{ desc }}</p>
                  </template>
                </div>
                <template v-if="index === 0">
                  <TryItNow v-if="width >= 960" type="primary" />
                </template>
              </div>
              <RxResponsiveImage :name="item.img" class="flex-7 max-w-[738px]" alt="" />
            </div>
          </SwiperSlide>
        </template>

        <template #container-end>
          <!-- 自定义指示器容器 -->
          <div class="custom-pagination" />
        </template>
      </Swiper>

      <!-- 自定义按钮 -->
      <div v-show="slideIndex > 0 && width >= 960" class="custom-prev">
        <RxIconSvgIcon name="base/rx_ic_left" size="24" color="#2C2E30" />
      </div>
      <div v-show="slideIndex < slides.length - 1 && width >= 960" class="custom-next">
        <RxIconSvgIcon name="base/rx_ic_right" size="24" color="#2C2E30" />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-gallery-section {
  position: relative;
  padding: 0 75px;
  gap: 0;
  width: min(100%, 1430px);

  @media (max-width: 960px) {
    padding: 24px;
  }

  :deep(.swiper) {
    padding-bottom: 48px;
    width: 100%;
    border-radius: 16px;
    border: 2px solid var(--colors-border-border-inactive, #e2e9ee);
    background: #f3f3f3;

    .swiper-slide {
      height: auto;
      img {
        display: block;
        width: 100%;
        height: 100%;
        object-fit: contain;
      }
    }
  }
  :deep(.custom-pagination) {
    position: absolute;
    bottom: 20px;
    left: 50%;
    z-index: 10;
    transform: translateX(-50%);
    display: flex;
    gap: 8px;
    justify-content: center;

    .swiper-pagination-bullet {
      width: 16px;
      height: 8px;
      flex-shrink: 0;
      border-radius: 50px;
      background: #e0e1e2;
      position: relative;
      overflow: hidden;
      opacity: 1;
    }

    .swiper-pagination-bullet-active {
      width: 60px;
      transition: width 0.1s linear;
    }

    .swiper-pagination-bullet i {
      display: block;
      height: 100%;
      width: 0%;
      background: #11a3fd;
      border-radius: 50px;
      transition: width 0.1s linear;
    }
  }
}

.section-title {
  text-align: center;
  margin-bottom: 48px;
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px);

  .text {
    color: var(--colors-text-text-brand, #11a3fd);
  }

  @media (max-width: 1024px) {
    margin-bottom: 24px;
    font-size: 24px;
    line-height: 28px;
  }
}

.custom-prev,
.custom-next {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  z-index: 10;
  cursor: pointer;
  display: flex;
  width: 52px;
  height: 52px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  aspect-ratio: 1/1;
  border-radius: 26px;
  border: 1px solid var(--colors-border-border-inactive, #e2e9ee);
  color: #f1f5f8;

  &:hover {
    border: 1px solid var(--colors-border-border-inactive, #e2e9ee);
    background: #e4ecf1;
  }
}

.custom-prev {
  left: -70px;
}

.custom-next {
  right: -70px;
}

.carousel-gallery-item {
  height: 100%;
  display: flex;
  justify-content: space-between;

  @media (max-width: 960px) {
    justify-content: flex-end;
    flex-direction: column-reverse;
  }
}

.carousel-gallery-item-content {
  max-width: 462px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
  padding: 140px 20px 0 60px;

  @media (max-width: 960px) {
    padding: 24px;
    gap: 8px;
  }
}

.step-tag {
  display: flex;
  padding: 4px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 40px;
  background: #009b3a;
  color: #fff;
  text-align: center;
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 700;
  line-height: 22px; /* 157.143% */
}

.step-title {
  color: var(--colors-text-text-primary, #111213);
  font-size: var(--Heading-H4, 36px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H4, 48px); /* 133.333% */

  @media (max-width: 960px) {
    font-size: 20px;
    line-height: 28px;
  }
}

.step-description {
  color: var(--colors-text-text-primary, #111213);

  /* features-body */
  font-family: Inter;
  font-size: var(--features-body, 20px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-features-body, 32px); /* 160% */

  @media (max-width: 960px) {
    font-size: 15px;
    line-height: 150%;
  }
}
</style>
