import type { ShallowRef } from "vue"
import { useScroll, useMotionValueEvent } from 'motion-v'

export const useBackTop = (ref: Readonly<ShallowRef<HTMLElement | null>>) => {
  const { $eventBus } = useNuxtApp()

  onMounted(() => {
    const offset = (window.innerHeight - 208 + 'px') as `${number}px`
    const { scrollYProgress } = useScroll({
      target: ref,
      offset: [`start ${offset}`, `end ${offset}`]
    })

    useMotionValueEvent(scrollYProgress, 'change', (latest) => {
      $eventBus.emit('backTopReached', latest > 0 && latest < 1)
    })
  })
}