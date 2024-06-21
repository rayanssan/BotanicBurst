/**
 * Includes methods concerning the game mechanics of Botanic Burst.
 */
class Game {
  /**
   * Initializes a new Game class instance
   * with a specified area attribute and id of the game grid, and optionally, 
   * specification of one of the game modes in Botanic Burst.
   * 
   * @param {Number} gameGridArea - The area of the game grid. Has to be one of the three following sizes:
   * 8 * 8 -> Normal size grid, 6 * 6 -> Small size grid, or 10 * 10 -> Large size grid.
   * @param {String} gameGridId - The ID of the DOM element containing the game grid.
   * @param {String} gameMode - Optional specification of the game mode.
   * Can be specified to "classic" for classic game mode,
   * "multiplayer" for multiplayer game mode, "timed" for timed game mode, "precision" for precision game mode,
   * or "multiplayerAI" for multiplayer AI game mode.
   * If omitted, defaults to "classic".
   * @param {String} multiplayerID - Should only be specified for multiplayer or multiplayerAI game modes. 
   * This value indicates the associated player for the current Game instance, 
   * it should be either 'A' for player A, or 'B' for player B. In multiplayerAI 'B' should be reserved for the AI grid.
   * @returns {void}
   */
  constructor(gameGridArea, gameGridId, gameMode = 'classic', multiplayerID = null) {
    this.gameGridArea = gameGridArea;
    this.gameGrid = document.getElementById(gameGridId);
    // Setting size of the game grid
    this.gameGrid.style.gridTemplateRows = `repeat(${Math.sqrt(this.gameGridArea)}, 1fr)`;
    this.gameGrid.style.gridTemplateColumns = `repeat(${Math.sqrt(this.gameGridArea)}, 1fr)`;
    // Remove paused blur initially
    this.gameGrid.style.filter = 'unset';
    this.gameMode = gameMode;
    this.multiplayerID = multiplayerID;
    if (gameMode == 'classic' || gameMode == 'timed' || gameMode == 'precision') {
      this.playPauseButton = document.querySelector('.play-pause-button');
      this.timeDisplay = document.querySelector('.time-elapsed');
      this.scoreDisplay = document.querySelector('.score');
      this.garden = document.querySelector('.garden');
      this.gardenLen = document.querySelector('.garden-len');
      this.plantsLeftDisplay = document.querySelector('.plants-left');
    }
    else if (gameMode == 'multiplayer' || gameMode == 'multiplayerAI') {
      this.playPauseButton = document.querySelector(`.play-pause-button.play-pause-button${multiplayerID}`);
      this.timeDisplay = document.querySelector(`.time-elapsed.time-elapsed${multiplayerID}`);
      this.scoreDisplay = document.querySelector(`.score.score${multiplayerID}`);
      this.garden = document.querySelector(`.garden.garden${multiplayerID}`);
      this.gardenLen = document.querySelector(`.garden-len.garden-len${multiplayerID}`);
      this.plantsLeftDisplay = document.querySelector(`.plants-left.plants-left${multiplayerID}`);
    }

    // Array to contain created cells
    this.cells = Array.from(this.gameGrid.children);
    // Array to contain selected cells
    this.selectedCells = [];
    // Array with icons for the cells
    if (gameMode == "classic") {
      this.cellIcons = ['A', 'B', 'C', 'D', 'E', 'F', 'G'];
    }
    else {
      // Multiplayer and timed modes have special cells 'H'
      this.cellIcons = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'];
    }
    // Array to contain plants in the garden
    this.gardenPlants = [];
    // Array to contain precision conveyor plants.
    this.conveyorPlants = [];

    // Start time count
    this.seconds = 0;
    setInterval(() => this.timeElapsed(), 1000);

    // Getting progress bar timer DOM element, if present
    if (gameMode == 'timed') {
      this.progressBar = document.getElementById('timer');
    }
    else if (gameMode == 'multiplayer' || gameMode == 'multiplayerAI') {
      this.progressBar = document.getElementById(`timer-player-${multiplayerID}`);
      if (gameMode == 'multiplayerAI' && multiplayerID == 'B') {
        // Make gameGridBObject unclickable
        this.gameGrid.style.pointerEvents = 'none';
        this.gameGrid.style.backgroundColor = 'black';
        document.getElementById('player-b-score').style.backgroundColor = '#219621';
      }
    }
    else {
      this.progressBar = null;
    }
    // Getting precision mode conveyor
    if (gameMode == 'precision') {
      this.precisionConveyor = document.querySelector(".precisionConveyor");
    }
    else {
      this.precisionConveyor = null;
    }

    // Constant to indicate the winning score
    this.winningScore = 20;

    // Class-wide flags
    this.gameHasStarted = null;
    this.gameIsPaused = true;
    this.timerIntervalActive = null;
    this.timerInterval = null;
    this.isRemovalInProgress = null;
    this.isMoveInProgress = null;
    this.gameIsOver = null;
    this.isResetGame = null;
    this.isAIMatch = null;

    this.createCells(this.gameGridArea);
  }

  // Encapsulation Methods

  /**
   * Returns the game grid area value initialized in this Game instance.
   * 
   * @param {void}
   * @returns {Number} - this.gameGridArea: the numeric value
   * of the area of the game grid area initialized.
   */
  get getGameGridArea() {
    return this.gameGridArea;
  }

  /**
   * Returns the game grid DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.gameGrid: game grid DOM element in game pages.
   */
  get getGameGrid() {
    return this.gameGrid;
  }

  /**
   * Returns the string indicating the game mode of the current instance.
   * 
   * @param {void}
   * @returns {String} - this.gameMode: string indicating the game mode of this Game instance.
   */
  get getGameMode() {
    return this.gameMode;
  }

  /**
   * Returns the multiplayer id attribute of multiplayer mode Game instances
   * 
   * @param {void}
   * @returns {String} - this.multiplayerID: a string that is either 'A' or 'B'.
   */
  get getMultiplayerID() {
    return this.multiplayerID;
  }

  /**
   * Returns the scoreDisplay DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.scoreDisplay: scoreDisplay DOM element in game pages.
   */
  get getScoreDisplay() {
    return this.scoreDisplay;
  }

  /**
   * Returns the plantsLeftDisplay DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.plantsLeftDisplay: plantsLeftDisplay DOM element in game pages.
   */
  get getPlantsLeftDisplay() {
    return this.plantsLeftDisplay;
  }

  /**
   * Returns the timeDisplay DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.timeDisplay: timeDisplay DOM element in game pages.
   */
  get getTimeDisplay() {
    return this.timeDisplay;
  }

  /**
   * Returns the playPauseButton DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.playPauseButton: playPauseButton DOM element in game pages.
   */
  get getPlayPauseButton() {
    return this.playPauseButton
  }

  /**
   * Returns the garden DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.garden: garden DOM element in game pages.
   */
  get getGarden() {
    return this.garden;
  }

  /**
   * Returns the precision conveyor DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.precisionConveyor:  precision conveyor 
   * DOM element in the precision game mode page.
   */
  get getPrecisionConveyor() {
    return this.precisionConveyor;
  }

  /**
   * Returns the gardenLen DOM element.
   * 
   * @param {void}
   * @returns {HTMLElement} - this.gardenLen: gardenLen DOM element in game pages.
   */
  get getGardenLen() {
    return this.gardenLen;
  }

  /**
   * Returns the cells array, itself, that is stored in this Game instance.
   * 
   * @param {void}
   * @returns {Array} - this.cells: the array of cells stored in this Game instance.
   */
  get getCells() {
    return this.cells;
  }

