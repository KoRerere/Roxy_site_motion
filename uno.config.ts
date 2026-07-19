import { defineConfig, presetWind4, transformerDirectives, transformerVariantGroup } from 'unocss'

export default defineConfig({
  presets: [
    presetWind4(),
  ],
  // ...UnoCSS options
  transformers: [
    transformerDirectives(),
    transformerVariantGroup(),
  ],
  theme: {
    animation: {
      keyframes: {
        'marquee': '{from{transform:translateX(0)}to{transform:translateX(calc(-100% - var(--gap)))}}',
        'marquee-vertical': '{from{transform:translateY(0)}to{transform:translateY(calc(-100% - var(--gap)))}}',
      },
      durations: {
        'marquee': 'var(--duration)',
        'marquee-vertical': 'var(--duration)',
      },
      timingFns: {
        'marquee': 'linear',
        'marquee-vertical': 'linear',
      },
      counts: {
        'marquee': 'infinite',
        'marquee-vertical': 'infinite',
      },
    },
    breakpoint: {
      'sm': '640px',
      'md': '768px',
      'lg': '1024px',
      'xl': '1280px',
      '2xl': '1536px',
      '3xl': '2200px',
      'phone': '48rem',
      'tablet': '60rem',
      'laptop': '72rem',
      'desktop': '80rem',
    },
    colors: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      tertiary: 'var(--color-text-tertiary)',
      inactive: 'var(--color-text-inactive)',
    },
    text: {
      'h1': { fontSize: 'var(--Heading-H1)', lineHeight: 'var(--line-H1)' },
      'h2': { fontSize: 'var(--Heading-H2)', lineHeight: 'var(--line-H2)' },
      'h3': { fontSize: 'var(--Heading-H3)', lineHeight: 'var(--line-H3)' },
      'h4': { fontSize: 'var(--Heading-H4)', lineHeight: 'var(--line-H4)' },
      'h5': { fontSize: 'var(--Heading-H5)', lineHeight: 'var(--line-H5)' },
      'h6': { fontSize: 'var(--Heading-H6)', lineHeight: 'var(--line-H6)' },
      'features-body': { fontSize: 'var(--features-body)', lineHeight: 'var(--line-features-body)' },
      'body': { fontSize: 'var(--body)', lineHeight: 'var(--line-body)' },
      'body-second': { fontSize: 'var(--body-second)', lineHeight: 'var(--line-body-second)' },
      'sub-title': { fontSize: 'var(--sub-title)', lineHeight: 'var(--line-sub-title)' },
      'note': { fontSize: 'var(--note)', lineHeight: 'var(--line-note)' },
    },
  },
  preflights: [
    {
      getCSS: () => `
        :root {
          --color-text-primary: #111213;
          --color-text-secondary: #34393D;
          --color-text-tertiary: #575D60;
          --color-text-inactive: #7D8387;

          --Heading-H1: 56px;
          --Heading-H2: 48px;
          --Heading-H3: 40px;
          --Heading-H4: 36px;
          --Heading-H5: 26px;
          --Heading-H6: 24px;
          --features-body: 20px;
          --body: 18px;
          --body-second: 14px;
          --sub-title: 16px;
          --note: 12px;

          --line-H1: 68px;
          --line-H2: 60px;
          --line-H3: 48px;
          --line-H4: 48px;
          --line-H5: 36px;
          --line-H6: 36px;
          --line-features-body: 32px;
          --line-body: 28px;
          --line-body-second: 18px;
          --line-sub-title: 24px;
          --line-note: 18px;
          font-family: var(--family);
        }

        html[lang='ru-RU'] {
          --Heading-H3: 36px;
          --line-H3: 40px;
        }
      `,
    },
  ],
  shortcuts: {
    'wh-full': 'w-full h-full',
    'flex-ac': 'flex justify-around items-center',
    'flex-bc': 'flex justify-between items-center',
    'flex-cc': 'flex justify-center items-center',
    'flex-ovh-1': 'flex overflow-hidden flex-1',
    'ellipsis-1': 'text-ellipsis overflow-hidden whitespace-nowrap',
    'position-y-center': 'absolute top-1/2 transform -translate-y-1/2',
    'position-x-center': 'absolute left-1/2 transform -translate-x-1/2',
    'absolute-center': 'absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2',
    'rx-container': 'xl:w-[1280px] xl:mx-auto 2xl:px-0 px-4 md:px-40px lg:px-60px xl:px-0',
    'rx-header': 'xl:max-w-[1320px] xl:mx-auto px-12px md:px-20px lg:px-40px xl:px-0',
    'fqa-container': 'xl:w-[1064px] xl:mx-auto 2xl:px-0 px-5 sm:px-10 sm:pt-60px pb-10 sm:pb-20',
    'section-title': 'text-6 max-lg:leading-[1.2] sm:text-8 lg:text-h2 ru-RU:lg:text-11 font-700 multilingual-text',
    'section-description': 'text-3.5 md:text-4 xl:text-4.5 leading-20px md:leading-24px xl:leading-28px text-tertiary text-center whitespace-pre-line',
    'multilingual-text': 'font-[Archivo] ru-RU:font-[Montserrat]',
    'contact-us-title-mobile': 'text-[#1d1e20] font-[Archivo] text-[24px] leading-[36px] font-600',
    'contact-us-title-pc': 'text-[#1d1e20] font-[Archivo] text-[36px] leading-[48px] font-700',
    'contact-us-body-mobile': 'text-[#1d1e20] font-[Inter] text-[18px] leading-[28px] font-400',
    'contact-us-info-label': 'text-[#353739] font-[Inter] text-[16px] leading-[24px] font-400',
    'contact-us-info-value': 'text-[#1d1e20] font-[Inter] text-[18px] leading-[28px] font-500',
    'contact-us-banner-title-mobile': 'text-[#1d1e20] text-center font-[Archivo] text-[26px] leading-[32px] font-700',
    'contact-us-banner-desc-mobile': 'text-[#353739] text-center font-[Inter] text-[16px] leading-[24px] font-400',
    'contact-us-button-text': 'text-[#1d1e20] font-[Inter] text-[14px] leading-[20px] font-600',
    'contact-us-note-mobile': 'text-[#353739] text-center font-[Archivo] text-[12px] leading-[18px] font-400',
  },
  rules: [
    ['ellipsis-2', {
      'text-overflow': 'ellipsis',
      'overflow': 'hidden',
      'line-clamp': 2,
      '-webkit-line-clamp': 2,
      '-webkit-box-orient': 'vertical',
      'word-break': 'break-word',
      'display': '-webkit-box',
    }],
    ['ellipsis-3', {
      'text-overflow': 'ellipsis',
      'overflow': 'hidden',
      'line-clamp': 3,
      '-webkit-line-clamp': 3,
      '-webkit-box-orient': 'vertical',
      'word-break': 'break-word',
      'display': '-webkit-box',
    }],
    ['ellipsis-4', {
      'text-overflow': 'ellipsis',
      'overflow': 'hidden',
      'line-clamp': 4,
      '-webkit-line-clamp': 4,
      '-webkit-box-orient': 'vertical',
      'word-break': 'break-word',
      'display': '-webkit-box',
    }],
  ],
  variants: [
    // 支持像 `zh-CN:` 这样的变体
    (matcher) => {
      const match = matcher.match(/^(zh-CN|en-US|ru-RU):(.+)$/)
      if (match) {
        return {
          matcher: match[2],
          selector: s => `html[lang="${match[1]}"] ${s}`,
        }
      }
    },
  ],
})
