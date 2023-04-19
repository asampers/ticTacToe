const Cell = () => {
  let value = null;

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

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithCellValues = board.map((row) => row.map((cell) => cell.getValue()))
    console.log(boardWithCellValues);
  };

  const displayToken = (x, y, player) => {
    if (!board[x][y] === null) return;
    board[x][y].addToken(player);
  };

  return {printBoard, getBoard, displayToken};
})();

const Player = (name, token) => {
  return {name, token};
}

const GameController = () => {
  const board = gameboard;
  const players = [Player('anna','X'), Player('andrew', 'O')];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const playRound = (x, y) => {
    board.displayToken(x, y, getActivePlayer().token);
    switchPlayerTurn();
    board.printBoard();
  }
  return {getBoard: board.getBoard, getActivePlayer, playRound};
}

const screenController = (() => {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const boardDiv = document.querySelector('#gameboard');

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

  // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

    // Render board squares
    board.forEach((row, ind) => {
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the row and column
        cellButton.dataset.row = ind;
        cellButton.dataset.column = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  } 

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedRow = e.target.dataset.row
    const selectedColumn = e.target.dataset.column;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedColumn && !selectedRow) return;
    
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
  return{game};
})();

