const View = require('./ttt-view.js');

const Game = require('./game/game.js');

  $(() => {
    let game = new Game();
    //let aiGame = new Game(true, aiMark, aiDifficultyLevel);
    let $ttt = $('figure.ttt');
    let view = new View(game, $ttt);
    view.setupBoard();
    view.bindEvents();
  });
