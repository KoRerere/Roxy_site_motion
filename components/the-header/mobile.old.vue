<template>
  <AnimatePresence>
    <div 
      class="fixed top-0 left-0 w-full h-full bg-black/50 z-99" 
      v-if="modelValue" 
      @click="handleClick(null)"
    />

    <motion.div
      v-if="modelValue"
      :initial="{ opacity: 0, y: 100 }"
      :animate="{ opacity: 1, y: 0 }"
      :exit="{ opacity: 0, y: 100 }"
      :transition="{ duration: 0.3 }"
      class="rx-accordion fixed h-[calc(100vh-124px)] bottom-0 rounded-t-3 overflow-hidden bg-white z-100 w-full"
    >
      <div class="h-full overflow-y-auto">
        <!-- <div class="relative pt-22px" @click="handleClick(null)">
          <div class="position-x-center top-4 w-15 h-6px bg-[#D9D9D9] rounded-3px"></div>
        </div> -->
        <Accordion>
          <template v-for="menu in mobileMenus">
            <AccordionPanel :value="menu.value">
              <AccordionHeader :as="!menu.children ? NuxtLinkLocale : 'div'" :to="menu.value">
                {{ menu.title }}
                <!-- <template v-if="menu.child">
                  {{ menu.title }}
                </template>
                <template v-else>
                  <NuxtLinkLocale :to="menu.value" class="block w-full">
                    {{ menu.title }}
                  </NuxtLinkLocale>
                </template> -->
                <template v-if="!menu.children" #toggleicon>
                  {{ '' }}
                </template>
              </AccordionHeader>
              <AccordionContent v-if="menu.children" :pt="{ content: { class: '!pb-0' } }">
                <div v-for="child in menu.children" class="flex items-center cursor-pointer text-15px">
                  <RxIcon :name="'menu/' + child.value" class="ml-2" />
                  <span 
                    v-if="child.click" 
                    @click="handleClick(child)"
                    class="block w-full p-2"
                  >{{ child.title }}</span> 
                  <NuxtLinkLocale 
                    v-else
                    :to="gotoPath(menu, child)"
                    class="block w-full p-2"
                    @click="handleClick(child)"
                  >{{ child.title }}</NuxtLinkLocale>
                </div>
              </AccordionContent>
            </AccordionPanel>
          </template>
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

const handleClick = (child) => {
  if (child?.click) {
    child.click()
  }
  modelValue.value = false
}

function gotoPath(menu, child) {
  return `/${menu.value}/${child.value}`
}

const route = useRoute()

watch(() => route.path, () => {
  modelValue.value = false
})
</script>

<style scoped lang="scss">
.rx-accordion {
  :deep(.p-accordionpanel) {
    border-bottom: none;
  }
  
  :deep(.p-accordionheader) {
    padding: 16px 20px;
    color: #000;
    font-family: Archivo;
    font-size: 16px;
    font-weight: 500;
  }
}
</style>