<script setup lang="ts">
import { debounce } from 'es-toolkit'
import { toast } from 'vue-sonner'
import { getInviteCodeFromRoute } from '@/utils/invite'
// 登录表单字段图标，抽离至 assets/svgs/intive 便于维护
import phoneIcon from '@/assets/svgs/intive/login-phone.svg?url'
import emailIcon from '@/assets/svgs/intive/login-email.svg?url'
import vercodeIcon from '@/assets/svgs/intive/login-vercode.svg?url'
import passwordIcon from '@/assets/svgs/intive/login-password.svg?url'
import inviteCodeIcon from '@/assets/svgs/intive/login-invite-code.svg?url'
// 表单背后青粉柔光（试用 PNG，置于输入区下层）
import formGlow from '@/assets/images/intive/form-glow.png?url'
import { RxIcon } from '@/components/rx-icon'

const props = defineProps<{
  /** 能量导线触达左缘时短暂高亮，再由 CSS 缓慢熄灭 */
  energized?: boolean
}>()

const route = useRoute()
const { $t, locale, isZh } = useRxI18n()

const codeSeconds = ref(0)
/** 邮箱注册：密码明文/密文切换 */
const passwordVisible = ref(false)
let codeTimer: number | undefined

const {
  submitLoading,
  codeLoading,
  loginByPhone,
  sendPhoneCode,
  sendEmailRegisterCode,
  submitByEmail,
  checkEmailRegistered,
  checkPhoneRegistered,
} = useInviteLogin()

/** 跟随语言：中文手机号注册，英文/俄文邮箱注册 */
const isPhoneMode = computed(() => isZh.value)

const form = reactive({
  password: '',
  phone: '',
  email: '',
  verCode: '',
  inviteCode: '',
})

/** 邮箱是否已注册（仅用于密码 placeholder，不在输入框下方展示提示） */
const emailRegistered = ref<boolean | null>(null)

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email.trim())
}

/** 中国大陆手机号：11 位且以 1 开头 */
function isValidPhone(phone: string) {
  return /^1[3-9]\d{9}$/.test(phone.trim())
}

/** 暗色主题输入框：字号见 .invite-form-input（移动端 16px + scale 防 iOS 聚焦缩放） */
const inputClass = 'invite-form-input w-full border-none bg-transparent p-0 font-[Inter] font-400 text-white outline-none'
/** 输入区 flex 容器：承载 scale 后的宽度补偿，避免挤压验证码/密码按钮 */
const inputGrowClass = 'invite-input-grow min-w-0 flex-1 overflow-hidden flex items-center'
const labelClass = 'text-[12px] leading-[18px] font-500 text-white/85'

const formTitle = computed(() => {
  return isPhoneMode.value ? $t('invite.phoneRegister') : $t('invite.signUp')
})

const passwordPlaceholder = computed(() => {
  if (emailRegistered.value === false)
    return $t('invite.passwordSetPlaceholder')
  return $t('invite.passwordPlaceholder')
})

const codeButtonText = computed(() => {
  if (codeSeconds.value > 0)
    return `${String(codeSeconds.value).padStart(2, '0')}s`
  return $t('invite.getVerCode')
})

const submitText = computed(() => {
  if (submitLoading.value)
    return $t('invite.submitting')
  return $t('invite.signUp')
})

/** 获取验证码 / 注册：已注册时 toast，邮箱与手机号文案分开 */
function notifyAlreadyRegistered() {
  toast.error(
    isPhoneMode.value
      ? $t('invite.phoneAlreadyRegisteredToast')
      : $t('invite.emailAlreadyRegisteredToast'),
  )
}

/** 点击时检测是否已注册（不在输入过程中提示） */
async function resolveRegisteredAtClick(): Promise<boolean | undefined> {
  if (isPhoneMode.value) {
    if (!form.phone.trim()) {
      toast.error($t('invite.phonePlaceholder'))
      return undefined
    }
    if (!isValidPhone(form.phone)) {
      toast.error($t('invite.phonePlaceholder'))
      return undefined
    }
    return checkPhoneRegistered(form.phone.trim(), false)
  }

  if (!form.email.trim()) {
    toast.error($t('invite.emailPlaceholder'))
    return undefined
  }
  if (!isValidEmail(form.email)) {
    toast.error($t('invite.invalidEmail'))
    return undefined
  }
  return checkEmailRegistered(form.email.trim(), false)
}

