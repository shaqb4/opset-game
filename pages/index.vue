<script setup>
import { computed } from 'vue'
import NumberInput from '~/components/NumberInput'
import OpInput from '~/components/OpInput'
import OpButton from '~/components/OpButton'
import { useGameStore } from '~/store/game'
import { storeToRefs } from 'pinia'
import { OpSetSolutionSolver } from '~/lib/solutionSolver'
import { SolverPool } from "~/lib/solverPool"
import { OpSetBoardGenerator, OpSetBoardConfig } from '~/lib/opSetBoardGenerator'

const game = useGameStore();

const { gameScore, solutions, target, digits, digitBoardIds, ops, expression, isDigitSelected, isOpSelected, isDigitDisabled, completedActions, solutionActions } = storeToRefs(game);

let boardGenConfig = new OpSetBoardConfig(6, 25, 3, 33);
let boardGenerator = new OpSetBoardGenerator(boardGenConfig);

    let solverPool = new SolverPool();
    solverPool.setOnCompletion((opset) => {
        console.log(`Finished generating solutions for numbers: ${opset.numbers} and target: ${opset.target}`);
        console.log(`Duration: ${opset.end - opset.start} ms`);
        console.log(`Solutions:`);
        console.log(opset.solutions)
        solutions.value.clear();
        for (let solution of opset.solutions) {
            solutions.value.add(solution);
        }
    });
    
    // console.log(`main crossOriginIsolated: ${crossOriginIsolated}`)
    // let numbers = [ 6, 8, 8, 11, 11, 23 ];
    // let target = 145728;
    
    let board = boardGenerator.generateBoard();
    
    // solverPool.queueSolverTask(board.numbers, board.target, 'SOLVE_ALL');
    // solverPool.beginNext();
    
    
    game.generateGame(board);


const iconClassMap = {
    "i-gravity-ui-plus": "i-gravity-ui-plus",
    "i-gravity-ui-minus": "i-gravity-ui-minus",
    "i-gravity-ui-xmark": "i-gravity-ui-xmark",
    "i-tabler-divide": "i-tabler-divide"
}

let viewSolution = ref(false);

watch(gameScore, (newGameScore) => {
    if (newGameScore === 10) {
        submit_modal.showModal();
    }
})

const digitBoard = computed(() => {
    return digitBoardIds.value.map((digId) => digits.value.get(digId));
});

function generateNewGame() {
    let board = boardGenerator.generateBoard();
    viewSolution.value = false;
    game.generateGame(board);
    // solverPool.clearQueue();
    // solverPool.queueSolverTask(board.numbers, board.target, 'SOLVE_ALL');
    // if (solverPool.isInProgress()) {
    //     solverPool.setAutoBeginNext(true);
    //     solverPool.stopCurrentTask();
    // } else {
    //     solverPool.beginNext();
    // }
}

function selectDigit(id) {
    if (isDigitDisabled.value(id)) {
        return;
    }

    if (expression.value.left === null) {
        game.setLeft(id);
    } else if (expression.value.op === null) {
        if (id === expression.value.left) {
            game.unsetLeft();
        } else {
            game.setLeft(id);
        }
    } else if (expression.value.right === null) {
        if (id === expression.value.left) {
            game.unsetLeft();
            game.unsetOp();
        } else {
            game.setRight(id);
            //Evaluate expression
            game.evalExpression();
        }
    }
}

function selectOp(id) {
    if (expression.value.op === null) {
        game.setOp(id);
    } else {
        if (id === expression.value.op) {
            game.unsetOp();
        } else {
            game.setOp(id);
        }
    }
}
</script>

<template>
    <div role="tablist" class="tabs tabs-lifted">
        <input type="radio" name="opset_tabs" role="tab" class="tab min-w-max" aria-label="Play" checked />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">
            <section class="flex flex-wrap justify-center">
                <div class="mb-2 space-y-3 w-full lg:w-2/3 flex justify-between">
                    <div>
                        <button class="btn btn-primary" @click="generateNewGame()">New Game</button>
                    </div>
                    <div>
                        <div class="tooltip" data-tip="Solution">
                            <button class="btn btn-ghost btn-sm btn-square" onclick="hint_modal.showModal()"><span class="i-tabler-bulb w-6 h-6"></span></button>
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
                            <button class="btn btn-ghost btn-sm btn-square" onclick="info_modal.showModal()"><span class="i-gravity-ui-circle-info-fill w-6 h-6"></span></button>
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
                                        Your score depends on how close you are to the target number, based on what percentage your closest number is to the target. For example, pretend the target number is 100.
                                        An exact match would be a perfect score of 10, while a closest number of 90-99 would be a score of 9, 80-89 would be 8, etc.
                                        Note this is a work in progress, so the scoring system may change in the future.
                                    </p>
                                </article>
                            </div>
                            <form method="dialog" class="modal-backdrop">
                                <button>Close</button>
                            </form>
                        </dialog>
                        <div class="tooltip" data-tip="Settings">
                            <button class="btn btn-ghost btn-sm btn-square" onclick="settings_modal.showModal()"><span class="i-mdi-cog w-6 h-6"></span></button>
                        </div>
                        <dialog id="settings_modal" class="modal">
                            <div class="modal-box bg-gray-100">
                                <form method="dialog">
                                    <button class="btn btn-sm btn-circle btn-ghost absolute right-2 top-2">✕</button>
                                </form>
                                <article class="prose">
                                    <h2>Settings</h2>
                                    <p>Game settings will appear here. Check back soon.</p>
                                </article>
                            </div>
                            <form method="dialog" class="modal-backdrop">
                                <button>Close</button>
                            </form>
                        </dialog>
                    </div>
                </div>
                <div class="w-full lg:w-2/3 flex flex-col gap-8">
                    <div class="flex flex-col items-center pt-3">
                        <p class="text-4xl font-bold">{{ target }}</p>
                        <p>Score: {{ gameScore }}/10</p>
                    </div>
                    <div class="grid grid-cols-3-20 lg:grid-cols-6-20 gap-2 place-content-center">
                        <NumberInput v-for="(dig, index) in digitBoard" :key="`digit-${dig.id}`" :id="`digit-${dig.id}`" :value="dig.number" :selected="isDigitSelected(dig.id)" :disabled="isDigitDisabled(dig.id)" @click="selectDigit(dig.id)" />
                    </div>
                    <div class="grid grid-cols-6-12 gap-1 place-content-center ">
                        <OpButton class="" value="&circlearrowleft;" :disabled="!game.canRewind" @click="game.rewindHistory()" />
                        <OpInput v-for="[id, op] in ops" :id="`digit-${op.id}`" :value="op.operation" :selected="isOpSelected(op.id)" @click="selectOp(op.id)">
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
            </section>
            <section class="flex flex-wrap justify-center">
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
        </div>

        <input type="radio" name="opset_tabs" role="tab" class="tab min-w-max" aria-label="Solution Generator" />
        <div role="tabpanel" class="tab-content bg-base-100 border-base-300 rounded-box p-6">Tab content 2</div>
    </div>
</template>

<style  scoped>

</style>