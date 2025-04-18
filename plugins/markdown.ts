// plugins/markdown.ts
import MarkdownIt from 'markdown-it';
import MarkdownItAnchor from 'markdown-it-anchor'
import MarkdownItAttrs from 'markdown-it-attrs';
import MarkdownItVideo from 'markdown-it-video';

export default defineNuxtPlugin(() => {
  let json: { level: number, title: string, anchor: string }[] = []
  const md = new MarkdownIt({
    html: true,  // 允许 HTML 标签
    linkify: true,  // 自动识别链接
    typographer: true, // 启用智能排版
    breaks: true, // 启用自动换行
  })
  .use(MarkdownItAnchor, { 
    permalink: false, 
    callback: (token: any, title: any) => {
      json.push({
        level: parseInt(token.tag.slice(1)), // 提取 h1-h6 级别
        title: title.title,
        anchor: title.slug,
      })
    }
  })
  .use(MarkdownItAttrs, {
    // optional, these are default options
    leftDelimiter: '{',
    rightDelimiter: '}',
    allowedAttributes: []  // empty array = all attributes are allowed
  })
  .use(MarkdownItVideo, {
    youtube: {
      width: '100%',
      height: '100%',
    }
  })

  return {
    provide: {
      md: async (content: string) => {
        json = []
        const html = md.render(content);
        return {
          nav: '',
          html,
          directory: json
        }
      },
      extractKeywords: (text: string) => {
        if (text.startsWith('keywords=')) {
          return text.replace('keywords=', '')
        }
      }
    }
  }
})
