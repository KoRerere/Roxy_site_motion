<script setup>
import Matter from 'matter-js'
import { nextTick, onBeforeUnmount, onMounted, ref } from 'vue'

const WALL_CATEGORY = 0x0001
const TOP_WALL_CATEGORY = 0x0002
const BADGE_CATEGORY = 0x0004
const ENTRY_BADGE_MASK = WALL_CATEGORY | BADGE_CATEGORY
const ACTIVE_BADGE_MASK = ENTRY_BADGE_MASK | TOP_WALL_CATEGORY

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
  { label: 'Chromium 150', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 3520, startX: 0.18, angle: -0.44, drift: -0.42, spin: -0.006, gravityScale: 0.52, density: 0.0014, friction: 0.24, frictionStatic: 0.90, restitution: 0.03 },
  { label: 'Chromium 149', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 2300, startX: 0.84, angle: 0.30, drift: 0.62, spin: 0.008, gravityScale: 0.52, density: 0.0026, friction: 0.12, frictionStatic: 0.68, restitution: 0.06 },
  { label: 'Chromium 148', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 1840, startX: 0.22, angle: 0.46, drift: -0.68, spin: 0.013, density: 0.0022, friction: 0.18, frictionStatic: 0.78, restitution: 0.13 },
  { label: 'Chromium 147', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 1160, startX: 0.80, angle: -0.50, drift: 0.76, spin: -0.015, density: 0.0013, friction: 0.22, frictionStatic: 0.90, restitution: 0.07 },
  { label: 'Chromium 146', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 900, startX: 0.20, angle: -0.38, drift: 0.48, spin: -0.011, density: 0.0025, friction: 0.15, frictionStatic: 0.72, restitution: 0.12 },
  { label: 'Chromium 145', icon: '/home/kernel-sync/chromium.svg', tone: 'legacy', delay: 520, startX: 0.72, angle: 0.31, drift: -0.44, spin: 0.009, density: 0.0015, friction: 0.22, frictionStatic: 0.86, restitution: 0.08 },
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
let resizeObserver
let animationFrame
let previousFrameTime = 0
let physicsAccumulator = 0
let pendingReleaseCount = 0
let settledFrameCount = 0
const releaseTimers = []
const scenes = []
const FIXED_TIMESTEP = 1000 / 60
const MAX_FRAME_DELTA = FIXED_TIMESTEP * 3
const SETTLED_FRAME_LIMIT = 12

function setBadgeElement(collection, element, index) {
  if (element) {
    collection[index] = element
  }
}

function createSceneWalls(width, height, sideInset, bottomInset) {
  const { Bodies } = Matter
  const wallThickness = 80
  const wallHeight = height * 4
  const cornerRadius = 32
  const arcRadius = cornerRadius - Math.max(sideInset, bottomInset)
  const arcSteps = 8
  const floorY = height - bottomInset + wallThickness / 2
  const floorOptions = {
    isStatic: true,
    collisionFilter: { category: WALL_CATEGORY, mask: BADGE_CATEGORY },
    friction: 0.72,
    restitution: 0,
  }
  const createCornerArc = (centerX, centerY, startAngle, category) => {
    const angleStep = (Math.PI / 2) / arcSteps
    const segmentLength = arcRadius * angleStep * 1.8 + 4

    return Array.from({ length: arcSteps }, (_, index) => {
      const angle = startAngle + (index + 0.5) * angleStep
      const normalX = Math.cos(angle)
      const normalY = Math.sin(angle)
      const boundaryX = centerX + arcRadius * normalX
      const boundaryY = centerY + arcRadius * normalY

      return Bodies.rectangle(
        boundaryX + normalX * wallThickness / 2,
        boundaryY + normalY * wallThickness / 2,
        segmentLength,
        wallThickness,
        {
          isStatic: true,
          angle: angle + Math.PI / 2,
          collisionFilter: { category, mask: BADGE_CATEGORY },
          friction: 0.015,
          restitution: 0,
        },
      )
    })
  }

  const cornerWalls = [
    ...createCornerArc(cornerRadius, cornerRadius, Math.PI, TOP_WALL_CATEGORY),
    ...createCornerArc(width - cornerRadius, cornerRadius, Math.PI * 1.5, TOP_WALL_CATEGORY),
    ...createCornerArc(width - cornerRadius, height - cornerRadius, 0, WALL_CATEGORY),
    ...createCornerArc(cornerRadius, height - cornerRadius, Math.PI / 2, WALL_CATEGORY),
  ]

  return [
    Bodies.rectangle(width / 2, sideInset - wallThickness / 2, width, wallThickness, {
      isStatic: true,
      collisionFilter: { category: TOP_WALL_CATEGORY, mask: BADGE_CATEGORY },
      friction: 0.015,
      restitution: 0,
    }),
    Bodies.rectangle(sideInset - wallThickness / 2, height - wallHeight / 2, wallThickness, wallHeight, {
      isStatic: true,
      collisionFilter: { category: WALL_CATEGORY, mask: BADGE_CATEGORY },
      friction: 0.015,
    }),
    Bodies.rectangle(width - sideInset + wallThickness / 2, height - wallHeight / 2, wallThickness, wallHeight, {
      isStatic: true,
      collisionFilter: { category: WALL_CATEGORY, mask: BADGE_CATEGORY },
      friction: 0.015,
    }),
    Bodies.rectangle(width / 2, floorY, width, wallThickness, floorOptions),
    ...cornerWalls,
  ]
}

