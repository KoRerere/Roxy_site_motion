// server/api/posts.ts
import { defineEventHandler, sendRedirect } from 'h3'
import { ghostApi } from '~/server/utils/api'
import { DEFAULT_LANGUAGE } from '~/constants'
import { formatPost } from '../index'

export default defineEventHandler(async (event) => {
  const params = event.context.params;
  const headers = event.node.req.headers;
  const language = headers['language'] as string;
  let slug = params?.slug

  if (!slug) {
    throw createError({
      statusCode: 400,
      statusText: 'Slug is required'
    })
  }

  if (language !== DEFAULT_LANGUAGE) {
    slug = `${language}-${slug}` 
  }

  const result = await ghostApi.posts.read(slug);

  if (Array.isArray(result.posts)) {
    result.posts = formatPost(result.posts, language);
    return result.posts[0];
  }
  return result;

  // try {
  //   const result = await ghostApi.posts.read(slug);
  //   console.log('result', result)
  //   if (Array.isArray(result.posts)) {
  //     result.posts = formatPost(result.posts, language);
  //     return result.posts[0];
  //   }
  //   return result;
  // } catch (error) {
  //   return sendRedirect(event, blogPath, 302)
  // }
});
