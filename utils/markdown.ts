import { embed } from '@mdit/plugin-embed'
// plugins/markdown.ts
import MarkdownIt from 'markdown-it'
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItAttrs from 'markdown-it-attrs'
import MarkdownItVideo from 'markdown-it-video'
import { setupCTA } from '~/utils/cta-components'

interface Json { level: number, title: string, anchor: string, children?: Json[] }

let json: Json[] = []
const md = new MarkdownIt({
  html: true, // 允许 HTML 标签
  // linkify: true,  // 自动识别链接
  typographer: true, // 启用智能排版
  breaks: true, // 启用自动换行
})
  .use(MarkdownItAnchor, {
    permalink: false,
    slugify: (s: string) => {
      // 自定义 slug 生成函数，确保特殊字符被正确处理
      let slug = s
        .trim()
        .toLowerCase()
        .replace(/\s+/g, '-') // 空格替换为连字符
        .replace(/[\u4E00-\u9FFF]/g, '') // 移除中文字符（因为中文在URL中不友好）
        .replace(/[^\w\-]/g, '') // 移除除了字母、数字、连字符以外的字符
        .replace(/-+/g, '-') // 多个连字符合并为一个
        .replace(/^-+|-+$/g, '') // 移除开头和结尾的连字符

      // 如果处理后的slug为空或者以数字开头，添加 'heading-' 前缀
      if (!slug || /^\d/.test(slug)) {
        slug = `heading-${slug || Date.now().toString().slice(-6)}`
      }

      return slug
    },
    callback: (token: any, title: any) => {
      // 提取 h1-h6 级别
      const level = Number.parseInt(token.tag.slice(1))
      // 使用处理后的 slug，确保与 HTML 中的 id 一致
      const anchor = title.slug

      if (level < 3) {
        json.push({
          level,
          title: title.title,
          anchor,
        })
      }
      else if (json.length > 0 && json.at(-1)) {
        const lastItem = json.at(-1)!
        lastItem.children ||= []
        lastItem.children.push({
          level,
          title: title.title,
          anchor,
        })
      }
    },
  })
  .use(MarkdownItAttrs, {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: [], // empty array = all attributes are allowed
  })
  .use(MarkdownItVideo, {
    youtube: {
      width: '100%',
      height: '100%',
    },
  })
  .use(embed, {
    config: [
      {
        name: 'cta',
        setup: setupCTA,
      },
    ],
  })

// 自定义表格渲染规则，用 div 包裹表格
const defaultRender = md.renderer.rules.table_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.table_open = function (tokens, idx, options, env, self) {
  return `<div class="table-wrapper">${defaultRender(tokens, idx, options, env, self)}`
}

const defaultTableCloseRender = md.renderer.rules.table_close || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.table_close = function (tokens, idx, options, env, self) {
  return `${defaultTableCloseRender(tokens, idx, options, env, self)}</div>`
}

// 重写 image 渲染规则
const defaultImageRender = md.renderer.rules.image || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.image = function (tokens, idx, options, env, self) {
  const token = tokens[idx]

  // 添加自定义属性
  token?.attrSet('data-zoomable', 'true')
  // token?.attrSet('loading', 'lazy')

  // 执行默认渲染
  return defaultImageRender(tokens, idx, options, env, self)
}

// 自定义标题渲染规则，处理 id 属性
const defaultHeadingOpenRender = md.renderer.rules.heading_open || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.heading_open = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  if (!token || !token.attrs) {
    return defaultHeadingOpenRender(tokens, idx, options, env, self)
  }

  // 处理 id 属性，确保与 slugify 函数保持一致
  const idIndex = token.attrIndex('id')
  if (idIndex >= 0 && token.attrs[idIndex] && token.attrs[idIndex][1]) {
    // 直接使用生成的 id，不进行额外的解码处理
    // 因为 slugify 函数已经确保了 id 的正确格式
    const originalId = token.attrs[idIndex][1]
    token.attrs[idIndex][1] = originalId
  }

  return defaultHeadingOpenRender(tokens, idx, options, env, self)
}

// 自定义代码块渲染：输出 <md-code-block code lang>
const defaultFenceRender = md.renderer.rules.fence || function (tokens, idx, options, env, self) {
  return self.renderToken(tokens, idx, options)
}

md.renderer.rules.fence = function (tokens, idx, options, env, self) {
  const token = tokens[idx]
  if (!token)
    return defaultFenceRender(tokens, idx, options, env, self)

  const code = token.content || ''
  const lang = (token.info || '').trim()

  // 避免属性注入，严格转义
  const escapeAttr = (s: string) =>
    s
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')

  return `<md-code-block code="${escapeAttr(code)}" lang="${escapeAttr(lang)}"></md-code-block>`
}

export function $md(content: string) {
  json = []
  const html = md.render(content)
  return {
    nav: '',
    html,
    directory: json,
  }
}

export function $extractKeywords(text: string) {
  if (text.startsWith('keywords=')) {
    return text.replace('keywords=', '')
  }
}