function createScene(card, elements, versions, gravity, irregularFloor = false) {
  if (!card || elements.length !== versions.length) {
    return null
  }

  const { Body, Composite, Engine, Events } = Matter
  const width = card.clientWidth
  const height = card.clientHeight
  const sideInset = irregularFloor ? 0.75 : 1.2
  const bottomInset = irregularFloor ? 0.75 : 1.2
  const engine = Engine.create({ enableSleeping: true })

  engine.gravity.y = gravity
  engine.gravity.scale = 0.001
  engine.positionIterations = 7
  engine.velocityIterations = 5

  const walls = createSceneWalls(width, height, sideInset, bottomInset)

  Composite.add(engine.world, walls)

  const collisionDeflection = irregularFloor
    ? { angularCap: 0.028, angularStep: 0.014, lateralForce: 0.00001, maxCount: 2 }
    : { angularCap: 0.046, angularStep: 0.019, lateralForce: 0.0000095, maxCount: 3 }

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      if (pair.bodyA.isStatic || pair.bodyB.isStatic) {
        continue
      }

      if (!irregularFloor) {
        const lowerBody = pair.bodyA.position.y > pair.bodyB.position.y ? pair.bodyA : pair.bodyB
        const seekCount = lowerBody.plugin.kernelSyncSeekCount ?? 0

        if (seekCount < 2) {
          const seekDirection = (lowerBody.id + pair.id.length + seekCount) % 2 === 0 ? 1 : -1

          lowerBody.plugin.kernelSyncSeekCount = seekCount + 1
          Body.applyForce(lowerBody, lowerBody.position, {
            x: seekDirection * lowerBody.mass * 0.0000035,
            y: 0,
          })
        }
      }

      for (const body of [pair.bodyA, pair.bodyB]) {
        const deflectionCount = body.plugin.kernelSyncDeflectionCount ?? 0

        if (deflectionCount >= collisionDeflection.maxCount) {
          continue
        }

        body.plugin.kernelSyncDeflectionCount = deflectionCount + 1
        const strength = deflectionCount === 0 ? 1 : 0.45
        const direction = body.id % 2 === 0 ? 1 : -1
        const angularVelocity = Math.max(
          -collisionDeflection.angularCap,
          Math.min(collisionDeflection.angularCap, body.angularVelocity + direction * collisionDeflection.angularStep * strength),
        )

        Body.setAngularVelocity(body, angularVelocity)
        Body.applyForce(body, body.position, {
          x: direction * body.mass * collisionDeflection.lateralForce * strength,
          y: 0,
        })
      }
    }
  })

  return {
    card,
    elements,
    engine,
    height,
    versions,
    width,
    bodies: [],
    bottomInset,
    cohesionStrength: irregularFloor ? 0.00018 : 0.00036,
    frictionAir: irregularFloor ? 0.0038 : 0.0045,
    irregularFloor,
    sideInset,
    sleepThreshold: irregularFloor ? 65 : 50,
    walls,
  }
}

function syncSceneBounds(scene, width = scene.card.clientWidth, height = scene.card.clientHeight) {
  if (Math.abs(width - scene.width) < 0.5 && Math.abs(height - scene.height) < 0.5) {
    return
  }

  for (const wall of scene.walls) {
    Matter.Composite.remove(scene.engine.world, wall)
  }
  scene.walls = createSceneWalls(width, height, scene.sideInset, scene.bottomInset)
  Matter.Composite.add(scene.engine.world, scene.walls)
  scene.width = width
  scene.height = height

  for (const item of scene.bodies) {
    let shiftX = 0
    let shiftY = 0

    if (item.body.bounds.min.x < scene.sideInset) {
      shiftX = scene.sideInset - item.body.bounds.min.x
    }
    else if (item.body.bounds.max.x > width - scene.sideInset) {
      shiftX = width - scene.sideInset - item.body.bounds.max.x
    }

    if (item.body.bounds.max.y > height - scene.bottomInset) {
      shiftY = height - scene.bottomInset - item.body.bounds.max.y
    }

    if (shiftX || shiftY) {
      Matter.Body.setPosition(item.body, {
        x: item.body.position.x + shiftX,
        y: item.body.position.y + shiftY,
      })
    }
  }
}

