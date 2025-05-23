import mitt from 'mitt'

const eventBus = mitt()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('eventBus', eventBus)
})
