<script setup lang="ts">
const emit = defineEmits(['open'])
function openRoxyBrowser() {
  emit('open')
}
</script>

<template>
  <main class="oauth-success-page max-sm:flex max-sm:justify-center">
    <section
      class="mx-auto flex w-full max-w-830px flex-col items-center text-center max-sm:mx-0 max-sm:mt-220px max-sm:max-w-268px"
      aria-labelledby="oauth-success-title"
    >
      <div class="mb-18px size-9 rounded-full bg-[#2BD160] flex items-center justify-center text-white max-sm:mb-16px" aria-hidden="true">
        <svg class="size-22px fill-current" viewBox="0 0 24 24" role="img">
          <path d="M9.7 15.3 5.9 11.5 4.5 12.9 9.7 18.1 20.1 7.7 18.7 6.3z" />
        </svg>
      </div>

      <h1 id="oauth-success-title" class="m-0 text-20px text-[#111213] leading-24px font-700 max-sm:text-16px max-sm:leading-22px text-font">
        {{ $t('授权成功') }}
      </h1>

      <p class="mb-34px mt-22px text-16px text-[#111213] leading-24px max-sm:mb-20px max-sm:mt-14px max-sm:text-14px max-sm:leading-19px font-500 text-font">
        {{ $t('正在跳转至 RoxyBrowser') }}
      </p>

      <button
        type="button"
        class="oauth-success-button h-39px min-w-230px border-0 rounded-7px px-6 inline-flex cursor-pointer items-center justify-center text-14px text-white font-500 max-sm:min-w-0 max-sm:w-220px max-sm:px-5 focus-visible:outline focus-visible:outline-3 focus-visible:outline-[rgba(31,140,255,0.32)] focus-visible:outline-offset-3 text-font">
        <a @click="openRoxyBrowser">{{$t('打开RoxyBrowser')}}</a>

        <svg class="mr-2.5 size-18px fill-current" viewBox="0 0 24 24" aria-hidden="true">
          <path d="M5 4h14a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1V5a1 1 0 0 1 1-1Zm1 2v8h12V6H6Zm5 12h2v2h4v2H7v-2h4v-2Zm-1.7-8.7L8 10.6l3 3 5-5-1.3-1.3L11 11l-1.7-1.7Z" />
        </svg>
        <span class="text-font">{{ $t('打开RoxyBrowser') }}</span>
      </button>
    </section>
  </main>
</template>

<style scoped>
.oauth-success-page {
  min-height: 100dvh;
  padding: 124px 24px 40px;
  box-sizing: border-box;
  position: relative;
  color: #151517;
  font-family: Inter, Arial, sans-serif;
  background:
    linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.78) 48%, #ffffff 72%),
    radial-gradient(
      circle at 51% 10%,
      rgba(255, 144, 234, 0.46) 0%,
      rgba(255, 144, 234, 0.2) 22%,
      rgba(255, 144, 234, 0) 39%
    ),
    radial-gradient(
      ellipse 42% 85% at 76% 36%,
      rgba(0, 148, 255, 0.36) 0%,
      rgba(0, 148, 255, 0.16) 40%,
      rgba(0, 148, 255, 0) 76%
    ),
    radial-gradient(
      ellipse 46% 30% at 10% 0%,
      rgba(255, 200, 194, 0.32) 0%,
      rgba(255, 200, 194, 0.18) 46%,
      rgba(255, 200, 194, 0) 82%
    ),
    #ffffff;
}

.oauth-success-page > section {
  position: relative;
  z-index: 1;
}

.oauth-success-button {
  background: linear-gradient(137deg, #238aff 0%, #238aff 56%, #68a5ef 78%, #c9a0ca 100%);
}

.oauth-success-button:hover {
  filter: brightness(1.04);
}
.text-font {
  font-family: Inter;
}

@media (max-width: 640px) {
  .oauth-success-page {
    padding: 0 20px 40px;
    overflow: hidden;
    background: #ffffff;
  }

  .oauth-success-page::before {
    content: '';
    position: absolute;
    top: -18px;
    left: -18px;
    right: -18px;
    height: 178px;
    pointer-events: none;
    background:
      linear-gradient(180deg, rgba(255, 255, 255, 0) 0%, rgba(255, 255, 255, 0.28) 58%, #ffffff 100%),
      linear-gradient(
        90deg,
        rgba(255, 200, 194, 0.56) 0%,
        rgba(255, 200, 194, 0.5) 30%,
        rgba(255, 144, 234, 0.42) 43%,
        rgba(255, 144, 234, 0.22) 58%,
        rgba(255, 144, 234, 0.16) 70%,
        rgba(0, 148, 255, 0.44) 82%,
        rgba(0, 148, 255, 0.36) 100%
      );
    filter: blur(22px);
  }
}
</style>
