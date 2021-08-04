
const Board = require('./board.js');
const MoveError = require("./moveError");
const InputError = require('./inputError');
const AIPlayer = require('./aiPlayer.js');

class Game{
    constructor(ai = false, aiMark ='X', aiLevel = -1){
        this.board = new Board();
        this.ai = ai;
        if(ai === true){
            this.aiMark = aiMark;
            this.aiPlayer = new AIPlayer(aiMark, aiLevel);
        }
        this.currPlayerMark = Board.marks[0];
    }

    isOver(){
        return this.board.gameOver();
    }
    winner(){
        return this.board.winner();
    }
    makeMove(pos){
        this.board.placeMark(pos, this.currPlayerMark);
        this.swapTurn();
    }
    swapTurn(){
        this.currPlayerMark = this.currPlayerMark === Board.marks[0] ?  Board.marks[1] : Board.marks[0];
    }

    validInput(input){
        try{
            if(typeof(parseInt(input)) !== 'number' || isNaN(parseInt(input)) ){
            throw new InputError(`${input} is not a valid input. Please enter a number (0 <= n <=2).\n`);
            }
        } catch(e){
            if(e instanceof InputError){
                console.log(e.message);
            }
            else{
                throw(e);
            }
        }
    }

    run(reader, completionCallback){
        this.getMove(reader, (pos) => {
            try{
                this.makeMove(pos);
            } catch(e){
                if(e instanceof MoveError){
                    console.log(e.message);
                }
                else if(e instanceof InputError){
                    console.log(e.message);
                }
                else{
                    console.log(e.message);
                    throw e;
                }
            }
            if(this.isOver()){
                this.board.print();
                let winner = this.board.winner();
                console.log("\nGame Over!");
                if(winner === null){
                    console.log('TIE -- NO ONE WINS!\n');
                }
                else{
                    console.log(`${winner} Wins!\n`);
                }
                completionCallback();
            }
            else {
                this.run(reader, completionCallback);
            }
        });
    }
    validPositionInput(input){
        if(!(Number.isNaN(input[0]) || Number.isNaN(input[1]))){
            return true;
        }
    }

    getMove(reader, callback){
        let aiMove = false;
        let aiPos = [];
        if(this.ai === true && this.aiMark === this.currPlayerMark){
            aiMove = true;
            aiPos = this.aiPlayer.getBestMove(this.board);
        }
        else{
            this.board.print();
        }
        console.log(`\n${this.currPlayerMark}'s Turn`);

        if(aiMove === false){
            console.log("\nWhere would you like to move? \t");
            reader.question("\Please enter row number (0 <= n <= 2): \t", (row_input)=>{
                let row = parseInt(row_input);
                this.validInput(row_input);
                reader.question("\Please enter column number (0 <= n <= 2): \t", (col_input)=>{
                    this.validInput(col_input);
                    let col = parseInt(col_input);
                    let pos = [row, col];
                    if(this.validPositionInput(pos)){
                        callback(pos);
                    }
                    else{
                        console.log("Try Again!\n");
                        this.getMove(reader, callback);
                    }
                });
            });
        }
        else{
            console.log(`\nAI plays at ${aiPos}\n`);
            callback(aiPos);
        }
    }

    validMoves(){
        return this.board.validPositions();
    }

}

module.exports = Game;
