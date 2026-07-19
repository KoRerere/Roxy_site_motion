export interface LanePoint {
  x: number
  y: number
  length: number
}

export interface Lane {
  points: LanePoint[]
  length: number
  width: number
  alpha: number
}

export interface Pulse {
  laneIndex: number
  head: number
  segmentLength: number
  gap: number
  speed: number
  alpha: number
  drift: number
  /** 本圈是否已触发抵达握点，重置脉冲时清零 */
  arrived: boolean
}

export function randomBetween(min: number, max: number) {
  return min + Math.random() * (max - min)
}

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value))
}

/** PC：自左缘扇形汇聚至右侧握点 */
export function buildHorizontalLane(
  startX: number,
  endX: number,
  vanishingY: number,
  startY: number,
  samples: number,
  curvePower: number,
): Lane {
  const points: LanePoint[] = []
  let length = 0
  let previous: { x: number, y: number } | null = null
  const span = endX - startX
  const offset = startY - vanishingY

  for (let index = 0; index <= samples; index += 1) {
    const progress = index / samples
    const x = startX + span * progress
    const taper = Math.pow((endX - x) / span, curvePower)
    const point = {
      x,
      y: vanishingY + offset * taper,
    }

    if (previous)
      length += Math.hypot(point.x - previous.x, point.y - previous.y)

    points.push({ ...point, length })
    previous = point
  }

  return {
    points,
    length,
    width: 1.7,
    alpha: 0.22,
  }
}

/** 移动端：自上缘散开汇入底部握点（PC buildHorizontalLane 的纵向镜像） */
export function buildVerticalLane(
  startY: number,
  convergeY: number,
  convergeX: number,
  startX: number,
  samples: number,
  curvePower: number,
): Lane {
  const points: LanePoint[] = []
  let length = 0
  let previous: { x: number, y: number } | null = null
  const span = convergeY - startY
  const offset = startX - convergeX

  for (let index = 0; index <= samples; index += 1) {
    const progress = index / samples
    const y = startY + span * progress
    const taper = Math.pow((convergeY - y) / span, curvePower)
    const point = {
      x: convergeX + offset * taper,
      y,
    }

    if (previous)
      length += Math.hypot(point.x - previous.x, point.y - previous.y)

    points.push({ ...point, length })
    previous = point
  }

  return {
    points,
    length,
    width: 1.7,
    alpha: 0.22,
  }
}

export function pointAtLength(lane: Lane, targetLength: number) {
  const normalizedLength = clamp(targetLength, 0, lane.length)

  for (let index = 1; index < lane.points.length; index += 1) {
    const current = lane.points[index]!
    const previous = lane.points[index - 1]!

    if (normalizedLength <= current.length) {
      const segmentLength = current.length - previous.length || 1
      const progress = (normalizedLength - previous.length) / segmentLength
      return {
        x: previous.x + (current.x - previous.x) * progress,
        y: previous.y + (current.y - previous.y) * progress,
      }
    }
  }

  return lane.points[lane.points.length - 1]!
}

export function buildPulses(lanes: Lane[], reducedMotion: boolean) {
  const pulseCount = reducedMotion ? 3 : 6
  const highlightedLaneIndexes = [0.12, 0.24, 0.38, 0.62, 0.76, 0.88].map(position =>
    Math.round((lanes.length - 1) * position),
  )

  return Array.from({ length: pulseCount }, (_, index) => {
    const laneIndex = highlightedLaneIndexes[index % highlightedLaneIndexes.length] ?? 0
    const lane = lanes[laneIndex]!
    const segmentLength = lane.length * randomBetween(0.12, 0.2)
    const gap = lane.length * randomBetween(0.18, 0.32)

    return {
      laneIndex,
      head: -randomBetween(0, lane.length + gap),
      segmentLength,
      gap,
      speed: reducedMotion ? randomBetween(130, 173) : randomBetween(300, 432),
      alpha: randomBetween(0.82, 1),
      drift: randomBetween(0, Math.PI * 2),
      arrived: false,
    }
  })
}

export function drawLane(ctx: CanvasRenderingContext2D, lane: Lane) {
  const fadePortion = 0.2

  for (let index = 1; index < lane.points.length; index += 1) {
    const previous = lane.points[index - 1]!
    const current = lane.points[index]!
    const progress = current.length / lane.length
    const alphaScale = clamp(progress / fadePortion, 0, 1)

    ctx.beginPath()
    ctx.moveTo(previous.x, previous.y)
    ctx.lineTo(current.x, current.y)
    ctx.strokeStyle = `rgba(198, 205, 219, ${lane.alpha * alphaScale * 0.72})`
    ctx.lineWidth = lane.width
    ctx.shadowBlur = 0
    ctx.stroke()
  }
}

export function drawPulse(ctx: CanvasRenderingContext2D, pulse: Pulse, lanes: Lane[]) {
  const lane = lanes[pulse.laneIndex]
  if (!lane)
    return

  const visibleStart = Math.max(0, pulse.head - pulse.segmentLength)
  const visibleEnd = Math.min(pulse.head, lane.length)

  if (visibleEnd <= 0 || visibleStart >= lane.length || visibleEnd <= visibleStart)
    return

  const points: Array<{ x: number, y: number }> = []
  const sampleCount = 26
  const visibleLength = visibleEnd - visibleStart

  for (let index = 0; index <= sampleCount; index += 1) {
    const offset = visibleStart + (visibleLength * index) / sampleCount
    points.push(pointAtLength(lane, offset))
  }

  const start = points[0]!
  const end = points[points.length - 1]!
  const shimmer = 0.9 + Math.sin(performance.now() * 0.0018 + pulse.drift) * 0.08
  const stroke = ctx.createLinearGradient(start.x, start.y, end.x, end.y)
  // 脉冲色对齐表单卡片：#4CA4F4 → #F28CB1（与 invite-form-shell 外发光一致）
  stroke.addColorStop(0, 'rgba(76, 164, 244, 0)')
  stroke.addColorStop(0.12, `rgba(76, 164, 244, ${pulse.alpha * 0.9 * shimmer})`)
  stroke.addColorStop(0.52, `rgba(242, 180, 200, ${pulse.alpha * 0.95 * shimmer})`)
  stroke.addColorStop(1, `rgba(242, 140, 177, ${pulse.alpha * shimmer})`)

  ctx.beginPath()
  ctx.moveTo(start.x, start.y)
  for (let index = 1; index < points.length; index += 1)
    ctx.lineTo(points[index]!.x, points[index]!.y)

  ctx.strokeStyle = stroke
  ctx.lineWidth = 3
  ctx.shadowBlur = 14
  ctx.shadowColor = 'rgba(63, 170, 246, 0.32)'
  ctx.stroke()
}
