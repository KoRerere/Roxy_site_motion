<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const props = defineProps({
  step: {
    type: Object,
    default: () => ({}),
  },
  min: {
    type: Number,
    default: 0,
  },
  max: {
    type: Number,
    default: 100,
  },
  inputClass: {
    type: String,
    default: '',
  },
})

const modelValue = defineModel<number>('modelValue', {
  default: 1,
})

const __moduleValue = ref(modelValue.value)

watch(modelValue, (v) => {
  __moduleValue.value = v
})

function generateStepAll() {
  const stepAll: number[] = []
  const marks = Object.keys(props.step).map(Number).sort((a, b) => a - b)

  for (let i = 1; i < marks.length; i++) {
    const start = marks[i - 1]
    const end = marks[i]
    const step = props.step[start]
    // 在这段间隔里面，需要多少个步长
    const steps = (end - start) / step

    // 每个步长需要占的比例

    for (let j = 0; j < steps; j++) {
      stepAll.push(start + j * step + step)
    }
  }

  return stepAll
}

const stepAll = generateStepAll()

function handleNumber(v: number) {
  // 如果输入的是不是数字
  if (isNaN(v)) {
    return modelValue.value
  }

  if (v < props.min) {
    return props.min
  }

  if (v > 0 && v < 10) {
    return 10
  }

  if (v > props.max) {
    return props.max
  }

  const inStepAll = stepAll.find(item => item === v)
  if (inStepAll) {
    return v
  }

  return stepAll.find(item => item > v)!
}

function handleBlur(e) {
  const v = Number(e.target.value)
  const newVal = handleNumber(v)
  modelValue.value = newVal
}

function handleInput(e) {
  const value = Number(e.target.value)
  if (value >= props.min && value <= props.max) {
    __moduleValue.value = value
  }
}

// +
function increase() {
  if (modelValue.value >= props.max) {
    return
  }
  const stepNumber = Object.keys(props.step).map(Number).sort((a, b) => a - b)
  const idx = stepNumber.findIndex(key => modelValue.value < key)
  const curr = stepNumber[idx - 1]
  const plus = props.step[curr]
  if (plus < 10) {
    modelValue.value = 10
  }
  else {
    modelValue.value += plus
  }
}

// -
function decrease() {
  if (modelValue.value <= props.min) {
    return
  }
  const stepNumber = Object.keys(props.step).map(Number).sort((a, b) => b - a)
  const idx = stepNumber.findIndex(key => key < modelValue.value)
  const curr = stepNumber[idx]
  const plus = props.step[curr]
  if (plus < 10) {
    modelValue.value = 0
  }
  else {
    modelValue.value -= plus
  }
}
</script>

<template>
  <div class="inline-flex gap-2 items-center">
    <span class="p-1 border-1 border-[#AFB7BB] rounded-1 border-solid flex cursor-pointer items-center justify-center" @click="decrease">
      <RxIcon name="base/rx_ic_minus" color="#575D60" />
    </span>
    <input
      v-model="__moduleValue"
      :class="cn(
        'text-5 sm:text-6 font-700 bg-transparent border-0 outline-none text-center h-5 w-[110px] input-number h-full',
        inputClass,
      )"
      :min="min"
      :max="max"
      type="number"
      pattern="[0-9]*"
      @blur="handleBlur"
      @keydown.enter="handleBlur"
      @input="handleInput"
    >
    <span class="p-1 border-1 border-[#AFB7BB] rounded-1 border-solid flex cursor-pointer items-center justify-center" @click="increase">
      <RxIcon name="base/rx_ic_plus" color="#575D60" />
    </span>
  </div>
</template>