function startCountdown() {
  codeSeconds.value = 60
  if (codeTimer)
    window.clearInterval(codeTimer)
  codeTimer = window.setInterval(() => {
    codeSeconds.value -= 1
    if (codeSeconds.value <= 0 && codeTimer) {
      window.clearInterval(codeTimer)
      codeTimer = undefined
    }
  }, 1000)
}

async function handleSendCode() {
  if (codeSeconds.value > 0 || codeLoading.value)
    return

  const isRegistered = await resolveRegisteredAtClick()
  if (isRegistered === undefined)
    return
  if (isRegistered) {
    notifyAlreadyRegistered()
    return
  }

  if (isPhoneMode.value) {
    const res = await sendPhoneCode(form.phone)
    if (res)
      startCountdown()
    return
  }

  const sent = await sendEmailRegisterCode(form.email)
  if (sent)
    startCountdown()
}

async function handleSubmit() {
  const isRegistered = await resolveRegisteredAtClick()
  if (isRegistered === undefined)
    return
  if (isRegistered) {
    notifyAlreadyRegistered()
    return
  }

  if (isPhoneMode.value)
    await loginByPhone(form)
  else
    await submitByEmail(form)
}

/** 邮箱变更时静默探测是否已注册，仅驱动密码 placeholder */
const refreshEmailRegistered = debounce(async (email: string) => {
  if (isPhoneMode.value || !email.trim()) {
    emailRegistered.value = null
    return
  }
  if (!isValidEmail(email)) {
    emailRegistered.value = null
    return
  }
  emailRegistered.value = await checkEmailRegistered(email, false) ?? null
}, 300)

/** /invite/:code 或 ?code= 时，预填邀请码输入框 */
function syncInviteCodeFromRoute() {
  if (!import.meta.client)
    return
  const code = getInviteCodeFromRoute(route, new URL(window.location.href).searchParams)
  if (code)
    form.inviteCode = code
}

watch(() => form.email, email => refreshEmailRegistered(email))
watch(locale, () => {
  emailRegistered.value = null
  if (!isPhoneMode.value && form.email.trim())
    refreshEmailRegistered(form.email)
})

onMounted(syncInviteCodeFromRoute)

watch(() => route.params.code, syncInviteCodeFromRoute)
watch(() => route.query.code, syncInviteCodeFromRoute)

onBeforeUnmount(() => {
  if (codeTimer)
    window.clearInterval(codeTimer)
})
</script>

