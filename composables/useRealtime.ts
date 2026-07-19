import { backendMap } from '@/constants/langs'

export function useRealtime() {
  const { public: { roxyHomeUrl, ENV } } = useRuntimeConfig()
  const { locale } = useRxI18n()
  const defaultValue = {
    apiCount: 0,
    winCount: 0,
    userCount: 0,
    latestAccessFrom: '',
  }
  const realtime = reactive(Object.assign({ ...defaultValue }, getLocalStorage('realtime', defaultValue)))

  async function request() {
    try {
      const result = await fetch(`${roxyHomeUrl}/app_statistics/get_official_website_other_data_config`, {
        headers: {
          language: backendMap[locale.value],
        },
      })
      if (result.ok) {
        const data = await result.json()
        if (data.code === 0 && data.data) {
          realtime.apiCount = data.data?.apiCount
          realtime.winCount = data.data?.winCount
          realtime.latestAccessFrom = data.data?.latestAccessFrom
          realtime.userCount = data.data?.userCount || 4020781
          setLocalStorage('realtime', realtime)
        }
      }
    }
    catch (error) {
      // 出错不用管了
    }
  }

  watch(locale, () => {
    request()
  })

  onMounted(() => {
    request()
    const timer = setInterval(request, ENV === 'production' ? 60000 * 5 : 11000)

    onUnmounted(() => {
      clearInterval(timer)
    })
  })

  return realtime
}
