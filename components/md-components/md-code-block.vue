<script setup lang="ts">
import hljs from 'highlight.js/lib/core'
import plaintext from 'highlight.js/lib/languages/plaintext'
import { RxIcon } from '@/components/rx-icon'
import 'highlight.js/styles/base16/atelier-dune-light.css'

const props = defineProps({
  code: { type: String, default: '' },
  lang: { type: String, default: '' },
})

hljs.registerLanguage('plaintext', plaintext)

/** 自动收集 highlight.js 语言模块，避免手动维护映射 */
const rawLanguageLoaders = {
  ...import.meta.glob('../../node_modules/highlight.js/es/languages/*.js', { import: 'default' }),
}
const languageLoaders: Record<string, () => Promise<unknown>> = {}
for (const [filePath, loader] of Object.entries(rawLanguageLoaders)) {
  const normalizedPath = filePath.replaceAll('\\', '/')
  const fileName = normalizedPath.split('/').at(-1) || ''
  // 排除 highlight.js 的兼容包装文件（*.js.js），避免触发扩展名弃用警告
  if (fileName.endsWith('.js.js'))
    continue
  const languageName = fileName.replace(/\.js$/i, '').replace(/\.js$/i, '')
  if (languageName) {
    languageLoaders[languageName] = loader as () => Promise<unknown>
  }
}
/** 常见语言别名，用于解析到正确的模块名 */
const LANG_ALIASES: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  jsx: 'javascript',
  tsx: 'typescript',
  py: 'python',
  md: 'markdown',
  sh: 'bash',
  zsh: 'shell',
  yml: 'yaml',
  vb: 'vbnet',
  cs: 'csharp',
  fs: 'fsharp',
  rs: 'rust',
  kt: 'kotlin',
  rb: 'ruby',
}

const loadedLanguages = new Set<string>(['plaintext'])

