type Tone = 'light' | 'dark'

interface RgbaColor {
  r: number
  g: number
  b: number
  a: number
}

interface SamplePoint {
  x: number
  y: number
  color: string
  source: string
  element: string
}

interface DetectViewportToneOptions {
  cols?: number
  rows?: number
  maxHeight?: number
  bucketSize?: number
  excludeElement?: HTMLElement | null
  minBlockCoverage?: number
}

interface ColorBucket {
  key: string
  count: number
  color: string
  luminance: number
}

interface RectInfo {
  x: number
  y: number
  width: number
  height: number
}

interface VisualBlock {
  element: string
  source: string
  color: string
  luminance: number
  coverage: number
  area: number
  rect: RectInfo
}

export interface ViewportToneResult {
  tone: Tone
  dominantColor: string
  dominantLuminance: number
  detectionMode: 'visual-blocks' | 'point-sampling'
  sampleRect: {
    x: number
    y: number
    width: number
    height: number
  }
  sampleCount: number
  blocks: VisualBlock[]
  buckets: ColorBucket[]
  samples: SamplePoint[]
}

const DEFAULT_COLOR: RgbaColor = { r: 255, g: 255, b: 255, a: 1 }
const TRANSPARENT_COLOR: RgbaColor = { r: 0, g: 0, b: 0, a: 0 }

function clampColor(value: number) {
  return Math.max(0, Math.min(255, Math.round(value)))
}

function toHex(color: RgbaColor) {
  const hex = [color.r, color.g, color.b]
    .map(value => clampColor(value).toString(16).padStart(2, '0'))
    .join('')

  return `#${hex}`.toUpperCase()
}

function getLuminance(color: RgbaColor) {
  return 0.2126 * color.r + 0.7152 * color.g + 0.0722 * color.b
}

function getTone(color: RgbaColor): Tone {
  return getLuminance(color) < 140 ? 'dark' : 'light'
}

function parseHexColor(value: string): RgbaColor | null {
  const hexMatch = value.match(/#([0-9a-f]{3,8})/i)
  if (!hexMatch)
    return null

  const hex = hexMatch[1]
  const normalized = hex.length === 3 || hex.length === 4
    ? hex.split('').map(char => `${char}${char}`).join('')
    : hex

  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
    a: normalized.length >= 8 ? Number.parseInt(normalized.slice(6, 8), 16) / 255 : 1,
  }
}

function parseCssColor(value: string): RgbaColor | null {
  if (!value || value === 'transparent')
    return null

  const colorMixMatch = value.match(/^color-mix\(/i)
  if (colorMixMatch) {
    return parseHexColor(value)
  }

  const hexColor = parseHexColor(value)
  if (hexColor)
    return hexColor

  const rgbaMatch = value.match(/^rgba?\(([^)]+)\)$/i)
  if (!rgbaMatch) {
    const colorMatch = value.match(/^color\(srgb\s+([0-9.]+)\s+([0-9.]+)\s+([0-9.]+)(?:\s*\/\s*([0-9.]+))?\)$/i)
    if (!colorMatch)
      return null

    return {
      r: Number.parseFloat(colorMatch[1]) * 255,
      g: Number.parseFloat(colorMatch[2]) * 255,
      b: Number.parseFloat(colorMatch[3]) * 255,
      a: colorMatch[4] === undefined ? 1 : Number.parseFloat(colorMatch[4]),
    }
  }

  const rawParts = rgbaMatch[1].includes(',')
    ? rgbaMatch[1].split(',').map(part => part.trim())
    : rgbaMatch[1].replace(/\s*\/\s*/, ' / ').split(/\s+/).filter(Boolean)

  if (rawParts.length < 3)
    return null

  const slashIndex = rawParts.indexOf('/')
  const rgbParts = slashIndex >= 0 ? rawParts.slice(0, slashIndex) : rawParts
  const alphaPart = slashIndex >= 0 ? rawParts[slashIndex + 1] : rawParts[3]
  const parseChannel = (part: string) => {
    if (part.endsWith('%'))
      return Number.parseFloat(part) / 100 * 255
    return Number.parseFloat(part)
  }
  const parseAlpha = (part?: string) => {
    if (part === undefined)
      return 1
    if (part.endsWith('%'))
      return Number.parseFloat(part) / 100
    return Number.parseFloat(part)
  }

  const [r, g, b] = rgbParts
  const a = parseAlpha(alphaPart)

  return {
    r: parseChannel(r),
    g: parseChannel(g),
    b: parseChannel(b),
    a: Number.isFinite(a) ? a : 1,
  }
}

