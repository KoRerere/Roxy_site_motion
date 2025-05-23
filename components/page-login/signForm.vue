<script lang="ts" setup> 
import { useLoginContext } from './hooks/useLoginContext'
import { getFormSchemas } from './schemas'
import LBForm from './lb-form/form.vue'
import Message from './message.vue'
import {useToast} from 'primevue/usetoast';
import Alert from '@/components/page-invite/Alert.vue'

const { $API } = useNuxtApp()

const props = defineProps({
  type: {
    type: String as PropType<'signUp' | 'signIn'>,
    default: 'signIn',
  },
})

const signFormData = defineModel({ type: Object, default: {} })
const toast = useToast()
const route = useRoute()

const { setSignFormData, setCurrentComponent, toSignIn, afterLogin } = useLoginContext()

const authWindow = ref<Window | null>(null)
const submitLoading = ref(false)
const rememberMe = ref(!!localStorage.getItem('password'))
const formSchemas = ref(getFormSchemas(props.type === 'signUp'))
const isRegister = ref(props.type === 'signUp')
const formInstance = useTemplateRef('formInstance')
const showInvitedMessage = computed(() => !!(route.query.workspaceName && route.query.data));

watch(isRegister, (val) => {
  formSchemas.value = getFormSchemas(val)
})

async function handleSubmit() {
  submitLoading.value = true
  try {
    const formData = await formInstance.value?.submit()
    // const params = getFormData(inputs.value)
    setSignFormData(formData)
    // if sign up, switch to emailCodeInputOtp component
    if (isRegister.value) {
      const { code, msg } = await $API.base.sendEmailRegisterVerifyCodeList({ email: formData.user_name })
      if (code === 0) {
        setCurrentComponent('emailCodeInputOtp')
      }
      else { 
        toast.add({ severity: 'error', summary: msg, life: 3000 })
      }
    }
    else {
      await toSignIn()
      if (rememberMe.value) {
        localStorage.setItem('password', btoa(signFormData.value.password))
      }
    }
  }
  finally {
    submitLoading.value = false
  }
}


function handleAuthMessage(event: MessageEvent) {
  if (event.origin !== location.origin) {
    return
  }

  const { type, queryStr } = event.data
  if (queryStr) {
    const code = new URLSearchParams(queryStr).get('code')
    let result
    if (type === 'google') {
      result = $API.base.loginGoogleV2Create({ googleToken: code })
    } else if (type === 'github') {
      result = $API.base.loginGithubCreate({ githubToken: code })
    } else {
      throw new Error('Invalid auth type: ' + type)
    }

    result.then((result: any) => {
      if (result.code === 0) {
        afterLogin(result.data.token) 
      } else {
        toast.add({ severity: 'error', summary: result.msg, life: 3000 })
      }

      if (authWindow.value) {
        authWindow.value.close()
      }
    })
  }
}

const { public: { ENV } } = useRuntimeConfig()
const isDev = ENV == 'development';

// google 登录没有测试环境
function openAuthWindowWithGoogle() {
  const redirect_url = isDev ? 'https://gatetest.roxybrowser.co/auth?source=web-google' : `https://roxybrowser.com/auth?source=web-google`
  const client_id = '663574245714-elgschngb873e831n3d7ul9b6s4a8cvq.apps.googleusercontent.com'
  const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?scope=https://www.googleapis.com/auth/userinfo.email&response_type=code&redirect_uri=${redirect_url}&client_id=${client_id}`

  const windowFeatures = 'width=600,height=400,top=100,left=100'
  authWindow.value = window.open(authUrl, 'authWindow', windowFeatures)
  window.addEventListener('message', handleAuthMessage, false)
} 

function openAuthWindowWithGithub() {
  const redirect_url = isDev ? 'https://gatetest.roxybrowser.co/auth?source=web-github' : `https://roxybrowser.com/auth?source=web-github`
  const client_id = isDev ? 'Iv23liGPfXxcEhVK0tdR' : 'Ov23liLECsz7MFA4N5NA'
  const authUrl = `https://github.com/login/oauth/authorize?client_id=${client_id}&redirect_uri=${redirect_url}`

  const windowFeatures = 'width=600,height=400,top=100,left=100'
  authWindow.value = window.open(authUrl, 'authWindow', windowFeatures)
  window.addEventListener('message', handleAuthMessage, false)
}

function switchFormMode(val: boolean) {
  isRegister.value = val
  formSchemas.value = getFormSchemas(val)
  // formInstance.value?.updateSchema(getFormSchemas(val))
  formInstance.value?.clearValidateMessages()
}

onUnmounted(() => {
  window.removeEventListener('message', handleAuthMessage, false)
})
</script>

