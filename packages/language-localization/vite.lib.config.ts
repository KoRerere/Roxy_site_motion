import { builtinModules } from 'node:module'
// vite.config.js
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'

const packageDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  ssr: {},
  build: {
    outDir: 'dist',
    lib: {
      // entry: [resolve(packageDir, 'src/index.ts'), resolve(packageDir, 'src/bin/index.ts')],
      entry: {
        'vite/index': resolve(packageDir, 'src/index.ts'),
        'bin/index': resolve(packageDir, 'src/bin/index.ts'),
      },
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...builtinModules.map(m => `node:${m}`),
        'body-parser',
        'formidable',
        'serve-static',
        'glob',
        'p-limit',
        '@roxy/puppeteer-google-translate',
      ],
    },
  },
  plugins: [
    dts({
      rollupTypes: true,
      tsconfigPath: resolve(packageDir, 'tsconfig.app.json'),
      include: [
        'src/index.ts',
        'src/bin/**/*.ts',
        'src/utils/**/*.ts',
      ],
    }),
  ],
})
