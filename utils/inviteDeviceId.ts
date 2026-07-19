import { backendMap, type LanguageCode } from '@/constants/langs'
import { getFingerprint } from '@/utils/fingerprint'
import { encryptAESGCM } from '@/utils/crypto-aes-256-gcm'

const VISITOR_ID_KEY = 'visitorId'

let cachedDeviceId = ''
let getDeviceIdPromise: Promise<string> | null = null

/** 与 useDownload 共用 localStorage，保证同设备标识一致 */
async function resolveVisitorId(): Promise<string> {
  const stored = localStorage.getItem(VISITOR_ID_KEY)
  if (stored)
    return stored

  const fp = await getFingerprint()
  const { visitorId } = await fp.get()
  localStorage.setItem(VISITOR_ID_KEY, visitorId)
  return visitorId
}

async function encryptVisitorId(visitorId: string): Promise<string> {
  // https 或 localhost 走 WebCrypto；局域网 http 无 subtle，改走同源 Nitro 加密
  if (globalThis.crypto?.subtle) {
    try {
      return await encryptAESGCM(visitorId)
    }
    catch (error) {
      console.warn('[invite] WebCrypto encrypt failed, fallback to server', error)
    }
  }

  const res = await $fetch<{ deviceId: string }>('/api/invite/device-id', {
    method: 'POST',
    body: { visitorId },
  })
  return res.deviceId || ''
}

/** 对齐 roxy-browser Web 端：FingerprintJS visitorId → AES-GCM 加密 */
async function getInviteDeviceId(): Promise<string> {
  if (cachedDeviceId)
    return cachedDeviceId

  if (!getDeviceIdPromise) {
    getDeviceIdPromise = resolveVisitorId()
      .then(id => id ? encryptVisitorId(id) : '')
      .catch((error) => {
        console.warn('[invite] getInviteDeviceId failed', error)
        return ''
      })
      .finally(() => {
        getDeviceIdPromise = null
      })
  }

  cachedDeviceId = await getDeviceIdPromise
  return cachedDeviceId
}

/** Invite 发验证码 / 登录请求头 */
export async function getInviteAuthHeaders(
  appClientVersion: string,
  locale?: LanguageCode,
): Promise<Record<string, string>> {
  const deviceId = await getInviteDeviceId()
  // 与 plugins/backend-api.ts 拦截器一致：zh → zh-CN，en/ru 原样
  const languageCode = locale && locale in backendMap ? locale : 'en'
  const headers: Record<string, string> = {
    appVersion: appClientVersion,
    language: backendMap[languageCode],
  }
  if (deviceId)
    headers['R-DEVICE-ID'] = deviceId
  return headers
}
