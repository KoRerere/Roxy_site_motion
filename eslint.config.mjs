import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
  antfu({
    formatters: true,
    unocss: true,
    vue: true,
    typescript: true,
  }, {
    // Without `files`, they are general rules for all files
    rules: {
      'unicorn/prefer-includes': 'off',
    },
  }),
)
