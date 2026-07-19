<script setup>
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const emit = defineEmits(['animationState'])

const roxyVersions = [
  { label: 'Firefox 147', icon: '/home/kernel-sync/firefox.svg', tone: 'firefox', delay: 3160, startX: 0.35, angle: 0.14, drift: -0.22, spin: 0.005, density: 0.0017, friction: 0.20, restitution: 0.13, collisionPaddingX: 0.75, collisionPaddingY: 0.75 },
  { label: 'RoxyChrome 151', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 2830, startX: 0.66, angle: 0.21, drift: 0.25, spin: 0.007, density: 0.0013, friction: 0.15, restitution: 0.16 },
  { label: 'RoxyChrome 150', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 2380, startX: 0.46, angle: -0.28, drift: -0.15, spin: -0.009, density: 0.0022, friction: 0.17, restitution: 0.12 },
  { label: 'RoxyChrome 149', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 2140, startX: 0.74, angle: -0.08, drift: 0.38, spin: -0.004, density: 0.0015, friction: 0.19, restitution: 0.14 },
  { label: 'RoxyChrome 148', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 1680, startX: 0.24, angle: 0.39, drift: -0.50, spin: 0.011, density: 0.0024, friction: 0.14, restitution: 0.17 },
  { label: 'Firefox 146', icon: '/home/kernel-sync/firefox.svg', tone: 'firefox', delay: 1420, startX: 0.41, angle: 0.08, drift: -0.08, spin: 0.003, density: 0.0018, friction: 0.22, restitution: 0.10, collisionPaddingX: 0.75, collisionPaddingY: 0.75 },
  { label: 'RoxyChrome 147', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 1000, startX: 0.58, angle: -0.22, drift: 0.10, spin: -0.008, density: 0.0014, friction: 0.18, restitution: 0.13 },
  { label: 'RoxyChrome 146', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 760, startX: 0.31, angle: -0.31, drift: -0.48, spin: -0.010, density: 0.0023, friction: 0.16, restitution: 0.15 },
  { label: 'RoxyChrome 145', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 390, startX: 0.72, angle: 0.24, drift: 0.42, spin: 0.009, density: 0.0016, friction: 0.20, restitution: 0.12 },
  { label: 'RoxyChrome 144', icon: '/home/kernel-sync/chromium.svg', tone: 'roxy', delay: 90, startX: 0.50, angle: 0.02, drift: 0, spin: 0.001, density: 0.0021, friction: 0.18, restitution: 0.14 },
]

const legacyVersions = [
  { label: 'Chromium 150', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 3600, startX: 0.18, angle: -0.44, drift: -0.42, spin: -0.006, density: 0.0014, friction: 0.24, frictionStatic: 0.90, restitution: 0.03 },
  { label: 'Chromium 149', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 2840, startX: 0.84, angle: 0.30, drift: 0.62, spin: 0.008, density: 0.0026, friction: 0.12, frictionStatic: 0.68, restitution: 0.06 },
  { label: 'Chromium 148', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 2320, startX: 0.22, angle: 0.46, drift: -0.68, spin: 0.013, density: 0.0022, friction: 0.18, frictionStatic: 0.78, restitution: 0.13 },
  { label: 'Chromium 147', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 1800, startX: 0.80, angle: -0.50, drift: 0.76, spin: -0.015, density: 0.0013, friction: 0.22, frictionStatic: 0.90, restitution: 0.07 },
  { label: 'Chromium 146', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 1280, startX: 0.20, angle: -0.38, drift: 0.48, spin: -0.011, density: 0.0025, friction: 0.15, frictionStatic: 0.72, restitution: 0.12 },
  { label: 'Chromium 145', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 760, startX: 0.72, angle: 0.31, drift: -0.44, spin: 0.009, density: 0.0015, friction: 0.22, frictionStatic: 0.86, restitution: 0.08 },
  { label: 'Chromium 144', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 240, startX: 0.42, angle: -0.18, drift: 0.30, spin: -0.006, density: 0.0020, friction: 0.18, frictionStatic: 0.78, restitution: 0.12 },
]

