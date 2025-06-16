<!-- <script setup lang="ts">
import { provideLoginContext, type CurrentComp, type LoginCreatePayload } from '@/components/page-login/hooks/useLoginContext'; 
import SignForm from '@/components/page-login/signForm.vue';
import ResetPassword from '@/components/page-login/resetPassword.vue';
import EmailCodeInputOtp from '@/components/page-login/emailCodeInputOtp.vue';
import {useToast} from 'primevue/usetoast';

const { $API } = useNuxtApp()

definePageMeta({
  layout: 'basic',
  // middleware: 'auth'
})

const loginAuth = useLoginAuth()
const toast = useToast()
const { t } = useI18n()
const localePath = useLocalePath()
const route = useRoute()
const router = useRouter()

const currentComp = ref<CurrentComp>('signForm')
const currentCompProps = ref<Recordable>() 
const signFormData = ref<LoginCreatePayload>({
  user_name:'',
  password: '',
})

onMounted(async () => {
  await loginAuth();
  
  const { code, data } = await $API.base.userGetUserInfoList()

  if (code === 0 && route.query.data && route.query.workspaceName) {
    router.push(localePath(`/invite${location.search}`))
  }
  const user_name = localStorage.getItem('user_name')
  const password = localStorage.getItem('password')
  if (user_name) {
    signFormData.value.user_name = user_name
  }
  if (password) {
    signFormData.value.password = atob(password)
  }
})

const time = ref(60)
let timer: NodeJS.Timeout | null = null

const countdown = () => {
  time.value = 60 
  timer && clearInterval(timer)
  timer = setInterval(() => {
    time.value -- 
  }, 1000)
}
function setCurrentComponent(comp: CurrentComp, compProps?: Recordable) {
  currentComp.value = comp
  currentCompProps.value = compProps
  if (comp === 'emailCodeInputOtp') {
    countdown()
  } 
}

async function handleSubmit() {
  signFormData.value.user_name = signFormData.value.user_name?.trim()
  const { code, data, msg } = await $API.base.loginCreate(signFormData.value)
  if (code !== 0) { 
    toast.add({ severity: 'error', summary: t('登录失败'), detail: msg, life: 3000 })
    return Promise.reject(msg)
  } else {
    localStorage.setItem('user_name', signFormData.value.user_name)
    afterLogin(data.token)
  }
}

function afterLogin(token: string) {
  localStorage.setItem('token', token)
  toast.add({ severity: 'success', summary: t('登录成功'), life: 3000 })
  // 如果地址上带有参数，说明是通过APP上的邀请链接进入官网的，那么就跳转到邀请页面
  if (route.query.data && route.query.workspaceName) {
    router.push(localePath(`/invite${location.search}`))
  } else {
    router.push(localePath("/"))
  }
}

// 重新发送邮箱验证码
const handleResend =async () => {
  const { code, msg } = await $API.base.sendEmailRegisterVerifyCodeList({ email: signFormData.value.user_name })
  if (code === 0) {
    countdown()
    // toast.success(t('邮箱验证码发送成功'), { position: 'top' })
  } else { 
    toast.add({ severity: 'error', summary: msg, life: 3000 })
  }
}

const clearCountdown = () => {
  time.value = 60 
  timer && clearInterval(timer)
}

provideLoginContext({
  afterLogin,
  setCurrentComponent,
  setSignFormData(data) {
    signFormData.value = data
  },
  getSignFormData() {
    return signFormData.value
  },
  clearCountdown,
  toSignIn: handleSubmit,
})

onUnmounted(() => timer && clearInterval(timer))
</script>

<template>
  <LoginLayout>
    <div>
      <SignForm 
          v-if="currentComp === 'signForm'" 
          v-model="signFormData" 
          v-bind="currentCompProps" 
          :type="route.query.type == 'sign-up' ? 'signUp' : 'signIn'"
        /> 
        <EmailCodeInputOtp 
          v-else-if="currentComp === 'emailCodeInputOtp'" 
          type="signUp" 
          v-bind="currentCompProps"
          :time="time" 
          @resend="handleResend"
        />
        <ResetPassword v-else-if="currentComp === 'resetPassword'" v-bind="currentCompProps" />
    </div>
  </LoginLayout>
</template>

<style lang="scss" scoped>
.description {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  
  font-size: 16px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-xl, 24px);
  text-align: center;
}

.illustrate {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-lg, 20px);
}

.or {
  position: relative;
  margin: 8px 0;
  height: 1px;
  width: 100%;
  background: var(--Colors-Border-border-container, #C7CDD1);

  &::before {
    content: attr(data-content);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 40px;
    height: 16px;
    color: #000;
    text-align: center;
    
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: var(--Line-Height-text-xs, 16px);
    background-color: #fff;
  }

}

.download-btn {
  border: 1px solid var(--Component-Colors-Buttons-Secondary-border, #C7CDD1);
  box-shadow: 0px 4px 4px -1px rgba(0, 0, 0, 0.02), 0px 1px 1px 0px rgba(0, 0, 0, 0.06);
}

.download-link {
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
}

.download-icon {
  vertical-align: middle;
  font-size: 16px;
  line-height: 1;
} 

</style> -->
<template>
  <PageDownload />
</template>