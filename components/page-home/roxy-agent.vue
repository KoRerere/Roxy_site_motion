<script setup lang="ts">
import posterImgEn from '@/assets/images/home/mcp-agent/poster-en.png?format=avif'
import posterImgZh from '@/assets/images/home/mcp-agent/poster-zh.png?format=avif'
import roxyAgentBg from '@/assets/images/roxy-agent-bg.png?format=webp'

const { locale } = useRxI18n()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

const pageHomeHeroVisible = ref(false)

useHead({
  link: [
    {
      rel: 'preload',
      as: 'image',
      href: locale.value === 'zh' ? posterImgZh : posterImgEn,
      type: 'image/avif',
      fetchpriority: 'high',
    },
    {
      rel: 'preload',
      as: 'image',
      href: roxyAgentBg,
      type: 'image/webp',
      fetchpriority: 'high',
    },
  ],
})

let i = 0
const txt = $t('一句话，全员上岗 ')
const speed = 50
const text = ref(txt)
const started = ref(false)

function typeWriter() {
  if (i < txt.length) {
    // 首字替换占位符，避免出现「空格+首字」
    text.value = i === 0 ? txt.charAt(i) : text.value + txt.charAt(i)
    i++
    setTimeout(typeWriter, speed)
  }
}

// 不换行空格 \u00A0：占位保留一行高度，视觉上几乎看不见
const PLACEHOLDER = '\u00A0'

watch(started, (newVal) => {
  if (newVal) {
    text.value = PLACEHOLDER
    setTimeout(() => {
      typeWriter()
    }, 200)
  }
})

onMounted(() => {
  started.value = true
})
</script>

<template>
  <div class="roxy-agent" :class="{ 'is-sticky': pageHomeHeroVisible }">
    <!-- <div class="stage">
      <div class="beamWrap">
        <div class="beamLayer beamGradient long" />
        <div class="beamLayer beamGradient short" />
        <div class="core" />
      </div>

      <div class="fadeBottom" />
      <div class="vignette" />
    </div> -->

    <div class="max-w-auto min-w-1080px w-120% left-50% top-0 absolute z-0 -translate-x-1/2 aspect-[1080/509]">
      <img :src="roxyAgentBg" class="w-full" alt="select-none" draggable="false" />
    </div>

    <!-- <div class="inset-0 absolute -z-1">
      <BeamCanvas :rotate-deg="-5" :translate-x-percent="0.12" />
    </div> -->
    <div class="flex flex-col gap-3 items-center justify-center relative z-10 md:gap-5">
      <div class="flex flex-col gap-3 items-center justify-center">
        <p class="section-title text-primary color-inherit text-center whitespace-nowrap max-sm:en-US:text-5.5">
          Roxy AI Agent <br>
          <span :class="{ 'opacity-0': !started }">{{ text }}</span>
        </p>
        <p class="text-14px text-primary color-inherit font-400 text-center md:text-body max-md:leading-20px">
          {{ $t('用 AI 自然语言对话下达任务，多浏览器批量自动化') }}
        </p>
      </div>
      <NuxtLinkLocale
        to="/download"
        class="tag-outlined-box en-US:font-[Inter] zh-CN:font-[Inter]"
        @click.capture="redirectMobileDownloadToLogin"
      >
        {{ $t('即刻体验') }}
      </NuxtLinkLocale>
    </div>
    <div class="player-container">
      <div class="player-aspect">
        <RxVideo :autoplay="false" :src="locale === 'zh' ? '/home/mcp-agent/mcp-zh.mp4' : '/home/mcp-agent/mcp-en.mp4'" :poster="locale === 'zh' ? posterImgZh : posterImgEn" />
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.roxy-agent {
  padding: 130px 16px 80px 16px;
  position: sticky;
  --bg: #030111;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #fff;
  background-color: #030111;

  &.is-sticky--- {
    top: -60px;
    transform: translateY(60px);
    transition: transform 1s ease;
  }

  @media (max-width: 768px) {
    top: 0;
    padding: 100px 16px 32px 16px;
  }
}

