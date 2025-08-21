<script setup lang="ts">

</script>

<template>
  <div class="trusted-proxies-access">
    <div class="content">
      <div class="title">
        {{ $t('RoxyBrowser 内置精选代理商，安全可靠，无须费心') }}
      </div>
      <div class="description">
        {{ $t('你可以在 RoxyBrowser 客户端直接购买优质的住宅代理，省去了到处寻找代理的麻烦和对不良服务商的担忧。只需下载软件、选择你的配置，然后即可开始安全浏览。') }}
      </div>
      <img src="@/assets/images/functions/trusted-proxies-access-example.png" alt="trusted-proxies-access" class="w-full mt-7"></img>
    </div>
    <div class="mask" />
  </div>
</template>

<style lang="scss" scoped>
.trusted-proxies-access {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 100px 0;
  width: 100%;
  min-height: 368px;
  background-image: url('@/assets/images/functions/trusted-proxies-access-bg.png');
  background-color: radial-gradient(86.21% 231.94% at 50% 0%, rgba(18, 163, 252, 0.12) 0%, rgba(18, 163, 252, 0) 70%);
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.content {
  max-width: 1080px;
}

.title {
  color: var(--colors-text-text-primary, #111213);
  text-align: center;
  font-family: Archivo;
  font-size: var(--Heading-H3, 40px);
  font-style: normal;
  font-weight: 700;
  line-height: var(--line-H3, 48px); /* 120% */
}

.description {
  margin-top: 48px;
  color: var(--colors-text-text-primary, #111213);
  text-align: center;

  /* body */
  font-family: Inter;
  font-size: var(--body, 18px);
  font-style: normal;
  font-weight: 400;
  line-height: var(--line-body, 28px); /* 155.556% */
}

.mask {
  position: absolute;
  height: 120px;
  background: linear-gradient(180deg, rgba(248, 250, 251, 0) 0%, #f8fafb 80%);
  bottom: 0;
  left: 0;
  right: 0;
}
</style>
