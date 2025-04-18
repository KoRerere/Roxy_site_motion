export function formatArticleReadingTime(article: any, locales?: string) {
  const updatedAt = new Date(article.updated_at)
  const readingTime = article.reading_time
  const date = new Intl.DateTimeFormat(locales || 'en-GB', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(updatedAt);

  return `${date} . ${readingTime} min read`
}
