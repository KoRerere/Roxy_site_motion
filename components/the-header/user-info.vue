<template>
    <div class="user-info px-[8px] py-[6px] cursor-pointer relative" v-if="loggedIn">

        <RxDownloadMenu class="hidden lg:block" :model="userMenus" width="212px" panelClass="right-0">
            <template #default="{ toggle: onToggleUserMenu }">
                <div class="flex items-center gap-2" @click="onToggleUserMenu">
                    <img v-if="userInfo.avatar" :src="userInfo.avatar" class="w-[24px] h-[24px] rounded-full">
                    <div v-else class="flex items-center justify-center" style="width: 24px; height: 24px; line-height: 24px; font-size: 12px; border-radius: 50%; background-color: rgb(126, 204, 252);">
                        {{ userInfo.name.substring(0,2).toUpperCase() }}
                    </div>
                    <span class="text-[14px] leading-[20px] max-w-[60px] lg:max-w-[100px] font-[Inter] font-medium truncate word-overflow-ellipsis">{{ userInfo.name }}</span>
                    <RxIcon name="base/rx_ic_chevron_down" size="20" color="#fff" />

                </div>
            </template>
        </RxDownloadMenu>
    </div>
    <template v-else>
        <slot />
    </template>
</template>

<script setup lang="ts">
import { RxIcon } from '~/components/rx-icon';
import { AnimatePresence, motion } from 'motion-v'
import { loggedIn, userInfo } from '~/store/auth';

import RxDownloadMenu from '@/components/rx-download-menu.vue'
import { useOpenRoxyBrowser } from './config';
import { useAuth } from '~/hooks/useAuth';

const { public: { roxyBrowserUrl } } = useRuntimeConfig()
const { logout } = useAuth()

const handleLogout = () => {

logout()
}

const userMenus =computed(()=>  [{
    label: $t('RoxyBrowser'),
    icon: 'base/rx_ic_app_site',
    iconProps: {
        color: '#2C2E30',
    },
    command: () => {
        window.open(roxyBrowserUrl, '_blank')
    }
},

{
    label: $t('退出'),
    icon: 'base/rx_ic_logout',
    iconProps: {
        color: '#F53838',
    },
    command: () => {
        handleLogout()
    },
}])

const isOpen = ref(false)


function close() {
    isOpen.value = false
}
function handleRoxySiteClick() {
    close()
}


</script>
<style scoped lang="scss">
.user-info {
    border-radius: 6px;

   &:hover {
    background: rgba(255, 255, 255, 0.12);
   }
}
</style>