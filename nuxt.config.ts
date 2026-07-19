import type { NuxtConfig } from 'nuxt/config'
import crypto from 'node:crypto'
import { existsSync, readFileSync, writeFileSync } from 'node:fs'
import { writeFile } from 'node:fs/promises'
import path from 'node:path'
import process from 'node:process'
import { uploadIcons } from '@roxy/vite-plugins'
import { debounce } from 'es-toolkit'
import fg from 'fast-glob'
import { defineNuxtConfig } from 'nuxt/config'
import { ROXYBROWSER_BAIKE_PATH } from './constants/roxybrowser-baike'
import { filterChinaPreloadDeps } from './utils/china-preload-blacklist'
import { imagetools } from 'vite-imagetools'
import ViteCompression from 'vite-plugin-compression2'
import svgLoader from 'vite-svg-loader'

const genSvgTypesDefine = debounce(async () => {
  const svgIconTypesPath = './components/rx-icon/svg-icon-types.ts'
  const files = await fg('./assets/svgs/**/*.svg', { absolute: false })
  const typeDefine = files.map(path => `'${path.replace('./assets/svgs/', '').replace('.svg', '')}'`).sort().join(`
  | `)
  const code = `/** 此文件自动生成，请勿修改！所有可用的 svg name */
  export type SvgNames = ${typeDefine}`
  console.log('重新生成 svg 类型文件！')
  await writeFile(svgIconTypesPath, code)
}, 3000)

await genSvgTypesDefine()

const isDev = process.env.ENV === 'development'
const siteVariant = process.env.SITE_VARIANT || 'international'
const isChinaSite = siteVariant === 'china'

console.log('isDev', isDev, 'siteVariant', siteVariant)
// https://nuxt.com/docs/api/configuration/nuxt-config
const prerender: string[] = [
  '/',
  '/copyright/privacy',
  '/copyright/refund',
  '/copyright/user',
  '/copyright/renewal',
  '/auth',
  '/auth/app_vk',
  '/auth/web_vk',
  '/pricing',
  '/no-auth',
  '/functions/**',
  '/use-cases/**',
  '/about-us',
  '/contact-us',
]

if (isChinaSite) {
  prerender.push(ROXYBROWSER_BAIKE_PATH)
}

const ssrRouters: Record<string, any> = {
  '/blog/**': { ssr: true, swr: isDev ? false : 3600 },
  '/changelog': { ssr: true },
  '/download': { ssr: true },
}

// Keep this relative so Nitro resolves it on the deployment machine at runtime.
const nitroCacheBase = '.data'

const routeRules: Record<string, any> = {
  ...ssrRouters,
}

prerender.forEach((path) => {
  routeRules[path] = { prerender: true }
  if (!isChinaSite) {
    // routeRules[`/zh${path}`] = { prerender: true }
    routeRules[`/ru${path}`] = { prerender: true }
  }
})

// 动态 i18n 配置
const i18nConfig: Partial<NuxtConfig['i18n']> = isChinaSite
  ? {
      compilation: { strictMessage: false },
      /** 须与 runtimeConfig.public.roxyHomeUrl / site.url 一致，否则 useLocaleHead 的 i18n-can 会指向错误域名，影响 i18n 的切换 */
      baseUrl: isDev ? 'https://test.roxybrowser.cn/' : 'https://roxybrowser.cn/',
      locales: [
        { code: 'zh', language: 'zh-CN', file: { path: 'zh.json', cache: false } },
      ],
      defaultLocale: 'zh',
      strategy: 'no_prefix',
      detectBrowserLanguage: {
        fallbackLocale: 'zh',
      },
    }
  : {
      compilation: { strictMessage: false },
      baseUrl: isDev ? 'https://gatetest.roxybrowser.co/' : 'https://roxybrowser.com/',
      locales: [
        { code: 'zh', language: 'zh-CN', file: { path: 'zh.json', cache: false } },
        { code: 'en', language: 'en-US', file: { path: 'en.json', cache: false } },
        { code: 'ru', language: 'ru-RU', file: { path: 'ru.json', cache: false } },
      ],
      defaultLocale: 'en',
      strategy: 'prefix_and_default',
      detectBrowserLanguage: false,
    }

