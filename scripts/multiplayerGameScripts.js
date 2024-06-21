// Initializing Game class instance for multiplayer game mode
const gameGridAObject = new Game(8 * 8, 'gameGridA', 'multiplayer', 'A');
const gameGridBObject = new Game(8 * 8, 'gameGridB', 'multiplayer', 'B');

/* Event listener for the reset button click event. 
Resets both game grids and handles the button click. */
const resetButton = document.getElementById("reset-button");
resetButton.addEventListener('click', () => {
  gameGridAObject.resetGame();
  gameGridBObject.resetGame();
  resetButtonClickHandler();
});
// Adding event listeners to play/pause buttons
const playPauseButtonA = document.getElementsByClassName("play-pause-button")[0];
const playPauseButtonB = document.getElementsByClassName("play-pause-button")[1];
playPauseButtonA.addEventListener('click', () => gameGridAObject.playPauseGame());
playPauseButtonB.addEventListener('click', () => gameGridBObject.playPauseGame());

// Setting size of the cells based on the grid size for better responsivity
const cells = document.getElementsByClassName('cell');
// Listen for changes in the DOM
const gridSizeObserver = new MutationObserver(() => {
  if (gameGridAObject.getGameGridArea === 10 * 10 && gameGridBObject.getGameGridArea === 10 * 10) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.width = '7vw';
      cells[i].style.height = '7vw';
      cells[i].style.minWidth = '15px';
      cells[i].style.minHeight = '15px';
      cells[i].style.maxWidth = '51.45px';
      cells[i].style.maxHeight = '51.45px';
    }
  }
  else if (gameGridAObject.getGameGridArea === 6 * 6 && gameGridBObject.getGameGridArea === 6 * 6) {
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

gridSizeObserver.observe(document.body, { subtree: true, childList: true });

// Retrieve the stored grid size from local storage
const storedGridSize = eval(localStorage.getItem('gridSize'));

// Set the initial grid size on page load
if (storedGridSize) {
  gameGridAObject.setGameGridArea = storedGridSize;
  gameGridBObject.setGameGridArea = storedGridSize;
}

// Listen for messages from the parent window
window.addEventListener('message', (event) => {
  const { type, gridSize } = event.data;

  if (type === 'setGridSize') {
    // Update the gameGridObject instances with the specified grid size
    gameGridAObject.getGameGrid.style.animation = "change-grid 1s";
    gameGridBObject.getGameGrid.style.animation = "change-grid 1s";
    setTimeout(() => {
      gameGridAObject.getGameGrid.style.animation = "unset";
      gameGridBObject.getGameGrid.style.animation = "unset";
    }, 1000);
    gameGridAObject.setGameGridArea = gridSize;
    gameGridBObject.setGameGridArea = gridSize;
  }
});

/* Multiplayer rounds handling */

let roundsEnded = false;

/**
 * Initializes the multiplayer rounds.
 * Adjusts the display and functionality of game grids based on game status.
 * 
 * @param {void}
 * @returns {void}
 */
function initializeMultiplayerRounds() {
  roundsEnded = false;

  if (gameGridAObject.gameHasStarted) {
    gameGridBObject.getGameGrid.style.filter = 'blur(10px)';
    gameGridBObject.getGameGrid.style.pointerEvents = 'none';
    gameGridBObject.getPlayPauseButton.style.display = 'none';
    gameGridBObject.getTimeDisplay.style.display = 'none';
    gameGridBObject.getProgressBar.style.display = 'none';
  } else if (gameGridBObject.gameHasStarted) {
    gameGridAObject.getGameGrid.style.filter = 'blur(10px)';
    gameGridAObject.getGameGrid.style.pointerEvents = 'none';
    gameGridAObject.getPlayPauseButton.style.display = 'none';
    gameGridAObject.getTimeDisplay.style.display = 'none';
    gameGridAObject.getProgressBar.style.display = 'none';

    gameGridBObject.getPlayPauseButton.style.display = 'flex';
    gameGridBObject.getTimeDisplay.style.display = 'block';
    gameGridBObject.getProgressBar.style.display = 'flex';
  }
}

/* Mutation observer for changes in the DOM.
Handles multiplayer rounds, displaying of elements, and game status. */
const multiplayerObserver = new MutationObserver(() => {
  initializeMultiplayerRounds();

  if ((gameGridAObject.gameIsOver || gameGridBObject.gameIsOver) && !roundsEnded) {
    setTimeout(() => {
      resetButton.click();
    }, 1000);

    roundsEnded = true;
  } else if (gameGridAObject.seconds >= 30) {
    gameGridAObject.seconds = 0;
    gameGridAObject.endGame();
    gameGridAObject.getGameGrid.style.filter = 'blur(10px)';
    gameGridAObject.getGameGrid.style.pointerEvents = 'none';
    gameGridAObject.getPlayPauseButton.style.display = 'none';
    gameGridAObject.getTimeDisplay.style.display = 'none';
    gameGridAObject.getProgressBar.style.display = 'none';

    gameGridBObject.startGame();
    gameGridBObject.getGameGrid.style.filter = 'unset';
    gameGridBObject.getGameGrid.style.pointerEvents = 'unset';
    gameGridBObject.getPlayPauseButton.style.display = 'flex';
    gameGridBObject.getTimeDisplay.style.display = 'block';
    gameGridBObject.getProgressBar.style.display = 'flex';
  } else if (gameGridBObject.seconds >= 30) {
    gameGridBObject.seconds = 0;
    gameGridBObject.endGame();
    gameGridBObject.getGameGrid.style.filter = 'blur(10px)';
    gameGridBObject.getGameGrid.style.pointerEvents = 'none';
    gameGridBObject.getPlayPauseButton.style.display = 'none';
    gameGridBObject.getTimeDisplay.style.display = 'none';
    gameGridBObject.getProgressBar.style.display = 'none';

    gameGridAObject.getGameGrid.style.filter = 'unset';
    gameGridAObject.getGameGrid.style.pointerEvents = 'unset';
    gameGridAObject.getPlayPauseButton.style.display = 'flex';
    gameGridAObject.getTimeDisplay.style.display = 'block';
    gameGridAObject.getProgressBar.style.display = 'flex';
    gameGridAObject.startGame();
  }
});

multiplayerObserver.observe(document.body, { childList: true, subtree: true });

/**
 * Handles the reset button click event.
 * Ensures the displayed DOM elements after the end of a multiplayer game are 
 * always those associated to gameGridAObject.
 * 
 * @param {void}
 * @returns {void}
 */
function resetButtonClickHandler() {
  gameGridBObject.getPlayPauseButton.style.display = 'none';
  gameGridBObject.getTimeDisplay.style.display = 'none';
  gameGridBObject.getProgressBar.style.display = 'none';

  gameGridAObject.getPlayPauseButton.style.display = 'flex';
  gameGridAObject.getTimeDisplay.style.display = 'block';
  gameGridAObject.getProgressBar.style.display = 'flex';
}
