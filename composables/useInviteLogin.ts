import { toast } from 'vue-sonner'
import type { LanguageCode } from '@/constants/langs'
import { getPersistedInviteCode } from '@/utils/invite'
import { getInviteAuthHeaders } from '@/utils/inviteDeviceId'
import type { InviteLoginResponseData } from './useInviteFinishLogin'

export interface InviteSignFormData {
  password: string
  phone: string
  email: string
  verCode: string
  inviteCode: string
}

interface ApiResponse<T = unknown> {
  code: number
  data?: T
  msg?: string
}

/** 邮箱格式校验（对齐 App signForm schemas） */
function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@][^\s.@]*\.[^\s@]+$/.test(email.trim())
}

/** 注册密码：6-20 位且同时包含字母与数字 */
function isValidRegisterPassword(password: string) {
  const value = password.trim()
  if (value.length < 6 || value.length > 20)
    return false
  return /[a-z]/i.test(value) && /\d/.test(value)
}

/** 从邮箱生成用户名（与 App emailCodeInputOtp postBase 一致） */
function buildEmailUserName(email: string) {
  return email.split('@')[0].replace(/[^a-z0-9]/gi, '').slice(0, 20)
}

export function useInviteLogin() {
  const { $httpClient } = useNuxtApp()
  const { public: { appClientVersion } } = useRuntimeConfig()
  const { locale } = useRxI18n()
  const { finishLogin } = useInviteFinishLogin()

  const submitLoading = ref(false)
  const codeLoading = ref(false)

  function getInviteCode() {
    return getPersistedInviteCode()
  }

  function resolveAppClientVersion() {
    return String(appClientVersion || '7.8.8')
  }

  async function getAuthHeaders() {
    return getInviteAuthHeaders(resolveAppClientVersion(), locale.value as LanguageCode)
  }

  async function checkContinueLogin(params: Record<string, unknown>) {
    const { $API } = useNuxtApp()
    const res = await $API.base.checkOtherDeviceLoginList(params as any)
    if (res.code !== 0) {
      toast.error(res.msg || $t('invite.loginFailed'))
      return false
    }
    if (!res.data?.has_other_login)
      return true
    return window.confirm($t('invite.continueLoginConfirm'))
  }

  /** 账号是否已注册：与 /check_email_registered、/check_phone_registered 响应一致 */
  async function fetchRegisteredStatus(
    endpoint: '/check_email_registered' | '/check_phone_registered',
    paramKey: 'email' | 'phone',
    value: string,
    showError = true,
  ) {
    const trimmed = value.trim()
    if (!trimmed)
      return undefined

    try {
      const { data: res } = await $httpClient.instance.get<ApiResponse<{ is_registered?: boolean }>>(
        endpoint,
        {
          params: { [paramKey]: trimmed },
          headers: await getAuthHeaders(),
        },
      )
      if (res.code !== 0) {
        if (showError)
          toast.error(res.msg || $t('invite.loginFailed'))
        return undefined
      }
      return res.data?.is_registered === true
    }
    catch {
      if (showError)
        toast.error($t('invite.loginFailed'))
      return undefined
    }
  }

  /** 检测邮箱是否已注册：true 已注册 / false 未注册 / undefined 请求失败 */
  async function checkEmailRegistered(email: string, showError = true) {
    return fetchRegisteredStatus('/check_email_registered', 'email', email, showError)
  }

  /** 检测手机号是否已注册：true 已注册 / false 未注册 / undefined 请求失败 */
  async function checkPhoneRegistered(phone: string, showError = true) {
    return fetchRegisteredStatus('/check_phone_registered', 'phone', phone, showError)
  }

  async function sendPhoneCode(phone: string) {
    if (codeLoading.value)
      return
    if (!phone.trim()) {
      toast.error($t('invite.phonePlaceholder'))
      return
    }

    codeLoading.value = true
    try {
      // 必须用 instance.post 显式带头；HttpClient.request 的 headers 不会落到真实请求上
      const { data: res } = await $httpClient.instance.post<ApiResponse<{ isRegistered?: boolean }>>(
        '/send_phone_ver_code',
        { phone: phone.trim() },
        { headers: await getAuthHeaders() },
      )
      if (res.code !== 0) {
        toast.error(res.msg || $t('invite.loginFailed'))
        return
      }
      toast.success(res.msg || $t('invite.codeSent'))
      return res.data
    }
    finally {
      codeLoading.value = false
    }
  }

  /** 未注册邮箱：发送注册验证码 */
  async function sendEmailRegisterCode(email: string) {
    if (codeLoading.value)
      return false

    const trimmed = email.trim()
    if (!trimmed) {
      toast.error($t('invite.emailPlaceholder'))
      return false
    }
    if (!isValidEmail(trimmed)) {
      toast.error($t('invite.invalidEmail'))
      return false
    }

    codeLoading.value = true
    try {
      const { data: res } = await $httpClient.instance.get<ApiResponse>(
        '/send_email_register_verify_code',
        {
          params: { email: trimmed },
          headers: await getAuthHeaders(),
        },
      )
      if (res.code !== 0) {
        if (res.code === 103)
          toast.error($t('invite.emailNotSupported'))
        else
          toast.error(res.msg || $t('invite.loginFailed'))
        return false
      }
      toast.success(res.msg || $t('invite.codeSent'))
      return true
    }
    finally {
      codeLoading.value = false
    }
  }

  async function loginByEmail(data: Pick<InviteSignFormData, 'email' | 'password' | 'inviteCode'>) {
    const email = data.email.trim()
    const password = data.password.trim()
    const inviteCode = (data.inviteCode || getInviteCode()).trim() || undefined

    if (!email) {
      toast.error($t('invite.emailPlaceholder'))
      return
    }
    if (!password) {
      toast.error($t('invite.passwordPlaceholder'))
      return
    }

    const payload = {
      user_name: email,
      password,
      inviteCode,
    }
    const canContinue = await checkContinueLogin({ ...payload, login_type: 'login' })
    if (!canContinue)
      return

    const { data: res } = await $httpClient.instance.post<InviteLoginResponseData>(
      '/login',
      payload,
      { headers: await getAuthHeaders() },
    )
    await finishLogin(res)
  }

  async function registerByEmail(data: InviteSignFormData) {
    const email = data.email.trim()
    const password = data.password.trim()
    const verCode = data.verCode.trim()
    const inviteCode = (data.inviteCode || getInviteCode()).trim() || undefined

    if (!verCode) {
      toast.error($t('invite.verCodePlaceholder'))
      return
    }
    if (!isValidRegisterPassword(password)) {
      toast.error($t('invite.passwordInvalid'))
      return
    }

    const { data: verifyRes } = await $httpClient.instance.get<ApiResponse<boolean>>(
      '/get_check_bind_email_ver_code',
      {
        params: { email, ver_code: verCode },
        headers: await getAuthHeaders(),
      },
    )
    if (verifyRes.code !== 0) {
      toast.error(verifyRes.msg || $t('invite.loginFailed'))
      return
    }
    if (!verifyRes.data) {
      toast.error($t('invite.invalidVerCode'))
      return
    }

    const { data: regRes } = await $httpClient.instance.post<ApiResponse>(
      '/reg',
      {
        user_name: buildEmailUserName(email),
        email,
        password,
        ver_code: verCode,
        inviteCode,
      },
      { headers: await getAuthHeaders() },
    )
    if (regRes.code !== 0) {
      toast.error(regRes.msg || $t('invite.loginFailed'))
      return
    }

    await loginByEmail({ email, password, inviteCode: data.inviteCode })
  }

  /** 邮箱模式提交：已注册走登录，未注册走验证码注册 */
  async function submitByEmail(data: InviteSignFormData) {
    if (submitLoading.value)
      return

    const email = data.email.trim()
    if (!email) {
      toast.error($t('invite.emailPlaceholder'))
      return
    }
    if (!isValidEmail(email)) {
      toast.error($t('invite.invalidEmail'))
      return
    }
    if (!data.password.trim()) {
      toast.error($t('invite.passwordPlaceholder'))
      return
    }

    submitLoading.value = true
    try {
      await registerByEmail(data)
    }
    catch {
      toast.error($t('invite.loginFailed'))
    }
    finally {
      submitLoading.value = false
    }
  }

  async function loginByPhone(data: InviteSignFormData) {
    if (submitLoading.value)
      return
    if (!data.phone.trim()) {
      toast.error($t('invite.phonePlaceholder'))
      return
    }
    if (!data.verCode.trim()) {
      toast.error($t('invite.verCodePlaceholder'))
      return
    }

    submitLoading.value = true
    try {
      const payload = {
        phone: data.phone.trim(),
        verCode: data.verCode.trim(),
        inviteCode: (data.inviteCode || getInviteCode()).trim() || undefined,
      }
      const canContinue = await checkContinueLogin({ ...payload, login_type: 'login' })
      if (!canContinue)
        return

      const { data: res } = await $httpClient.instance.post<InviteLoginResponseData>(
        '/login_phone',
        payload,
        { headers: await getAuthHeaders() },
      )
      await finishLogin(res)
    }
    catch {
      toast.error($t('invite.loginFailed'))
    }
    finally {
      submitLoading.value = false
    }
  }

  return {
    submitLoading,
    codeLoading,
    getInviteCode,
    checkEmailRegistered,
    checkPhoneRegistered,
    loginByPhone,
    sendPhoneCode,
    sendEmailRegisterCode,
    submitByEmail,
  }
}
