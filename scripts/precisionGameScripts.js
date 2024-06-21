// Initializing Game class instance for classic game mode
const gameGridObject = new Game(8 * 8, 'gameGrid', 'precision');

// Adding event listener to play/pause button
const playPauseButton = document.getElementsByClassName("play-pause-button")[0];
playPauseButton.addEventListener('click', () => gameGridObject.playPauseGame());
// Adding event listener to reset button
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener('click', () => gameGridObject.resetGame());
// Adding event listener to AI mode button
const AIModeButton = document.getElementById("ai-mode-button");
AIModeButton.addEventListener('click', () => {
  if (!gameGridObject.isAIMatch) {
    gameGridObject.AIMatch();
  }
});

// Setting size of the cells based on the grid size for better responsivity
const cells = document.getElementsByClassName('cell');
// Listen for changes in the DOM
const observer = new MutationObserver(() => {
  if (gameGridObject.getGameGridArea === 10 * 10) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.width = '7vw';
      cells[i].style.height = '7vw';
      cells[i].style.minWidth = '15px';
      cells[i].style.minHeight = '15px';
      cells[i].style.maxWidth = '51.45px';
      cells[i].style.maxHeight = '51.45px';
    }
  }
  else if (gameGridObject.getGameGridArea === 6 * 6) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.width = '13.5vw';
      cells[i].style.height = '13.5vw';
      cells[i].style.minWidth = '30px';
      cells[i].style.minHeight = '30px';
      cells[i].style.maxWidth = '87.7px';
      cells[i].style.maxHeight = '87.7px';
    }
  }
  else {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.width = '10vw';
      cells[i].style.height = '10vw';
    }
  }
});

observer.observe(document.body, { subtree: true, childList: true });

// Retrieve the stored grid size from local storage
const storedGridSize = eval(localStorage.getItem('gridSize'));

// Set the initial grid size on page load
if (storedGridSize) {
  gameGridObject.setGameGridArea = storedGridSize;
}

// Listen for messages from the parent window
window.addEventListener('message', (event) => {
  const { type, gridSize } = event.data;

  if (type === 'setGridSize') {
    // Update the gameGridObject instance with the specified grid size
    gameGridObject.getGameGrid.style.animation = "change-grid 1s";
    setTimeout(() => {
      gameGridObject.getGameGrid.style.animation = "unset";
    }, 1000);
    gameGridObject.setGameGridArea = gridSize;
  }
});