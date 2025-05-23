<script setup lang="ts">
import LBLabel from './components/lb-label.vue';
import LBInput from './components/lb-input.vue';
import type { ZodObject } from 'zod'

const props = defineProps({
    schema: Object,
    validationSchema: {
        type: Object as PropType<ZodObject<any>>,
        required: true,
    },
})

const modelValue = defineModel()
const errors = defineModel('errors', {
  type: Object,
  default: {},
})

const id = useId()

const labelId = computed(() => {
  return `${props.schema.field}-${id}`
})

const component = computed(() => {
    return {
        input: LBInput,
    }[props.schema.component || 'input']
})

/** 触发校验的事件名称 */
const triggerEventName = computed(() => {
  return props.schema.rule?.trigger || 'change'
})

watch(modelValue, () => {
  validateField()
})

/**
 * 单独验证某个字段
 */
 function validateField() {
  const field = props.schema.field
  /**
   * 提取单字段的 schema
   */
  const singleFieldSchema = props.validationSchema.pick({ [field]: true })
  const result = singleFieldSchema.safeParse({ [field]: modelValue.value })

  // 清除之前的错误信息
  errors.value[field] = ''

  // 如果验证失败，保存错误消息
  if (!result.success) {
    errors.value[field] = result.error.errors[0].message
  }
}

function isFunction(obj: any): obj is Function {
  return typeof obj === 'function'
}
</script>

<template>
    <div class="form-item">
        <LBLabel :for="labelId">{{ isFunction(schema.label) ? schema.label() : schema.label }}</LBLabel>
        <component 
          :is="component" 
          v-model="modelValue" 
          v-bind="schema.componentProps" 
          :labelId="labelId" 
          :placeholder="isFunction(schema.componentProps?.placeholder) ? schema.componentProps.placeholder() : schema.componentProps?.placeholder"
          ></component>
        <div class="error-message">{{ errors[schema.field] }}</div>
    </div>
</template>

<style lang="scss" scoped>
.form-item {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-sm, 4px);
    align-self: stretch;

    // &:last-of-type {
    //   .error-message {
    //     height: 10px;
    //   }
    // }

    .error-message {
        font-size: 12px;
        color: rgb(203, 39, 45);
        // height: 20px;
        // line-height: 20px;
        height: 16px;
        line-height: 16px;
    }
}

</style>