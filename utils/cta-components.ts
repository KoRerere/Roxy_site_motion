// text-[#11A3FD] text-[#11A3FD] rounded-3 px-11 py-7 relative flex flex-col gap-5"
export function setupCTA(params: string) {
  // params 需要 匹配 title="Unblock Your Reddit with RoxyBrowser" desc="Use another identity to unblock your account." style="1" 这样的参数
  const title = params.match(/title="([^"]+)"/)?.[1] || ''
  const desc = params.match(/desc="([^"]+)"/)?.[1] || ''
  const style = params.match(/style="([^"]+)"/)?.[1] || '1'
  const btnText = params.match(/btnText="([^"]+)"/)?.[1] || 'Download Now'
  const btnLink = params.match(/btnLink="([^"]+)"/)?.[1] || ''
  // 是否需要启动应用， launchApp="true"
  // 启动应用时，是否要打开某个页面，launchUrl="/referral-program"
  const launchUrl = params.match(/launchUrl="([^"]+)"/)?.[1] || ''
  // 启动应用按钮文本
  const launchBtnText = params.match(/launchBtnText="([^"]+)"/)?.[1] || ''

  return `<cta-download style-type="${style}" title="${title}" desc="${desc}" btn-text="${btnText}" btn-link="${btnLink}"
   launch-url="${launchUrl}" launch-btn-text="${launchBtnText}"></cta-download>`
}
