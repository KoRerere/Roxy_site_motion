
// 这些页面在生产环境不可访问，如果访问自动跳转至首页
const experimentalRoutes = ['/figma-icons', '/anbin'];

export default defineNuxtRouteMiddleware((to, from) => {
  const { public: { NODE_ENV } } = useRuntimeConfig()
  if (experimentalRoutes.includes(to.path) && NODE_ENV === 'production') {
    return navigateTo('/')
  }
})