  /**
   * Returns the selectedCells array, itself, that is stored in this Game instance.
   * 
   * @param {void}
   * @returns {Array} - this.selectedCells: the array of selected cells 
   * stored in this Game instance.
   */
  get getSelectedCells() {
    return this.selectedCells;
  }

  /**
   * Returns the cellIcons array, itself, that is stored in this Game instance.
   * 
   * @param {void}
   * @returns {Array} - this.cellIcons: the array of cell icons stored in this Game instance.
   */
  get getCellIcons() {
    return this.cellIcons;
  }

  /**
   * Returns the gardenPlants array, itself, that is stored in this Game instance.
   * 
   * @param {void}
   * @returns {Array} - this.gardenPlants: the array of garden plants stored in this Game instance.
   */
  get getGardenPlants() {
    return this.gardenPlants;
  }

  /**
   * Returns the conveyorPlants array, itself, that is stored in this Game instance.
   * 
   * @param {void}
   * @returns {Array} - this.conveyorPlants: the array of precision mode conveyor 
   * plants stored in this Game instance.
   */
  get getConveyorPlants() {
    return this.conveyorPlants;
  }

  /**
   * Returns the progressBar DOM element in timed and multiplayer mode game pages, 
   * if in classic mode page, returns null.
   * 
   * @param {void}
   * @returns {(HTMLElement|Object)} - this.progressBar || null: progressBar DOM element in timed and multiplayer game pages, 
   * or null for classic mode page.
   * seconds stored in this Game instance.
   */
  get getProgressBar() {
    return this.progressBar;
  }

  /**
   * Returns the seconds stored in this Game instance.
   * 
   * @param {void}
   * @returns {Number} - this.seconds: the amount of time elapsed 
   * seconds stored in this Game instance.
   */
  get getSeconds() {
    return this.seconds;
  }

  /**
   * Sets the game grid area of the current Game instance to a game grid area value.
   * 
   * @param {Number} newGameGridArea - the new game grid area value for this Game instance.
   * @returns {void}
   */
  set setGameGridArea(newGameGridArea) {
    this.gameGridArea = newGameGridArea;

    // Refresh grid styles for dimensions
    this.gameGrid.style.gridTemplateRows = `repeat(${Math.sqrt(this.gameGridArea)}, 1fr)`;
    this.gameGrid.style.gridTemplateColumns = `repeat(${Math.sqrt(this.gameGridArea)}, 1fr)`;

    // Restart the game
    this.resetGame();
  }

  /**
   * Sets the game grid DOM element of the current Game instance to a new game grid.
   * 
   * @param {String} newGameGrid - the id of the new game grid DOM element for this Game instance.
   * @returns {void}
   */
  set setGameGrid(newGameGrid) {
    this.gameGrid = newGameGrid;
  }

  /**
   * Sets the game mode of the current Game instance to a new game mode.
   * 
   * @param {String} newGameMode - the new game mode for this Game instance.
   * @returns {void}
   */
  set setGameMode(newGameMode) {
    this.gameMode = newGameMode;
  }

  /**
   * Sets the multiplayer ID of the current Game instance to a new multiplayer ID.
   * 
   * @param {String} newMultiplayerID - the new multiplayer ID for this Game instance. Must be either 'A' or 'B'.
   * @returns {void}
   */
  set setMultiplayerID(newMultiplayerID) {
    this.multiplayerID = newMultiplayerID;
  }

  /**
   * Sets the timeDisplay DOM element of the current Game instance to a new time display.
   * 
   * @param {HTMLElement} newTimeDisplay - the new timeDisplay HTML element for this Game instance.
   * @returns {void}
   */
  set setTimeDisplay(newTimeDisplay) {
    this.timeDisplay = newTimeDisplay;
  }

  /**
   * Sets the playPauseButton DOM element of the current Game instance to a new play/pause button.
   * 
   * @param {HTMLElement} newPlayPauseButton - the new playPauseButton HTML element for this Game instance.
   * @returns {void}
   */
  set setPlayPauseButton(newPlayPauseButton) {
    this.playPauseButton = newPlayPauseButton;
  }

  /**
   * Sets the scoreDisplay DOM element of the current Game instance to a new score display.
   * 
   * @param {HTMLElement} newScoreDisplay - the new scoreDisplay HTML element for this Game instance.
   * @returns {void}
   */
  set setScoreDisplay(newScoreDisplay) {
    this.scoreDisplay = newScoreDisplay;
  }

  /**
   * Sets the plantsLeftDisplay DOM element of the current Game instance to a new plants left display.
   * 
   * @param {HTMLElement} newPlantsLeftDisplay - the new plantsLeftDisplay HTML element for this Game instance.
   * @returns {void}
   */
  set setPlantsLeftDisplay(newPlantsLeftDisplay) {
    this.plantsLeftDisplay = newPlantsLeftDisplay;
  }

  /**
   * Sets the garden DOM element of the current Game instance to a new garden.
   * 
   * @param {HTMLElement} newGarden - the new garden HTML element for this Game instance.
   * @returns {void}
   */
  set setGarden(newGarden) {
    this.garden = newGarden;
  }

  /**
   * Sets the precision conveyor DOM element of the current Game instance to a new precision conveyor.
   * 
   * @param {HTMLElement} newPrecisionConveyor - the new precision conveyor HTML element for
   * this Game instance.
   * @returns {void}
   */
  set setPrecisionConveyor(newPrecisionConveyor) {
    this.precisionConveyor = newPrecisionConveyor;
  }

  /**
   * Sets the gardenLen DOM element of the current Game instance to a new garden length.
   * 
   * @param {HTMLElement} newGardenLen - the new garden length HTML element for this Game instance.
   * @returns {void}
   */
  set setGardenLen(newGardenLen) {
    this.gardenLen = newGardenLen;
  }

  /**
   * Sets the cells array of the current Game instance to a new array.
   * 
   * @param {Array} newCells - the new array of cells for this Game instance.
   * @returns {void}
   */
  set setCells(newCells) {
    this.cells = newCells;
  }

  /**
   * Sets the selectedCells array of the current Game instance to a new array.
   * 
   * @param {Array} newSelectedCells - the new array of selected cells for this Game instance.
   * @returns {void}
   */
  set setSelectedCells(newSelectedCells) {
    this.selectedCells = newSelectedCells;
  }

  /**
   * Sets the cellIcons array of the current Game instance to a new array.
   * 
   * @param {Array} newCellIcons - the new array of cell icons for this Game instance.
   * @returns {void}
   */
  set setCellIcons(newCellIcons) {
    this.cellIcons = newCellIcons;
  }

  /**
   * Sets the garden plants array of the current Game instance to a new array.
   * 
   * @param {Array} newGardenPlants - the new array of garden plants for this Game instance.
   * @returns {void}
   */
  set setGardenPlants(newGardenPlants) {
    this.gardenPlants = newGardenPlants;
  }

  /**
   * Sets the conveyor plants array of the current Game instance to a new array.
   * 
   * @param {Array} newConveyorPlants - the new array of precision mode conveyor plants for this Game instance.
   * @returns {void}
   */
  set setConveyorPlants(newConveyorPlants) {
    this.conveyorPlants = newConveyorPlants;
  }

  /**
   * Sets the progressBar DOM element of the current Game instance to a new progress bar.
   * 
   * @param {HTMLElement} newProgressBar - the new progress bar HTML element for this Game instance.
   * @returns {void}
   */
  set setProgressBar(newProgressBar) {
    this.progressBar = newProgressBar;
  }

  /**
   * Sets the seconds stored in this Game instance to a new value.
   * 
   * @param {Number} newSeconds - the new seconds value for this Game instance.
   * @returns {void}
   */
  set setSeconds(newSeconds) {
    this.seconds = newSeconds;
  }

  // Methods

