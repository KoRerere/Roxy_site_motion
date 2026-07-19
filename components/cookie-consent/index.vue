<script setup lang="ts">
import * as CookieConsent from 'vanilla-cookieconsent'
import 'vanilla-cookieconsent/dist/cookieconsent.css'

const { locale } = useRxI18n()

async function initCookieConsent() {
  await CookieConsent.run({
    guiOptions: {
      consentModal: {
        layout: 'bar inline',
        position: 'bottom left',
        equalWeightButtons: false,
        flipButtons: false,
      },
      preferencesModal: {
        layout: 'box',
        position: 'right',
        equalWeightButtons: true,
        flipButtons: false,
      },
    },
    categories: {
      necessary: {
        readOnly: true,
      },
      analytics: {},
    },
    language: {
      default: locale.value || 'en',
      // autoDetect: false,
      translations: {
        en: {
          consentModal: {
            title: 'We value your privacy',
            description: 'We use cookies and similar technologies (including third‑party cookies) to improve your experience and analyze usage. You can accept all cookies or manage your preferences in the settings.',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Accept only necessary',
            showPreferencesBtn: 'Manage preferences',
            footer: '<a href="/copyright/cookie-policy" target="_blank">Cookie Policy</a>',
          },
          preferencesModal: {
            title: 'Cookie settings',
            acceptAllBtn: 'Accept all',
            acceptNecessaryBtn: 'Reject All',
            savePreferencesBtn: 'Save preferences',
            closeIconLabel: 'Close modal',
            serviceCounterLabel: 'Service|Services',
            sections: [
              {
                title: 'Cookie usage',
                description: 'We use cookies to ensure the basic functioning of the site and to improve your experience. You can choose which optional cookies to allow.',
              },
              {
                title: 'Strictly necessary cookies <span class="pm__badge">Always enabled</span>',
                description: 'These cookies are essential for the website to function properly and cannot be disabled. They do not store personally identifiable information.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Analytics cookies',
                description: 'These cookies help us understand how visitors interact with the site so we can improve features and content. If you disable them, we will not use analytics tools such as Google Analytics or Yandex Metrika.',
                linkedCategory: 'analytics',
              },
              {
                title: 'More information',
                description: 'For details about how we use cookies and how you can manage your choices, please read our <a class="cc__link" href="/copyright/cookie-policy" target="_blank">Cookie Policy</a>.',
              },
            ],
          },
        },
        zh: {
          consentModal: {
            title: '我们重视您的隐私',
            description: '我们使用 Cookie 和类似技术（包括第三方 Cookie）来保障网站正常运行、改进产品功能，并分析使用情况。您可以接受所有 Cookie，或在设置中自定义您的偏好。',
            acceptAllBtn: '接受所有',
            acceptNecessaryBtn: '仅接受必要 Cookie',
            showPreferencesBtn: '管理设置',
            footer: '<a href="/zh/copyright/cookie-policy" target="_blank">Cookie 政策</a>',
          },
          preferencesModal: {
            title: 'Cookie 设置',
            acceptAllBtn: '接受所有',
            acceptNecessaryBtn: '仅接受必要 Cookie',
            savePreferencesBtn: '保存设置',
            closeIconLabel: '关闭弹窗',
            serviceCounterLabel: '服务',
            sections: [
              {
                title: 'Cookie 的使用',
                description: '我们使用 Cookie 来确保网站基础功能正常运行，并根据访问数据优化产品和服务。您可以选择是否允许用于分析和统计的可选 Cookie。',
              },
              {
                title: '严格必要的 Cookie <span class="pm__badge">始终启用</span>',
                description: '这些 Cookie 用于实现网站的核心功能，例如安全、网络连接和语言设置。关闭这些 Cookie 可能导致网站无法正常工作，因此无法被关闭。',
                linkedCategory: 'necessary',
              },
              {
                title: '分析类 Cookie',
                description: '这些 Cookie 帮助我们了解用户如何使用网站，从而改进功能和内容。如果您关闭此类 Cookie，我们将不会使用 Google Analytics、Yandex Metrika 等分析工具。',
                linkedCategory: 'analytics',
              },
              {
                title: '更多信息',
                description: '关于我们如何使用 Cookie，以及如何撤回或更新您的同意，请查阅我们的 <a class="cc__link" href="/zh/copyright/cookie-policy" target="_blank">Cookie 政策</a>。',
              },
            ],
          },
        },
        ru: {
          consentModal: {
            title: 'Мы заботимся о вашей конфиденциальности',
            description: 'Мы используем файлы cookie и аналогичные технологии (в том числе сторонние cookie), чтобы обеспечить работу сайта, улучшить сервис и анализировать использование. Вы можете принять все cookie или настроить свои предпочтения.',
            acceptAllBtn: 'Принять все',
            acceptNecessaryBtn: 'Только необходимые cookie',
            showPreferencesBtn: 'Управлять настройками',
            footer: '<a href="/ru/copyright/cookie-policy" target="_blank">Политика Cookie</a>',
          },
          preferencesModal: {
            title: 'Настройки Cookie',
            acceptAllBtn: 'Принять все',
            acceptNecessaryBtn: 'Только необходимые cookie',
            savePreferencesBtn: 'Сохранить настройки',
            closeIconLabel: 'Закрыть окно',
            serviceCounterLabel: 'Сервис|Сервисы',
            sections: [
              {
                title: 'Использование файлов cookie',
                description: 'Мы применяем файлы cookie, чтобы обеспечить базовую работу сайта и улучшать его на основе анонимной статистики. Вы можете выбрать, разрешать ли нам использовать дополнительные аналитические cookie.',
              },
              {
                title: 'Строго необходимые cookie <span class="pm__badge">Всегда включены</span>',
                description: 'Эти cookie необходимы для корректной работы сайта (безопасность, сессия, языковые настройки и т.п.) и не содержат идентифицирующую информацию. Их нельзя отключить через эту панель.',
                linkedCategory: 'necessary',
              },
              {
                title: 'Аналитические cookie',
                description: 'Эти cookie позволяют нам анализировать трафик и поведение пользователей, чтобы улучшать функции и интерфейс. Если вы отключите их, мы не будем использовать инструменты аналитики, такие как Google Analytics или Yandex Metrika.',
                linkedCategory: 'analytics',
              },
              {
                title: 'Дополнительная информация',
                description: 'Подробнее о том, как мы используем файлы cookie и как вы можете управлять согласием, читайте в нашей <a class="cc__link" href="/ru/copyright/cookie-policy" target="_blank">Политике Cookie</a>.',
              },
            ],
          },
        },
      },
    },
  })

  // CookieConsent.showPreferences() 显示管理面板
  // console.log(CookieConsent.getUserPreferences().acceptedCategories) // ['necessary'] 或 ['necessary','analytics']
}

