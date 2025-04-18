<template>
  <div class="search-box">
    <input ref="inputRef" type="text" placeholder="Search..." v-model="modelValue" @keyup.enter="search" @blur="search" @click="saveOldSearchText"/>
    <div class="search-shade"></div>
  </div>
</template>

<script setup lang="ts">

const route = useRoute();
const modelValue = defineModel<string>({ default: '' });
const router = useRouter();
const localePath = useLocalePath();
const inputRef = ref<HTMLInputElement>();

let oldSearchText = modelValue.value;
function saveOldSearchText() {
  oldSearchText = modelValue.value;
}

function search() {
  if (oldSearchText !== modelValue.value) {
    router.push({
      path: localePath('/blog'),
      query: {
        ...(route.query || {}),
        search: modelValue.value
      }
    })
  }
}

onMounted(() => {
  if (inputRef.value) {
    inputRef.value.value = route.query.search as string || '';
    inputRef.value.focus();
    inputRef.value.select();
  }
})

</script>

<style lang="scss" scoped>
.search-box {
  width: 600px;
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
    font-family: Inter;
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
  z-index: 2;
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