const robotsBlockedSegments = [
  '/figma-icons',
  '/pay-success',
  '/email-transfer',
  // 国内站低价值页：与 sitemapExclude / noindex 策略一致
  ...(isChinaSite ? ['/invite', '/login-success', '/t'] : []),
]
const robotsLocalePrefixes = ['', '/zh', '/en', '/ru']
const robotsDisallowProduction = robotsLocalePrefixes.flatMap(prefix =>
  robotsBlockedSegments.map(path => `${prefix}${path}`),
)

const robotsConfig = {
  disallow: isDev ? '/' : robotsDisallowProduction,
  groups: isDev || siteVariant === 'china'
    ? []
    : [
        {
          userAgent: 'Baiduspider',
          disallow: [
            '/use-cases/cryptocurrency-trading',
            '/zh/use-cases/cryptocurrency-trading',
            '/ru/use-cases/cryptocurrency-trading',
          ],
        },
      ],
}

const excludePages: string[] = isChinaSite
  ? [
      '/use-cases/cryptocurrency-trading',
    ]
  : [
      ROXYBROWSER_BAIKE_PATH,
    ]

/** 与 @nuxtjs/sitemap 的 exclude 保持一致 */
const sitemapExclude: string[] = [
  '/no-auth',
  '/auth/**',
  '/en/auth/**',
  '/zh/auth/**',
  '/ru/auth/**',
  '/figma-icons/**',
  '/pay-success',
  // 国内站低价值页：避免进入 zh-CN.xml 污染百度 sitemap
  '/invite',
  '/invite/**',
  '/login-success',
  '/t/**',
  '/email-transfer',
  ROXYBROWSER_BAIKE_PATH,
]

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  devServer: {
    port: isChinaSite ? 3002 : 3000,
  },
  routeRules,
  nitro: {
    // Nitro production cache defaults to memory; move SWR payloads to disk.
    storage: {
      cache: {
        driver: 'fs',
        base: nitroCacheBase,
      },
    },
    devStorage: {
      cache: {
        driver: 'fs',
        base: nitroCacheBase,
      },
    },
  },
  /** Google One Tap：须在根级 public 声明，客户端才能拿到 client_id（与 $development 合并下发） */
  runtimeConfig: {
    public: {
      googleOneTapClientId: process.env.NUXT_PUBLIC_GOOGLE_ONE_TAP_CLIENT_ID || '122184636659-onkerhuo2qe3vjjllg0gnqgp8pcujtci.apps.googleusercontent.com',
    },
  },
  $production: {
    runtimeConfig: {
      NODE_ENV: 'production',
      ghostKey: isChinaSite ? '69f0b08b3371940001212b03:815af4e1547ff0e4aa89713a9a4caeb9c5d69ddddcb37a24726edff1f040c5be' : '689d6676100c5d000140d569:3d193547261de4192f55ff1884dac8e08cddb39775dbd5665ec7475c6bdc45af',
      ghostUrl: isChinaSite ? 'https://roxybrowser.cn/__ghost__' : 'https://roxybrowser.com/__ghost__',
      public: {
        ENV: 'production',
        isChinaSite: siteVariant === 'china',
        apiUrl: 'https://api.roxybrowser.net',
        appDownloadUrl: 'https://dl.roxybrowser.com',
        LAUNCH_PROTOCOL: 'roxybrowser:',
        roxyHomeUrl: isChinaSite ? 'https://roxybrowser.cn' : 'https://roxybrowser.com',
        roxyChinaHomeUrl: 'https://roxybrowser.cn',
        roxyInternationalHomeUrl: 'https://roxybrowser.com',
        appWebUrl: isChinaSite ? 'https://app.roxybrowser.cn' : 'https://app.roxybrowser.com',
        roxyBrowserUrl: isChinaSite ? 'https://app.roxybrowser.cn/' : 'https://app.roxybrowser.com/',
        /** 高德地图 Web 端 Key，可选，未设置时组件内使用默认 key */
        amapKey: 'f7ad456681774c4551d7946e19f642c2',
        /** 高德安全密钥（2021 年 12 月后申请的 key 需配置），可选 */
        amapSecurityCode: '7f8cfd9f332d09665fc88f4063b1bb74',
        /** Mixpanel Token */
        VITE_MIXPANEL_TOKEN: '7789c2fbe03106e467046d94876459e2',
      },
    },
  },
  $development: {
    runtimeConfig: {
      NODE_ENV: 'development',
      ghostKey: isChinaSite ? '6a27ec73d49c200001b8e588:01a06f4a876ca8fd2894a456fd5314e31a044921712ebbda4aef95626232ec4d' : '689ef3951b0cf30001d25f91:9b30691bb86067235df9d00979bf6483578b026b4fa2a2edbd55bff6585889e9',
      ghostUrl: isChinaSite
        ? 'https://test.roxybrowser.cn/__ghost__'
        : 'https://gatetest.roxybrowser.co/__ghost__',
      public: {
        ENV: 'development',
        isChinaSite: siteVariant === 'china',
        apiUrl: 'https://apitest.roxybrowser.co/',
        appDownloadUrl: 'https://gatetest.roxybrowser.co',
        LAUNCH_PROTOCOL: 'RoxyBrowser-dev:',
        roxyHomeUrl: isChinaSite ? 'https://test.roxybrowser.cn' : 'https://gatetest.roxybrowser.co',
        roxyChinaHomeUrl: 'https://test.roxybrowser.cn',
        roxyInternationalHomeUrl: 'https://gatetest.roxybrowser.co',
        appWebUrl: isChinaSite ? 'https://apptest.roxybrowser.cn' : 'https://apptest.roxybrowser.co',
        roxyBrowserUrl: isChinaSite ? 'https://apptest.roxybrowser.cn/' : 'https://apptest.roxybrowser.co/',
        amapKey: 'f7ad456681774c4551d7946e19f642c2',
        amapSecurityCode: '7f8cfd9f332d09665fc88f4063b1bb74',
        VITE_MIXPANEL_TOKEN: '96de69873066ada837f8722625e0b764',
      },
    },
  },
  modules: [
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'motion-v/nuxt',
    '@nuxtjs/robots',
    '@nuxt/image',
    '@vueuse/nuxt',
    '@nuxt/eslint',
    'nuxt-llms',
  ],
  llms: {
    domain: isDev ? 'https://gatetest.roxybrowser.co' : 'https://roxybrowser.com',
    title: 'RoxyBrowser',
    description: 'RoxyBrowser is an anti-detect browser for multi-account management, web scraping, and privacy protection. Manage multiple browser profiles with unique fingerprints, proxy IP support, and team collaboration features.',
    sections: [
      {
        title: 'Main',
        links: [
          { title: 'Homepage', href: '/' },
          { title: 'Pricing', href: '/pricing' },
          { title: 'Download', href: '/download' },
          { title: 'About Us', href: '/about-us' },
          { title: 'FAQs', href: '/faqs' },
          { title: 'Partners', href: '/partners' },
        ],
      },
      {
        title: 'Use Cases',
        links: [
          { title: 'Affiliate Marketing', href: '/use-cases/affiliate-marketing' },
          { title: 'Cryptocurrency Trading', href: '/use-cases/cryptocurrency-trading' },
          { title: 'E-commerce Marketing', href: '/use-cases/ecommerce-marketing' },
          { title: 'Paid Search Advertising', href: '/use-cases/paid-search-advertising' },
          { title: 'SEO & Content Marketing', href: '/use-cases/seo-content-marketing' },
          { title: 'Social Media Marketing', href: '/use-cases/social-media-marketing' },
          { title: 'Web Scraping', href: '/use-cases/web-scraping' },
        ],
      },
      {
        title: 'Functions',
        links: [
          { title: 'AI Agent', href: '/functions/ai-agent' },
          { title: 'Change IP Address', href: '/functions/change-ip-address' },
          { title: 'Manage Multiple Accounts', href: '/functions/manage-multiple-accounts' },
          { title: 'Private Browsing', href: '/functions/private-browsing' },
        ],
      },
      {
        title: 'Blog & Updates',
        links: [
          { title: 'Blog', href: '/blog' },
          { title: 'Changelog', href: '/changelog' },
        ],
      },
      {
        title: 'Optional',
        links: [
          { title: 'Privacy Policy', href: '/copyright/privacy' },
          { title: 'Refund Policy', href: '/copyright/refund' },
          { title: 'User Agreement', href: '/copyright/user' },
          { title: 'Renewal Policy', href: '/copyright/renewal' },
          { title: 'Invite Program', href: '/invite' },
          { title: 'IP Address Lookup Tool', href: '/ip-address-lookup' },
        ],
      },
    ],
  },
  robots: robotsConfig,
  eslint: {
    config: {
      standalone: false,
    },
  },
  unocss: {
    nuxtLayers: true,
  },
  build: {
    transpile: ['vue-countup-v3'],
    analyze: {
      enabled: true,
      reportFilename: '.nuxt/analyze/report.html',
      analyzerMode: 'server',
      open: isDev,
      port: 3001,
      generateStatsFile: true,
      statsFilename: '.nuxt/analyze/stats.json',
      statsOptions: null,
      logLevel: 'info',
    },
  },
  site: {
    name: isChinaSite ? 'Roxy浏览器' : 'RoxyBrowser',
    url: isDev ? isChinaSite ? 'https://test.roxybrowser.cn' : 'https://gatetest.roxybrowser.co' : (isChinaSite ? 'https://roxybrowser.cn' : 'https://roxybrowser.com'),
  },
  sitemap: {
    debug: true,
    exclude: sitemapExclude,
    // 国际站：prefix_and_default → 模块自动按语言拆成 /__sitemap__/en-US.xml 等
    // 国内站：no_prefix 时模块不会自动拆站；手动声明与 i18n locales[].language 一致的子 sitemap → /__sitemap__/zh-CN.xml
    ...(isChinaSite
      ? {
          sitemaps: {
            'index': [],
            'zh-CN': {
              includeAppSources: true,
              sources: ['/api/__sitemap__/blog'],
            },
          },
        }
      : {
          sources: ['/api/__sitemap__/blog'],
        }),
  },
  css: ['./assets/styles/global.css'],
  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    },
  ],
  sourcemap: {
    client: false,
    server: false,
  },
  app: {
    baseURL: '/',
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/favicon-96x96.png', sizes: '96x96' },
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: 'image/png', href: '/apple-touch-icon.png', sizes: '180x180' },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      noscript: [
        {
          innerHTML: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KTXR7SHP"height="0" width="0" style="display:none;visibility:hidden"></iframe>
            <div><img src="https://mc.yandex.ru/watch/105906815" style="position:absolute; left:-9999px;" alt="" /></div>
          `,
        },
      ],
    },
  },
  hooks: {
    'build:before': () => {
      const json = readFileSync(path.resolve(process.cwd(), './indexnow.json'), 'utf-8')
      const key = json && JSON.parse(json).key
      const hasKeyFile = key && existsSync(path.resolve(process.cwd(), `./public/${key}.txt`))
      if (!hasKeyFile) {
        const key = crypto.randomBytes(32).toString('hex')
        writeFileSync(path.resolve(process.cwd(), `./public/${key}.txt`), key)
        writeFileSync(path.resolve(process.cwd(), `./indexnow.json`), JSON.stringify({ key }))
      }
    },
    // pages下路由规则的扩充，适配单页面组件匹配多路由
    'pages:extend': (pages) => {
      const hasInviteCodePage = pages.some(page => page.path === '/invite/:code()' || page.path === '/invite/:code')
      if (!hasInviteCodePage) {
        pages.push({
          name: 'invite-code',
          path: '/invite/:code()',
          file: '~/pages/invite/[code].vue',
        })
      }
      // 博客分页伪静态， /blog/page/{pageNum}
      pages.push({
        name: 'blog-page-slug',
        path: '/blog/page/:page()',
        file: '~/pages/blog/index.vue',
      })
      // 博客tag对应路由，/blog/tag-xxx
      pages.push({
        name: 'blog-tag-slug',
        path: '/blog/tag-:slug()',
        file: '~/pages/blog/index.vue',
      })
      // 博客tag + page 路由
      pages.push({
        name: 'blog-tag-slug-page',
        path: '/blog/tag-:slug()/page/:page()',
        file: '~/pages/blog/index.vue',
      })

      excludePages.forEach((page) => {
        const targetIdx = pages.findIndex(p => p.path === page)
        if (targetIdx !== -1) {
          pages.splice(targetIdx, 1)
        }
      })
    },
  },
  i18n: i18nConfig,
  image: {
    provider: 'ipx',
    format: ['avif', 'webp'],
    screens: {
      'sm': 640,
      'md': 768,
      'lg': 1024,
      'xl': 1280,
      '2xl': 1536,
    },
    dir: 'assets/images',
  },
  vite: {
    define: {
      // 避免server端和client端变量不一致
      'process.env.SITE_VARIANT': JSON.stringify(siteVariant),
    },
    esbuild: {
      // 仅正式 build（ENV=production）去掉 console；与 isDev 解耦，避免 pnpm dev 未设 ENV 时误删调试输出
      drop: process.env.ENV === 'production' ? ['console', 'debugger'] : [],
    },
    build: {
      assetsInlineLimit: 1024 * 10,
      chunkSizeWarningLimit: 1024 * 500,
      // cssMinify: true,
      // terserOptions: {
      //   compress: {
      //     drop_console: !isDev, // 去除 console 语句
      //     drop_debugger: !isDev, // 去除 debugger 语句
      //   },
      // },
      rollupOptions: {
        output: {
          chunkFileNames: '_nuxt/[name]-[hash].js',
          entryFileNames: '_nuxt/[name]-[hash].js',
        },
      },
      // 国内站：modulepreload 黑名单 batch1+batch2（UI 不变，仅减少 preload hint）
      ...(isChinaSite
        ? {
            modulePreload: {
              resolveDependencies: (_filename, deps) => filterChinaPreloadDeps(deps),
            },
          }
        : {}),
    },
    plugins: [
      uploadIcons({ extractDir: './assets/svgs' }),
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'myPlugin',
              fn: (() => {
                return (_root, _params, _info) => {
                  return {
                    element: {
                      enter: (node) => {
                        if (node.name === 'svg') {
                          node.attributes.width = '1em'
                          node.attributes.height = '1em'
                        }
                        // // 基础图标的颜色使用当前颜色
                        // if (info.path?.includes('assets/images/base/')
                        //   && node.attributes.fill
                        //   && node.name === 'path') {
                        //   node.attributes.fill = 'currentColor'
                        // }
                      },
                    },
                  }
                }
              })(),
            },
          ],
        },
      }),
      // 在 build 阶段再运行压缩插件
      ViteCompression({ algorithms: ['gzip', 'brotliCompress'] }),
      {
        ...imagetools({
          defaultDirectives: () => new URLSearchParams({ noAutoOrient: 'true' }),
        }),
        apply: 'build',
      },
      {
        name: 'watch-assets-svgs',
        configureServer(server) {
          // 监听 assets 目录下的 SVG 文件变化

          server.watcher.on('add', (file) => {
            if (file.endsWith('.svg')) {
              genSvgTypesDefine()
            }
          })

          server.watcher.on('unlink', (file) => {
            if (file.endsWith('.svg')) {
              genSvgTypesDefine()
            }
          })

          server.watcher.on('change', (file) => {
            if (file.endsWith('.svg')) {
              genSvgTypesDefine()
            }
          })
        },
      },
    ],
  },
})
