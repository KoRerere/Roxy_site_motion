<script setup lang="ts">
import { RxIcon } from '@/components/rx-icon'

const data = [
  $t('我们携手构建安全、高性能的工具，赋能全球用户更智能、更安全地工作。'),
  $t('我们的共同目标很简单——让每个人都能享受先进的在线隐私和生产力。'),
]
</script>

<template>
  <Container>
    <div class="flex flex-col gap-5 items-center lg:flex-row lg:gap-70px">
      <rx-responsive-image name="about-us/who-we-are" class="lg:w-540px xl:w-640px" />
      <div class="text-[#111213] flex flex-1 flex-col gap-8">
        <div class="flex flex-col gap-3">
          <h2 class="text-6 font-700 lg:text-h3">
            {{ $t('我们是谁？') }}
          </h2>
          <p class="text-3.5 font-400 whitespace-pre-line lg:text-body">
            {{ $t('公司现拥有 100 人+ 的国际化技术与产品团队，成员遍布北美、亚洲及欧洲，并在 美国、新加坡等地设有研发基地，具备全球协同研发与长期技术演进能力。团队在 浏览器核心技术、指纹隔离、隐私保护、AI 驱动的自动化管理 等领域具有深厚积累。') }}
          </p>
        </div>
        <div class="flex flex-col gap-4">
          <div v-for="text in data" :key="text" class="flex gap-2">
            <RxIcon name="base/rx_ic_check_fill" class="mt-0.5" :size="20" />
            <p class="text-4 leading-22px">
              {{ text }}
            </p>
          </div>
        </div>
      </div>
    </div>
  </Container>
</template>
