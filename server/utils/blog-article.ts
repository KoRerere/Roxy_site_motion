import { $md } from '~/utils/markdown'

export function parseGhostArticleLexical(lexical: string | null | undefined) {
  if (!lexical)
    return { article: '', directory: [] as ReturnType<typeof $md>['directory'] }

  const parsed = JSON.parse(lexical)
  const markdown = parsed.root.children
    .filter((item: { type?: string }) => item.type === 'markdown')
    .map((item: { markdown?: string }) => item.markdown)
    .join('')

  const result = $md(markdown)
  return {
    article: result.html,
    directory: result.directory || [],
  }
}