const benefits = [
  { icon: '/home/kernel-sync/user.svg', label: '更接近真实用户' },
  { icon: '/home/kernel-sync/browser-fingerprint.svg', label: '更少异常浏览器特征' },
  { icon: '/home/kernel-sync/stability.svg', label: '更好的兼容性与稳定性' },
]

const sectionRef = ref(null)
const roxyCardRef = ref(null)
const legacyCardRef = ref(null)
const isAnimated = ref(false)
const roxyBadgeElements = []
const legacyBadgeElements = []

let observer
let physicsWorker
let animationActive = false
let animationGeneration = 0
const releaseTimers = []
const badgeAnimations = []
const measurements = []
const badgeElements = []

function setBadgeElement(collection, element, index) {
  if (element) {
    collection[index] = element
  }
}

function getBadgeElements() {
  return [...roxyBadgeElements, ...legacyBadgeElements]
}

function getTransform(positionX, positionY, angle, measurement) {
  const x = positionX - measurement.visualWidth / 2
  const y = positionY - measurement.visualHeight / 2

  return `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`
}

function finishAnimation() {
  if (!animationActive) {
    return
  }

  animationActive = false
  emit('animationState', false)
}

function applyPhysicsState(state) {
  for (let index = 0; index < badgeElements.length; index += 1) {
    const element = badgeElements[index]
    const measurement = measurements[index]

    if (!element || !measurement) {
      continue
    }

    const offset = index * 5
    const positionX = state[offset]
    const positionY = state[offset + 1]
    const angle = state[offset + 2]
    const isReleased = state[offset + 3] === 1
    element.style.transform = getTransform(positionX, positionY, angle, measurement)

    if (isReleased) {
      element.classList.add('is-released')
    }

    element.style.willChange = 'auto'
  }
}

function playTimeline({ frameCount, itemCount, timeline, timestep }) {
  const generation = animationGeneration

  if (itemCount !== badgeElements.length || frameCount < 2) {
    finishAnimation()
    return
  }

  const duration = (frameCount - 1) * timestep
  const versions = [...roxyVersions, ...legacyVersions]

  for (let index = 0; index < itemCount; index += 1) {
    const element = badgeElements[index]
    const measurement = measurements[index]
    const keyframes = Array.from({ length: frameCount })

    for (let frameIndex = 0; frameIndex < frameCount; frameIndex += 1) {
      const offset = (frameIndex * itemCount + index) * 3

      keyframes[frameIndex] = {
        transform: getTransform(timeline[offset], timeline[offset + 1], timeline[offset + 2], measurement),
      }
    }

    element.style.willChange = 'transform, opacity'
    badgeAnimations.push(element.animate(keyframes, {
      duration,
      easing: 'linear',
      fill: 'forwards',
    }))

    const releaseTimer = window.setTimeout(() => {
      element.classList.add('is-released')
    }, versions[index].delay)

    releaseTimers.push(releaseTimer)
  }

  physicsWorker?.terminate()
  physicsWorker = undefined

  Promise.allSettled(badgeAnimations.map(animation => animation.finished)).then(() => {
    if (generation !== animationGeneration) {
      return
    }

    for (let index = 0; index < badgeAnimations.length; index += 1) {
      const element = badgeElements[index]
      const offset = ((frameCount - 1) * itemCount + index) * 3

      element.style.transform = getTransform(timeline[offset], timeline[offset + 1], timeline[offset + 2], measurements[index])
      element.style.willChange = 'auto'
      badgeAnimations[index].cancel()
    }

    badgeAnimations.splice(0, badgeAnimations.length)
    finishAnimation()
  })
}

