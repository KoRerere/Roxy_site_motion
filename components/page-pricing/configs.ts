import currency from 'currency.js';
import { useRxI18n } from '@/composables/useRxI18n'

export const getPackagePrice = () => {
  const { $t } = useRxI18n()

  return [
    {
      "name": $t("免费版"),
      "buttonText": $t("免费体验"),
      "id": "free",
      "price": "0.00",
      min: 0,
      max: 5,
      children: [],
    },
    {
      "name": $t("基础版"),
      "buttonText": $t("获取基础版"),
      "id": "basic",
      "price": "0.20",
      min: 10,
      max: 100,
      children: [
        '窗口投送',
        '窗口模板',
        '窗口导出',
        '项目数量',
        '操作日志',
      ]
    },
    {
      "name": $t("专业版"),
      "buttonText": $t("获取专业版"),
      "id": "pro",
      "price": "0.12",
      min: 100,
      max: 1000,
      children: [
        '窗口投送',
        '窗口模板',
        '窗口导出',
        '项目数量',
        '操作日志',
      ]
    },
    {
      "name": $t("商业版"),
      "buttonText": $t("获取商业版"),
      "id": "business",
      "price": "0.08",
      min: 1000,
      max: 10000,
      children: [
        '窗口投送',
        '窗口模板',
        '窗口导出',
        '项目数量',
        '操作日志',
      ]
    },
    {
      "name": $t("企业版"),
      "buttonText": $t("获取企业版"),
      "id": "enterprise",
      "price": "0.03",
      min: 10000,
      max: 100000,
      children: [
        '窗口投送',
        '窗口模板',
        '窗口导出',
        '项目数量',
        '操作日志',
      ]
    }
  ]
}

export const profileMarks = [0, 10, 50, 100, 500, 1000, 5000, 10000, 50000, 100000];
export const profileSteps = {
  0: 10, 10: 40, 50: 50, 100: 100,
  500: 100, 1000: 100, 5000: 100,
  10000: 100, 50000: 100, 100000: 100
}

export const markFormatter = (mark: number) => {
  return mark >= 1000 ? `${(mark / 1000).toFixed(1)}k` : mark
}

/**
 * 寅豪提供的计算公式
 */
export enum SubLevelEnum {
  Free = "Free",
  Expired = "Expired",
  Trial = "Trial",
  Basic = "Basic",
  Pro = "Pro",
  Business = "Business",
  Enterprise = "Enterprise",
}

export const tierList = [
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
  }
]

export function tierCalculate(count: number) {
  const list = tierList;
  if (!list?.length || !count || count < 1) {
    return { value: 0, algorithm: "" };
  }

  const { sum, algorithm } = list.reduceRight(
    (acc, { windowPrice, minWindows }) => {
      if (count < minWindows) return acc;

      const tiersCount = currency(count).subtract(minWindows).value;

      if (tiersCount !== 0) {
        acc.algorithm.unshift(`${minWindows === 0 ? count : `(${count} - ${minWindows})`} × $${windowPrice.toFixed(2)}`)
      }

      count = minWindows;
      acc.sum = currency(tiersCount, { precision: 6 }).multiply(windowPrice).add(acc.sum).value;
      return acc;
    },
    { sum: 0, algorithm: [] } as { sum: number; algorithm: string[] },
  );

  return { value: sum, algorithm: algorithm.join(" + ") + ` = $${sum}` };
}

export function discountCalculate(discounts: number[]) {
  return discounts.reduce((acc, discount) =>
    Math.abs(currency(Number.isNaN(discount) ? 0 : discount, { precision: 6 })
      .divide(100)
      .add(-1)
      .multiply(acc).value), 1);
}

export const usePricing = () => {
  const profile = ref(10);
  const ratioValue = ref(30);
  const sliderRatio = [30, 90, 180, 360];
  const sliderRatioValue = [0, 15, 25, 40]

  const currPrice = computed(() => {
    const tier = tierCalculate(profile.value)
    const idx = sliderRatio.findIndex(v => ratioValue.value === v)
    return tier.value * discountCalculate([sliderRatioValue[idx]]) * (ratioValue.value / 30)
  })

  const originPrice = computed(() => {
    const tier = tierCalculate(profile.value)
    return tier.value * (ratioValue.value / 30)
  })

  // 优惠了多少
  const save = computed(() => {
    return Math.abs(currency(originPrice.value).subtract(currPrice.value).value)
  })

  const packages = computed(() => getPackagePrice())

  const activePackage = computed({
    get() {
      return packages.value.find(item => item.min < profile.value && item.max >= profile.value) || packages.value[1]
    },
    set(packageItem: any) {
      profile.value = packageItem.max;
    }
  })

  return {
    ratioValue,
    profile,
    currPrice,
    save,
    activePackage,
    packages,
    originPrice
  }
}