<template>
  <!-- 外层仅负责定位；柔光图在卡片背后，青粉渐变描边在 invite-form-shell::before -->
  <div class="invite-form-wrap w-full lg:w-[466px]">
    <!-- 柔光用 img 渲染，便于 PNG/SVG 光晕滤镜效果 -->
    <img
      :src="formGlow"
      alt=""
      class="invite-form-glow pointer-events-none select-none"
      aria-hidden="true"
      draggable="false"
    >
    <div
      class="invite-form-shell w-full box-border p-[20px] lg:(w-[466px] p-[32px])"
      :class="{ 'is-energized': props.energized }"
    >
    <h2 class="invite-form-title mb-[16px] text-white text-[20px] leading-[28px] font-600 lg:mb-[26px]">
      {{ formTitle }}
    </h2>

    <div class="flex flex-col gap-[8px]">
      <!-- 中文：手机号（获取验证码在验证码框内） -->
      <template v-if="isPhoneMode">
        <label :class="labelClass">{{ $t('invite.phoneLabel') }}</label>
        <div class="invite-login-field">
          <img
            :src="phoneIcon"
            class="invite-field-icon shrink-0"
            alt=""
            aria-hidden="true"
            draggable="false"
          >
          <div :class="inputGrowClass">
            <input
              v-model="form.phone"
              type="tel"
              :class="inputClass"
              :placeholder="$t('invite.phonePlaceholder')"
            >
          </div>
        </div>
      </template>

      <!-- 英文/俄文：邮箱（获取验证码在验证码框内） -->
      <template v-else>
        <label :class="labelClass">{{ $t('invite.emailLabel') }}</label>
        <div class="invite-login-field">
          <img
            :src="emailIcon"
            class="invite-field-icon shrink-0"
            alt=""
            aria-hidden="true"
            draggable="false"
          >
          <div :class="inputGrowClass">
            <input
              v-model="form.email"
              type="email"
              :class="inputClass"
              :placeholder="$t('invite.emailPlaceholder')"
            >
          </div>
        </div>

        <label :class="labelClass">{{ $t('invite.passwordLabel') }}</label>
        <div class="invite-login-field">
          <img
            :src="passwordIcon"
            class="invite-field-icon shrink-0"
            alt=""
            aria-hidden="true"
            draggable="false"
          >
          <div :class="inputGrowClass">
            <input
              v-model="form.password"
              :type="passwordVisible ? 'text' : 'password'"
              :class="inputClass"
              :placeholder="passwordPlaceholder"
            >
          </div>
          <button
            type="button"
            class="invite-password-toggle shrink-0 border-none bg-transparent p-0 cursor-pointer"
            :aria-label="passwordVisible ? $t('invite.hidePassword') : $t('invite.showPassword')"
            @click="passwordVisible = !passwordVisible"
          >
            <!-- 图标表示当前状态：明文=睁眼，密文=划线眼 -->
            <RxIcon
              :name="passwordVisible ? 'base/rx_ic_eye' : 'base/rx_ic_eye_close'"
              size="16"
              color="#9CA3AF"
            />
          </button>
        </div>
      </template>

      <label :class="labelClass">{{ $t('invite.verCodeLabel') }}</label>
      <div class="invite-login-field">
        <img
          :src="vercodeIcon"
          class="invite-field-icon shrink-0"
          alt=""
          aria-hidden="true"
          draggable="false"
        >
        <div :class="inputGrowClass">
          <input
            v-model="form.verCode"
            type="text"
            :class="inputClass"
            :placeholder="$t('invite.verCodePlaceholder')"
          >
        </div>
        <button
          type="button"
          class="invite-get-code-btn shrink-0 border-none bg-transparent p-0 font-[Inter] text-[12px] leading-[18px] font-400 text-[#11A3FD] cursor-pointer disabled:(cursor-not-allowed text-[#A3A9AD]) lg:text-[14px] lg:leading-[20px]"
          :disabled="codeSeconds > 0 || codeLoading"
          @click="handleSendCode"
        >
          {{ codeButtonText }}
        </button>
      </div>

      <label :class="labelClass">{{ $t('invite.inviteCodeLabel') }}</label>
      <div class="invite-login-field">
        <img
          :src="inviteCodeIcon"
          class="invite-field-icon shrink-0"
          alt=""
          aria-hidden="true"
          draggable="false"
        >
        <div :class="inputGrowClass">
          <input
            v-model="form.inviteCode"
            type="text"
            :class="inputClass"
            :placeholder="$t('invite.referralPlaceholder')"
          >
        </div>
      </div>
    </div>

    <button
      type="button"
      class="invite-form-submit mt-[24px] h-[40px] w-full rounded-[6px] border-none bg-[#11A3FD] text-[13px] leading-[18px] font-400 text-white cursor-pointer hover:bg-[#1a7fd9] disabled:(cursor-not-allowed opacity-70) lg:(mt-[25px] h-[40px])"
      :disabled="submitLoading"
      @click="handleSubmit"
    >
      {{ submitText }}
    </button>
    </div>
  </div>
</template>

<style scoped>
.invite-form-wrap {
  position: relative;
  overflow: visible;
  /* 13/16：移动端 scale 后视觉字号仍为 13px */
  --invite-input-ios-scale: 0.8125;
  /* 表单区默认系统字体栈；仅 .invite-form-title 保留 Archivo（红框） */
  font-family: var(--family);
}

/* 首屏红框：注册卡片标题 Sign up */
.invite-form-title {
  font-weight: 600;
}

/* 柔光背景图：略大于卡片，保证 PNG 光晕四边完整露出 */
.invite-form-glow {
  position: absolute;
  left: 44%;
  top: 44%;
  z-index: 0;
  display: block;
  width: min(1120px, 240%);
  max-width: none;
  height: auto;
  border: none;
  outline: none;
  transform: translate(-50%, -46%);
  pointer-events: none;
}

