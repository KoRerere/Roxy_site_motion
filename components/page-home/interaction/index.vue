<script setup>
import { RxInputSelect, RxInputText } from '#components'
import { chromeVersion as defaultChromeVersion, os, platform, projectList, proxyInfo, proxyList, proxyType } from './config'
import InputNumberGroup from './input-number-group.vue'
import PanelTemp from './panel-temp.vue'
import Wrapper from './wrapper.vue'

const CSS = useCssModule('interaction')
const { public: { roxyHomeUrl, ENV } } = useRuntimeConfig()
const breakpoints = useRxBreakpoints()
const lgWidth = breakpoints.smallerOrEqual('lg')

const rxCompSize = computed(() => {
  return lgWidth.value ? 'lg' : 'xl'
})

const osIconMap = {
  windows: 'platforms/rx_os_windows',
  // linux: 'base/logo',
  macos: 'platforms/rx_os_macOS',
  android: 'platforms/rx_os_android',
  ios: 'platforms/rx_os_iOS',
}

const osOptions = computed(() => {
  return os.map(item => ({
    label: item.label,
    icon: osIconMap[item.label.toLocaleLowerCase()],
    value: item.value,
    children: item.children,
  }))
})

const osValue = ref(osOptions.value[0])

const chromeVersion = ref([])
const chromeVersionValue = ref()

const proxyListValue = ref(proxyList[0])

const projectValue = ref(projectList[0])

const proxyTypeValue = ref(proxyType[0])
const proxyInfoValue = ref({ label: proxyInfo[0] })

const inputs = computed(() => [
  {
    label: $t('主机'),
    type: 'text',
    placeholder: $t('主机'),
    name: 'host',
  },
  {
    separator: true,
  },
  {
    label: $t('端口'),
    type: 'number',
    placeholder: $t('端口'),
    name: 'port',
  },
])

const platformOptions = computed(() => {
  return platform.map(item => ({
    label: item.platformUrl,
    value: item.id,
    image: item.platformIcon,
    alt: item.platformUrl,
  }))
})

const platformValue = ref(platformOptions.value[0])

onMounted(async () => {
  try {
    const result = await fetch(`${roxyHomeUrl}/app_statistics/get_official_core_version_data`)
    if (result.ok) {
      const data = await result.json()
      if (data.code === 0 && data.data) {
        chromeVersion.value = data.data.map(v => ({ label: `RoxyChrome ${v}`, value: v }))
        chromeVersionValue.value = chromeVersion.value[0]
      }
    }
  }
  finally {
    if (!chromeVersion.value.length) {
      // 接口请求失败或后端没有返回数据时的兜底
      chromeVersion.value = defaultChromeVersion
      chromeVersionValue.value = defaultChromeVersion[0]
    }
  }
})
</script>

