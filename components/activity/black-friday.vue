<script setup lang="ts">
import { RxIcon } from '../rx-icon'

const { locale } = useRxI18n()
const { width } = useRxWindowSize()
const route = useRoute()

const visible = ref(false)
const isHomePage = computed(() => route.name?.startsWith?.('index_'))
const hideBlackFriday = useLocalStorage('hide-black-friday', false)

const imageUrls = computed(() => ({
  cover: `campaign/modal-${locale.value}`,
  badge: `campaign/badge-${locale.value}`,
}))

if (import.meta.client) {
  const handleHomePage = () => {
    if (isHomePage.value) {
      const homeHero = document.querySelector('main > .hero') as HTMLElement
      if (homeHero && width.value < 1140) {
        homeHero.style.paddingTop = '120px'
      }
      else {
        if (homeHero) {
          homeHero.style.paddingTop = '0'
        }
      }
    }
  }

  watch(width, (newWidth) => {
    document.body.style.paddingTop = newWidth >= 1140 ? '56px' : '0'
    handleHomePage()
  }, { immediate: true, flush: 'post' })

  watch(route, handleHomePage, { immediate: true, flush: 'post' })

  width.value = window.innerWidth
}

function openModal() {
  visible.value = true
}

function hideModal() {
  visible.value = false
}

function closeBar() {
  document.body.style.paddingTop = '0'
  if (isHomePage.value) {
    const homeHero = document.querySelector('main > .hero') as HTMLElement
    if (homeHero)
      homeHero.style.paddingTop = '0'
  }
  hideBlackFriday.value = true
}
</script>

