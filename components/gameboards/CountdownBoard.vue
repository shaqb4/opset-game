
import type { log } from 'console';
<script setup>
import { useGameStore } from '~/store/game'
import { storeToRefs } from 'pinia'
import { OpSetBoardGenerator, OpSetBoardConfig } from '~/lib/opSetBoardGenerator'

const game = useGameStore();

const { gameScore, solutions, target, digits, digitBoardIds, ops, expression, isDigitSelected, isOpSelected, isDigitDisabled, completedActions, solutionActions } = storeToRefs(game);

let { timeLeft, isRunning, startTimer, stopTimer, updateTimerBy, resetTimer, setOnTimeOut } = useTimer(60000, 20);
let isGameOver = ref(false);
let totalScore = ref(0);


let timerDisplay = computed(() => {
    if (timeLeft.value < 10000) {
        return (timeLeft.value / 1000).toFixed(2);
    }

    return (timeLeft.value / 1000).toFixed(0);
});

setOnTimeOut(() => {
    totalScore.value += gameScore.value;
    isGameOver.value = true;
});

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

let soloGameBoards = ref([]);

async function generateNewBoards(boardCount, timeout) {
    return new Promise((resolve, reject) => {
        let genBoards = [];
        const worker = new Worker('/generatorWorker.js', { type: "module" });
    
        showTimedOutMessage.value = false;
        let timoutId = 0;
        if (timeout > 0) {
            timoutId = setTimeout(() => {
                worker.terminate();
                console.log('Timed out...');
                reject({
                    boards: [],
                    status: -1
                })
            }, timeout);
        }
    
        for (let i = 0; i < 10; i++) {
            worker.postMessage({
                boardConfig: boardGenConfig
            });
        }
    
        worker.onmessage = (event) => {
            genBoards.push(event.data.board);
            if (genBoards.length >= boardCount) {
                worker.terminate();
                if (timoutId !== 0) {
                    clearTimeout(timoutId);
                }
                resolve({
                    boards: genBoards,
                    status: 1
                })
            }
        };
    });
    
}

function generateNewGame() {
    stopTimer();
    isGameOver.value = false;
    isLoading.value = true;
    soloGameBoards.value = [];
    totalScore.value = 0;
    generateNewBoards(10, 20000)
        .then((response) => {
            soloGameBoards.value.push(...response.boards);
            console.log(`Have ${soloGameBoards.value.length} boards`);
            game.generateGame(soloGameBoards.value.pop());
            resetTimer();
        }).catch((err) => {
            showTimedOutMessage.value = true;
            console.error(err);
        }).finally(() => {
            isLoading.value = false;
        });
}

function restartGame() {
    isGameOver.value = false;
    totalScore.value = 0;
    resetTimer();
    let hasGeneratedNewBoard = false;
    if (soloGameBoards.value.length > 0) {
        game.generateGame(soloGameBoards.value.pop());
        hasGeneratedNewBoard = true;
        startTimer();
    }
    generateNewBoards(1, 0)
        .then((response) => {
            soloGameBoards.value.push(...response.boards);
            console.log(`Have ${soloGameBoards.value.length} boards`);
            if (!hasGeneratedNewBoard) {
                game.generateGame(soloGameBoards.value.pop());
                startTimer();
            }
        });
}


function applyGameSettings() {
    settings_modal.close();
    boardGenConfig = new OpSetBoardConfig(gameSettings.boardSize, gameSettings.minNumber, gameSettings.maxNumber, gameSettings.minOpCount, gameSettings.chanceOfOp, gameSettings.minTargetValue, gameSettings.maxTargetValue);
    boardGenerator = new OpSetBoardGenerator(boardGenConfig);

    generateNewGame();
}

function submitBoard() {
    totalScore.value += gameScore.value;
    updateTimerBy(gameScore.value * 1000 * 2);
    let hasGeneratedNewBoard = false;
    if (soloGameBoards.value.length > 0) {
        game.generateGame(soloGameBoards.value.pop());
        hasGeneratedNewBoard = true;
    }
    generateNewBoards(1, 0)
        .then((response) => {
            soloGameBoards.value.push(...response.boards);
            console.log(`Have ${soloGameBoards.value.length} boards`);
            if (!hasGeneratedNewBoard) {
                game.generateGame(soloGameBoards.value.pop());
            }
        });
}

watch(gameScore, (newGameScore) => {
    if (newGameScore === 5) {
        submitBoard();
    }
})

generateNewGame();
</script>

<template>
    <div>
        <section class="flex flex-wrap justify-center">
            <div class="mb-2 space-y-3 w-full lg:w-2/3 flex justify-end px-6 py-4">
                <div>
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
                                <p>Get as many points as possible before the timer runs out.</p>
                                <h3>The Timer</h3>
                                <p>Every time you complete or submit a board, time will be added to the timer based on your score for that board. The amount of seconds added is two times your score. If you reach the target number for a score of 5, then 10 seconds will be added to your time. If your score is 4, then 8 seconds will be added, and so on.</p>
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
                <div>
                    <p>Boards: {{ soloGameBoards.length }}/10</p>
                </div>
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
        <section v-else-if="!isRunning() && !isGameOver" class="flex flex-wrap justify-center">
            <div class="w-full lg:w-2/3 flex flex-col gap-8">
                <div class="flex flex-col items-center pb-3 gap-4">
                    <p>
                        Game boards have been generated. Ready to play.
                    </p>
                    <button class="btn btn-accent" @click="startTimer()">Start Game</button>
                </div>
            </div>
        </section>
        <section v-else class="flex flex-wrap justify-center">
            <div v-if="isGameOver" class="flex flex-col items-center pt-3">
                <div class="flex flex-col items-center pt-3 gap-4">
                    <p class="text-4xl font-semibold">{{ timerDisplay }}</p>
                    <p class="font-semibold">Total Score: {{ totalScore }}</p>
                    <button class="btn btn-accent" @click="restartGame()">Play Again</button>
                </div>
            </div>
            <template v-else>
                <div class="w-full lg:w-2/3 flex flex-col gap-8">
                    <div class="flex flex-col items-center pt-3">
                        <p class="text-4xl font-semibold">{{ timerDisplay }}</p>
                        <p class="font-semibold">Total Score: {{ totalScore }}</p>
                    </div>
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
                        <button class="btn btn-accent" @click="submitBoard()">Submit</button>
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
            </template>
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