/*
 * ATTENTION: The "eval" devtool has been used (maybe by default in mode: "development").
 * This devtool is neither made for production nor for readable output files.
 * It uses "eval()" calls to create a separate source file in the browser devtools.
 * If you are trying to read the output file, select a different devtool (https://webpack.js.org/configuration/devtool/)
 * or disable the default devtool with "devtool: false".
 * If you are looking for production-ready output files, see mode: "production" (https://webpack.js.org/configuration/mode/).
 */
/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/game/aiPlayer.js":
/*!******************************!*\
  !*** ./src/game/aiPlayer.js ***!
  \******************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Board = __webpack_require__(/*! ./board.js */ \"./src/game/board.js\");\nclass AIPlayer{\n    constructor(mark = 'X', maxDepth = -1){\n        this.mark = mark;\n        this.maxDepth = maxDepth;\n        this.nodesMap = new Map();\n    }\n    opponentMark(){\n        return this.mark === 'X' ? 'O' : 'X';\n    }\n    getBestMove(board, max = true, depth = 0){\n        if(depth == 0){\n            this.nodesMap.clear();\n        }\n        if(board.gameOver() || depth === this.maxDepth ) {\n            if(board.winner() === this.mark) {\n                return 100 - depth;\n            } else if (board.winner() === this.opponentMark()) {\n                return -100 + depth;\n            }\n            return 0;\n        }\n        //MAX/MIN\n        //Initialize best to the lowest possible value if max, highest if min\n            let best = max === true ? -100 : 100;\n            //Loop through all empty cells\n            board.validPositions().forEach(pos => {\n                //Initialize a new board with a copy of our current state\n                const child = new Board();\n                child.grid = [];\n                board.grid.forEach( (row) => { child.grid.push([...row]) });\n\n                let mark = max === true ? this.mark : this.opponentMark();\n                //Create a child node by inserting the maximizing symbol x into the current empty cell\n                child.placeMark(pos, mark);\n\n                //Recursively calling getBestMove this time with the new board and minimizing turn and incrementing the depth\n                const nodeValue = this.getBestMove(child, (!max), depth + 1);\n                //Updating best value\n                best = max === true ? Math.max(best, nodeValue): Math.min(best, nodeValue);\n                //If it's the main function call, not a recursive one, map each heuristic value with it's moves indices\n                if (depth == 0) {\n                    //Comma separated indices if multiple moves have the same heuristic value\n                    //let movesArr = [];\n                    const moves = this.nodesMap.has(nodeValue)\n                        ? this.nodesMap.get(nodeValue) + \"-\" + (pos)\n                        : pos;\n                    this.nodesMap.set(nodeValue, moves);\n                }\n            });\n            //If it's the main call, return the index of the best move or a random index if multiple indices have the same value\n            if (depth == 0) {\n                let returnValue;\n\n                if (typeof this.nodesMap.get(best) == \"string\") {\n                    let arr = this.nodesMap.get(best).split(\"-\");\n                    let numArr = [];\n                    for(let i =0; i < arr.length; i++){\n                        numArr.push([parseInt(arr[i][0]), parseInt(arr[i][2])]);\n                    }\n                    //console.log(numArr);\n                    const rand = Math.floor(Math.random() * numArr.length);\n                    returnValue = numArr[rand];\n                } else {\n                    returnValue = this.nodesMap.get(best);\n                }\n                //run a callback after calculation and return the index\n                return returnValue;\n            }\n            //If recursive return best scored move\n            return best;\n    }\n}\n\n\n\nmodule.exports = AIPlayer;\n\n\n//# sourceURL=webpack:///./src/game/aiPlayer.js?");

/***/ }),