<template>
<client-only>
  <div class="w-[384px] px-[32px] py-[24px]">
    <div class="signin">
      {{ isRegister ? $t('创建账号') : $t('登录') }}
    </div>
    <div class="signinDesc mb-[32px]">
      {{ isRegister ? $t('创建账号以体验 RoxyBrowser 提供的服务') : $t('登录账号以体验 RoxyBrowser 提供的服务') }}
    </div>

    <Alert :visible="showInvitedMessage" type="info" class="mb-[16px]">
      <template #title>{{ $t('邀请成员') }}</template>
      <template #content>
        <rx-i18n-t 
          :keypath="$t('您被邀请加入 {workspaceName} ！请登录并开始协作。', { workspaceName: '{workspaceName}' })"
        >
          <template #workspaceName>
            <span class="font-semibold text-[#171C1F]">
              {{ route.query.workspaceName }}
            </span>
          </template>
        </rx-i18n-t>
      </template>
    </Alert>

    <LBForm 
      ref="formInstance" 
      v-model="signFormData" 
      :schemas="formSchemas" 
      @keydown.enter="handleSubmit" 
    /> 

    <div v-if="!isRegister" class="remember-me">
      <div class="flex items-center text-3 h-5">
        <Checkbox 
          v-model="rememberMe" 
          input-id="remember-me" 
          :binary="true" 
        />
        <label for="remember-me" class="ml-2 text-[#7C8387]"> {{ $t('记住登录状态') }} </label>
      </div>
      <div class="forget-pwd" @click="setCurrentComponent('resetPassword')">
        {{ $t('忘记密码？') }}
      </div>
    </div>
    <div class="login-ways">
       <!-- 登录按钮 -->
      <RxButton :loading="submitLoading" class="w-full" @click="handleSubmit">
        {{ isRegister ? $t('注册') : $t('登录') }}
      </RxButton>
      <!-- 分割线 -->
      <div class="divider">
        <span class="mx-2">{{ $t('或') }}</span>
      </div>
      <!-- 谷歌登录 -->
       <RxButton 
        class="w-full btn-outline flex items-center justify-center" 
        @click="openAuthWindowWithGoogle"
        icon="base/rx_ic_google"
        :label="$t('通过 Google 账号登录')"
        outlined
      ></RxButton>

      <RxButton 
        class="w-full btn-outline flex items-center justify-center" 
        @click="openAuthWindowWithGithub"
        icon="base/rx_ic_github"
        :label="$t('通过 Github 账号登录')"
        outlined
      ></RxButton>

      <!-- 注册提示 -->
      <div v-if="isRegister" class="signup-tips">
        {{ $t('已有账号？') }}
        <a class="cursor-pointer" @click="switchFormMode(false)">
          {{ $t('前往登录') }}
        </a>
      </div>
      <!-- 登录提示 -->
      <div v-else class="signup-tips">
        {{ $t('没有 RoxyBrowser 账户？') }}
        <a class="cursor-pointer" @click="switchFormMode(true)">
          {{ $t('创建账号') }}
        </a>
      </div>
    </div>
  </div>
</client-only>
</template>

<style lang="scss" scoped>
.signin {
  color: var(--Colors-Text-text-primary, #171C1F);
  font-family: Archivo;
  font-size: 24px;
  font-style: normal;
  font-weight: 600;
  line-height: normal;
}

.signinDesc {
  color: var(--Colors-Text-text-tertiary, #7C8387);
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}


.remember-me {
  display: flex;
  justify-content: space-between;
  align-items: center;
  align-self: stretch;
  margin-bottom: 16px;

  .forget-pwd {
    cursor: pointer;
    color: var(--Color-blue-300, #12a3fc);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: var(--Line-Height-text-xs, 16px);
    /* 133.333% */
  }

  :deep(.p-checkbox) {
    width: 16px;
    height: 16px;
  }

  :deep(.p-checkbox-box) {
    width: 16px;
    height: 16px;
  }
}

a {
  color: var(--Colors-Text-text-link, #12a3fc);
}

.divider {
  width: 100%;
  display: flex;
  align-items: center;
  color: #000;
  text-align: center;
  
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: normal;
}

.divider::before,
.divider::after {
  flex: 1;
  content: '';
  height: 1px;
  background: var(--Colors-Border-border-container, #c7cdd1);
}

.btn-outline {
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
  text-align: center;
  
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: var(--Line-Height-text-lg, 20px); /* 153.846% */
  border-color: #c7cdd1;
}

.login-ways {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: var(--spacing-2xl, 16px);
  align-self: stretch;
}

.signup-tips {
  color: #000;
  text-align: center;
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: normal;
}
</style>