.tag-box {
  display: flex;
  padding: 6px 12px;
  justify-content: center;
  align-items: center;
  gap: 10px;
  border-radius: 20px;
  background: linear-gradient(90deg, #32a9ff 0%, #e74ef8 50%, #ff9393 100%);
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;

  @media (max-width: 768px) {
    font-size: 12px;
  }
}

.tag-outlined-box {
  display: flex;
  padding: 10px 24px;
  align-items: center;
  gap: 20px;
  border-radius: 500px;
  border: 1px solid rgba(255, 255, 255, 0.6);
  background: linear-gradient(180deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.2) 100%);
  color: var(--component-dropdown-text-active, #fff);
  font-family: Inter;
  font-size: 16px;
  font-style: normal;
  font-weight: 500;
  line-height: 24px;
  /* 150% */

  &:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  @media (max-width: 768px) {
    padding: 7px 16px;
    align-items: center;
    gap: 20px;
    color: var(--component-dropdown-text-active, #fff);
    font-family: Inter;
    font-size: 16px;
    font-style: normal;
    font-weight: 500;
    line-height: 24px;
    /* 150% */
  }
}

.player-container {
  position: relative;
  width: 100%;
  margin-top: 44px;
  max-width: 1140px;
  border-radius: 20px;
  border: 6px solid rgba(255, 255, 255, 0.4);
  backdrop-filter: blur(6px);
  overflow: hidden;

  @media (max-width: 768px) {
    margin-top: 32px;
    border-radius: 16px;
    border: 4px solid rgba(255, 255, 255, 0.4);
    backdrop-filter: blur(1.9736841917037964px);
  }
}

/* 16:9 占位，未加载时也保持尺寸避免布局抖动 */
.player-aspect {
  position: relative;
  width: 100%;
  aspect-ratio: 16 / 9;
  background: var(--bg, #030111);

  .poster-img {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    display: block;
  }

  .mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: var(--colors-alpha-alpha-black-60, rgba(0, 0, 0, 0.6));
    color: #fff;
    cursor: pointer;
    transition: opacity 0.3s ease;
    z-index: 2;

    &:hover {
      background: var(--colors-alpha-alpha-black-40, rgba(0, 0, 0, 0.7));
    }

    .play-button {
      display: flex;
      flex-direction: column;
      align-items: center;
      gap: 10px;
      color: #fff;
      font-family: Inter;
      font-size: 18px;
      font-style: normal;
      font-weight: 400;
      line-height: 120%;
      /* 19.2px */
      transition: transform 0.3s ease;
    }

    &:hover .play-button {
      transform: scale(1.1);
    }

    // @media (min-width: 768px) {
    //   display: none;
    // }
  }

  video {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    /* 默认可见以显示 poster 封面图，蒙层在上方盖住并显示播放按钮 */
    visibility: visible;

    &.playing {
      visibility: visible;
    }
  }
}

.stage {
  position: absolute;
  inset: 0;
  background:
    /* 右上强冷蓝环境光 */
    radial-gradient(900px 650px at 85% 12%, rgba(80, 150, 255, 0.28), transparent 60%),
    /* 中上部蓝色空气散射 */ radial-gradient(1100px 800px at 65% 30%, rgba(60, 110, 255, 0.18), transparent 65%),
    /* 左下弱反射蓝紫 */ radial-gradient(1000px 700px at 35% 70%, rgba(120, 80, 255, 0.1), transparent 70%),
    /* 底色 */ linear-gradient(180deg, var(--bg), #02000a);
  overflow: hidden;
  z-index: -1;
}

.bg-mask {
  background: var(--colors-alpha-alpha-black-40, rgba(0, 0, 0, 0.4));
  // position: absolute;
  // inset: 0;
  // z-index: -1;
}

/* 光束整体容器（方向 + 上移） */
.beamWrap {
  position: absolute;
  inset: -30%;
  transform: rotate(18deg) translateY(-12%);
  mix-blend-mode: screen;
}

/* 公共光束层 */
.beamLayer {
  position: absolute;
  inset: 0;
  filter: blur(18px) saturate(220%) contrast(145%);
  backface-visibility: hidden;
  transform: translate3d(0, 0, 0);
}

/* 偏蓝镭射渐变 */
.beamGradient {
  background: linear-gradient(
    -60deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(90, 150, 255, 0) 43%,
    rgba(90, 150, 255, 0.55) 48.5%,
    rgba(70, 110, 255, 0.8) 50%,
    rgba(120, 80, 255, 0.65) 52%,
    rgba(200, 150, 255, 0.35) 54.5%,
    rgba(90, 150, 255, 0.45) 56%,
    rgba(0, 0, 0, 0) 63%
  );
}

/* 两段式错落 */
.long {
  -webkit-mask: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 12%,
    rgba(0, 0, 0, 1) 78%,
    rgba(0, 0, 0, 0.4) 90%,
    rgba(0, 0, 0, 0) 100%
  );
  animation: driftLong 9.6s ease-in-out infinite;
}

.short {
  -webkit-mask: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 30%,
    rgba(0, 0, 0, 1) 52%,
    rgba(0, 0, 0, 0.4) 68%,
    rgba(0, 0, 0, 0) 100%
  );
  opacity: 0.72;
  animation: driftShort 7.9s ease-in-out infinite;
}

/* 白色能量核心 */
.core {
  position: absolute;
  inset: 0;
  background: linear-gradient(-60deg, rgba(0, 0, 0, 0) 47.5%, rgba(255, 255, 255, 0.98) 50%, rgba(0, 0, 0, 0) 52.5%);
  filter: blur(6px) contrast(190%);
  opacity: 0.82;

  -webkit-mask: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 1) 26%,
    rgba(0, 0, 0, 1) 52%,
    rgba(0, 0, 0, 0.4) 68%,
    rgba(0, 0, 0, 0) 100%
  );

  animation: driftCore 8.8s ease-in-out infinite;
}

/* 两段式动画 */
@keyframes driftLong {
  0% {
    transform: translate(-4%, -2%) scale(1.02);
  }

  50% {
    transform: translate(4%, 2%) scale(1.06);
  }

  100% {
    transform: translate(-4%, -2%) scale(1.02);
  }
}

@keyframes driftShort {
  0% {
    transform: translate(2%, -2%) scale(1.01);
  }

  50% {
    transform: translate(-3.5%, 2.8%) scale(1.05);
  }

  100% {
    transform: translate(2%, -2%) scale(1.01);
  }
}

@keyframes driftCore {
  0% {
    transform: translate(1.2%, -1.2%) scale(1);
  }

  50% {
    transform: translate(-2.6%, 2.2%) scale(1.04);
  }

  100% {
    transform: translate(1.2%, -1.2%) scale(1);
  }
}

/* 底部渐隐 */
.fadeBottom {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    180deg,
    rgba(3, 1, 17, 0) 0%,
    rgba(3, 1, 17, 0) 55%,
    rgba(3, 1, 17, 0.35) 75%,
    rgba(3, 1, 17, 0.95) 100%
  );
  pointer-events: none;
}

/* 暗角 */
.vignette {
  position: absolute;
  inset: 0;
  background: radial-gradient(
    1200px 800px at 62% 35%,
    rgba(0, 0, 0, 0),
    rgba(0, 0, 0, 0.55) 70%,
    rgba(0, 0, 0, 0.9) 100%
  );
}
</style>
