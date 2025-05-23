import { ref } from 'vue';

export const lang = ref<'zh' | 'en' | 'ru'>('en');

export const scrollYProgress = ref(0); 

export const scrollbarOffsetY = ref(0)

export const theme = ref<'light' | 'dark'>('light');

export const blendModeForHeader = ref<'light' | 'dark'>('dark');

export const blendModeForBackTop = ref<'light' | 'dark'>('dark');