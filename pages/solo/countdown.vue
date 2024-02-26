<script setup>

</script>

<template>
    <CountdownBoard />
</template>

<style lang="postcss" scoped>
    .tooltip-disabled:hover {
        @apply cursor-not-allowed;
    }

    .tooltip > .btn-disabled > .tooltip-icon {
        @apply bg-gray-300;
    }
</style>