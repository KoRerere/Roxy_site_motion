function normalizeQueryValue(value: unknown) {
  if (Array.isArray(value))
    return value[0] == null ? '' : String(value[0])
  return value == null ? '' : String(value)
}

export default defineNuxtRouteMiddleware((to) => {
  if (to.path !== '/')
    return

  const code = normalizeQueryValue(to.query.code)
  if (!code)
    return

  const query = { ...to.query }
  delete query.code

  return navigateTo({
    path: `/invite/${encodeURIComponent(code)}`,
    query,
    hash: to.hash,
  }, { replace: true })
})
