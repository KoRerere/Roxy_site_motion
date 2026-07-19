<script setup lang="ts">
import type { Platform } from '@/utils/detect-platform'
import { DOMParser } from 'linkedom'
import CertificationNew from '@/components/page-home/certification-new.vue'
import { RxIcon } from '@/components/rx-icon'
import EffectBg from './EffectBg.vue'

const { $t } = useRxI18n()
const { getDownloadVersions, initializeDownload, downloadPlatform } = useDownload()
const { locale } = useI18n()

function handleDownload(platform: Platform) {
  // e.preventDefault()
  // triggerAutoDownload()
  downloadPlatform(platform)
}

onMounted(() => {
  setTimeout(() => {
    initializeDownload()
  }, 1000)
})

const { public: { roxyHomeUrl } } = useRuntimeConfig()

const { data: appversions } = await useAsyncData('get_version_list_by_download', async (_nuxtApp) => {
  const response: any = await $fetch(`${roxyHomeUrl}/app_statistics/get_version_list`, {
    method: 'GET',
    params: {
      page_index: 1,
      page_size: 6,
      os: 'Windows',
      osBit: 64,
    },
  })

  function parseHTML(html: string) {
    const raw = (html ?? '').trim()
    const hasHtmlTag = /<html[\s>]/i.test(raw)
    const wrapped = hasHtmlTag
      ? raw
      : `<!DOCTYPE html><html><body>${raw}</body></html>`
    const doc = new DOMParser().parseFromString(wrapped, 'text/html')
    if (!(doc as any).documentElement || !doc.body) {
      const fallback = new DOMParser().parseFromString(`<!DOCTYPE html><html><body>${raw}</body></html>`, 'text/html')
      return fallback
    }
    return doc
  }

  function extractTextFromHtml(html: string) {
    const doc = parseHTML(html)
    const body = (doc.body ?? (doc as any)) as Element

    // 删除所有媒体元素，避免图片等干扰摘要
    body.querySelectorAll('img,video,audio,source,picture,iframe,embed').forEach((el) => {
      el.remove()
    })

    // 删除所有内联样式
    body.querySelectorAll('*').forEach((el) => {
      el.removeAttribute('style')
    })

    const text = (body.textContent ?? '')
      .replace(/\u00A0/g, ' ')
      .replace(/\s+/g, ' ')
      .trim()

    return text
  }

  function getUpgradeSummaryByLocale(item: any, contentKey: string, tipsLocaleKey: string) {
    const tips = item.newFeatureTips?.[tipsLocaleKey] ?? []
    const tipsHtml = Array.isArray(tips) ? tips.map((tip: any) => tip.content).join('') : ''

    // 有 newFeatureTips 时优先使用 newFeatureTips，否则回退到 upgradeContent 字段
    const html = tipsHtml || item[contentKey] || ''
    return extractTextFromHtml(html)
  }

  const rows = response.data.rows
    .filter(shouldShowVersionItem)
    .map((item: any) => ({
      ...item,
      upgradeContent: getUpgradeSummaryByLocale(item, 'upgradeContent', 'zh-CN'),
      upgradeContentEn: getUpgradeSummaryByLocale(item, 'upgradeContentEn', 'en'),
      upgradeContentRu: getUpgradeSummaryByLocale(item, 'upgradeContentRu', 'ru'),
    }))

  return { rows }
})

/** 统一 versionType 判断，避免接口大小写/下划线不一致 */
function resolveVersionType(versionType: unknown) {
  const type = String(versionType ?? '').toLowerCase().replace(/_/g, '')
  if (type === 'app')
    return 'app'
  if (type === 'firefoxcore' || type === 'firefox')
    return 'firefoxCore'
  return 'core'
}

/** 接口无内容时返回 {}，有内容时包含 zh-CN / en / ru 等语言 key */
function hasNewFeatureTips(newFeatureTips: unknown) {
  if (!newFeatureTips || typeof newFeatureTips !== 'object')
    return false
  return Object.keys(newFeatureTips).length > 0
}

