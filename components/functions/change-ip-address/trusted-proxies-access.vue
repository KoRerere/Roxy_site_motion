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
  </div>
</template>

<style lang="scss" scoped>
.trusted-proxies-access {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 30px 100px;
  width: 100dvw;
  min-height: 368px;
  background-image: url('@/assets/images/functions/trusted-proxies-access-bg.png');
  background-size: cover;
  background-position: center;
  background-repeat: no-repeat;
}

.content {
  max-width: 1064px;
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
</style>
