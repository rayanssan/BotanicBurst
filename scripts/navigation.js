let botanicBurstVersion = document.getElementsByTagName('body')[0];
let websiteIframe = document.getElementById('botanicBurst');
let navItems;

if (botanicBurstVersion.id == 'botanicBurstPage') {
  navItems = {
    'avatar-nav': 'profile.html',
    'classic-mode-nav': 'game.html',
    'timed-mode-nav': 'timedGame.html',
    'precision-mode-nav': 'precisionGame.html',
    'multiplayerAI-mode-nav': 'multiplayerAI.html',
    'stats-nav': 'stats.html',
    'instructions-nav': 'instructions.html',
    'plants-dictionary-nav': 'plantsDictionary.html',
    'about-us-nav': 'aboutUs.html'
  };
}
else if (botanicBurstVersion.id == 'botanicBurstMultiplayerPage') {
  navItems = {
    'avatar-nav-player-a': 'multiplayerProfiles.html',
    'avatar-nav-player-b': 'multiplayerProfiles.html',
    'multiplayer-mode-nav': 'multiplayer.html',
    'instructions-nav': 'instructions.html',
    'plants-dictionary-nav': 'plantsDictionary.html',
    'about-us-nav': 'aboutUs.html'
  };
}

/**
 * Retrieves the selected page URL from localStorage.
 *
 * @returns {string} - The URL of the selected page.
 */
function getSelectedPageUrl() {
  return localStorage.getItem('selectedPageUrl');
}

/**
 * Sets the selected page URL in localStorage.
 *
 * @param {string} pageUrl - The URL of the selected page.
 * @returns {void}
 */
function setSelectedPageUrl(pageUrl) {
  localStorage.setItem('selectedPageUrl', pageUrl);
}

/**
 * Selects the navigation element that matches the current page source.
 * Adds the 'selected-page' class to the matching element and removes it from others.
 *
 * @param {void}
 * @returns {void}
 */
function selectPage() {
  if (websiteIframe) {
    const currentSrc = websiteIframe.src;
    const navElements = Object.keys(navItems).map(key => document.getElementById(key));

    navElements.forEach(element => {
      const navItemSrc = navItems[element.id];

      if (currentSrc.includes(navItemSrc)) {
        // Apply selected page class to the current page
        element.classList.add('selected-page');
        // Show grid size selection only on game pages
        if (
          navItemSrc === 'game.html' ||
          navItemSrc === 'timedGame.html' ||
          navItemSrc === 'precisionGame.html' ||
          navItemSrc === 'multiplayer.html' ||
          navItemSrc === 'multiplayerAI.html'
        ) {
          document
            .getElementById('nav-grid-size-selection-container')
            .classList.remove('hide-grid-size-selection');
        } else {
          document
            .getElementById('nav-grid-size-selection-container')
            .classList.add('hide-grid-size-selection');
        }
      } else {
        element.classList.remove('selected-page');
      }
    });
  }
}

Object.keys(navItems).forEach(key => {
  const element = document.getElementById(key);
  if (element) {
    element.addEventListener('click', () => {
      websiteIframe.src = navItems[key];
      setSelectedPageUrl(navItems[key]);
      selectPage();
    });
  }
});

// Set the selected page iframe URL on page load
window.addEventListener('load', () => {
  const selectedPageUrl = getSelectedPageUrl();
  if (selectedPageUrl) {
    websiteIframe.src = selectedPageUrl;
    selectPage();
  }
});

selectPage();


/**
 * Sets the grid size for the classic game grid object.
 * The function updates the game grid instance with the specified grid size.
 * It uses the eval function to evaluate the gridSize parameter and assigns the evaluated value
 * to the area attribute of the game grid instance.
 *
 * @param {String} gridSize - The size of the grid to set.
 * @returns {void}
 */
function setClassicGrid(gridSize) {
  // Evaluate the grid size and store the string expression in local storage
  const area = eval(gridSize);
  localStorage.setItem('gridSize', gridSize);

  // Update the gameGridObject instance with the specified grid size
  const iframe = document.getElementById('botanicBurst');
  iframe.contentWindow.postMessage({ type: 'setGridSize', gridSize: area }, '*');

  // Reset box-shadow for all grid size buttons
  document.querySelector(".small-grid").style.boxShadow = '';
  document.querySelector(".normal-grid").style.boxShadow = '';
  document.querySelector(".large-grid").style.boxShadow = '';

  // Add box-shadow to the active grid size button
  if (gridSize == '6 * 6') {
    document.querySelector(".small-grid").style.boxShadow = '0px 0px 0px 2px blue inset';
  }
  else if (gridSize == '8 * 8') {
    document.querySelector(".normal-grid").style.boxShadow = '0px 0px 0px 2px blue inset';
  }
  else if (gridSize == '10 * 10') {
    document.querySelector(".large-grid").style.boxShadow = '0px 0px 0px 2px blue inset';
  }
}

// Attach event listeners to grid size elements
document.querySelector(".small-grid").addEventListener('click', () => { setClassicGrid('6 * 6') });
document.querySelector(".normal-grid").addEventListener('click', () => { setClassicGrid('8 * 8') });
document.querySelector(".large-grid").addEventListener('click', () => { setClassicGrid('10 * 10') });

// Retrieve gridSizeStr from localStorage
const gridSize = localStorage.getItem('gridSize');

if (gridSize) {
  // Set box shadow for the currently selected grid size
  setClassicGrid(gridSize);
}
else {
  document.querySelector(".normal-grid").style.boxShadow = '0px 0px 0px 2px blue inset';
}

