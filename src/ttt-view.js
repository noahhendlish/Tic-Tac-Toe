const Game = require("./game/game");

class View {
  constructor($el, game = null) {
    this.$el = $el;
    this.game = game;
    this.setupBoard();
    this.playing = false;
  }

  //binds menu events
  bindMenuEvents(){
  //enables toggling of AI menu
    this.activateAIMenuEvent();
    //hover over square with mouse
    this.replayGameEvent();
    //start button in main menu
    this.startButtonEvent();
    this.select2Events();
  }

  //binds game play events
  bindGamePlayEvents(){
    this.makeMoveEvent();
    this.playerHoverEvent();
  }

  //binds all events (game play and menu)
  bindEvents() {
    //EVENTs for:
    this.select2Events();
    //enables toggling of AI menu
    this.activateAIMenuEvent();
    //hover over square with mouse
    this.playerHoverEvent();
    //start button in main menu
    this.startButtonEvent();
    //click to make move
    this.makeMoveEvent();
    //new game (after game over)
    this.replayGameEvent();

  }

  select2Events(){
    // select2 (drop-downs) event handlers (allows control over options selector width and removes the default search from drop down)
    $('.selection-dropdown').select2({
    width: 'resolve',
    minimumResultsForSearch: Infinity
    });
  }
  //event handler for new game (from main menu)
  startButtonEvent(){
    $('.start-game-button').on('click',  (e)=> {
      if(this.playing === false){
        e.preventDefault();
        setTimeout(()=>{
          this.fadeOutMenu();
        }, 1);
        let $opponent = $('#opponent').val();
        if($opponent === 'Human'){
          this.playHuman();
        } else{
          let mark = $('#player-mark').val();
          let aiLevel = parseInt($('#ai-level').val());
          let aiMark = (mark === 'X') ? 'O' : 'X';
          this.playAI(aiMark, aiLevel);
        }
      }
    });
  }

  //event handler for new game (after game over)
  replayGameEvent(){
    $('.new-game-button').on('click', (e)=>{
      if (this.playing === false){
        e.preventDefault();
        $('.winner-modal').fadeOut(500, ()=>{
          $('.mark').fadeOut(500);
          $('.pos').fadeTo(400, 0.4,()=>{
            this.resetBoard();
            $('.pos').fadeTo(100, 1, ()=>{
            this.fadeInMenu();
            });
          });
        });
      }
    });
  }

  //change square on grid after current player makes a move (display mark with associated color)
  makeMoveEvent() {
    $('ul.row').on('click', 'li.pos', (event)=>{
      if (this.playing === true){ //check if playing game
        const $square = $(event.currentTarget);
        if(!(this.game.isOver())){
          const pos = $square.attr('data-pos');
          const selected_position = [parseInt(pos[0]), parseInt(pos[2])];
          let playerMark = this.game.currPlayerMark;
          //let $dataPosSq = $(`[data-pos= "${selected_position}"]`); //-- another way of getting currentTarget
          //checks if valid move (unplayed square)
          if($square.hasClass("unplayed")){
            $square.removeClass('unplayed');
            $('.pos').removeClass(playerMark + "-hovered");
            $square.addClass(playerMark + "-played");
            this.addMark($square, playerMark);
            this.game.makeMove(selected_position);
            let win = this.checkForWin();
            if(!(win) && this.game.ai){
                this.makeAIMove();
            }
          }
        }
      }
    });
  }
  //change each square while current player hovers over it (display mark [x or o] with associated color [red or blue]
  playerHoverEvent(){
    $('ul.row').on('mouseenter', 'li.unplayed', (event)=>{
      if (this.playing === true){
        const $square = $(event.currentTarget);
        let playerMark = this.game.currPlayerMark;
        if(!(this.game.isOver()) && !(this.aiMove(this.game))){
            $square.addClass(playerMark + "-hovered");
      }
      }
    });
    $('ul.row').on('mouseleave', 'li.unplayed', (event)=>{
      if (this.playing === true){
        const $square = $(event.currentTarget);
        let playerMark = this.game.currPlayerMark;
        if( !(this.game.isOver()) && !(this.aiMove(this.game))){
            $square.removeClass(playerMark + "-hovered");
        }
      }
    });
  }

  //only show choose player mark/ ai level if opponent is AI in menu
  activateAIMenuEvent(){
    let that = this;
    let $opponent_selection = $('#opponent');
    $opponent_selection.change(function(){
      if($(this).val() === 'AI'){
        that.showAIMenu();
      }
      else{
        that.hideAIMenu();
      }
    });
  }

