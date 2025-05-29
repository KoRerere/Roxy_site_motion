

export const useChannelReport = () => {
  const { public: { roxyHomeUrl } } = useRuntimeConfig()
  const route = useRoute()

  // 上报渠道来源
  async function checkReferrer() {
    if (!document.referrer && document.referrer.includes('roxybrowser')) return
    const value = document.referrer
    const cookieValue = getRoxyCookie(value);
    if (!cookieValue && !!value.trim()) {
      await fetch(`${roxyHomeUrl}/app_statistics/save_channel_sources_people?channelSource=${value}`)
      setRoxyCookie(value, value, 24);
    }
  }

  // 通过邀请链接进入
  async function checkLinkCode() {
    const urlParams = new URLSearchParams(window.location.search);
    const code = route.params.val ?? urlParams.get('code')
    const name = `Splcc_${code}`

    if (code && !getRoxyCookie(name)) {
      await fetch(`${roxyHomeUrl}/app_statistics/save_promotion_link_click_count?code=${code}`)
      setRoxyCookie(name, name, 24)
    }
  }

  function extractCode() {
    const url = new URL(window.location.href)
    const roxy_partner = url.searchParams.get("roxy_partner")
    if (roxy_partner) {
      sessionStorage.setItem("roxy_partner", roxy_partner)
    }
    const code = (route.params.val ?? url.searchParams.get("code")) as string
    if (code) {
      sessionStorage.setItem("code", code)
    }
  }

  return {
    checkReferrer,
    checkLinkCode,
    extractCode
  }
}
