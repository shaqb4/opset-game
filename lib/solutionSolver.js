import { Permutations } from '~/lib/permutations'
import { Combinations } from '~/lib/combinations'

class Node {
    constructor(parent, viaOp, value, isRoot = false) {
        this.parent = parent;
        this.viaOp = viaOp;
        this.value = value;
        this.result = isRoot ? value : -1;
        this.plus = null;
        this.minus = null;
        this.times = null;
        this.divide = null;
    }

    setPlus(parent, num) {
        this.plus = new Node(parent, '+', num);
        this.plus.result = this.result + num;
        return true;
    }

    setMinus(parent, num) {
        this.minus = new Node(parent, '-', num);
        if (num > this.result) {
            this.minus.result = -2;
            return false;
        }
        this.minus.result = this.result - num;
        return true;
    }

    setTimes(parent, num) {
        this.times = new Node(parent, '*', num);
        this.times.result = this.result * num;
        return true;
    }

    setDivide(parent, num) {
        const res = this.result / num;
        this.divide = new Node(parent, '/', num);
        if (!Number.isInteger(res)) {
            this.divide.result = -2;
            return false;
        }
        this.divide.result = res;
        return true;
    }
}

class OpSetSolutionSolver {
    constructor(size) {
        this.size = size;
    }

    solutionToOps(solutionLeaf) {
        let ops = [];
        do {
            switch (solutionLeaf.viaOp) {
                case '+':
                    ops.push(`${solutionLeaf.result} - ${solutionLeaf.value} = ${solutionLeaf.result - solutionLeaf.value}`);
                    break;
                case '-':
                    ops.push(`${solutionLeaf.result} + ${solutionLeaf.value} = ${solutionLeaf.result + solutionLeaf.value}`);
                    break;
                case '*':
                    ops.push(`${solutionLeaf.result} / ${solutionLeaf.value} = ${solutionLeaf.result / solutionLeaf.value}`);
                    break;
                case '/':
                    ops.push(`${solutionLeaf.result} * ${solutionLeaf.value} = ${solutionLeaf.result * solutionLeaf.value}`);
                    break;
            }
            solutionLeaf = solutionLeaf.parent;
        } while (solutionLeaf !== null)

        return ops;
    }

    *generatePermutations() {
        let copy = [...this.digits];
        let length = copy.length;
        let c = [];
        for (let i = 0; i < length; i++) {
            c[i] = 0;
        }

        yield copy;

        let index = 1;
        while (index < length) {
            if (c[index] < index) {
                if (index % 2 === 0) {
                    let temp = copy[0];
                    copy[0] = copy[index];
                    copy[index] = temp;
                } else {
                    let temp = copy[c[index]];
                    copy[c[index]] = copy[index];
                    copy[index] = temp;
                }
                yield copy;

                c[index]++;

                index = 1;
            } else {
                c[index] = 0;
                index++;
            }
        }
    }

    regenerate() {
        let numbers = [];
        let result = -1;
        for (let i = 0; i < this.size; i++) {
            let num = Math.floor(Math.random() * 25) + 1;
            numbers.push(num);
            if (result === -1) {
                result = num;
            } else {
                let doOp = Math.floor(Math.random() * 100);
                if (doOp > 30) {
                    let op = Math.floor(Math.random() * 4);
                    switch(op) {
                        case 0:
                            result += num;
                            break;
                        case 1:
                            result *= num;
                            break;
                        case 2:
                            if (result - num > 0) {
                                result -= num;
                            }
                            break;
                        case 3:
                            if (Number.isInteger(result / num)) {
                                result /= num;
                            }
                            break;
                    }
                }
            }
        }
        numbers.sort((a, b) => a - b);
        this.digits = numbers;
        this.target = result;
    }

    solve() {
        // console.log(`solutions to ${this.digits} targeting ${this.target}: `);
        let solutions = [];
        let n = 0;
        for (const perm of this.generatePermutations()) {
            let remainingDigits = new Map();
            for (let num of perm) {
                remainingDigits.set(num, true);
            }
            const root = new Node(null, null, this.target, true);
            let leaf = root;
            let depth = 0;
    
            while (depth >= 0 && depth < perm.length) {
                n++;
                if (depth >= perm.length - 1) {
                    depth--;
                    remainingDigits.set(leaf.value, true);
                    leaf = leaf.parent;
                }

                if (leaf.minus === null) {
                    if (leaf.setMinus(leaf, perm[depth])) {
                        leaf = leaf.minus;
                        depth++;
                        remainingDigits.set(leaf.value, false);
                    } else {
                        continue;
                    }
                } else if (leaf.divide === null) {
                    if (leaf.setDivide(leaf, perm[depth])) {
                        leaf = leaf.divide;
                        depth++;
                        remainingDigits.set(leaf.value, false);
                    } else {
                        continue;
                    }
                } else if (leaf.plus === null) {
                    if (leaf.setPlus(leaf, perm[depth])) {
                        leaf = leaf.plus;
                        depth++;
                        remainingDigits.set(leaf.value, false);
                    } else {
                        continue;
                    }
                } else if (leaf.times === null) {
                    if (leaf.setTimes(leaf, perm[depth])) {
                        leaf = leaf.times;
                        depth++;
                        remainingDigits.set(leaf.value, false);
                    } else {
                        continue;
                    }
                } else {
                    depth--;
                    remainingDigits.set(leaf.value, true);
                    leaf = leaf.parent;
                }

                if (leaf !== null && remainingDigits.get(leaf.result) === true) {
                    solutions.push(this.solutionToOps(leaf));
                }
            }
        }

        let distinctSolutions = new Set();
        if (solutions !== null) {
            solutions.sort((a, b) => a.length - b.length);
            for (let solution of solutions) {
                distinctSolutions.add(solution.join(','));
            }
        }
        return distinctSolutions;
    }
}

export { OpSetSolutionSolver };