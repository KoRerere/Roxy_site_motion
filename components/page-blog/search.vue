<template>
  <div class="w-375px md:w-600px search-box">
    <RxIcon name="base/rx_ic_magnify" class="search-icon" color="#7D8387" />
    <input
      ref="inputRef" 
      :placeholder="$t('搜索')" 
      v-model="__moduleValue" 
      @keyup="searchKeyup" 
      @blur="search" 
    />
    <div class="search-shade"></div>
  </div>
</template>

<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon';

const route = useRoute();
const modelValue = defineModel<string>({ default: '' });
const router = useRouter();
const localePath = useLocalePath();
const inputRef = ref<HTMLInputElement>();

const __moduleValue = ref('')

function search() {
  if (__moduleValue.value !== modelValue.value) {
    modelValue.value = __moduleValue.value
    router.push({
      path: localePath('/blog'),
      query: {
        ...(route.query || {}),
        search: __moduleValue.value
      }
    })
  }
}

const searchKeyup = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    console.log('enter')
    search()
  }
}

watch(modelValue, (value) => {
  __moduleValue.value = value
}, { immediate: true })

const breakpoints = useRxBreakpoints();
const smWidth = breakpoints.smallerOrEqual('sm')

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.value = route.query.search as string || '';
    if (!smWidth.value) {
      inputRef.value.focus();
      inputRef.value.select();
    }
  }
})

</script>

<style lang="scss" scoped>
.search-box {
  height: 48px;
  border-radius: 12px;
  border: 1px solid var(--border-border-inactive, #C7D1D6);
  background: #FFF;
  position: relative;

  input {
    outline: none;
    border: none;
    width: 100%;
    height: 100%;
    padding: 14px 48px;
    position: relative;
    border-radius: 12px;
    background: #FFF;
    z-index: 2;
  }

  input::placeholder {
    color: var(--text-text-inactive, #7D8387);
  }
}

.search-icon {
  position: absolute;
  top: 50%;
  left: 20px;
  transform: translateY(-50%);
  width: 16px;
  height: 16px;
  color: #7D8387;
  z-index: 3;
}

.search-shade {
  position: absolute;
  width: calc(100% - 24px);
  height: 100%;
  border-radius: 12px;
  opacity: 0.6;
  background: #E3E6E8;
  backdrop-filter: blur(2.5px);
  top: 5px;
  left: 50%;
  transform: translateX(-50%);
  z-index: 0;
}
</style>
