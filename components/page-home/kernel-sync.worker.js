import Matter from 'matter-js'

const WALL_CATEGORY = 0x0001
const TOP_WALL_CATEGORY = 0x0002
const BADGE_CATEGORY = 0x0004
const ENTRY_BADGE_MASK = WALL_CATEGORY | BADGE_CATEGORY
const ACTIVE_BADGE_MASK = ENTRY_BADGE_MASK | TOP_WALL_CATEGORY
const CARD_CORNER_RADIUS = 32
const FIXED_TIMESTEP = 1000 / 60
const SETTLED_FRAME_LIMIT = 12
const MAX_TIMELINE_FRAMES = 900

let scenes = []
let elapsedTime = 0
let settledFrameCount = 0

function createSceneWalls(width, height, sideInset, bottomInset) {
  const { Bodies } = Matter
  const wallThickness = 80
  const wallHeight = height * 4
  const cornerRadius = CARD_CORNER_RADIUS
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

function createScene(config) {
  const { Body, Composite, Engine, Events } = Matter
  const { gravity, height, irregularFloor, measurements, versions, width } = config
  const sideInset = irregularFloor ? 0.75 : 1.2
  const bottomInset = irregularFloor ? 0.75 : 1.2
  const engine = Engine.create({ enableSleeping: true })

  engine.gravity.y = gravity
  engine.gravity.scale = 0.001
  engine.positionIterations = 9
  engine.velocityIterations = 7

  const walls = createSceneWalls(width, height, sideInset, bottomInset)
  Composite.add(engine.world, walls)

  const collisionDeflection = irregularFloor
    ? { angularCap: 0.12, angularStep: 0.05, lateralForce: 0.000018, maxCount: 2 }
    : { angularCap: 0.046, angularStep: 0.019, lateralForce: 0.0000095, maxCount: 3 }
  const pendingEntryCollisions = new Map()

  const applyCollisionInertia = (pair) => {
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

  Events.on(engine, 'collisionStart', (event) => {
    for (const pair of event.pairs) {
      if (pair.bodyA.isStatic || pair.bodyB.isStatic) {
        continue
      }

      const bothBodiesEntered = pair.bodyA.plugin.kernelSyncHasEntered && pair.bodyB.plugin.kernelSyncHasEntered

      if (!bothBodiesEntered) {
        pendingEntryCollisions.set(pair.id, {
          bodyA: pair.bodyA,
          bodyB: pair.bodyB,
          id: pair.id,
        })
        continue
      }

      applyCollisionInertia(pair)
    }
  })

  const flushPendingEntryCollisions = () => {
    for (const [pairId, pair] of pendingEntryCollisions) {
      const bothBodiesEntered = pair.bodyA.plugin.kernelSyncHasEntered && pair.bodyB.plugin.kernelSyncHasEntered

      if (bothBodiesEntered) {
        pendingEntryCollisions.delete(pairId)
        applyCollisionInertia(pair)
      }
    }
  }

  Events.on(engine, 'collisionEnd', (event) => {
    for (const pair of event.pairs) {
      pendingEntryCollisions.delete(pair.id)
    }
  })

  return {
    engine,
    height,
    versions,
    width,
    bodies: [],
    bottomInset,
    cohesionStrength: irregularFloor ? 0.00018 : 0.00036,
    flushPendingEntryCollisions,
    frictionAir: irregularFloor ? 0.0038 : 0.0045,
    irregularFloor,
    measurements,
    preparedBadges: [],
    sideInset,
    sleepThreshold: irregularFloor ? 65 : 50,
    walls,
  }
}

function getBadgeSpawn(scene, bodyWidth, bodyHeight, version) {
  const angle = Math.abs(version.angle ?? 0)
  const rotatedHalfWidth = Math.abs(Math.cos(angle)) * bodyWidth / 2 + Math.abs(Math.sin(angle)) * bodyHeight / 2
  const rotatedHalfHeight = Math.abs(Math.sin(angle)) * bodyWidth / 2 + Math.abs(Math.cos(angle)) * bodyHeight / 2
  const entryClearance = scene.irregularFloor ? CARD_CORNER_RADIUS : 0
  const horizontalHalfExtent = scene.irregularFloor ? rotatedHalfWidth : bodyWidth / 2
  const minX = scene.sideInset + horizontalHalfExtent + entryClearance
  const maxX = scene.width - scene.sideInset - horizontalHalfExtent - entryClearance
  const x = Math.min(maxX, Math.max(minX, scene.width * version.startX))
  const spawnGap = scene.irregularFloor ? 8 : 52
  const verticalHalfExtent = scene.irregularFloor ? rotatedHalfHeight : bodyHeight / 2
  const y = -verticalHalfExtent - spawnGap

  return { x, y }
}

function prepareBadge(scene, index) {
  if (scene.preparedBadges[index]) {
    return scene.preparedBadges[index]
  }

  const { Body, Bodies } = Matter
  const version = scene.versions[index]
  const measurement = scene.measurements[index]

  if (!version || !measurement) {
    return null
  }

  const { visualHeight, visualWidth } = measurement
  const defaultCollisionPadding = 0
  const bodyWidth = visualWidth + (version.collisionPaddingX ?? defaultCollisionPadding) * 2
  const bodyHeight = visualHeight + (version.collisionPaddingY ?? defaultCollisionPadding) * 2
  const { x, y } = getBadgeSpawn(scene, bodyWidth, bodyHeight, version)
  const body = Bodies.rectangle(x, y, bodyWidth, bodyHeight, {
    angle: version.angle,
    collisionFilter: {
      category: BADGE_CATEGORY,
      mask: scene.irregularFloor ? WALL_CATEGORY : ENTRY_BADGE_MASK,
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
      quality: 10,
      qualityMax: 12,
      qualityMin: 8,
    },
  })

  Body.setAngularVelocity(body, version.spin ?? version.angle * 0.012)
  body.plugin.kernelSyncHasEntered = false
  Body.setVelocity(body, {
    x: version.drift ?? (version.startX - 0.5) * 0.55,
    y: scene.irregularFloor ? 0.05 : 0.35,
  })

  const item = {
    body,
    bodyHeight,
    bodyWidth,
    gravityScale: version.gravityScale ?? 1,
    hasEntered: false,
    isReleased: false,
    previousAngle: body.angle,
    previousPositionX: body.position.x,
    previousPositionY: body.position.y,
    releasedAt: 0,
    version,
    visualHeight,
    visualWidth,
  }

  scene.preparedBadges[index] = item
  return item
}

function positionBadgeForRelease(scene, item) {
  const { Body, Bounds } = Matter
  const spawnPosition = getBadgeSpawn(scene, item.bodyWidth, item.bodyHeight, item.version)

  Body.setPosition(item.body, spawnPosition)

  if (!scene.irregularFloor) {
    for (let attempt = 0; attempt < scene.bodies.length; attempt += 1) {
      const overlappingItems = scene.bodies.filter(activeItem => Bounds.overlaps(item.body.bounds, activeItem.body.bounds))

      if (!overlappingItems.length) {
        break
      }

      const nearestOpenY = Math.min(...overlappingItems.map(activeItem => activeItem.body.bounds.min.y)) - 4
      const overlapDepth = item.body.bounds.max.y - nearestOpenY
      Body.translate(item.body, { x: 0, y: -overlapDepth })
    }
  }

  item.previousAngle = item.body.angle
  item.previousPositionX = item.body.position.x
  item.previousPositionY = item.body.position.y
}

function releaseBadge(scene, index) {
  const item = prepareBadge(scene, index)

  if (!item || item.isReleased) {
    return
  }

  positionBadgeForRelease(scene, item)
  item.isReleased = true
  item.releasedAt = scene.engine.timing.timestamp
  Matter.Composite.add(scene.engine.world, item.body)
  scene.bodies.push(item)
}

function syncSceneBounds(scene, width, height) {
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
      item.previousPositionX = item.body.position.x
      item.previousPositionY = item.body.position.y
    }
  }

  for (const item of scene.preparedBadges) {
    if (!item || item.isReleased) {
      continue
    }

    const { x, y } = getBadgeSpawn(scene, item.bodyWidth, item.bodyHeight, item.version)
    Matter.Body.setPosition(item.body, { x, y })
    item.previousPositionX = x
    item.previousPositionY = y
  }
}

