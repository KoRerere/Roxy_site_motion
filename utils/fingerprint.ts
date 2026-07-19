export async function getFingerprint() {
  const FingerprintJS = await import('@fingerprintjs/fingerprintjs')
  // 加载指纹 agent
  return FingerprintJS.default.load()
}
