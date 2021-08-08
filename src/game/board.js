const MoveError = require("./moveError");

class Board{
    constructor(){
        this.grid = Board.makeGrid();
    }
    //make a grid (an array with 3 sub-arrays, where each subarray has 3 null elements)
    static makeGrid(){
        const grid = [];
        for(let i = 0; i < 3; i++){
            grid.push([]);
            for(let j = 0; j < 3; j++){
                grid[i].push(null);
            }
        }
        return grid;
    }
    //check for win given a mark
    won(mark){
        let three_adjacent =[ //all possible configurations for a win
        [this.grid[0][0], this.grid[1][1], this.grid[2][2]], //diagonals
        [this.grid[0][2], this.grid[1][1], this.grid[2][0]],

        [this.grid[0][0], this.grid[0][1], this.grid[0][2]], //horizontals
        [this.grid[1][0], this.grid[1][1], this.grid[1][2]],
        [this.grid[2][0], this.grid[2][1], this.grid[2][2]],

        [this.grid[0][0], this.grid[1][0], this.grid[2][0]], //verticals
        [this.grid[0][1], this.grid[1][1], this.grid[2][1]],
        [this.grid[0][2], this.grid[1][2], this.grid[2][2]]
        ]
        for(let configs = 0; configs < three_adjacent.length; configs++){
            let count = 0;
            three_adjacent[configs].forEach(el=>{ //count # of same mark in positions needed for a win
                if(el === mark){
                    count+=1;
                }
            }); //if 3 in a row, return win
            if(count === 3){
                return true;
            }
        }
        return false;
    }

    //returns array of winning positions (helpful for highlighting winning positions)
    winningPositions(mark){
        mark = mark || this.winner();
        if (mark === null){
            return [];
        }
        let three_adjacent =[
        [[0,0], [1,1], [2,2]], //diagonals
        [[0,2], [1,1], [2,0]],

        [[0,0], [0,1], [0,2]], //horizontals
        [[1,0], [1,1], [1,2]],
        [[2,0], [2,1], [2,2]],

        [[0,0], [1,0], [2,0]], //verticals
        [[0,1], [1,1], [2,1]],
        [[0,2], [1,2], [2,2]]
        ]
        let winningPositions = []
        for(let group = 0; group < three_adjacent.length; group++){
            winningPositions = [];
            three_adjacent[group].forEach(pos=>{
                if(this.getMark(pos) === mark){
                    winningPositions.push(pos);
                }
            });
            if(winningPositions.length === 3){
                return winningPositions;
            }
        }
        return [];
    }

    //check if game is over (there is a winner or the board is full)
    gameOver(){
        let validPositions = this.validPositions();
        if(this.won('X') || this.won('O') || (validPositions.length === 0)){
            return true;
        }
        else{
            return false;
        }
    }
    //return winner (check if x won or o won, if tie return null)
    winner(){
        if(this.won('X')){
            return 'X';
        }
        else if(this.won('O')){
            return 'O';
        }
        else{
            return null;
        }
    }

    //checks for valid position (useful for console game-play)
    isValid(pos){
        if((pos.length !== 2)){
            console.log("invalid length");
            return false;
        }
        if(typeof(pos[0]) !== 'number' || typeof(pos[1]) !== 'number'){
            return false;
        }
        if(pos[0] < 0 || pos[0] > 2){
            return false;
        }
        else if(pos[1] < 0 || pos[1] > 2){
            return false;
        }
        else{
            return true;
        }
    }

    //returns mark at current position
    getMark(pos){
        if(this.isValid(pos)){
            return this.grid[pos[0]][pos[1]];
        }
        else{
            //console.log("Invalid position -- not valid entry/ not on the board!");
            throw new MoveError(`${pos} is not valid position on the board`);
        }
    }

    //check if position is empty (null)
    isEmpty(pos){
        return (this.getMark(pos) === null);
    }

    //returns array of valid positions (empty positions)
    validPositions(){
        let positions = [];
        for(let i =0; i < 3; i ++){
            for(let j =0; j < 3; j ++){
                if(this.isEmpty([i,j])){
                    positions.push([i,j]);
                }
            }
        }
        return positions;
    }
    //places a mark at a given position (if it is empty -- otherwise throws error)
    placeMark(pos, mark){
        if(this.isEmpty(pos)){
            this.grid[pos[0]][pos[1]] = mark;
        }
        else{
            throw new MoveError(`${pos} is not an empty position on the board`);
        }
    }

    //print game to console
    print(){
        console.log("    0  1  2");
        for(let row = 0; row < 3; row++){
            let rowStr = "";
            rowStr += row + "  ";
            for(let col = 0; col < 3; col++){
                if(this.grid[row][col] === null){
                    rowStr += " _ ";
                }
                else{
                    rowStr += ` ${this.grid[row][col]} `;
                }
            }
            console.log(rowStr);
        }
    }
}
Board.marks = ['X', 'O'];
module.exports = Board;
