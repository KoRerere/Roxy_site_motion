<script lang="ts" setup>
import { useLoginContext } from './hooks/useLoginContext'
import EmailCodeInputOtp from './emailCodeInputOtp.vue'
import { getResetPasswordSchemas } from './schemas'
import LBForm from './lb-form/form.vue'
import LBInput from './lb-form/components/lb-input.vue'
import LBLable from './lb-form/components/lb-label.vue'
import {useToast} from 'primevue/usetoast';

const { setCurrentComponent, setSignFormData } = useLoginContext()
const { $API } = useNuxtApp()
const { $t } = useRxI18n()
const toast = useToast()
const rxFormRef = useTemplateRef('rxForm')
const email = ref('')
const emailCode = ref('')
const resetPwdFormData = ref({ email: '', newPassword: '', confirmPassword: '' })
const currentStep = ref<'step1' | 'step2' | 'step3'>('step1')
const countdown = ref(60)

// 开始倒计时
let timer: NodeJS.Timeout | null = null;
const startCountdown = () => {
  countdown.value = 60
  timer && clearInterval(timer)
  timer = setInterval(() => {
    countdown.value--
    if (countdown.value < 0) {
      countdown.value = 0
      clearInterval(timer as NodeJS.Timeout)
    }
  }, 1000)
}

const sendEmailForgetVerifyCodeList = async () => {
  const emailInput = email.value.trim()

  if (!emailInput) {
    toast.add({ severity: 'error', summary: $t('请输入您的邮箱'), life: 3000 })
    return 
  }

  const { code, msg } = await $API.base.sendEmailForgetVerifyCodeList({
    email: emailInput,
  })

  if (code === 0) {
    toast.add({ severity: 'success', summary: $t('验证码发送成功'), life: 3000 })
    countdown.value = 60
    currentStep.value = 'step2'
    startCountdown()
  } else {
    toast.add({ severity: 'error', summary: msg, life: 3000 })
  }
}

async function handleSubmit() {
  const emailInput = email.value.trim()
  if (currentStep.value === 'step3') {
    const formData = await rxFormRef.value?.submit()
    const { code, msg } = await $API.base.forgetPasswordCreate({
      email: emailInput,
      new_pwd: formData?.newPassword,
      ver_code: emailCode.value,
    })
    if (code === 0) { 
      toast.add({ severity: 'success', summary: $t('密码重置成功'), life: 3000 })
      setSignFormData({ user_name: emailInput, password: '' })
      setCurrentComponent('signForm')
    }
    else {
      toast.add({ severity: 'error', summary: msg, life: 3000 })
    }
  }
}

function backToSignIn() {
  setCurrentComponent('signForm')
}

function receiveEmailCode(code: string) {
  emailCode.value = code
  currentStep.value = 'step3'
}

onUnmounted(() => {
  timer && clearInterval(timer)
})
</script>

<template>
  <div>
    <template v-if="currentStep == 'step1'">
      <div class="reset-password">
        <div class="box">
          <div class="title">
            {{ $t('重置密码') }}
          </div>
          <div class="desc">{{ $t('请输入您的邮箱，我们将向您发送验证码') }}</div>
          <div class="flex flex-col gap-2 w-full">
            <LBLable>{{ $t('邮箱') }}</LBLable>
            <LBInput id="email" v-model="email" :placeholder="$t('请输入您的邮箱')" />
          </div>
        </div>
        <RxButton class="w-full" @click="sendEmailForgetVerifyCodeList">
          {{ $t('前往验证') }}
        </RxButton>
        <RxButton class="w-full btn-outline" outlined @click="backToSignIn">
          {{ $t('返回登录') }}
        </RxButton>
      </div>
    </template>

    <template v-if="currentStep === 'step2'">
      <EmailCodeInputOtp 
        type="resetPassword" 
        :email 
        :time="countdown"
        @ok="receiveEmailCode" 
        @back="currentStep = 'step1'" 
        @resend="sendEmailForgetVerifyCodeList"
      />
    </template>

    <template v-if="currentStep === 'step3'">
      <div class="reset-password">
        <div class="box">
          <div class="title">{{ $t('重置密码') }}</div>
          <div class="desc">{{ $t('请在下方设置您的新密码') }}</div>
          <div class="flex flex-col gap-2 w-full">
            <LBForm 
              ref="rxForm" 
              v-model="resetPwdFormData" 
              :schemas="getResetPasswordSchemas()" 
              @keydown.enter="handleSubmit" 
            />
          </div>
          <RxButton class="w-full" @click="handleSubmit">
            {{ $t('确定') }}
          </RxButton>
        </div>
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>
.message {
  :deep(.p-message-content) {
    align-items: flex-start;
  }

  .message-body {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: 10px;
    align-self: stretch;

    .message-title {
      color: var(--Colors-Text-text-primary, #171c1f);
      
      font-size: 12px;
      font-style: normal;
      font-weight: 600;
      line-height: normal;
    }

    .message-desc {
      color: var(--Colors-Text-text-secondary, #575d61);
      
      font-size: 12px;
      font-style: normal;
      font-weight: 400;
      line-height: 18px;
      /* 150% */
    }
  }
}

.reset-password {
  width: 320px;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-2xl, 12px);
  align-self: stretch;
  padding: 24px 32px;

  :deep(.p-inputtext) {
    width: 100%;
  }
}



.box {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-xl, 12px);
  align-self: stretch;

  .title {
    width: 100%;
    color: var(--Colors-Text-text-primary, #171c1f);
    
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: var(--Line-Height-text-xs, 16px);
    /* 100% */
  }

  .desc {
    color: var(--Colors-Text-text-tertiary, #7C8387);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: var(--Line-Height-text-lg, 20px); /* 166.667% */

  }

  .description {
    color: var(--Colors-Text-text-tertiary, #7c8387);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: var(--Line-Height-text-lg, 20px);
    /* 166.667% */
  }

  .label {
    color: var(--Component-Colors-TextInput-label-label, #171c1f);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: var(--Line-Height-text-lg, 20px);
    /* 166.667% */
  }
}

.btn-outline {
  border-color: #c7cdd1;
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
}
</style>