  //binds menu events, resets board, displays menu, binds game play events
  startNewGame(){
    this.bindMenuEvents();
    this.resetBoard();
    this.fadeInMenu();
    this.bindGamePlayEvents();
  }
    //helper for new game against AI
  playAI(aiMark, aiLevel){
    this.game = new Game(true, aiMark, aiLevel);
    this.playing = true;
    if(aiMark === 'X'){ //X plays first, if AI first, ai makes move
      this.makeAIMove();
    }
  }

  //helper for new game against human
  playHuman(){
    this.game = new Game();
    this.playing = true;
  }

  //end game-- display winner at end of game (then resets game-- loads menu)
  endGame(){
      this.playing = false;
      let winner = this.game.winner();
      let win_msg = ''
      if(winner === null){
        win_msg = 'Tie Game';
      }
      else{ //if not a tie, display the 3 winning marks
        this.highlightWinningSquares(winner);
        win_msg = winner + ' Wins!';
      }
      this.clicks = 0;
      $('.winner-header').text(win_msg);
      $('.winner-modal').fadeIn(500);
  }

  //highlights winning squares ()
  highlightWinningSquares(winnerMark){
    winnerMark = winnerMark || this.game.winner();
    let winningPositions = this.game.winningPositions(winnerMark);
    for(let i=0; i< winningPositions.length; i++){
      let winPos = winningPositions[i];
      let $winPos = $(`[data-pos= "${winPos}"]`);
      $winPos.addClass(winnerMark + "-wins").fadeIn(500);
    }
  }

  //check if game is over, if it is, call endGame()
  checkForWin(){
    if(this.game.isOver()){
      this.endGame();
      return true;
    }
    return false;
  }

  //reset board display (all squares blank) -- removes classes for display, adds 'hidden class' to end of game display modal (winner-modal)
  resetBoard(){
    const $square = $(".pos, .unplayed, .mark");
    const $pos = $('.pos');
    $('.winner-header').text('');
    $('.winner-modal').addClass('hidden');
    $square.removeClass('O-hovered X-hovered X-played O-played X-wins O-wins winner reset-square-background');
    $pos.addClass('unplayed');
    $square.text('');
  }

  //helper to make AI move
  makeAIMove(){
    //if(this.game.ai) called before calling this
    //**need to check if playing with AI first, then check if its ai's turn
    if( this.playing && this.game.ai && (this.game.currPlayerMark === this.game.aiMark) ){
        let aiMove  = this.game.aiPlayer.getBestMove(this.game.board);
        let aiMark = this.game.currPlayerMark;
        let $aiSquare = $(`[data-pos= "${aiMove}"]`);
        //checks if valid move (unplayed square)
        if($aiSquare.hasClass("unplayed")){
          $aiSquare.removeClass('unplayed');
          $('.pos').removeClass(aiMark + "-hovered");
          $aiSquare.addClass(aiMark + "-played");
          this.addMark($aiSquare, aiMark);
          this.game.makeMove(aiMove);
          this.checkForWin();
        }
      }
  }

  //add X or O mark as span inside of li (.pos class)
  addMark($square, mark){
    let markTxt = $("<span>").addClass('mark').text(mark).fadeIn(500);
      $square. append(markTxt);
  }

  //helper for player hover (determine if it is aiMove or not)
  aiMove(game){
    game = game || this.game;
    return (game.ai && (game.aiMark === game.currPlayerMark));
  }

  //hide/show main menu
  hideMenu(){
    $('.game-menu').addClass('hidden');
  }
  showMenu(){
    $('.game-menu').removeClass('hidden');
  }
  //hide/show main menu with fade animation
  fadeOutMenu(){
    $('.game-menu').fadeOut();
  }
  fadeInMenu(){
    $('.game-menu').fadeIn();
  }

  //hide/show AI options in Menu
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

   unbindGamePlayEvents(){
    const $eventSelectors = $(".pos, .unplayed, .mark, li, ul, .row")
    $eventSelectors.off( "mouseenter mouseleave click");
  }
  //unbinds all set events
  unbindEvents(){
    const $eventSelectors = $(".pos, .unplayed, .mark, li, button, .start-game-button, .new-game-button, ul, .row");
    $eventSelectors.off( "mousedown mouseup mouseenter mouseleave click");
  }
}

module.exports = View;
