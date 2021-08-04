const MoveError = require("./moveError");

class Board{
    constructor(){
        this.grid = Board.makeGrid();
    }

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

    won(mark){
        let three_adjacent =[
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
            three_adjacent[configs].forEach(el=>{
                if(el === mark){
                    count+=1;
                }
            });
            if(count === 3){
                return true;
            }
        }
        return false;
    }

    gameOver(){
        let validPositions = this.validPositions();
        if(this.won('X') || this.won('O') || (validPositions.length === 0)){
            return true;
        }
        else{
            return false;
        }
    }

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

    getMark(pos){
        if(this.isValid(pos)){
            return this.grid[pos[0]][pos[1]];
        }
        else{
            //console.log("Invalid position -- not valid entry/ not on the board!");
            throw new MoveError(`${pos} is not valid position on the board`);
        }
    }

    isEmpty(pos){
        return (this.getMark(pos) === null);
    }

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

    placeMark(pos, mark){
        if(this.isEmpty(pos)){
            this.grid[pos[0]][pos[1]] = mark;
        }
        else{
            throw new MoveError(`${pos} is not an empty position on the board`);
        }
    }

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

//let b = new Board();
//b.print();