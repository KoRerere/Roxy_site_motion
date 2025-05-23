<script lang="ts" setup>
import { ref } from 'vue'
import LiveChat from '@/components/live-chat.vue'
import { SUPPORTED_LANGUAGES } from '@/constants/langs'
import { RxIcon } from '@/components/rx-icon'

const { locale } = useRxI18n()
const switchLanguage = useSwitchLanguage()
const languages = SUPPORTED_LANGUAGES.map(item => ({
  label: item.title,
  value: item.code,
  icon: item.icon,
}))

const currentLocale = ref(languages.find(item => item.value === locale.value) || languages[0]);

watch(currentLocale, (newVal) => switchLanguage(newVal.value))
</script>

<template>
  <div class="card flex justify-center">
    <div variant="text" class="help-btn">
      <LiveChat class="flex items-center gap-[6px]">
        <RxIcon name="base/rx_ic_headphone_2" />
        <span class="text">
          {{ $t('帮助') }}
        </span>
      </LiveChat>
    </div>

    <RxInputSelect 
      v-model="currentLocale" 
      name="language" 
      :options="languages" 
      :filter="false" 
      class="!w-30 !bg-white"
      :pt="{
        overlay: {
          props: {
            class: '!bg-white'
          }
        }
      }"
    />

    <component is="style">
      #chat-widget-container {
      left: unset!important;
      right: 30px;
      }
    </component>
  </div>
</template>

<style lang="scss" scoped>
.card {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  z-index: 10;

  .help-btn {
    display: flex;
    min-width: 72px;
    padding: var(--spacing-md, 6px) 10px;
    justify-content: center;
    align-items: center;
    gap: var(--spacing-md, 6px);
    color: var(--Component-Colors-Buttons-Secondary-text, #171C1F);
    text-align: center;
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: var(--Line-Height-text-lg, 20px);
    cursor: pointer;
  }
}
</style>
