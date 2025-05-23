<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'
const props = defineProps({
    type: {
        type: String,
        default: 'text'
    },
    labelId: String
})

const modelValue = defineModel()

const innerType = ref(props.type)

const togglePassword = () => {
    innerType.value = innerType.value === 'password' ? 'text' : 'password'
}
</script>

<template>
    <div class="input-container">
        <input v-model="modelValue" v-bind="$attrs" :id="labelId" :type="type === 'password' ? innerType : type" class="lb-input" />
        <span 
            v-if="type === 'password'" 
            class="toggle-password" 
            @click="togglePassword"
        >
            <RxIcon :name="innerType === 'password' ? 'base/rx_ic_eye' : 'base/rx_ic_eye_close'" class="!mb-0 text-[16px]"  />
        </span>
    </div>
</template>

<style lang="scss" scoped>
.input-container {
    position: relative;
    width: 100%;

    .toggle-password {
      position: absolute;
      top: 50%;
      right: 10px;
      transform: translateY(-50%);
      cursor: pointer;
      font-size: 18px;
      color: #666;
      display: flex;
      align-items: center;
    }
}

.lb-input {
    width: 100%;
    display: flex;
    padding: 8px 8px 8px 10px;
    align-items: center;
    gap: 6px;
    align-self: stretch;
    border-radius: var(--Component-Colors-TextInput-radius-radius-md, 6px);
    border: 1px solid var(--Component-Colors-TextInput-border-border, #C7CDD1);
    background: var(--Component-Colors-TextInput-bg-bg, #FFF);
    box-shadow: 0px 1px 2px 0px rgba(16, 24, 40, 0.05);
    outline: none;
    color: var(--Colors-Text-text-primary, #101828);

    &:focus {
        border-color: var(--Colors-Text-text-brand, #12A3FC);;
        background-color: var(--color-bg-2);
        box-shadow: 0 0 0 0 var(--color-primary-light-2);
    }
}
</style>