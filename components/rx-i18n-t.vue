<script lang="ts">
import { defineComponent, h } from 'vue'

export default defineComponent({
  name: 'RxI18nT',
  props: {
    keypath: {
      type: String,
      required: true,
    },
    values: {
      type: Object as () => Record<string, unknown>,
      default: () => ({}),
    },
  },
  setup(props, { slots }) {
    return () => {
      const translated = props.keypath
      const regex = /{(\w+)}/g
      const children: (string | ReturnType<typeof h>)[] = []

      let lastIndex = 0
      let match: RegExpExecArray | null
      while ((match = regex.exec(translated)) !== null) {
        if (match.index > lastIndex) {
          children.push(translated.slice(lastIndex, match.index))
        }

        const key = match[1]
        const slot = slots[key]
        if (slot) {
          children.push(slot())
        } else {
          // fallback to plain text value
          children.push(String(props.values?.[key] ?? `{${key}}`))
        }

        lastIndex = regex.lastIndex
      }

      if (lastIndex < translated.length) {
        children.push(translated.slice(lastIndex))
      }

      return children
    }
  },
})
</script>
