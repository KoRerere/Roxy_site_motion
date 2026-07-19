<script setup lang="ts">
import CertificationRate from './components/CertificationRate.vue'

interface CertificationNewItem {
  title: string | VNode
  image: string
  description?: string
  width?: number
  putEgg?: boolean
}

defineProps({
  withDark: Boolean,
  withContainer: {
    default: true,
    type: Boolean,
  },
})

const { $t } = useRxI18n()

const certificationNewItems = computed(() => {
  const duns_node = h('span', {}, [
    $t('D-U-N-S \n编号：'),
    h('span', { class: 'no_tag_line' }, '659149012'),
  ])
  return [
    {
      // title: $t('D-U-N-S \n编号：'),
      title: duns_node,
      image: '/home/cert/duns.svg',
    },
    {
      title: $t('符合 GDPR 数据保护规范'),
      image: '/home/cert/GDPR.svg',
    },
    {
      title: $t('Widevine \n3 级'),

      image: '/home/cert/Widevine_3PL.svg',

    },

    {
      title: $t('Apple \n开发者公证'),

      image: '/home/cert/Apple_Developer.svg',

    },
    {
      title: $t('代码签名\nEV 验证'),
      image: '/home/cert/Code_signing.svg',
    },
  ]
})

const primaryCertificationItems = computed(() => [
  {
    title: $t('通过 SOC 2 安全审计'),
    image: '/home/cert/SOC_2.svg',
    description: $t('企业级安全合规'),
  },
  {
    title: $t('ISO/IEC 27001 认证'),
    image: '/home/cert/ISO.svg',

    description: $t('全球公认的安全框架'),
  },
])
</script>

<template>
  <div :class="{ 'rx-container': withContainer }" class="cert_container_outer">
    <div class="cert_container px-[20px] py-9 flex-col gap-[48px] lg:px-[48px] lg:py-[80px] lg:gap-[40px]" :class="{ 'with-dark': withDark }">
      <div class="soc-cert flex flex-col gap-[48px] items-stretch xl:flex-row lg:gap-[80px]">
        <div class="cert_primary_col">
          <div
            v-for="(item, idx) in primaryCertificationItems" :key="`primary-${idx}`"
            class="primary_certification_card"
          >
            <img :src="item.image" alt="certification" class="primary_certification_img">
            <p class="primary_certification_title txt-primary whitespace-pre-wrap">
              {{ item.title }}
            </p>
            <p v-if="item.description" class="primary_certification_desc">
              {{ item.description }}
            </p>
          </div>
        </div>
        <div class="cert_main_col grow-2">
          <h4 class="cert_heading txt-primary text-h4">
            {{ $t('可信赖且安全的反检测浏览器') }}
          </h4>
          <div class="cert_new_grid">
            <div v-for="(item, idx) in certificationNewItems" :key="`new-${idx}`" class="cert_new_item">
              <div class="cert_new_item_img_wrap">
                <img :src="item.image" alt="certification" class="cert_new_item_img">
              </div>
              <div class="cert_new_item_title txt-primary text-h5">
                <template v-if="typeof item.title === 'string'">
                  {{ item.title }}
                </template>
                <template v-else>
                  <component :is="item.title" />
                </template>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="divider mx-auto w-full" />
      <div class="security w-full">
        <div class="security-title text-[20px] leading-[28px] mb-6 text-center md:text-[26px] md:leading-[36px]">
          {{ $t('实时安全信誉') }}
        </div>

        <div class="p-0 flex flex-col gap-[32px] w-full md:px-[40px] lg:flex-row lg:gap-[60px]">
          <div class="flex flex-1 flex-col gap-6 lg:flex-row">
            <CertificationRate :with-dark="withDark" class="mx-auto" />
            <div class="grow-10">
              <div class="flex items-center justify-center lg:justify-start">
                <img src="/home/scamadviser_logo.svg" alt="" class="light-logo select-none" draggable="false">
                <img src="/home/scamadviser_logo_dark.svg" alt="" class="dark-logo select-none" draggable="false">
              </div>
              <div class="verify-tip mt-[12px] w-full">
                <img src="/home/check-circle.svg" alt="" class="h-[20px] w-[20px] select-none" draggable="false">

                {{ $t('经多重安全引擎验证安全') }}
              </div>
              <a href="https://www.scamadviser.com/check-website/roxybrowser.com" target="_blank" class="link">
                https://www.scamadviser.com/
              </a>
            </div>
          </div>
          <div class="flex flex-1 flex-col gap-6 lg:flex-row">
            <CertificationRate :with-dark="withDark" class="mx-auto" />
            <div class="grow-10">
              <div class="flex items-center justify-center lg:justify-start">
                <img src="/home/APIVoid_logo.svg" alt="" class="light-logo select-none" draggable="false">
                <img src="/home/APIVoid_logo_dark.svg" alt="" class="dark-logo select-none" draggable="false">
              </div>
              <div class="verify-tip mt-[12px] w-full">
                <img src="/home/check-circle.svg" alt="" class="h-[20px] w-[20px] select-none" draggable="false">

                {{ $t('经过30多家安全厂商验证') }}
              </div>
              <a href="https://www.apivoid.com/tools/website-trust-score/" target="_blank" class="link">
                https://www.apivoid.com/
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.cert_container {
  .light-logo {
    display: block;
  }
  .dark-logo {
    display: none;
  }
}

