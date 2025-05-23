<template>
  <div 
    :class="[
      'tabs-wrapper',
      overflowTabs.length ? 'tabs-wrapper-after' : ''
    ]" 
    v-bind="$attrs"
  >
    <div 
      class='tabs-container' 
      ref="scrollRef" 
      @scroll="handleScroll"
    >
      <div
        v-for="tab in tabs"
        :ref="el => tabRefs.set(tab.key, el)"
        :key="tab.key"
        class="tab-item"
        @click="modelValue = tab.key"
      >
        <slot name="tab-item" :tab="tab">
          {{ tab.label }}
        </slot>
      </div>
    </div>

    <button 
      v-if="overflowTabs.length" 
      @click="handleMouseEnter" 
      @mouseenter="handleMouseEnter" 
      @mouseleave="handleMouseLeave" 
      class="more-button"
    >
      :
      <div v-show="dropdownVisible" class="dropdown" @mouseleave="handleMouseLeave" @mouseenter="handleMouseEnter">
        <div
          v-for="tab in overflowTabs"
          :key="tab.key"
          @click="scrollToTab($event, tab.key)"
          class="dropdown-item"
        >
          <slot name="tab-item" :tab="tab">
            {{ tab.label }}
          </slot>
        </div>
      </div>
    </button>
  </div>
</template>


<script setup lang="ts">
import { ref, onMounted, nextTick } from 'vue';

const scrollRef = ref<HTMLDivElement>();
const tabRefs = new Map();

type Tab = {
  key: string;
  label: string;
}

const props = withDefaults(defineProps<{
  tabs: Tab[]
}>(), {
  tabs: () => []
})

const modelValue = defineModel();

const overflowTabs = ref<Tab[]>([]);
const dropdownVisible = ref(false);

const calculateOverflow = () => {
  const newOverflowTabs = [];
  const scrollRect = scrollRef.value!.getBoundingClientRect();

  for (const tab of props.tabs) {
    const el = tabRefs.get(tab.key);
    if (!el) continue;
    const tabRect = el.getBoundingClientRect();

    if (
      tabRect.right > scrollRect.right || // 完全或部分被遮挡
      tabRect.left < scrollRect.left
    ) {
      newOverflowTabs.push(tab);
    }
  }
  console.log('scrollRect', scrollRect)
  overflowTabs.value = newOverflowTabs;
};

let timer: NodeJS.Timeout | null = null;
const handleScroll = () => {
  timer && clearTimeout(timer);
  timer = setTimeout(() => {
    calculateOverflow();
  }, 100)
}

const scrollToTab = (event: MouseEvent, key: string) => {
  modelValue.value = key;
  event.stopPropagation();
  dropdownVisible.value = false;
  const el = tabRefs.get(key);
  if (el) {
    el.scrollIntoView({ inline: 'nearest', block: 'nearest' });
    setTimeout(() => {
      calculateOverflow();
    }, 200)
  }
};

let mouseLeaveTimer: NodeJS.Timeout | null = null;
const handleMouseLeave = (e: MouseEvent) => {
  e.stopPropagation();
  mouseLeaveTimer && clearTimeout(mouseLeaveTimer);
  mouseLeaveTimer = setTimeout(() => {
    dropdownVisible.value = false;
  }, 500)
}

const handleMouseEnter = (e: MouseEvent) => {
  e.stopPropagation();
  mouseLeaveTimer && clearTimeout(mouseLeaveTimer);
  dropdownVisible.value = true;
}

onMounted(() => {
  nextTick(() => {
    calculateOverflow();
    window.addEventListener('resize', calculateOverflow);
  });

  onBeforeUnmount(() => {
    window.removeEventListener('resize', calculateOverflow);
  })
});
</script>


<style lang="scss">
.tabs-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.more-button {
  position: relative;
  padding: 0 8px;
  cursor: pointer;
  width: 36px;
  height: 36px;
  background: #FFF;
}

.dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
  height: 200px;
  white-space: nowrap;
}

.tabs-container {
  display: flex;
  overflow-x: auto;
  scrollbar-width: none;
  height: 36px;
  align-items: center;
  position: relative;
}

.tabs-wrapper-after::after {
  content: '';
  position: absolute;
  right: 36px;
  height: 100%;
  width: 36px;
  box-shadow: inset -10px 0 8px -8px rgba(0, 0, 0, 0.08);
}

.tab-item {
  padding: 0 12px;
  white-space: nowrap;
  flex-shrink: 0;

}

</style>