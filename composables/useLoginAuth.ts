import qs from 'qs'

export const useLoginAuth = () => {
  const { $httpClient } = useNuxtApp()
  const router = useRouter()
  const localePath = useLocalePath()

  const loginAuth = async () => {
    const query = qs.parse(location.search.slice(1), { 
      decoder: (str) => {
        // 保留 `+`，同时处理其他编码字符
        return decodeURIComponent(str.replace(/\+/g, '%2B'))
      },
    })

    const result = await $httpClient.request({
      path: `/check_add_user_by_project_info`,
      method: "POST",
      body: {
        data: query.data
      },
      type: 'application/json',
      format: "json",
    });

    console.log('result', result)

    if (result.code !== 0 || !result.data) {
      router.push(localePath(`/no-auth${location.search}`))
    }
  }

  return loginAuth;
}

