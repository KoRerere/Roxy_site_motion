import { defineAsyncComponent } from 'vue'

const modules = import.meta.glob<Component>('../../assets/svgs/**/*.svg', {
  query: '?component',eager: false
})

export const svgIcons = Object.entries(modules).reduce((acc, [key, value]) => {
  acc[key] = defineAsyncComponent(value)
  return acc
}, {} as Record<string, Component>)