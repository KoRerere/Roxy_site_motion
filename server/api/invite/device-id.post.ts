import { encryptInviteDeviceId } from '~/server/utils/invite-crypto'

/** 为 Invite 登录生成 R-DEVICE-ID（供浏览器非安全上下文回退） */
export default defineEventHandler(async (event) => {
  const body = await readBody<{ visitorId?: string }>(event)
  const visitorId = body?.visitorId?.trim()
  if (!visitorId) {
    throw createError({ statusCode: 400, statusMessage: 'visitorId is required' })
  }
  return { deviceId: encryptInviteDeviceId(visitorId) }
})
