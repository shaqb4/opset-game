import { defineStore } from 'pinia'

class OpsetDigitGenerator {
    constructor() {
    }

    createSingle(id, number) {
        return {
            id,
            number
        }
    }
}

class OpsetOpGenerator {
    constructor() {
    }

    createSingle(id, operation) {
        return {
            id,
            operation
        }
    }

    createSet(...operations) {
        const operationMap = new Map();
        for (let [index, op] of operations.entries()) {
            const operation = this.createSingle(index, op);
            operationMap.set(operation.id, operation);
        }
        return operationMap;
    }
}

class OpsetExpressionGenerator {
    static create() {
        return {
            left: null,
            op: null,
            right: null
        }
    }
}

export const useGameStore = defineStore('game', {
    state: () => ({
        solutions: new Set(),
        target: 0,
        digitIdSeq: 0,
        digits: new Map(),
        digitBoardIds: [],
        // Cache which operations have already been done so that i.e. 1+6 -> undo -> 1+6 doesn't create a new digit each time 1+6 is carried out. Just fetch the previously created digit based on id
        digitExpIdMap: new Map(),
        ops: new Map(),
        expression: OpsetExpressionGenerator.create(),
        history: {
            index: -1,
            actions: []
        }
    }),
    getters: {
        canFastForward: (state) => {
            return state.history.index + 1 < state.history.actions.length;
        },
        canRewind: (state) => {
            return state.history.index >= 0;
        },
        isDigitSelected: (state) => {
            return (digitId) => state.expression.left === digitId || state.expression.right === digitId;
        },
        isOpSelected: (state) => {
            return (opId) => state.expression.op === opId;
        },
        isDigitDisabled: (state) => {
            return (digitId) => {
                if (state.expression.left === null || state.expression.op === null) {
                    return false;
                }

                let result = -1;
                switch (state.ops.get(state.expression.op).operation) {
                    case '-':
                        result = state.digits.get(state.expression.left).number - state.digits.get(digitId).number;
                        break;
                    case '/':
                        result = state.digits.get(state.expression.left).number / state.digits.get(digitId).number;
                        break;
                    default:
                        return false;
                }

                // If completing the operation would be negatve or non-integer, disable this digit from being selected as
                // right operand
                if (result < 0 || !Number.isInteger(result)) {
                    return true;
                } else {
                    return false;
                }

            };
        },
        completedActions: (state) => {
            return state.history.actions.slice(0, state.history.index + 1).map(historyAction => historyAction.readableExpression)
        }
    },
    actions: {
        reset() {
            this.solutions.clear();
            this.target = 0;
            this.digitIdSeq = 0;
            this.digits.clear();
            this.digitBoardIds.length = 0;
            this.digitExpIdMap.clear();
            this.ops.clear();
            this.expression.left = null;
            this.expression.op = null;
            this.expression.right = null;
            this.history.index = -1;
            this.history.actions.length = 0;
        },
        createDigit(num, key) {
            if (key !== null && this.digitExpIdMap.has(key)) {
                return this.digits.get(this.digitExpIdMap.get(key));
            }
            const digitGenerator = new OpsetDigitGenerator();
            this.digitIdSeq++;
            const digit = digitGenerator.createSingle(this.digitIdSeq, num);
            this.digits.set(digit.id, digit);
            this.digitExpIdMap.set(key, digit.id);
            return digit;
        },
        generateGame(board) {
            this.reset();

            console.log('Generating game with board:');
            console.log(board);
            const opGenerator = new OpsetOpGenerator();
            this.ops = opGenerator.createSet('+', '-', '*', '/');
            
            this.solutions.add(board.generatedSolution);
            this.target = board.target;
            for (let num of board.numbers) {
                const digit = this.createDigit(num, null);
                this.digits.set(digit.id, digit);
                this.digitBoardIds.push(digit.id);
            }
        },
        setLeft(id) {
            if (id === null) {
                return;
            }

            this.expression.left = id;
        },
        unsetLeft() {
            this.expression.left = null;
        },
        setOp(id) {
            if (id === null) {
                return;
            }

            this.expression.op = id;
        },
        unsetOp() {
            this.expression.op = null;
        },
        setRight(id) {
            if (id === null) {
                return;
            }

            this.expression.right = id;
        },
        unsetRight() {
            this.expression.right = null;
        },
        unsetAll() {
            this.expression.left = null;
            this.expression.op = null;
            this.expression.right = null;
        },
        rewindHistory() {
            if (!this.canRewind) {
                return;
            }

            const action = this.history.actions[this.history.index];
            action.undo(this.digitBoardIds);
            this.history.index--;
            this.unsetAll();
        },
        fastForwardHistory() {
            if (!this.canFastForward) {
                return;
            }

            this.history.index++;
            const action = this.history.actions[this.history.index];
            action.execute(this.digitBoardIds);
            this.unsetAll();
        },
        evalExpression() {
            if (this.expression.left === null || this.expression.op === null || this.expression.right === null) {
                return;
            }

            let result = -1;
            switch (this.ops.get(this.expression.op).operation) {
                case '+':
                    result = this.digits.get(this.expression.left).number + this.digits.get(this.expression.right).number;
                    break;
                case '-':
                    result = this.digits.get(this.expression.left).number - this.digits.get(this.expression.right).number;
                    break;
                case '*':
                    result = this.digits.get(this.expression.left).number * this.digits.get(this.expression.right).number;
                    break;
                case '/':
                    result = this.digits.get(this.expression.left).number / this.digits.get(this.expression.right).number;
                    break;
                default:
                    console.log(`Invalid operation: ${this.expression.op}`);
                    return;
            }
            if (result !== -1) {
                const key = `${this.expression.left}|${this.expression.op}|${this.expression.right}`;
                const newDigit = this.createDigit(result, key);

                const rightId = this.expression.right;
                const leftId = this.expression.left;
                const rightIndex = this.digitBoardIds.indexOf(this.expression.right);
                const leftIndex = this.digitBoardIds.indexOf(this.expression.left);

                const expressionString = `${this.digits.get(this.expression.left).number} ${this.ops.get(this.expression.op).operation} ${this.digits.get(this.expression.right).number} = ${result}`;
                
                const historyItem = {
                    operation: [this.expression.left, this.expression.op, this.expression.right],
                    readableExpression: expressionString,
                    execute(digitBoardIds) {
                        digitBoardIds[rightIndex] = newDigit.id;
                        digitBoardIds.splice(leftIndex, 1);
                    },
                    undo(digitBoardIds) {
                        digitBoardIds.splice(leftIndex, 0, leftId);
                        digitBoardIds[rightIndex] = rightId;
                    }
                };
                this.history.actions.length = this.history.index + 1;
                this.history.actions.push(historyItem);
                this.fastForwardHistory();
            }

            this.unsetAll();
        }
    }
})