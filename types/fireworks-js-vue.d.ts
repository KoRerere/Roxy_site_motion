declare module '@fireworks-js/vue/dist/index.es.js' {
  import type { DefineComponent } from 'vue'

  const Fireworks: DefineComponent<Record<string, any>, Record<string, any>, any>

  export default Fireworks
  export { Fireworks }
}
