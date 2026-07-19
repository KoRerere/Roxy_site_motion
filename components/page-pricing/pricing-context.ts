import type { Component } from 'vue'

const key = Symbol('pricingContext')

interface PricingContext {
  // 当前选中了多少个创建
  profile: Ref<number>
  // 当前选中了购买多少个月的套餐
  time: Ref<number>
  // 套餐时间选项
  timeOptions: {
    label: string
    value: number
    discount: number
    discountIcon?: string
  }[]
  // 折扣后价格
  discountedPrice: ComputedRef<number>
  // 原价
  originalPrice: ComputedRef<number>
  // 节省价格
  savePrice: ComputedRef<number>
  // 折扣详情
  discountDetails: ComputedRef<{
    label: string
    value: number
    labelClass?: string
    valueClass?: string
    component?: Component
    hide?: boolean
  }[]>
  totalDiscount: ComputedRef<number>
}

export function createPricingContext(instance: PricingContext) {
  provideLocal(key, instance)
}

export function usePricingContext() {
  return injectLocal(key, {}) as PricingContext
}
