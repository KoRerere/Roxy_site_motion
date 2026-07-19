import { defineEventHandler, readRawBody, getHeader, createError } from 'h3'
import { exec } from 'child_process'
import crypto from 'crypto'

let isRestarting = false

// https://github.com/nuxt-modules/sitemap/issues/329
// 临时解决，等官方修复就可以去掉了，还需要在 ghost 管理端去掉 webhook：进入 Settings → Integrations → Webhooks
export default defineEventHandler(async (event) => {
    // const rawBody = await readRawBody(event)
  const signature = getHeader(event, 'x-ghost-signature')
  console.log('文章已更新，触发重新部署', signature)

    // 校验 Ghost 签名，避免恶意触发
    // const hmac = crypto.createHmac('sha256','1234567890')
    // hmac.update(rawBody, 'utf8')
    // const expected = `sha256=${hmac.digest('hex')}`
    // console.log('expected', expected);
    if (!signature?.startsWith?.('sha256=')) {
        throw createError({ statusCode: 401, statusMessage: 'Invalid signature' })
    }

  // 触发 pm2 重启 Nuxt 服务
  if (isRestarting) {
    return { success: true, message: 'Nuxt is already restarting' }
  }
  isRestarting = true
  exec(`pm2 restart roxy_home`, (error, stdout, stderr) => {
    isRestarting = false
    if (error) {
      console.error(`[Webhook] PM2 restart failed: ${stderr}`)
    } else {
      console.log(`[Webhook] PM2 restart success: ${stdout}`)
    }
  })

  return { success: true, message: 'PM2 restart triggered' }
})
