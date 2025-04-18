// server/api/posts.ts
import { defineEventHandler } from 'h3'
import { ghostApi } from '~/server/utils/api'

export default defineEventHandler(async (event) => {
  const params = event.context.params;

  const slug = params?.slug
  console.log('Received slug:', slug);

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Slug is required'
    })
  }
  const result = await ghostApi.posts.read(slug);

  if (Array.isArray(result.posts)) {
    return result.posts[0];
  }

  return '### 文章不存在';
});