<template>
  <section class="pb-20 pt-15 bg-[#F3F4F7]">
    <Container>
      <h2 class="section-title text-primary text-center">
        {{ $t('体验轻盈的浏览之旅') }}
      </h2>
      <p class="text-14px text-primary font-400 mt-2 text-center md:text-body max-md:leading-20px">
        {{ $t('摆脱复杂交互的困扰') }}
      </p>
      <Wrapper>
        <template #one>
          <div class="flex flex-col h-full justify-between">
            <div>
              <div class="flex flex-col gap-4">
                <label class="font-500">{{ $t('系统 & 内核') }}</label>
                <div class="flex flex-col gap-14px">
                  <RxInputSelect
                    v-model="osValue"
                    :options="osOptions"
                    :filter="false"
                    :size="rxCompSize"
                    name="system"
                  />
                  <RxInputSelect
                    v-model="chromeVersionValue"
                    :options="chromeVersion"
                    :filter="false"
                    icon="base/rx_ic_chrome"
                    icon-color="#12a3fc"
                    :size="rxCompSize"
                    name="chromeVersion"
                  />
                  <RxInputSelect
                    v-model="proxyListValue"
                    :options="proxyList"
                    :filter="false"
                    :size="rxCompSize"
                    class="jetBrains-mono"
                    :pt="{
                      overlay: 'jetBrains-mono',
                    }"
                    name="proxyList"
                  />
                </div>
              </div>

              <div class="flex justify-center">
                <button :class="CSS.btn">
                  {{ $t('创建窗口') }}
                </button>
              </div>
            </div>

            <div class="flex flex-col">
              <div class="hidden lg:block">
                <img src="/home/profile-template.svg" alt="" draggable="false" class="select-none">
              </div>
              <h3 :class="cn(CSS.title, 'mt-3')">
                {{ $t('窗口模板') }}
              </h3>
              <p :class="cn(CSS.description, 'mt-3')">
                {{ $t('通过模板功能一键创建定制化配置文件，并确保环境设置的完美一致性。') }}
              </p>
            </div>
          </div>
        </template>

        <template #two>
          <PanelTemp
            :title="$t('团队空间')"
            :desc="$t('自由创建或加入团队空间，使用项目分组管理并通过易用的角色权限快速邀请其他成员。')"
            icon="/home/user.svg"
            decorate="1"
            :title-classes="CSS.title"
            :desc-classes="CSS.description"
          >
            <div :class="cn('flex flex-col gap-14px', CSS['box-padding'])">
              <div class="flex flex-col gap-2">
                <label for="email">{{ $t('邮箱') }}</label>
                <RxInputText
                  :placeholder="$t('请输入邮箱')"
                  :size="rxCompSize"
                  name="email"
                  left-icon="base/rx_ic_email"
                  left-icon-color="black"
                />
              </div>
              <div class="flex flex-col gap-2">
                <label for="project">{{ $t('项目') }}</label>
                <RxInputSelect
                  v-model="projectValue"
                  :options="projectList"
                  :filter="false"
                  :size="rxCompSize"
                  name="project"
                />
              </div>
            </div>
            <div class="flex justify-center">
              <button :class="CSS.btn">
                {{ $t('邀请成员') }}
              </button>
            </div>
          </PanelTemp>
        </template>

        <template #three>
          <PanelTemp
            :title="$t('代理 IP 面板')"
            :desc="$t('轻松管理不同环境所需的代理 IP，突破地域限制并始终保持匿名。')"
            icon="/home/proxy-panel-icon.svg"
            decorate="2"
            :title-classes="cn(CSS.title, '!text-white')"
            :desc-classes="cn(CSS.description, '!text-white')"
          >
            <div
              :class="cn(
                'flex flex-col gap-4 bg-[linear-gradient(180deg,_rgba(255,255,255,0.2)_0%,_rgba(255,255,255,0)_100%)] rounded-3',
                CSS['box-padding'],
              )"
            >
              <div class="flex flex-col gap-14px">
                <label class="text-white">
                  {{ $t('代理 IP 类型') }}
                </label>
                <RxInputRadio
                  v-model="proxyTypeValue"
                  :options="proxyType.map(v => ({ label: v, value: v }))"
                  :size="rxCompSize"
                  name="proxyType"
                />
              </div>
              <div class="flex flex-col gap-14px">
                <label class="text-white">
                  {{ $t('代理 IP 信息') }}
                </label>
                <RxInputSelect
                  v-model="proxyInfoValue"
                  :options="proxyInfo.map(v => ({ label: v, value: v }))"
                  :filter="false"
                  :size="rxCompSize"
                  class="jetBrains-mono"
                  :pt="{
                    overlay: 'jetBrains-mono',
                  }"
                  name="proxyInfo"
                />
                <InputNumberGroup
                  :inputs="inputs"
                  :size="rxCompSize"
                />
              </div>
            </div>
          </PanelTemp>
        </template>

        <template #four>
          <PanelTemp
            :title="$t('账号中心')"
            :desc="$t('在独立的空间便捷导入并配置多账号，分配至隔离且真实的环境。')"
            icon="/home/account-hub-icon.svg"
            decorate="1"
            :title-classes="CSS.title"
            :desc-classes="CSS.description"
          >
            <div class="p-4 rounded-3 flex flex-col gap-4 h-full">
              <RxInputSelect
                v-model="platformValue"
                :options="platformOptions"
                :filter="false"
                :size="rxCompSize"
              />
              <RxInputText :placeholder="$t('请输入账号')" :size="rxCompSize" name="account" />
              <RxInputText :placeholder="$t('请输入密码')" :size="rxCompSize" name="password" />
              <RxInputText
                :placeholder="$t('请输入 2FA key')"
                :size="rxCompSize"
                name="2fa"
                icon="base/rx_ic_2fa"
                icon-color="#12A3FC"
              />
            </div>
          </PanelTemp>
        </template>

        <template #five>
          <div class="pb-8 pl-6 pt-6 flex flex-col h-full justify-between xl:pb-20">
            <div class="max-h-[260px] overflow-hidden lg:max-h-none">
              <RxResponsiveImage name="home/api-flow" class="w-full" alt="" />
            </div>

            <div class="pr-6 flex flex-col">
              <div class="hidden lg:block">
                <img src="/home/api-flow-icon.svg" alt="" draggable="false" class="select-none">
              </div>
              <h3 :class="cn(CSS.title, 'mt-3')">
                {{ $t('API 流程') }}
              </h3>
              <p :class="cn(CSS.description, 'mt-3')">
                {{ $t('通过强大 API 集成，自动化复杂任务。') }}
              </p>
            </div>
          </div>
        </template>

        <template #six>
          <PanelTemp
            :title="$t('窗口同步')"
            :desc="$t('跨多窗口同步浏览器操作，充分减少重复任务执行负担，优化工作流程。')"
            icon="/home/window-sync-icon.svg"
            decorate="2"
            class="text-white bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)]"
            :title-classes="cn(CSS.title, '!text-white')"
            :desc-classes="cn(CSS.description, '!text-white')"
          >
            <div class="rounded-3 max-h-[260px] overflow-hidden lg:pl-3 sm:max-h-296px">
              <RxResponsiveImage name="home/window-sync" class="w-full" alt="" />
            </div>
          </PanelTemp>
        </template>
      </Wrapper>
    </Container>
  </section>
</template>

<style module="interaction">
.title {
  @apply text-18px max-md:leading-26px md:text-h5 font-600 multilingual-text text-primary;
}

.description {
  @apply text-inactive font-400 text-4 max-md:leading-24px md:text-body;
}

.btn {
  @apply border-0 bg-[#11A3FD] rounded-2 w-210px xl:w-[240px] h-12 text-white items-center justify-center cursor-pointer mt-6 md:mt-7 xl:mt-9 text-18px font-500;
}

.box-padding {
  @apply px-4 pt-3 xl:px-6 xl:pt-5;
}
</style>

<style>
.jetBrains-mono .select-item div {
  font-family: 'JetBrains Mono';
}
</style>