/* 表单外框：12% 白叠层 + rgba(3,9,38,0.6) 玻璃底（对齐设计稿 DevTools 启用色）；描边左蓝 #4CA4F4 → 右粉 #F28CB1 */
.invite-form-shell {
  position: relative;
  z-index: 1;
  border: none;
  border-radius: 12px;
  background:
    linear-gradient(0deg, rgba(255, 255, 255, 0.12) 0%, rgba(255, 255, 255, 0.12) 100%),
    rgba(3, 9, 38, 0.6);
  box-shadow:
    -8px -8px 20px 0 rgba(76, 164, 244, 0.2),
    8px 8px 20px 0 rgba(242, 140, 177, 0.2);
  backdrop-filter: blur(30px);
  transition:
    box-shadow 0.9s ease,
    background 0.9s ease;
}

/* 2px 渐变描边：mask 镂空，与 form-glow / box-shadow 同色系 */
.invite-form-shell::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 2px;
  background: linear-gradient(90deg, #4ca4f4, #f28cb1);
  -webkit-mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  -webkit-mask-composite: xor;
  mask:
    linear-gradient(#fff 0 0) content-box,
    linear-gradient(#fff 0 0);
  mask-composite: exclude;
  pointer-events: none;
}

/* 能量注入瞬间（当前默认关闭）：仅加强外发光与底色，渐变描边不变 */
.invite-form-shell.is-energized {
  background:
    linear-gradient(0deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.14) 100%),
    rgba(3, 9, 38, 0.65);
  box-shadow:
    -8px -8px 20px 0 rgba(76, 164, 244, 0.34),
    8px 8px 20px 0 rgba(242, 140, 177, 0.3),
    0 0 20px 0 rgba(63, 170, 246, 0.22);
}

/* 注册/登录主按钮：不单独设字体，继承站点默认字体栈 */
.invite-form-submit {
  font-family: inherit;
  font-weight: 400;
}

/* 验证码框内「获取验证码」：Inter 常规体，避免继承表单标题 Archivo */
.invite-get-code-btn {
  white-space: nowrap;
  font-family: Inter, sans-serif;
  font-weight: 400;
}

/* 密码框右侧可见性切换 */
.invite-password-toggle {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  line-height: 0;
}

.invite-password-toggle:hover :deep(svg) {
  opacity: 1;
}

/* 桌面端输入字号；过长文案/placeholder 省略号 */
.invite-form-input {
  font-size: 13px;
  line-height: 20px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.invite-form-input::placeholder {
  color: #9ca3af;
  font-family: Inter, sans-serif;
  font-size: 13px;
  line-height: 20px;
  font-weight: 400;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/*
 * 移动端 iOS：Safari 在 input 字号 <16px 时会自动放大页面。
 * 实际 16px + scale(0.8125) 保持 13px 视觉，不触发缩放。
 * 宽度保持 100%（不做 scale 补偿），避免父级 overflow 硬裁切；不足处由 ellipsis 处理。
 */
@media (max-width: 1023px) {
  .invite-input-grow .invite-form-input {
    font-size: 16px;
    line-height: calc(20px / var(--invite-input-ios-scale));
    transform: scale(var(--invite-input-ios-scale));
    transform-origin: left center;
    width: 100%;
    max-width: 100%;
  }

  .invite-input-grow .invite-form-input::placeholder {
    font-size: 16px;
    line-height: calc(20px / var(--invite-input-ios-scale));
  }
}

/* 输入框统一高度 40px（设计稿） */
.invite-login-field {
  display: flex;
  box-sizing: border-box;
  height: 40px;
  padding: 0 10px;
  align-items: center;
  gap: 8px;
  align-self: stretch;
  border-radius: 6px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(22, 28, 45, 0.95);
  box-shadow: inset 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* 浏览器 autofill 默认黄底 → 覆盖为设计稿深色输入框背景 */
.invite-login-field input:-webkit-autofill,
.invite-login-field input:-webkit-autofill:hover,
.invite-login-field input:-webkit-autofill:focus,
.invite-login-field input:-webkit-autofill:active {
  -webkit-text-fill-color: #fff;
  caret-color: #fff;
  -webkit-box-shadow: 0 0 0 1000px rgba(22, 28, 45, 0.95) inset;
  box-shadow: 0 0 0 1000px rgba(22, 28, 45, 0.95) inset;
  transition: background-color 99999s ease-out 0s;
}

/* 输入框图标：统一 16×16，略提亮 */
.invite-field-icon {
  box-sizing: border-box;
  width: 16px;
  height: 16px;
  object-fit: contain;
  opacity: 0.9;
  filter: brightness(1.35);
}
</style>