function updateScene(scene, delta) {
  let didBodyEnter = false

  for (const item of scene.bodies) {
    item.previousAngle = item.body.angle
    item.previousPositionX = item.body.position.x
    item.previousPositionY = item.body.position.y

    if (!item.hasEntered && item.body.bounds.min.y >= scene.sideInset + 0.75) {
      item.hasEntered = true
      item.body.plugin.kernelSyncHasEntered = true
      item.body.collisionFilter.mask = ACTIVE_BADGE_MASK
      didBodyEnter = true
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

  if (didBodyEnter) {
    scene.flushPendingEntryCollisions()
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
}

function postFrame(interpolation = 1) {
  const itemCount = scenes.reduce((count, scene) => count + scene.versions.length, 0)
  const state = new Float32Array(itemCount * 5)
  let offset = 0

  for (const scene of scenes) {
    for (let index = 0; index < scene.versions.length; index += 1) {
      const item = scene.preparedBadges[index]
      const body = item.body
      const positionX = item.previousPositionX + (body.position.x - item.previousPositionX) * interpolation
      const positionY = item.previousPositionY + (body.position.y - item.previousPositionY) * interpolation
      const angle = item.previousAngle + (body.angle - item.previousAngle) * interpolation

      state[offset] = positionX
      state[offset + 1] = positionY
      state[offset + 2] = angle
      state[offset + 3] = item.isReleased ? 1 : 0
      state[offset + 4] = body.isSleeping ? 1 : 0
      offset += 5
    }
  }

  globalThis.postMessage({ type: 'frame', state }, [state.buffer])
}

function releaseDueBadges() {
  for (const scene of scenes) {
    scene.versions.forEach((version, index) => {
      if (!scene.preparedBadges[index].isReleased && version.delay <= elapsedTime) {
        releaseBadge(scene, index)
      }
    })
  }
}

function writeTimelineFrame(timeline, frameIndex, itemCount) {
  let itemIndex = 0

  for (const scene of scenes) {
    for (const item of scene.preparedBadges) {
      const offset = (frameIndex * itemCount + itemIndex) * 3

      timeline[offset] = item.body.position.x
      timeline[offset + 1] = item.body.position.y
      timeline[offset + 2] = item.body.angle
      itemIndex += 1
    }
  }
}

function precomputeTimeline() {
  const itemCount = scenes.reduce((count, scene) => count + scene.versions.length, 0)
  const timeline = new Float32Array(MAX_TIMELINE_FRAMES * itemCount * 3)
  let frameCount = 1

  elapsedTime = 0
  settledFrameCount = 0
  writeTimelineFrame(timeline, 0, itemCount)

  for (let frameIndex = 1; frameIndex < MAX_TIMELINE_FRAMES; frameIndex += 1) {
    elapsedTime = frameIndex * FIXED_TIMESTEP
    releaseDueBadges()

    for (const scene of scenes) {
      updateScene(scene, FIXED_TIMESTEP)
    }

    writeTimelineFrame(timeline, frameIndex, itemCount)
    frameCount += 1

    const hasPendingBadge = scenes.some(scene => scene.preparedBadges.some(item => !item.isReleased))
    const hasActiveBody = scenes.some(scene => scene.bodies.some(item => !item.body.isSleeping))
    settledFrameCount = hasPendingBadge || hasActiveBody ? 0 : settledFrameCount + 1

    if (settledFrameCount >= SETTLED_FRAME_LIMIT) {
      break
    }
  }

  const frameValues = frameCount * itemCount * 3
  const result = frameCount === MAX_TIMELINE_FRAMES ? timeline : timeline.slice(0, frameValues)

  globalThis.postMessage({
    type: 'timeline',
    frameCount,
    itemCount,
    timeline: result,
    timestep: FIXED_TIMESTEP,
  }, [result.buffer])
}

function startSimulation(instant) {
  elapsedTime = 0
  settledFrameCount = 0

  if (instant) {
    for (let simulationStep = 0; simulationStep < 900; simulationStep += 1) {
      elapsedTime = simulationStep * 16.67
      releaseDueBadges()

      for (const scene of scenes) {
        updateScene(scene, 16.67)
      }
    }

    postFrame()
    globalThis.postMessage({ type: 'done' })
    return
  }

  precomputeTimeline()
}

function initialize(configs, instant) {
  scenes.forEach(scene => Matter.Engine.clear(scene.engine))
  scenes = configs.map(createScene)

  const badgeQueue = scenes
    .flatMap(scene => scene.versions.map((version, index) => ({ index, scene, version })))
    .sort((badgeA, badgeB) => badgeA.version.delay - badgeB.version.delay)

  badgeQueue.forEach(({ index, scene }) => prepareBadge(scene, index))
  postFrame()
  startSimulation(instant)
}

globalThis.addEventListener('message', (event) => {
  const { type } = event.data

  if (type === 'init') {
    initialize(event.data.scenes, event.data.instant)
  }
  else if (type === 'resize') {
    const scene = scenes[event.data.sceneIndex]

    if (scene) {
      syncSceneBounds(scene, event.data.width, event.data.height)
      postFrame()
    }
  }
  else if (type === 'dispose') {
    scenes.forEach(scene => Matter.Engine.clear(scene.engine))
    scenes = []
    globalThis.close()
  }
})