/** 是否为 Firefox 内核类型（仅此类走 newFeatureTips 过滤） */
function isFirefoxCoreVersion(versionType: unknown) {
  const type = String(versionType ?? '').toLowerCase().replace(/_/g, '')
  return type === 'firefoxcore' || type === 'firefox'
}

/** 仅过滤 Firefox 内核：无 newFeatureTips 时不展示；app / core 等其他类型不受影响 */
function shouldShowVersionItem(item: { versionType?: unknown, newFeatureTips?: unknown }) {
  if (!isFirefoxCoreVersion(item.versionType))
    return true
  return hasNewFeatureTips(item.newFeatureTips)
}

const items = ref<any[]>(appversions.value?.rows ?? [])

watch(appversions, (val) => {
  if (val) {
    items.value = val.rows ?? []
  }
}, { immediate: false })

function formatDate(time: string) {
  if (!time)
    return '--'
  const timestamp = new Date(time).getTime()
  const diff = (Date.now() - timestamp) / 1000
  const day = Math.ceil(diff / 86400)

  if (day > 10) {
    return time.split(' ')[0]!.replace(/-/g, '/')
  }
  else if (day > 2) {
    return $t('{day} 天前', { day })
  }
  else if (day > 1) {
    return $t('昨天')
  }
  else {
    return $t('今天')
  }
}

const { isDark } = useTheme()

const securityCertificates = computed(() => {
  const theme = isDark.value ? 'dark' : 'light'
  return [
    `/download/security/${theme}/Norton.svg`,
    `/download/security/${theme}/Bitdefender.svg`,
    `/download/security/${theme}/McAfee.svg`,
    `/download/security/${theme}/Kaspersky.svg`,
    `/download/security/${theme}/Avira.svg`,
  ]
})
</script>