  /**
   * Handles creation of divs with the cell class, inside the game grid.
   * 
   * @param {Number} area - The area of the game grid.
   * @returns {void}
   */
  createCells(area) {
    const icons = this.getCellIcons;
    let prevRowCellIcon = null;
    let prevColCellIcon = null;
    for (let i = 0; i < Math.ceil(area); i++) {
      let cellIcon = Math.floor(Math.random() * icons.length);

      /* Prevent created cells from already being aligned at the beginning of the game.
      If the previous generated cell, or the cell generated on the 
      (i-Math.sqrt(this.getGameGridArea))th previous iteration, 
      has the same icon as the current cell being generated, randomize to a different icon */
      if (prevRowCellIcon !== null && prevColCellIcon !== null) {
        prevRowCellIcon = this.getCells[i - 1].dataset.cell;
        // Prevent vertical and horizontal aligments, starting from the 2nd row.
        if (i >= Math.sqrt(this.getGameGridArea)) {
          prevColCellIcon = this.getCells[i - Math.sqrt(this.getGameGridArea)].dataset.cell;
          while ((prevColCellIcon == cellIcon && prevRowCellIcon == cellIcon) ||
            (prevColCellIcon == cellIcon || prevRowCellIcon == cellIcon)) {
            cellIcon = Math.floor(Math.random() * icons.length);
          }
        }
        // Prevent only horizontal aligments for the 1st row.
        else if (i < Math.sqrt(this.getGameGridArea)) {
          while (prevRowCellIcon == cellIcon) {
            cellIcon = Math.floor(Math.random() * icons.length);
          }
        }
      }
      prevRowCellIcon = cellIcon;
      prevColCellIcon = cellIcon;

      const cell = document.createElement('div');
      cell.classList.add('cell');
      cell.dataset.cell = cellIcon;
      cell.classList.add(icons[cell.dataset.cell]);
      this.getGameGrid.appendChild(cell);
      cell.setAttribute('title', 'A movable plant');
      cell.tabIndex = 0;
      this.getCells.push(cell);
      if (this.getGameMode == 'multiplayerAI' && this.getMultiplayerID == 'B') {
        cell.style.backgroundColor = '#219621';
      }
      cell.addEventListener('click', () => this.selectCell(cell));
      cell.addEventListener('keydown', () => this.selectCell(cell));
    }
  }

  /**
   * Starts the game by setting the gameHasStarted flag to true,
   * starting any timers that may be present, 
   * and removing grayed out effects.
   * 
   * @param {void}
   * @returns {void}
   */
  startGame() {
    this.gameHasStarted = true;
    if (this.getGameMode == 'multiplayerAI' && this.getMultiplayerID == 'B') {
      this.AIMatch();
    }
    this.gameIsPaused = true;
    this.playPauseGame();

    // Starting timers, if present
    if (this.getGameMode == 'timed') {
      // Game ends after 2min

      this.timerIntervalActive = true; // Flag to control interval updates
      this.timerInterval = setInterval(() => {
        this.getProgressBar.value = this.getSeconds;
        if (this.progressIntervalActive) {
          this.getProgressBar.value++;
          if (this.getProgressBar.value == 121) {
            this.progressIntervalActive = false; // Stop further interval updates
          }
        }
      });
    }
    else if (this.getGameMode == 'multiplayer' || this.getGameMode == 'multiplayerAI') {
      this.timerIntervalActive = true; // Flag to control interval updates
      this.timerInterval = setInterval(() => {
        this.getProgressBar.value = this.getSeconds;
        if (this.progressIntervalActive) {
          this.getProgressBar.value++;
        }
      });
    }

    if (this.getGameMode == 'precision') {
      if (this.getConveyorPlants.length == 0) {
        for (let i = 0; i < 10; i++) {
          const cellIcon = Math.floor(Math.random() * this.cellIcons.length);
          const cell = document.createElement('div');
          cell.classList.add('cell');
          cell.dataset.cell = cellIcon;
          cell.classList.add(this.getCellIcons[cell.dataset.cell]);
          this.getConveyorPlants.push(cell);
          this.getPrecisionConveyor.appendChild(cell);
        }
      }
      else {
        this.setConveyorPlants = Array.from(this.getPrecisionConveyor.children).splice(1);
      }

    }

    // Remove grayed out effects
    const timeContainer = document.getElementsByClassName('time-elapsed-container')[0];
    const scoreboard = document.getElementsByClassName('scoreboard');

    timeContainer.style.filter = 'unset';
    this.getGarden.style.filter = 'unset';
    scoreboard[0].style.filter = 'unset';
    if (this.getGameMode == 'precision') {
      this.getPrecisionConveyor.style.filter = 'unset';
    }
    if (this.getGameMode == 'multiplayer' || this.getGameMode == 'multiplayerAI') {
      this.getGarden.style.filter = 'unset';
      scoreboard[1].style.filter = 'unset';
    }

    if (this.getGameMode == 'multiplayer' || this.getGameMode == 'timed' || this.getGameMode == 'multiplayerAI') {
      const progressBar = document.getElementsByClassName('timer-container')[0];
      progressBar.style.filter = 'unset';
    }
  }

  /**
   * Handles selection of cells.
   * 
   * @param {cell} cell - The selected cell object.
   * @returns {void}
   */
  selectCell(cell) {
    if (this.getSelectedCells.length >= 3 || this.isMoveInProgress) {
      // If two cells have already been selected, do nothing
      for (let cell of this.getCells) {
        cell.style.removeProperty('box-shadow');
      }
      this.getSelectedCells.length = 0;
      return;
    }

    this.startGame();

    // Play the audio file for selection
    const audio = new Audio("./media/sounds/selection.wav");
    audio.volume = 0.4;
    audio.play();

    // Add the cell to the selectedCells array
    this.getSelectedCells.push(cell);

    // Add blue border to selected cells
    cell.style.boxShadow = '0px 0px 0px 2px blue inset';

    // If two cells have been selected, move them if they are adjacent
    if (this.getSelectedCells.length == 2) {
      const [cell1, cell2] = this.getSelectedCells;
      this.moveCell([cell1, cell2]);
    }
  }

