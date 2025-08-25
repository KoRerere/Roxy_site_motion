import { uploadIcons } from '@roxy/vite-plugins'
import svgLoader from "vite-svg-loader";
import { debounce } from 'es-toolkit'
import { writeFile } from 'node:fs/promises'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { defineNuxtConfig } from 'nuxt/config'
import ViteCompression from 'vite-plugin-compression2'
import Aura from '@primeuix/themes/aura';
import { definePreset } from '@primevue/themes'
import myPreset from './assets/styles/primevuePresets'
import { imagetools } from 'vite-imagetools'

const svgIconTypesPath = './components/rx-icon/svg-icon-types.ts';

const isDev = process.env.ENV === 'development'

// https://nuxt.com/docs/api/configuration/nuxt-config
const prerender = [
  '/',
  '/copyright/privacy',
  '/copyright/refund',
  '/copyright/user',
  '/copyright/renewal',
  '/auth',
  '/auth/app_vk',
  '/auth/web_vk',
  '/download',
  '/features/profile-template',
  '/features/proxy-panel',
  '/features/team-space',
  '/features/account-hub',
  '/features/window-sync',
  '/features/api-flow',
  '/pricing',
  '/invite',
  '/login',
  '/no-auth',
  // '/solutions/privacy-defense',
  // '/solutions/social-networks',
  // '/solutions/affiliate-market',
  // '/solutions/web-scraping',
  // '/solutions/e-commerce',
  // '/solutions/crypto-gains',
  // '/solutions/traffic-trade',
  // '/solutions/ad-strategy',
  '/functions/**',
  '/use-cases/**',
]
const ssr = ['/blog/**']

const routeRules: Record<string, any> = {

}

prerender.forEach(path => {
  routeRules[path] = { prerender: true }
  routeRules['/zh' + path] = { prerender: true }
})

