<script setup>
import { useDebounceFn } from '@vueuse/core'
import { onMounted, onUnmounted } from 'vue'

const props = defineProps({
  // 关键词的字体颜色
  mainColor: {
    type: String,
    default: 'green',
  },
  // 其他字体的颜色
  otherColor: {
    type: String,
    default: 'yellow',
  },
  // 变化时字体的颜色
  changeColor: {
    type: String,
    default: 'red',
  },
  // 文本内容
  duch: {
    type: String,
    default: `,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,
,,,,,hello world,,,,,
,,,,,,,,,,,,,,,,,,,,,
,,,,,,,,,,,,,,,,,,,,,`,
  },
  // 变化字符数量（单帧模式下不再使用，保留 prop 兼容）
  changeNumber: {
    type: Number,
    default: 10,
  },
  // 变化速度（单帧模式下不再使用，保留 prop 兼容）
  changeSpeed: {
    type: Number,
    default: 50,
  },
  // 字体大小
  fontSize: {
    type: Number,
    default: 16,
  },
  // 行高
  lineHeight: {
    type: Number,
    default: 18,
  },
})

let textWidth = 0
const dpr = window.devicePixelRatio || 1

/** 绘制一帧矩阵文本（不做持续 setInterval 动画） */
function drawTextMatrix(ctx, textMatrix, canvasWidth, canvasHeight) {
  ctx.clearRect(0, 0, canvasWidth, canvasHeight)

  for (let i = 0; i < textMatrix.length; i++) {
    const line = textMatrix[i]
    for (let j = 0; j < line.length; j++) {
      let char = line[j]
      if (char.startsWith('MAIN-')) {
        ctx.fillStyle = props.mainColor
        char = char.replace('MAIN-', '')
      }
      else {
        ctx.fillStyle = props.otherColor
      }
      ctx.fillText(char, j * textWidth * dpr, (i + 1) * props.lineHeight * dpr)
    }
  }
}

async function textMatrix(container) {
  if (!import.meta.client)
    return
  await nextTick()
  const canvas = document.getElementById(container)

  if (!canvas)
    return

  const ctx = canvas.getContext('2d')
  if (textWidth === 0) {
    const text = ctx.measureText('#')
    textWidth = text.width + 2
  }

  const textMatrix = props.duch.split('\n').map(line => line.split('').map((char) => {
    if (char === ',') {
      return randomLetter(1)
    }
    else {
      // 保留关键字
      return `MAIN-${char}`
    }
  }))
  const canvasWidth = textWidth * textMatrix.at(0).length * dpr
  const canvasHeight = (textMatrix.length * props.lineHeight + props.lineHeight / 2) * dpr
  canvas.width = canvasWidth
  canvas.height = canvasHeight

  canvas.style.width = `${canvasWidth / dpr}px`
  canvas.style.height = `${canvasHeight / dpr}px`
  ctx.font = `${props.fontSize * dpr}px 'JetBrains Mono'`

  // 初始化只渲染一帧
  drawTextMatrix(ctx, textMatrix, canvasWidth, canvasHeight)
}

function randomLetter(length) {
  let text = ''
  const possible = 'abcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
}

const resize = useDebounceFn(() => {
  textMatrix('fingerprint-technology')
}, 100)

onMounted(() => {
  window.addEventListener('resize', resize)
  textMatrix('fingerprint-technology')
})

onUnmounted(() => {
  window.removeEventListener('resize', resize)
})
</script>

<template>
  <canvas id="fingerprint-technology" />
</template>
