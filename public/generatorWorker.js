import { OpSetBoardGenerator } from './opSetBoardGenerator.js'

self.onmessage = function(event) { 
    let boardGenerator = new OpSetBoardGenerator(event.data.boardConfig);
    let board = boardGenerator.generateBoard();
    self.postMessage({
        board
    });
}