const Game = require('./game.js');
const readline = require('readline');

//allows user to play tic tac toe from the console

const reader = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

function loadAndClearConsole(callback){
    reader.pause();
            let interval = setInterval(function(){ console.log("..."); }, 1000);
            setTimeout(function(){
                console.clear();
                callback();
                clearInterval(interval)
            }, 2000);
            reader.resume();
}

function startMenu(){
    console.log("\nWould you like to play against human or AI?\n")
    reader.question("Enter 1 (to play Human) or 2 (to play AI): ", (player) =>{
        if(player === "1"){
            console.log("\nStarting Tic Tac Toe against Human\n");
            loadAndClearConsole( ()=>{
                let game = new Game();
                game.run(reader, completion);
            });
        }
        else if(player === "2"){
            startAIGame();
        }
        else{
            console.log("\nInvalid Input. Try Again\n");
            startMenu();
        }
    });
}


function getPlayerMark(aiDifficultyLevel){
    console.log("\nWhat mark would you like to play with?\n")
    reader.question("Enter X or O: ", (mark) =>{
        if(typeof(mark) === "string"){
            mark = mark.toUpperCase();
        }
        if(mark === 'X'  || mark === 'O'){
            let aiMark = mark === 'X' ? 'O' : 'X';
            console.clear();
            console.log(`\nStarting Tic Tac Toe against AI level ${aiDifficultyLevel}`);
            console.log(`Your mark is ${mark}`);
            console.log(`AI mark is ${aiMark}`);
            let game = new Game(true, aiMark, aiDifficultyLevel);
            game.run(reader, completion);
        }
        else{
            console.log("Invalid Input. Try Again.");
            getPlayerMark(aiDifficultyLevel);
        }
    });
}

function startAIGame(){
    console.log("\nWhat Difficulty of AI would you like to play?")
    console.log("Enter a number from 1 to 5 to choose skill level [higher number = more challenging opponent]\n");
    reader.question("Difficulty Level: ", (difficulty) =>{
        if(["1", "2", "3", "4", "5"].includes(difficulty)){
            getPlayerMark(parseInt(difficulty));
        }
        else{
            console.log("Invalid Input. Try Again.");
            startAIGame();
        }
    });
}
//callback to restart game
function completion() {
    reader.question("Play again? y or n: ", restartGame => {
    if (restartGame === "y") {
        startMenu();
    } else {
        reader.close();
    }});
}

startMenu();