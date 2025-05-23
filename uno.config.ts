import { defineConfig } from 'unocss'
// import presetWind4 from '@unocss/preset-wind4'
import transformerDirectives from '@unocss/transformer-directives'

export default defineConfig({
  // ...UnoCSS options
  include: [
    './**/*.html',
    './**/*.vue',
    './**/*.tsx',
    './**/*.jsx',
    './**/*.ts', // 加上这行
  ],
  transformers: [
    transformerDirectives(),
  ],
  theme: {
    breakpoints: {
      sm: '640px',
      md: '768px',
      lg: '1024px',
      xl: '1280px',
      '2xl': '1536px',
    },
    colors: {
      primary: 'var(--color-text-primary)',
      secondary: 'var(--color-text-secondary)',
      inactive: 'var(--color-text-inactive)',
    },
    fontSize: {
      h1: ['var(--Heading-H1)', 'var(--line-H1)'],
      h2: ['var(--Heading-H2)', 'var(--line-H2)'],
      h3: ['var(--Heading-H3)', 'var(--line-H3)'],
      h4: ['var(--Heading-H4)', 'var(--line-H4)'],
      h5: ['var(--Heading-H5)', 'var(--line-H5)'],
      h6: ['var(--Heading-H6)', 'var(--line-H6)'],
      'features-body': ['var(--features-body)', 'var(--line-features-body)'],
      'body': ['var(--body)', 'var(--line-body)'],
      'body-second': ['var(--body-second)', 'var(--line-body-second)'],
      'sub-title': ['var(--sub-title)', 'var(--line-sub-title)'],
      'note': ['var(--note)', 'var(--line-note)'],
    },
    lineHeight: {
      h1: 'var(--line-H1)',
      h2: 'var(--line-H2)',
      h3: 'var(--line-H3)',
      h4: 'var(--line-H4)',
      h5: 'var(--line-H5)',
      h6: 'var(--line-H6)',
      'features-body': 'var(--line-features-body)',
      'body': 'var(--line-body)',
      'body-second': 'var(--line-body-second)',
      'sub-title': 'var(--line-sub-title)',
      'note': 'var(--line-note)',
    },
  },
  preflights: [
    {
      getCSS: () => `
        :root {
          --color-text-primary: #111213;
          --color-text-secondary: #34393D;
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
    'rx-container': 'xl:w-[1280px] xl:mx-auto 2xl:px-0 px-5 md:px-40px lg:px-60px xl:px-0',
    'rx-header': 'xl:max-w-[1320px] xl:mx-auto px-12px md:px-20px lg:px-40px xl:px-0',
    'fqa-container': 'xl:w-[1064px] xl:mx-auto 2xl:px-0 px-5 sm:px-10 sm:pt-60px pb-10 sm:pb-20',
    'section-title': 'text-6 leading-[1.2] sm:text-8 lg:text-h2 font-700 font-[Archivo]'
  },
  rules: [
    ['ellipsis-4', {
      'text-overflow': 'ellipsis',
      overflow: 'hidden',
      'line-clamp': 4,
      '-webkit-line-clamp': 4,
      '-webkit-box-orient': 'vertical',
      'word-break': 'break-word',
      display: '-webkit-box',
    }]
  ]
})