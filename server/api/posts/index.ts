// server/api/posts.ts
import { defineEventHandler } from 'h3'
import { ghostApi } from '~/server/utils/api'
import { DEFAULT_BLOG_POST_LIMIT } from '~/constants'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const headers = event.node.req.headers;
  const language = headers['language'];
  let filter = `tag:${language}+status:[published,sent]`;
  if (query.tag) {
    filter += `+tag:${query.tag}`;
  }

  const fields = 'id,slug,title,updated_at,excerpt,visibility,feature_image,status,reading_time,custom_excerpt,updated_at,published_at,html';
  const include = 'tags';
  const order = 'published_at,desc';

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

    const searchPosts = posts.posts.filter((post: any) => post.title.includes(query.search))
    posts.posts = searchPosts.slice((page - 1) * DEFAULT_BLOG_POST_LIMIT, page * DEFAULT_BLOG_POST_LIMIT)
    posts.meta.pagination.page = Number(page);
    posts.meta.pagination.limit = DEFAULT_BLOG_POST_LIMIT;
    posts.meta.pagination.pages = Math.ceil(searchPosts.length / DEFAULT_BLOG_POST_LIMIT);

    return posts;
  }

  const result = await ghostApi.posts.browse({
    page: query.page || 1,
    limit: query.limit || DEFAULT_BLOG_POST_LIMIT,
    order,
    filter: filter,
    fields,
    include
  });
  return result;
});