/***/ "./src/game/board.js":
/*!***************************!*\
  !*** ./src/game/board.js ***!
  \***************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const MoveError = __webpack_require__(/*! ./moveError */ \"./src/game/moveError.js\");\n\nclass Board{\n    constructor(){\n        this.grid = Board.makeGrid();\n    }\n\n    static makeGrid(){\n        const grid = [];\n        for(let i = 0; i < 3; i++){\n            grid.push([]);\n            for(let j = 0; j < 3; j++){\n                grid[i].push(null);\n            }\n        }\n        return grid;\n    }\n\n    won(mark){\n        let three_adjacent =[\n        [this.grid[0][0], this.grid[1][1], this.grid[2][2]], //diagonals\n        [this.grid[0][2], this.grid[1][1], this.grid[2][0]],\n\n        [this.grid[0][0], this.grid[0][1], this.grid[0][2]], //horizontals\n        [this.grid[1][0], this.grid[1][1], this.grid[1][2]],\n        [this.grid[2][0], this.grid[2][1], this.grid[2][2]],\n\n        [this.grid[0][0], this.grid[1][0], this.grid[2][0]], //verticals\n        [this.grid[0][1], this.grid[1][1], this.grid[2][1]],\n        [this.grid[0][2], this.grid[1][2], this.grid[2][2]]\n        ]\n        for(let configs = 0; configs < three_adjacent.length; configs++){\n            let count = 0;\n            three_adjacent[configs].forEach(el=>{\n                if(el === mark){\n                    count+=1;\n                }\n            });\n            if(count === 3){\n                return true;\n            }\n        }\n        return false;\n    }\n\n    gameOver(){\n        let validPositions = this.validPositions();\n        if(this.won('X') || this.won('O') || (validPositions.length === 0)){\n            return true;\n        }\n        else{\n            return false;\n        }\n    }\n\n    winner(){\n        if(this.won('X')){\n            return 'X';\n        }\n        else if(this.won('O')){\n            return 'O';\n        }\n        else{\n            return null;\n        }\n    }\n\n    isValid(pos){\n        if((pos.length !== 2)){\n            console.log(\"invalid length\");\n            return false;\n        }\n        if(typeof(pos[0]) !== 'number' || typeof(pos[1]) !== 'number'){\n            return false;\n        }\n        if(pos[0] < 0 || pos[0] > 2){\n            return false;\n        }\n        else if(pos[1] < 0 || pos[1] > 2){\n            return false;\n        }\n        else{\n            return true;\n        }\n    }\n\n    getMark(pos){\n        if(this.isValid(pos)){\n            return this.grid[pos[0]][pos[1]];\n        }\n        else{\n            //console.log(\"Invalid position -- not valid entry/ not on the board!\");\n            throw new MoveError(`${pos} is not valid position on the board`);\n        }\n    }\n\n    isEmpty(pos){\n        return (this.getMark(pos) === null);\n    }\n\n    validPositions(){\n        let positions = [];\n        for(let i =0; i < 3; i ++){\n            for(let j =0; j < 3; j ++){\n                if(this.isEmpty([i,j])){\n                    positions.push([i,j]);\n                }\n            }\n        }\n        return positions;\n    }\n\n    placeMark(pos, mark){\n        if(this.isEmpty(pos)){\n            this.grid[pos[0]][pos[1]] = mark;\n        }\n        else{\n            throw new MoveError(`${pos} is not an empty position on the board`);\n        }\n    }\n\n    print(){\n        console.log(\"    0  1  2\");\n        for(let row = 0; row < 3; row++){\n            let rowStr = \"\";\n            rowStr += row + \"  \";\n            for(let col = 0; col < 3; col++){\n                if(this.grid[row][col] === null){\n                    rowStr += \" _ \";\n                }\n                else{\n                    rowStr += ` ${this.grid[row][col]} `;\n                }\n            }\n            console.log(rowStr);\n        }\n    }\n}\nBoard.marks = ['X', 'O'];\nmodule.exports = Board;\n\n//let b = new Board();\n//b.print();\n\n//# sourceURL=webpack:///./src/game/board.js?");

/***/ }),

