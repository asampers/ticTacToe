const Cell = () => {
  let value = 0;

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {addToken, getValue};
}

const gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];
  
  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  const display = () => {
    const rows = document.getElementById('gameboard');
    for (const child of rows.children) {
      child.innerHTML = board[child.id]
    };
    };
  return {display, printBoard};
})();

const Player = (name, token) => {
  const getName = () => name;
  const getToken = () => token;
  return {getName, getToken};
}

const GameController = () => {
  const board = gameboard;
  const players = [Player('anna','X'), Player('andrew', 'O')];
  return {players}
}


gameboard.display()
gameboard.printBoard()
const game = GameController()