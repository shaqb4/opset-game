import { Permutations } from './permutations.js'
import { PostFixSolver } from './postFixSolver.js'

class SolverTaskHandler {
    solveFirst(worker, event) {
        let taskIndex = event.data.taskIndex;
        let sharedTaskStatus = event.data.sharedTaskStatus;
        const statusView = new Uint8Array(sharedTaskStatus);
        if (Atomics.load(statusView, taskIndex) === 1) {
            return;
        }

        let target = event.data.target;
        let numbers = event.data.numbers;
        let opCombos = event.data.opCombos;
        let perms = event.data.perms;
        let solutions = [];

        let solver = new PostFixSolver(target);

        for (let perm of perms) {
            for (let i = 0; i < opCombos.length; i++) {
                let combo = opCombos[i];
                let remaingWithOpsArr = perm.remaining.concat(combo);
                let opPerms = new Permutations(remaingWithOpsArr);

                for (let opPerm of opPerms.takeAll()) {
                    if (Atomics.load(statusView, taskIndex) === 1) {
                        return;
                    }
                    let postFixArray = perm.permutation.concat(opPerm.permutation);
        
                    if (solver.postfixEval(postFixArray) === target) {
                        worker.postMessage({
                            msgType: 'solution',
                            solution: postFixArray,
                            target
                        });
                        Atomics.store(statusView, taskIndex, 1);

                        return;
                    }
                }
            }
        }
    }

    solveAll(worker, event) {
        let taskIndex = event.data.taskIndex;
        let sharedTaskStatus = event.data.sharedTaskStatus;
        const statusView = new Uint8Array(sharedTaskStatus);
        if (Atomics.load(statusView, taskIndex) === 1) {
            return;
        }

        let target = event.data.target;
        let numbers = event.data.numbers;
        let opCombos = event.data.opCombos;
        let perms = event.data.perms;
        let solutions = [];

        let solver = new PostFixSolver(target);

        for (let perm of perms) {
            for (let i = 0; i < opCombos.length; i++) {
                let combo = opCombos[i];
                let remaingWithOpsArr = perm.remaining.concat(combo);
                let opPerms = new Permutations(remaingWithOpsArr);

                for (let opPerm of opPerms.takeAll()) {
                    if (Atomics.load(statusView, taskIndex) === 1) {
                        return;
                    }
                    let postFixArray = perm.permutation.concat(opPerm.permutation);
        
                    if (solver.postfixEval(postFixArray) === target) {
                        worker.postMessage({
                            msgType: 'solution',
                            solution: postFixArray,
                            target
                        });
                    }
                }
            }
        }
    }
}

self.onmessage = function(event) {
    if (event.data.msgType === 'task') {
        let target = event.data.target;
        let numbers = event.data.numbers;
        let taskHandler = new SolverTaskHandler();
        if (event.data.taskType === 'SOLVE_ALL') {
            taskHandler.solveAll(self, event);

            self.postMessage({
                msgType: 'done',
                numbers,
                target
            });
        } else if (event.data.taskType === 'SOLVE_FIRST') {
            taskHandler.solveFirst(self, event);

            self.postMessage({
                msgType: 'done',
                numbers,
                target
            });
        }
    }
  };