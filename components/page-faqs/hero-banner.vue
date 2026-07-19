<script setup lang="ts">
import SearchBox from './search-box.vue'
</script>

<template>
  <div class="hero-banner">
    <Container class="flex flex-col gap-4 items-center">
      <div class="tag">
        <span class="tag-text multilingual-text">{{ $t('指纹浏览器') }}</span>
      </div>
      <h1 class="title multilingual-text">
        {{ $t('RoxyBrowser 使用常见问题') }}
      </h1>
      <p class="description">
        {{ $t('无论是多账号管理、指纹设置、代理 IP 绑定还是团队协作，你都能在这里找到答案。遇到问题时，直接搜索即可快速解决。') }}
      </p>

      <SearchBox />
    </Container>
  </div>
</template>

<style lang="scss" scoped>
.hero-banner {
  padding-top: 130px;
  padding-bottom: 56px;
  background-image: url('/faqs/grid_bg.svg'), url('/faqs/hero_bg.svg');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.tag {
  display: flex;
  padding: 4px 24px;
  flex-direction: column;
  align-items: center;
  border-radius: 50px;
  border: 1px solid #12a3fc;
  background: linear-gradient(0deg, rgba(18, 163, 252, 0.1) 0%, rgba(18, 163, 252, 0.1) 100%), #fff;
}

.tag-text {
  color: var(--colors-text-text-brand, #11a3fd);
  text-align: center;
  font-size: 16px;
  font-style: normal;
  font-weight: 600;
  line-height: 20px;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  white-space: pre-line;
  font-size: var(--Heading-H2, 48px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H2, 60px); /* 125% */
}

.description {
  color: var(--colors-text-text-tertiary, #575d60);
  text-align: center;

  /* features-body */
  font-family: Inter;
  font-size: var(--features-body, 20px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-features-body, 32px); /* 160% */
}
</style>
