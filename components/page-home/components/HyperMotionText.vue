<template>
    <component :is="tag">
        {{ displayText }}
    </component>
</template>

<script setup>
import { ref, computed, onMounted, watch, defineProps, onUnmounted } from 'vue';

const props = defineProps({
    tag: {
        type: String,
        default: 'span'
    },
    text: {
        type: String,
        default: 'Hello World'
    },
    typingSpeed: {
        type: Number,
        default: 100
    },
    randomText: {
        type: String,
        default: 'abcdefghijklmnopqrstuvwxyz0123456789'
    },
    randomRefreshSpeed: {
        type: Number,
        default: 50
    }
});

const displayText = ref('');
const typingIndex = ref(0);
const revealIndex = ref(-1);
let typingTimer = null;
let randomizeTimer = null;

// 计算原始文本的字符数
const textLength = computed(() => props.text.length);
// 计算1/3阈值
const oneThirdLength = computed(() => Math.floor(textLength.value / 3));

// 获取随机字符
const getRandomChar = () => {
    const randomIndex = Math.floor(Math.random() * props.randomText.length);
    return props.randomText[randomIndex];
};

// 生成当前应该显示的文本
const generateCurrentText = () => {
    let result = '';
    
    for (let i = 0; i < typingIndex.value; i++) {
        if (i <= revealIndex.value) {
            // 已经确定显示原始字符
            result += props.text[i];
        } else {
            // 显示随机字符
            result += getRandomChar();
        }
    }
    
    return result;
};

// 随机化当前显示文本中的字符，保留已显示的原始字符
const randomizeDisplayText = () => {
    displayText.value = generateCurrentText();
};

// 设置随机化定时器
const startRandomizing = () => {
    stopRandomizing();
    randomizeTimer = setInterval(randomizeDisplayText, props.randomRefreshSpeed);
};

// 停止随机化
const stopRandomizing = () => {
    if (randomizeTimer) {
        clearInterval(randomizeTimer);
        randomizeTimer = null;
    }
};

// 打字效果：增加字符
const typeText = () => {
    if (typingIndex.value < textLength.value) {
        typingIndex.value++;
        randomizeDisplayText();
        
        // 当打印到1/3长度时，开始显示原始字符
        if (typingIndex.value >= oneThirdLength.value && revealIndex.value === -1) {
            startRevealingOriginalText();
        }
        
        typingTimer = setTimeout(typeText, props.typingSpeed);
    }
};

// 开始显示原始字符
const startRevealingOriginalText = () => {
    revealIndex.value = 0;
    revealNextChar();
};

// 逐个显示原始字符
const revealNextChar = () => {
    if (revealIndex.value < textLength.value - 1) {
        setTimeout(() => {
            revealIndex.value++;
            randomizeDisplayText();
            revealNextChar();
        }, props.typingSpeed);
    }
};

// 重新开始打字效果
const restartTyping = () => {
    // 清除所有定时器
    if (typingTimer) clearTimeout(typingTimer);
    stopRandomizing();
    
    // 重置状态
    typingIndex.value = 0;
    revealIndex.value = -1;
    displayText.value = '';
    
    // 开始动画效果
    startRandomizing();
    typeText();
};

// 监听参数变化时重新开始打字效果
watch(() => props.text, restartTyping);
watch(() => props.typingSpeed, restartTyping);
watch(() => props.randomText, restartTyping);
watch(() => props.randomRefreshSpeed, restartTyping);

// 组件挂载时开始打字效果
onMounted(() => {
    startRandomizing();
    typeText();
});

// 组件卸载时清理定时器
onUnmounted(() => {
    if (typingTimer) clearTimeout(typingTimer);
    stopRandomizing();
});
</script>

<style scoped>
.hyper-motion-text {
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    font-family: 'Chivo Mono', monospace;
    background-color: #000;
    color: #fff;
    font-size: 24px;
    text-align: center;
}
</style>