function releaseBadge(scene, index) {
  const { Body, Bodies, Composite } = Matter
  const element = scene.elements[index]
  const version = scene.versions[index]

  if (!element || !version) {
    return
  }

  const visualWidth = element.offsetWidth
  const visualHeight = element.offsetHeight
  const defaultCollisionPadding = 0
  const bodyWidth = visualWidth + (version.collisionPaddingX ?? defaultCollisionPadding) * 2
  const bodyHeight = visualHeight + (version.collisionPaddingY ?? defaultCollisionPadding) * 2
  const minX = scene.sideInset + bodyWidth / 2
  const maxX = scene.width - scene.sideInset - bodyWidth / 2
  const x = Math.min(maxX, Math.max(minX, scene.width * version.startX))
  const spawnGap = scene.irregularFloor ? 8 : 52
  const y = -bodyHeight / 2 - spawnGap
  const body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
    angle: version.angle,
    collisionFilter: {
      category: BADGE_CATEGORY,
      mask: ENTRY_BADGE_MASK,
    },
    density: version.density ?? 0.0016,
    friction: (version.friction ?? 0.18) * (scene.irregularFloor ? 1 : 0.62),
    frictionAir: scene.frictionAir,
    frictionStatic: (version.frictionStatic ?? 0.45) * (scene.irregularFloor ? 1 : 0.42),
    restitution: scene.irregularFloor ? (version.restitution ?? 0.14) : 0,
    sleepThreshold: scene.sleepThreshold,
    slop: 0.01,
    chamfer: {
      radius: Math.max(2, bodyHeight / 2 - 1),
      quality: 7,
      qualityMax: 8,
      qualityMin: 6,
    },
  })

  Body.setAngularVelocity(body, version.spin ?? version.angle * 0.012)
  Body.setVelocity(body, {
    x: version.drift ?? (version.startX - 0.5) * 0.55,
    y: scene.irregularFloor ? 0.05 : 0.35,
  })
  Composite.add(scene.engine.world, body)
  scene.bodies.push({
    body,
    element,
    gravityScale: version.gravityScale ?? 1,
    hasEntered: false,
    releasedAt: scene.engine.timing.timestamp,
    isComposited: true,
    lastTransform: '',
    visualHeight,
    visualWidth,
  })
  element.style.willChange = 'transform'
  element.style.transform = `translate3d(${x - visualWidth / 2}px, ${y - visualHeight / 2}px, 0) rotate(${body.angle}rad)`
  element.classList.add('is-released')
}

function renderScene(scene, interpolation = 1) {
  for (const item of scene.bodies) {
    const { body } = item
    const positionX = body.positionPrev.x + (body.position.x - body.positionPrev.x) * interpolation
    const positionY = body.positionPrev.y + (body.position.y - body.positionPrev.y) * interpolation
    const angle = body.anglePrev + (body.angle - body.anglePrev) * interpolation
    const x = positionX - item.visualWidth / 2
    const y = positionY - item.visualHeight / 2
    const transform = `translate3d(${x.toFixed(2)}px, ${y.toFixed(2)}px, 0) rotate(${angle.toFixed(4)}rad)`

    if (transform !== item.lastTransform) {
      item.element.style.transform = transform
      item.lastTransform = transform
    }

    const shouldComposite = !body.isSleeping

    if (shouldComposite !== item.isComposited) {
      item.element.style.willChange = shouldComposite ? 'transform' : 'auto'
      item.isComposited = shouldComposite
    }
  }
}

