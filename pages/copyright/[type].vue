<script setup>
const { $t, locale } = useRxI18n()
const route = useRoute()

const solutionMap = {
  user: {
    title: $t('用户协议'),
    description: $t('阅读 RoxyBrowser 用户协议来了解我们的服务条款、用户责任以及关于使用这款指纹浏览器的法律信息。'),
  },
  privacy: {
    title: $t('隐私政策'),
    description: $t('RoxyBrowser 尊重用户隐私。阅读 RoxyBrowser 隐私政策来了解我们如何保护用户个人信息。'),
  },
  refund: {
    title: $t('退款协议'),
    description: $t('阅读 RoxyBrowser 退款政策来了解相关的取消和退货条款，包括退款资格、时间限制以及如何提交退款申请。'),
  },
  renewal: {
    title: $t('自动续费服务协议'),
    description: $t('本页旨在让你清楚 RoxyBrowser 的续订流程。你可以了解订阅管理、自动续费以及服务保障等信息。'),
  },
  cookie: {
    title: $t('Cookie 政策'),
    description: $t('阅读 RoxyBrowser Cookie 政策来了解我们如何使用 Cookie 和类似技术，以及您控制我们使用这些技术的权利。'),
  },
}

// 类型映射：路由参数类型 -> 组件文件名类型
const typeMap = {
  'user': 'user',
  'privacy': 'privacy',
  'refund': 'refund',
  'renewal': 'renewal',
  'cookie-policy': 'cookie',
}

const solutions = computed(() => solutionMap[typeMap[route.params.type]] || solutionMap.user)

// 动态加载组件
const current = shallowRef(null)

function loadComponent() {
  const type = String(route.params.type || 'user')
  const componentType = typeMap[type] || 'user'

  const lang = locale.value || 'en'

  current.value = defineAsyncComponent(() =>
    import(`~/components/copyright/${lang}-${componentType}.vue`),
  )
}

// 监听路由参数和语言变化，重新加载组件
watch([() => route.params.type, locale], () => {
  loadComponent()
}, { immediate: true })

useSeoMeta({
  title: solutions.value.title,
  description: solutions.value.description,
})
</script>

<template>
  <div class="copyright mx-auto mt-130px pb-15 w-850px ru-RU:font-[Inter] max-md:px-10 max-sm:px-6 max-xl:px-15 max-xl:w-full">
    <h1 class="text-6 font-600 multilingual-text my-4">
      {{ solutions.title }}
    </h1>
    <component
      :is="current"
      v-if="current"
      class="copyright-content"
    />
  </div>
</template>

<style scoped>
:deep(.copyright-content) {
  line-height: 27px;
}

:deep(.copyright-content h2),
:deep(.copyright-content h3),
:deep(.copyright-content p) {
  font-size: var(--body-second);
  margin-bottom: 10px;
}

:deep(.copyright-content h2) {
  font-size: var(--H2);
}

:deep(.copyright-content h2) {
  font-size: var(--H3);
  font-weight: 600;
  margin-top: 5px;
}

:deep(.copyright-content ol),
:deep(.copyright-content ul) {
  list-style: revert;
  padding: revert;
  margin: revert;
}

:deep(.copyright-content table) {
  width: 100%;
  border-collapse: collapse;
  margin-top: 16px;
  margin-bottom: 24px;
}

:deep(.copyright-content th),
:deep(.copyright-content td) {
  padding: 8px 12px;
  border: 1px solid #e5e7eb;
}

:deep(.copyright-content th) {
  background-color: #f9fafb;
}

:deep(.copyright-content tr:nth-child(even)) {
  background-color: #f9fafb;
}

:deep(.copyright-content a) {
  color: var(--colors-text-text-link, #11a3fd);
  text-decoration: underline;
}
</style>
