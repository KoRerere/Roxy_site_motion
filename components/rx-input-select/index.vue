<script lang="ts" setup>
import type { SvgNames } from '../rx-icon'
import { RxIcon } from '../rx-icon'

type Size = 'xxs' | 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'xxl' | undefined

interface Option {
  label: string
  value?: any
  icon?: SvgNames
  image?: string
  alt?: string
}

interface Props {
  size?: Size
  icon?: SvgNames
  iconColor?: string
  name?: string
  options?: Option[]
  placeholder?: string
  filter?: boolean
  modelValue?: any
  pt?: any
  dropdownPlacement?: 'bottom' | 'top'
}

defineOptions({
  inheritAttrs: false,
})

const props = withDefaults(defineProps<Props>(), {
  options: () => [],
  placeholder: '',
  filter: true,
  dropdownPlacement: 'bottom',
})

const emit = defineEmits(['change', 'update:modelValue', 'value-change'])

const selectedValue = ref<HTMLElement | null>(null)
const optionsList = ref<HTMLElement | null>(null)
const showDropdown = ref(false)
const filterValue = ref('')
const focusedIndex = ref(-1)
const dropdownPosition = ref({
  left: 0,
  top: 0,
  width: 0,
  transform: '' as string,
})

const iconSize = computed(() => {
  if (props.size === 'xl') {
    return 18
  }
  if (props.size === 'lg') {
    return 16
  }
  return 14
})

/** UnoCSS；BEM 类名保留在模板中供外部覆盖 */
const rootFrameClass = computed(() => {
  const s = props.size
  if (s === 'xxl') {
    return 'min-h-9 rounded-lg border border-[#e5e9eb]'
  }
  if (!s) {
    return 'min-h-11 rounded-lg border border-[#e5e9eb]'
  }
  switch (s) {
    case 'xl':
      return 'min-h-11 rounded-[10px] border border-[#e5e9eb]'
    case 'lg':
      return 'min-h-11 rounded-lg border border-[#e5e9eb]'
    case 'md':
      return 'min-h-11 rounded-md border border-[#c7cdd1]'
    case 'sm':
      return 'min-h-11 rounded-md border border-[#c7cdd1]'
    case 'xs':
      return 'min-h-11 rounded border-[0.5px] border-[#c7cdd1]'
    case 'xxs':
      return 'min-h-11 rounded border-[0.5px] border-[#c7cdd1]'
    default:
      return 'min-h-11 rounded-lg border border-[#e5e9eb]'
  }
})

const dropdownFrameClass = computed(() => {
  const s = props.size
  if (!s) {
    return 'rounded-md'
  }
  switch (s) {
    case 'xl':
      return 'rounded-[10px] border border-[#e5e9eb]'
    case 'lg':
      return 'rounded-lg border border-[#e5e9eb]'
    case 'md':
    case 'sm':
      return 'rounded-md border border-[#c7cdd1]'
    case 'xs':
    case 'xxs':
      return 'rounded border-[0.5px] border-[#c7cdd1]'
    case 'xxl':
      return 'rounded-md'
    default:
      return 'rounded-md'
  }
})

const valueSizeClass = computed(() => {
  const s = props.size
  if (!s) {
    return 'py-1.5 pl-2 pr-1.5 text-[13px] leading-5'
  }
  switch (s) {
    case 'xl':
      return 'pt-[13px] pr-[13px] pb-[13px] pl-[15px] text-base leading-5'
    case 'lg':
      return 'pt-2.5 pr-2.5 pb-2.5 pl-3 text-sm leading-5'
    case 'md':
      return 'p-2 pl-2.5 text-[13px] leading-5'
    case 'sm':
      return 'py-1.5 pl-2 pr-1.5 text-xs leading-5'
    case 'xs':
      return 'p-1.5 text-xs leading-4'
    case 'xxs':
      return 'pt-1 pr-1 pb-1 pl-1.5 text-xs leading-4'
    case 'xxl':
      return 'py-1.5 pl-2.5 pr-1.5 text-sm leading-5'
    default:
      return 'py-1.5 pl-2 pr-1.5 text-[13px] leading-5'
  }
})

const dropdownIconSizeClass = computed(() => {
  const s = props.size
  switch (s) {
    case 'xl':
      return 'pr-[15px]'
    case 'lg':
      return 'pr-3'
    case 'md':
      return 'pr-2.5'
    case 'xs':
    case 'xxs':
      return 'pr-1.5'
    case 'xxl':
      return 'pr-2.5'
    default:
      return ''
  }
})

