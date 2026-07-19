import fs from 'node:fs'
import path from 'node:path'

const htmlPath = process.argv[2]
const outSvgPath = process.argv[3]

if (!htmlPath || !outSvgPath) {
  console.error('Usage: node extract-fingerprint-animation.mjs <animation.html> <out.svg>')
  process.exit(1)
}

const html = fs.readFileSync(htmlPath, 'utf8')
const start = html.indexOf('<svg width="590"')
const end = html.indexOf('</svg>', start)

if (start === -1 || end === -1) {
  console.error('SVG not found in HTML')
  process.exit(1)
}

// 从 HTML 内联样式提取 SVG 动画 CSS，与 animation.html 预览保持一致
const styleBlockStart = html.indexOf('<style>')
const styleBlockEnd = html.indexOf('</style>', styleBlockStart)
const inlineCss = styleBlockEnd === -1
  ? ''
  : html.slice(styleBlockStart + 7, styleBlockEnd)
const svgCssMatch = inlineCss.match(/\/\* Each icon:[\s\S]*@media \(prefers-reduced-motion: reduce\) \{[\s\S]*?\}/)
const animationStyles = svgCssMatch
  ? `<style>\n  ${svgCssMatch[0]}\n</style>\n`
  : `<style>
  .float-icon {
    transform-box: fill-box;
    transform-origin: center;
    animation:
      icon-pop 1.5s cubic-bezier(0.16, 1, 0.3, 1) var(--delay) both,
      icon-fade 0.55s ease-out var(--delay) both,
      icon-bob var(--bob-dur) ease-in-out calc(var(--delay) + 1.5s + var(--bob-phase)) infinite;
  }
  @keyframes icon-pop {
    from { transform: translate(var(--dx), var(--dy)) rotate(var(--rot)) scale(0.2); }
    to   { transform: translate(0, 0) rotate(0deg) scale(1); }
  }
  @keyframes icon-fade {
    from { opacity: 0; }
    to   { opacity: 1; }
  }
  @keyframes icon-bob {
    0%, 100% { transform: translate(0, 0); }
    50%      { transform: translate(0, calc(var(--bob-amp) * -1)); }
  }
  .click-ripple { pointer-events: none; }
  .ripple-dot {
    fill: #1250FC;
    transform-origin: center;
    transform-box: fill-box;
    animation: dot-pop 0.45s ease-out 0s both;
  }
  .ripple-ring {
    transform-origin: center;
    transform-box: fill-box;
    opacity: 0;
  }
  .ring-1 { animation: ring-expand 0.6s ease-out 0.05s both; }
  .ring-2 { animation: ring-expand 0.6s ease-out 0.18s both; }
  .ring-3 { animation: ring-expand 0.6s ease-out 0.31s both; }
  @keyframes dot-pop {
    0%   { transform: scale(0); opacity: 0; }
    35%  { transform: scale(1.4); opacity: 1; }
    65%  { transform: scale(1); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
  }
  @keyframes ring-expand {
    0%   { transform: scale(0.3); opacity: 0.85; }
    100% { transform: scale(6); opacity: 0; }
  }
  @media (prefers-reduced-motion: reduce) {
    .float-icon, .ripple-dot, .ripple-ring { animation: none; }
  }
</style>
`

const rawSvg = html.slice(start, end + 6)
// 在完整开标签之后插入 <style>，避免破坏 width/height 属性
const openTagEnd = rawSvg.indexOf('>')
const svg = `${rawSvg.slice(0, openTagEnd + 1)}\n${animationStyles}${rawSvg.slice(openTagEnd + 1)}`
fs.mkdirSync(path.dirname(outSvgPath), { recursive: true })
fs.writeFileSync(outSvgPath, `${svg}\n`)
console.log(`Wrote ${svg.length} bytes to ${outSvgPath}`)
