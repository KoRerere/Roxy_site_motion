export function formatArticleReadingTime(article: any, locales?: string) {
  if (!article?.published_at) return '';
  const publishedAt = new Date(article.published_at)
  const readingTime = article.reading_time
  const date = new Intl.DateTimeFormat(locales || 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(publishedAt);

  return `${date} . ${readingTime} min read`
}
