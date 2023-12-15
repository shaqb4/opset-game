
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
        }
    })

</script>

<script>

</script>

<template>
    <div class="op-number" :class="{selected: selected, disabled: disabled}">{{ value }}</div>
</template>

<style lang="postcss" scoped>
.op-number {
    @apply border-black rounded-full border-dashed  font-bold align-middle flex items-center justify-center w-20 h-20 text-base border-[3px];
}

.op-number:hover:not(.selected):not(.disabled) {
    /* @apply border-solid;  */
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