<script setup>

</script>

<template>
    <div role="tablist" class="tabs tabs-lifted">
        <input type="radio" name="opset_tabs" role="tab" class="tab min-w-max" aria-label="Play" checked />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full">
            <PracticeBoard />
        </div>

        <input type="radio" name="opset_tabs" role="tab" class="tab min-w-max" aria-label="Solution Generator" />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6 w-full overflow-x-hidden">
            <SolutionGenerator />
        </div>
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