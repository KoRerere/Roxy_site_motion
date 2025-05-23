<template>
  <div class="inline-flex items-center gap-2 p-10px bg-white/20 rounded-2 border-1 border-white/60 border-solid">
    <span class="cursor-pointer" @click="decrease">
      <RxIcon name="base/rx_ic_minus" color="#FFF" />
    </span>
    <input 
      :class="cn(
        'text-5 sm:text-4 bg-transparent border-0 outline-none text-white text-center h-5 w-[160px] sm:w-[120px] input-number',
        inputClass
      )" 
      v-model="__moduleValue" 
      :min="min"
      :max="max"
      type="number" 
      pattern="[0-9]*"
      @blur="handleBlur"
      @keydown.enter="handleBlur"
      @input="handleInput"
    />
    <span class="cursor-pointer" @click="increase">
      <RxIcon name="base/rx_ic_plus" color="#FFF" />
    </span>
  </div>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const modelValue = defineModel<number>('modelValue', {
  default: 1
})

const props = defineProps({
  step: {
    type: Object,
    default: () => ({})
  },
  min: {
    type: Number,
    default: 0
  },
  max: {
    type: Number,
    default: 100
  },
  inputClass: {
    type: String,
    default: ''
  }
})

const __moduleValue = ref(modelValue.value)

watch(modelValue, (v) => {
  __moduleValue.value = v;
})

function generateStepAll() {
  const stepAll: number[] = [];
  const marks = Object.keys(props.step).map(Number).sort((a, b) => a - b);

  for (let i = 1; i < marks.length; i++) {
    const start = marks[i - 1]
    const end = marks[i]
    const step = props.step[start];
    // 在这段间隔里面，需要多少个步长
    const steps = (end - start) / step

    // 每个步长需要占的比例

    for (let j = 0; j < steps; j++) {
      stepAll.push(start + j * step + step)
    }
  }

  return stepAll;
}

const stepAll = generateStepAll();

const handleNumber = (v: number) => {
  // 如果输入的是不是数字
  if (isNaN(v)) {
    return modelValue.value
  }

  if (v < props.min) {
    return props.min;
  }

  if (v > props.max) {
    return props.max;
  }

  const inStepAll = stepAll.find(item => item === v);
  if (inStepAll) {
    return v;
  } 

  return stepAll.find(item => item > v)!;
}

const handleBlur = (e) => {
  const v = Number(e.target.value);
  const newVal = handleNumber(v);
  modelValue.value = newVal;
}

const handleInput = (e) => {
  const value = Number(e.target.value)
  if (value >= props.min && value <= props.max) {
    __moduleValue.value = value;
  }
}

// +
const increase = () => {
  if (modelValue.value >= props.max) {
    return;
  }
  const stepNumber = Object.keys(props.step).map(Number).sort((a, b) => a - b);
  const idx = stepNumber.findIndex(key => modelValue.value < key)
  const curr = stepNumber[idx - 1];
  const plus = props.step[curr]
  modelValue.value += plus;
}

// -
const decrease = () => {
  if (modelValue.value <= props.min) {
    return;
  }
  const stepNumber = Object.keys(props.step).map(Number).sort((a, b) => b - a);
  const idx = stepNumber.findIndex(key => key < modelValue.value)
  const curr = stepNumber[idx];
  const plus = props.step[curr]
  modelValue.value -= plus;
}
</script>