.divider {
  height: 0.5px;

  background-color: var(--colors-border-border-subtle, #c7d1d6);
}

.verify-tip {
  margin-bottom: 16px;
  border-radius: 6px;
  background: var(--colors-background-bg-block, #f1f5f8);

  display: flex;
  padding: 8px 10px;
  align-items: center;
  gap: 8px;
  align-self: stretch;

  color: var(--colors-text-text-primary, #111213);
  font-family: Inter;
  font-size: 13px;
  font-style: normal;
  font-weight: 500;
  line-height: 18px; /* 138.462% */
}
.link {
  display: block;
  text-align: center;
  color: var(--colors-text-text-tertiary, #575d60);
  font-family: Inter;
  font-size: 14px;
  font-style: normal;
  font-weight: 400;
  line-height: 20px; /* 142.857% */
  &:hover {
    color: var(--colors-text-text-link, #11a3fd);
    font-family: Inter;
    font-size: 14px;
    font-style: normal;
    font-weight: 400;
    line-height: 20px; /* 142.857% */
    text-decoration-line: underline;
    text-decoration-style: solid;
    text-decoration-skip-ink: none;
    text-decoration-thickness: auto;
    text-underline-offset: 25%; /* 3.5px */
    text-underline-position: from-font;
  }
}

@media (min-width: 1021px) {
  .link {
    text-align: left;
  }
}
.security {
  &-title {
    color: var(--colors-text-text-primary, #111213);
    font-family: Archivo;
    font-style: normal;
    font-weight: 600;
  }
}

.scam {
  color: #cc1517;
}
.primary_certification_title {
  font-family: Archivo;
  font-weight: 500;
  font-size: 18px;
  min-width: 200px;
  max-width: 100%;
  line-height: 140%;
  letter-spacing: 0%;
  text-align: center;
  margin-top: 16px;
}

.primary_certification_desc {
  font-family: Inter;
  font-weight: 400;
  font-style: Regular;
  font-size: 14px;
  line-height: 140%;
  letter-spacing: 0%;
  text-align: center;
  color: rgba(87, 93, 96, 1);
  margin-top: 4px;
  white-space: pre-line;
}

.txt-primary {
  color: rgba(17, 18, 19, 1);
}

.cert_container {
  display: flex;
  justify-content: flex-start;
  align-items: flex-start;
  background: #fff;
  padding: 88px 48px 48px;
  border-radius: 40px;
  opacity: 1;

  @media (max-width: 768px) {
    border-radius: 16px;
  }
}

[data-theme='dark'] .cert_container.with-dark {
  background: rgba(255, 255, 255, 0.1) !important;
  --colors-background-bg-block: #293038;
  --colors-text-text-primary: #fafafa;
  --colors-border-border-subtle: #48555b;
  --colors-text-text-tertiary: #989ca0;

  .light-logo {
    display: none;
  }
  .dark-logo {
    display: block;
  }
  .primary_certification_title,
  .cert_heading {
    color: rgba(250, 250, 250, 1);
  }

  .primary_certification_desc {
    color: rgba(152, 156, 160, 1);
  }

  .cert_new_item_title {
    color: rgba(205, 207, 208, 1);
  }
  .security-title {
    color: rgba(205, 207, 208, 1);
  }
}
$cert_img_width: 80px;
$cert_img_width_pc: 88px;
/* 左侧认证：设计 gap 24；宽度用 max-width 约束，内部均分 */
.cert_primary_col {
  display: flex;
  align-self: center;
  gap: 24px;
  width: 100%;
}

.primary_certification_card {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 0;
}

.primary_certification_img {
  max-width: 100%;
  height: auto;
  object-fit: contain;
  width: 120px;
  height: 120px;
}

.cert_heading {
  margin: 0 0 16px;
  text-align: start;
  word-wrap: normal;
  // word-break: keep-all;
  font-family: Archivo;
  font-weight: 700;
  font-style: Bold;
  letter-spacing: 0%;
  white-space: pre-line;
}

/* @media (min-width: 1024px) {
    .cert_heading {
        text-align: left;
    }
} */

/* 右侧认证：大屏单行 gap 32；单项设计 111×142，图文 gap 12 */
.cert_new_grid {
  display: flex;
  flex-wrap: nowrap;
  gap: 32px;
  margin-top: 20px;
  width: 100%;
  box-sizing: border-box;
}

.cert_new_item {
  // flex: 0 1 115px;
  // width: 115px;
  max-width: 115px;
  min-width: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  box-sizing: border-box;
  gap: 12px;
}

.cert_new_item_img_wrap {
  width: 100%;
  display: flex;
  justify-content: center;
}

.cert_new_item_img {
  flex-shrink: 0;
  max-width: 100%;
  height: auto;
  object-fit: contain;
}

.cert_new_item_title {
  margin: 0;
  width: 100%;
  word-break: break-word;
  white-space: pre-line;
  font-family: Inter;
  font-weight: 500;
  font-style: Medium;
  font-size: 14px;
  line-height: 18px;
  letter-spacing: 0%;
  text-align: center;
  vertical-align: middle;
  color: rgba(52, 57, 61, 1);
}

/* 平板及以上：卡片与网格尺寸、语言规则（左右分栏仅 ≥1280，见下方） */
@media (min-width: 769px) {
  .cert_new_item_img {
    width: cert_img_width_pc;
    height: cert_img_width_pc;
  }

  .primary_certification_card {
    flex: 1 1 0;
  }

  .cert_new_item {
    display: inline-flex;
    flex: 0 1 111px;
    width: 111px;
    max-width: 111px;
    min-height: 142px;
  }

  /* 第 4 项 115px、第 5 项 111px；仅大屏，不影响小屏 3+2 居中 */
  .cert_new_item:nth-child(1) .cert_new_item_title {
    width: 125px;
  }

  .cert_new_item:nth-child(5) .cert_new_item_title {
    // flex: 0 1 111px;
    width: 130px;
  }

  [lang='zh-CN'] .primary_certification_title {
    min-width: 200px;
  }

  [lang='zh-CN'] .cert_new_item:first-child {
    min-width: 115px;
  }

  [lang='zh-CN'] .cert_new_item:nth-child(4) {
    min-width: 110px;
  }

  [lang='zh-CN'] .cert_new_item:nth-child(3) {
    min-width: 94px;
  }

  [lang='en-US'] .cert_new_grid {
    gap: 20px;
  }

  [lang='zh-CN'] .cert_new_grid {
    gap: 20px;
  }

  [lang='en-US'] .cert_new_item:first-child {
    min-width: 100px;
  }
}

/* 769–1279：上下两行，左侧认证行整体水平居中 */
@media (min-width: 769px) and (max-width: 1279px) {
  .cert_container {
    flex-direction: column;
    align-items: stretch;
  }

  .cert_primary_col {
    align-self: center;
    flex: 0 1 auto;
    max-width: min(464px, 100%);
    width: auto;
  }

  .cert_main_col {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 auto;
    min-width: 0;
    width: 100%;
    max-width: 100%;
  }

  .cert_new_grid {
    flex-wrap: wrap;
    justify-content: center;
  }
}

/* ≥1280：原左右分栏 */
@media (min-width: 1280px) {
  .cert_primary_col {
    flex: 0 1 auto;
    max-width: min(464px, 100%);
    width: auto;
  }

  .cert_main_col {
    display: flex;
    flex-direction: column;
    align-items: stretch;
    flex: 1 1 0%;
    min-width: 0;
    max-width: min(604px, 100%);
  }

  .cert_new_grid {
    justify-content: flex-start;
    flex-wrap: nowrap;
  }

  .cert_heading {
    text-align: start;
  }
}

@media (max-width: 1279px) {
  .cert_heading {
    text-align: center;
  }
}

@media (max-width: 768px) {
  .cert_heading {
    font-family: Archivo;
    font-weight: 600;
    font-style: SemiBold;
    font-size: 20px;

    line-height: 28px;
    letter-spacing: 0%;
    text-align: center;
    vertical-align: middle;
  }

  .cert_new_item_img {
    width: $cert_img_width;
    height: $cert_img_width;
  }

  .cert_container {
    flex-direction: column;
    padding: 40px 20px;
    align-items: stretch;
  }

  .cert_primary_col {
    flex-direction: column;
    align-self: stretch;
    width: 100%;
  }

  .primary_certification_card {
    width: 100%;
    max-width: none;
    flex: none;
  }

  .cert_new_item:nth-child(4) .cert_new_item_img_wrap {
    // margin-right: 30px;
  }

  .cert_new_item:nth-child(4) .cert_new_item_title {
    // margin-right: 30px;
    // width: 125px;
  }

  .cert_new_item:nth-child(5) .cert_new_item_title {
    // flex: 0 1 111px;
    // width: 130px;
  }

  .cert_main_col {
    width: 100%;
    margin-top: 28px;
  }

  /* 每行 3 个；justify-content: center 使第二行 2 个整体居中 */
  .cert_new_grid {
    flex-wrap: wrap;
    justify-content: center;
    gap: 24px 12px;
    width: 100%;
  }

  .cert_new_item {
    // flex: 0 0 calc((100% - 32px) / 3);
    // width: calc((100% - 32px) / 3);
    // max-width: calc((100% - 32px) / 3);
    min-height: 0;
    box-sizing: border-box;
  }
  [lang='zh-CN'] .cert_new_item:nth-child(1) {
    width: 125px !important;
    max-width: 125px !important;
  }
  [lang='en-US'] .cert_new_item:nth-child(2) {
    width: $cert_img_width !important;
    max-width: $cert_img_width !important;
  }
  [lang='en-US'] .cert_new_item:nth-child(5) {
    width: 125px;
    max-width: 125px;
  }
  .cert_new_item_img {
    width: min($cert_img_width, 100%);
    height: auto;
    aspect-ratio: 1;
  }
  [lang='ru-RU'] .cert_new_item {
    width: 130px;
    max-width: 50%;
  }
  [lang='ru-RU'] .cert_new_item:last-child {
    width: 240px;
    max-width: 80%;
  }
}

.no_tag_line {
  color: rgba(17, 163, 253, 1);
}
</style>