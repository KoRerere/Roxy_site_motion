<script setup lang="ts">
import FormItem from "./form-item.vue";
import { z } from 'zod'

const props = defineProps({
  schemas: {
    type: Array,
    required: true,
  },
})
const emit = defineEmits(['submit'])


const formModel = defineModel<Recordable>({ default: {} })
/** 错误信息 */
const errors = ref({})

// 使用 Zod 定义验证规则
const validationSchema = computed(() => {
    return z.object(props.schemas!.reduce((acc, item) => {
        if (item.rule) {
          console.log('item.rule', item.rule)
        acc[item.field] = item.rule.validator?.(z, formModel) ?? z.any()
        }
        return acc
    }, {}))
})

function handleSubmit(e?: Event) {
  e?.preventDefault()
    const result = validationSchema.value.safeParse(formModel.value)
    console.log('result', result)
    // 清除所有字段的错误信息
    Object.keys(errors.value).forEach((key) => {
      errors.value[key] = ''
    })

    // 表单验证失败，更新错误信息
    if (!result.success) {
      // 遍历错误并更新错误信息
      result.error.errors.forEach((error) => {
        const field = error.path[0]
        errors.value[field] = error.message
      })
      return Promise.reject(errors.value)
    }
    else {
      emit('submit', formModel.value)
      return Promise.resolve(formModel.value)
    }
}

  /** 清除所有验证信息 */
function clearValidateMessages() {
  Object.keys(errors.value).forEach((key) => {
    errors.value[key] = ''
  })
}

defineExpose({
  clearValidateMessages,
  submit: handleSubmit,
})
</script>

<template>
<form @submit.prevent="handleSubmit" class="lb-form">
    <template v-for="schema in schemas" :key="schema.field">
      <FormItem 
        :schema="schema" 
        v-model="formModel[schema.field]" 
        v-model:errors="errors" 
        :validation-schema 
      />
    </template>
  </form>
</template>

<style lang="scss" scoped>
.lb-form {
  width: 100%;
}

</style>