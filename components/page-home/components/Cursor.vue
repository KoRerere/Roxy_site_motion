<template>
    <div class="cursor"></div>
</template>

<style scoped>
.cursor {
    width: 4px;
    height: 26px;
    background-color: #fff;
    display: inline-block;
    margin-left: 4px;
    animation: blink 1s step-end infinite;
}

@keyframes blink {
    0% { opacity: 1; }
    50% { opacity: 0; }
    100% { opacity: 1; }
}
</style> 