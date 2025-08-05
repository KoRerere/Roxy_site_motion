<template>
  <AnimatePresence>
    <motion.div v-if="modelValue" :initial="{ opacity: 0 }" :animate="{ opacity: 1 }" :exit="{ opacity: 0 }" :transition="{ duration: 0.3 }"
      class="rx-accordion max-h-[calc(100dvh-124px)] overflow-y-auto w-full">
      <div :class="cn({ 'px-3': modelValue })">
        <Accordion :value="['use-cases', 'features']" multiple>
          <AccordionPanel v-for="menu in mobileMenus" :value="menu.value">
            <AccordionHeader :as="!menu.children ? NuxtLinkLocale : 'div'" :to="menu.value" :pt="{
              root: {
                class: cn({
                  '!bg-white/20': currPath.includes(menu.value) && !menu.children
                })
              }
            }">
              {{ menu.title }}
              <template v-if="!menu.children" #toggleicon>
                {{ '' }}
              </template>
            </AccordionHeader>
            <AccordionContent v-if="menu.children" :pt="{
              content: {
                class: cn('!px-0 !pt-0 !pb-2 gap-6px', {
                  'grid grid-cols-2': menu.value !== 'language'
                })
              }
            }">
              <div v-for="child in menu.children" :class="cn('flex items-center cursor-pointer text-15px gap-2 p-2', {
                'rounded-2 bg-white/20': child.value === locale || currPath.includes(child.value)
              })">
                <RxIcon :name="child.icon || `menu/${child.value}`" size="24" color="#FFF" />
                <span v-if="child.click" @click="handleClick(child)" class="block w-full">{{ child.title }}</span>
                <NuxtLinkLocale v-else :to="gotoPath(menu, child)" class="block w-full" @click="handleClick(child)">{{ child.title }}</NuxtLinkLocale>
              </div>
            </AccordionContent>
          </AccordionPanel>
        </Accordion>
      </div>
    </motion.div>
  </AnimatePresence>
</template>

<script setup>
import { NuxtLinkLocale } from '#components'
import { motion, AnimatePresence } from 'motion-v';
import { useMenuConfigs } from './config'
import { RxIcon } from '@/components/rx-icon'
const modelValue = defineModel({ default: false });
const { mobileMenus } = useMenuConfigs()

const { locale } = useRxI18n()

const handleClick = (child) => {
  if (child?.click) {
    child.click()
  }
  modelValue.value = false
}

function gotoPath (menu, child) {
  return `/${menu.value}/${child.value}`
}

const route = useRoute()

watch(() => route.path, () => {
  modelValue.value = false
})

const currPath = computed(() => route.path)
</script>

<style scoped lang="scss">
.rx-accordion {
  --color: #FAF4F4;

  :deep(.p-accordionpanel) {
    border-bottom-color: rgba(255, 255, 255, 0.20);
  }

  :deep(.p-accordionheader) {
    padding: 16px 8px;
    color: #FAF4F4;
    font-size: 15px;
    font-weight: 500;
    font-family: Archivo;
    line-height: 18px;
    background-color: transparent;
  }

  :deep(.p-accordionpanel:last-child) {
    border-bottom: none;
  }

  :deep(.p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) > .p-accordionheader:hover),
  :deep(.p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader) {
    background-color: transparent;
    color: var(--color);
  }

  :deep(.p-accordioncontent-content) {
    background-color: transparent;
    color: var(--color);
  }

  :deep(.p-accordionpanel:not(.p-accordionpanel-active):not(.p-disabled) .p-accordionheader:hover .p-accordionheader-toggle-icon) {
    color: var(--color);
  }

  :deep(.p-accordionheader-toggle-icon) {
    color: var(--color);
  }

  :deep(.p-accordionpanel:not(.p-disabled).p-accordionpanel-active > .p-accordionheader .p-accordionheader-toggle-icon) {
    color: var(--color);
  }
}
</style>