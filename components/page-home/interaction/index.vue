<template>
  <section class="pt-60px md:pt-120px pb-80px bg-[#F3F4F7]">
    <Container>
      <h2 class="text-primary text-center section-title">
        {{$t('体验轻盈的浏览之旅')}}
      </h2>
      <p class="text-primary font-400 text-14px leading-20px md:text-body text-center mt-5">
        {{$t('摆脱复杂交互的困扰')}}
      </p>
      <Wrapper>
        <template #one>
          <div class="flex flex-col justify-between h-full">
            <div>
              <div class="flex flex-col gap-4">
                  <label class="font-500">{{ $t('系统 & 内核') }}</label>
                  <div class="flex flex-col gap-14px">
                    <RxInputSelect 
                      :options="osOptions" 
                      v-model="osValue" 
                      :filter="false" 
                      :size="rxCompSize" 
                    />
                    <RxInputSelect 
                      :options="chromeVersion" 
                      v-model="chromeVersionValue" 
                      :filter="false" 
                      icon="base/rx_ic_chrome" 
                      iconColor="#12a3fc" 
                      :size="rxCompSize" 
                    />
                    <RxInputSelect 
                      :options="proxyList" 
                      v-model="proxyListValue" 
                      :filter="false" 
                      :size="rxCompSize" 
                      class="jetBrains-mono"
                      :pt="{
                        overlay: 'jetBrains-mono'
                      }"
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
                <img src="/home/profile-template.svg" alt="" />
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
            :icon="'/home/user.svg'"
            :decorate="'1'"
            :titleClasses="CSS.title"
            :descClasses="CSS.description"
          >
            <div :class="cn('flex flex-col gap-14px', CSS['box-padding'])">
              <div class="flex flex-col gap-2">
                <label for="email">{{ $t('邮箱') }}</label>
                <IconField class="input-group">
                  <InputIcon>
                    <RxIcon name="base/rx_ic_email" :size="lgWidth ? 16 : 20" color="black" />
                  </InputIcon>
                  <RxInputText :placeholder="$t('请输入邮箱')" :size="rxCompSize"  />
                </IconField>
              </div>
              <div class="flex flex-col gap-2">
                <label for="project">{{ $t('项目') }}</label>
                <RxInputSelect 
                  :options="projectList" 
                  v-model="projectValue" 
                  :filter="false" 
                  :size="rxCompSize" 
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
            :title="$t('代理面板')"
            :desc="$t('轻松管理不同环境所需的代理，突破地域限制并始终保持匿名。')"
            :icon="'/home/proxy-panel-icon.svg'"
            :decorate="'2'"
            :titleClasses="cn(CSS.title, '!text-white')"
            :descClasses="cn(CSS.description, '!text-white')"
          >
            <div 
              :class="cn(
                'flex flex-col gap-4 bg-[linear-gradient(180deg,_rgba(255,255,255,0.2)_0%,_rgba(255,255,255,0)_100%)] rounded-3', 
                CSS['box-padding']
              )"
            >
              <div class="flex flex-col gap-14px">
                <label class="text-white">
                  {{ $t('代理类型') }}
                </label>
                <RxInputRadio 
                  :options="proxyType.map(v => ({ label: v, value: v }))" 
                  v-model="proxyTypeValue"
                  :size="rxCompSize" 
                />
              </div>
              <div class="flex flex-col gap-14px">
                <label class="text-white">
                  {{ $t('代理信息') }}
                </label>
                <RxInputSelect 
                  :options="proxyInfo.map(v => ({ label: v, value: v }))" 
                  v-model="proxyInfoValue" 
                  :filter="false" 
                  :size="rxCompSize" 
                  class="jetBrains-mono"
                  :pt="{
                    overlay: 'jetBrains-mono'
                  }"
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
            :icon="'/home/account-hub-icon.svg'"
            :decorate="'1'"
            :titleClasses="CSS.title"
            :descClasses="CSS.description"
          >
            <div class="p-4 flex flex-col gap-4 rounded-3 h-full">
              <RxInputSelect 
                :options="platformOptions" 
                v-model="platformValue" 
                :filter="false" 
                :size="rxCompSize" 
              />
              <RxInputText :placeholder="$t('请输入账号')" :size="rxCompSize"  />
              <RxInputText :placeholder="$t('请输入密码')" :size="rxCompSize"  />
              <IconField class="input-group-f2a">
                <RxInputText :placeholder="$t('请输入 2FA key')" :size="rxCompSize" />
                <InputIcon>
                  <RxIcon name="base/rx_ic_2fa" :size="lgWidth ? 16 : 20" color="#12A3FC" />
                </InputIcon>
              </IconField>
            </div>
          </PanelTemp>
        </template>

        <template #five>
          <div class="pt-6 pl-6 pb-8 xl:pb-20 flex flex-col justify-between h-full">
            <div class="overflow-hidden max-h-[260px] lg:max-h-none">
              <RxResponsiveImage name='home/api-flow' class="w-full" alt="" />
            </div>

            <div class="flex flex-col pr-6">
              <div class="hidden lg:block">
                <img src="/home/api-flow-icon.svg" alt="" />
              </div>
              <h3 :class="cn(CSS.title, 'mt-3')">{{ $t('API 流程') }}</h3>
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
            :icon="'/home/window-sync-icon.svg'"
            :decorate="'2'"
            class="bg-[linear-gradient(261deg,_#373749_13.82%,_#2C2C3F_86.18%)] text-white"
            :titleClasses="cn(CSS.title, '!text-white')"
            :descClasses="cn(CSS.description, '!text-white')"
          >
            <div class="rounded-3 lg:pl-3 max-h-[260px] sm:max-h-296px overflow-hidden">
              <RxResponsiveImage name='home/window-sync' class="w-full" alt="" />
            </div>
          </PanelTemp>
        </template>
      </Wrapper>
    </Container>
  </section>
