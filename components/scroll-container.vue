<script setup lang="ts">
import BScroll from '@better-scroll/core'

const wrapperRef = useTemplateRef('wrapper')

let scroll: BScroll | null = null

requestIdleCallback(() => {
    scroll = new BScroll(wrapperRef.value, {
        scrollX: true,
        scrollY: false,
        click: true,
        probeType: 3,
        mouseWheel: true,
        disableMouse: false,
        disableTouch: false,
        // preventDefaultException: {
        //     tagName: /^(A|BUTTON)$/
        // }
    })
})

onBeforeUnmount(() => {
    scroll?.destroy()
})
</script>

<template>
    <div ref="wrapper">
        <slot />
    </div>
</template>