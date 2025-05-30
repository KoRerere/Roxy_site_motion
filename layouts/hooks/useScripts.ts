export const useScripts = () => {
  const scripts = reactive<any[]>([]);
  const { public: { ENV } } = useRuntimeConfig()
  const isDev = ENV == 'development';

  if (isDev) {
    // 测试环境下使用 ahrefs 做 seo 分析
    scripts.push({
      src: 'https://analytics.ahrefs.com/analytics.js',
      // 我的 wXLWCudG6spgd7KI+fS04A
      'data-key': 'pWhhdvWZr/fhpDi51co32A',
      async: true
    })
  } 

  return scripts
}