function startPhysics(instant = false) {
  if (isAnimated.value) {
    return
  }

  isAnimated.value = true
  nextTick(() => {
    const cards = [roxyCardRef.value, legacyCardRef.value]
    const elementGroups = [roxyBadgeElements, legacyBadgeElements]

    if (cards.some(card => !card) || elementGroups.some((elements, index) => elements.length !== [roxyVersions, legacyVersions][index].length)) {
      return
    }

    badgeElements.splice(0, badgeElements.length, ...getBadgeElements())
    measurements.splice(0, measurements.length, ...badgeElements.map(element => ({
      visualHeight: element.offsetHeight,
      visualWidth: element.offsetWidth,
    })))
    animationActive = true
    animationGeneration += 1
    emit('animationState', true)

    physicsWorker = new Worker(new URL('./kernel-sync.worker.js', import.meta.url), { type: 'module' })
    physicsWorker.addEventListener('message', (event) => {
      if (event.data.type === 'frame') {
        applyPhysicsState(event.data.state)
      }
      else if (event.data.type === 'timeline') {
        playTimeline(event.data)
      }
      else if (event.data.type === 'done') {
        finishAnimation()
      }
    })
    physicsWorker.addEventListener('error', (event) => {
      console.error('Kernel sync worker failed', event)
      finishAnimation()
    })

    const sceneConfigs = [
      {
        gravity: 1.08,
        height: cards[0].clientHeight,
        irregularFloor: false,
        measurements: measurements.slice(0, roxyVersions.length),
        versions: roxyVersions,
        width: cards[0].clientWidth,
      },
      {
        gravity: 1.02,
        height: cards[1].clientHeight,
        irregularFloor: true,
        measurements: measurements.slice(roxyVersions.length),
        versions: legacyVersions,
        width: cards[1].clientWidth,
      },
    ]

    physicsWorker.postMessage({
      type: 'init',
      instant,
      scenes: sceneConfigs,
    })
  })
}

onMounted(() => {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    startPhysics(true)
    return
  }

  observer = new IntersectionObserver(([entry]) => {
    if (entry?.isIntersecting) {
      startPhysics()
      observer?.disconnect()
    }
  }, { threshold: 0.2 })

  if (sectionRef.value) {
    observer.observe(sectionRef.value)
  }
})

onBeforeUnmount(() => {
  animationGeneration += 1
  finishAnimation()
  observer?.disconnect()
  releaseTimers.forEach(timer => window.clearTimeout(timer))
  badgeAnimations.forEach(animation => animation.cancel())
  physicsWorker?.terminate()
})
</script>

<template>
  <section
    id="kernel-sync"
    ref="sectionRef"
    class="kernel-sync"
    :class="{ 'is-animated': isAnimated }"
    aria-labelledby="kernel-sync-title"
  >
    <div class="kernel-sync__header">
      <div class="kernel-sync__eyebrow">
        <span class="kernel-sync__eyebrow-icon" aria-hidden="true" />
        <span>{{ $t('实时内核同步') }}</span>
      </div>

      <div class="kernel-sync__copy">
        <h2 id="kernel-sync-title">
          <span class="kernel-sync__title-line">{{ $t('永远快人一步') }}</span>
          <span class="kernel-sync__title-line">
            {{ $t('让账号运行在') }}<strong>{{ $t('更新、更真实') }}</strong>{{ $t('的浏览器环境中') }}
          </span>
        </h2>
        <p>
          <span class="kernel-sync__latin">RoxyBrowser</span>
          {{ $t('持续跟进') }}
          <span class="kernel-sync__latin">Chromium</span>
          {{ $t('官方更新，减少旧版本特征暴露、网站兼容性异常和平台风控风险。') }}
        </p>
      </div>
    </div>

    <div class="kernel-sync__comparison">
      <article ref="roxyCardRef" class="kernel-sync__card kernel-sync__card--roxy">
        <div class="kernel-sync__brand">
          <img src="/home/kernel-sync/roxy-browser-logo.svg" :alt="$t('RoxyBrowser')" draggable="false">
        </div>

        <div
          v-for="(badge, index) in roxyVersions"
          :key="badge.label"
          :ref="element => setBadgeElement(roxyBadgeElements, element, index)"
          class="kernel-sync__badge-slot"
        >
          <div
            class="kernel-sync__badge"
            :class="`kernel-sync__badge--${badge.tone}`"
          >
            <img :src="badge.icon" alt="" draggable="false">
            <span>{{ badge.label }}</span>
          </div>
        </div>
      </article>

      <article ref="legacyCardRef" class="kernel-sync__card kernel-sync__card--legacy">
        <h3>{{ $t('其他指纹浏览器产品') }}</h3>

        <div
          v-for="(badge, index) in legacyVersions"
          :key="badge.label"
          :ref="element => setBadgeElement(legacyBadgeElements, element, index)"
          class="kernel-sync__badge-slot"
        >
          <div
            class="kernel-sync__badge"
            :class="`kernel-sync__badge--${badge.tone}`"
          >
            <img :src="badge.icon" alt="" draggable="false">
            <span>{{ badge.label }}</span>
          </div>
        </div>
      </article>
    </div>

    <div class="kernel-sync__benefits">
      <ul>
        <li v-for="benefit in benefits" :key="benefit.label">
          <span class="kernel-sync__benefit-icon">
            <img :src="benefit.icon" alt="" draggable="false">
          </span>
          <span>{{ $t(benefit.label) }}</span>
        </li>
      </ul>

      <p class="kernel-sync__update-note">
        <img src="/home/kernel-sync/update.svg" alt="" draggable="false">
        <span>
          {{ $t('官方版本持续更新，') }}<span class="kernel-sync__latin">RoxyBrowser</span>&nbsp;{{ $t('快速跟进') }}
        </span>
      </p>
    </div>
  </section>
