<script setup lang="ts">
import {
  ROXYBROWSER_BAIKE_ALIASES,
  ROXYBROWSER_BAIKE_FEATURES,
  ROXYBROWSER_BAIKE_INFO_ROWS,
  ROXYBROWSER_BAIKE_INTRO,
  ROXYBROWSER_BAIKE_LEAD,
  ROXYBROWSER_BAIKE_PAGE_META,
  ROXYBROWSER_BAIKE_TIMELINE,
  ROXYBROWSER_BAIKE_TOC,
} from '@/constants/roxybrowser-baike'

/** 与 CSS --roxy-baike-sticky-offset 一致，用于 scroll-spy 判定线 */
const BAIKE_STICKY_OFFSET = 128

const activeSectionId = ref(ROXYBROWSER_BAIKE_TOC[0].id)

function updateActiveSection() {
  let current = ROXYBROWSER_BAIKE_TOC[0].id
  for (const item of ROXYBROWSER_BAIKE_TOC) {
    const el = document.getElementById(item.id)
    if (el && el.getBoundingClientRect().top <= BAIKE_STICKY_OFFSET + 24)
      current = item.id
  }
  activeSectionId.value = current
}

/** 目录点击：平滑滚动，不写入 URL hash */
function scrollToSection(id: string) {
  const el = document.getElementById(id)
  if (!el)
    return
  el.scrollIntoView({ behavior: 'smooth', block: 'start' })
  activeSectionId.value = id
}

onMounted(() => {
  // 清除地址栏中可能残留的 #sec-* hash
  if (window.location.hash)
    history.replaceState(null, '', `${window.location.pathname}${window.location.search}`)

  updateActiveSection()
  window.addEventListener('scroll', updateActiveSection, { passive: true })
})

onUnmounted(() => {
  window.removeEventListener('scroll', updateActiveSection)
})
</script>

<template>
  <main class="roxy-baike">
    <!-- Hero：深色渐变 + 面包屑 + 标题 -->
    <section class="roxy-baike__hero">
      <div class="roxy-baike__container">
        <h1 class="roxy-baike__title">
          RoxyBrowser
        </h1>
        <p class="roxy-baike__meta">
          {{ ROXYBROWSER_BAIKE_PAGE_META.publishedAt }} ｜ 作者：{{ ROXYBROWSER_BAIKE_PAGE_META.author }}
        </p>
      </div>
    </section>

    <div class="roxy-baike__container roxy-baike__layout">
      <article class="roxy-baike__article">
        <p class="roxy-baike__alias">
          <b>别名</b>：{{ ROXYBROWSER_BAIKE_ALIASES }}
        </p>
        <p class="roxy-baike__lead">
          {{ ROXYBROWSER_BAIKE_LEAD }}
        </p>

        <h2 id="sec-info" class="roxy-baike__h2">
          基本信息
        </h2>
        <table class="roxy-baike__infobox">
          <tbody>
            <tr v-for="row in ROXYBROWSER_BAIKE_INFO_ROWS" :key="row.label">
              <th>{{ row.label }}</th>
              <td>{{ row.value }}</td>
            </tr>
          </tbody>
        </table>

        <h2 id="sec-intro" class="roxy-baike__h2">
          产品介绍
        </h2>
        <p class="roxy-baike__p">
          {{ ROXYBROWSER_BAIKE_INTRO }}
        </p>

        <h2 id="sec-feature" class="roxy-baike__h2">
          核心功能
        </h2>
        <template v-for="feature in ROXYBROWSER_BAIKE_FEATURES" :key="feature.title">
          <h3 class="roxy-baike__h3">
            {{ feature.title }}
          </h3>
          <p class="roxy-baike__p">
            {{ feature.content }}
          </p>
        </template>

        <h2 id="sec-history" class="roxy-baike__h2">
          发展历程
        </h2>
        <ul class="roxy-baike__timeline">
          <li v-for="item in ROXYBROWSER_BAIKE_TIMELINE" :key="item.date">
            <span class="roxy-baike__timeline-date">{{ item.date }}</span>{{ item.content }}
          </li>
        </ul>
      </article>

      <!-- PC 右侧 sticky 目录 -->
      <aside class="roxy-baike__toc">
        <h3 class="roxy-baike__toc-title">
          目录
        </h3>
        <ul class="roxy-baike__toc-list">
          <li v-for="item in ROXYBROWSER_BAIKE_TOC" :key="item.id">
            <button
              type="button"
              class="roxy-baike__toc-link"
              :class="{ 'roxy-baike__toc-link--active': activeSectionId === item.id }"
              @click="scrollToSection(item.id)"
            >
              {{ item.label }}
            </button>
          </li>
        </ul>
      </aside>
    </div>
  </main>
</template>

<style scoped lang="scss">
.roxy-baike {
  /* fixed 顶栏 + 活动条高度，目录 sticky 与锚点滚动共用 */
  --roxy-baike-sticky-offset: 128px;
  background: #f4f6f9;
  line-height: 1.75;
}

