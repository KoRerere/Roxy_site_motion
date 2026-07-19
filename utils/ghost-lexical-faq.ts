export interface GhostFaqItem {
  title: string
  desc: string
}

export function stripHtmlToPlainText(html: string) {
  return html.replace(/<[^>]+>/g, '').trim()
}

export function buildFaqPageLdJson(items: GhostFaqItem[], pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    '@id': pageUrl,
    'mainEntity': items.map(item => ({
      '@type': 'Question',
      'name': item.title,
      'acceptedAnswer': {
        '@type': 'Answer',
        'text': stripHtmlToPlainText(item.desc),
      },
    })),
  }
}

/** Ghost Toggle 块：heading / content 为 HTML 字符串 */
export function parseGhostFaqLexical(lexical: string | null | undefined): GhostFaqItem[] {
  if (!lexical)
    return []
  try {
    const parsed = JSON.parse(lexical)
    const children = parsed?.root?.children
    if (!Array.isArray(children))
      return []
    return children
      .filter((node: { type?: string, heading?: string, content?: string }) =>
        node.type === 'toggle' && (node.heading || node.content))
      .map((node: { heading?: string, content?: string }) => ({
        title: stripHtmlToPlainText(node.heading || ''),
        desc: node.content || '',
      }))
      .filter(item => item.title)
  }
  catch {
    return []
  }
}
