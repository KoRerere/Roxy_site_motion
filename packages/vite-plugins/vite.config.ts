import { builtinModules } from 'node:module'
// vite.config.js
import { resolve } from 'node:path'
import { fileURLToPath } from 'node:url'
import { defineConfig } from 'vite'
import dts from 'vite-plugin-dts'
import { dependencies } from './package.json'

const packageDir = fileURLToPath(new URL('.', import.meta.url))

export default defineConfig({
  build: {
    lib: {
      entry: resolve(packageDir, 'src/index.ts'),
      fileName: 'index',
      formats: ['es', 'cjs'],
    },
    rollupOptions: {
      external: [
        ...builtinModules.map(m => `node:${m}`),
        ...Object.keys(dependencies),
      ],
    },
  },
  plugins: [dts({ rollupTypes: true })],
})
