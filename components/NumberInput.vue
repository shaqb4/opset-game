<script setup>
    const props = defineProps({
        value: Number,
        disabled: {
            type: Boolean,
            default: false
        },
        selected: {
            type: Boolean,
            default: false
        },
        active: {
            type: Boolean,
            default: false
        }
    })

</script>

<template>
    <span class="op-number-wrapper" :class="{active: active}">
        <div class="op-number" :class="{selected: selected, disabled: disabled, active: active}">{{ value }}</div>
    </span>
</template>

<style lang="postcss" scoped>
.op-number-wrapper:not(.active) {
    @apply w-24 h-24;
}

.op-number {
    @apply border-black rounded-full border-dashed  font-bold align-middle flex items-center justify-center w-24 h-24 lg:w-22 lg:h-22 text-base border-[3px];
}

.op-number:not(.active) {
    @apply hidden;
}

.op-number:hover {
    @apply cursor-pointer;
}

.op-number.selected:not(.disabled) {
    @apply bg-[green] text-lg border-none;
}

.op-number.disabled {
    @apply border-gray-600 bg-gray-300 text-gray-600;
}

.op-number.disabled:hover {
    @apply cursor-not-allowed;
}
</style>