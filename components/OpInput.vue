
<script setup>
    const props = defineProps({
        value: String,
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
    <span class="op-symbol" :class="{selected: selected}">{{ value }}</span>
</template>

<style scoped>
.op-symbol {
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

.op-symbol:hover:not(.selected) {
    border-style: solid;
}

.op-symbol.selected:hover {
    width: v-bind(config.size+config.unit);
    height: v-bind(config.size+config.unit);
    line-height: v-bind(config.size+config.unit);
    background-clip: padding-box;
    border-style: solid;
}

.op-symbol.selected {
    background-color: green;
    background-clip: padding-box;
    border-style: none;
    width: v-bind(config.size+6+'px');
    height: v-bind(config.size+6+'px');
    line-height: v-bind(config.size+6+'px');
    font-size: 20px;
}
</style>