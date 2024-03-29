
import type { log } from 'console';
<script setup>
import { useGameStore } from '~/store/game'
import { storeToRefs } from 'pinia'
import { OpSetBoardGenerator, OpSetBoardConfig } from '~/lib/opSetBoardGenerator'

const game = useGameStore();

const { gameScore, solutions, target, digits, digitBoardIds, ops, expression, isDigitSelected, isOpSelected, isDigitDisabled, completedActions, solutionActions } = storeToRefs(game);


let gameSettings = reactive({
    boardSize: 6,
    minNumber: 1,
    maxNumber: 25,
    minOpCount: 3,
    chanceOfOp: 33,
    minTargetValue: 150,
    maxTargetValue: 999
});

let boardGenConfig = new OpSetBoardConfig(gameSettings.boardSize, gameSettings.minNumber, gameSettings.maxNumber, gameSettings.minOpCount, gameSettings.chanceOfOp, gameSettings.minTargetValue, gameSettings.maxTargetValue);
let boardGenerator = new OpSetBoardGenerator(boardGenConfig);

const iconClassMap = {
    "i-gravity-ui-plus": "i-gravity-ui-plus",
    "i-gravity-ui-minus": "i-gravity-ui-minus",
    "i-gravity-ui-xmark": "i-gravity-ui-xmark",
    "i-tabler-divide": "i-tabler-divide"
}

let isLoading = ref(false);


const digitBoard = computed(() => {
    return digitBoardIds.value.map((digId) => digits.value.get(digId));
});

let showTimedOutMessage = ref(false);

watch(gameScore, (newGameScore) => {
    if (newGameScore === 5) {
        submit_modal.showModal();
    }
})

function generateNewGame() {
    isLoading.value = true;
    showTimedOutMessage.value = false;
    const worker = new Worker('/generatorWorker.js', { type: "module" });
    let timoutId = setTimeout(() => {
        worker.terminate();
        console.log('Timed out...');
        isLoading.value = false;
        showTimedOutMessage.value = true;
    }, 5000);

    worker.postMessage({
        boardConfig: boardGenConfig
    });

    worker.onmessage = (event) => {
        game.generateGame(event.data.board);
        isLoading.value = false;
        worker.terminate();
        clearTimeout(timoutId);
    };
}

function applyGameSettings() {
    settings_modal.close();
    boardGenConfig = new OpSetBoardConfig(gameSettings.boardSize, gameSettings.minNumber, gameSettings.maxNumber, gameSettings.minOpCount, gameSettings.chanceOfOp, gameSettings.minTargetValue, gameSettings.maxTargetValue);
    boardGenerator = new OpSetBoardGenerator(boardGenConfig);

    generateNewGame();
}

generateNewGame();
</script>