const selectItemGapClass = computed(() => {
  if (props.size === 'xl') {
    return 'gap-[10px]'
  }
  if (props.size === 'lg') {
    return 'gap-2'
  }
  return 'gap-1.5'
})

const selectedOption = computed(() => {
  if (props.modelValue === null || props.modelValue === undefined) {
    return null
  }

  // 如果 modelValue 是对象，直接在 options 中查找匹配的对象
  if (typeof props.modelValue === 'object') {
    return props.options.find((option) => {
      // 对于对象类型，我们可以通过比较 value 或整个对象来匹配
      if (option.value && typeof option.value === 'object') {
        return JSON.stringify(option.value) === JSON.stringify(props.modelValue)
      }
      return JSON.stringify(option) === JSON.stringify(props.modelValue)
    })
    // 如果精确匹配失败，尝试通过 label 匹配（兼容 modelValue 只有 label 字段的情况）
    || (props.modelValue.label
      ? props.options.find(option => option.label === props.modelValue.label)
      : null)
    || null
  }

  // 对于基本类型，通过 value 或 label 匹配
  return props.options.find((option) => {
    if (props.modelValue && !option.value) {
      return option.label === props.modelValue
    }
    return option.value === props.modelValue
  }) || null
})

function optionRowToneClass(option: Option, index: number) {
  const isHovered = focusedIndex.value === index && selectedOption.value !== option
  if (isHovered) {
    return 'bg-[#f5f7f9]'
  }
  if (selectedOption.value === option) {
    return 'bg-[#e8f5fc] text-[#171c1f]'
  }
  return ''
}

const filteredOptions = computed(() => {
  if (!props.filter || !filterValue.value) {
    return props.options
  }

  const filterLower = filterValue.value.toLowerCase()

  return props.options.filter(option =>
    option.label.toLowerCase().includes(filterLower),
  )
})

function updateDropdownPosition() {
  if (selectedValue.value) {
    const rect = selectedValue.value.getBoundingClientRect()
    const selectRect = selectedValue.value.parentElement?.getBoundingClientRect()
    const upward = props.dropdownPlacement === 'top'
    dropdownPosition.value = {
      left: rect.left,
      top: upward ? rect.top - 4 : rect.bottom + 4,
      width: selectRect?.width || rect.width,
      transform: upward ? 'translateY(-100%)' : '',
    }
  }
}

function onScroll() {
  if (showDropdown.value) {
    updateDropdownPosition()
  }
}

function toggleDropdown() {
  showDropdown.value = !showDropdown.value

  if (showDropdown.value) {
    nextTick(() => {
      updateDropdownPosition()
      if (optionsList.value) {
        optionsList.value.focus()
        focusedIndex.value = -1
      }
    })
    window.addEventListener('scroll', onScroll, true)
  }
  else {
    window.removeEventListener('scroll', onScroll, true)
  }
}

function handleDropdownClick(event: MouseEvent) {
  if (event.target === selectedValue.value) {
    showDropdown.value = !showDropdown.value
  }
}

function closeDropdown() {
  showDropdown.value = false
  filterValue.value = ''
  focusedIndex.value = -1
  window.removeEventListener('scroll', onScroll, true)
}

function selectOption(option: Option) {
  emit('update:modelValue', option.value)
  emit('change', { originalEvent: null, value: option.value })
  emit('value-change', option)
  closeDropdown()
}

function moveFocusedIndex(delta: number) {
  const count = filteredOptions.value.length
  if (count === 0) {
    return
  }
  if (focusedIndex.value === -1) {
    const selectedIdx = filteredOptions.value.findIndex(o => o === selectedOption.value)
    focusedIndex.value = selectedIdx >= 0 ? selectedIdx : 0
    return
  }
  focusedIndex.value = (focusedIndex.value + delta + count) % count
}

function handleOptionKeyDown(event: KeyboardEvent, option: Option, _index: number) {
  switch (event.code) {
    case 'Enter':
      event.preventDefault()
      selectOption(option)
      break
    case 'Escape':
      event.preventDefault()
      closeDropdown()
      break
    case 'ArrowDown':
      event.preventDefault()
      moveFocusedIndex(1)
      break
    case 'ArrowUp':
      event.preventDefault()
      moveFocusedIndex(-1)
      break
  }
}

