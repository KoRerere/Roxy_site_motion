import { useIntersectionObserver } from '@vueuse/core'

/**
 * Invite 落地页视口懒加载：进入视口（含 rootMargin 预加载区）后一次性置 true
 */
export function useInviteInView(rootMargin = '200px 0px') {
  const targetRef = ref<HTMLElement | null>(null)
  const isInView = ref(false)

  const { stop } = useIntersectionObserver(
    targetRef,
    ([entry]) => {
      if (entry?.isIntersecting) {
        isInView.value = true
        stop()
      }
    },
    { rootMargin },
  )

  onBeforeUnmount(() => stop())

  return { targetRef, isInView }
}
