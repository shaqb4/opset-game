
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

    const config = {
        size: 60,
        unit: 'px'
    }

</script>

<script>

</script>

<template>
    <span class="op-number" :class="{selected: selected, disabled: disabled}">{{ value }}</span>
</template>

<style scoped>
.op-number {
    display: inline-block;
    border-radius: 50%;
    border-style: dashed;
    border-width: 3px;
    width: v-bind(config.size+config.unit);
    height: v-bind(config.size+config.unit);
    line-height: v-bind(config.size+config.unit);
    text-align: center;
    font-weight: bold;
    font-size: 16px;
}

.op-number:hover:not(.selected):not(.disabled) {
    border-style: solid;
}

.op-number.selected:hover:not(.disabled) {
    width: v-bind(config.size+config.unit);
    height: v-bind(config.size+config.unit);
    line-height: v-bind(config.size+config.unit);
    background-clip: padding-box;
    border-style: solid;
}

.op-number.selected:not(.disabled) {
    background-color: green;
    background-clip: padding-box;
    border-style: none;
    width: v-bind(config.size+6+'px');
    height: v-bind(config.size+6+'px');
    line-height: v-bind(config.size+6+'px');
    font-size: 20px;
}

.op-number.disabled {
    border-color: gray;
    background-color: lightgray;
    color: gray;
}

.op-number.disabled:hover {
    cursor: not-allowed;
}
</style>