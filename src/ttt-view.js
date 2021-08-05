const Game = require("./game/game");

class View {
  constructor($el, game = null) {
    this.$el = $el;
    this.game = game;
    this.setupBoard();
  }

  bindEvents() {
    //for select2 (drop-downs)
    $('.selection-dropdown').select2({
    width: 'resolve',
    minimumResultsForSearch: Infinity
    });
    //enables toggling of AI menu
    this.activateAIMenu();
  }

  startNewGame(){
    this.resetBoard();
    this.bindEvents();
    this.showMenu();
    $('.start-game-button').on('click',  (e)=> {
        e.preventDefault();
        this.hideMenu();
        let $opponent = $('#opponent').val();
        if($opponent === 'Human'){
          this.playHuman();
        } else{
          let mark = $('#player-mark').val();
          let aiLevel = parseInt($('#ai-level').val());
          let aiMark = (mark === 'X') ? 'O' : 'X';
          this.playAI(aiMark, aiLevel);
        }
    });
  }

  playAI(aiMark, aiLevel){
    this.game = new Game(true, aiMark, aiLevel);
    if(aiMark === 'X'){ //X plays first, if AI first, ai makes move
      this.makeAIMove();
    }
    this.playerHover();
    this.makeMove();
  }

  playHuman(){
    this.game = new Game();
    this.playerHover();
    this.makeMove();
  }

  //end game-- display winner at end of game (then resets game-- loads menu)
  endGame(){
      let winner = this.game.winner();
      let win_msg = ''
      if(winner === null){
        win_msg = 'Tie Game';
      }
      else{
        this.highlightWinningSquares(winner);
        win_msg = winner + ' Wins!';
      }
      $('.display-winner').text(win_msg);
      $('.display-winner').removeClass('hidden');
      setTimeout(()=>{
        this.startNewGame();
      }, 3000);
  }

  highlightWinningSquares(winnerMark){
    let winningPositions = this.game.winningPositions(winnerMark);
    for(let i=0; i< winningPositions.length; i++){
      let winPos = winningPositions[i];
      let $winPos = $(`[data-pos= "${winPos}"]`);
      $winPos.addClass('winner');
    }
  }

  //
  checkForWin(){
    if(this.game.isOver()){
      this.endGame();
      return true;
    }
    return false;
  }

  //reset board display (all squares blank)
  resetBoard(){
    $(".pos").off("hover");
    $( ".pos" ).off( "mouseenter mouseleave");
    $( ".unplayed" ).off( "mouseenter mouseleave");
    $('.start-game-button').off('click');
    $('.pos').off('click');
    $('ul').off('click');
    $('.display-winner').text('');
    $('.display-winner').addClass('hidden');
    const $pos = $('.pos');
    $('.pos').removeClass('O-hovered');
    $('.pos').removeClass('X-hovered');
    $pos.addClass('unplayed');
    $pos.removeClass('winner');
    $pos.text('');
    $pos.removeClass("X-played");
    $pos.removeClass("O-played");
  }
  makeAIMove(){
    //if(this.game.ai) called before calling this
    //need to check if playing with AI first, then check if its ai's turn
    if( this.game.ai && (this.game.currPlayerMark === this.game.aiMark) ){
        let aiMove  = this.game.aiPlayer.getBestMove(this.game.board);
        let aiMark = this.game.currPlayerMark;
        let $aiSquare = $(`[data-pos= "${aiMove}"]`);
        //checks if valid move (unplayed square)
        if($aiSquare.hasClass("unplayed")){
          $aiSquare.removeClass('unplayed');
          $('.pos').removeClass(aiMark + "-hovered");
          $aiSquare.text(aiMark);
          $aiSquare.addClass(aiMark + "-played");
          this.game.makeMove(aiMove);
          this.checkForWin();
        }
      }
  }

  //change square on grid after current player makes a move (display mark with associated color)
  makeMove() {
    $('ul.row').on('click', 'li.pos', (event)=>{
      const $square = $(event.currentTarget);
      if(!(this.game.isOver())){
        const pos = $square.attr('data-pos');
        const selected_position = [parseInt(pos[0]), parseInt(pos[2])];
        let playerMark = this.game.currPlayerMark;
        //checks if valid move (unplayed square)
        if($square.hasClass("unplayed")){
          $square.removeClass('unplayed');
          $('.pos').removeClass(playerMark + "-hovered");
          $square.text(playerMark);
          $square.addClass(playerMark + "-played");
          this.game.makeMove(selected_position);
          let win = this.checkForWin();
          if(!(win) && this.game.ai){
              this.makeAIMove();
          }
        }
      }
    });
  }
  //helper for player hover (determine if it is aiMove or not)
  aiMove(game){
    game = game || this.game;
    return (game.ai && (game.aiMark === game.currPlayerMark));
  }

  //change each square while current player hovers over it (display mark [x or o] with associated color [red or blue]
  playerHover(){
    const game = this.game;
    const aiMove = this.aiMove(game);
    $('.unplayed').hover(
      function(){
        let playerMark = game.currPlayerMark;
        if(!(game.isOver()) && !(aiMove)){
          //let color = playerMark == 'O' ? 'blue':'red';
          $(this).addClass(playerMark + "-hovered");
        }
      },
      function(){
        let playerMark = game.currPlayerMark;
        if( !(game.isOver()) && !(aiMove)){
          //.hovered
          $(this).removeClass(playerMark + "-hovered");
        }
      }
    );
  }

  //hide/show main menu
  hideMenu(){
    $('.game-menu').addClass('hidden');
  }
  showMenu(){
    $('.game-menu').removeClass('hidden');
  }

  //only show choose player mark/ ai level if opponent is AI in menu
  activateAIMenu(){
    let $opponent_selection = $('#opponent');
    $opponent_selection.change(function(){
      if($(this).val() === 'AI'){
        $('.play-AI-options').removeClass('hidden');
      }
      else{
        $('.play-AI-options').addClass('hidden');
      }
    });
  }
  hideAIMenu(){
    $('.play-AI-options').addClass('hidden');
  }
  showAIMenu(){
    $('.play-AI-options').removeClass('hidden');
  }

  //setup blank board
  setupBoard() {
    const $grid = $('<div>').addClass('grid');
    for(let rowIdx=0; rowIdx <3; rowIdx++){
      const $row = $("<ul>").addClass('row').attr('data-rowNum', rowIdx);
      for(let colIdx =0; colIdx < 3; colIdx++){
        let $pos = $("<li>").addClass("pos unplayed").attr('data-pos', [rowIdx, colIdx]);
        $row.append($pos);
      }
      $grid.append($row);
    }
    this.$el.append($grid);
  }
}

module.exports = View;
