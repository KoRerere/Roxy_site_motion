<script setup lang="ts">
import SvgIcon from '../rx-icon/svg-icon.vue'

const { redirectMobileDownloadToLogin } = useMobileDownloadRedirect()

const featureKeys = [
  $t('独立浏览器指纹'),
  $t('多账号安全管理'),
  $t('反关联检测'),
  $t('团队协作功能'),
  $t('高匿名评分'),
  $t('克服地理限制'),
] as const
</script>

<template>
  <section class="pb-4 pt-8 bg-white lg:pt-16">
    <Container>
      <div class="p-3 rounded-4" style="background: linear-gradient(102deg, #2F70F3 -9.54%, #6AD2FF 103.34%);">
        <div
          class="p-6 rounded-3 flex flex-col gap-25 justify-between overflow-hidden lg:(px-16 py-11 flex-row)"
          style="background: linear-gradient(193deg, rgba(255, 255, 255, 0.20) -51.97%, rgba(255, 255, 255, 0.00) 107.39%);"
        >
          <!-- 左侧：文案与 CTA -->
          <div class="text-white pt-4 flex flex-1 flex-col max-lg:items-center">
            <h2 class="section-title">
              {{ $t('需要更高的匿名评级吗？') }}
            </h2>
            <p class="text-body text-white leading-130% mb-6 mt-4 sm:mb-8">
              {{ $t('RoxyBrowser，一款专业的指纹浏览器，为您的每个浏览器配置提供独特的指纹功能，轻松通过各种匿名检测。') }}
            </p>
            <ul class="mb-14 flex-wrap gap-3.5 hidden lg:flex">
              <li
                v-for="key in featureKeys"
                :key="key"
                class="text-4 text-white/95 flex gap-2.5 items-center sm:text-4.5"
              >
                <span class="flex shrink-0 size-5 items-center justify-center">
                  <SvgIcon name="base/rx_ic_check2" size="20" color="#fff" />
                </span>
                <span>{{ key }}</span>
              </li>
            </ul>
            <NuxtLinkLocale
              to="/download"
              class="text-3.5 text-[#11A3FD] leading-18px font-700 px-8 py-4 border-1 border-[#C8EBFE] rounded-2 border-solid bg-white flex gap-1 w-fit items-center"
              @click.capture="redirectMobileDownloadToLogin"
            >
              {{ $t('免费试用RoxyBrowser') }}
              <SvgIcon name="base/cursor-right" size="16" color="#11A3FD" />
            </NuxtLinkLocale>
          </div>

          <!-- 右侧：模拟浏览器窗口 -->
          <div class="max-w-[341px] hidden lg:flex">
            <img src="/whoer/browser.png" class="object-contain">
          </div>
        </div>
      </div>
    </Container>
  </section>
</template>