  /**
   * Checks if two cells on the game grid are movable.
   *
   * @param {Number} cell1Index - The index of the first cell.
   * @param {Number} cell2Index - The index of the second cell.
   * @returns {Boolean} - Returns true if the cells are movable, false otherwise.
   */
  isMovable(cell1Index, cell2Index) {
    /* Prevent swapping of cells at the end of rows,
      Deselect cells if in positions Math.sqrt(this.getGameGridArea)*n and 
      Math.sqrt(this.getGameGridArea)*n-1 or if the cells are not adjacent to cell1, the first selected cell */

    // Normal game grid size - 8 * 8
    if (this.getGameGridArea == 8 * 8) {
      if (
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 1 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 1) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 1 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 1)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 2 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 2) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 2 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 2)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 3 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 3) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 3 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 3)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 4 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 4) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 4 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 4)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 5 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 5) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 5 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 5)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 6 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 6) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 6 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 6)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 7 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 7) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 7 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 7)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 8 - 1 && cell2Index == 0) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 8 - 1 && cell1Index == 0)) ||
        !(cell2Index - 1 == cell1Index ||
          cell2Index + 1 == cell1Index || cell2Index - Math.sqrt(this.getGameGridArea) == cell1Index ||
          cell2Index + Math.sqrt(this.getGameGridArea) == cell1Index)) {
        return false;
      }
      else {
        return true;
      }
    }

    // Small game grid size - 6 * 6
    if (this.getGameGridArea == 6 * 6) {
      if (
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 1 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 1) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 1 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 1)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 2 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 2) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 2 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 2)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 3 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 3) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 3 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 3)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 4 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 4) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 4 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 4)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 5 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 5) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 5 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 5)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 6 - 1 && cell2Index == 0) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 6 - 1 && cell1Index == 0)) ||
        !(cell2Index - 1 == cell1Index ||
          cell2Index + 1 == cell1Index || cell2Index - Math.sqrt(this.getGameGridArea) == cell1Index ||
          cell2Index + Math.sqrt(this.getGameGridArea) == cell1Index)) {
        return false;
      }
      else {
        return true;
      }
    }

    // Large game grid size - 10 * 10
    if (this.getGameGridArea == 10 * 10) {
      if (
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 1 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 1) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 1 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 1)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 2 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 2) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 2 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 2)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 3 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 3) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 3 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 3)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 4 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 4) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 4 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 4)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 5 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 5) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 5 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 5)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 6 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 6) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 6 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 6)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 7 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 7) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 7 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 7)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 8 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 8) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 8 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 8)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 9 - 1 && cell2Index == Math.sqrt(this.getGameGridArea) * 9) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 9 - 1 && cell1Index == Math.sqrt(this.getGameGridArea) * 9)) ||
        ((cell1Index == Math.sqrt(this.getGameGridArea) * 10 - 1 && cell2Index == 0) ||
          (cell2Index == Math.sqrt(this.getGameGridArea) * 10 - 1 && cell1Index == 0)) ||
        !(cell2Index - 1 == cell1Index ||
          cell2Index + 1 == cell1Index || cell2Index - Math.sqrt(this.getGameGridArea) == cell1Index ||
          cell2Index + Math.sqrt(this.getGameGridArea) == cell1Index)) {
        return false;
      }
      else {
        return true;
      }
    }
  }

  /**
   *  Moves the first selected cell to the second selected cell position if they are adjacent and not in the end of rows.
   *  Deselects both cells if they are not adjacent or in the end of rows.
   * 
   *  @param {Array} cell1 - The first selected cell to swap.
   *  @param {Array} cell2 - The second selected cell to swap.
   *  @returns {void}
   */
  moveCell([cell1, cell2]) {
    this.isMoveInProgress = true;
    const cell1Index = this.getCells.indexOf(cell1);
    const cell2Index = this.getCells.indexOf(cell2);

    // Check if cell1 and cell2 are defined
    if (cell1 && cell2) {
      if (!this.isMovable(cell1Index, cell2Index)) {
        this.deselectCells();
      }
      else if (this.isMovable(cell1Index, cell2Index)) {
        // Call appropriate animation based on the direction of the swap
        if (cell2Index - 1 == cell1Index) {
          cell1.style.animation = "move-right 1s";
          cell2.style.animation = "move-left 1s";
        }
        else if (cell2Index + 1 == cell1Index) {
          cell1.style.animation = "move-left 1s";
          cell2.style.animation = "move-right 1s";
        }
        else if (cell2Index - Math.sqrt(this.getGameGridArea) == cell1Index) {
          cell1.style.animation = "move-down 1s";
          cell2.style.animation = "move-up 1s";
        }
        else if (cell2Index + Math.sqrt(this.getGameGridArea) == cell1Index) {
          cell1.style.animation = "move-up 1s";
          cell2.style.animation = "move-down 1s";
        }
        // Swap the cells after the animations end
        cell2.addEventListener("animationend", () => {
          const nonUpdatedScore = this.getScoreDisplay.textContent;
          console.log('Cell Movements around: ' + this.getCellCoordinates(cell1Index, this.getGameGridArea));
          this.swapCells(cell1, cell2);
          // If the score did not change, that is, a match was not made, swap cells back
          if (this.getScoreDisplay.textContent == nonUpdatedScore) {
            cell1.style.animation = "";
            cell2.style.animation = "";
            setTimeout(() => {
              cell2.addEventListener("animationend", () => {
                this.swapCells(cell2, cell1);
                cell1.style.animation = "";
                cell2.style.animation = "";
              }, { once: true });
              if (cell2Index - 1 == cell1Index) {
                cell1.style.animation = "move-right 1s";
                cell2.style.animation = "move-left 1s";
              } else if (cell2Index + 1 == cell1Index) {
                cell1.style.animation = "move-left 1s";
                cell2.style.animation = "move-right 1s";
              } else if (cell2Index - Math.sqrt(this.getGameGridArea) == cell1Index) {
                cell1.style.animation = "move-down 1s";
                cell2.style.animation = "move-up 1s";
              } else if (cell2Index + Math.sqrt(this.getGameGridArea) == cell1Index) {
                cell1.style.animation = "move-up 1s";
                cell2.style.animation = "move-down 1s";
              }
            }, 50);
          }
          else {
            cell1.style.animation = "";
            cell2.style.animation = "";
          }
        }, { once: true });
      }
      if (this.isAIMatch) {
        /* Add delay before setting end of movement flag to false to 
        make AIMatch cell movements more natural. */
        setTimeout(() => {
          this.isMoveInProgress = false;
        }, 100);
      }
      else {
        this.isMoveInProgress = false;
      }
    }
  }

  /**
   * Handles swapping of cells when the requirements for movement are met.
   * 
   * @param {void}
   * @returns {void}
   */
  swapCells(cell1, cell2) {
    let cellA = cell1.dataset.cellClass;
    let cellB = cell1.dataset.cellClass;
    cellA = cellB;

    let cellAClass = cell1.classList.value;
    let cellBClass = cell2.classList.value;
    cell1.className = cellBClass;
    cell2.className = cellAClass;

    this.horizontalMatch();
    this.verticalMatch();
    setTimeout(() => {
      this.deselectCells();
    }, 1000);
  }

  /**
   * Matches 3 cells with the same icon horizontally and removes them from the game grid.
   * 
   * @param {void}
   * @returns {void}
   */
  horizontalMatch() {
    // Check if a removal process is already in progress
    if (this.isRemovalInProgress) {
      return;
    }
    let rows = [];
    for (let i = 0; i < this.getCells.length; i += Math.sqrt(this.getGameGridArea)) {
      rows.push(this.getCells.slice(i, i + Math.sqrt(this.getGameGridArea)));
    }

    for (let row of rows) {
      for (let i = 0; i < row.length; i++) {
        let currentCell = row[i];
        let matchingCells = [currentCell];
        let previousCells = [];
        let nextCells = [];

        for (let j = 1; j <= Math.sqrt(this.getGameGridArea); j++) {
          if (i - j >= 0) {
            previousCells.push(row[i - j]);
          }
          if (i + j < row.length) {
            nextCells.push(row[i + j]);
          }
        }

        // Check if there are more than 2 previous cells with the same class
        let hasMatch = true;
        let index = 0;
        while (hasMatch && index < previousCells.length) {
          let previousCell = previousCells[index];
          if (previousCell && previousCell.classList && previousCell.classList[1] === currentCell.classList[1]) {
            matchingCells.push(previousCell);
            index++;
          }
          else {
            hasMatch = false;
          }
        }

        if (matchingCells.length >= 3) {
          this.removeCells(matchingCells);
          continue;
        }

        // Check if there are more than 2 next cells with the same class
        hasMatch = true;
        index = 0;
        while (hasMatch && index < nextCells.length) {
          let nextCell = nextCells[index];
          if (nextCell && nextCell.classList && nextCell.classList[1] === currentCell.classList[1]) {
            matchingCells.push(nextCell);
            index++;
          }
          else {
            hasMatch = false;
          }
        }

        if (matchingCells.length >= 3) {
          this.removeCells(matchingCells);
          return;
        }
      }
    }
  }

  /**
   * Matches 3 cells with the same icon vertically and removes them from the game grid.
   * 
   * @param {void}
   * @returns {void}
   */
  verticalMatch() {
    // Check if a removal process is already in progress
    if (this.isRemovalInProgress) {
      return;
    }
    let columnLength = Math.sqrt(this.getGameGridArea);

    for (let i = 0; i < this.getCells.length; i++) {
      let currentCell = this.getCells[i];
      let matchingCells = [currentCell];
      let previousCells = [];
      let nextCells = [];

      for (let j = 1; j <= columnLength; j++) {
        previousCells.push(this.getCells[i - columnLength * j]);
        nextCells.push(this.getCells[i + columnLength * j]);
      }

      // Check if there are more than 2 previous cells with the same class
      let hasMatch = true;
      let index = 0;
      while (hasMatch && index < previousCells.length) {
        let previousCell = previousCells[index];
        if (previousCell && previousCell.classList && previousCell.classList[1] === currentCell.classList[1]) {
          matchingCells.push(previousCell);
          index++;
        }
        else {
          hasMatch = false;
        }
      }

      if (matchingCells.length >= 3) {
        this.removeCells(matchingCells);
        return;
      }

      // Check if there are more than 2 next cells with the same class
      hasMatch = true;
      index = 0;
      while (hasMatch && index < nextCells.length) {
        let nextCell = nextCells[index];
        if (nextCell && nextCell.classList && nextCell.classList[1] === currentCell.classList[1]) {
          matchingCells.push(nextCell);
          index++;
        }
        else {
          hasMatch = false;
        }
      }

      if (matchingCells.length >= 3) {
        this.removeCells(matchingCells);
        return;
      }
    }
  }

  /**
   * Converts the index of a cell in this.cells to its corresponding row and column identifier.
   * 
   * @param {Number} cellIndex - The index of a cell inside this.cells array.
   * @param {Number} area - The area of the gameGrid initialized in this GameClass instance.
   * @returns {String} - A string in the format "Rx Cy" where x is the row number and y is the column number.
   */
  getCellCoordinates(cellIndex, area) {
    return `R${parseInt(cellIndex / Math.sqrt(area))} C${(cellIndex % Math.sqrt(area))}`;
  }

  /**
   * Removes the cells from the game grid, rolls the cells above down, calls for regeneration of
   * new cells in the topmost empty positions, and applies animations. Also
   * plays audio files based on the number and type of matched cells, calls for 
   * updating of the score and triggers cascading matches if any.
   *
   * @param {Array} cellsToRemove - An array of cells to be removed from the game grid.
   * @returns {Promise} - A promise that resolves after the removal and animation process is complete.
   */
  async removeCells(cellsToRemove) {
    this.isRemovalInProgress = true;

    if (this.getGameMode === 'precision') {
      const firstCell = cellsToRemove[0];
      const firstCellClass = firstCell.classList[1];
    
      let cellFound = false;
    
      for (let i = 0; i < this.getConveyorPlants.length; i++) {
        const cell = this.getConveyorPlants[i];
        const cellClass = cell.classList[1];
    
        if (cellClass === firstCellClass) {
          cell.remove();
          cellFound = true;
        }
      }
    
      if (!cellFound) {
        this.isRemovalInProgress = false;
        return;
      }
    
      if (this.getConveyorPlants.length === 1) {
        this.gameOver();
      }
    }    

    // Set easter egg theme if player matches more than 3 special cells
    if (cellsToRemove.length > 3 && cellsToRemove[0].classList.contains('H')) {
      this.easterEgg();
    }
    // Play the audio file type of match
    if (cellsToRemove.length > 3 || cellsToRemove[0].classList.contains('H')) {
      const audio = new Audio("./media/sounds/match3+.wav");
      audio.volume = 0.4;
      audio.play();
    }
    else if (cellsToRemove.length == 3) {
      const audio = new Audio("./media/sounds/match.wav");
      audio.volume = 0.4;
      audio.play();
    }

    this.appendMatchedCellToGarden(cellsToRemove[0]);
    if (cellsToRemove[0].classList.contains('H')) {
      this.updateScore(2 * cellsToRemove.length - 3 + 1, cellsToRemove.length);
    }
    else {
      this.updateScore(cellsToRemove.length - 3 + 1, cellsToRemove.length);
    }

    // Add green border to cells before removing
    for (let cell of cellsToRemove) {
      cell.style.boxShadow = '0px 0px 0px 2px green inset';
    }

    // Animate the cells with a scale down animation
    await Promise.all(cellsToRemove.map(cell => cell.animate([
      { transform: 'scale(1)' },
      { transform: 'scale(0)' }
    ], {
      duration: 1000,
      easing: 'ease-out'
    }).finished));

    // Get the removed cell column values
    const removedCellColumns = cellsToRemove.map(cell => {
      const index = this.getCells.indexOf(cell);
      const numColumns = Math.sqrt(this.getGameGridArea);
      return index % numColumns;
    });

    const removedCellRows = cellsToRemove.map(cell => {
      const index = this.getCells.indexOf(cell);
      const numColumns = Math.sqrt(this.getGameGridArea);
      return Math.floor(index / numColumns);
    });

    let cellsIn2D = [];
    for (let i = 0; i < this.getCells.length; i += Math.sqrt(this.getGameGridArea)) {
      cellsIn2D.push(this.getCells.slice(i, i + Math.sqrt(this.getGameGridArea)));
    }

    let columnStartIdx = removedCellColumns[0];
    let columnEndIdx = removedCellColumns.slice(-1)[0];
    let rowStartIdx = removedCellRows[0];
    let rowEndIdx = removedCellRows.slice(-1)[0];

    let rolledGrid = cellsIn2D.map(a => [...a]);

    // Roll down elements in each column
    for (let j = columnStartIdx; j <= columnEndIdx; j++) {
      let emptySpaces = 0; // Count the number of empty spaces encountered
      for (let i = rowEndIdx; i >= 0; i--) {
        if (cellsToRemove.includes(rolledGrid[i][j])) {
          emptySpaces++; // Increase the count of empty spaces encountered
        } else {
          // Move the non-removed cells down by the number of empty spaces
          rolledGrid[i + emptySpaces][j] = rolledGrid[i][j];
        }
      }
      // Clear the cells at the top
      for (let i = 0; i < emptySpaces; i++) {
        rolledGrid[i][j] = null;
      }
    }

    let flattenedRolledGrid = rolledGrid.flat();

    // Replace null entries with regenerateCell output
    for (let i = 0; i < flattenedRolledGrid.length; i++) {
      if (flattenedRolledGrid[i] === null) {
        flattenedRolledGrid[i] = this.regenerateCell(i);
      }
    }

    // Clear existing children
    while (this.getGameGrid.firstChild) {
      this.getGameGrid.removeChild(this.getGameGrid.firstChild);
    }

    // Append new children from flattenedRolledGrid
    flattenedRolledGrid.forEach((child, index) => {
      if (this.getGameGrid.childElementCount < this.getGameGridArea) {
        /* Apply the animation style 'regenerate-down 1s' to the 
        cells between columnStartIdx and columnEndIdx and until rowEndIdx */
        const columnIdx = index % Math.sqrt(this.getGameGridArea);
        const rowIdx = Math.floor(index / Math.sqrt(this.getGameGridArea));
        if (columnIdx >= columnStartIdx && columnIdx <= columnEndIdx && rowIdx <= rowEndIdx) {
          child.style.animation = "regenerate-down 1s";

          // Remove the animation after 1 second
          setTimeout(() => {
            child.style.animation = "";
          }, 1000);
        }

        this.getGameGrid.appendChild(child);
      }
    });

    this.setCells = Array.from(this.getGameGrid.children);

    this.isRemovalInProgress = false;
    // Make cascading matches, if any
    this.horizontalMatch();
    this.verticalMatch();
  }

  /**
   * Generates one single cell, at a given index of the this.cells array and returns it.
   * 
   * @param {Number} idx - Index at which the new cell should be generated.
   * @returns {HTMLDivElement} - The generated cell.
   */
  regenerateCell(idx) {
    const cellIcon = Math.floor(Math.random() * this.getCellIcons.length);
    const cell = document.createElement('div');
    cell.classList.add('cell');
    cell.dataset.cell = cellIcon;
    cell.classList.add(this.getCellIcons[cell.dataset.cell]);
    cell.setAttribute('title', 'A movable plant');
    cell.tabIndex = 0;
    cell.addEventListener('click', () => this.selectCell(cell));
    cell.addEventListener('keydown', () => this.selectCell(cell));

    // Insert the cell at the specified index in the game grid
    const gameGrid = this.getGameGrid;
    gameGrid.insertBefore(cell, gameGrid.children[idx]);

    cell.style.animation = 'regenerate-down 1s';

    setTimeout(() => {
      cell.style.animation = '';
    }, 1000);

    return cell;
  }

  /**
   * Handles deselection of cells.
   * 
   * @param {void}
   * @returns {void}
   */
  deselectCells() {
    // Remove blue border from selected cells
    for (let cell of this.getSelectedCells) {
      cell.style.removeProperty('box-shadow');
    }
    // Clear the selectedCells array
    this.getSelectedCells.length = 0;
  }

  /**
   * Ends the game after a player wins, resets it, and shows the garden and statistics.
   * 
   * @param {void}
   * @returns {void}
   */
  gameOver() {
    if (this.getGameGridArea == 6 * 6 || this.getGameMode == 'precision') {
      this.easterEgg();
    }

    this.gameIsOver = true;
    if (this.getGameMode != 'multiplayer' && this.getGameMode != 'multiplayerAI') {
      checkGameOver(this.gameIsOver, this.getScoreDisplay.innerHTML, this.getSeconds, this.getTimeDisplay.textContent);
    }

    // Add 1 second delay before, so any cascading matches can finish before game over.
    setTimeout(() => {
      this.displayGarden();
      const gardenPopup = document.querySelector('.garden-popup');
      gardenPopup.classList.add('show');
      this.resetGame();
      this.gameIsOver = false;
    }, 1000);
  }

  /**
   * Ends the game when a player runs out of time in timed or multiplayer modes, 
   * resets the game, and shows a timed out message.
   * 
   * @param {void}
   * @returns {void}
   */
  timedOut() {
    this.resetGame();

    this.getGameGrid.style.filter = 'blur(5px)';
    const containerDiv = document.createElement('div');
    containerDiv.style.position = 'relative';
    this.gameGrid.parentNode.insertBefore(containerDiv, this.getGameGrid);
    containerDiv.appendChild(this.getGameGrid);

    const timedOutImageContainer = document.createElement('div');
    timedOutImageContainer.style.position = 'absolute';
    timedOutImageContainer.style.top = '0';
    timedOutImageContainer.style.left = '0';
    timedOutImageContainer.style.width = '100%';
    timedOutImageContainer.style.height = '100%';
    timedOutImageContainer.style.display = 'flex';
    timedOutImageContainer.style.alignItems = 'center';
    timedOutImageContainer.style.justifyContent = 'center';
    timedOutImageContainer.style.flexDirection = 'column';
    timedOutImageContainer.style.animation = 'blur-transition-in 5s';
    containerDiv.appendChild(timedOutImageContainer);

    const timedOutImage = document.createElement('img');
    timedOutImage.src = './media/icons/timed-out.png';
    timedOutImage.style.width = '50%';
    timedOutImage.style.margin = 'auto';
    timedOutImage.style.animation = 'slow-scale-down 20s';
    timedOutImageContainer.appendChild(timedOutImage);

    const timedOutMessage = document.createElement('h1');
    timedOutMessage.textContent = "Time's up";
    timedOutMessage.style.animation = 'slow-scale-down 20s';
    timedOutMessage.style.textAlign = 'center';
    timedOutMessage.style.fontSize = '60px';
    timedOutMessage.style.marginTop = '-40px';
    timedOutImageContainer.appendChild(timedOutMessage);

    // Set a timeout to remove the blur and the image after 5 seconds
    setTimeout(() => {
      this.getGameGrid.style.filter = 'unset';
      timedOutImage.remove();
      timedOutMessage.remove();
      timedOutImageContainer.style.animation = 'blur-transition-out 1s';
      setTimeout(() => {
        timedOutImageContainer.remove(); // remove the container and its contents
      }, 1000);
    }, 5000);
  }

  /**
   * Sets theme to easter egg theme and shows a 7 second message.
   * This method should be triggered when a player matches 4 or more special cells,
   * that is, those containing the class 'H', or if the player wins a game with a 6 * 6 grid.
   * 
   * @param {void}
   * @returns {void}
   */
  easterEgg() {
    if (localStorage.theme !== 'easterEgg') {
      setTheme('easterEgg');

      this.getGameGrid.style.filter = 'blur(5px)';
      const containerDiv = document.createElement('div');
      containerDiv.style.position = 'relative';
      this.gameGrid.parentNode.insertBefore(containerDiv, this.getGameGrid);
      containerDiv.appendChild(this.getGameGrid);

      const easterEggContainer = document.createElement('div');
      easterEggContainer.style.position = 'absolute';
      easterEggContainer.style.top = '0';
      easterEggContainer.style.left = '0';
      easterEggContainer.style.width = '100%';
      easterEggContainer.style.height = '100%';
      easterEggContainer.style.display = 'flex';
      easterEggContainer.style.alignItems = 'center';
      easterEggContainer.style.justifyContent = 'center';
      easterEggContainer.style.flexDirection = 'column';
      easterEggContainer.style.animation = 'blur-transition-in 5s';
      containerDiv.appendChild(easterEggContainer);

      const easterEggImage = document.createElement('img');
      easterEggImage.src = './media/plants/darkmode/star-mushroom.png';
      easterEggImage.style.width = '50%';
      easterEggImage.style.margin = 'auto';
      easterEggImage.style.animation = 'slow-scale-down 20s';
      easterEggContainer.appendChild(easterEggImage);

      const easterEggMessage = document.createElement('h1');
      easterEggMessage.textContent = "🌟 The star mushroom grants you a gift! 🌟";
      easterEggMessage.style.animation = 'slow-scale-down 20s';
      easterEggMessage.style.textAlign = 'center';
      easterEggMessage.style.fontSize = '25px';
      easterEggMessage.style.marginTop = '-40px';
      easterEggContainer.appendChild(easterEggMessage);

      // Set a timeout to remove the blur and the image after 5 seconds
      setTimeout(() => {
        this.getGameGrid.style.filter = 'unset';
        easterEggImage.remove();
        easterEggMessage.remove();
        easterEggContainer.style.animation = 'blur-transition-out 5s';
        setTimeout(() => {
          easterEggContainer.remove(); // remove the container and its contents
        }, 1000);
      }, 7000);
    }
  }

  /**
   * Creates an end of game popup with the garden of plants matched
   * 
   * @param {void}
   * @returns {void}
   */
  displayGarden() {
    const popup = document.createElement('div');
    popup.classList.add('garden-popup');
    const toBlur = document.querySelectorAll(".game-container");
    toBlur[0].style.filter = "blur(4px)";
    if (this.getGameMode == "multiplayer" || this.getGameMode == "multiplayerAI") {
      toBlur[1].style.filter = "blur(4px)";
    }
    const closeButton = document.createElement('button');
    closeButton.classList.add('close-button');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
      popup.remove();
      if (this.getGameMode == "multiplayer" || this.getGameMode == "multiplayerAI") {
        toBlur[0].style.filter = "unset";
        toBlur[1].style.filter = "unset";
      }
      else {
        toBlur[0].style.filter = "unset";
      }
    });

    const headerA = document.createElement('h2');
    headerA.innerText = 'Game Over!';
    headerA.style.marginTop = '50px';
    headerA.style.fontSize = 'clamp(5px, 9vw, 40px)';

    const headerB = document.createElement('h3');

    if (this.getGameMode === 'multiplayerAI' && this.getMultiplayerID === 'B') {
      headerB.innerText = '🤖 the ai garden 🤖';
    } else {
      headerB.innerText = '🌸 Your Garden 🌸';
    }

    let topScores;
    let popupTable;
    let currentGameScoreTime;
    if (this.getGameMode != 'multiplayer' && this.getGameMode != 'multiplayerAI') {
      topScores = getTopScores();
      popupTable = drawStatsPopup(topScores);

      currentGameScoreTime = document.createElement("p");
      currentGameScoreTime.innerHTML = `Here's your score: ${this.getScoreDisplay.innerHTML} 
    and your time: ${this.getTimeDisplay.textContent}.`;
    }

    const plantList = document.createElement('div');

    for (let plant of this.getGardenPlants) {
      const listItem = document.createElement('div');
      listItem.classList.add('cell');
      listItem.classList.add(plant.classList[1]);
      const icon = plant.classList[1];
      const iconElement = document.createElement('span');
      iconElement.classList.add(icon);
      listItem.appendChild(iconElement);
      plantList.appendChild(listItem);
    }

    popup.appendChild(closeButton);
    popup.appendChild(headerA);
    if (this.getGameMode != 'multiplayer' && this.getGameMode != 'multiplayerAI') {
      popup.appendChild(currentGameScoreTime);
      popup.appendChild(popupTable);
    }
    popup.appendChild(headerB);
    popup.appendChild(plantList);

    document.querySelector('.game-container').parentElement.appendChild(popup);
  }

  /**
   * Updates the score, the amount of combinations left, and checks if the player has won the game.
   * 
   * @param {Number} value - The number that the score will be increased by.
   * @returns {void}
   */
  updateScore(value) {
    const currentScore = parseInt(this.getScoreDisplay.textContent);
    const currentPlantsLeft = this.getPlantsLeftDisplay.textContent;

    if (currentScore >= this.winningScore) {
      return;
    }

    let plantsLeft;
    if (currentPlantsLeft === '-') {
      if (this.getGameMode == 'precision') {
        plantsLeft = this.getConveyorPlants.length - 1;
      }
      else {
        plantsLeft = this.winningScore - value;
      }
    }
    else {
      plantsLeft = parseInt(currentPlantsLeft) - value;
    }
    this.getPlantsLeftDisplay.textContent = plantsLeft;

    const updatedScore = currentScore + value;
    this.getScoreDisplay.textContent = updatedScore;

    if (this.getGameMode != 'precision') {
      if (updatedScore >= this.winningScore) {
        this.gameOver();
      }
    }
  }

  /**
   * Appends a matched cell to garden.
   *
   * @param {HTMLElement} cell - The cell that was matched.
   * @returns {void}
   */
  appendMatchedCellToGarden(cell) {
    const icon = cell.classList[1];
    const plant = document.createElement('div');
    plant.classList.add('cell');
    plant.classList.add(icon);
    this.getGardenPlants.push(plant);
    this.getGarden.appendChild(plant);

    this.getGardenLen.textContent = this.getGardenPlants.length;
  }

  /**
   * Ends the game by setting the gameHasStarted flag to false, and applying grayed out effects.
   * 
   * @param {void}
   * @returns {void}
   */
  endGame() {
    this.gameHasStarted = false;
    this.gameIsPaused = false;
    this.playPauseGame();

    // Stopping timers, if present
    if (this.getGameMode == 'timed' || this.getGameMode == 'multiplayer' || this.getGameMode == 'multiplayerAI') {
      clearInterval(this.timerInterval); // Clear the interval to stop progress bar updates
      this.getProgressBar.value = 0; // Reset progress bar value to 0
      this.timerIntervalActive = false; // Set the flag to prevent further interval updates
    }

    if (this.getGameMode === 'precision') {
      const precisionConveyor = this.getPrecisionConveyor;
      if (precisionConveyor) {
        this.getConveyorPlants.length = 0;

        // Clear all children except for the first element
        while (precisionConveyor.children.length > 1) {
          precisionConveyor.removeChild(precisionConveyor.lastChild);
        }
      }
    }

    // Set grayed out effects
    const timeContainer = document.getElementsByClassName('time-elapsed-container')[0];
    const scoreboard = document.getElementsByClassName('scoreboard');

    timeContainer.style.filter = 'grayscale(1)';
    this.getGarden.style.filter = 'grayscale(1)';
    scoreboard[0].style.filter = 'grayscale(1)';

    if (this.getGameMode == 'precision') {
      this.getPrecisionConveyor.style.filter = 'grayscale(1)';
    }

    if (this.getGameMode == 'multiplayer' || this.getGameMode == 'multiplayerAI') {
      this.getGarden.style.filter = 'grayscale(1)';
      scoreboard[1].style.filter = 'grayscale(1)';
    }

    if (this.getGameMode == 'multiplayer' || this.getGameMode == 'timed' || this.getGameMode == 'multiplayerAI') {
      const progressBar = document.getElementsByClassName('timer-container')[0];
      progressBar.style.filter = 'grayscale(1)';
    }
  }

  /**
   * Resets the game and score.
   * 
   * @param {void}
   * @returns {void}
   */
  resetGame() {
    // Set isResetGame flag to true
    this.isResetGame = true;

    // Clear the cells array and remove existing cells
    this.getCells.length = 0;
    while (this.getGameGrid.firstChild) {
      this.getGameGrid.removeChild(this.getGameGrid.firstChild);
    }

    // Clear the selectedCells array
    this.getSelectedCells.length = 0;

    // Create new cells
    this.createCells(this.getGameGridArea);

    // Reset the score
    this.getScoreDisplay.textContent = '0';

    // Reset plants left display
    this.getPlantsLeftDisplay.textContent = '-';

    // Clear the gardenPlants array and remove plants
    this.getGardenPlants.length = 0;
    let plant = this.getGarden.firstChild;
    while (plant) {
      const nextPlant = plant.nextSibling;
      if (plant.nodeName !== 'P') {
        this.getGarden.removeChild(plant);
      }
      plant = nextPlant;
    }

    this.getGardenLen.textContent = '0';

    // Reset the time
    this.seconds = 0;

    this.endGame();

    this.getGameGrid.style.filter = "unset";
    if (!(this.getGameMode == "multiplayerAI" && this.getMultiplayerID == 'B')) {
      this.getGameGrid.style.pointerEvents = "unset";
    }

    this.isResetGame = null;
  }

  /**
   * Toggles the play/pause state of the game and applies grayed-out effects, and
   * Updates the play/pause button icon.
   * 
   * @param {void}
   * @returns {void}
   */
  playPauseGame() {
    const imgTag = this.getPlayPauseButton.querySelector('img');

    const timeContainer = document.getElementsByClassName('time-elapsed-container')[0];
    const scoreboard = document.getElementsByClassName('scoreboard');

    if (this.gameIsPaused) {
      if (!this.gameHasStarted) {
        this.startGame();
        return;
      }
      if (this.getGameMode == 'multiplayerAI' && this.getMultiplayerID == 'B') {
        this.AIMatch();
      }
      this.gameIsPaused = false;
      imgTag.src = "./media/icons/pause.png";
      imgTag.alt = "A pause button";

      // Unset grayed out effects
      this.getGameGrid.style.filter = 'unset';
      timeContainer.style.filter = 'unset';
      this.getGarden.style.filter = 'unset';
      scoreboard[0].style.filter = 'unset';

      if (this.getGameMode == 'precision') {
        this.getPrecisionConveyor.style.filter = 'unset';
      }

      if (this.getGameMode == 'multiplayer' || this.getGameMode == 'multiplayerAI') {
        this.getGarden.style.filter = 'unset';
        scoreboard[1].style.filter = 'unset';
      }

      if (this.getGameMode == 'multiplayer' || this.getGameMode == 'timed' || this.getGameMode == 'multiplayerAI') {
        const progressBarContainer = document.getElementsByClassName('timer-container')[0];
        progressBarContainer.style.filter = 'unset';
      }

    }
    else {
      this.gameIsPaused = true;
      imgTag.src = "./media/icons/play.png";
      imgTag.alt = "A play button";

      // Set grayed out effects
      this.getGameGrid.style.filter = 'blur(10px)';
      timeContainer.style.filter = 'grayscale(1)';
      this.getGarden.style.filter = 'grayscale(1)';
      scoreboard[0].style.filter = 'grayscale(1)';

      if (this.getGameMode == 'precision') {
        this.getPrecisionConveyor.style.filter = 'grayscale(1)';
      }

      if (this.getGameMode == 'multiplayer' || this.getGameMode == 'multiplayerAI') {
        this.getGarden.style.filter = 'grayscale(1)';
        scoreboard[1].style.filter = 'grayscale(1)';
      }

      if (this.getGameMode == 'multiplayer' || this.getGameMode == 'timed' || this.getGameMode == 'multiplayerAI') {
        const progressBarContainer = document.getElementsByClassName('timer-container')[0];
        progressBarContainer.style.filter = 'grayscale(1)';
      }
    }
  }

  /**
   * Updates the time-elapsed element on the timer div; 
   * shows elapsed time since the page was loaded.
   * 
   * @param {void}
   * @returns {void}
   */
  timeElapsed() {
    if (this.gameHasStarted && !this.gameIsPaused) {
      this.seconds++;
    }

    const minutes = Math.floor(this.seconds / 60);
    const hours = Math.floor(this.seconds / 3600);
    const displaySeconds = String(this.seconds % 60).padStart(2, '0');
    const displayMinutes = String(minutes % 60).padStart(2, '0');
    const displayHours = String(hours).padStart(2, '0');
    this.getTimeDisplay.textContent = `${displayHours}:${displayMinutes}:${displaySeconds}`;
  }

  /**
   * Uses randomness to continuously move cells, while
   * making use of the current state of the score to determine when to stop moving cells.
   * The algorithm contained inside this method is recursive and 
   * is limited to a maximum of 1000 recursions as a safeguard condition, 
   * except in multiplayerAI mode where the execution of this algorithm is limited to the 30 seconds round duration.
   * 
   * @param {void}
   * @returns {void}
   */
  AIMatch() {
    if (this.isAIMatch) {
      // Prevent AIMatch from triggering more than once while active.
      return;
    }
    if (!this.gameHasStarted) {
      this.startGame();
    }
    this.getGameGrid.style.pointerEvents = 'none';
    if (!this.getGameGrid.style.backgroundColor == 'black') {
      this.getGameGrid.style.backgroundColor = '#219621';
    }
    this.isAIMatch = true;
    const nonUpdatedScore = this.getScoreDisplay.textContent;
    let recursionCount = 0;
    let MAX_ITERATIONS;
    if (this.getGameMode == "multiplayerAI" && this.getMultiplayerID == "B") {
      MAX_ITERATIONS = Infinity;
    }
    else {
      MAX_ITERATIONS = 1000;
    }
    let cellsCopy = [...this.getCells];

    // Create a container div for gameGrid and timedOutImageContainer
    const AIModeContainer = document.createElement('div');
    let containerGame;
    if (this.getGameMode == "multiplayerAI") {
      containerGame = document.getElementById('multiplayer-times');
      containerGame.appendChild(AIModeContainer);
    }
    else {
      containerGame = document.getElementsByClassName('game-container')[0];
      containerGame.insertBefore(AIModeContainer, this.getGameGrid);
    }

    const AIModeMessage = document.createElement('h1');
    AIModeMessage.textContent = "AI Moves in progress... 🤖";
    AIModeMessage.style.fontSize = '40px';
    AIModeMessage.style.marginBottom = '10px';
    AIModeMessage.style.textAlign = 'center';
    AIModeContainer.appendChild(AIModeMessage);

    const runAlgorithm = () => {

      // Check if resetGame has been called
      if (this.isResetGame || this.gameIsPaused || !this.gameHasStarted) {
        this.isAIMatch = false;
        this.isResetGame = false;
        if (!this.getGameGrid.style.backgroundColor == 'black') {
          this.getGameGrid.style.backgroundColor = 'var(--gameGridBackgroundColor)';
        }
        AIModeContainer.remove();
        return;
      }
      if ((this.getScoreDisplay.textContent == nonUpdatedScore && recursionCount < MAX_ITERATIONS) ||
        (this.getGameMode == 'multiplayerAI' && this.getMultiplayerID == 'B')) {
        // Select two random cells
        let randomCellIndexA = Math.floor(Math.random() * (cellsCopy.length));
        let randomCellIndexB = Math.floor(Math.random() * (cellsCopy.length));

        /* Prevent another pair of random cells that are adjacent from being chosen for 5 seconds
        by taking them off from the cellsCopy array,
        this prevents observed animation bugs that happen when an attempt is made to switch
        a cell that is already in movement, with another adjacent cell. 
        Also prevent the same random cell pair from being chosen again */
        cellsCopy = cellsCopy.filter(item => item !== cellsCopy[randomCellIndexA]);
        cellsCopy = cellsCopy.filter(item => item !== cellsCopy[randomCellIndexB]);
        cellsCopy = cellsCopy.filter(item => item !== cellsCopy[randomCellIndexA + 1]);
        cellsCopy = cellsCopy.filter(item => item !== cellsCopy[randomCellIndexB - 1]);
        cellsCopy = cellsCopy.filter(item => item !== cellsCopy[randomCellIndexA + Math.sqrt(this.getGameGridArea)]);
        cellsCopy = cellsCopy.filter(item => item !== cellsCopy[randomCellIndexB - Math.sqrt(this.getGameGridArea)]);

        setTimeout(() => {
          cellsCopy = [...this.getCells];
        }, 10000);

        // Add the selected cells to an array
        let selectedCellsAI = [];
        selectedCellsAI.push(this.getCells[randomCellIndexA]);
        selectedCellsAI.push(this.getCells[randomCellIndexB]);
        const [cell1, cell2] = selectedCellsAI;

        if (!this.isMoveInProgress) {
          this.moveCell([cell1, cell2]);
        }

        recursionCount++;
        console.log('AIMatch recursion count: ' + recursionCount);
        if (recursionCount == MAX_ITERATIONS && this.getGameMode != 'multiplayerAI') {
          alert("After 1000 moves a match could not be made ☹️\nTry Again!");
        }
        requestAnimationFrame(runAlgorithm);
      }
      else {
        setTimeout(() => {
          this.isAIMatch = false;
          this.getGameGrid.style.pointerEvents = 'unset';
          if (!this.getGameGrid.style.backgroundColor == 'black') {
            this.getGameGrid.style.backgroundColor = 'var(--gameGridBackgroundColor)';
          }
          AIModeContainer.remove();
        }, 1500);
      }
    };
    requestAnimationFrame(runAlgorithm);
  }
}