<template>
  <div class="download-page relative">
    <img src="/bg-effect.svg" alt="" class="max-h-650px w-full left-0 top-0 absolute z-0">

    <Container class="pt-33 flex flex-col items-center relative z-10">
      <div class="px-3 py-2 rounded-full flex flex-col gap-2 w-fit items-center md:bg-white md:flex-row md:gap-4">
        <div
          v-for="item in [
            { title: $t('支持 Chrome'), icon: 'color/rx-ic-chrome' },
            { title: $t('支持 Firefox'), icon: 'color/rx-ic-firefox', isComingSoon: true },
          ]" :key="item.icon"
          class="text-15px text-primary leading-normal flex gap-1.5 items-center dark:max-md:text-[#FAFAFA]"
        >
          <RxIcon :name="item.icon" :size="18" />
          {{ item.title }}
          <!-- <div v-if="item.isComingSoon" class="text-13px text-tertiary leading-normal dark:max-md:text-inactive">
            {{ $t('（即将上线）') }}
          </div> -->
        </div>
      </div>
      <h1
        class="text-9 text-primary font-700 multilingual-text mt-6 text-center whitespace-pre-line md:text-h3 dark:text-[#FAFAFA] max-md:leading-normal"
      >
        {{ $t('下载 RoxyBrowser 指纹浏览器') }}
      </h1>
      <p
        class="text-sub-title text-tertiary leading-normal font-400 pt-2 text-center whitespace-pre-line dark:text-white/60"
      >
        {{ $t('请根据你的系统下载对应版本，开始安全、稳定的多账户浏览体验。') }}
      </p>
    </Container>

    <div class="h-250px hidden relative lg:block -top-12.5">
      <ClientOnly>
        <EffectBg />
      </ClientOnly>
    </div>

    <Container>
      <!-- 下载面板 -->
      <div class="pt-10 flex flex-col gap-5 w-full lg:flex-row">
        <div
          v-for="(item, index) in getDownloadVersions" :key="index"
          class="download-card px-6 py-8 flex flex-1 flex-col gap-8 items-center sm:px-8 lg:w-auto"
        >
          <div>
            <img :src="item.icon" draggable="false" class="size-100px max-w-unset select-none" alt="Download Icon">
          </div>

          <div class="flex flex-1 flex-col gap-4">
            <div class="flex flex-1 flex-col gap-3 justify-center">
              <template v-for="(btn, i) in item.download">
                <div v-if="btn.effect" :key="`${i}-${btn.text}`" @click="handleDownload(btn.platform)">
                  <CtaDownloadBtnByHome
                    :download="btn.fileName" class="download-btn" :auto-download="false"
                    :icon-size="16" :btn-text="btn.text" tag="div"
                  />
                </div>
                <button
                  v-else :key="`${btn.text}`" :class="cn('download-btn', btn.class)"
                  @click="handleDownload(btn.platform)"
                >
                  <span class="text-14px flex gap-2 items-center justify-center">
                    <RxIcon name="base/rx_ic_download" />
                    {{ btn.text }}
                  </span>
                </button>
              </template>
            </div>

            <div class="text-14px text-primary font-500 flex flex-col gap-6px dark:text-[#FAFAFA]">
              <div>{{ item.latestVersion }}</div>
              <div>{{ item.releaseDate }}</div>
            </div>

            <p class="text-3 text-[#898989] leading-normal whitespace-pre-line .dark:text-[#B6B6B6]">
              {{ item.p }}
            </p>
          </div>
        </div>
      </div>

      <!-- 安全认证 -->
      <div class="text-primary mx-auto mt-15 text-center w-full dark:text-[#FAFAFA] en-US:font-[Archivo] md:w-5/6">
        <h3 class="text-h6 leading-36px font-600">
          {{ $t('为 100+ 平台业务安全护航') }}
        </h3>
        <p class="text-3.4 text-tertiary leading-20px font-500 mt-2 lg:text-4 dark:text-white/60">
          {{ $t('RoxyBrowser 全面通过多场景业务测试，支持超 100 个平台，保障业务稳定高效运行。') }}
        </p>
        <ClientOnly>
          <div class="mt-9 flex flex-wrap gap-5 items-center justify-center xl:flex-nowrap lg:gap-20">
            <img
              v-for="item in securityCertificates" :key="item" :src="item" draggable="false"
              class="max-w-unset min-h-9 select-none" alt=""
            >
          </div>
        </ClientOnly>
      </div>
      <CertificationNew :with-dark="true" :with-container="false" class="mt-15" />

      <!-- 更新日志 -->
      <div class="mx-auto mt-15 w-full lg:mt-10 md:w-5/6">
        <h3
          class="text-8 text-[#111213] leading-12 font-[Archivo] font-700 md:text-6.5 dark:text-[#FAFAFA] md:leading-9 md:pl-5"
        >
          {{ $t('更新日志') }}
        </h3>
        <div class="mt-8 flex flex-col gap-6 md:mt-6 md:gap-3">
          <NuxtLinkLocale
            v-for="(item, index) in items" :key="item.id ?? index"
            class="logs rounded-3 flex flex-col gap-3 cursor-pointer md:pa-5 md:pt-4 hover:bg-[#E7E8EB] dark:hover:bg-[#202C3E]"
            :to="`/changelog#${item.id}`"
          >
            <div class="flex gap-3">
              <img
                v-if="resolveVersionType(item.versionType) === 'app'"
                class="h-6 w-6"
                src="/download/app-logo.png"
                alt="Version Logo"
              >
              <img
                v-else-if="resolveVersionType(item.versionType) === 'core'"
                class="h-6 w-6"
                src="/download/kernel-logo.png"
                alt="Version Logo"
              >
              <img
                v-else
                class="h-6 w-6"
                src="/download/firefox_icon.png"
                alt="Version Logo"
              >
              <div class="flex flex-col gap-3 items-start md:flex-row md:items-center">
                <div
                  class="text-4.5 text-[#111213] leading-6 font-[Archivo] font-600 pt-0.5 dark:text-[#FAFAFA] md:pt-0"
                >
                  {{ resolveVersionType(item.versionType) === 'app' ? $t('应用更新') : $t('内核更新') }}
                </div>
                <div
                  class="text-3 text-white leading-4 font-[JetBrains_Mono] font-500 px-2.5 py-1 rounded-full version-badge"
                  :class="{
                    'version-badge--app': resolveVersionType(item.versionType) === 'app',
                    'version-badge--core': resolveVersionType(item.versionType) === 'core',
                    'version-badge--firefox': resolveVersionType(item.versionType) === 'firefoxCore',
                  }"
                >
                  {{
                    resolveVersionType(item.versionType) === 'app'
                      ? item.version
                      : resolveVersionType(item.versionType) === 'firefoxCore'
                        ? `Firefox ${item.coreVersion}`
                        : `chromium ${item.coreVersion}`
                  }}
                </div>
              </div>
              <div class="text-3.5 text-[#34393D] leading-4 mx-auto mr-0 dark:text-[#B2B6B8]">
                {{ formatDate(item.releaseTime) }}
              </div>
            </div>
            <div
              v-if="locale === 'zh'"
              class="text-3.5 text-[#34393D] leading-5 pl-9 ellipsis-2 dark:text-[#CDCFD0] md:ellipsis-1"
            >
              {{ item.upgradeContent }}
            </div>
            <div
              v-if="locale === 'en'"
              class="text-3.5 text-[#34393D] leading-5 pl-9 ellipsis-2 dark:text-[#CDCFD0] md:ellipsis-1"
            >
              {{ item.upgradeContentEn }}
            </div>
            <div
              v-if="locale === 'ru'"
              class="text-3.5 text-[#34393D] leading-5 pl-9 ellipsis-2 dark:text-[#CDCFD0] md:ellipsis-1"
            >
              {{ item.upgradeContentRu }}
            </div>
          </NuxtLinkLocale>
        </div>
      </div>
      <div class="pb-15 pt-10 flex justify-center md:pt-8">
        <NuxtLinkLocale
          class="text-4 text-[#34393D] leading-5 font-500 px-6 py-3 border-1 border-[#C7D1D6] rounded-2 border-solid inline-flex gap-1 items-center justify-center dark:text-[#CDCFD0] dark:border-[#48555B]"
          to="/changelog"
        >
          <span>{{ $t("查看更多更新日志") }}</span>
          <RxIcon class="text-[#353739] dark:text-[#B8BFC3]" name="base/rx_ic_chevron_right" size="20px" />
        </NuxtLinkLocale>
      </div>
    </Container>
  </div>
</template>

<style scoped>
.download-page {
  /* background: linear-gradient(180deg, #f4f5f5 20%, #fff 100%); */
  background: #f4f5f5;
}

[data-theme='dark'] .download-page {
  background: linear-gradient(180deg, #010f26 43.36%, #4d4447 204.98%);
  color: #fff;
}

.logs {
  border: 1px solid transparent;
}

.logs:hover {
  border-color: rgba(255, 255, 255, 0.12);
}

/* 版本标签背景色写死在 scoped，避免动态 Uno 类未生成 */
.version-badge--app {
  background-color: #00b845;
}

.version-badge--core {
  background-color: #11a3fd;
}

.version-badge--firefox {
  background-color: #ff9a11;
}

.download-card {
  border-radius: 12px;
  border: 1px solid #ececec;
  background: rgba(255, 255, 255, 0.6);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(6px);
}

[data-theme='dark'] .download-card {
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0px 2px 8px 0px rgba(0, 0, 0, 0.05);
}

.download-btn {
  @apply flex text-14px text-center text-white font-500 rounded-2 w-294px h-10 border-none cursor-pointer !p-0 justify-center items-center;
}
</style>
