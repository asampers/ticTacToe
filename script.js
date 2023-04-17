const gameboard = (() => {
  let board = ['x','o','x','o','x','o','x','o','x'];
  
  const display = () => {
    const rows = document.getElementById('gameboard');
    for (const child of rows.children) {
      child.innerHTML = board[child.id - 1]
    };
    };
  return { display };
})();

gameboard.display()