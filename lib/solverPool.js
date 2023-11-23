import { PostFixConverter } from "~/lib/postFixConverter"
import { Permutations } from '~/lib/permutations'
import { Combinations } from '~/lib/combinations'
import { PostFixSolver } from '~/lib/postFixSolver'

class SolverPool {
    constructor() {
        this.maxPoolSize = navigator.hardwareConcurrency;
        this.postfixConverter = new PostFixConverter();
        this.distinctSolutions = new Set();
        this.isSolverInProgress = false;
        this.combos = new Combinations(['+', '-', '*', '/']);
        this.workers = [];
        this.initializeWorkers();
        this.start = null;
        this.end = null;
        this.onCompletion = null;
        this.queue = [];
    }

    initializeWorkers() {
        for (let i = 0; i < this.maxPoolSize; i++) {
            this.workers.push({
                worker: new Worker('/worker.js', { type: "module" }),
                isSolving: false
            });

            this.workers[i].worker.onmessage = (event) => {
                if (event.data.role === 'solution') {
                    let solution = this.postfixConverter.convertPostfixToExpressions(event.data.solution, event.data.target).join(',');
                    this.distinctSolutions.add(solution);
                } else if (event.data.role === 'done') {
                    this.workers[i].isSolving = false;
                    if (this.workers.every(wkr => wkr.isSolving === false)) {
                        this.isSolverInProgress = false;
                        this.end = performance.now();
                        this.onCompletion({
                            numbers: event.data.numbers,
                            target: event.data.target,
                            start: this.start,
                            end: this.end,
                            solutions: this.distinctSolutions
                        })
                    }
                }
            }
        }
    }

    setOnCompletion(completionAction) {
        this.onCompletion = completionAction;
    }

    isInProgress() {
        return this.isSolverInProgress;
    }

    generateSolutions(numbers, target) {
        this.queue.push({
            numbers,
            target
        });
    }

    beginNext() {
        if (this.isSolverInProgress || this.queue.length === 0) {
            return;
        }
        let { numbers, target } = this.queue.pop();

        this.distinctSolutions.clear();
        this.isSolverInProgress = true;
        this.start = performance.now();
        this.end = null;

        const solver = new PostFixSolver(target);
        let opCombos = Array.from(this.combos.take(numbers.length - 1));
        let perms = new Permutations(numbers);
        let initialPerms = Array.from(perms.take(2, true));

        let batchSize = Math.min(this.maxPoolSize, initialPerms.length);;

        let batches = new Array(batchSize);
        for (let i = 0; i < initialPerms.length; i++) {
            if (batches[i % batchSize] === null || batches[i % batchSize] === undefined) {
                batches[i % batchSize] = [];
            }
            batches[i % batchSize].push(initialPerms[i]);
        }

        for (let i = 0; i < batchSize; i++) {
            this.workers[i].worker.postMessage({
                target,
                numbers,
                opCombos,
                perms: batches[i],
                role: 'generate'
            });
            this.workers[i].isSolving = true;
        }
    }

    getGeneratedSolutions() {
        return this.distinctSolutions;
    }
}

export { SolverPool }