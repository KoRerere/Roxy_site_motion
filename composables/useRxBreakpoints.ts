import { breakpointsTailwind, useBreakpoints } from '@vueuse/core'

export const useRxBreakpoints = () => {
  const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1920 })
  return breakpoints
}
