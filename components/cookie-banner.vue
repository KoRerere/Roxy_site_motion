<template>
  <div :class="cn('z-100 bg-white shadow-[0px_-2px_12px_0px_rgba(0,0,0,0.04)] fixed', rootWrapperClasses)" v-show="show">
    <div :class="cn({ 'rx-header': !currentPath.includes('pricing') || !lgWidth })">
      <div :class="cn(wrapperClasses)">
        <p class="text-[14px] leading-22px text-primary">
          <rx-i18n-t 
            :keypath="$t('我们使用 Cookie 和类似技术（包括第三方 Cookie）来提升您在我们网站上的体验。继续使用本网站，即表示您同意我们依据《{privacyPolicy}》收集和使用相关数据。', { 
              privacyPolicy: '{privacyPolicy}' })"
          >
            <template #privacyPolicy>
              <NuxtLinkLocale class="text-[#11A3FD] underline" to="/copyright/privacy">{{ $t("隐私政策") }}</NuxtLinkLocale>
            </template>
          </rx-i18n-t>
        </p>
        <div class="flex items-center gap-3">
          <button @click="accept" class="btn bg-[#11A3FD] text-white">
            {{ $t('接受所有 Cookie') }}
          </button>
          <button @click="reject" class="btn md:w-160px">
            {{ $t('拒绝所有 Cookie') }}
          </button> 
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const show = ref(false)
const gdpr = useGDPR()
const route = useRoute()
const breakpoints = useRxBreakpoints();
const lgWidth = breakpoints.greaterOrEqual('lg')
const currentPath = ref();

watch(() => route.path, (newPath) => {
  currentPath.value = newPath
}, { immediate: true })

const rootWrapperClasses = computed(() => {
  return lgWidth.value && currentPath.value.includes('pricing') ? 'left-6 bottom-6 rounded-2' : 'py-4 bottom-0 left-0 right-0'
})

const wrapperClasses = computed(() => {
  return lgWidth.value && currentPath.value.includes('pricing') ? 'p-6 flex flex-col gap-6 w-600px' : 'flex-col md:flex-row flex items-center justify-between gap-5 md:gap-10 xl:gap-20'
})

const storeKey = 'cookie-consent'

const accept = () => {
  localStorage.setItem(storeKey, '1')
  show.value = false
  gdpr()
}

const reject = () => {
  localStorage.setItem(storeKey, '2')
  show.value = false
}

onMounted(() => {
  const content = localStorage.getItem(storeKey);
  show.value = !content;
  if (content === '1') {
    gdpr()
  }
})
</script>

<style scoped>
.btn {
  @apply w-140px md:w-180px h-10 rounded-1 flex items-center justify-center border-none cursor-pointer;
}
</style>
