export default defineI18nConfig(() => {
  return {
    // vue-i18n options
    postTranslation: (str, key) => {
      // str = 翻译结果
      // key = 翻译 key
      // 如果翻译结果为空字符串，返回 key 本身
      if (!str || (typeof str === 'string' && str.trim() === '')) {
        return key
      }
      return str
    },
    // 当找不到翻译时返回 key
    // missing: (locale, key) => {
    //   return key
    // },
    // 忽略缺失翻译 key 的警告
    silentTranslationWarn: true,
    // 忽略回退警告
    silentFallbackWarn: true,
    // 缺失 key 时的处理
    missingWarn: false,
    fallbackWarn: false,
    // 设置为 false 来完全禁用警告
    warnHtmlMessage: false,
  }
})
