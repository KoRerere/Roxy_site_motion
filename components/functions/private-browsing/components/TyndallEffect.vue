<template>
  <div
    class="sui-tyndall-effect relative flex gap-10 h-full overflow-hidden w-full justify-start items-center"
    :style="wrapperStyle"
  >
    <div
      class="streak flex-none overflow-hidden pointer-events-none absolute w-[200%] h-16 left-[-34%] top-[21%]"
      v-motion
      :initial="{ opacity: 0, rotate: '132deg', scaleY: 0.5 }"
      :visible="{ opacity: 0.32, rotate: '132deg', scaleY: 1 }"
      :duration="2000"
      :delay="700"
    />
    <div
      class="streak flex-none overflow-hidden pointer-events-none absolute w-[200%] h-16 left-[-20%] top-[17%]"
      v-motion
      :initial="{ opacity: 0, rotate: '124deg', scaleY: 0.5 }"
      :visible="{ opacity: 0.36, rotate: '124deg', scaleY: 1 }"
      :duration="2000"
      :delay="700"
    />
    <div
      class="streak flex-none overflow-hidden pointer-events-none absolute w-[200%] h-16 left-[-8%] top-[10%]"
      v-motion
      :initial="{ opacity: 0, rotate: '106deg', scaleY: 0.5 }"
      :visible="{ opacity: 0.4, rotate: '106deg', scaleY: 1 }"
      :duration="2000"
      :delay="700"
    />
    <div
      class="overlay-top h-56 flex-none absolute left-0 right-0 top-0 z-10 overflow-hidden pointer-events-none"
      v-if="showOverlay"
    />
    <div
      class="overlay-bottom h-32 flex-none absolute left-0 right-0 bottom-0 z-10 overflow-hidden pointer-events-none"
      v-if="showOverlay"
    />
    <div
      class="particles-effect flex-none h-full absolute left-0 top-0 right-0"
      v-if="$slots.particles"
    >
      <slot name="particles" />
    </div>
    <slot />
  </div>
</template>

<script lang="ts" setup>
const props = withDefaults(
  defineProps<{
    streakColor: string
    showOverlay: boolean
  }>(),
  {
    streakColor: 'rgb(0, 217, 255)',
    showOverlay: true
  }
)

const { streakColor } = toRefs(props)

const wrapperStyle = computed(() => {
  return {
    '--streak-color': streakColor.value
  }
})
</script>

<style scoped>
.sui-tyndall-effect {
  --streak-color: rgb(0, 217, 255);
}

.sui-tyndall-effect .overlay-top {
  background: linear-gradient(
    180deg,
    hsl(var(--background)) 0%,
    rgba(0, 0, 0, 0.32) 43%,
    rgba(0, 0, 0, 0.12) 70%,
    rgba(0, 0, 0, 0) 100%
  );
}
.sui-tyndall-effect .overlay-bottom {
  background: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.12) 43%,
    rgba(0, 0, 0, 0.32) 70%,
    hsl(var(--background)) 100%
  );
}

.sui-tyndall-effect .streak {
  background: linear-gradient(90deg, var(--streak-color) 16%, rgba(255, 255, 255, 0) 100%);
  mask: linear-gradient(
    180deg,
    rgba(0, 0, 0, 0) 0%,
    rgba(0, 0, 0, 0.5) 30%,
    rgba(0, 0, 0, 0.5) 75%,
    rgba(0, 0, 0, 0) 100%
  );
}

.sui-tyndall-effect .particles-effect {
  mask: linear-gradient(225deg, rgba(0, 0, 0, 0) 30%, rgb(0, 0, 0) 36%, rgb(0, 0, 0) 63%, rgba(0, 0, 0, 0) 76%);
}
</style>