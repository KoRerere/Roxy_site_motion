
const injectKey = Symbol('loginContext')

export function provideLoginContext(context: LoginContext) {
  provide(injectKey, context)
}

export function useLoginContext() {
  return inject(injectKey) as LoginContext
}

export type CurrentComp = 'emailCodeInputOtp' | 'signForm' | 'resetPassword' | 'InviteIntoWorkspace'

export interface LoginContext {
  /** 登录 */
  toSignIn: () => Promise<void>
  /** 拿到 token 之后要做的事 */
  afterLogin: (token: string) => void
  /** 切换组件 */
  setCurrentComponent: (comp: CurrentComp, compProps?: Recordable) => void
  /** 保存当前表单的数据 */
  setSignFormData: (signFormData: LoginCreatePayload) => void
  /** 获取当前表单的数据 */
  getSignFormData: () => LoginCreatePayload
  /** 清除倒计时 */
  clearCountdown: () => void
}


export interface LoginCreatePayload {
  /** 用户名 */
  user_name: string;
  /** 密码 */
  password: string;
}