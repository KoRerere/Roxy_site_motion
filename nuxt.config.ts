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

const svgIconTypesPath = './components/rx-icon/src/svg-icon-types.ts';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  routeRules: {
    '/': { prerender: true },
    '/copyright/**': { prerender: true },
    '/auth': { prerender: true },
    '/auth/app_vk': { prerender: true },
    '/auth/web_vk': { prerender: true },
    '/download': { prerender: true },
    '/features/**': { prerender: true },
    '/pricing': { prerender: true },
    '/invite': { prerender: true },
    '/login': { prerender: true },
    '/no-auth': { prerender: true },
    '/solutions/**': { prerender: true },
    '/blog/**': { ssr: true }
  },
  // 使用这种方式来获取环境变量，才能确保pnpm preview能够正常运行
  // devServer: {
  //   host: '0.0.0.0',
  //   port: 3000,
  //   https: false
  // },
  $production: {
    runtimeConfig: {
      NODE_ENV: 'production',
      ghostKey: '67e50e55fb582b0001fae020:ed4ac49d5b650ce64000de93345573e3540a06543a125c4bcf0a1695c4af28f8',
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
      ghostKey: '67e50e55fb582b0001fae020:ed4ac49d5b650ce64000de93345573e3540a06543a125c4bcf0a1695c4af28f8',
      ghostUrl: 'https://gatetest.roxybrowser.co/__ghost__',
      public: {
        ENV: 'development',
        apiUrl: 'https://lumitest.lumibrowser.com',
        appDownloadUrl: 'https://lumitest.lumibrowser.com',
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
    'motion-v/nuxt'
  ],
  build: {
    transpile: ['vue-countup-v3'],
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
    exclude: ['/invite/**', '/auth/**', '/login/**', '/experimental/**', '/figma-icons/**', '/blog/**']
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
      { code: 'ru', language: 'RU', file: 'ru.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_and_default',
    lazy: true,
    detectBrowserLanguage: {
      fallbackLocale: 'en',
    }
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
          drop_console: false, // 去除 console 语句
          drop_debugger: true, // 去除 debugger 语句
        }
      },
      rollupOptions: {
        output: {
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
    // optimizeDeps: {
    //   include: ['three', 'three-globe', 'ogl', 'motion-v']
    // }
  }
})
