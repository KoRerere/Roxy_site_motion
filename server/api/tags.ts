import { ghostApi, langTags } from '../utils/api'

export default defineEventHandler(async (event) => {
  const headers = event.node.req.headers;
  const language = headers['language'];
  const result = await ghostApi.tags.browse({
    page: 1,
    limit: 100,
    filter: 'visibility:public'
  });
  return result
    .tags
    .filter((item: any) => !langTags.includes(item.name))
    .filter((item: any) => item.description.includes(`{${language}}`));
});