ssr.forEach(path => {
  routeRules[path] = { ssr: true }
  routeRules['/zh' + path] = { ssr: true }
})
console.log('routeRules', routeRules)
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  routeRules,
  // routeRules: {
  //   '/': { prerender: true },
  //   '/copyright/**': { prerender: true },
  //   '/auth': { prerender: true },
  //   '/auth/app_vk': { prerender: true },
  //   '/auth/web_vk': { prerender: true },
  //   '/download': { prerender: true },
  //   '/features/**': { prerender: true },
  //   '/pricing': { prerender: true },
  //   '/invite': { prerender: true },
  //   '/login': { prerender: true },
  //   '/no-auth': { prerender: true },
  //   '/solutions/**': { prerender: true },
  //   '/blog/**': { ssr: true },
  //   '/zh/**': { prerender: true },
  // },
  // devServer: {
  //   host: '0.0.0.0',
  //   port: 3000,
  //   https: false
  // },
  $production: {
    runtimeConfig: {
      NODE_ENV: 'production',
      ghostKey: '689d6676100c5d000140d569:3d193547261de4192f55ff1884dac8e08cddb39775dbd5665ec7475c6bdc45af',
      ghostUrl: 'https://roxybrowser.com/__ghost__',
      public: {
        ENV: 'production',
        apiUrl: 'https://api.roxybrowser.net',
        appDownloadUrl: 'https://dl.roxybrowser.com',
        LAUNCH_PROTOCOL: 'roxybrowser:',
        roxyHomeUrl: 'https://roxybrowser.com',
      }
    }
  },
  $development: {
    runtimeConfig: {
      NODE_ENV: 'development',
      ghostKey: '689ef3951b0cf30001d25f91:9b30691bb86067235df9d00979bf6483578b026b4fa2a2edbd55bff6585889e9',
      ghostUrl: 'https://gatetest.roxybrowser.co/__ghost__',
      public: {
        ENV: 'development',
        apiUrl: 'https://lumitest.lumibrowser.com',
        appDownloadUrl: 'https://gatetest.roxybrowser.co',
        LAUNCH_PROTOCOL: 'roxybrowser-dev:',
        roxyHomeUrl: 'https://lumitest.lumibrowser.com',
      }
    }
  },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/google-fonts',
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
    'motion-v/nuxt',
    '@nuxtjs/robots',
    '@nuxt/image'
  ],
  robots: {
    disallow: isDev ? '/' : ['/anbin', '/login', '/figma-icons', '/pay-success'],
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
    }
  },
  primevue: {
    options: {
      theme: {
        options: {
          darkModeSelector: ".my-app-dark",
        },
        preset: definePreset(Aura, {
          primitive: myPreset,
          semantic: {
            primary: {
              100: "{Color.blue.100}",
              200: "{Color.blue.100}",
              300: "{Color.blue.100}",
              400: "{Color.blue.200}",
              500: "{Color.blue.300}",
              600: "{Color.blue.400}",
              700: "{Color.blue.500}",
              800: "{Color.blue.600}",
              900: "{Color.blue.600}",
              950: "{Color.blue.600}",
            },
          },
          components: {
            toast: {
              colorScheme: {
                light: {
                  blur: "3px",
                },
              },
            },
            dialog: {
              color: "#000",
              root: {
                background: "{overlay.modal.background}",
                borderColor: "#A3A9AD",
                color: "{overlay.modal.color}",
                borderRadius: "6px",
                shadow:
                  "0px 1px 1px 0px rgba(0, 0, 0, 0.04), 0px 2px 8px 0px rgba(0, 0, 0, 0.04), 0px 3px 17px 0px rgba(0, 0, 0, 0.04), 0px 4px 30px 0px rgba(0, 0, 0, 0.12)",
              },
              header: {
                padding: "12px 18px 6px 24px",
                gap: "0.5rem",
              },
              title: {
                fontSize: "16px",
                fontWeight: "600",
              },
              content: {
                padding: "0 24px {overlay.modal.padding} 24px",
              },
              footer: {
                padding: "0 24px {overlay.modal.padding} 24px",
                gap: "0.5rem",
              },
            },
            // datatable: {
            //   row: {
            //     hover: {
            //       background: '#fff'
            //     },
            //   },
            // },
          },
        }),
      },
    }
  },
  sitemap: {
    exclude: ['/invite/**', '/no-auth', '/auth', '/login', '/anbin/**', '/figma-icons/**', '/pay-success']
  },
  css: ['./assets/styles/global.css'],
  components: [
    {
      path: '~/components',
      extensions: ['.vue'],
    }
  ],
  sourcemap: {
    client: false,
    server: false
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: "image/png", href: '/favicon-96x96.png', sizes: "96x96" },
        { rel: 'icon', type: "image/svg+xml", href: '/favicon.svg' },
        { rel: 'shortcut icon', href: '/favicon.ico' },
        { rel: 'apple-touch-icon', type: "image/png", href: '/apple-touch-icon.png', sizes: "180x180" },
        { rel: 'manifest', href: '/site.webmanifest' },
      ],
      script: [
        {
          tagPriority: "high",
          textContent: `
            window.__lc = window.__lc || {};
            window.__lc.license = 18087441;
            window.__lc.integration_name = "manual_channels";
            window.__lc.product_name = "livechat";  
            ;(function(n, t, c) {
                function i(n) {
                    return e._h ? e._h.apply(null, n) : e._q.push(n)
                }
                var e = {
                    _q: [],
                    _h: null,
                    _v: "2.0",
                    on: function() {
                        i(["on", c.call(arguments)])
                    },
                    once: function() {
                        i(["once", c.call(arguments)])
                    },
                    off: function() {
                        i(["off", c.call(arguments)])
                    },
                    get: function() {
                        if (!e._h)
                            throw new Error("[LiveChatWidget] You can't use getters before load.");
                        return i(["get", c.call(arguments)])
                    },
                    call: function() {
                        i(["call", c.call(arguments)])
                    },
                    init: function() {
                      var n = t.createElement("script");
                      n.type = "text/javascript";
                      n.fetchpriority = "high";
                      n.src = "https://cdn.livechatinc.com/tracking.js";
                      t.head.appendChild(n)
                    }
                };
                !n.__lc.asyncInit && e.init(),
                n.LiveChatWidget = n.LiveChatWidget || e
            }(window, document, [].slice))
            var random2 = Math.round(Math.random() * 100000000);
            LiveChatWidget.call("set_session_variables", {
                username: "[Roxy]-游客",
                Account_ID: random2
            });
            LiveChatWidget.call("set_customer_name", "[Roxy]-游客");
          `
        }
      ],
      noscript: [
        {
          textContent: `
            <iframe src="https://www.googletagmanager.com/ns.html?id=GTM-KTXR7SHP"height="0" width="0" style="display:none;visibility:hidden"></iframe>
          `
        }
      ]
    }
  },
  hooks: {
    'build:before': () => {
      const json = readFileSync(path.resolve(process.cwd(), './indexnow.json'), 'utf-8')
      const key = json && JSON.parse(json).key
      const hasKeyFile = key && existsSync(path.resolve(process.cwd(), `./public/${key}.txt`))
      if (!hasKeyFile) {
        const key = crypto.randomBytes(32).toString('hex');
        writeFileSync(path.resolve(process.cwd(), `./public/${key}.txt`), key)
        writeFileSync(path.resolve(process.cwd(), `./indexnow.json`), JSON.stringify({ key }))
      }
    }
  },
  i18n: {
    bundle: {
      optimizeTranslationDirective: false
    },
    baseUrl: 'https://roxybrowser.com/',
    locales: [
      { code: 'zh', language: 'zh-CN', file: 'zh.json' },
      { code: 'en', language: 'en-US', file: 'en.json' },
      // { code: 'ru', language: 'RU', file: 'ru.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_and_default',
    lazy: true,
    detectBrowserLanguage: {
      fallbackLocale: 'en',
    }
  },
  image: {
    provider: 'ipx'
  },
  googleFonts: {
    families: {
      Archivo: {
        wght: '400..700'
      },
      'Chivo Mono': {
        wght: '400'
      },
      'JetBrains Mono': {
        wght: '400'
      },
      Heebo: {
        wght: '400..500'
      },
      Inter: {
        wght: '400..700'
      }
    },
    display: 'block'
  },
  vite: {
    build: {
      chunkSizeWarningLimit: 1024 * 500,
      cssCodeSplit: false,
      cssMinify: true,
      terserOptions: {
        compress: {
          drop_console: !isDev, // 去除 console 语句
          drop_debugger: !isDev, // 去除 debugger 语句
        }
      },
      rollupOptions: {
        output: {
          chunkFileNames: '_nuxt/[name]-[hash].js',
          entryFileNames: '_nuxt/[name]-[hash].js',
          manualChunks: {
            'three-vendor': ['three'],
            'three-globe': ['three-globe'],
            'ogl': ['ogl'],
            'core1': ['motion-v', 'axios', '@vueuse/core', 'vue-router'],
            'markdown-it': ['markdown-it', 'markdown-it-anchor', 'markdown-it-attrs', 'markdown-it-video'],
          }
        }
      }
    },
    plugins: [
      uploadIcons({ extractDir: './assets/svgs' }),
      svgLoader({
        svgoConfig: {
          plugins: [
            {
              name: 'myPlugin',
              fn: (() => {
                const nameSet = new Set<string>()

                const genSvgTypes = debounce(() => {
                  const typeDefine = [...nameSet]
                    .map((n) => `'${n}'`)
                    .join(`
  | `);
                  const code = `
  /** 此文件自动生成，请勿修改！所有可用的 svg name */
  export type SvgNames = ${typeDefine}`;
                  writeFile(svgIconTypesPath, code);
                }, 3000);

                return (root, params, info) => {
                  const name = info.path
                    ?.split("assets/svgs/")
                    .at(1)
                    ?.replace(".svg", "");
                  name && nameSet.add(name);
                  genSvgTypes();
                  return {
                    element: {
                      enter: (node) => {
                        if (node.name === "svg") {
                          node.attributes.width = "1em";
                          node.attributes.height = "1em";
                        }
                        // // 基础图标的颜色使用当前颜色
                        // if (info.path?.includes('assets/images/base/')
                        //   && node.attributes.fill
                        //   && node.name === 'path') {
                        //   node.attributes.fill = 'currentColor'
                        // }
                      },
                    },
                  };
                };
              })(),
            },
          ],
        },
      }),
      // 在 build 阶段再运行压缩插件
      ViteCompression(),
      ViteCompression({ algorithm: 'brotliCompress' }),
      imagetools()
    ],
  }
})