/***/ "./src/game/game.js":
/*!**************************!*\
  !*** ./src/game/game.js ***!
  \**************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("\nconst Board = __webpack_require__(/*! ./board.js */ \"./src/game/board.js\");\nconst MoveError = __webpack_require__(/*! ./moveError */ \"./src/game/moveError.js\");\nconst InputError = __webpack_require__(/*! ./inputError */ \"./src/game/inputError.js\");\nconst AIPlayer = __webpack_require__(/*! ./aiPlayer.js */ \"./src/game/aiPlayer.js\");\n\nclass Game{\n    constructor(ai = false, aiMark ='X', aiLevel = -1){\n        this.board = new Board();\n        this.ai = ai;\n        if(ai === true){\n            this.aiMark = aiMark;\n            this.aiPlayer = new AIPlayer(aiMark, aiLevel);\n        }\n        this.currPlayerMark = Board.marks[0];\n    }\n\n    isOver(){\n        return this.board.gameOver();\n    }\n    winner(){\n        return this.board.winner();\n    }\n    makeMove(pos){\n        this.board.placeMark(pos, this.currPlayerMark);\n        this.swapTurn();\n    }\n    swapTurn(){\n        this.currPlayerMark = this.currPlayerMark === Board.marks[0] ?  Board.marks[1] : Board.marks[0];\n    }\n\n    validInput(input){\n        try{\n            if(typeof(parseInt(input)) !== 'number' || isNaN(parseInt(input)) ){\n            throw new InputError(`${input} is not a valid input. Please enter a number (0 <= n <=2).\\n`);\n            }\n        } catch(e){\n            if(e instanceof InputError){\n                console.log(e.message);\n            }\n            else{\n                throw(e);\n            }\n        }\n    }\n\n    run(reader, completionCallback){\n        this.getMove(reader, (pos) => {\n            try{\n                this.makeMove(pos);\n            } catch(e){\n                if(e instanceof MoveError){\n                    console.log(e.message);\n                }\n                else if(e instanceof InputError){\n                    console.log(e.message);\n                }\n                else{\n                    console.log(e.message);\n                    throw e;\n                }\n            }\n            if(this.isOver()){\n                this.board.print();\n                let winner = this.board.winner();\n                console.log(\"\\nGame Over!\");\n                if(winner === null){\n                    console.log('TIE -- NO ONE WINS!\\n');\n                }\n                else{\n                    console.log(`${winner} Wins!\\n`);\n                }\n                completionCallback();\n            }\n            else {\n                this.run(reader, completionCallback);\n            }\n        });\n    }\n    validPositionInput(input){\n        if(!(Number.isNaN(input[0]) || Number.isNaN(input[1]))){\n            return true;\n        }\n    }\n\n    getMove(reader, callback){\n        let aiMove = false;\n        let aiPos = [];\n        if(this.ai === true && this.aiMark === this.currPlayerMark){\n            aiMove = true;\n            aiPos = this.aiPlayer.getBestMove(this.board);\n        }\n        else{\n            this.board.print();\n        }\n        console.log(`\\n${this.currPlayerMark}'s Turn`);\n\n        if(aiMove === false){\n            console.log(\"\\nWhere would you like to move? \\t\");\n            reader.question(\"\\Please enter row number (0 <= n <= 2): \\t\", (row_input)=>{\n                let row = parseInt(row_input);\n                this.validInput(row_input);\n                reader.question(\"\\Please enter column number (0 <= n <= 2): \\t\", (col_input)=>{\n                    this.validInput(col_input);\n                    let col = parseInt(col_input);\n                    let pos = [row, col];\n                    if(this.validPositionInput(pos)){\n                        callback(pos);\n                    }\n                    else{\n                        console.log(\"Try Again!\\n\");\n                        this.getMove(reader, callback);\n                    }\n                });\n            });\n        }\n        else{\n            console.log(`\\nAI plays at ${aiPos}\\n`);\n            callback(aiPos);\n        }\n    }\n\n    validMoves(){\n        return this.board.validPositions();\n    }\n\n}\n\nmodule.exports = Game;\n\n\n//# sourceURL=webpack:///./src/game/game.js?");

/***/ }),

/***/ "./src/game/inputError.js":
/*!********************************!*\
  !*** ./src/game/inputError.js ***!
  \********************************/
/***/ ((module) => {

eval("class InputError extends Error {\n    constructor(message) {\n        super(message); // (1)\n        this.name = \"Invalid Input\"; // (2)\n    }\n}\n\n//const moveError = function(msg) { return new MoveError(msg)};\n//let error = new MoveError(\"position is invalid\");\n\nmodule.exports = InputError;\n\n//# sourceURL=webpack:///./src/game/inputError.js?");

/***/ }),

/***/ "./src/game/moveError.js":
/*!*******************************!*\
  !*** ./src/game/moveError.js ***!
  \*******************************/
/***/ ((module) => {

eval("class MoveError extends Error {\n    constructor(message) {\n        super(message); // (1)\n        this.name = \"Invalid Move\"; // (2)\n    }\n}\n\n//const moveError = function(msg) { return new MoveError(msg)};\n//let error = new MoveError(\"position is invalid\");\n\nmodule.exports = MoveError;\n\n//# sourceURL=webpack:///./src/game/moveError.js?");

/***/ }),

/***/ "./src/index.js":
/*!**********************!*\
  !*** ./src/index.js ***!
  \**********************/
/***/ ((__unused_webpack_module, __unused_webpack_exports, __webpack_require__) => {

eval("const View = __webpack_require__(/*! ./ttt-view.js */ \"./src/ttt-view.js\");\n\nconst Game = __webpack_require__(/*! ./game/game.js */ \"./src/game/game.js\");\n\n  $(() => {\n    let game = new Game();\n    //let aiGame = new Game(true, aiMark, aiDifficultyLevel);\n    let $ttt = $('figure.ttt');\n    let view = new View(game, $ttt);\n    view.setupBoard();\n    view.bindEvents();\n  });\n\n\n//# sourceURL=webpack:///./src/index.js?");

/***/ }),

