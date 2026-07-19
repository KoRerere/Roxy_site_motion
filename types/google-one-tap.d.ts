export {}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: Record<string, unknown>) => void
          prompt: (momentListener?: (notification: { isNotDisplayed?: () => boolean; isSkippedMoment?: () => boolean; isDismissedMoment?: () => boolean }) => void) => void
          cancel: () => void
        }
      }
    }
  }
}
