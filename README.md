# Tic-Tac-Toe

[![JavaScript](https://img.shields.io/badge/javascript-%23323330.svg?style=for-the-badge&logo=javascript&logoColor=%23F7DF1E)](https://developer.mozilla.org/en-US/docs/Web/javascript)
[![NodeJS](https://img.shields.io/badge/node.js-6DA55F?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/en/)
[![jQuery](https://img.shields.io/badge/jquery-%230769AD.svg?style=for-the-badge&logo=jquery&logoColor=white)](https://jquery.com/)
[![HTML5](https://img.shields.io/badge/html5-%23E34F26.svg?style=for-the-badge&logo=html5&logoColor=white)](https://html.spec.whatwg.org/)
[![CSS3](https://img.shields.io/badge/css3-%231572B6.svg?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)


Game Demo at: https://noahhendlish.github.io/Tic-Tac-Toe/

**The game follows the basic rules of Tic-Tac-Toe**
  - Two players take turns placing their marks, X or O, on empty positions of a 3x3 grid. X plays first.
  - To win, a player must form a string of three of their marks placed adjacent to one another vertically, horizontally, or diagonal.
  - The game ends either when a player wins or the grid is full and there are no more possible moves, resulting in a draw or 'tie-game'.

**About the Game**

The game was built using Javascript (Node.JS and jQuery) with some HTML and CSS. My first implementation of this game was console-based (./src/game/playScript.js) where two individuals could play against each other, entering the positions for their moves. I then built an "AI Player" that uses a [MiniMax](https://en.wikipedia.org/wiki/Minimax)  algorithm to pick its next move and a web UI using jQuery, HTML, and CSS.

In the [demo](https://noahhendlish.github.io/Tic-Tac-Toe/), you can choose to play against another person locally on the same device or against an AI. When playing the AI, you can choose your mark and the difficulty level of the AI; X still plays first. The difficulty levels for the AI, *Beginner*, *Easy*, *Normal*, *Hard*, *Pro*, and *Impossible*, correspond to the maximum depths of the MiniMax game tree, *1*, *2*, *3*, *4*, *5*, and *max possible depth*.


**My Motivations for Creating this Game**

  - To better familiarize myself with jQuery and javascript on the front-end
  - To understand how to build an AI player that utilizes [MiniMax](https://en.wikipedia.org/wiki/Minimax) 

**A Little Background on the Game**

A couple days before starting this project, I was attempting a similar project where I was building an AI player with a MinMax algorithm in Javascript for the game Reversi. After building the basic game-play logic, so that two humans could play each other, I tried building out a game tree with all possible board states. I hadn't thought too much about the size and complexity of building the game tree, especially given the limits of Javascript and its performance relative to other languages like Java, C, and C++. It didn't take long for me to realize that building an AI purely in Javascript, only using MiniMax, for a complex game like Reversi would be infeasible. After reading a research paper titled ['Learning a Reversi Board Evaluator with MiniMax'](https://www.cs.umd.edu/sites/default/files/scholarly_papers/Engel.pdf), I was relieved to find that the Reversi AI project wouldn't be impossible. I could have continued on with the Reversi MiniMax AI, limiting the maximum depth of the tree and incorporating alpha-beta pruning, but I figured that I'd be better off starting with writing a MiniMax for a simpler game like Tic-Tac-Toe first.
