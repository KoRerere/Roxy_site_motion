export default defineI18nConfig(() => {
  return {
    // vue-i18n options
    postTranslation: (str, key) => {
    //   console.log('生效了吗', str, key)
      // str = 翻译结果
      // key = 翻译 key
      return str
    },
  }
})
