<script setup>
import { computed } from 'vue'
import NumberInput from '~/components/NumberInput'
import OpInput from '~/components/OpInput'
import OpButton from '~/components/OpButton'
import { useGameStore } from '~/store/game'
import { storeToRefs } from 'pinia'
import { OpSetSolutionSolver } from '~/lib/solutionSolver.js'
import { SolverPool } from "~/lib/solverPool"

const game = useGameStore();

if (process.client) {

    console.log(`main crossOriginIsolated: ${crossOriginIsolated}`)
    let numbers = [ 6, 8, 8, 11, 11, 23 ];
    let target = 145728;
    
    let solverPool = new SolverPool();
    solverPool.setOnCompletion((opset) => {
        console.log(`Finished generating solutions for numbers: ${opset.numbers} and target: ${opset.target}`);
        console.log(`Duration: ${opset.end - opset.start} ms`);
        console.log(`Solutions:`);
        console.log(new Array(...opset.solutions));
        solverPool.beginNext();
    });
    solverPool.generateSolutions(numbers, target);
    
    numbers = [ 3, 4, 6, 15, 20, 21 ];
    target = 96;
    
    solverPool.generateSolutions(numbers, target);
    
    numbers = [ 1, 7, 9, 14, 19, 22 ];
    target = 470;
    
    solverPool.generateSolutions(numbers, target);
    solverPool.beginNext();
}




// let rangeMapper = new Map();
// rangeMapper.set('0', 0);
// rangeMapper.set('1-10', 0);
// rangeMapper.set('11-40', 0);
// rangeMapper.set('41-80', 0);
// rangeMapper.set('81-200', 0);
// rangeMapper.set('201+', 0);
// const solver = new OpSetSolutionSolver(6);
// for (let i = 0; i < 1; i++) {
//     if (i % 500 === 0) {
//         console.log(i);
//     }
//     solver.regenerate();
//     const solution = solver.solve();
//     if (solution.size === 0) {
//         rangeMapper.set('0', rangeMapper.get('0') + 1);
//         console.log('0: ');
//         console.log(solver.target);
//         console.log(solver.digits);
//     } else if (solution.size >= 1 && solution.size <= 10) {
//         rangeMapper.set('1-10', rangeMapper.get('1-10') + 1);
//     } else if (solution.size >= 11 && solution.size <= 40) {
//         rangeMapper.set('11-40', rangeMapper.get('11-40') + 1);
//     } else if (solution.size >= 41 && solution.size <= 80) {
//         rangeMapper.set('41-80', rangeMapper.get('41-80') + 1);
//     } else if (solution.size >= 81 && solution.size <= 200) {
//         rangeMapper.set('81-200', rangeMapper.get('81-200') + 1);
//     } else if (solution.size >= 201) {
//         rangeMapper.set('201+', rangeMapper.get('201+') + 1);
//     }
// }
// console.log(rangeMapper);


//console.log(solution);

game.generateGame(8);

const { digits, digitBoardIds, ops, expression, isDigitSelected, isOpSelected, isDigitDisabled } = storeToRefs(game);

const digitBoard = computed(() => {
    return digitBoardIds.value.map((digId) => digits.value.get(digId));
});

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
            <section class="op-row">
                <div>
                    <p class="op-target">145728</p>
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
        </main>
        <footer>
            <p>Rules here</p>
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
}
</style>