/***/ "./src/ttt-view.js":
/*!*************************!*\
  !*** ./src/ttt-view.js ***!
  \*************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

eval("const Game = __webpack_require__(/*! ./game/game */ \"./src/game/game.js\");\n\nclass View {\n  constructor(game, $el) {\n    this.game = game;\n    this.$el = $el;\n  }\n  start(){\n\n  }\n\n  bindEvents() {\n    $('.selection-dropdown').select2({\n    width: 'resolve',\n    minimumResultsForSearch: Infinity\n    });\n    //toggle AI menu\n    /*if(this.game === null){\n      if($('.game-menu').hasClass('hide-menu')){\n        this.game = new Game();\n      }\n    }*/\n\n    this.toggleAIMenu();\n    //this.startGame();\n    //this.playerHover();\n    //this.makeMove();\n\n    /*let gameOverCheck = setInterval(\n      ()=>{\n        this.checkForWin();\n        if(this.game.isOver()){\n          clearInterval(gameOverCheck);\n        }\n      }, 1000\n    );*/\n    //\n    //change each square while current player hovers over it (display mark [x or o] with associated color [red or blue])\n    //change square on grid after current player makes a move (display mark with associated color)\n    //load menu on end of game\n    //make AI move\n  }\n  startGame(){\n    $('.start-game-button').on('click',  (e)=> {\n        e.preventDefault();\n        //console.log(e);\n        let $opponent = $('#opponent').val();\n        if($opponent === 'Human'){\n          this.game = new Game();\n        } else{\n          let mark = $('#player-mark').val();\n          let aiLevel = $('#ai-level').val();\n          let aiMark = (mark === 'X') ? 'O' : 'X';\n          this.game= new Game(true, aiMark, parseInt(aiLevel));\n        }\n        //this.toggleMenu()\n    });\n  }\n\n  toggleMenu(){\n    $('.game-menu').toggleClass('hide-menu');\n  }\n  /*toggleAISlideDownMenu(){\n      $( \".play-AI-options\" ).slideDown( \"slow\", function() {\n          // Animation complete.\n          });\n    }\n  }*/\n  toggleAIMenu(){\n    let $opponent_selection = $('#opponent');\n    $opponent_selection.change(function(){\n      if($(this).val() === 'AI'){\n        $('.play-AI-options').removeClass('hide-menu');\n      }\n      else{\n        $('.play-AI-options').addClass('hide-menu');\n      }\n    });\n  }\n\n  displayWinner(){\n      let winner = this.game.winner();\n      let win_msg = ''\n      if(winner === null){\n        win_msg = 'Tie Game';\n      }\n      else{\n        win_msg = winner + ' Wins!';\n      }\n      //$('.display-winner').text(win_msg);\n      //$('.display-winner').removeClass('hidden');\n      /*setTimeout(()=>{\n        $('.display-winner').text('');\n        $('.display-winner').addClass('hidden');\n      }, 1000);*/\n      this.newGameReset();\n  }\n\n  checkForWin(){\n    if(this.game.isOver()){\n      this.displayWinner();\n    }\n  }\n  newGameReset(){\n    this.resetBoard();\n    this.toggleMenu();\n    this.bindEvents();\n  }\n  resetBoard() {\n    const $pos = $('.pos');\n    $pos.addClass('unplayed');\n    $pos.text('');\n    $pos.removeClass(\"X-played\");\n    $pos.removeClass(\"O-played\");\n  }\n\n  makeMove() {\n    $('ul.row').on('click', 'li.pos', (event)=>{\n      const $square = $(event.currentTarget);\n      if(!(this.game.isOver())){\n        const pos = $square.attr('data-pos');\n        const selected_position = [parseInt(pos[0]), parseInt(pos[2])];\n        let playerMark = this.game.currPlayerMark;\n        if($square.hasClass(\"unplayed\")){\n          $square.removeClass('unplayed');\n          $square.text(playerMark);\n          $square.addClass(playerMark + \"-played\");\n          this.game.makeMove(selected_position);\n        }\n      }\n    });\n  }\n  playerHover(){\n    const game = this.game;\n    $('.pos').hover(\n      function(){\n        if(($(this).hasClass(\"unplayed\")) && !(game.isOver())){\n          let playerMark = game.currPlayerMark;\n          let color = playerMark == 'O' ? 'blue':'red';\n          $(this).css('color', color);\n          $(this).text(playerMark);\n        }\n      },\n      function(){\n        if(($(this).hasClass(\"unplayed\")) && !(game.isOver())){\n          $(this).text('');\n          $(this).css('color', 'black');\n        }\n      }\n    );\n  }\n\n\n  setupBoard() {\n    const $grid = $('<div>').addClass('grid');\n    for(let rowIdx=0; rowIdx <3; rowIdx++){\n      const $row = $(\"<ul>\").addClass('row').attr('data-rowNum', rowIdx);\n      for(let colIdx =0; colIdx < 3; colIdx++){\n        let $pos = $(\"<li>\").addClass(\"pos unplayed\").attr('data-pos', [rowIdx, colIdx]);\n        $row.append($pos);\n      }\n      $grid.append($row);\n    }\n    this.$el.append($grid);\n  }\n\n}\n\nmodule.exports = View;\n\n\n//# sourceURL=webpack:///./src/ttt-view.js?");

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId](module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module can't be inlined because the eval devtool is used.
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.js");
/******/ 	
/******/ })()
;