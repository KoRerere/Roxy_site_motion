/**
 * Invite 落地页图文/视频资源：中文用 _zh，英文与俄文用 _en
 * 资源目录：assets/images/intive/info-section-img-{1-4}_{zh|en}.png
 * 第五部分视频：public/home/mcp-agent/mcp-{zh|en}.mp4
 */
export function useInviteLocaleMedia() {
  const { isZh } = useRxI18n()

  /** 图片文件名后缀 */
  const imageSuffix = computed(() => (isZh.value ? '_zh' : '_en'))

  /** 第 1-4 部分功能配图 */
  function getInviteSectionImage(index: 1 | 2 | 3 | 4) {
    return `intive/info-section-img-${index}${imageSuffix.value}`
  }

  /** 第五部分 AI 视频 */
  const inviteAgentVideoSrc = computed(() =>
    isZh.value ? '/home/mcp-agent/mcp-zh.mp4' : '/home/mcp-agent/mcp-en.mp4',
  )

  return {
    imageSuffix,
    getInviteSectionImage,
    inviteAgentVideoSrc,
  }
}
