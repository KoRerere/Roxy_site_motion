<script setup lang="ts">
const INVITE_OAUTH_CALLBACK_CHANNEL = 'invite-oauth-callback'
const { public: { isChinaSite } } = useRuntimeConfig()

// 国内站 OAuth 回调页：工具页，不参与索引
if (isChinaSite) { useSeoMeta({ robots: 'noindex, nofollow' }) }

definePageMeta({
  layout: 'basic',
})

useInviteCanonicalHead()

function notifyInvitePage() {
  if (!import.meta.client)
    return

  const searchParams = new URLSearchParams(window.location.search)
  const source = searchParams.get('source') || ''
  const code = searchParams.get('code') || ''
  const payload = {
    type: INVITE_OAUTH_CALLBACK_CHANNEL,
    source,
    code,
    search: window.location.search,
  }

  window.opener?.postMessage(payload, window.location.origin)

  const channel = new BroadcastChannel(INVITE_OAUTH_CALLBACK_CHANNEL)
  channel.postMessage(payload)
  channel.close()

  window.setTimeout(() => {
    window.close()
  }, 300)
}

onMounted(notifyInvitePage)
</script>

<template>
  <main class="min-h-screen flex items-center justify-center bg-[#F9F9FB] px-4 text-center">
    <section class="max-w-[420px] rounded-[16px] bg-white px-8 py-10 shadow-[0_12px_32px_rgba(17,18,19,0.08)]">
      <div class="mx-auto mb-4 h-[48px] w-[48px] rounded-full bg-[#1DC94D] text-white flex items-center justify-center" aria-hidden="true">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
          <path d="M20 6L9 17L4 12" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" />
        </svg>
      </div>
      <h1 class="m-0 text-[22px] leading-[30px] font-700 text-[#111213]">
        {{ $t('授权成功') }}
      </h1>
      <p class="mt-2 mb-0 text-[14px] leading-[22px] text-[#575D60]">
        {{ $t('正在返回登录页面') }}
      </p>
    </section>
  </main>
</template>
