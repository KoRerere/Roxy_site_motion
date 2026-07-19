<script setup lang="ts">
import GridBeam from './grid-beam.vue'
</script>

<template>
  <div class="dark-hero-bg pointer-events-none inset-0 absolute overflow-hidden" aria-hidden="true">
    <div class="dark-hero-bg__base" />
    <div class="dark-hero-bg__grid" />
    <ClientOnly>
      <GridBeam class="dark-hero-bg__beam" />
    </ClientOnly>

    <div class="dark-hero-bg__glow dark-hero-bg__glow--tl">
      <div class="dark-hero-bg__glow-inner dark-hero-bg__glow-inner--tl">
        <img
          src="/home/feature-carousel/carousel/dark-bg/glow-top-left.svg"
          alt=""
          class="dark-hero-bg__glow-img"
          draggable="false"
        >
      </div>
    </div>

    <div class="dark-hero-bg__glow dark-hero-bg__glow--br">
      <div class="dark-hero-bg__glow-inner dark-hero-bg__glow-inner--br">
        <img
          src="/home/feature-carousel/carousel/dark-bg/glow-bottom-right.svg"
          alt=""
          class="dark-hero-bg__glow-img"
          draggable="false"
        >
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.dark-hero-bg {
  &__base {
    position: absolute;
    inset: 0;
    background: linear-gradient(180deg, #030f3a 0%, #041244 100%);
  }

  &__grid {
    position: absolute;
    inset: 0;
    background-image:
      linear-gradient(to right, rgb(255 255 255 / 5%) 1px, transparent 1px),
      linear-gradient(to bottom, rgb(255 255 255 / 5%) 1px, transparent 1px);
    background-size: 48px 48px;
    mask-image: linear-gradient(to bottom, #000 0%, #000 55%, transparent 100%);
  }

  &__beam {
    position: absolute;
    inset: 0;
    opacity: 0.85;
  }

  &__glow {
    position: absolute;
    pointer-events: none;
    user-select: none;

    &--tl {
      left: 10%;
      top: 0%;
      width: 64.63%;
      height: 46.02%;
      opacity: 0.8;
    }

    &--br {
      right: 0;
      bottom: 340px;
      width: 51.72%;
      height: 56.38%;
      transform: rotate(-4.33deg);
    }
  }

  &__glow-inner {
    position: absolute;
    inset: 0;

    &--tl {
      top: -18.35%;
      right: -10.23%;
      bottom: -14.86%;
      left: -10.23%;
    }

    &--br {
      top: -38.64%;
      right: -25.81%;
      bottom: -35.23%;
      left: -32.54%;
      opacity: 0.6;
      filter: blur(12px);
    }
  }

  &__glow-img {
    display: block;
    width: 100%;
    height: 100%;
    max-width: none;
    object-fit: fill;
  }
}
</style>
