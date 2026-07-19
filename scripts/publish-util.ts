export function formatDuration(ms: number): string {
  const min = Math.floor(ms / 60_000)
  const sec = Math.floor((ms % 60_000) / 1000)
  return `${min} min ${sec} s`
}

export function createTimer() {
  const start = Date.now()
  return {
    elapsed(): number {
      return Date.now() - start
    },
  }
}
