
<script setup>
    const props = defineProps({
        value: String,
        disabled: {
            type: Boolean,
            default: false
        }
    })
</script>

<script>

</script>

<template>
    <button class="op-button" :class="{disabled: disabled}">{{ value }}</button>
</template>

<style lang="postcss" scoped>
.op-button {
    @apply rounded-full font-bold align-middle flex items-center justify-center w-12 h-12 text-base bg-black text-white;
}

.op-button:hover {
    @apply cursor-pointer;
}

.op-button:hover:not(.disabled) {
    @apply bg-red-300;
}

.op-button:active:not(.disabled) {
    @apply bg-red-300 text-xl;
}

.op-button.disabled {
    @apply bg-gray-300 text-gray-600;
}

.op-button.disabled:hover {
    @apply cursor-not-allowed;
}
</style>