<script setup lang="ts">
import { useLoginContext } from './hooks/useLoginContext'
import { useToast } from 'primevue/usetoast';
import InputOtp from 'primevue/inputotp';

const { $API } = useNuxtApp()

const props = defineProps({
  type: {
    type: String as PropType<'signUp' | 'resetPassword'>,
    required: true,
  },
  email: {
    type: String,
  },
  time: {
    type: Number,
    default: 60,
  }
})

const { time } = toRefs(props)
const emit = defineEmits(['ok', 'back', 'resend'])
const toast = useToast()
const { t } = useI18n()

const emailCode = defineModel('emailCode', { default: '' })

const { setCurrentComponent, getSignFormData, toSignIn } = useLoginContext() 

const getEmail = computed(() => {
  return props.email || getSignFormData().user_name
})

function toReEnter() {
  if (props.type === 'resetPassword') {
    emit('back')
  }
  else {
    setCurrentComponent('signForm', { type: 'signUp' })
  }
}

async function handleSubmit() {
  if (emailCode.value.length !== 6) {
    return
  }

  const verifyCodeRes = await $API.base.getCheckBindEmailVerCodeList({
    email: getEmail.value,
    ver_code: emailCode.value,
  })

  if (!verifyCodeRes.data) { 
    toast.add({ severity: 'error', summary: t('无效的验证码'), life: 3000 })
    return
  }

  if (props.type === 'resetPassword') {
    emit('ok', emailCode.value)
    return
  }

  const signFormData = getSignFormData()
  const { code, msg } = await $API.base.postBase({
    ...signFormData,
    // 用户名不能包含特殊字符
    user_name: signFormData.user_name.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 20),
    email: signFormData.user_name,
    ver_code: emailCode.value,
  })
  if (code === 0) {
    await toSignIn() 
    emit('ok', emailCode.value)
  }
  else { 
    toast.add({ severity: 'error', summary: msg, life: 3000 })
  }
}

// function showLiveChat() {
//   LiveChatWidget.call('maximize')
// }
</script>

<template>
  <client-only>
  <div class="wrapper">

    <div class="title">{{ $t('请检查您的邮箱') }}</div>
    <div class="py-[8px]">
      <div class="tips">
        {{ $t('我们已经向您的邮箱发送了一个 6 位数字验证码：') }}
        <br />
        <span class="email-text">{{ getEmail }}</span> {{ $t('验证码将在 5 分钟后过期。') }}
        <br />
        <br />
        {{ $t('请检查邮件以获取验证码') }}
      </div>
    </div>

    <InputOtp v-model="emailCode" :length="6" class="inputotp w-full" />

    <!-- 点击确认 -->
    <RxButton class="w-full" :disabled="emailCode.length !== 6" @click="handleSubmit">
      {{ type === 'signUp' ? $t('完成注册') : $t('下一步') }}
    </RxButton>

    <!-- 分割线 -->
    <div class="divider">
      <span class="mx-2">{{ $t('或') }}</span>
    </div>

    <RxButton class="w-full btn-outline" outlined :disabled="time > 0" @click="emit('resend')">
      {{ time > 0 ? $t('{time} 秒后可重新发送', { time: time }) : $t('重新发送') }}
    </RxButton>

    <div class="tips">
      <rx-i18n-t 
        :keypath="$t('无法收到验证码？请{resend}或{technicalSupport}。', { resend: '{resend}', technicalSupport: '{technicalSupport}' })"
      >
        <template #resend>
          <a class="re-enter-text" @click="toReEnter">{{ $t('重新尝试') }}</a>
        </template>
        <template #technicalSupport>
          <LiveChat class="inline-block">
            <a class="re-enter-text">{{ $t('联系支持人员') }}</a>
          </LiveChat>
        </template>
      </rx-i18n-t>
    </div>
  </div>
</client-only>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--spacing-4xl, 16px);
  align-self: stretch;
  width: 384px;
  padding: 24px 32px;

  :deep(.v-otp-input__content) {
    padding: 0;
    max-width: unset;
  }

  .title {
    align-self: stretch;
    color: var(--Colors-Text-text-primary, #171c1f);
    font-size: 16px;
    font-style: normal;
    font-weight: 700;
    line-height: var(--Line-Height-text-xs, 16px);
    /* 100% */
  }

  .description {
    align-self: stretch;
    color: var(--Colors-Text-text-tertiary, #7c8387);
    font-size: 12px;
    font-style: normal;
    font-weight: 400;
    line-height: var(--Line-Height-text-lg, 20px);
    /* 166.667% */
  }
}

.inputotp {
  gap: var(--spacing-md, 6px);

  :deep(.p-inputotp-input) {
    flex: 1;
    // display: flex;
    // width: 46px;
    height: 60px;
    // flex-direction: column;
    // justify-content: center;
    // flex-shrink: 0;
    color: #000;
    text-align: center;
    font-size: 24px;
    // font-style: normal;
    font-weight: 400;
    // line-height: normal;
    // text-transform: uppercase;
  }
}

.email-text {
  color: var(--Colors-Text-text-tertiary, #7c8387);
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-lg, 20px);
  /* 166.667% */
  color: var(--Colors-Text-text-primary, #171c1f);
  
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: var(--Line-Height-text-lg, 20px);
}

.tips {
  align-self: stretch;
  color: var(--Colors-Text-text-tertiary, #7c8387);
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-xs, 16px);
  /* 160% */
}

.re-enter-text {
  color: var(--Colors-Text-text-brand, #12a3fc);
  
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-xs, 16px);
  text-decoration-line: underline;
  cursor: pointer;
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
  border-color: #c7cdd1;
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
}
</style>
