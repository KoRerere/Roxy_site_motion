import { breakpointsTailwind, useBreakpoints, useMediaQuery } from '@vueuse/core'

export function useRxBreakpoints() {
  const breakpoints = useBreakpoints(breakpointsTailwind, { ssrWidth: 1920 })
  return breakpoints
}

export function useRxMaxLg() {
  return useMediaQuery('(max-width: 1024px)')
}

export function useRxMaxMd() {
  return useMediaQuery('(max-width: 768px)')
}

export function useRxMaxSm() {
  return useMediaQuery('(max-width: 640px)')
}

export function useRxMinXl() {
  return useMediaQuery('(min-width: 1280px)')
}
