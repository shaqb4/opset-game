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

const { solutions, target, digits, digitBoardIds, ops, expression, isDigitSelected, isOpSelected, isDigitDisabled, completedActions } = storeToRefs(game);

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

solverPool.queueSolverTask(board.numbers, board.target, 'SOLVE_ALL');
solverPool.beginNext();


game.generateGame(board);



const digitBoard = computed(() => {
    return digitBoardIds.value.map((digId) => digits.value.get(digId));
});

function generateNewGame() {
    let board = boardGenerator.generateBoard();
    game.generateGame(board);
    solverPool.clearQueue();
    solverPool.queueSolverTask(board.numbers, board.target, 'SOLVE_ALL');
    if (solverPool.isInProgress()) {
        solverPool.setAutoBeginNext(true);
        solverPool.stopCurrentTask();
    } else {
        solverPool.beginNext();
    }
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
    <div id="container">
        <header>
            <h1>Ops Game</h1>
        </header>
        <main>
            <section>
                <p>Rules here</p>
                <button @click="generateNewGame()">New Game</button>
                <p>Number of solutions: {{ solutions.size }}</p>
            </section>
            <section class="">
                <div>
                    <p class="op-target">{{target}}</p>
                </div>
            </section>
            <section class="op-row">
                <div>
                    <NumberInput v-for="(dig, index) in digitBoard" :id="`digit-${dig.id}`" :value="dig.number" :selected="isDigitSelected(dig.id)" :disabled="isDigitDisabled(dig.id)" @click="selectDigit(dig.id)" />
                </div>
            </section>
            <section class="op-row">
                <div>
                    <OpButton value="&circlearrowleft;" :disabled="!game.canRewind" @click="game.rewindHistory()" />
                    <OpInput v-for="[id, op] in ops" :id="`digit-${op.id}`" :value="op.operation" :selected="isOpSelected(op.id)" @click="selectOp(op.id)" />
                    <OpButton value="&circlearrowright;" :disabled="!game.canFastForward" @click="game.fastForwardHistory()" />
                </div>
            </section>
            <section class="op-row">
                <p v-for="action in completedActions">
                    {{ action }}
                </p>
            </section>
        </main>
        <footer>
            
        </footer>
    </div>
</template>

<style scoped>
#container {
    height: calc(100vh - 16px);
    margin: 0;
    display: grid;
    gap: 20px;
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr auto;
    grid-template-areas: 
        "header"
        "main"
        "footer"
    ;
}

header {
    grid-area: header;
    min-height: 100px;
}

main {
    grid-area: main;
}

footer {
    grid-area: footer;
    min-height: 150px;
}

.op-row {
    margin-top: 50px;
    margin-bottom: 50px;
}

.op-row > div {
    display: flex;
    gap: 20px;
}
.op-target {
    font-size: 96px;
    margin: 0px;
}
</style>