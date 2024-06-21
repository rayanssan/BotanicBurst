// Dictionary of themes, the key names correspond to the theme classes names in themes.css
const themeTogglesDictionary = {
  spring: document.querySelector(".spring-theme"),
  summer: document.querySelector(".summer-theme"),
  autumn: document.querySelector(".autumn-theme"),
  winter: document.querySelector(".winter-theme"),
  darkmode: document.querySelector(".darkmode-theme"),
  easterEgg: null
};

// Get the root element and the stored theme from localStorage
const root = document.documentElement;
const storedTheme = localStorage.getItem("theme");

/**
 * Detects the user's dark mode preference and applies the corresponding theme.
 * If there is no stored theme and the user prefers dark mode, the 'darkmode' theme is applied.
 * If there is a stored theme, it is applied.
 * If there is no stored theme and the user prefers light mode, the 'spring' theme is applied.
 * 
 * @param {void}
 * @returns {void}
 */
function detectDarkmodePreference() {
  if (storedTheme) {
    setTheme(storedTheme);
  }
  else if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
    root.classList.add('darkmode');
    updateImages('darkmode');
    updateAudio('darkmode');
  }
  else if (window.matchMedia('(prefers-color-scheme: light)').matches) {
    root.classList.remove('darkmode');
    updateImages('spring');
    updateAudio('spring');
  }
}

// Initial check when the page loads
detectDarkmodePreference();

// Event listener for changes in preferred color scheme
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  // If there is no stored theme and user prefers dark mode, set the theme to darkmode
  detectDarkmodePreference();
});

/**
 * Updates the favicon and homepage title plant images according to the active theme.
 *
 * @param {String} theme - The name of the active theme.
 * @returns {void}
 */
function updateImages(theme) {
  /* Dictionary of arrays containing the titles of theme dependent images:
  themeDependentImages['theme'][0] - favicons, themeDependentImages['theme'][1] - homepage plants */
  const themeDependentImages = {
    darkmode: ['super-happy-mushroom', 'star-mushroom'],
    summer: ['pineapple', 'palm-tree'],
    autumn: ['acorn', 'pumpkin'],
    winter: ['candle', 'mistletoe'],
    spring: ['blue-bouquet', 'sunflower'],
    easterEgg: ['clover', 'earth-flower']
  };

  // Gather favicon and homepage title plant images elements
  const favicon = document.querySelector('link[rel="icon"]');
  const titlePlantA = document.querySelector('#titlePlantA');
  const titlePlantB = document.querySelector('#titlePlantB');

  // Verify if localStorage is not empty
  if (theme != null) {
    // Get the name of the images that match the active theme
    const [faviconImg, titlePlantImg] = themeDependentImages[theme];

    // Set favicon icon image
    favicon.href = `./media/plants/${theme}/${faviconImg}.png`;
    // Verify if title plants are present in the page, if so set the images
    if (titlePlantA && titlePlantB) {
      titlePlantA.src = `./media/plants/${theme}/${titlePlantImg}.png`;
      titlePlantB.src = `./media/plants/${theme}/${titlePlantImg}.png`;
    }

    // Reset box-shadow for all theme toggle elements
    const entries = Object.entries(themeTogglesDictionary);
    for (let i = 0; i < entries.length - 1; i++) {
      const theme = entries[i];
      if (theme[1]) {
        theme[1].style.boxShadow = '';
      }
    }

    // Add box-shadow to the matching theme toggle element
    if (themeTogglesDictionary[theme]) {
      themeTogglesDictionary[theme].style.boxShadow = '0px 0px 0px 2px lightgreen inset';
    }
  }
}

/**
 * Updates the soundcloud iframe source based on the active theme.
 *
 * @param {String} theme - The active theme.
 * @returns {void}
 */
function updateAudio(theme) {
  // Dictionary containing the soundcloud iframe sources for each theme
  const themeSrcs = {
    darkmode: "https://w.soundcloud.com/player/?url=https%3A/" +
      "/api.soundcloud.com/tracks/1501426021&color=%23423a28&auto_play=false&" +
      "hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    summer: "https://w.soundcloud.com/player/?url=https%3A/" +
      "/api.soundcloud.com/tracks/859871056&color=%23423a28&auto_play=false&" +
      "hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    autumn: "https://w.soundcloud.com/player/?url=https%3A/" +
      "/api.soundcloud.com/tracks/1245971767&color=%23423a28&auto_play=false" +
      "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    winter: "https://w.soundcloud.com/player/?url=https%3A/" +
      "/api.soundcloud.com/tracks/966761764&color=%23423a28&auto_play=false" +
      "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    spring: "https://w.soundcloud.com/player/?url=https%3A/" +
      "/api.soundcloud.com/tracks/1106398864&color=%23423a28&auto_play=false" +
      "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true",
    easterEgg: "https://w.soundcloud.com/player/?url=https%3A/" +
      "/api.soundcloud.com/tracks/292015932&color=%23423a28&auto_play=false" +
      "&hide_related=true&show_comments=false&show_user=true&show_reposts=false&show_teaser=true&visual=true"
  };

  const soundcloudIframe = document.getElementById('soundcloud-iframe');

  // Verify if localStorage is not empty
  if (theme != null) {
    // Get the source that matches the active theme
    const souncloudSource = themeSrcs[theme];

    // Verify if souncloud iframe is present
    if (soundcloudIframe) {
      soundcloudIframe.src = souncloudSource;
    }
  }
}

/**
 * Sets the theme of the webpage to the specified theme name. This function
 * removes all existing theme classes from the root element and adds the
 * specified theme class. It also saves the theme name to localStorage.
 *
 * @param {String} themeName - The name of the theme to set.
 * @returns {void}
 */
function setTheme(themeName) {
  // Loop through each key in the themes dictionary and remove all themes from the root element
  Object.keys(themeTogglesDictionary).forEach(key => {
    root.classList.remove(key);
  });
  // Add the specified theme class to the root element and save it to localStorage
  root.classList.add(themeName);
  // Get the current active theme
  const theme = root.className;
  // Update theme dependent images
  updateImages(theme);
  // Update audio
  updateAudio(theme);
  // Store theme in local storage
  localStorage.setItem("theme", themeName);
}

// Add click event listeners to the toggles with the corresponding theme name
Object.keys(themeTogglesDictionary).forEach(key => {
  const element = themeTogglesDictionary[key];
  // Verify if theme-changing toggles are present in the page
  if (element) {
    element.addEventListener("click", function () {
      setTheme(key);
    });
  }
});

/* Listen for changes in the localStorage value of the theme and dynamically update the theme, 
not only on the main botanic burst page, but as well on the pages contained inside iframes. */
window.addEventListener('storage', (event) => {
  if (event.key === 'theme') {
    const newTheme = event.newValue;
    setTheme(newTheme);
  }
});