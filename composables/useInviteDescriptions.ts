/**
 * Invite 功能区块文案：按语言挑选 i18n key，用 $t 翻译后过滤空值与键名回退
 */
export function useInviteDescriptions() {
  const { $t, isZh } = useRxI18n()

  /** 翻译并过滤无效段落（空字符串 postTranslation 会回退为 key 名） */
  function pickDescriptions(...keys: string[]) {
    return keys
      .map(key => $t(key))
      .filter((text) => {
        const trimmed = String(text).trim()
        return trimmed.length > 0 && !/^invite\./.test(trimmed)
      })
  }

  /** 中文有第三段，英文/俄文仅两段 */
  function getSocialDescriptions() {
    const keys = ['invite.featureSocial1', 'invite.featureSocial2']
    if (isZh.value)
      keys.push('invite.featureSocial3')
    return pickDescriptions(...keys)
  }

  function getEcommerceDescriptions() {
    const keys = ['invite.featureEcommerceSubtitle', 'invite.featureEcommerce1']
    if (isZh.value)
      keys.push('invite.featureEcommerce2')
    return pickDescriptions(...keys)
  }

  function getAdsDescriptions() {
    const keys = ['invite.featureAdsSubtitle', 'invite.featureAds1']
    if (isZh.value)
      keys.push('invite.featureAds2')
    return pickDescriptions(...keys)
  }

  function getScrapingDescriptions() {
    const keys = ['invite.featureScraping1', 'invite.featureScraping2']
    if (isZh.value)
      keys.push('invite.featureScraping3')
    return pickDescriptions(...keys)
  }

  return {
    pickDescriptions,
    getSocialDescriptions,
    getEcommerceDescriptions,
    getAdsDescriptions,
    getScrapingDescriptions,
  }
}
