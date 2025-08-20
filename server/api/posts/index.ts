// server/api/posts.ts
import { defineEventHandler } from 'h3'
import { ghostApi } from '~/server/utils/api'
import { DEFAULT_BLOG_POST_LIMIT, DEFAULT_LANGUAGE } from '~/constants'

export function formatPost(posts: any[], language: string) {
  if (language === DEFAULT_LANGUAGE) {
    return posts;
  }
  return posts.map((post) => {
    return {
      ...post,
      tags: post.tags.map((item: any) => {
        item.slug = item.slug.replace(`${language}-`, '');
        return item;
      })
    }
  })
}

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const headers = event.node.req.headers;
  const language = headers['language'] as string;
  let filter = `tag:${language}+status:[published,sent]`;
  if (query.tag) {
    let tag = query.tag;
    if (language !== DEFAULT_LANGUAGE) {
      tag = `${language}-${query.tag}`
    }
    filter = `tag:${tag}+status:[published,sent]`
  }

  const fields = 'id,slug,title,updated_at,excerpt,visibility,feature_image,status,reading_time,custom_excerpt,updated_at,published_at,html,lexical';
  const include = 'tags,authors';
  const order = 'published_at desc';

  // ghost 使用 NQL 查询，暂时不支持 like
  // https://ghost.org/docs/content-api/#filtering
  if (query.search) {
    const page = (query.page || 1) as number;
    const posts = await ghostApi.posts.browse({
      page: 1,
      limit: 'all',
      order,
      filter: filter,
      fields,
      include
    });
    const searchText = query.search!.toString().toLowerCase()
    const searchPosts = posts.posts.filter((post: any) => {
      return post.title?.toLowerCase().includes(searchText) || 
        (post.custom_excerpt || post.excerpt)?.toLowerCase().includes(searchText) ||
        post.lexical.includes(query.search)
    })
    // console.log('发起搜索，搜索到：' + searchPosts.length + '条')
    posts.posts = searchPosts.slice((page - 1) * DEFAULT_BLOG_POST_LIMIT, page * DEFAULT_BLOG_POST_LIMIT)
    posts.meta.pagination.page = Number(page);
    posts.meta.pagination.limit = DEFAULT_BLOG_POST_LIMIT;
    posts.meta.pagination.pages = Math.ceil(searchPosts.length / DEFAULT_BLOG_POST_LIMIT);
    posts.meta.pagination.total = searchPosts.length;
    posts.posts = formatPost(posts.posts, language);
    return posts
  }

  const result = await ghostApi.posts.browse({
    page: query.page || 1,
    limit: query.limit || DEFAULT_BLOG_POST_LIMIT,
    order,
    filter: filter,
    fields,
    include
  });
  result.posts = formatPost(result.posts, language);
  // result.posts = [];
  return result;
});
