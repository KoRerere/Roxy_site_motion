// 固定密钥（32字节）- 与 roxy-browser / Electron 端保持一致
const SECRET_KEY_HEX = btoa('ÓMuÛm÷ãyë®ûóÏ}i¦ÛqÇ]yçßÓMuÛm÷ãyë®ûóÏ}i¦ÛqÇ]yçß')

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2)
  for (let i = 0; i < hex.length; i += 2)
    bytes[i / 2] = Number.parseInt(hex.slice(i, i + 2), 16)
  return bytes
}

function bytesToBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let i = 0; i < bytes.byteLength; i++)
    binary += String.fromCharCode(bytes[i])
  return btoa(binary)
}

async function importKey(): Promise<CryptoKey> {
  const keyBytes = hexToBytes(SECRET_KEY_HEX)
  return window.crypto.subtle.importKey(
    'raw',
    keyBytes as unknown as BufferSource,
    { name: 'AES-GCM' },
    false,
    ['encrypt'],
  )
}

/** AES-GCM 加密，返回格式: ciphertext:nonce:authTag (Base64) */
export async function encryptAESGCM(msg: string): Promise<string> {
  const key = await importKey()
  const iv = window.crypto.getRandomValues(new Uint8Array(12))
  const encryptedBuffer = await window.crypto.subtle.encrypt(
    { name: 'AES-GCM', iv },
    key,
    new TextEncoder().encode(msg),
  )
  const encryptedBytes = new Uint8Array(encryptedBuffer)
  const authTagLength = 16
  const ciphertext = encryptedBytes.slice(0, -authTagLength)
  const authTag = encryptedBytes.slice(-authTagLength)
  return [
    bytesToBase64(ciphertext),
    bytesToBase64(iv),
    bytesToBase64(authTag),
  ].join(':')
}
