import { lang } from '@/store'

// 给全局的接口添加语言（在切换语言时，后端的接口提示也可以跟随前端系统切换）
export default defineNuxtPlugin(nuxtApp => {
  // called right before setting a new locale
  nuxtApp.hook('i18n:beforeLocaleSwitch', ({ oldLocale, newLocale, initialSetup, context }) => {
    // lang.value = newLocale
  })
})