.roxy-baike__container {
  width: 100%;
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
  box-sizing: border-box;
}

.roxy-baike__hero {
  padding: 56px 0 90px;
  color: #fff;
  text-align: center;
  background: linear-gradient(180deg, #1e1c31 0%, #2a2745 100%);
}

.roxy-baike__crumb {
  justify-content: center;
  margin-bottom: 14px;
  font-size: 14px;
  opacity: 0.8;

  :deep(.breadcrumb-item),
  :deep(.breadcrumb-link) {
    color: rgba(255, 255, 255, 0.85);
  }

  :deep(.breadcrumb-link:hover) {
    color: #12a3fc;
  }
}

.roxy-baike__title {
  margin: 0 0 12px;
  font-size: 38px;
  font-weight: 700;
}

.roxy-baike__meta {
  margin: 0;
  font-size: 14px;
  opacity: 0.7;
}

.roxy-baike__layout {
  display: flex;
  gap: 40px;
  align-items: flex-start;
  margin-top: -56px;
  padding-bottom: 80px;
}

.roxy-baike__article {
  flex: 1 1 auto;
  min-width: 0;
  padding: 40px 44px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 30px rgba(20, 30, 55, 0.08);
}

.roxy-baike__alias {
  margin: 0 0 18px;
  color: #6b7280;
  font-size: 14px;

  b {
    color: #1f2329;
  }
}

.roxy-baike__lead {
  margin: 0 0 16px;
  color: #2a2f3a;
  font-size: 16px;
}

.roxy-baike__h2 {
  margin: 36px 0 16px;
  padding-left: 12px;
  border-left: 4px solid #12a3fc;
  color: #1f2329;
  font-size: 22px;
  font-weight: 700;
  line-height: 1.3;
  /* 锚点跳转时留出顶栏高度，避免标题被 fixed header 挡住 */
  scroll-margin-top: var(--roxy-baike-sticky-offset);

  &:first-of-type {
    margin-top: 0;
  }
}

.roxy-baike__h3 {
  margin: 24px 0 10px;
  color: #1f2329;
  font-size: 17px;
  font-weight: 600;
}

.roxy-baike__p {
  margin: 0 0 16px;
  color: #3c4250;
}

.roxy-baike__infobox {
  width: 100%;
  margin: 8px 0;
  border-collapse: collapse;
  font-size: 15px;

  th,
  td {
    padding: 10px 14px;
    border: 1px solid #e8ebf0;
    text-align: left;
    vertical-align: top;
  }

  th {
    width: 140px;
    background: #f6f9fc;
    color: #1f2329;
    font-weight: 600;
    white-space: nowrap;
  }
}

.roxy-baike__timeline {
  position: relative;
  margin: 8px 0 0;
  padding: 0;
  list-style: none;

  &::before {
    content: '';
    position: absolute;
    top: 6px;
    bottom: 6px;
    left: 7px;
    width: 2px;
    background: #e3e8ef;
  }

  li {
    position: relative;
    padding: 0 0 22px 30px;

    &::before {
      content: '';
      position: absolute;
      top: 6px;
      left: 0;
      width: 16px;
      height: 16px;
      border: 3px solid #12a3fc;
      border-radius: 50%;
      background: #fff;
    }
  }
}

.roxy-baike__timeline-date {
  display: inline-block;
  margin-right: 6px;
  color: #12a3fc;
  font-weight: 700;
}

.roxy-baike__toc {
  position: sticky;
  /* 吸顶位置在顶栏下方，避免目录被遮挡 */
  top: var(--roxy-baike-sticky-offset);
  flex: 0 0 260px;
  width: 260px;
  padding: 24px 22px;
  border-radius: 16px;
  background: #fff;
  box-shadow: 0 8px 30px rgba(20, 30, 55, 0.08);
}

.roxy-baike__toc-title {
  margin: 0 0 12px;
  font-size: 16px;
  font-weight: 600;
}

.roxy-baike__toc-list {
  margin: 0;
  padding: 0;
  list-style: none;

  li {
    margin: 8px 0;
  }

  .roxy-baike__toc-link {
    display: block;
    width: 100%;
    padding: 4px 0 4px 10px;
    border: none;
    border-left: 2px solid transparent;
    background: transparent;
    color: #5a6072;
    font-size: 14px;
    text-align: left;
    text-decoration: none;
    cursor: pointer;

    &:hover {
      border-left-color: #12a3fc;
      color: #12a3fc;
    }
  }

  .roxy-baike__toc-link--active {
    border-left-color: #12a3fc;
    background: rgba(18, 163, 252, 0.06);
    color: #12a3fc;
    font-weight: 500;
  }
}

@media (max-width: 1023px) {
  .roxy-baike__toc {
    display: none;
  }

  .roxy-baike__article {
    padding: 28px 20px;
  }

  .roxy-baike__title {
    font-size: 28px;
  }
}
</style>
