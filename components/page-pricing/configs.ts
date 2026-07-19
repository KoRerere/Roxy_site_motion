import currency from 'currency.js'

export const profileMarks = [0, 5, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000]
export const profileSteps = {
  0: 5,
  5: 5,
  10: 40,
  50: 50,
  100: 100,
  500: 100,
  1000: 100,
  5000: 100,
  10000: 100,
  50000: 100,
  100000: 100,
}

export function markFormatter(mark: number) {
  return mark >= 1000 ? `${(mark / 1000).toFixed(0)}k` : mark
}

export function popupFormatter(mark: number) {
  const __mark = mark >= 1000 ? `${(mark / 1000).toFixed(1)}k` : mark
  return $t('{num} 个窗口', { num: __mark })
}

/**
 * 寅豪提供的计算公式
 */
export enum SubLevelEnum {
  Free = 'Free',
  Expired = 'Expired',
  Trial = 'Trial',
  Basic = 'Basic',
  Pro = 'Pro',
  Business = 'Business',
  Enterprise = 'Enterprise',
}

export const tierList = [
  {
    windowPrice: 0.80,
    minWindows: 0,
    maxWindows: 5,
    subLevel: SubLevelEnum.Free,
  },
  {
    windowPrice: 0.80,
    minWindows: 0,
    maxWindows: 10,
    subLevel: SubLevelEnum.Basic,
  },
  {
    windowPrice: 0.25,
    minWindows: 10,
    maxWindows: 50,
    subLevel: SubLevelEnum.Basic,
  },
  {
    windowPrice: 0.2,
    minWindows: 50,
    maxWindows: 100,
    subLevel: SubLevelEnum.Basic,
  },
  {
    windowPrice: 0.15,
    minWindows: 100,
    maxWindows: 500,
    subLevel: SubLevelEnum.Pro,
  },
  {
    windowPrice: 0.12,
    minWindows: 500,
    maxWindows: 1000,
    subLevel: SubLevelEnum.Pro,
  },
  {
    windowPrice: 0.10,
    minWindows: 1000,
    maxWindows: 5000,
    subLevel: SubLevelEnum.Business,
  },
  {
    windowPrice: 0.08,
    minWindows: 5000,
    maxWindows: 10000,
    subLevel: SubLevelEnum.Business,
  },
  {
    windowPrice: 0.05,
    minWindows: 10000,
    maxWindows: 50000,
    subLevel: SubLevelEnum.Enterprise,
  },
  {
    windowPrice: 0.03,
    minWindows: 50000,
    maxWindows: 100000,
    subLevel: SubLevelEnum.Enterprise,
  },
]

export function tierCalculate(count: number) {
  const list = tierList
  if (!list?.length || !count || count < 1) {
    return { value: 0, algorithm: '' }
  }

  const { sum, algorithm } = list.reduceRight(
    (acc, { windowPrice, minWindows }) => {
      if (count < minWindows)
        return acc

      const tiersCount = currency(count).subtract(minWindows).value

      if (tiersCount !== 0) {
        acc.algorithm.unshift(`${minWindows === 0 ? count : `(${count} - ${minWindows})`} × $${windowPrice.toFixed(2)}`)
      }

      count = minWindows
      acc.sum = currency(tiersCount, { precision: 6 }).multiply(windowPrice).add(acc.sum).value
      return acc
    },
    { sum: 0, algorithm: [] } as { sum: number, algorithm: string[] },
  )

  return { value: sum, algorithm: `${algorithm.join(' + ')} = $${sum}` }
}

export function discountCalculate(discounts: number[]) {
  return discounts.reduce((acc, discount) =>
    Math.abs(currency(Number.isNaN(discount) ? 0 : discount, { precision: 6 })
      .divide(100)
      .add(-1)
      .multiply(acc).value), 1)
}
