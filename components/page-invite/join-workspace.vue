<script setup lang="ts">
import { useToast } from 'primevue/usetoast'
import Alert from './Alert.vue'

const { $API } = useNuxtApp()
const { $t } = useRxI18n()
const route = useRoute()
const props = defineProps({
  workspaceInfo: {
    type: Object,
    default: () => ({})
  },
})
const isExpired = ref(false)
const emit = defineEmits(['success', 'joined'])

const toast = useToast()

let data = '';
if (route.query.data) {
  data = decodeURIComponent(route.query.data.toString().replace(/\+/g, '%2B'))
}

$API.limit.userShowInvitationLinkStatusCreate(data).then((res) => {
  if (res.code === 0) {
    isExpired.value = res.data === 'expired'
  } 
})

// 点击确定加入工作空间
async function joinWorkspace() { 
  const { code, msg } = await $API.limit.userAddUserByProjectInfoCreate(props.workspaceInfo.data)
  if (code === 0) {
    emit('success')
  } else {
    toast.add({ severity: 'error', summary: msg, detail: $t('请求错误'), life: 3000 });
  }
}
</script>

<template>
  <div class="invite-join-workspace">
    <div class="invite-workspace-info">
        <div v-if="workspaceInfo.workspacePicture" class="workspace-icon">
          {{ workspaceInfo.workspacePicture }}
        </div>
        <div v-else class="workspace-icon-name">
          {{ workspaceInfo.workspaceName.slice(0, 2).toUpperCase() }}
        </div>
        <div class="workspace-name">{{ workspaceInfo.workspaceName }}</div>

        <Alert type="warn" v-if="isExpired" class="w-full">
          <template #title>{{ $t('邀请已过期') }}</template>
          <template #content>{{ $t('当前工作空间的邀请已过期，请联系管理员操作并重新尝试。') }}</template>
        </Alert>

        <div class="workspace-description" v-else> 
          <rx-i18n-t 
            :keypath="$t('您已被邀请加入 {workspaceName}，请单击下面的按钮加入工作区并开始协作！', { workspaceName: '{workspaceName}' })"
          >
            <template #workspaceName>
              <span class="font-semibold">{{ workspaceInfo.workspaceName }}</span>
            </template> 
          </rx-i18n-t>
        </div>
    </div>
    <RxButton @click="joinWorkspace" class="w-full">
      {{ $t('加入空间') }}
    </RxButton>
  </div>
</template>

<style lang="scss" scoped>
.invite-join-workspace {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: var(--spacing-2xl, 16px);
    align-self: stretch;
    width: 320px;
    padding: 24px 32px;

    .invite-workspace-info {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: var(--spacing-xl, 12px);
        align-self: stretch;

        .workspace-icon {
            display: flex;
            font-size: 48px;
            height: 48px;
            justify-content: center;
            align-items: center;
        }

        .workspace-name {
            color: #000;
            text-align: center;
            font-size: 16px;
            font-style: normal;
            font-weight: 600;
            line-height: var(--Line-Height-text-lg, 20px); /* 125% */
        }

        .workspace-description {
            align-self: stretch;
            color: var(--Colors-Text-text-secondary, #575D61);
            font-size: 14px;
            font-style: normal;
            font-weight: 400;
            line-height: var(--Line-Height-text-lg, 20px); /* 142.857% */
        }
    }
}

.workspace-icon-name {
    width: 48px;
    height: 48px;
    border-radius: 4px;
    background: #000;
    color: #FFF;
    text-align: center;
    line-height: 48px;
    font-size: 26px;
}
</style>