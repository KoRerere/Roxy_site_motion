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
  } else {
    // 需要使用 Cookie 通知弹窗（Cookie Consent Banner），用户点击确认才加载脚本，否则会违反隐私法规

    // google 分析用户行为 
    // scripts.push({
    //   src: 'https://www.googletagmanager.com/gtag/js?id=G-7D8MGG4CHF',
    //   async: true
    // })
    // scripts.push({
    //   innerHTML: `
    //     window.dataLayer = window.dataLayer || []; 
    //     function gtag(){dataLayer.push(arguments);} 
    //     gtag('js', new Date()); 
    //     gtag('config', 'G-7D8MGG4CHF');
    //   `
    // })

    // ahrefs 分析用户量
    // scripts.push({
    //   src: 'https://analytics.ahrefs.com/analytics.js',
    //   'data-key': 'QYmnMtFWzDAGlkP8hAbbDw',
    //   async: true
    // })
  }

  return scripts
}