function updateScene(scene, delta, shouldRender = true) {
  for (const item of scene.bodies) {
    if (!item.hasEntered && item.body.bounds.min.y >= scene.sideInset + 0.75) {
      item.hasEntered = true
      item.body.collisionFilter.mask = ACTIVE_BADGE_MASK
    }

    if (item.gravityScale < 1 && !item.body.isSleeping) {
      Matter.Body.applyForce(item.body, item.body.position, {
        x: 0,
        y: -item.body.mass * scene.engine.gravity.y * scene.engine.gravity.scale * (1 - item.gravityScale),
      })
    }

    const releaseAge = scene.engine.timing.timestamp - item.releasedAt

    if (!item.body.isSleeping && releaseAge < 2400 && item.body.position.y > scene.height * 0.35) {
      let nearestItem = null
      let nearestDistance = Number.POSITIVE_INFINITY

      for (const candidate of scene.bodies) {
        if (candidate === item || candidate.body.position.y <= scene.height * 0.35) {
          continue
        }

        const distanceX = candidate.body.position.x - item.body.position.x
        const distanceY = candidate.body.position.y - item.body.position.y
        const distance = distanceX * distanceX + distanceY * distanceY

        if (distance < nearestDistance) {
          nearestDistance = distance
          nearestItem = candidate
        }
      }

      if (nearestItem && Matter.Query.collides(item.body, [nearestItem.body]).length === 0) {
        const distanceX = nearestItem.body.position.x - item.body.position.x
        const distanceY = nearestItem.body.position.y - item.body.position.y
        const horizontalPull = Math.max(-1, Math.min(1, distanceX / scene.width))
        const downwardPull = Math.max(0, Math.min(1, distanceY / scene.height))

        Matter.Body.applyForce(item.body, item.body.position, {
          x: item.body.mass * scene.cohesionStrength * horizontalPull,
          y: item.body.mass * scene.cohesionStrength * downwardPull * 0.12,
        })
      }
    }
  }

  Matter.Engine.update(scene.engine, delta)

  const maxAngle = scene.irregularFloor ? 0.56 : 0.96

  for (const item of scene.bodies) {
    if (item.body.angle > maxAngle) {
      Matter.Body.setAngle(item.body, maxAngle)
      Matter.Body.setAngularVelocity(item.body, 0)
    }
    else if (item.body.angle < -maxAngle) {
      Matter.Body.setAngle(item.body, -maxAngle)
      Matter.Body.setAngularVelocity(item.body, 0)
    }
  }

  if (shouldRender) {
    renderScene(scene)
  }
}

function tick(time) {
  const frameDelta = previousFrameTime ? Math.min(MAX_FRAME_DELTA, time - previousFrameTime) : FIXED_TIMESTEP
  previousFrameTime = time
  physicsAccumulator = Math.min(physicsAccumulator + frameDelta, MAX_FRAME_DELTA)

  while (physicsAccumulator >= FIXED_TIMESTEP) {
    for (const scene of scenes) {
      updateScene(scene, FIXED_TIMESTEP, false)
    }
    physicsAccumulator -= FIXED_TIMESTEP
  }

  const interpolation = physicsAccumulator / FIXED_TIMESTEP

  for (const scene of scenes) {
    renderScene(scene, interpolation)
  }

  const hasActiveBody = scenes.some(scene => scene.bodies.some(item => !item.body.isSleeping))
  settledFrameCount = pendingReleaseCount > 0 || hasActiveBody ? 0 : settledFrameCount + 1

  if (settledFrameCount < SETTLED_FRAME_LIMIT) {
    animationFrame = requestAnimationFrame(tick)
  }
  else {
    animationFrame = undefined
  }
}

function startPhysics(instant = false) {
  if (isAnimated.value) {
    return
  }

  isAnimated.value = true
  nextTick(() => {
    const roxyScene = createScene(roxyCardRef.value, roxyBadgeElements, roxyVersions, 0.98)
    const legacyScene = createScene(legacyCardRef.value, legacyBadgeElements, legacyVersions, 0.78, true)

    if (!roxyScene || !legacyScene) {
      return
    }

    scenes.push(roxyScene, legacyScene)

    resizeObserver = new ResizeObserver((entries) => {
      for (const entry of entries) {
        const scene = scenes.find(candidate => candidate.card === entry.target)

        if (!scene) {
          continue
        }

        syncSceneBounds(scene, entry.contentRect.width, entry.contentRect.height)
        renderScene(scene)
      }
    })
    scenes.forEach(scene => resizeObserver.observe(scene.card))

    if (instant) {
      const releasedBadges = scenes.map(scene => scene.versions.map(() => false))

      for (let step = 0; step < 900; step += 1) {
        const simulatedTime = step * 16.67

        scenes.forEach((scene, sceneIndex) => {
          scene.versions.forEach((version, index) => {
            if (!releasedBadges[sceneIndex][index] && version.delay <= simulatedTime) {
              releasedBadges[sceneIndex][index] = true
              releaseBadge(scene, index)
            }
          })
          updateScene(scene, 16.67, false)
        })
      }

      scenes.forEach(renderScene)
      return
    }

    for (const scene of scenes) {
      scene.versions.forEach((version, index) => {
        pendingReleaseCount += 1
        const timer = window.setTimeout(() => {
          pendingReleaseCount -= 1
          releaseBadge(scene, index)
        }, version.delay)
        releaseTimers.push(timer)
      })
    }

    previousFrameTime = 0
    physicsAccumulator = 0
    settledFrameCount = 0
    animationFrame = requestAnimationFrame(tick)
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
  observer?.disconnect()
  resizeObserver?.disconnect()
  cancelAnimationFrame(animationFrame)
  releaseTimers.forEach(timer => window.clearTimeout(timer))
  scenes.forEach(scene => Matter.Engine.clear(scene.engine))
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
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transform-origin: center;
}

.kernel-sync__badge-slot.is-released {
  visibility: visible;
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
