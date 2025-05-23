<script setup>
import { 
  CopyrightZhPrivacy, 
  CopyrightZhRefund, 
  CopyrightZhUser, 
  CopyrightEnPrivacy, 
  CopyrightEnRefund, 
  CopyrightEnUser,
  CopyrightEnRenewal
} from '#components'
const { $t, locale } = useRxI18n()
const route = useRoute()

const solutionMap = {
  user: {
    title: $t("使用条款"),
    subtitle: $t("用户协议"),
  },
  privacy: {
    title: $t("使用条款"),
    subtitle: $t("隐私政策"),
  },
  refund: {
    title: $t("使用条款"),
    subtitle: $t("退款协议"),
  },
  renewal: {
    title: $t("使用条款"),
    subtitle: "Auto-Renewal Service Agreement",
  }
}

const solutions = solutionMap[route.params.type] || solutionMap["user"];

const cmpMap = {
  zh: {
    privacy: CopyrightZhPrivacy,
    refund: CopyrightZhRefund,
    user: CopyrightZhUser,
    renewal: CopyrightEnRenewal
  },
  en: {
    privacy: CopyrightEnPrivacy,
    refund: CopyrightEnRefund,
    user: CopyrightEnUser,
    renewal: CopyrightEnRenewal
  },
  ru: {
    privacy: CopyrightEnPrivacy,
    refund: CopyrightEnRefund,
    user: CopyrightEnUser,
    renewal: CopyrightEnRenewal
  }
}

const current = computed(() => (cmpMap[locale.value] || cmpMap.en)[route.params.type])
</script>

<template>
  <Container class="mt-132px">
    <h1 class="solution-banner-title text-center">{{ solutions.title }}</h1>
    <h2 class="solution-banner-subtitle text-center my-4">{{ solutions.subtitle }}</h2>
    <!-- <div>
      <p class="solution-banner-description">{{ solutions.description }}</p>
    </div> -->
    <component v-if="current" :is="current" />
  </Container>
</template>

<style lang="scss" scoped>
.solution {
  &-banner {
    height: 487px;
    border-radius: 32px;
    border: 0.5px solid rgba(0, 0, 0, 0.10);
    background: linear-gradient(180deg, #D6F1FB 0%, #FDFEFE 100%);
    overflow: hidden;

    &-image {
      right: 254px;
      top: 58px;
      width: 185px;
      height: 185px;
      border-radius: 36px;
      background-color: #fff;
    }

    &-cbox {
      right: 68px;
      bottom: 58px;
      width: 185px;
      height: 185px;
      border-radius: 36px;
      background: pink;
    }

    &-title {
      color: var(--body, #042144);
      font-family: Archivo, var(--family, var(--zhFamily));
      font-size: 64px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }

    &-description {
      color: var(--quote, rgba(4, 33, 68, 0.60));
      font-family: Archivo, var(--family, var(--zhFamily));
      font-size: 24px;
      font-style: normal;
      font-weight: 500;
      line-height: normal;
    }

    &-subtitle {
      color: var(--body, #042144);
      font-family: Archivo, var(--family, var(--zhFamily));
      font-size: 40px;
      font-style: normal;
      font-weight: 700;
      line-height: normal;
    }
  }

  &-item {
    &-image {
      width: 64px;
      height: 64px;
    }

    &-title {
      color: #000;
      font-size: 24px;
      font-style: normal;
      font-weight: 700;
      line-height: 1.4;
    }

    &-description {
      margin-top: 24px;
      color: var(--quote, rgba(4, 33, 68, 0.60));
      font-size: 20px;
      font-style: normal;
      font-weight: 400;
      line-height: 1.7;
      // text-indent: 2em;
    }

    .list {
      li {
        margin-top: 12px;
        color: var(--quote, rgba(4, 33, 68, 0.60));
        font-size: 20px;
        font-style: normal;
        font-weight: 400;
        line-height: 1.7;
      }
    }
  }
}


@media(min-width: 1280px) and (max-width: 1915px) {
  .solution {
    &-banner {
      &-image {
        right: 292px;
        top: 76px;
        width: 178px;
        height: 178px;
      }

      &-cbox {
        right: 97px;
        bottom: 64px;
        width: 178px;
        height: 178px;
      }

      &-title {
        font-size: 64px;
      }

      &-description {
        font-size: 24px;
      }

      &-subtitle {
        font-size: 40px;
      }
    }

    &-item {
      &-image {
        width: 64px;
        height: 64px;
      }

      &-title {
        font-size: 32px;
        line-height: 38.4px;
      }

      &-description {
        font-size: 24px;
        line-height: 38.4px;
      }
    }
  }
}

@media(min-width: 834px) and (max-width: 1280px) {
  .solution {
    &-banner {
      height: 265px;

      &-image {
        right: 121px;
        top: 46px;
        width: 104px;
        height: 104px;
        border-radius: 24px;
      }

      &-cbox {
        width: 64px;
        height: 64px;
        right: 57px;
        bottom: 51px;
        border-radius: 12px;
      }

      &-title {
        font-size: 40px;
      }

      &-description {
        font-size: 20px;
      }

      &-subtitle {
        font-size: 32px;
      }
    }

    &-item {
      &-image {
        width: 48px;
        height: 48px;
      }

      &-title {
        font-size: 20px;
        line-height: 24px;
      }

      &-description {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
}

@media(min-width: 0px) and (max-width: 834px) {
  .solution {
    &-banner {
      height: 265px;

      &-image {
        right: 25px;
        top: 89px;
        width: 64px;
        height: 64px;
        border-radius: 12px;
      }

      &-cbox {
        right: -40px;
        bottom: 44px;
        width: 64px;
        height: 64px;
        border-radius: 12px;
      }

      &-title {
        font-size: 40px;
      }

      &-description {
        font-size: 16px;
      }

      &-subtitle {
        font-size: 24px;
      }
    }

    &-item {
      &-image {
        width: 48px;
        height: 48px;
      }

      &-title {
        font-size: 20px;
        line-height: 24px;
      }

      &-description {
        font-size: 16px;
        line-height: 24px;
      }
    }
  }
}
</style>