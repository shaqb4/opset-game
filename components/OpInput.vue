
<script setup>
    const props = defineProps({
        value: String,
        selected: {
            type: Boolean,
            default: false
        }
    })

</script>

<script>

</script>

<template>
    <div class="op-symbol" :class="{selected: selected}">
        <slot />
    </div>
</template>

<style lang="postcss" scoped>
.op-symbol {
    @apply border-black rounded-full font-bold align-middle flex items-center justify-center w-12 h-12 text-base bg-black text-white;
}

.op-symbol:hover {
    @apply cursor-pointer;
}

.op-symbol.selected {
    @apply bg-[green];
}
</style>