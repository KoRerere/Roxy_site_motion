<script setup lang="ts">
const props = defineProps<{
  slides: {
    title: string
    description: string
    image: string
  }[]
}>()
</script>

<template>
  <div class="carousel-list">
    <div v-for="slide in slides" :key="slide.title" class="carousel-item">
      <RxResponsiveImage :name="slide.image" :alt="slide.title" class="carousel-item-image" />
      <h3 class="carousel-item-title multilingual-text">
        {{ slide.title }}
      </h3>
      <div class="carousel-item-description">
        {{ slide.description }}
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.carousel-list {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 40px;
}

.carousel-item {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;

  .carousel-item-image {
    width: 100%;
    border-radius: 8px;
    overflow: hidden;

    :deep(img) {
      width: 100%;
      display: block;
    }
  }
}

.carousel-item-title {
  color: #fff;
  font-size: 20px;
  font-style: normal;
  font-weight: 600;
  line-height: 28px; /* 140% */
}

.carousel-item-description {
  color: #fff;
  font-family: Inter;
  font-size: 15px;
  font-style: normal;
  font-weight: 400;
  line-height: 150%; /* 22.5px */
}
</style>
