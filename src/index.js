const View = require('./ttt-view.js');

const Game = require('./game/game.js');

  $(() => {

    let $ttt = $('figure.ttt');
    let view = new View($ttt);
    view.startNewGame();
  });
