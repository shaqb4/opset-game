import { Permutations } from './permutations.js'
import { PostFixSolver } from './postFixSolver.js'

self.onmessage = function(event) {
    if (event.data.role === 'generate') {
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
                    let postFixArray = perm.permutation.concat(opPerm.permutation);
        
                    if (solver.postfixEval(postFixArray) === target) {
                        // solutions.push(postFixArray);
                        self.postMessage({
                            role: 'solution',
                            solution: postFixArray,
                            target
                        });
                    }
                }
            }
        }

        self.postMessage({
            role: 'done',
            numbers,
            target
        });
    }
  };