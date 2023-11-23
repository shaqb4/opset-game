//Taken from https://alistairisrael.wordpress.com/2009/09/22/simple-efficient-pnk-algorithm/
class PermutationIterator {
    constructor(arr, n, k, returnRemaining = false) {
        this.arr = arr;
        this.n = n;
        this.k = k;
        this.returnRemaining = returnRemaining;
        //this.indexToValue = (distinctArray, v) => distinctArray[v];
    }

    arrayOfIndices(length) {
        
        return Array.from({ length }, (value, index) => index);
    }

    [Symbol.iterator]() {
        let result = new Array(this.k);
        let distinct = Array.from(new Set(this.arr));
        let distinctMap = new Map();
        for (const [i, v] of distinct.entries()) {
            distinctMap.set(v, i);
        }

        //let indexArr = this.arrayOfIndices(this.n);
        let indexArr = new Array(this.n);
        for (let i = 0; i < this.n; i++) {
            indexArr[i] = distinctMap.get(this.arr[i]);
        }

        let done = false;

        let reverseRightOf = (start) => {
            let i = start + 1;
            let j = this.n - 1;
            while (i < j) {
                let temp = indexArr[i];
                indexArr[i] = indexArr[j];
                indexArr[j] = temp;
                i++;
                j--;
            }
        }

        let computeNext = () => {
            let i = this.k - 1;
            let j = this.k;

            while (j < this.n && indexArr[i] >= indexArr[j]) {
                j++;
            }

            if (j < this.n) {
                let temp = indexArr[i];
                indexArr[i] = indexArr[j];
                indexArr[j] = temp;
            } else {
                reverseRightOf(i);

                i--;
                while (i >= 0 && indexArr[i] >= indexArr[i + 1]) {
                    i--;
                }
                if (i < 0) {
                    done = true;
                    return;
                }

                j--;
                while (j > i && indexArr[i] >= indexArr[j]) {
                    j--;
                }
                let temp = indexArr[i];
                indexArr[i] = indexArr[j];
                indexArr[j] = temp;
                reverseRightOf(i);
            }
        }

        return {
            next: () => {
                result = indexArr.slice(0, this.k).map((i) => distinct[i]);
                let itResponse = null;
                if (done === true) {
                    itResponse = { done: true };
                } else {
                    itResponse = { value: {}, done: false };

                    if (this.returnRemaining === true) {
                        let remaining = indexArr.slice(this.k).map((i) => distinct[i]);
                        itResponse['value']['remaining'] = remaining;
                        itResponse['value']['permutation'] = result;
                    } else {
                        itResponse['value']['permutation'] = result;
                    }
                    computeNext();
                }
                return itResponse;
            }
        }
    }
}

class Permutations {
    constructor(arr) {
        this.arr = arr;
        this.arr.sort((a, b) => a - b);
        this.n = this.arr.length;
    }

    take(k, returnRemaining = false) {
        return new PermutationIterator([...this.arr], this.n, k, returnRemaining);
    }

    takeAll(returnRemaining = false) {
        return new PermutationIterator([...this.arr], this.n, this.n, returnRemaining);
    }
}

export { Permutations }