<template>
    <div>
        <section class="flex flex-wrap justify-center">
            <div class="mb-2 space-y-3 w-full lg:w-2/3 flex justify-between">
                <div>
                    <button class="btn btn-primary" @click="generateNewGame()">New Game</button>
                </div>
                <div>
                    <div class="tooltip" :class="{'tooltip-disabled': showTimedOutMessage || solutionActions.length === 0}" data-tip="Solution">
                        <button class="btn btn-ghost btn-sm btn-square w-12 h-12 sm:w-8 sm:h-8" :class="{'btn-disabled': showTimedOutMessage || solutionActions.length === 0}" onclick="hint_modal.showModal()" aria-label="Game solution"><span class="i-tabler-bulb w-8 h-8 sm:w-6 sm:h-6 tooltip-icon"></span></button>
                    </div>
                    <dialog id="hint_modal" class="modal">
                        <div class="modal-box bg-gray-100">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <article class="prose">
                                <h2>Solution</h2>
                                <ol class="list-decimal text-green-600 text-lg">
                                    <li v-for="action in solutionActions">
                                        {{ action }}
                                    </li>
                                </ol>
                            </article>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button>Close</button>
                        </form>
                    </dialog>
                    <div class="tooltip" data-tip="Rules">
                        <button class="btn btn-ghost btn-sm btn-square w-12 h-12 sm:w-8 sm:h-8" onclick="info_modal.showModal()" aria-label="Game information"><span class="i-gravity-ui-circle-question-fill w-8 h-8 sm:w-6 sm:h-6"></span></button>
                    </div>
                    <dialog id="info_modal" class="modal">
                        <div class="modal-box bg-gray-100">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <article class="prose">
                                <h2>Rules</h2>
                                <h3>How to Play</h3>
                                <p>Calculate the target number using the given set of numbers and the mathematical operations <span class="i-gravity-ui-plus"></span>, <span class="i-gravity-ui-minus"></span>, <span class="i-gravity-ui-xmark"></span> and <span class="i-tabler-divide"></span>.</p>
                                <h3>Scoring</h3>
                                <p>
                                    Your score depends on how close you are to the target number. For example, let's say the target number is 200.
                                    An exact match will get you a perfect score of 5; 1 away would be a score of 4; within a 1% range (2 away in this example) would be a score of 3; within a 5% range (10 away) would be a score of 2; and 10% (20 away) would be a score of 1.
                                    Any farther from the target and your score is 0.
                                </p>
                            </article>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button>Close</button>
                        </form>
                    </dialog>
                    <div class="tooltip" data-tip="Settings">
                        <button class="btn btn-ghost btn-sm btn-square w-12 h-12 sm:w-8 sm:h-8" onclick="settings_modal.showModal()" aria-label="Game settings"><span class="i-mdi-cog w-8 h-8 sm:w-6 sm:h-6"></span></button>
                    </div>
                    <dialog id="settings_modal" class="modal">
                        <div class="modal-box bg-gray-100">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <div>
                                <h2 class="text-2xl font-bold">Settings</h2>
                                <div>
                                    <GameSettingsForm @submit.prevent="applyGameSettings"
                                        v-model:boardSize.number="gameSettings.boardSize" 
                                        v-model:minNumber.number="gameSettings.minNumber" 
                                        v-model:maxNumber.number="gameSettings.maxNumber" 
                                        v-model:minTargetValue.number="gameSettings.minTargetValue" 
                                        v-model:maxTargetValue.number="gameSettings.maxTargetValue" />
                                </div>
                            </div>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button>Close</button>
                        </form>
                    </dialog>
                </div>
            </div>
        </section>
        <section v-if="isLoading" class="flex flex-wrap justify-center">
            <div  class="w-full lg:w-2/3 min-h-fit flex justify-center">
                <span class="loading loading-spinner loading-lg"></span>
            </div>
        </section>
        <section v-else-if="showTimedOutMessage" class="flex flex-wrap justify-center">
            <div class="w-full lg:w-2/3 flex flex-col gap-8">
                <div role="alert" class="alert alert-error">
                    <div class="prose max-w-none">
                        <h3>Oops!</h3>
                        <p>
                            A new game couldn't be generated that matched your game settings. If game generation continues to fail, try making the settings broader.
                        </p>
                        <h3>Why did this happen?</h3>
                        <p>
                            Game boards are created by randomly generating numbers within the Number Range setting and randomly applying the <span class="i-gravity-ui-plus"></span>, <span class="i-gravity-ui-minus"></span>, <span class="i-gravity-ui-xmark"></span> and <span class="i-tabler-divide"></span> operations to these numbers. 
                            For lack of a better strategy, the generator simply keeps generating games until one is created with a target matching the Target Range setting. For most cases, this is pretty quick!
                            But sometimes, if you're unlucky, or if the game settings are very specific or hard to match, it may take a long time. Therefore, a hard limit of 5 seconds was set, after which you can either try again or change the settings.
                        </p>
                    </div>
                </div>
            </div>
        </section>
        <section v-else class="flex flex-wrap justify-center">
            <div class="w-full lg:w-2/3 flex flex-col gap-8">
                <div class="flex flex-col items-center pt-3">
                    <p class="text-4xl font-bold">{{ target }}</p>
                    <p>Score: {{ gameScore }}/5</p>
                </div>
                <div class="grid grid-cols-3-24 justify-center lg:grid-cols-6-22 gap-2 content-center">
                    <NumberInput v-for="(dig, index) in digitBoard" :key="`digit-${dig.id}`" :id="`digit-${dig.id}`" :value="dig.number" :selected="isDigitSelected(dig.id)" :disabled="isDigitDisabled(dig.id)" :active="dig.isActiveOnBoard" @click="game.selectDigit(dig)" />
                </div>
                <div class="grid grid-cols-6-12 gap-1 place-content-center ">
                    <OpButton class="" value="&circlearrowleft;" :disabled="!game.canRewind" @click="game.rewindHistory()" />
                    <OpInput v-for="[id, op] in ops" :id="`digit-${op.id}`" :value="op.operation" :selected="isOpSelected(op.id)" @click="game.selectOp(op.id)">
                        <span :class="`${iconClassMap[op.icon]}`"></span>
                    </OpInput>
                    <OpButton value="&circlearrowright;" :disabled="!game.canFastForward" @click="game.fastForwardHistory()" />
                </div>
                <div class="flex flex-col items-center pb-3">
                    <button class="btn btn-accent" onclick="submit_modal.showModal()">Submit</button>
                    <dialog id="submit_modal" class="modal">
                        <div class="modal-box bg-gray-100">
                            <form method="dialog">
                                <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                            </form>
                            <article class="prose">
                                <h2>You got {{ gameScore }} points!</h2>
                                <p>Would you like to start a new game?</p>
                                <form method="dialog">
                                    <button class="btn btn-primary" @click="generateNewGame()">New Game</button>
                                </form>
                            </article>
                        </div>
                        <form method="dialog" class="modal-backdrop">
                            <button>Close</button>
                        </form>
                    </dialog>
                </div>
            </div>
            <div class="divider after:bg-gray-200 before:bg-gray-200 w-full lg:w-2/3"></div> 
            <div class="w-full lg:w-2/3 space-y-3 py-3">
                <p class="">Actions</p>
                <ol class="list-decimal list-inside">
                    <li v-for="action in completedActions">
                        {{ action }}
                    </li>
                </ol>
            </div>
        </section>
        <section class="flex flex-wrap justify-center">
            
        </section>
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