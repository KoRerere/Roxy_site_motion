<template>
  <div class="flex justify-between flex-col-reverse lg:flex-row w-full h-full">
    <div class="w-full xl:w-1/2 flex flex-col justify-between p-5">
      <div class="flex flex-col gap-3">
        <div class="hidden lg:block">
          <img :src="icon" alt="" />
        </div>
        <h3 :class="titleClasses">{{ title }}</h3>
        <p :class="descClasses">{{ desc }}</p>
      </div>

      <div class="hidden xl:block">
        <img :src="decorateIcon" alt="" />
      </div>
    </div>
    <div class="w-full xl:w-1/2 min-w-234px">
      <slot />
    </div>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    default: '',
  },
  titleClasses: {
    type: String,
    default: '',
  },
  desc: {
    type: String,
    default: '',
  },
  descClasses: {
    type: String,
    default: '',
  },
  icon: {
    type: String,
    default: '',
  },
  decorate: {
    type: String,
    default: '1'
  }
})

const decorateIcon = computed(() => {
  return props.decorate === '1' ? '/home/decorate1.svg' : '/home/decorate2.svg'
})

</script>
