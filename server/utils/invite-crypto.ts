import crypto from 'node:crypto'

// 与客户端 utils/crypto-aes-256-gcm.ts 保持同一套密钥推导逻辑
const SECRET_KEY_B64 = Buffer
  .from('ÓMuÛm÷ã\x8Eyë®ûóÏ}i¦ÛqÇ]yçßÓMuÛm÷ã\x8Eyë®ûóÏ}i¦ÛqÇ]yçß', 'latin1')
  .toString('base64')

function hexToBytes(hex: string): Buffer {
  const bytes = Buffer.alloc(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)
  return bytes
}

/** 局域网 http 等非安全上下文时，由 Nitro 代为加密 deviceId */
export function encryptInviteDeviceId(msg: string): string {
  const key = hexToBytes(SECRET_KEY_B64)
  const nonce = crypto.randomBytes(12)
  const cipher = crypto.createCipheriv('aes-256-gcm', key, nonce)
  const ciphertext = Buffer.concat([cipher.update(msg, 'utf8'), cipher.final()])
  const authTag = cipher.getAuthTag()
  return [ciphertext, nonce, authTag].map(part => part.toString('base64')).join(':')
}
