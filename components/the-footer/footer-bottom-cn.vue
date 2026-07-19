<script setup lang="ts">
/** 国内站页脚底栏：左为语言与联系（38936:14581），右为备案与政策链接（38936:14489） */
import type { LanguageCode } from '~/constants'
import { RxIcon } from '@/components/rx-icon'
import { SUPPORTED_LANGUAGES } from '~/constants'

defineProps({
  hideLanguage: {
    type: Boolean,
    default: false,
  },
})

const { $t, locale } = useRxI18n()
const switchLanguage = useSwitchLanguage()

const year = new Date().getFullYear()

const langItems = SUPPORTED_LANGUAGES.map(lang => ({
  label: lang.title,
  value: lang.code,
}))

const currentLang = ref(
  langItems.find(item => item.value === locale.value) || langItems[0],
)

watch(
  () => locale.value,
  (val) => {
    currentLang.value
      = langItems.find(item => item.value === val) || langItems[0]
  },
)
// 禁止浏览器对地址、电话、邮箱等进行自动识别和转换
useHead({
  meta: [
    {
      name: 'format-detection',
      content: 'telephone=no, email=no, address=no',
    },
  ],
})
function handleLangChange(opt: { value: LanguageCode, label: string }) {
  switchLanguage(opt.value as LanguageCode)
}
</script>

<template>
  <div class="flex flex-col gap-5 w-full">
    <div class="flex flex-wrap gap-8 w-full justify-between lg:gap-15">
      <div class="flex flex-col gap-5 max-w-full items-start xl:w-512px">
        <div class="flex flex-col gap-5">
          <!-- 设计稿：触发器与下拉项均为 padding 12px 16px；root 固定宽度供下拉层对齐 -->
          <RxInputSelect
            v-if="!hideLanguage"
            v-model="currentLang"
            class="footer-bottom-cn-lang-select"
            dropdown-placement="top"
            :options="langItems"
            :pt="{
              root: '!bg-white/10 !border-none !w-55',
              label:
                '!text-white leading-5 !text-3.5 font-[Inter] !py-3 !pl-4 !pr-2',
              overlay: '!bg-[#4B495A] !border-none !p-0',
              option:
                '!text-white leading-5 !text-3.5 font-[Inter] !min-h-auto !py-3 !px-4 hover:!bg-[#5d5b6b] [&.p-select-option-selected]:!bg-[#5d5b6b] [&.p-focus]:!bg-[#5d5b6b]',
            }"
            :filter="false"
            size="xxl"
            @value-change="handleLangChange"
          />
          <div
            class="text-14px text-white leading-normal font-[Inter] flex flex-wrap gap-3 items-center lg:leading-5 lg:gap-8"
          >
            <NuxtLinkLocale
              to="/copyright/user"
              class="cursor-pointer transition-opacity hover:opacity-80"
            >
              {{ $t("使用条款") }}
            </NuxtLinkLocale>
            <NuxtLinkLocale
              to="/copyright/privacy"
              class="cursor-pointer transition-opacity hover:opacity-80"
            >
              {{ $t("隐私政策") }}
            </NuxtLinkLocale>
            <NuxtLinkLocale
              to="/copyright/cookie-policy"
              class="cursor-pointer transition-opacity hover:opacity-80"
            >
              {{ $t("Cookie 政策") }}
            </NuxtLinkLocale>
          </div>
        </div>

        <!-- <div
          class="flex flex-col gap-5 max-w-full items-start lg:flex-row xl:w-512px"
        >
          <div class="flex flex-col gap-2 w-full items-start">
            <a
              class="opacity-100 flex gap-2 transition-opacity items-start"
              href="mailto:support@RoxyBrowser.com"
            >
              <RxIcon
                name="base/rx_ic_email"
                class="text-white mt-0.5 shrink-0"
                size="16"
              />
              <span
                class="text-14px leading-5 font-[Inter] font-normal break-words"
              >
                support@roxybrowser.com
              </span>
            </a>
          </div>
        </div> -->
      </div>

      <!-- 右：© / 备案 / 政策 -->
      <div
        class="pt-[5px] flex shrink-0 flex-col gap-2 w-auto items-start md:w-580px xl:w-640px"
      >
        <div class="flex flex-col gap-2 items-start">
          <p
            class="text-[14px] text-white leading-5 opacity-70 max-w-full break-words"
          >
            © {{ year }} 矩阵智核科技（深圳）有限公司 版权所有
          </p>
          <div class="flex flex-col gap-2 md:flex-row lg:gap-8">
            <a
              href="https://beian.miit.gov.cn/"
              target="_blank"
              rel="noopener noreferrer"
              class="text-[14px] text-white leading-5 opacity-70 transition-opacity hover:opacity-100"
            >
              粤ICP备2026032718号-1
            </a>
          </div>
          <a
            href="https://beian.mps.gov.cn/#/query/webSearch?code=44030002012400"
            rel="noreferrer"
            target="_blank"
            class="text-[14px] text-white leading-5 flex gap-2"
          >
            <img src="/footer/beian.svg" alt="粤公网安备44030002012400号" class="size-5 !opacity-100 !select-none">
            <span class="text-[14px] text-white leading-5 opacity-70 transition-opacity hover:opacity-100">
              粤公网安备44030002012400号
            </span>
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 设计稿右侧箭头区：垂直 12px、右 16px，与 label 的 py-3 / pl-4 对齐 */
.footer-bottom-cn-lang-select :deep(.rx-select__dropdown-icon) {
  padding: 12px 16px 12px 6px;
}

/* 移动端将地址识别为隐式链接时会套一层 <a> 并加点状下划线；统一去掉样式并保持正文外观 */
.footer-bottom-cn-address :deep(a) {
  color: inherit !important;
  font: inherit !important;
  text-decoration: none !important;
  -webkit-text-decoration: none !important;
}
/* 取消自动链接的样式 */
a[x-apple-data-detectors],
a[href^='tel:'],
a[href^='sms:'],
a[href^='maps:'],
a[href^='applemaps:'] {
  color: inherit !important;
  text-decoration: none !important;
  font-size: inherit !important;
  font-family: inherit !important;
  font-weight: inherit !important;
  line-height: inherit !important;
  pointer-events: none; /* 可选：完全禁用点击 */
}
</style>
