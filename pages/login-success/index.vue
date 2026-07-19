<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
import { useOpenRoxyBrowser } from '~/components/the-header/config'

const { public: { isChinaSite } } = useRuntimeConfig()

// 国内站登录成功中转页：不参与索引（即使用户被 middleware 重定向，SSR 仍可能输出 head）
if (isChinaSite) { useSeoMeta({ robots: 'noindex, nofollow' }) }

definePageMeta({
  middleware: () => {
    const localePath = useLocalePath()

    return navigateTo(localePath('/'), { replace: true })
  },
})

const router = useRouter()
const route = useRoute()
const { openRoxyBrowser } = useOpenRoxyBrowser()
const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

if (import.meta.client) {
  const searchParams = new URLSearchParams(location.search)
  if (searchParams.has('login-from-app')) {
    sessionStorage.setItem('login-from-app', 'true')
    // 去掉所有 query
    router.replace({
      path: route.path,
    })
  }
  else if (!sessionStorage.getItem('login-from-app')) {
    openRoxyBrowser('_self')
  }
}
</script>

<template>
  <div class="flex h-screen items-center justify-center relative">
    <div
      class="bg-[length:150%] bg-[url('/login-success/bg.svg')] h-300px inset-0 absolute z-10 bg-center-bottom"
    />
    <!-- White content card -->
    <div class="bg-white flex flex-col gap-6 items-center justify-center relative z-1">
      <!-- Content -->
      <div class="px-5 flex flex-col gap-[14px] w-full items-center">
        <img src="/rx_ic_check_fill.svg" alt="Success" class="h-[60px] w-[60px]">
        <div class="text-[#111213] text-center flex flex-col gap-[6px] items-center">
          <p class="text-[20px] leading-[28px] font-[Archivo] font-medium">
            {{ $t('登录成功') }}
          </p>
          <p class="text-[14px] leading-[20px] font-[Inter]">
            {{ $t('请至 PC 端体验更多功能。') }}
          </p>
        </div>
      </div>

      <!-- View Details button -->
      <NuxtLinkLocale
        to="/download"
        class="px-6 py-2 rounded-[8px] no-underline flex gap-[10px] h-[48px] items-center"
        style="background: linear-gradient(120.14deg, #238AFF 67.782%, #F9B3B4 107.9%);"
        @click.capture="redirectMobileDownloadToLogin"
      >
        <span class="text-[16px] text-white leading-[24px] font-[Inter] font-medium">
          {{ $t('查看详情') }}
        </span>
        <RxIcon name="base/rx_ic_right" size="24" color="#FFF" />
      </NuxtLinkLocale>
    </div>
  </div>
</template>
