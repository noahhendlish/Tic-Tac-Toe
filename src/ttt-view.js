const Game = require("./game/game");

class View {
  constructor(game, $el) {
    this.game = game;
    this.$el = $el;
  }
  start(){

  }

  bindEvents() {
    $('.selection-dropdown').select2({
    width: 'resolve',
    minimumResultsForSearch: Infinity
    });
    //toggle AI menu
    /*if(this.game === null){
      if($('.game-menu').hasClass('hide-menu')){
        this.game = new Game();
      }
    }*/

    this.toggleAIMenu();
    //this.startGame();
    //this.playerHover();
    //this.makeMove();

    /*let gameOverCheck = setInterval(
      ()=>{
        this.checkForWin();
        if(this.game.isOver()){
          clearInterval(gameOverCheck);
        }
      }, 1000
    );*/
    //
    //change each square while current player hovers over it (display mark [x or o] with associated color [red or blue])
    //change square on grid after current player makes a move (display mark with associated color)
    //load menu on end of game
    //make AI move
  }
  startGame(){
    $('.start-game-button').on('click',  (e)=> {
        e.preventDefault();
        //console.log(e);
        let $opponent = $('#opponent').val();
        if($opponent === 'Human'){
          this.game = new Game();
        } else{
          let mark = $('#player-mark').val();
          let aiLevel = $('#ai-level').val();
          let aiMark = (mark === 'X') ? 'O' : 'X';
          this.game= new Game(true, aiMark, parseInt(aiLevel));
        }
        //this.toggleMenu()
    });
  }

  toggleMenu(){
    $('.game-menu').toggleClass('hide-menu');
  }
  /*toggleAISlideDownMenu(){
      $( ".play-AI-options" ).slideDown( "slow", function() {
          // Animation complete.
          });
    }
  }*/
  toggleAIMenu(){
    let $opponent_selection = $('#opponent');
    $opponent_selection.change(function(){
      if($(this).val() === 'AI'){
        $('.play-AI-options').removeClass('hide-menu');
      }
      else{
        $('.play-AI-options').addClass('hide-menu');
      }
    });
  }

  displayWinner(){
      let winner = this.game.winner();
      let win_msg = ''
      if(winner === null){
        win_msg = 'Tie Game';
      }
      else{
        win_msg = winner + ' Wins!';
      }
      //$('.display-winner').text(win_msg);
      //$('.display-winner').removeClass('hidden');
      /*setTimeout(()=>{
        $('.display-winner').text('');
        $('.display-winner').addClass('hidden');
      }, 1000);*/
      this.newGameReset();
  }

  checkForWin(){
    if(this.game.isOver()){
      this.displayWinner();
    }
  }
  newGameReset(){
    this.resetBoard();
    this.toggleMenu();
    this.bindEvents();
  }
  resetBoard() {
    const $pos = $('.pos');
    $pos.addClass('unplayed');
    $pos.text('');
    $pos.removeClass("X-played");
    $pos.removeClass("O-played");
  }

  makeMove() {
    $('ul.row').on('click', 'li.pos', (event)=>{
      const $square = $(event.currentTarget);
      if(!(this.game.isOver())){
        const pos = $square.attr('data-pos');
        const selected_position = [parseInt(pos[0]), parseInt(pos[2])];
        let playerMark = this.game.currPlayerMark;
        if($square.hasClass("unplayed")){
          $square.removeClass('unplayed');
          $square.text(playerMark);
          $square.addClass(playerMark + "-played");
          this.game.makeMove(selected_position);
        }
      }
    });
  }
  playerHover(){
    const game = this.game;
    $('.pos').hover(
      function(){
        if(($(this).hasClass("unplayed")) && !(game.isOver())){
          let playerMark = game.currPlayerMark;
          let color = playerMark == 'O' ? 'blue':'red';
          $(this).css('color', color);
          $(this).text(playerMark);
        }
      },
      function(){
        if(($(this).hasClass("unplayed")) && !(game.isOver())){
          $(this).text('');
          $(this).css('color', 'black');
        }
      }
    );
  }


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
