import type { Agent } from '@fingerprintjs/fingerprintjs'
import type { Emitter } from 'mitt'

export interface EventBusEvents {
  topUpHeroContentVisible: boolean
  pageHomeHeroVisible: boolean
  headerReached: boolean
  backTopReached: boolean
}

declare module '#app' {
  interface NuxtApp {
    $fpPromise: Promise<Agent>
    $eventBus: Emitter<EventBusEvents>
  }
}

declare module 'vue' {
  interface ComponentCustomProperties {
    $fpPromise: Promise<Agent>
    $eventBus: Emitter<EventBusEvents>
  }
}

// 为 globalThis 添加 $t 类型定义
declare global {

  var $t: (key: string, params?: any) => string
}

export {}
