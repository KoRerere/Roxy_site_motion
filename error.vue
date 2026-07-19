<script setup lang="ts">
import { deprioritizedPosts } from '@/data/deprioritizedPosts'
import { RxIcon } from '@/components/rx-icon'

function reload() {
  window.location.href = `/${window.location.search}`
}

const route = useRoute()
const slug = route.params.slug as string

onMounted(() => {
  console.log('route', route.path)
})
</script>

<template>
  <div class="content">
    <div>
      <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120" fill="none">
        <g clip-path="url(#clip0_31420_93420)">
          <ellipse cx="57.0775" cy="60.2441" rx="38.6517" ry="54.9713" transform="rotate(47.6665 57.0775 60.2441)" fill="url(#paint0_linear_31420_93420)" />
          <path
            d="M70.0817 73.6895C50.7808 91.0653 27.3497 96.504 17.7469 85.8373C8.14402 75.1705 14.9153 51.5375 34.2162 34.1618C53.5171 16.786 78.0387 12.2473 87.6415 22.9141C97.2444 33.5808 89.3825 56.3138 70.0817 73.6895Z"
            fill="white" fill-opacity="0.9"
          />
          <path d="M53.1125 54.776L40.6666 47.3333L24.759 76.428C24.3962 77.0917 25.2153 77.769 25.799 77.2879L53.1125 54.776Z" fill="#C1E7FE" />
          <path d="M67.2978 25.5442L40.6668 47.3333L52.6667 55.3333L68.3372 26.4033C68.696 25.7408 67.881 25.0671 67.2978 25.5442Z" fill="#6CC6FF" />
        </g>
        <defs>
          <linearGradient id="paint0_linear_31420_93420" x1="18.4257" y1="60.2441" x2="213.116" y2="68.3292" gradientUnits="userSpaceOnUse">
            <stop stop-color="#6FD4FF" stop-opacity="0.1" />
            <stop offset="0.721154" stop-color="#5FAFFF" />
          </linearGradient>
          <clipPath id="clip0_31420_93420">
            <rect width="120" height="120" fill="white" />
          </clipPath>
        </defs>
      </svg>
    </div>
    <div class="message">
      <template v-if="deprioritizedPosts.includes($route.params.slug as string)">
        <div class="text">
          <h1 class="section-title">{{ $t('哎呀！这篇文章已经永久下线啦；') }}</h1>
          <p class="pt-1 section-description max-w-260">{{ $t('您寻找的内容已不再提供。我们近期对博客进行了全面升级，现在我们将 100% 专注于为跨境电商、社媒运营和数字营销人员提供最硬核信息的防关联与多账号管理的AI指纹浏览器。') }}</p>
        </div>
        <NuxtLinkLocale to="/blog" class="btn">
          <span>{{ $t('探索最新干货') }}</span>
          <RxIcon name="base/cursor-right" size="16" />
        </NuxtLinkLocale>
      </template>
      <template v-else>
        <div class="text">
          oops, somethings went wrong
        </div>
        <button class="btn" @click="reload">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16" fill="none">
            <path
              d="M7.99992 1.33331C4.32592 1.33331 1.33325 4.32598 1.33325 7.99998C1.33325 11.674 4.32593 14.6666 7.99992 14.6666C11.0327 14.6666 13.6031 12.6347 14.4062 9.85154C14.4305 9.76741 14.4379 9.67933 14.4282 9.5923C14.4184 9.50528 14.3916 9.42104 14.3493 9.34438C14.307 9.26772 14.25 9.20014 14.1815 9.14552C14.1131 9.0909 14.0346 9.05029 13.9504 9.02602C13.8663 9.00173 13.7782 8.99424 13.6912 9.004C13.6042 9.01375 13.5199 9.04056 13.4433 9.08288C13.3666 9.1252 13.299 9.18221 13.2444 9.25064C13.1898 9.31908 13.1492 9.39762 13.1249 9.48175C12.4836 11.7043 10.4379 13.3333 7.99992 13.3333C5.04651 13.3333 2.66659 10.9534 2.66659 7.99998C2.66659 5.04657 5.04651 2.66665 7.99992 2.66665C9.47729 2.66665 10.806 3.26378 11.7721 4.23045C12.407 4.8659 12.7626 5.37907 13.2447 5.99998H10.6666C10.4898 5.99998 10.3202 6.07022 10.1952 6.19524C10.0702 6.32027 9.99992 6.48984 9.99992 6.66665C9.99992 6.84346 10.0702 7.01303 10.1952 7.13805C10.3202 7.26308 10.4898 7.33331 10.6666 7.33331H14.6666C14.7341 7.31698 14.7987 7.29018 14.858 7.25389C14.9279 7.24818 14.9964 7.23148 15.0611 7.20441C15.0791 7.18672 15.096 7.16802 15.1119 7.14841C15.1255 7.13466 15.1386 7.12033 15.151 7.10545C15.2533 6.99191 15.3135 6.84664 15.3215 6.69399C15.3256 6.68496 15.3295 6.67585 15.3333 6.66665V2.66665C15.3333 2.48984 15.263 2.32027 15.138 2.19524C15.013 2.07022 14.8434 1.99998 14.6666 1.99998C14.4898 1.99998 14.3202 2.07022 14.1952 2.19524C14.0702 2.32027 13.9999 2.48984 13.9999 2.66665V4.8281C13.5167 4.21712 13.3125 3.88463 12.7161 3.28774C11.5102 2.08112 9.83775 1.33331 7.99992 1.33331Z"
              fill="#575D60"
            />
          </svg>
          <span>Reload page</span>
        </button>
      </template>
    </div>
  </div>
</template>

<style scoped lang="scss">
.content {
  width: 100dvw;
  height: 100dvh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 24px;
  background: linear-gradient(180deg, #e9f4fc 0%, #fff 100%);
}

.message {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
}

.text {
  color: #1d1e20;
  text-align: center;
  font-family: Inter;
  font-size: 20px;
  font-weight: 500;
  line-height: normal;
}

.btn {
  display: flex;
  min-width: 88px;
  padding: 10px 16px;
  justify-content: center;
  align-items: center;
  gap: 8px;
  border-radius: 8px;
  border: 1px solid #c7d1d6;
  box-shadow:
    0 4px 4px -1px rgba(0, 0, 0, 0.02),
    0 1px 1px 0 rgba(0, 0, 0, 0.06);
  background: #fff;
  cursor: pointer;
  font-family: Inter;
}
</style>
