const Cell = () => {
  let value = null;

  const addToken = (player) => {
    value = player;
  };

  const isOccupied = () => {
    return (value === null) ? false : true;
  }

  const getValue = () => value;

  return {addToken, getValue, isOccupied};
}

const gameboard = (() => {
  const rows = 3;
  const columns = 3;
  const board = [];
  
  for (let i = 0; i < rows * columns; i++) {
    board.push(Cell());
  };

  const getBoard = () => board;

  const printBoard = () => {
    const boardWithCellValues = board.map((cell) => cell.getValue());
    console.log(boardWithCellValues);
  };

  const displayToken = (i, player) => {
    board[i].addToken(player);
  };

  return {printBoard, getBoard, displayToken};
})();

const Player = (name, token) => {
  return {name, token};
}

const message = ((player) => {
  const win = () => {
    return `Congratulations ${player}! You won!`
  };

  const draw = () => {
    return "Game Over - It's a draw"
  };

  const displayOutcome = (item) => {
    console.log(item)
    alert(item === 'win' ? win() : draw());
  }

  return {displayOutcome};
})

const GameController = () => {
  const board = gameboard;
  const players = [Player('anna','X'), Player('andrew', 'O')];
  const winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let activePlayer = players[0];

  const getActivePlayer = () => activePlayer;
  
  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  }

  const playerHasWon = () => {
    return winCombos.some((line) => 
      line.every((position) => 
        board.getBoard()[position].getValue() === getActivePlayer().token)
    );
  }

  const gameIsTied = () => {
    return (board.getBoard().every((cell) => cell.isOccupied()));
  }

  const endGameCheck = () => {
    if (playerHasWon()) return 'win';
    if (gameIsTied()) return 'draw';
  }

  const playRound = (cell) => {
    board.displayToken(cell, getActivePlayer().token);
    board.printBoard();
    console.log(endGameCheck());
    switchPlayerTurn();
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
    board.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the row and column
        cellButton.dataset.index = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
    })
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.index;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedCell) return;
    if (game.getBoard()[selectedCell].isOccupied()) {
      return alert('Please select an open square!');
    }
    game.playRound(selectedCell);
    updateScreen();
  }
  boardDiv.addEventListener("click", clickHandlerBoard);

  // Initial render
  updateScreen();
  return{game};
})();