function compositeColor(top: RgbaColor, bottom: RgbaColor) {
  const alpha = top.a + bottom.a * (1 - top.a)
  if (alpha <= 0)
    return { ...DEFAULT_COLOR }

  return {
    r: (top.r * top.a + bottom.r * bottom.a * (1 - top.a)) / alpha,
    g: (top.g * top.a + bottom.g * bottom.a * (1 - top.a)) / alpha,
    b: (top.b * top.a + bottom.b * bottom.a * (1 - top.a)) / alpha,
    a: alpha,
  }
}

function parsePositionPart(value: string, size: number) {
  if (value.endsWith('%'))
    return Number.parseFloat(value) / 100 * size
  if (value.endsWith('px'))
    return Number.parseFloat(value)
  if (value === 'left' || value === 'top')
    return 0
  if (value === 'right' || value === 'bottom')
    return size
  return size / 2
}

function getImageSampleColor(img: HTMLImageElement, x: number, y: number): RgbaColor | null {
  if (!img.complete || !img.naturalWidth || !img.naturalHeight)
    return null

  const rect = img.getBoundingClientRect()
  if (!rect.width || !rect.height)
    return null

  const style = window.getComputedStyle(img)
  const objectFit = style.objectFit || 'fill'
  const positionParts = (style.objectPosition || '50% 50%').split(/\s+/)
  const positionX = positionParts[0] || '50%'
  const positionY = positionParts[1] || positionX

  let renderedWidth = rect.width
  let renderedHeight = rect.height

  if (objectFit === 'contain' || objectFit === 'cover') {
    const imageRatio = img.naturalWidth / img.naturalHeight
    const rectRatio = rect.width / rect.height
    const useWidth = objectFit === 'contain' ? imageRatio > rectRatio : imageRatio < rectRatio

    if (useWidth) {
      renderedWidth = rect.width
      renderedHeight = rect.width / imageRatio
    }
    else {
      renderedHeight = rect.height
      renderedWidth = rect.height * imageRatio
    }
  }

  const offsetX = parsePositionPart(positionX, rect.width - renderedWidth)
  const offsetY = parsePositionPart(positionY, rect.height - renderedHeight)
  const imageX = x - rect.left - offsetX
  const imageY = y - rect.top - offsetY

  if (imageX < 0 || imageY < 0 || imageX > renderedWidth || imageY > renderedHeight)
    return null

  const sourceX = imageX / renderedWidth * img.naturalWidth
  const sourceY = imageY / renderedHeight * img.naturalHeight

  try {
    const canvas = document.createElement('canvas')
    canvas.width = 1
    canvas.height = 1
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context)
      return null

    context.drawImage(img, sourceX, sourceY, 1, 1, 0, 0, 1, 1)
    const [r, g, b, a] = context.getImageData(0, 0, 1, 1).data

    return { r, g, b, a: a / 255 }
  }
  catch {
    return null
  }
}

function getCanvasSampleColor(canvas: HTMLCanvasElement, x: number, y: number): RgbaColor | null {
  const rect = canvas.getBoundingClientRect()
  if (!rect.width || !rect.height || !canvas.width || !canvas.height)
    return null

  try {
    const context = canvas.getContext('2d', { willReadFrequently: true })
    if (!context)
      return null

    const sourceX = (x - rect.left) / rect.width * canvas.width
    const sourceY = (y - rect.top) / rect.height * canvas.height
    const [r, g, b, a] = context.getImageData(sourceX, sourceY, 1, 1).data
    if (a < 13)
      return null

    return { r, g, b, a: a / 255 }
  }
  catch {
    return null
  }
}

