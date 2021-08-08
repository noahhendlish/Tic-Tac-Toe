const Board = require('./board.js');
class AIPlayer{
    constructor(mark = 'X', maxDepth = -1){
        this.mark = mark;
        this.maxDepth = maxDepth;
        this.nodesMap = new Map();
    }
    //returns opponents mark
    opponentMark(){
        return this.mark === 'X' ? 'O' : 'X';
    }

    //given an instance of board -- returns next best move (using max/min -- defaults to max possible depth unless maxDepth is set)
    getBestMove(board, max = true, depth = 0){
        if(depth == 0){
            this.nodesMap.clear();
        }
        if(board.gameOver() || depth === this.maxDepth ) { //if end of game or max depth and...
            if(board.winner() === this.mark) { //AI gets win
                return 1000 - depth;
            } else if (board.winner() === this.opponentMark()) { //opponent gets win
                return -1000 + depth;
            }//tie
            return 0; //no change
        }
            //MAX/MIN
            //Initialize best to the lowest possible value if max, highest if min (*uses 1000 for 'infinity')
            let best = max === true ? -1000 : 1000;
            //get current player mark (if maximizing --AI, else simulating human/ minimizing)
            let mark = max === true ? this.mark : this.opponentMark();
            //Loop through all empty cells on board (having the current player make a move on it and recursively calling getBestMove)
            board.validPositions().forEach(pos => {
                //Initialize a new board with a copy of current boards
                const child = new Board();
                child.grid = [];
                board.grid.forEach( (row) => { child.grid.push([...row]) });
                //Create a child node by inserting the current players' mark into the current empty cell
                child.placeMark(pos, mark);
                //Recursively call getBestMove with new board (after making a move), changing min/max (whose turn it is), and incrementing the depth
                const nodeValue = this.getBestMove(child, (!max), depth + 1);
                //Update best value (heuristic value) based on whose turn it is
                best = (max === true) ? Math.max(best, nodeValue): Math.min(best, nodeValue);
                //If it's the main function call, map each heuristic value with it's moves indices
                if (depth == 0) {
                    //separate pairs of position indices with a '-' if multiple moves have the same heuristic value
                    const moves = this.nodesMap.has(nodeValue)
                        ? this.nodesMap.get(nodeValue) + "-" + (pos)
                        : pos;
                    this.nodesMap.set(nodeValue, moves);
                }
            });
            //If it's the main call, return the index of the best move
            if (depth == 0) {
                let bestPosition = this.nodesMap.get(best);
                //if multiple indices have the same heuristic value (nodesMap value is a string of positions instead of an array), pick a random position
                if (typeof bestPosition == "string") {
                    let arr = this.nodesMap.get(best).split("-"); //*positions stored as a string, seperated by '-'
                    let numArr = [];
                    for(let i =0; i < arr.length; i++){
                        numArr.push([parseInt(arr[i][0]), parseInt(arr[i][2])]);
                    }
                    const rand = Math.floor(Math.random() * numArr.length);
                    bestPosition = numArr[rand];
                }
                //return best position
                return bestPosition;
            }
            //If not the main call (recursive call) return best scored move
            return best;
    }
}



module.exports = AIPlayer;
