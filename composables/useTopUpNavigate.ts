import { buildAppBrowserListUrl } from '@/utils/appTopUpRedirect'
import { useAuth } from '~/hooks/useAuth'
import { loggedIn } from '~/store/auth'

export function useTopUpNavigate() {
  const { login } = useAuth()
  const { public: { roxyBrowserUrl } } = useRuntimeConfig()
  const topUpAppDialogVisible = useState('top-up-app-dialog-visible', () => false)
  const isMobile = useRxMaxMd()

  function handleTopUpClick() {
    if (!loggedIn.value) {
      login()
      return
    }
    if (!import.meta.client)
      return

    // PC 端（≥769px）：与头部用户菜单「RoxyBrowser」一致，新标签打开 App
    if (!isMobile.value) {
      window.open(roxyBrowserUrl, '_blank')
      return
    }

    // 移动端：弹出充值季引导弹窗
    topUpAppDialogVisible.value = true
  }

  return { handleTopUpClick }
}
