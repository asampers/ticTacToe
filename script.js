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

  const displayToken = (coord, player) => {
    if (board[coord[0][coord[1]]]) return;
    board[coord[0][coord[1]]].addToken(player);
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

  const playRound = (coord) => {
    board.displayToken(coord, getActivePlayer().token);
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
        // Create a data attribute to identify the column
        // This makes it easier to pass into our `playRound` function 
        cellButton.dataset.coord = `[${ind}][${index}]`;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
      })
    })
  } 

  // Initial render
  updateScreen();
  return{game};
})();

//let board = gameboard.printBoard()
