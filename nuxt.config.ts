import { uploadIcons } from '@roxy/vite-plugins'
import svgLoader from "vite-svg-loader";
import { debounce } from 'es-toolkit'
import { writeFile } from 'node:fs/promises'
import { writeFileSync, readFileSync, existsSync } from 'node:fs'
import path from 'node:path'
import crypto from 'node:crypto'
import { defineNuxtConfig } from 'nuxt/config'
import ViteCompression from 'vite-plugin-compression'

const svgIconTypesPath = './components/rx-icon/src/svg-icon-types.ts';

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  modules: [
    '@primevue/nuxt-module',
    '@nuxtjs/google-fonts',
    '@unocss/nuxt',
    '@nuxtjs/i18n',
    '@nuxtjs/seo',
  ],
  sitemap: {
    exclude: ['/invite/**', '/auth/**', '/dev-auth/**', '/login/**']
  },
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
    locales: [
      { code: 'zh', language: 'zh-CN', file: 'zh.json' },
      { code: 'en', language: 'en-US', file: 'en.json' },
      { code: 'ru', language: 'RU', file: 'ru.json' },
    ],
    defaultLocale: 'en',
    strategy: 'prefix_and_default',
    lazy: true
  },
  vite: {
    // assetsInclude: ['**/*.svg', '**/*.png'],
    build: {
      minify: true,
      // chunkSizeWarningLimit: 800,
      // assetsInlineLimit: 5120,
      terserOptions: {
        compress: {
          drop_console: true, // 去除 console 语句
          drop_debugger: true, // 去除 debugger 语句
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
      ViteCompression({
        verbose: true,  // 输出日志
        disable: false,  // 禁用插件
        threshold: 10240,  // 仅压缩大于10KB的文件
        algorithm: 'gzip',  // 使用gzip算法
        ext: '.gz',  // 压缩后的文件扩展名
        // 压缩等级
        compressionOptions: {
          level: 5,
        },
      }),
    ]
  }
})
