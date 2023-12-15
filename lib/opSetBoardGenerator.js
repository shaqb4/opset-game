class OpSetBoardConfig {
    /**
     * 
     * @param {integer} size How many numbers on the board
     * @param {integer} maxNumber The highest value a board number can be
     * @param {integer} minOpCount When generating, use at least this many operations to calculate a target. Must be less than maxNumber and greater than 0
     * @param {integer} chanceOfOp Percent chance of doing an operation after the minimum number of operations has been done. Must be 0 to 100;
     */
    constructor(size = 6, maxNumber = 25, minOpCount = 3, chanceOfOp = 33) {
        this.size = size;
        this.maxNumber = maxNumber;
        this.minOpCount = minOpCount;
        this.chanceOfOp = chanceOfOp;
    }
}

class OpSetBoardGenerator {
    /**
     * 
     * @param {OpSetBoardConfig} config 
     */
    constructor(config) {
        this.config = config;
    }

    generateBoard() {
        let board = this.generate();
        for (let i = 0; i < 5; i++) {
            if (!board.numbers.includes(board.target)) {
                break;
            }
            board = this.generate();
        }
        return board;
    }

    generate() {
        let solution = [];
        let numbers = [];
        let result = -1;
        let opCount = 0;
        while (numbers.length < this.config.size) {
            let num = Math.floor(Math.random() * this.config.maxNumber) + 1;
            if (numbers.length === 0) {
                result = num;
                numbers.push(num);
            } else {
                let doOp = Math.floor(Math.random() * 100);
                if (doOp > this.config.chanceOfOp || opCount < this.config.minOpCount) {
                    let opRand = Math.floor(Math.random() * 100);
                    let op = 0;
                    if (opRand < 20) {
                        op = 2;
                    } else if (opRand < 32.5) {
                        op = 3
                    } else if (opRand < 73) {
                        op = 1;
                    } else {
                        op = 0;
                    }
                    switch(op) {
                        case 0:
                            solution.push(`${result} + ${num} = ${result + num}`);
                            result += num;
                            opCount++;
                            numbers.push(num);
                            break;
                        case 1:
                            solution.push(`${result} * ${num} = ${result * num}`);
                            result *= num;
                            opCount++;
                            numbers.push(num);
                            break;
                        case 2:
                            if (result - num > 0) {
                                solution.push(`${result} - ${num} = ${result - num}`);
                                result -= num;
                                opCount++;
                                numbers.push(num);
                            }
                            break;
                        case 3:
                            if (Number.isInteger(result / num)) {
                                solution.push(`${result} / ${num} = ${result / num}`);
                                result /= num;
                                opCount++;
                                numbers.push(num);
                            }
                            break;
                    }
                } else {
                    numbers.push(num);
                }
            }
        }
        numbers.sort((a, b) => a - b);

        return {
            numbers,
            target: result,
            generatedSolution: solution.join(',')
        }
    }
}

export { OpSetBoardGenerator, OpSetBoardConfig };