var initialBoard;
const humanPlayer = "X";
const aiPlayer = "O";
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
}

function turnClick(e) {
  turn(e.target.id, humanPlayer);
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
      gameWon.player == humanPlayer ? "blue" : "red";
  }
  for (let i = 0; i < cell.length; i++) {
    cell[i].removeEventListener("click", turnClick, false);
  }
}
