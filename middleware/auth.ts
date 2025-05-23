import { useNuxtApp } from '#app'
import qs from 'qs'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // const { $httpClient } = useNuxtApp()
  // const data = to.fullPath.split('?')[1];
  // const query = qs.parse(data, { 
  //   decoder: (str: string) => {
  //     // 保留 `+`，同时处理其他编码字符
  //     return decodeURIComponent(str.replace(/\+/g, '%2B'))
  //   },
  // })

  // const result = await $httpClient.request({
  //   path: `/check_add_user_by_project_info`,
  //   method: "POST",
  //   body: {
  //     data: query.data
  //   },
  //   type: 'application/json',
  //   format: "json",
  // });

  // console.log('result', result)

  // if (result.code !== 0 || !result.data) {
  //   return navigateTo({
  //     path: '/no-auth',
  //     query: query
  //   })
  // }
}) 