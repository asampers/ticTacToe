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

  const resetBoard = () => {
    board.length = 0;
    for (let i = 0; i < rows * columns; i++) {
      board.push(Cell());
    };
  }

  const printBoard = () => {
    const boardWithCellValues = board.map((cell) => cell.getValue());
    console.log(boardWithCellValues);
  };

  const displayToken = (i, player) => {
    board[i].addToken(player);
  };

  return {printBoard, getBoard, resetBoard, displayToken};
})();

const Player = (name, token) => {
  return {name, token};
}

const message = ((player) => {
  const win = () => {
    return `Congratulations, ${player.toUpperCase()}! You won!`;
  }

  const draw = () => {
    return "Game Over - It's a draw";
  }

  const occupied = () =>  {
      return alert('Please select an open square!');
  }

  const displayOutcome = (item) => {
    if (item === 'win') return win();
    if (item === 'draw') return draw();
  }

  return {displayOutcome, occupied};
})

const GameController = () => {
  const board = gameboard;
  const players = [];
  const winCombos = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
  let activePlayer;

  const getActivePlayer = () => activePlayer;
  
  const addPlayer = (player1, player2) => {
    players.push(player1)
    players.push(player2)
    activePlayer = players[0];
  }

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

  const gameOver = () => {
    if (playerHasWon()) return 'win';
    if (gameIsTied()) return 'draw';
    return null;
  }

  const playRound = (cell) => {
    board.displayToken(cell, getActivePlayer().token);
    board.printBoard();
    if (gameOver()) return gameOver();
    switchPlayerTurn();
  }
  return {getBoard: board.getBoard, getActivePlayer, addPlayer, switchPlayerTurn, playRound};
}

const screenController = (() => {
  const game = GameController();
  const playerInfoDiv = document.querySelector('.info');
  const boardDiv = document.querySelector('#gameboard');
  const playerForm = document.querySelector('.player-form');
  
  playerInfoDiv.textContent = "Please enter player names.";
  
  playerForm.addEventListener("submit", (event) => {
    event.preventDefault();
    let formValue = event.target.elements;
    console.log(formValue.player1Name.value);
    const player1 = Player((formValue.player1Name.value), "X");
    const player2 = Player((formValue.player2Name.value), "O");
    game.addPlayer(player1, player2);
    playerForm.classList.add("d-none");
    // Initial render
    updateScreen();
  })

  const updateScreen = (gameStatus) => {
    // clear the board
    boardDiv.textContent = "";

  // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Render board squares
    board.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        // Create a data attribute to identify the row and column
        cellButton.dataset.index = index;
        cellButton.textContent = cell.getValue();
        boardDiv.appendChild(cellButton);
    })

    if (gameStatus) {
      endGame(gameStatus);
    } else {
    // Display player's turn
    playerInfoDiv.textContent = `${activePlayer.name}'s turn... Please place your '${activePlayer.token}'`
    }
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedCell = e.target.dataset.index;
    // Make sure I've clicked a column and not the gaps in between
    if (!selectedCell) return;
    if (game.getBoard()[selectedCell].isOccupied()) return message().occupied();
    let gameStatus = game.playRound(selectedCell);
    updateScreen(gameStatus);
  }

  // Add event listener for playing again
  const resetGame = () => {
    game.switchPlayerTurn()
    gameboard.resetBoard();
    updateScreen();
    document.querySelector('.again').remove()
    boardDiv.addEventListener("click", clickHandlerBoard);
  }

  const endGame = (gameStatus) => {
    playerInfoDiv.textContent = message((game.getActivePlayer().name)).displayOutcome(gameStatus);
    boardDiv.removeEventListener("click", clickHandlerBoard);
    const againButton = document.createElement("button");
    againButton.classList.add("btn")
    againButton.classList.add("btn-success")
    againButton.classList.add("again")
    againButton.textContent = 'Play Again?'
    document.querySelector('.play-again').appendChild(againButton);
    againButton.addEventListener("click", resetGame)
  }

  boardDiv.addEventListener("click", clickHandlerBoard);
})();