function handleClickOutside(event: MouseEvent) {
  if (selectedValue.value && !selectedValue.value.contains(event.target as Node)) {
    const dropdown = document.querySelector('.rx-select__dropdown')
    if (!dropdown || !dropdown.contains(event.target as Node)) {
      closeDropdown()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  window.removeEventListener('scroll', onScroll, true)
})
</script>

<template>
  <div
    class="rx-select bg-white inline-flex w-full cursor-pointer transition-all duration-200 items-center relative hover:border-[#a3a9ad]"
    :class="[rootFrameClass, size, pt?.root]"
    v-bind="$attrs"
  >
    <span
      ref="selectedValue"
      class="rx-select__value text-[#171c1f] flex flex-1 min-w-0 whitespace-nowrap text-ellipsis items-center overflow-hidden"
      :class="[
        valueSizeClass,
        { 'rx-select__value--placeholder text-[#a3a9ad]': !selectedOption },
        pt?.label,
      ]"
      @click="toggleDropdown"
    >
      <template v-if="!selectedOption">
        {{ placeholder }}
      </template>
      <template v-else>
        <div class="select-item flex flex-1 min-w-0 items-center overflow-hidden" :class="[selectItemGapClass, size && `select-item-${size}`]">
          <RxIcon
            v-if="selectedOption.icon || icon"
            :name="(selectedOption.icon || icon) as SvgNames"
            :color="iconColor"
            fallback="base/rx_ic_earth"
            :size="iconSize"
          />
          <img
            v-if="selectedOption.image"
            class="select-item__image h-5 w-5 aspect-square object-cover"
            :src="selectedOption.image"
            :alt="selectedOption.alt"
          >
          <div class="min-w-0 whitespace-nowrap text-ellipsis overflow-hidden">
            {{ selectedOption.label }}
          </div>
        </div>
      </template>
    </span>

    <div
      class="rx-select__dropdown-icon text-[#94a3b8] py-1.5 pl-1.5 pr-2 flex items-center"
      :class="dropdownIconSizeClass"
      @click="toggleDropdown"
    >
      <RxIcon name="base/rx_ic_chevron_down" :size="iconSize" />
    </div>

    <Teleport to="body">
      <div
        v-if="showDropdown"
        class="rx-select__dropdown p-1 bg-white max-h-[300px] shadow-md fixed z-[9999] overflow-y-auto"
        :class="[dropdownFrameClass, size, pt?.overlay]"
        :style="{
          left: `${dropdownPosition.left}px`,
          top: `${dropdownPosition.top}px`,
          width: `${dropdownPosition.width}px`,
          ...(dropdownPosition.transform ? { transform: dropdownPosition.transform } : {}),
        }"
        @click="handleDropdownClick"
      >
        <div v-if="filter" class="rx-select__filter p-1.5 border-b border-[#e5e9eb]">
          <input
            v-model="filterValue"
            type="text"
            class="rx-select__filter-input text-xs px-1.5 py-1 border border-[#c7cdd1] rounded w-full"
            placeholder="Search..."
          >
        </div>

        <ul
          ref="optionsList"
          class="rx-select__options m-0 p-0 list-none flex flex-col gap-px"
          @mouseleave="focusedIndex = -1"
        >
          <li
            v-for="(option, index) in filteredOptions"
            :key="index"
            class="rx-select__option rounded flex cursor-pointer transition-colors duration-200 items-center hover:bg-[#f1f5f9]"
            :class="[
              size === 'xxl' ? 'min-h-9 py-1.5 px-2.5' : 'min-h-11 py-2 px-3',
              optionRowToneClass(option, index),
              {
                'rx-select__option--selected p-select-option-selected': selectedOption === option,
                'rx-select__option--focused p-focus': focusedIndex === index && selectedOption !== option,
              },
              pt?.option,
            ]"
            @click="selectOption(option)"
            @mouseenter="focusedIndex = selectedOption === option ? -1 : index"
            @keydown="handleOptionKeyDown($event, option, index)"
          >
            <div class="select-item flex flex-1 min-w-0 items-center overflow-hidden" :class="[selectItemGapClass, size && `select-item-${size}`]">
              <RxIcon
                v-if="option.icon || icon"
                :name="(option.icon || icon) as SvgNames"
                :color="iconColor"
                fallback="base/rx_ic_earth"
                :size="iconSize"
              />
              <img
                v-if="option.image"
                class="select-item__image h-5 w-5 aspect-square object-cover"
                :src="option.image"
                :alt="option.alt"
              >
              <div class="min-w-0 whitespace-nowrap text-ellipsis overflow-hidden">
                {{ option.label }}
              </div>
              <slot name="option-extra" :option="option" />
            </div>
          </li>

          <li v-if="filteredOptions.length === 0" class="rx-select__option--empty text-xs text-[#a3a9ad] px-2 py-1.5">
            No results
          </li>
        </ul>
      </div>
    </Teleport>
  </div>
</template>
