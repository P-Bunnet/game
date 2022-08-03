var initialBoard;
let humanPlayer = "X";
let aiPlayer = "O";
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

const cell = document.querySelectorAll(".cell");
startGame();
function startGame() {
  document.querySelector(".endgame").style.display = "none";
  initialBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cell.length; i++) {
    cell[i].innerText = "";
    cell[i].style.removeProperty("background-color");
    cell[i].addEventListener("click", turnClick, false);
  }
  turn(bestSpot(), aiPlayer);
}

function turnClick(e) {
  if (typeof initialBoard[e.target.id] == "number") {
    if (checkTie()) return;
    turn(e.target.id, humanPlayer);
    // check win before ai turn
    if (!checkWin(initialBoard, humanPlayer) && !checkTie()) {
      turn(bestSpot(), aiPlayer);
    }
  }
}

function turn(squareId, player) {
  initialBoard[squareId] = player;
  document.getElementById(squareId).innerText = player;
  let gameWon = checkWin(initialBoard, player);
  if (gameWon) gameOver(gameWon);
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);

  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every((elem) => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == humanPlayer ? "#00ff7b" : "#d63147";
  }
  for (let i = 0; i < cell.length; i++) {
    cell[i].removeEventListener("click", turnClick, false);
  }
  declareWinner(
    gameWon.player == humanPlayer
      ? "You win! (-■_■)"
      : "You lose! (╯°□°)╯︵ ┻━┻"
  );
}
function emptySquare() {
  return initialBoard.filter((s) => typeof s == "number");
}
function bestSpot() {
  return minimax(initialBoard, aiPlayer).index;
}

function checkTie() {
  if (emptySquare().length == 0) {
    for (let i = 0; i < cell.length; i++) {
      cell[i].style.backgroundColor = "green";
      cell[i].removeEventListener("click", turnClick, false);
    }
    declareWinner("Tie Game!");
    return true;
  }
  return false;
}

function declareWinner(winner) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = winner;
}

function minimax(newBoard, player) {
  var availableBoxes = emptySquare();

  if (checkWin(newBoard, humanPlayer)) {
    return { score: -10 };
  } else if (checkWin(newBoard, aiPlayer)) {
    return { score: 10 };
  } else if (availableBoxes.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availableBoxes.length; i++) {
    var move = {};
    move.index = newBoard[availableBoxes[i]];
    newBoard[availableBoxes[i]] = player;

    if (player == aiPlayer) {
      var result = minimax(newBoard, humanPlayer);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, aiPlayer);
      move.score = result.score;
    }

    newBoard[availableBoxes[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === aiPlayer) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

// let user switch symbols

function selectSym(symbol) {
  humanPlayer = symbol;
  aiPlayer = symbol == "X" ? "O" : "X";
  initialBoard = Array.from(Array(9).keys());
  for (let i = 0; i < cell.length; i++) {
    cell[i].addEventListener("click", turnClick, false);
  }

  document.querySelector(".selectSym").style.display = "none";
}
