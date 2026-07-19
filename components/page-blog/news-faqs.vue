<script setup lang="ts">
import FaqAccordion from '~/components/faq-accordion.vue'

const faqList = computed(() => [
  {
    title: $t('本次限时推广活动的参与条件是什么？'),
    desc: $t(`<span class="font-bold">所有 RoxyBrowser 注册用户在活动期内均可参与。</span>
只需要打开 app 登录账户，点击左侧菜单的"推广计划"并获取个人推荐链接，即可开始进行推广并赢取限时奖励。`),
  },
  {
    title: $t('限时奖励和推广规则变更的有效期是多久？'),
    desc: $t(`限时 5 美元奖励活动有效期为：<span class="font-bold">2025 年 9 月 26 日至 10 月 26 日（UTC 时间）</span>，此限时奖励需在活动期内达成相应条件，方可生效发放。
基于付费订阅用户数量的新链接解锁规则将<span class="font-bold">自活动开始后永久生效。</span>。`),
  },
  {
    title: $t('如何定义"付费订阅用户"？'),
    desc: $t(`“付费订阅用户”仅指<span class="font-bold">购买 RoxyBrowser 30 天及以上有效期套餐的新用户，套餐类型不限。</span>
应用内代理 IP、团队或团队成员购买<span class="font-bold">不计入</span>本次限时奖励资格与高级链接解锁条件，但仍可产生常规佣金。`),
  },
  {
    title: $t('推广奖励将在什么时候发放？'),
    desc: $t(`所有限时奖金与佣金将在审核期（通常为 7 天）后发放到推广余额。
你可在“推广计划”中查看全部收益记录与收益审核状态。`),
  },
  {
    title: $t('为什么更高级别的链接佣金更低？'),
    desc: $t(`更高级的链接能为新用户提供更高折扣，有利于更大规模的推广，进一步<span class="font-bold">提升总体收益</span>。
我们设定了不同等级的链接为你提供差异化的佣金与折扣组合，且<span class="font-bold">所有链接均可同时使用</span>，你可以根据自己的目标自由制定最适合的推广策略。`),
  },
  {
    title: $t('推广期间还有什么注意事项？'),
    desc: $t(`若我们发现存在恶意刷单、重复注册或欺诈性推广等违规情况，你的活动参与资格及相应奖励将被取消；所有奖励金额将以后台最终结算数据为准。
RoxyBrowser 保留对本次活动的最终解释权。`),
  },
])
</script>

<template>
  <FaqAccordion :fqa-list="faqList" class="fqa-container py-2 func-faq" />
</template>