</template>

<style scoped>
.kernel-sync {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  padding: 60px 16px 66px;
  color: #111213;
  background: #f3f4f7;
  font-family: var(--family, var(--zhFamily));
}

.kernel-sync__header {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.kernel-sync__eyebrow {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border: 2px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient(#f3f4f7, #f3f4f7) padding-box,
    linear-gradient(90deg, #12a3fc 0%, #c481fa 100%) border-box;
  color: #34393d;
  font-size: 16px;
  font-weight: 600;
  line-height: 22px;
}

.kernel-sync__eyebrow-icon {
  display: block;
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
  background: linear-gradient(90deg, #12a3fc 0%, #c481fa 100%);
  mask: url('/home/kernel-sync/lightning.svg') center / contain no-repeat;
  -webkit-mask: url('/home/kernel-sync/lightning.svg') center / contain no-repeat;
}

.kernel-sync__copy {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  text-align: center;
}

.kernel-sync__copy h2 {
  margin: 0;
  font-size: 48px;
  font-weight: 700;
  line-height: 60px;
  letter-spacing: 0;
}

.kernel-sync__title-line {
  display: block;
  white-space: nowrap;
}

.kernel-sync__copy strong {
  color: #11a3fd;
  font: inherit;
}

.kernel-sync__copy p {
  margin: 0;
  color: #575d60;
  font-size: 18px;
  font-weight: 400;
  line-height: 28px;
  white-space: nowrap;
}

.kernel-sync__latin {
  font-family: Inter, Arial, sans-serif;
}

.kernel-sync__comparison {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 433px));
  justify-content: center;
  gap: 20px;
  width: 100%;
  max-width: 886px;
  margin: 44px auto 0;
}

.kernel-sync__card {
  position: relative;
  isolation: isolate;
  width: 100%;
  height: 480px;
  overflow: hidden;
  overflow: clip;
  border-radius: 32px;
  contain: layout paint style;
}

.kernel-sync__card--roxy {
  background: linear-gradient(180deg, #dcf2ff 0%, #c9ebff 100%);
}

.kernel-sync__card--legacy {
  background: #e8eef2;
}

.kernel-sync__card::before {
  position: absolute;
  z-index: 0;
  inset: 0;
  content: '';
  pointer-events: none;
  background-position: 16px 16px;
  background-size: 32px 32px;
}

.kernel-sync__card--roxy::before {
  background-image: radial-gradient(circle, rgba(17, 163, 253, 0.13) 0 2px, transparent 2.5px);
}

.kernel-sync__card--legacy::before {
  background-image: radial-gradient(circle, rgba(255, 255, 255, 0.62) 0 2px, transparent 2.5px);
}

.kernel-sync__brand {
  position: absolute;
  top: 30px;
  left: 30px;
  z-index: 2;
  display: flex;
  align-items: center;
}

.kernel-sync__brand img {
  width: 140px;
  height: 34px;
  object-fit: contain;
}

.kernel-sync__card h3 {
  position: absolute;
  top: 28px;
  left: 30px;
  z-index: 2;
  margin: 0;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  white-space: nowrap;
}

.kernel-sync__badge-slot {
  position: absolute;
  top: 0;
  left: 0;
  z-index: 1;
  display: inline-flex;
  width: max-content;
  opacity: 0;
  pointer-events: none;
  transform-origin: center;
}

.kernel-sync__badge-slot.is-released {
  opacity: 1;
}

.kernel-sync__badge {
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  gap: 7.429px;
  padding: 11.143px 19.81px;
  border: 2px solid rgba(0, 0, 0, 0.1);
  border-radius: 999px;
  color: #fff;
  font-family: Inter, Arial, sans-serif;
  font-size: 18.571px;
  font-weight: 500;
  line-height: 29.714px;
  transform-origin: center;
  white-space: nowrap;
}

.kernel-sync__badge img {
  width: 27.238px;
  height: 27.238px;
  flex: 0 0 auto;
}

.kernel-sync__badge--roxy {
  background: #11a3fd;
}

.kernel-sync__badge--firefox {
  border-color: transparent;
  background:
    linear-gradient(90deg, #ff2c8b 0%, #ffa629 100%) padding-box,
    linear-gradient(90deg, #e6277d 0%, #e69525 100%) border-box;
}

.kernel-sync__badge--legacy {
  border-color: rgba(0, 0, 0, 0.04);
  background: #d5d5d5;
}

.kernel-sync__benefits {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  margin-top: 40px;
}

.kernel-sync__benefits ul {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin: 0;
  padding: 0;
  list-style: none;
}

.kernel-sync__benefits li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 18px;
  font-weight: 600;
  line-height: 28px;
  white-space: nowrap;
}

.kernel-sync__benefit-icon {
  box-sizing: border-box;
  display: inline-flex;
  width: 38px;
  height: 38px;
  flex: 0 0 auto;
  align-items: center;
  justify-content: center;
  border: 1px solid rgba(17, 163, 253, 0.3);
  border-radius: 10px;
  background: #fff;
}

.kernel-sync__benefit-icon img {
  width: 20px;
  height: 20px;
}

.kernel-sync__update-note {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin: 0;
  color: #575d60;
  font-size: 14px;
  font-weight: 400;
  line-height: 18px;
}

.kernel-sync__update-note > img {
  width: 18px;
  height: 18px;
  flex: 0 0 auto;
}

@media (max-width: 1100px) {
  .kernel-sync__copy h2 {
    font-size: 42px;
    line-height: 54px;
  }

  .kernel-sync__copy p {
    white-space: normal;
  }
}

@media (max-width: 760px) {
  .kernel-sync {
    padding: 44px 16px 56px;
  }

  .kernel-sync__copy h2 {
    font-size: 32px;
    line-height: 42px;
  }

  .kernel-sync__title-line {
    white-space: normal;
  }

  .kernel-sync__copy p {
    max-width: 620px;
    font-size: 16px;
    line-height: 26px;
  }

  .kernel-sync__comparison {
    grid-template-columns: minmax(0, 433px);
    max-width: 433px;
    margin-top: 32px;
  }

  .kernel-sync__card {
    border-radius: 28px;
  }

  .kernel-sync__benefits {
    margin-top: 32px;
  }

  .kernel-sync__benefits ul {
    flex-direction: column;
    align-items: flex-start;
    gap: 14px;
  }

  .kernel-sync__benefits li {
    font-size: 16px;
    line-height: 24px;
  }

  .kernel-sync__update-note {
    align-items: flex-start;
    text-align: center;
  }
}
</style>