function normalizeLanguageTag(lang: string): string {
  const raw = (lang || '').toLowerCase().trim()
  if (!raw)
    return 'plaintext'
  const firstToken = raw.split(/\s+/)[0] || raw
  const noPrefix = firstToken.replace(/^language-/, '')
  const noMeta = noPrefix.replace(/\{.*$/, '')
  return noMeta || 'plaintext'
}

async function ensureLanguage(lang: string): Promise<string> {
  const normalized = normalizeLanguageTag(lang)
  const name = LANG_ALIASES[normalized] ?? normalized
  if (loadedLanguages.has(name))
    return name
  if (hljs.getLanguage(name)) {
    loadedLanguages.add(name)
    return name
  }
  const loader = languageLoaders[name]
  if (!loader)
    return 'plaintext'
  try {
    const def = await loader()
    if (typeof def === 'function') {
      hljs.registerLanguage(name, def as Parameters<typeof hljs.registerLanguage>[1])
      loadedLanguages.add(name)
      return name
    }
    return 'plaintext'
  }
  catch {
    return 'plaintext'
  }
}

const highlightedCode = ref('')
const copied = ref(false)
const expanded = ref(false)
const lineCount = computed(() => {
  if (!props.code)
    return 0
  const lines = props.code.split('\n')
  if (lines.at(-1) === '') {
    lines.pop()
  }
  return lines.length
})
const isCollapsible = computed(() => lineCount.value > 10)

async function render() {
  const language = normalizeLanguageTag(props.lang || '')
  const name = await ensureLanguage(language)
  let html = ''
  try {
    html = hljs.highlight(props.code || '', { language: name }).value
  }
  catch {
    html = hljs.highlight(props.code || '', { language: 'plaintext' }).value
  }
  const lines = html.split('\n')
  if (lines.at(-1) === '') {
    lines.pop()
  }
  highlightedCode.value = lines.join('\n')
}

onMounted(render)
watch(() => [props.code, props.lang], render)

async function copy() {
  try {
    await navigator.clipboard.writeText(props.code || '')
    copied.value = true
    setTimeout(() => (copied.value = false), 1500)
  }
  catch {}
}
</script>

<template>
  <div class="code-card" :class="{ collapsible: isCollapsible }">
    <button class="copy-code-btn" @click="copy">
      <RxIcon :name="copied ? 'base/rx_ic_check_fill_gray' : 'base/rx_ic_copy'" />
    </button>
    <div class="code-block-wrapper" :class="{ collapsed: !expanded && isCollapsible }">
      <div class="line">
        <template v-for="line in lineCount" :key="line">
          <div class="line-number">
            {{ line }}
          </div>
        </template>
      </div>
      <pre class="code-block hljs"><code v-html="highlightedCode" /></pre>
    </div>
    <div v-if="isCollapsible" class="code-expand">
      <button class="expand-btn" @click="expanded = !expanded">
        <span>{{ expanded ? $t('收起') : $t('展开') }}</span>
        <svg :style="{ transform: expanded ? 'rotate(180deg)' : 'rotate(0deg)' }" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>
    </div>
  </div>
</template>

<style scoped lang="scss">
.code-card {
  position: relative;
  display: flex;
  gap: 24px;
  padding: 16px 12px;
  margin: 20px 0;
  flex-direction: column;
  align-items: center;
  align-self: stretch;
  border-radius: 8px;
  border: 1px solid var(--colors-border-border-inactive, #e2e9ee);
  background: var(--colors-background-bg-example, #f7fafc);
  font-family: 'JetBrains Mono';

  &.collapsible {
    padding-bottom: 0;
  }
}
.code-block-wrapper {
  display: flex;
  margin: 0;
  width: 100%;
  position: relative;
  height: calc-size(auto, size);
}
.code-block-wrapper.collapsed {
  max-height: 208px;
  overflow: hidden;
}
.copy-code-btn {
  position: absolute;
  right: 12px;
  top: 12px;
  display: flex;
  padding: 5px;
  justify-content: center;
  align-items: center;
  gap: var(--spacing-sm, 4px);
  border-radius: var(--radius-sm, 4px);
  z-index: 1;
  cursor: pointer;
  background-color: rgba(0, 0, 0, 0.05);

  &:hover {
    background: var(--colors-alpha-alpha-black-10, rgba(0, 0, 0, 0.1));
  }
}
.code-block {
  background: #f6f8fa;
  color: #24292f;
  overflow: auto hidden;
  margin: 0;
  font-size: 14px;
  position: relative;
  /* 行号列宽与间距（用于连续分割线定位）*/
  --ln-width: 2.2em;
  --ln-pr: 10px;
  --ln-mr: 12px;
}
.line {
  display: flex;
  flex-direction: column;
  padding-right: 15px;
  margin-right: 15px;
  border-right: 1px solid var(--colors-border-border-inactive, #e2e9ee);

  .line-number {
    display: inline-block;
    width: var(--ln-width);
    text-align: right;
    color: #8c959f;
    padding-right: var(--ln-pr); /* 行号与分割线的内边距 */
    margin-right: var(--ln-mr); /* 分割线与代码的间距 */
    user-select: none;
    font-size: 14px;
  }
}

.code-expand {
  width: 100%;
  border-top: 1px solid #d8dee4;
  padding: 6px 8px;
  display: flex;
  justify-content: center;
}
.expand-btn {
  display: inline-flex;
  gap: 4px;
  align-items: center;
  background: transparent;
  border: 0;
  color: #57606a;
  cursor: pointer;
  padding: 6px 10px;
  border-radius: 6px;
  color: var(--colors-text-text-secondary, #34393d);
  text-align: center;
  font-family: Inter;
  font-size: var(--Font-Size-text-sm, 12px);
  font-style: normal;
  font-weight: 500;
  line-height: var(--Line-Height-text-xs, 16px); /* 133.333% */
}
.expand-btn:hover {
  background: #f6f8fa;
}
/* 选中文本样式：蓝底黑字，仅作用于代码块内部（scoped 下使用 :deep） */
.code-block.hljs ::selection {
  background-color: rgba(17, 163, 253, 0.4);
  color: #111213;
}
</style>
