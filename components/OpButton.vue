
<script setup>
    const props = defineProps({
        value: String,
        disabled: {
            type: Boolean,
            default: false
        }
    })

    const config = ref({
            size: 66,
            unit: 'px'
        });

</script>

<script>

</script>

<template>
    <button class="op-button" :class="{disabled: disabled}">{{ value }}</button>
</template>

<style scoped>
.op-button {
    display: inline-block;
    border-radius: 50%;
    border-style: solid;
    border-width: 3px;
    border-color: black;
    width: v-bind(config.size+config.unit);
    height: v-bind(config.size+config.unit);
    font-weight: bold;
    font-size: 16px;
    background-color: transparent;
}

.op-button:hover:not(.disabled) {
    background-color: rgb(250, 192, 192);
}

.op-button:active:not(.disabled) {
    background-color: rgb(250, 192, 192);
    font-size: 20px;
}

.op-button.disabled {
    border-color: gray;
    background-color: lightgray;
    color: gray;
}

.op-button.disabled:hover {
    cursor: not-allowed;
}
</style>