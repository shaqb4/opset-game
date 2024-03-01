<script setup>

</script>

<template>
    <div class="p-6 w-full" >
        <CountdownBoard />
    </div>
</template>

<style lang="postcss" scoped>
    .tooltip-disabled:hover {
        @apply cursor-not-allowed;
    }

    .tooltip > .btn-disabled > .tooltip-icon {
        @apply bg-gray-300;
    }
</style>