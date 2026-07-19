interface JuneRechargePromoTime {
  start_timestamp: number
  end_timestamp: number
  server_utc_timestamp: number
  type: number
  min_amount: number
  recharge_benefits: Array<{ amount: number, discount: number }>
}

interface ApiResponse<T> {
  code: number
  data: T
}

export interface TopUpCountdown {
  days: number
  hours: number
  minutes: number
  seconds: number
}

const EMPTY_COUNTDOWN: TopUpCountdown = { days: 0, hours: 0, minutes: 0, seconds: 0 }

function calcCountdown(endTimestamp: number, serverNow: number): TopUpCountdown {
  const diff = endTimestamp - serverNow
  if (diff <= 0)
    return EMPTY_COUNTDOWN

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export function padTopUpCountdownTime(value: number) {
  return String(value).padStart(2, '0')
}

let countdownTimer: ReturnType<typeof setInterval> | undefined
let countdownConsumers = 0

export function useTopUpPromoCountdown() {
  const promoTime = useState<JuneRechargePromoTime | null>('top-up-promo-time', () => null)
  const serverOffset = useState('top-up-promo-server-offset', () => 0)
  const countdown = useState<TopUpCountdown>('top-up-promo-countdown', () => ({ ...EMPTY_COUNTDOWN }))

  function getServerNow() {
    return Date.now() + serverOffset.value
  }

  function updateCountdown() {
    const endTimestamp = promoTime.value?.end_timestamp
    if (!endTimestamp) {
      countdown.value = { ...EMPTY_COUNTDOWN }
      return
    }
    countdown.value = calcCountdown(endTimestamp, getServerNow())
  }

  async function fetchPromoTime() {
    const { $httpClient } = useNuxtApp()
    const res = await $httpClient.request<ApiResponse<JuneRechargePromoTime>>({
      path: '/get_june_recharge_promo_time',
      method: 'GET',
      format: 'json',
    })

    if (res.code !== 0 || !res.data)
      return

    promoTime.value = res.data
    serverOffset.value = res.data.server_utc_timestamp - Date.now()
    updateCountdown()
  }

  const isPromoActive = computed(() => {
    const data = promoTime.value
    if (!data)
      return true

    const now = getServerNow()
    return now >= data.start_timestamp && now < data.end_timestamp
  })

  function startCountdownTimer() {
    countdownConsumers += 1
    if (countdownTimer)
      return

    updateCountdown()
    countdownTimer = setInterval(updateCountdown, 1000)
  }

  function stopCountdownTimer() {
    countdownConsumers = Math.max(0, countdownConsumers - 1)
    if (countdownConsumers > 0 || !countdownTimer)
      return

    clearInterval(countdownTimer)
    countdownTimer = undefined
  }

  if (import.meta.client) {
    onMounted(async () => {
      if (!promoTime.value)
        await fetchPromoTime()
      else
        updateCountdown()

      startCountdownTimer()
    })

    onUnmounted(() => {
      stopCountdownTimer()
    })
  }

  return {
    countdown,
    isPromoActive,
    promoTime,
    fetchPromoTime,
    padTime: padTopUpCountdownTime,
  }
}