watch(locale, (lang) => {
  CookieConsent.setLanguage?.(lang)
})

onMounted(() => {
  initCookieConsent()
})
</script>

<template>
  <div />
</template>

<style scoped>
/* 通过 CSS 变量覆盖 cookieconsent 的默认样式 */
:global(#cc-main) {
  /* 覆盖颜色变量 */
  --cc-primary-color: #111213;
  --cc-secondary-color: #34393d;
  --cc-btn-primary-bg: #11a3fd;
  --cc-btn-primary-color: #fff;
  --cc-btn-primary-hover-bg: #0282d4;

  /* 覆盖字体 */
  --cc-font-family: var(--family);

  /* 覆盖圆角 */
  --cc-modal-border-radius: 8px;
  --cc-btn-border-radius: 6px;

  /* 覆盖背景色 */
  --cc-bg: #fff;

  /* 覆盖 z-index */
  --cc-z-index: 9999;
  --cc-btn-primary-border-color: transparent;
  --cc-btn-primary-hover-border-color: transparent;
}
</style>

<style>
/* 全局样式：覆盖 cookieconsent 的具体样式 */
#cc-main .cm--bar.cm--inline .cm__btns {
  max-width: 30em !important;
}

#cc-main .cm--bar .cm__btn {
  min-width: 125px !important;
}
</style>
