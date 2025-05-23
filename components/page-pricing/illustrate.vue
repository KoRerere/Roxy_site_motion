<script setup lang="ts">
import { tierCalculate, tierList, SubLevelEnum } from './configs'
import currency from "currency.js";

const { $t } = useRxI18n();

interface Plan {
  subLevel: string;
  minWindows: number;
  maxWindows: number;
  windowPrice: number;
  disabled?: boolean;
}

const SubLevelEnumStr = {
  get [SubLevelEnum.Free]() {
    return $t("免费");
  },
  get [SubLevelEnum.Expired]() {
    return $t("已过期");
  },
  get [SubLevelEnum.Trial]() {
    return $t("7天试用");
  },
  get [SubLevelEnum.Basic]() {
    return $t("基础版");
  },
  get [SubLevelEnum.Pro]() {
    return $t("专业版");
  },
  get [SubLevelEnum.Business]() {
    return $t("商业版");
  },
  get [SubLevelEnum.Enterprise]() {
    return $t("企业版");
  },
};

interface Column {
  key: string;
  title: string;
  render?: (item: Plan) => any;
}

const SAMPLE = 100;

const columns: Column[] = [
  { key: "subLevel", title: $t("套餐") },
  {
    key: "windows",
    title: $t("窗口数量"),
    render: (item: Plan) =>
      item.minWindows >= 50000 ? "> 50000" : `${item.minWindows + 1} - ${item.maxWindows}`,
  },
  {
    key: "price",
    title: $t("区间单价"),
    render: (item: Plan) => currency(item.windowPrice).format(),
  },
];

const list = computed(() =>
  Object.values(
    (tierList || []).reduce(
      (acc, item) => {
        acc[item.subLevel] ??= { title: SubLevelEnumStr[item.subLevel as SubLevelEnum], items: [] };
        acc[item.subLevel].items.push(item);
        return acc;
      },
      {} as Record<string, { title: string; items: Plan[] }>
    )
  )
);

const tierPrice = computed(() => tierCalculate(SAMPLE));
</script>

<template>
  <div class="illustrate">
    <div class="flex flex-col gap-3 pa-4 bg-white rounded-md">
      <div>
        <div class="illustrate-title">{{ $t("窗口价格") }}</div>
        <div class="mt-2 illustrate-desc">
          {{ $t("窗口总价将通过各个区间的 数量×对应单价 进行累加计算") }}
        </div>
      </div>
      <div class="flex flex-col border-0.5 border-solid border-[#C7CDD1] rounded-md overflow-hidden">
        <div class="flex">
          <div
            class="flex-1 py-2 text-center bg-[#FAFBFC] cell-th"
            v-for="col in columns"
            :key="col.key"
          >
            {{ col.title }}
          </div>
        </div>
        <div
          class="flex border-0 border-t-0.5 border-solid border-[#C7CDD1]"
          v-for="item in list"
          :key="item.title"
        >
          <div
            class="flex justify-center items-center w-1/3 border-0 border-r-0.5 border-solid border-[#C7CDD1] cell-th"
          >
            {{ item.title }}
          </div>
          <div class="flex-auto">
            <div
              class="flex gap-3 py-2 px-3 border-0 first-of-type:border-t-0 border-t-0.5 border-solid border-[#C7CDD1]"
              v-for="(it, idx) in item.items"
              :key="idx"
            >
              <div class="flex-1 text-center cell-td">{{ columns[1].render?.(it) }}</div>
              <div class="flex-1 color-[#FC9D12] text-center cell-td">
                {{ columns[2].render?.(it) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="illustrate-example">
        {{
          $t("例: {count} 个窗口总价为 {algorithm}", {
            count: SAMPLE,
            algorithm: tierPrice.algorithm,
          })
        }}
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.illustrate {
  padding: 2px;
  border-radius: 0.5rem;
  overflow: hidden;
  background: linear-gradient(180deg, #E2A1FA, #12A3FC);
  box-shadow: 0px 3px 8px 0px rgba(0, 0, 0, 0.07), 0px 2px 5px 0px rgba(0, 0, 0, 0.07), 0px 1px 1px 0px rgba(0, 0, 0, 0.07);

  &-title {
    color: var(--Colors-Text-text-primary, #171c1f);
    
    font-size: 16px;
    font-weight: 600;
    line-height: 16px;
  }

  &-desc {
    color: var(--Colors-Text-text-secondary, #575d61);
    
    font-size: 12px;
    line-height: 20px;
  }

  &-example {
    color: var(--Colors-Text-text-secondary, #575d61);
    
    font-size: 12px;
    line-height: 20px;
    white-space: pre-wrap;
  }
}

:where(.cell-th) {
  color: #000;
  
  font-size: 12px;
  font-weight: 600;
  line-height: 16px;
}

:where(.cell-td) {
  color: var(--Colors-Text-text-primary, #171c1f);
  
  font-size: 12px;
  font-weight: 500;
  line-height: var(--Line-Height-text-lg, 20px);
}
</style>