<template>
  <div v-if="loggedIn" class="user-info-mobile size-8 flex shrink-0 items-center justify-center relative">
    <button class="user-info-mobile-avatar size-8 border-none bg-transparent p-0 flex cursor-pointer items-center justify-center leading-none" @click.stop="showLoginOut">
      <img v-if="userInfo.avatar" :src="userInfo.avatar" class="block size-[32px] rounded-full object-cover">
      <div v-else class="flex items-center justify-center user-name-avatar size-[32px] text-white">
        {{ userInfo.name.substring(0, 2).toUpperCase() }}
      </div>
    </button>
    <div v-if="showLoginOutMenu" class="logout-menu absolute right-0 top-[54px] z-10">
      <button
        class="logout-menu-item border-none cursor-pointer"
        :class="logoutMenuTheme.panel"
        @click.stop="handleLogout"
      >
        <RxIcon name="menu/rx_ic_logout" size="20" />
        <span :class="logoutMenuTheme.text">{{ $t('退出') }}</span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { RxIcon } from '~/components/rx-icon'
import { useAuth } from '~/hooks/useAuth'
import { loggedIn, userInfo } from '~/store/auth'

const props = defineProps({
  open: {
    type: Boolean,
    default: false,
  },
  theme: {
    type: String,
    default: 'light',
  },
})
const emit = defineEmits<{
  toggle: [open: boolean]
}>()
const { logout } = useAuth()
const showLoginOutMenu = ref(false)

watch(() => props.open, (open) => {
  showLoginOutMenu.value = open
})

const logoutMenuTheme = computed(() => {
  if (props.theme === 'light') {
    return {
      panel: 'logout-menu-light',
      text: 'text-[#2C2E30]',
    }
  }

  return {
    panel: 'logout-menu-dark',
    text: 'text-white',
  }
})

const showLoginOut = () => {
  const nextOpen = !showLoginOutMenu.value
  showLoginOutMenu.value = nextOpen
  emit('toggle', nextOpen)
}

const handleLogout = () => {
  showLoginOutMenu.value = false
  emit('toggle', false)
  logout()
}
</script>

<style scoped>
.user-name-avatar {
  line-height: 20px;
  font-size: 12px;
  border-radius: 50%;
  background-color: rgb(126, 204, 252);
}

.logout-menu {
  width: max-content;
  box-shadow:
    0 4px 12px 0 rgba(0, 0, 0, 0.08),
    0 1px 2px 0 rgba(0, 0, 0, 0.08);
}

.logout-menu-light {
  background: #fff;
}

.logout-menu-dark {
  background: rgba(12, 26, 49, 0.3);
  backdrop-filter: blur(12px);
}

.logout-menu-item {
  display: inline-flex;
  align-items: center;
  align-content: center;
  justify-content: flex-end;
  flex-wrap: nowrap;
  gap: 8px;
  box-sizing: border-box;
  width: max-content;
  padding: 10px 12px;
  border-radius: 8px;
  font-family: Inter;
  font-size: 16px;
  font-weight: 400;
  line-height: 20px;
  text-align: left;
  white-space: nowrap;
}
</style>
