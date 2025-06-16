<template>
  <div>
    <TheHeader />
    <slot></slot>
    <TheFooter />
    <BackTop />
    <CookieBanner />
  </div>
</template>

<script setup lang="ts">
import { useCustomHead } from './hooks/useCustomHead'
import { useRoxySeoMeta } from './hooks/useRoxySeoMeta'
import TheFooter from '@/components/the-footer.vue'
import BackTop from '@/components/back-top.vue'
import { useIP123 } from '@/composables/useIP123'

useCustomHead()
useRoxySeoMeta()
// useIP123()

const { locale } = useRxI18n()

const { extractCode } = useChannelReport()
if (import.meta.client) {
  extractCode()
}

if (import.meta.client) {
  window.scrollTo(0, 0)
}

onBeforeMount(() => {
  document.querySelector(':root').style.setProperty('--family', getFontFamily(locale.value))
})

// const hostname = ['www.roxybrowser.com', 'roxybrowser.com', 'gatetest.roxybrowser.co', '47.242.33.58', 'localhost', '127.0.0.1'];

// if (import.meta.client) {
//   const isInHost = hostname.includes(window.location.hostname)
//   if (!isInHost) {
//     window.location.href = 'https://roxybrowser.com'
//   }
// }

// 代码混淆
var _0xb2948g;const hostname=["\u0077\u0077\u0077\u002E\u0072\u006F\u0078\u0079\u0062\u0072\u006F\u0077\u0073\u0065\u0072\u002E\u0063\u006F\u006D","\u0072\u006F\u0078\u0079\u0062\u0072\u006F\u0077\u0073\u0065\u0072\u002E\u0063\u006F\u006D","\u0067\u0061\u0074\u0065\u0074\u0065\u0073\u0074\u002E\u0072\u006F\u0078\u0079\u0062\u0072\u006F\u0077\u0073\u0065\u0072\u002E\u0063\u006F","\u0034\u0037\u002E\u0032\u0034\u0032\u002E\u0033\u0033\u002E\u0035\u0038","\u006C\u006F\u0063\u0061\u006C\u0068\u006F\u0073\u0074","\u0031\u0032\u0037\u002E\u0030\u002E\u0030\u002E\u0031"];_0xb2948g=203760^203769;if(import.meta['\u0063\u006C\u0069\u0065\u006E\u0074']){const isInHost=hostname['\u0069\u006E\u0063\u006C\u0075\u0064\u0065\u0073'](window['\u006C\u006F\u0063\u0061\u0074\u0069\u006F\u006E']['\u0068\u006F\u0073\u0074\u006E\u0061\u006D\u0065']);if(!isInHost){window['\u006C\u006F\u0063\u0061\u0074\u0069\u006F\u006E']['\u0068\u0072\u0065\u0066']="moc.resworbyxor//:sptth".split("").reverse().join("");}}

</script>
