<script setup>
    const props = defineProps({
        boardSize: {
            type: Number,
            default: 6
        },
        minNumber: {
            type: Number,
            default: 1
        },
        maxNumber: {
            type: Number,
            default: 25
        },
        minTargetValue: {
            type: Number,
            default: 150
        },
        maxTargetValue: {
            type: Number,
            default: 999
        }
    });

    defineEmits(["update:boardSize", "update:minNumber", "update:maxNumber", "update:minTargetValue", "update:maxTargetValue"]);
</script>

<template>
    <div>
        <form class="flex flex-col w-full">
            <div class="game-settings-field">
                <label class="form-control w-full max-w-xs">
                    <div class="label">
                        <span class="label-text text-lg font-semibold">Board Size</span>
                    </div>
                    <input id="boardSize" class="input input-bordered" type="number" min="3" max="24" :value="boardSize" @input="$emit('update:boardSize', $event.target.value)" required/>
                </label>
            </div>
            <div class="game-settings-field-group">
                <div class="label label-group">
                    <span class="label-text text-lg font-semibold">Number Range</span>
                </div>
                <div class="game-settings-field">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-sm font-semibold">Min</span>
                        </div>
                        <input id="minNumber" class="input input-bordered max-w-xs" type="number" :min="1" :value="minNumber" @input="$emit('update:minNumber', $event.target.value)" required/>
                    </label>
                </div>
                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-sm font-semibold">Max</span>
                        </div>
                        <input id="maxNumber" class="input input-bordered max-w-xs" type="number" :min="minNumber" :value="maxNumber" @input="$emit('update:maxNumber', $event.target.value)" required/>
                    </label>
                </div>
            </div>
            <div class="game-settings-field-group">
                <div class="label label-group">
                    <span class="label-text text-lg font-semibold">Target Range</span>
                </div>
                <div class="game-settings-field">
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-sm font-semibold">Min</span>
                        </div>
                        <input id="minTargetValue" class="input input-bordered max-w-xs" type="number" :min="maxNumber + 1" :value="minTargetValue" @input="$emit('update:minTargetValue', $event.target.value)" required/>
                    </label>
                </div>
                <div>
                    <label class="form-control w-full">
                        <div class="label">
                            <span class="label-text text-sm font-semibold">Max</span>
                        </div>
                        <input id="maxTargetValue" class="input input-bordered max-w-xs" type="number" :min="minTargetValue" :value="maxTargetValue" @input="$emit('update:maxTargetValue', $event.target.value)" required/>
                    </label>
                </div>
            </div>
            <div>
                <button type="submit" class="btn btn-primary">Apply Settings</button>
            </div>
        </form>
    </div>
</template>

<style lang="postcss" scoped>
.game-settings-field, .game-settings-field-group {
    @apply flex flex-col mb-4;
}

.game-settings-field-group > .game-settings-field {
    @apply flex flex-col mb-0;
}

.game-settings-field-group > .label.label-group {
    @apply pb-0;
}
</style>