<script lang="ts" setup>

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined

const props = defineProps({
  inputs: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  size: {
    type: String as PropType<Size>,
    default: 'md',
  },
})

const base = ['text', 'number']
const _inputs = computed(() => props.inputs.filter(item => item.separator || base.includes(item.type)))

function parseInput(input: any) {
  const { onblur, oninput } = input

  function _oninput() {
    input.invalid = false
    oninput?.()
  }

  return {
    ...input,
    onblur,
    oninput: _oninput,
  }
}
</script>

<template>
  <div :class="cn('number-group', size)">
    <template v-for="(item, index) in _inputs" :key="index">
      <div v-if="!item.separator" class="number-group-item">
        <input v-model="item.value" class="number-group-item-input" type="number" v-bind="parseInput(item)">
        <div v-if="item.invalid" class="number-group-item-error">
          {{ item.errorMsg }}
        </div>
      </div>
      <div v-else class="number-group-separator">
        {{ item.value || ':' }}
      </div>
    </template>
  </div>
</template>

<style lang="scss" scoped>

.xl.number-group {
  padding: 12px 12px 12px 14px;
}

.xl .number-group-item {
  font-size: 16px;
}

.number-group {
  display: flex;
  flex: 1;
  align-items: center;
  padding: 10px 10px 10px 12px;
  gap: 6px;
  min-height: 38px;
  border-radius: var(--Component-Colors-TextInput-radius-radius-md, 10px);
  border: 1px solid var(--Component-Colors-TextInput-border-border, #c7cdd1);
  background: var(--Component-Colors-TextInput-bg-bg, #fff);
  box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);

  &-item,
  &-separator {
    color: var(--Component-Colors-TextInput-text-text, #171c1f);
    // font-family: 'JetBrains Mono';
    font-size: 14px;
    line-height: var(--Line-Height-text-lg, 20px);
  }

  &-item {
    position: relative;
    flex: 1;

    &-input {
      width: 100%;
      padding: 0;
      border: none;
      background-color: #fff;
    }

    &-error {
      position: absolute;
      left: -8px;
      top: 170%;
      color: var(--Component-Colors-TextInput-error-error, #ff4d4f);
      z-index: 1;
    }
  }
}

input {
  outline: none;
}
</style>