</template>

<script setup>
import { RxInputSelect, RxInputText } from '#components';
import { os, chromeVersion, proxyInfo, proxyType, platform, proxyList, projectList } from './config';
import InputNumberGroup from './input-number-group.vue';   
import PanelTemp from './panel-temp.vue';
import Wrapper from './wrapper.vue';
import { RxIcon } from '@/components/rx-icon';

const CSS = useCssModule('interaction');

const breakpoints = useRxBreakpoints();
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
    children: item.children
  }))
})

const osValue = ref(osOptions.value[0]);

const chromeVersionValue = ref(chromeVersion[0]);

const proxyListValue = ref(proxyList[0]);

const projectValue = ref(projectList[0]);

const proxyTypeValue = ref(proxyType[0]);
const proxyInfoValue = ref({ label: proxyInfo[0] });

const inputs = computed(() => [
  {
    label: $t('主机'),
    type: 'text',
    placeholder: $t('主机'),
  },
  {
    separator: true,
  },
  {
    label: $t('端口'),
    type: 'number',
    placeholder: $t('端口'),
  }
])

const platformOptions = computed(() => {
  return platform.map(item => ({
    label: item.platformUrl,
    value: item.id,
    image: item.platformIcon,
  }))
})

const platformValue = ref(platformOptions.value[0]);
// const mount = ref(false)

// onMounted(() => {
//   mount.value = true
// })
</script>

<style module="interaction">
.title {
  @apply text-18px leading-26px md:text-h5 font-600 font-[Archivo] text-primary;
}

.description {
  @apply text-inactive font-400 text-4 leading-24px md:text-body;
}

.btn {
  @apply border-0 bg-[#11A3FD] rounded-2 w-200px xl:w-[240px] h-12 text-white items-center justify-center cursor-pointer mt-6 md:mt-7 xl:mt-9 text-18px font-500;
}

.box-padding {
  @apply px-4 pt-3 xl:px-6 xl:pt-5;
}


</style>

<style>
.input-group .p-inputicon {
  inset-inline-start: 14px !important;
  transform: translateY(-50%);
  margin-top: 0;
  display: flex;
  align-items: center;
}

.input-group .xl .p-inputtext {
  padding-left: 42px !important;
}

.input-group .lg .p-inputtext {
  padding-left: 36px !important;
}

.input-group-f2a .p-inputicon {
  /* inset-inline-start: 14px !important; */
  transform: translateY(-50%) translateX(-6px);
  margin-top: 0;
  display: flex;
  align-items: center;
}

.jetBrains-mono .select-item div {
  font-family: 'JetBrains Mono';
}

.jetBrains-mono-overlay {

}
</style>
