const Board = require('./board.js');
class AIPlayer{
    constructor(mark = 'X', maxDepth = -1){
        this.mark = mark;
        this.maxDepth = maxDepth;
        this.nodesMap = new Map();
    }
    opponentMark(){
        return this.mark === 'X' ? 'O' : 'X';
    }
    getBestMove(board, max = true, depth = 0){
        if(depth == 0){
            this.nodesMap.clear();
        }
        if(board.gameOver() || depth === this.maxDepth ) {
            if(board.winner() === this.mark) {
                return 100 - depth;
            } else if (board.winner() === this.opponentMark()) {
                return -100 + depth;
            }
            return 0;
        }
        //MAX/MIN
        //Initialize best to the lowest possible value if max, highest if min
            let best = max === true ? -100 : 100;
            //Loop through all empty cells
            board.validPositions().forEach(pos => {
                //Initialize a new board with a copy of our current state
                const child = new Board();
                child.grid = [];
                board.grid.forEach( (row) => { child.grid.push([...row]) });

                let mark = max === true ? this.mark : this.opponentMark();
                //Create a child node by inserting the maximizing symbol x into the current empty cell
                child.placeMark(pos, mark);

                //Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth
                const nodeValue = this.getBestMove(child, (!max), depth + 1);
                //Updating best value
                best = max === true ? Math.max(best, nodeValue): Math.min(best, nodeValue);
                //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices
                if (depth == 0) {
                    //Comma separated indices if multiple moves have the same heuristic value
                    //let movesArr = [];
                    const moves = this.nodesMap.has(nodeValue)
                        ? this.nodesMap.get(nodeValue) + "-" + (pos)
                        : pos;
                    this.nodesMap.set(nodeValue, moves);
                }
            });
            //If it's the main call, return the index of the best move or a random index if multiple indices have the same value
            if (depth == 0) {
                let returnValue;

                if (typeof this.nodesMap.get(best) == "string") {
                    let arr = this.nodesMap.get(best).split("-");
                    let numArr = [];
                    for(let i =0; i < arr.length; i++){
                        numArr.push([parseInt(arr[i][0]), parseInt(arr[i][2])]);
                    }
                    //console.log(numArr);
                    const rand = Math.floor(Math.random() * numArr.length);
                    returnValue = numArr[rand];
                } else {
                    returnValue = this.nodesMap.get(best);
                }
                //run a callback after calculation and return the index
                return returnValue;
            }
            //If recursive return best scored move
            return best;
    }
}



module.exports = AIPlayer;
