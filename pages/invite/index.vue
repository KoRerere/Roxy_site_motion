<!-- <script setup>
import Joined from '@/components/page-invite/joined.vue'
import JoinWorkspace from '@/components/page-invite/join-workspace.vue'
import qs from 'qs'

const loginAuth = useLoginAuth()

const { $API } = useNuxtApp()

definePageMeta({
  layout: 'basic',
  // middleware: 'auth'
})

const router = useRouter()
const localePath = useLocalePath()

const inviteData = ref({
  data: '',
  workspaceName: '',
})
const isAccept = ref(false)

if (import.meta.client) {
  await loginAuth()

  // 没登录就跳转登录页去登录
  const { code, data } = await $API.base.userGetUserInfoList()
  if ( code !== 0) {
    router.push(localePath(`/login${location.search}`)) 
  }

  inviteData.value = qs.parse(location.search.slice(1), { 
    decoder: (str) => {
      // 保留 `+`，同时处理其他编码字符
      return decodeURIComponent(str.replace(/\+/g, '%2B'))
    },
  })
}

function onInviteSuccess() {
  isAccept.value = true
}
</script>

<template>
  <LoginLayout>
    <Joined v-if="isAccept" />
    <JoinWorkspace v-else :workspace-info="inviteData" @success="onInviteSuccess" />
  </LoginLayout>
</template>

<style lang="scss" scoped>
.invite-container {
  position: relative;
  height: 100vh;
  overflow: hidden;
  z-index: 1;
}

.language {
  position: absolute;
  top: 24px;
  right: 0;
  display: flex;
  gap: 10px;
}

.logo {
  width: 64px;
  height: 64px;
}

.title {
  color: #000;
  font-family: Archivo, var(--family, var(--zhFamily));
  font-size: 24px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px;
  text-align: center;
}

.description {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-xl, 24px);
  text-align: center;
}



.footer {
  position: fixed;
  left: 50%;
  bottom: 30px;
  transform: translate(-50%);
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
  text-align: center;
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-xs, 16px);
  z-index: 1;
}

.animation-background {
  display: flex;
  position: fixed;
  top: 104%;
  left: -100px;
  right: -30px;
  height: 656.408px;
  flex-shrink: 0;
  opacity: 0.6;
  filter: blur(150px);
  transform: rotate(10deg);

  .blue {
    width: 866.302px;
    height: 648.468px;
    flex-shrink: 0;
    border-radius: var(--radius-none, 866.302px);
    background: var(--Color-blue-300, #12a3fc);
    animation: ripple 15s linear infinite;
  }

  .purple {
    width: 617.019px;
    height: 461.868px;
    flex-shrink: 0;
    border-radius: var(--radius-none, 617.019px);
    background: #ca59ff;
    animation: ripple 15s linear infinite;
  }
}

@keyframes ripple {
  0% {
    transform: rotate(0);
  }

  100% {
    transform: rotate(360deg);
  }
}
</style> -->
<template>
  <PageDownload />
</template>