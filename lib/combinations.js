/*
     Copied from non-recursive C++ version at https://www.rosettacode.org/wiki/Combinations_with_repetitions#C++
     for repetitive combination algorithm
  */
class CombinationIterator {
    constructor(arr, n, k) {
        this.arr = arr;
        this.n = n;
        this.k = k;
    }

    [Symbol.iterator]() {
        let result = new Array(this.k);
        let done = false;

        let pos = [];
        for (let i = 0; i < this.k + 1; i++) {
            pos[i] = 0;
        }

        let computeNext = () => {
            for (let i = this.k; i > 0; i--) {
                if (pos[i] > this.n - 1) {
                    pos[i - 1] += 1;
                    for (let j = i; j <= this.k; j++) {
                        pos[j] = pos[j - 1];
                    }
                }
            }
            if (pos[0] > 0) {
                done = true;
                return;
            }
            
            result.length = 0;
            for (let a = 1; a < pos.length; ++a) {
                result.push(this.arr[pos[a]]);
            }
            pos[this.k]++;
        }

        return {
            next: () => {
                computeNext();
                if (done === true) {
                    return { done: true };
                } else {
                    return { value: [...result], done: false };
                }
            }

        }
    }
}

class Combinations {
    constructor(arr) {
        this.arr = arr;
        //this.arr.sort((a, b) => a - b);
        this.n = this.arr.length;
    }

    take(k) {
        return new CombinationIterator([...this.arr], this.n, k);
    }
}

export { Combinations }