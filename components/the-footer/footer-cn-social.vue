<script setup lang="ts">
const bilibiliHref = 'https://b23.tv/17Z3pOL'
const xiaohongshuHref = 'https://xhslink.com/m/8YD98XWAWg2'
</script>

<template>
  <div class="flex flex-wrap gap-5 items-end">
    <div class="flex shrink-0 flex-col gap-2.5 items-center">
      <div class="rounded-[5px] bg-white flex size-[100px] items-center box-border justify-center md:size-[80px]">
        <img
          src="/footer/wx_buessness_qrcode.png"
          alt="商务对接"
          class="size-full select-none object-contain"
          draggable="false"
        >
      </div>
      <div class="text-14px text-white leading-5 font-[Inter] text-center">
        商务对接
      </div>
    </div>
    <div class="flex shrink-0 flex-col gap-2.5 items-center">
      <div class="rounded-[5px] bg-white flex size-[100px] items-center box-border justify-center md:size-[80px]">
        <img
          src="/footer/wx_gongzonghao_qrcode.png"
          alt="微信公众号"
          class="size-full select-none object-contain"
          draggable="false"
        >
      </div>
      <div class="text-14px text-white leading-5 font-[Inter] text-center">
        微信公众号
      </div>
    </div>
    <div class="pb-[30px] flex shrink-0 gap-5 items-center">
      <a
        :href="xiaohongshuHref"
        target="_blank"
        rel="noopener noreferrer"
        class="opacity-100 size-8 block transition-opacity duration-300 hover:opacity-80"
        aria-label="小红书"
      >
        <img src="/footer/xiaohongshu.svg" alt="" class="size-full select-none" draggable="false">
      </a>
      <a
        :href="bilibiliHref"
        target="_blank"
        rel="noopener noreferrer"
        class="opacity-100 size-8 block transition-opacity duration-300 hover:opacity-80"
        aria-label="哔哩哔哩"
      >
        <img src="/footer/bilibili.svg" alt="" class="size-full select-none" draggable="false">
      </a>
    </div>
  </div>
</template>
