<script setup lang="ts">
import BgCanvas from './bg-canvas.vue'
import LanguageSelect from './language-select.vue'

const { $t } = useRxI18n()
const localePath = useLocalePath()
</script>

<template>
  <client-only>
    <div class="login-container">
      <BgCanvas class="absolute top-0 left-0 w-full h-full" />
      <div class="login-header">
        <NuxtLinkLocale to="/" class="flex items-center gap-[10px] z-10">
          <img class="logo" src="/logo.svg" alt="Roxybrowser" />
          <h1 class="title">RoxyBrowser</h1>
        </NuxtLinkLocale>

        <div class="language z-10">
          <LanguageSelect />
        </div>
      </div>

      <div class="login-body">
        <slot></slot>
      </div>
      <div class="footer">
        <rx-i18n-t :keypath="$t('注册或登录即表示您同意我们的 {terms} 和 {policy} 。', { terms: '{terms}', policy: '{policy}' })">
          <template #terms>
            <NuxtLink
              :to="localePath('/copyright/user')" 
              target="_blank"
              class="text-[#AFB7BB] copyright-link"
            >{{ $t('用户协议') }}</NuxtLink>
          </template>
          <template #policy>
            <NuxtLink 
              :to="localePath('/copyright/privacy')" 
              target="_blank"
              class="text-[#AFB7BB] copyright-link"
            >{{ $t('隐私政策') }}</NuxtLink>
          </template>
        </rx-i18n-t>
      </div>
    </div>
  </client-only>
</template>

<style lang="scss" scoped>
.login-container {
  position: relative;
  height: 100%;
  overflow: hidden;
}

.login-header {
  padding: 24px 24px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  width: 32px;
  height: 32px;
}

.title {
  // color: var(--Color-neutrals-0, #FFF);
  font-family: Archivo, var(--family, var(--zhFamily));
  font-size: 16px;
  font-style: normal;
  font-weight: 700;
  line-height: 20px; /* 125% */
  color: #FFF;
}

.language {
  display: flex;
  gap: 10px;
}

.help {
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
  text-align: center;
  // 
  font-size: 12px;
  font-style: normal;
  font-weight: 500;
  line-height: var(--Line-Height-text-lg, 20px); /* 166.667% */
  min-width: 72px;
  justify-content: space-between;
  padding: 0 10px;
}

.footer {
  position: fixed;
  left: 50%;
  bottom: 16px;
  transform: translate(-50%);
  color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
  text-align: center;
  // 
  font-size: 12px;
  font-style: normal;
  font-weight: 400;
  line-height: var(--Line-Height-text-xs, 16px);
  z-index: 1;
  color: #FFF;
  width: 100%;
}

.login-body {
  position: fixed;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 8px;
  border: 0.5px solid var(--Color-neutrals-0, #FFF);
  background: #FFF;
}

.copyright-link {
  line-height: var(--Line-Height-text-xs, 16px);
  text-decoration-line: underline;
  text-decoration-style: solid;
  text-decoration-skip-ink: none;
  text-decoration-thickness: auto;
  text-underline-offset: auto;
  text-underline-position: from-font;
}

// .animation-background {
//   display: flex;
//   position: fixed;
//   top: 104%;
//   left: -100px;
//   right: -30px;
//   height: 656.408px;
//   flex-shrink: 0;
//   opacity: 0.6;
//   filter: blur(150px);
//   transform: rotate(10deg);

//   .blue {
//     width: 866.302px;
//     height: 648.468px;
//     flex-shrink: 0;
//     border-radius: var(--radius-none, 866.302px);
//     background: var(--Color-blue-300, #12a3fc);
//     animation: ripple 15s linear infinite;
//   }

//   .purple {
//     width: 617.019px;
//     height: 461.868px;
//     flex-shrink: 0;
//     border-radius: var(--radius-none, 617.019px);
//     background: #ca59ff;
//     animation: ripple 15s linear infinite;
//   }
// }

// @keyframes ripple {
//   0% {
//     transform: rotate(0);
//   }

//   100% {
//     transform: rotate(360deg);
//   }
// }
</style>

<!-- <style lang="scss" scoped>

</style> -->