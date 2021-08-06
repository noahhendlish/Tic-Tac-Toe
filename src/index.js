const View = require('./ttt-view.js');

const Game = require('./game/game.js');

  $(() => {

    let $ttt = $('figure.ttt');
    let game = new Game();
    let view = new View($ttt,null);
    view.startNewGame();
  });