function parseBackgroundImageColor(value: string): RgbaColor | null {
  if (!value || value === 'none')
    return null

  const colors = Array.from(value.matchAll(/(?:rgba?|color)\([^)]*\)/gi))
    .map(match => parseCssColor(match[0]))
    .filter(Boolean) as RgbaColor[]

  if (!colors.length)
    return null

  return colors.reduce((sum, color) => ({
    r: sum.r + color.r / colors.length,
    g: sum.g + color.g / colors.length,
    b: sum.b + color.b / colors.length,
    a: Math.max(sum.a, color.a),
  }), { r: 0, g: 0, b: 0, a: 0 })
}

function getStyleLayerColor(style: CSSStyleDeclaration, source: string) {
  const backgroundColor = parseCssColor(style.backgroundColor)
  if (backgroundColor && backgroundColor.a > 0) {
    return {
      color: backgroundColor,
      source,
    }
  }

  const backgroundImageColor = parseBackgroundImageColor(style.backgroundImage)
  if (backgroundImageColor && backgroundImageColor.a > 0) {
    return {
      color: backgroundImageColor,
      source: `${source}-image`,
    }
  }

  return null
}

function getClassLayerColor(element: Element) {
  const className = typeof element.className === 'string' ? element.className : ''
  const hexBackground = className.match(/(?:^|\s)bg-\[(#[0-9a-f]{3,8})\]/i)
  if (!hexBackground)
    return null

  const color = parseHexColor(hexBackground[1])
  if (!color)
    return null

  return {
    color,
    source: 'class-background',
  }
}

function describeElement(element: Element) {
  const classes = element.className && typeof element.className === 'string'
    ? `.${element.className.trim().split(/\s+/).slice(0, 3).join('.')}`
    : ''
  const id = element.id ? `#${element.id}` : ''

  return `${element.tagName.toLowerCase()}${id}${classes}`
}

function isRootLayoutElement(element: Element) {
  const tagName = element.tagName.toLowerCase()
  return tagName === 'html'
    || tagName === 'body'
    || tagName === 'main'
    || element.id === '__nuxt'
    || element.id === 'home-content'
}

function getIntersectionArea(rect: DOMRect, sampleRect: RectInfo) {
  const left = Math.max(rect.left, sampleRect.x)
  const right = Math.min(rect.right, sampleRect.x + sampleRect.width)
  const top = Math.max(rect.top, sampleRect.y)
  const bottom = Math.min(rect.bottom, sampleRect.y + sampleRect.height)
  const width = Math.max(0, right - left)
  const height = Math.max(0, bottom - top)

  return width * height
}

function getRectInfo(rect: DOMRect): RectInfo {
  return {
    x: Math.round(rect.left),
    y: Math.round(rect.top),
    width: Math.round(rect.width),
    height: Math.round(rect.height),
  }
}

function getElementLayerColor(element: Element, x: number, y: number) {
  if (element instanceof HTMLImageElement) {
    const imageColor = getImageSampleColor(element, x, y)
    if (imageColor) {
      return {
        color: imageColor,
        source: 'image-canvas',
      }
    }
  }

  if (element instanceof HTMLCanvasElement) {
    const canvasColor = getCanvasSampleColor(element, x, y)
    if (canvasColor) {
      return {
        color: canvasColor,
        source: 'canvas',
      }
    }
  }

  const styleLayer = getStyleLayerColor(window.getComputedStyle(element), 'css-background')
  if (styleLayer)
    return styleLayer

  const classLayer = getClassLayerColor(element)
  if (classLayer)
    return classLayer

  const beforeStyle = window.getComputedStyle(element, '::before')
  const beforeLayer = beforeStyle.content !== 'none'
    ? getStyleLayerColor(beforeStyle, 'before-background')
    : null
  if (beforeLayer) {
    return {
      color: beforeLayer.color,
      source: beforeLayer.source,
    }
  }

  const afterStyle = window.getComputedStyle(element, '::after')
  const afterLayer = afterStyle.content !== 'none'
    ? getStyleLayerColor(afterStyle, 'after-background')
    : null
  if (afterLayer)
    return afterLayer

  return null
}

function getAncestorLayerColor(element: Element | undefined, x: number, y: number) {
  let current = element?.parentElement

  while (current) {
    const layer = getElementLayerColor(current, x, y)
    if (layer) {
      return {
        ...layer,
        source: `ancestor-${layer.source}`,
        element: current,
      }
    }

    current = current.parentElement
  }

  return null
}

function findDescendantLayerColor(element: Element, sampleRect: RectInfo) {
  const candidates = Array.from(element.querySelectorAll('*'))
    .map((child) => {
      const rect = child.getBoundingClientRect()
      const area = getIntersectionArea(rect, sampleRect)
      return { child, rect, area }
    })
    .filter(({ area }) => area > sampleRect.width * sampleRect.height * 0.08)
    .sort((a, b) => b.area - a.area)

  for (const { child, rect } of candidates.slice(0, 20)) {
    const x = Math.round(Math.max(sampleRect.x, Math.min(rect.left + rect.width / 2, sampleRect.x + sampleRect.width - 1)))
    const y = Math.round(Math.max(sampleRect.y, Math.min(rect.top + rect.height / 2, sampleRect.y + sampleRect.height - 1)))
    const layer = getElementLayerColor(child, x, y)
    if (layer) {
      return {
        ...layer,
        element: child,
      }
    }
  }

  return null
}

function getTopLevelVisualElements(sampleRect: RectInfo, options: DetectViewportToneOptions) {
  const viewportArea = sampleRect.width * sampleRect.height
  const candidates = Array.from(document.querySelectorAll('body *'))
    .map((element) => {
      if (isRootLayoutElement(element))
        return null

      if (options.excludeElement?.contains(element))
        return null

      const style = window.getComputedStyle(element)
      if (style.display === 'none' || style.visibility === 'hidden' || Number.parseFloat(style.opacity || '1') <= 0)
        return null

      const rect = element.getBoundingClientRect()
      const area = getIntersectionArea(rect, sampleRect)
      if (area <= 0)
        return null

      const isHugePageShell = rect.height > sampleRect.height * 2.5 && area / viewportArea > 0.95
      if (isHugePageShell)
        return null

      return {
        element,
        rect,
        area,
        coverage: area / viewportArea,
        depth: getElementDepth(element),
      }
    })
    .filter(Boolean) as Array<{
      element: Element
      rect: DOMRect
      area: number
      coverage: number
      depth: number
    }>

  return candidates
    .filter((candidate) => {
      if (candidate.coverage < 0.15)
        return false

      return !candidates.some((other) => {
        if (other === candidate || other.coverage < 0.15)
          return false
        return other.element.contains(candidate.element)
          && other.area >= candidate.area * 0.9
          && other.depth < candidate.depth
      })
    })
    .sort((a, b) => b.area - a.area)
}

function getElementDepth(element: Element) {
  let depth = 0
  let current = element.parentElement

  while (current) {
    depth += 1
    current = current.parentElement
  }

  return depth
}

function collectVisualBlocks(sampleRect: RectInfo, options: DetectViewportToneOptions) {
  const viewportArea = sampleRect.width * sampleRect.height
  const seen = new Set<Element>()
  const blocks: VisualBlock[] = []

  getTopLevelVisualElements(sampleRect, options).forEach(({ element, rect, area, coverage }) => {
    const x = Math.round(Math.max(sampleRect.x, Math.min(rect.left + rect.width / 2, sampleRect.x + sampleRect.width - 1)))
    const y = Math.round(Math.max(sampleRect.y, Math.min(rect.top + rect.height / 2, sampleRect.y + sampleRect.height - 1)))
    const directLayer = getElementLayerColor(element, x, y)
    const descendantLayer = directLayer ? null : findDescendantLayerColor(element, sampleRect)
    const layer = directLayer || descendantLayer

    if (!layer)
      return

    const sourceElement = 'element' in layer ? layer.element : element
    if (seen.has(element))
      return
    seen.add(element)

    blocks.push({
      element: describeElement(element),
      source: directLayer ? layer.source : `descendant-${layer.source}`,
      color: toHex(layer.color),
      luminance: Math.round(getLuminance(layer.color)),
      coverage: Number(coverage.toFixed(3)),
      area: Math.round(area),
      rect: getRectInfo(rect),
    })
  })

  return blocks.sort((a, b) => b.area - a.area).slice(0, 12)
}

function createBlockBuckets(blocks: VisualBlock[], bucketSize: number) {
  const bucketMap = new Map<string, number>()

  blocks.forEach((block) => {
    const key = createBucketKey(block.color, bucketSize)
    bucketMap.set(key, (bucketMap.get(key) ?? 0) + block.area)
  })

  return Array.from(bucketMap.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const color = colorFromBucket(key)

      return {
        key,
        count: Math.round(count),
        color: toHex(color),
        luminance: Math.round(getLuminance(color)),
      }
    })
}

function samplePointColor(x: number, y: number, excludeElement?: HTMLElement | null): SamplePoint {
  const elements = document
    .elementsFromPoint(x, y)
    .filter(element => !excludeElement || !excludeElement.contains(element))

  let color = { ...TRANSPARENT_COLOR }
  let source = 'fallback'
  let sourceElement = 'none'

  elements.reverse().forEach((element) => {
    const layer = getElementLayerColor(element, x, y)
    if (!layer)
      return

    color = compositeColor(layer.color, color)
    source = layer.source
    sourceElement = describeElement(element)
  })

  if (source === 'fallback') {
    const ancestorLayer = getAncestorLayerColor(elements[0], x, y)
    if (ancestorLayer) {
      color = ancestorLayer.color
      source = ancestorLayer.source
      sourceElement = describeElement(ancestorLayer.element)
    }
  }

  if (source === 'fallback')
    color = { ...DEFAULT_COLOR }

  return {
    x,
    y,
    color: toHex(color),
    source,
    element: sourceElement,
  }
}

function createBucketKey(color: string, bucketSize: number) {
  const r = Number.parseInt(color.slice(1, 3), 16)
  const g = Number.parseInt(color.slice(3, 5), 16)
  const b = Number.parseInt(color.slice(5, 7), 16)

  return [
    Math.round(r / bucketSize) * bucketSize,
    Math.round(g / bucketSize) * bucketSize,
    Math.round(b / bucketSize) * bucketSize,
  ].join('-')
}

function colorFromBucket(key: string): RgbaColor {
  const [r, g, b] = key.split('-').map(Number)
  return { r, g, b, a: 1 }
}

export function detectViewportTone(options: DetectViewportToneOptions = {}): ViewportToneResult {
  const cols = options.cols ?? 12
  const rows = options.rows ?? 16
  const bucketSize = options.bucketSize ?? 32
  const sampleRect = {
    x: 0,
    y: 0,
    width: window.innerWidth,
    height: Math.min(window.innerHeight, options.maxHeight ?? 640),
  }

  const blocks = collectVisualBlocks(sampleRect, options)
  const blockBuckets = createBlockBuckets(blocks, bucketSize)
  const samples: SamplePoint[] = []
  const buckets = new Map<string, number>()

  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      const x = Math.round(sampleRect.x + (col + 0.5) * sampleRect.width / cols)
      const y = Math.round(sampleRect.y + (row + 0.5) * sampleRect.height / rows)
      const sample = samplePointColor(x, y, options.excludeElement)
      const key = createBucketKey(sample.color, bucketSize)

      samples.push(sample)
      buckets.set(key, (buckets.get(key) ?? 0) + 1)
    }
  }

  const sortedBuckets = Array.from(buckets.entries())
    .sort((a, b) => b[1] - a[1])
    .map(([key, count]) => {
      const color = colorFromBucket(key)

      return {
        key,
        count,
        color: toHex(color),
        luminance: Math.round(getLuminance(color)),
      }
    })

  const visualDominantBucket = blockBuckets[0]
  const pointDominantBucket = sortedBuckets.find(bucket => bucket.color !== '#FFFFFF') || sortedBuckets[0]
  const dominantBucket = visualDominantBucket || pointDominantBucket
  const dominantColor = dominantBucket ? colorFromBucket(dominantBucket.key) : DEFAULT_COLOR
  const dominantLuminance = getLuminance(dominantColor)

  return {
    tone: getTone(dominantColor),
    dominantColor: toHex(dominantColor),
    dominantLuminance: Math.round(dominantLuminance),
    detectionMode: visualDominantBucket ? 'visual-blocks' : 'point-sampling',
    sampleRect,
    sampleCount: samples.length,
    blocks,
    buckets: (visualDominantBucket ? blockBuckets : sortedBuckets).slice(0, 8),
    samples,
  }
}
