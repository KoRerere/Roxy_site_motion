<script setup lang="ts">

</script>

<template>
    <label class="lb-label">
        <slot></slot>
    </label>
</template>

<style lang="scss" scoped>
.lb-label {
    color: var(--Component-Colors-TextInput-label-label, #171C1F);
    
    font-size: 12px;
    font-style: normal;
    font-weight: 500;
    line-height: var(--Line-Height-text-lg, 20px); /* 166.667% */
}
</style>