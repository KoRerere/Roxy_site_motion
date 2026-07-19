<script setup lang="ts">
import InviteChevronIcon from '@/components/page-invite/invite-chevron-icon.vue'

const props = defineProps<{
  title: string
  descriptions: string | string[]
  imageName?: string
  image?: string
  imageAlt?: string
  reverse?: boolean
  /** 查看详情跳转路径 */
  link?: string
  class?: string
}>()

/** 配图进入视口（含 200px 预加载区）后再挂载，拦住 RxResponsiveImage 动态 import */
const { targetRef, isInView } = useInviteInView()

const { isZh } = useRxI18n()

/** 区块标题字体：中文用系统栈，西文用 Archivo（不用 html[lang] 全局选择器） */
const featureTitleLatin = computed(() => !isZh.value)

// 过滤空文案与误显示的 i18n 键名
const descriptionBlocks = computed(() => {
  const blocks = Array.isArray(props.descriptions) ? props.descriptions : [props.descriptions]
  return blocks.filter((block) => {
    const text = String(block || '').trim()
    return text.length > 0 && !/^invite\./.test(text)
  })
})
</script>

<template>
  <section ref="targetRef" class="flex flex-col overflow-hidden" :class="$props.class">
    <!-- 移动端间距：标题↔配图 12px、配图↔文案 12px；文案↔链接由父级 gap-4 控制 -->
    <div class="invite-feature-mobile flex flex-col gap-[12px] lg:hidden">
      <h2
        class="invite-feature-copy__title text-left text-secondary text-[20px] leading-[28px] font-600"
        :class="{ 'invite-feature-copy__title--latin': featureTitleLatin }"
      >
        {{ props.title }}
      </h2>

      <!-- 移动端配图：无内边距，图片铺满容器 -->
      <div class="invite-feature-image-mobile h-[227px] box-border overflow-hidden rounded-[16px] border border-[#E2E9EE] bg-white">
        <RxResponsiveImage
          v-if="isInView && imageName"
          :name="imageName"
          :alt="imageAlt || props.title"
          class="invite-feature-image-media block h-full w-full select-none"
        />
        <img
          v-else-if="isInView && image"
          :src="image"
          :alt="imageAlt || props.title"
          loading="lazy"
          draggable="false"
          class="invite-feature-image-media block h-full w-full select-none"
        >
      </div>

      <div class="invite-feature-mobile__body flex flex-col gap-4">
        <div
          v-for="(block, blockIndex) in descriptionBlocks"
          :key="blockIndex"
          class="text-[15px] leading-[22.5px] font-400 text-secondary"
        >
          {{ block }}
        </div>

        <NuxtLinkLocale
          v-if="link"
          :to="link"
          class="invite-feature-mobile__link w-fit inline-flex items-center gap-[6px] text-[var(--colors-text-text-link,#11A3FD)] text-sub-title font-400"
        >
          <span>{{ $t('查看详情') }}</span>
          <InviteChevronIcon :size="16" color="#11A3FD" />
        </NuxtLinkLocale>
      </div>
    </div>

    <div class="hidden min-h-0 w-full flex-1 lg:block lg:h-full">
      <div
        class="min-h-0 lg:(flex items-stretch gap-[48px]) xl:h-full"
        :class="reverse ? 'lg:flex-row-reverse' : ''"
      >
        <!-- PC 文案区：撑满列高；上 48px；靠左 pl、靠右 pr（与 reverse 对应，仅 lg+） -->
        <div
          class="invite-feature-copy lg:(min-h-0 min-w-0 h-full flex-1 box-border pt-[48px])"
          :class="reverse ? 'lg:pr-[40px] xl:pr-[60px]' : 'lg:pl-[40px] xl:pl-[60px]'"
        >
          <h2
            class="invite-feature-copy__title text-primary font-700 lg:text-h4 lg:leading-[48px]"
            :class="{ 'invite-feature-copy__title--latin': featureTitleLatin }"
          >
            {{ props.title }}
          </h2>

          <!-- PC 段落区：高度随内容；段间固定 20px；justify-between 均分剩余空间 -->
          <div class="invite-feature-copy__paragraphs lg:(mt-[20px] flex flex-col justify-between gap-[20px])">
            <div
              v-for="(block, blockIndex) in descriptionBlocks"
              :key="blockIndex"
              class="invite-feature-copy__paragraph shrink-0 text-body text-secondary leading-[28px] font-400"
            >
              {{ block }}
            </div>
          </div>

          <NuxtLinkLocale
            v-if="link"
            :to="link"
            class="mt-[20px] inline-flex items-center gap-[6px] text-[#11A3FD] text-[16px] leading-[24px] font-500"
          >
            <span>{{ $t('查看详情') }}</span>
            <InviteChevronIcon :size="20" color="#11A3FD" />
          </NuxtLinkLocale>
        </div>

        <!-- PC 配图区：固定最大宽度，左侧文案占据剩余空间 -->
        <div
          class="invite-feature-image-col lg:(min-h-0 h-full shrink-0 flex-none box-border max-w-[630px] w-[min(630px,52%)] xl:(w-[630px])"
        >
          <div class="invite-feature-image box-border h-full min-h-0 w-full overflow-hidden">
            <RxResponsiveImage
              v-if="isInView && imageName"
              :name="imageName"
              :alt="imageAlt || props.title"
              class="invite-feature-image-media"
            />
            <img
              v-else-if="isInView && image"
              :src="image"
              :alt="imageAlt || props.title"
              loading="lazy"
              draggable="false"
              class="invite-feature-image-media"
            >
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
/* 红框正文/链接：站点默认系统字体栈；标题中文继承 --family */
.invite-feature-mobile__body,
.invite-feature-copy {
  font-family: var(--family);
}

/* 区块标题：仅西文（英/俄）指定 Archivo */
.invite-feature-copy__title--latin {
  font-family: Archivo, sans-serif;
}

/* RxResponsiveImage 的 class 只落在 img 上，picture 需 :deep 同步铺满容器 */
.invite-feature-image {
  position: relative;
}

.invite-feature-image :deep(picture) {
  display: block;
  width: 100%;
  height: 100%;
}

.invite-feature-image-media,
.invite-feature-image :deep(img) {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}
</style>