<template>
  <div v-if="(isHomePage || width >= 1140)" class="content relative overflow-hidden -mx-3 xl:mx-0 -z-1 lg:-mx-10 md:-mx-5">
    <div
      class="overlay text-white px-7 py-3 flex flex-col gap-1.5 items-center justify-center md:py-2.5 md:flex-row md:gap-3"
      :class="[
        width > 1140 ? 'h-14' : 'h-31.5',
      ]"
    >
      <!-- PC 端 -->
      <template v-if="width >= 1140">
        <div class="text-4 text-5 leading-24px font-500 font-600 text-center flex items-center en-US:font-[Archivo]">
          <rx-i18n-t
            :keypath="$t('{blackFriday} 圆满结束，活动成交用户总数 {count}', {
              count: '{count}',
              blackFriday: '{blackFriday}',
            })"
          >
            <template #blackFriday>
              <span class="ru-RU:max-3 text-transparent mx-1 bg-[linear-gradient(90deg,#7BCDFF_0%,#F783FF_100%)] bg-clip-text en-US:(text-6 font-700 mx-2)">
                {{ $t('2025 黑五大促') }}
              </span>
            </template>
            <template #count>
              <div class="text-6 text-[#F7CD47] ml-2 mr-1">
                <span class="text-6 font-[JetBrains_Mono] font-800">{{ (9178).toLocaleString() }}</span>
                <span class="text-4 font-400 pl-1">{{ $t('人') }}</span>
              </div>
            </template>
          </rx-i18n-t>
        </div>
        <div class="ml-7 px-3 py-1.5 rounded-md bg-white/20 flex gap-1 cursor-pointer items-center backdrop-blur-16" @click="openModal">
          <RxIcon name="base/rx_ic_eye" size="16" />
          <span class="text-3.5">
            {{ $t("查看详细数据") }}
          </span>
        </div>
      </template>
      <!-- 移动端 -->
      <template v-else>
        <div class="flex flex-col gap-2 items-center">
          <div class="text-5 text-white text-center whitespace-pre-line">
            <rx-i18n-t :keypath="$t('{blackFriday}圆满结束\n活动成交用户总数{count}', { count: '{count}', blackFriday: '{blackFriday}' })">
              <template #blackFriday>
                <span class="text-transparent font-600 mx-1 bg-[linear-gradient(90deg,#7BCDFF_0%,#F783FF_100%)] bg-clip-text">{{ $t('2025 黑五大促') }}</span>
              </template>
              <template #count>
                <span class="text-6 text-[#F7CD47] mx-1">
                  <span class="text-6 font-[JetBrains_Mono] font-800">{{ (9178).toLocaleString() }}</span>
                  <span class="text-4 pl-1">{{ $t('人') }}</span>
                </span>
              </template>
            </rx-i18n-t>
          </div>
          <div class="px-3 py-1.5 rounded-md bg-white/20 flex gap-1 cursor-pointer items-center backdrop-blur-16" @click="openModal">
            <RxIcon name="base/rx_ic_eye" size="16" />
            <span class="text-3.5">{{ $t("查看详细数据") }} </span>
          </div>
        </div>
      </template>

      <div class="flex gap-1.5 cursor-pointer items-center right-5 top-3.5 absolute lg:(top-1/2 -translate-y-1/2)" @click="closeBar">
        <RxIcon name="base/rx_ic_delete" size="16" color="#FFF" />
        <span class="text-3.5">
          {{ $t('关闭') }}
        </span>
      </div>
    </div>
  </div>

  <RxDialog
    v-model:visible="visible"
    modal
    :pt="{
      root: '!bg-transparent !border-none !shadow-none',
      mask: '!backdrop-blur-sm',
      pcCloseButton: { autofocus: false } }
    "
  >
    <template #container>
      <div class="flex flex-col gap-1.5">
        <button class="px-2 py-1.5 rounded bg-white flex gap-1.5 cursor-pointer items-center self-end" @click="hideModal">
          <RxIcon color="#000000" name="base/rx_ic_delete" />
          <span class="text-3.5 text-black leading-normal whitespace-nowrap">{{ $t('关闭') }}</span>
        </button>

        <div class="min-h-447px min-w-360px relative">
          <svg width="560" height="503" viewBox="0 0 560 503" fill="none" xmlns="http://www.w3.org/2000/svg" class="hidden md:block">
            <g clip-path="url(#clip0_4986_30122)">
              <rect width="560" height="503" rx="20" fill="black" />
              <g filter="url(#filter0_f_4986_30122)">
                <ellipse cx="572.375" cy="554.96" rx="259.251" ry="108.205" transform="rotate(-79.1739 572.375 554.96)" fill="#4600A2" />
              </g>
              <g filter="url(#filter1_f_4986_30122)">
                <ellipse cx="354.767" cy="658.953" rx="259.251" ry="108.205" transform="rotate(-37.3251 354.767 658.953)" fill="#FAAD7D" />
              </g>
              <g filter="url(#filter2_f_4986_30122)">
                <ellipse cx="108.876" cy="-49.2388" rx="251.993" ry="106.639" transform="rotate(-18.6887 108.876 -49.2388)" fill="#1C95FF" />
              </g>
            </g>
            <defs>
              <filter id="filter0_f_4986_30122" x="328.459" y="172.517" width="487.833" height="764.887" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="63.4921" result="effect1_foregroundBlur_4986_30122" />
              </filter>
              <filter id="filter1_f_4986_30122" x="11.3782" y="352.733" width="686.778" height="612.441" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="63.4921" result="effect1_foregroundBlur_4986_30122" />
              </filter>
              <filter id="filter2_f_4986_30122" x="-259.278" y="-305.549" width="736.309" height="512.621" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="63.4921" result="effect1_foregroundBlur_4986_30122" />
              </filter>
              <clipPath id="clip0_4986_30122">
                <rect width="560" height="503" rx="20" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <svg class="block md:hidden" width="360" height="538" viewBox="0 0 360 538" fill="none" xmlns="http://www.w3.org/2000/svg">
            <g clip-path="url(#clip0_4990_30704)">
              <rect width="360" height="538" rx="12" fill="black" />
              <g filter="url(#filter0_f_4990_30704)">
                <ellipse cx="399.375" cy="589.96" rx="259.251" ry="108.205" transform="rotate(-79.1739 399.375 589.96)" fill="#4600A2" />
              </g>
              <g filter="url(#filter1_f_4990_30704)">
                <ellipse cx="181.767" cy="693.953" rx="259.251" ry="108.205" transform="rotate(-37.3251 181.767 693.953)" fill="#FAAD7D" />
              </g>
              <g filter="url(#filter2_f_4990_30704)">
                <ellipse cx="11.8765" cy="-49.2388" rx="251.993" ry="106.639" transform="rotate(-18.6887 11.8765 -49.2388)" fill="#1C95FF" />
              </g>
            </g>
            <defs>
              <filter id="filter0_f_4990_30704" x="155.459" y="207.517" width="487.833" height="764.887" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="63.4921" result="effect1_foregroundBlur_4990_30704" />
              </filter>
              <filter id="filter1_f_4990_30704" x="-161.622" y="387.733" width="686.778" height="612.441" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="63.4921" result="effect1_foregroundBlur_4990_30704" />
              </filter>
              <filter id="filter2_f_4990_30704" x="-356.278" y="-305.549" width="736.309" height="512.621" filterUnits="userSpaceOnUse" color-interpolation-filters="sRGB">
                <feFlood flood-opacity="0" result="BackgroundImageFix" />
                <feBlend mode="normal" in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
                <feGaussianBlur stdDeviation="63.4921" result="effect1_foregroundBlur_4990_30704" />
              </filter>
              <clipPath id="clip0_4990_30704">
                <rect width="360" height="538" rx="12" fill="white" />
              </clipPath>
            </defs>
          </svg>
          <div class="px-5 py-9 flex flex-col w-full position-y-center items-center md:px-12">
            <div class="px-3.5 border-1 border-white/20 rounded-full border-solid bg-[linear-gradient(90deg,rgba(255,255,255,0.20)_0%,transparent_100%)] flex gap-1.5 h-9 items-center">
              <span class="text-5 text-[#F7CD47] leading-19px font-[JetBrains_Mono] font-[JetBrains_Mono] font-700">38.1%</span>
              <span class="text-white max-md:ru-RU:text-3">{{ $t('用户选择续费') }}</span>
            </div>
            <div class="text-6 text-white font-800 mt-3.5 text-center md:text-9 ru-RU:text-4.5 md:ru-RU:text-5">
              {{ $t('2025 黑五活动成交用户总数') }}
            </div>
            <div class="text-[#F7CD47] flex flex-wrap items-baseline justify-center">
              <span class="text-15 font-[JetBrains_Mono] font-800 md:text-20 ru-RU:text-12">{{ (9178).toLocaleString() }}</span>
              <span class="text-6 font-600 md:text-10 ru-RU:text-4">{{ $t('人') }}</span>
            </div>
            <div class="text-white mt-6 flex flex-col gap-3 w-full justify-center md:flex-row md:gap-8">
              <div
                v-for="item in [
                  { value: 417180, unit: $t('个窗口'), label: $t('总计购买窗口数') },
                  { value: 3171, unit: $t('条代理 IP'), label: $t('总计购买代理 IP 数') },
                ]"
                :key="item.value"
                class="flex flex-1 flex-col gap-1.5 items-center"
              >
                <div class="flex gap-1.5 whitespace-nowrap items-center justify-center">
                  <div class="text-6 leading-32px font-[JetBrains_Mono] font-700">
                    {{ item.value.toLocaleString() }}
                  </div>
                  <div class="text-white/80 leading-20px font-500">
                    {{ item.unit }}
                  </div>
                </div>
                <div class="text-white/80 leading-20px font-500 text-center">
                  {{ item.label }}
                </div>
              </div>
            </div>
            <CtaDownloadBtnByHome class="mt-8">
              {{ $t('下载体验 RoxyBrowser') }}
            </CtaDownloadBtnByHome>
          </div>
          <rx-responsive-image class="w-25.5 hidden z-1 md:block -bottom-3 -right-3 !absolute" :name="imageUrls.badge" />
        </div>
      </div>
    </template>
  </RxDialog>
</template>

<style lang="scss" scoped>
.content {
  background-color: #0b121d;
  background-image: radial-gradient(50% 1329.46% at 50% 50%, rgba(17, 163, 253, 0.4) 0%, rgba(17, 163, 253, 0) 100%);
}

.pricing {
  transition: background 0.3s ease;
  background: var(--colors-background-bg-brand, #11a3fd);

  &:hover {
    background: var(--colors-background-bg-brand-hover, #0f93e4);
  }
}

.detail {
  transition: background 0.3s ease;
  background: var(--colors-alpha-alpha-white-20, rgba(255, 255, 255, 0.2));
  backdrop-filter: blur(16px);

  &:hover {
    background: var(--colors-alpha-alpha-white-20-hover, rgba(255, 255, 255, 0.3));
  }
}
</style>
