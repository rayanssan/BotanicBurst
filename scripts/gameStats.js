/**
 * UserStat class, used to save and organise information on each game played and the player's statistics. 
 */
class UserStat {
    /**
     * Initializes a new instance of the UserStat instance, with the following parameters.
     * @param {Number} time - number of seconds the game lasted.
     * @param {Number} score - player's score in current game. 
     * @param {String} displayTime - formatted string of duration of game, with hours, minutes and seconds.
     * @param {String} ModePlayed - string indicating gameMode (either Classic or Timed).
     * Other attributes include: player's avatar (src path) and username, 
     * the player's best time achieved so far, the best score so far, 
     * the cummulative score and time played, as well as the number of games played.
     */
    constructor(time, score, displayTime, ModePlayed) {
        this.time = time;
        this.score = score;
        this.displayTime = displayTime;
        this.avatar = null;
        this.username = null;
        this.bestTime = 0;
        this.bestScore = 0;
        this.totalTimePlayed = 0;
        this.gamesPlayed = 0;
        this.ModePlayed = ModePlayed;
    }
}

/**
 * Auxiliary function - formatting time
 * Formats a given number of seconds into a string representing the time in the format HH:MM:SS.
 *
 * @param {Number} seconds - The number of seconds to format.
 * @returns {String} - The formatted time string in the format HH:MM:SS.
 */
function formatTime(seconds) {
    const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
    const minutes = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
    const secs = ((seconds % 60) + 1).toString().padStart(2, '0');
    return `${hours}:${minutes}:${secs}`;
}

/**
 * Retrieves the top 10 scores from the game statistics stored in local storage.
 *
 * @param {void}
 * @returns {Array} - An array of objects representing the top 10 scores.
 */
function getTopScores() {
    let gameStats = JSON.parse(localStorage.getItem("gameStats")) || [];
    gameStats.sort((a, b) => {
        return b.score - a.score;
    });

    console.log(gameStats);
    return gameStats.slice(0, 10);
}


/**
* Saving current game mode. Game mode information will be recorded in each stat entry and will then be used to build the corresponding tables. 
*/

let gameMode = document.getElementsByTagName("body")[0];

if (gameMode.id === "classicGameModePage" || gameMode.id === "multiplayerGameModePage" || gameMode.id === "timedGameModePage") {
    gameMode = gameMode.id; //Reassigning and keeping only the string. 
}
else {
    gameMode = undefined;
}

/**
 * Creates new instance of UserStat and stores it in local storage. 
 * Each game played will have its statistic, that will then be added to an array in local storage. 
 * Aditionally, player stats are updated with every game they play, in the following parameters: 
 * best time, best score, total amount of time played and number of games played.
 *  
 * @param {Boolean} gameIsOver - boolean value to let us know if gameOver() method in the game class has been called. 
 * @param {Number} score - score of the game.
 * @param {Number} seconds - number of seconds the game lasted.
 * @param {String} timeElapsed - formatted string of duration of game, with hours, minutes and seconds.
 */
function checkGameOver(gameIsOver, score, seconds, timeElapsed) {

    // Retrieving array from local storage with all the players' statistics. If no array exists, an empty one is created.
    let gameStats = JSON.parse(localStorage.getItem("gameStats")) || [];

    // Finding current user stats in array, so information can be updated according to present game stats.
    let userStats = gameStats.find(stat => stat.username === currentUser);


    if (gameIsOver) {

        if (!userStats) {
            //Creating new instance of UserStat.
            let newStat = new UserStat(seconds, score, timeElapsed, gameMode);
            /* currentUserData is a constant defined in the generalInfoUpdates script. 
            / It is the current user's object, with all its defined properties. */
            newStat.avatar = currentUserData.avatar;
            newStat.username = currentUserData.username;
            newStat.gamesPlayed++;
            newStat.totalTimePlayed += seconds;
            newStat.bestScore = score;
            newStat.bestTime = seconds;

            gameStats.push(newStat);


        } else if (userStats) {
            /* If there is a previous UserStat object for the same player, 
            we update the relevant information. And create new instance, 
            with current game attributes - namely, score, time elapsed, etc. 
            This is so the table with the ten best scores can be displayed with the proper information. */

            let newGameNewStat = new UserStat(seconds, score, timeElapsed, gameMode);

            //Updating cummulative information in pre-existing entry.
            userStats.gamesPlayed++;
            userStats.totalTimePlayed += seconds;

            if (userStats.bestTime > seconds) {
                userStats.bestTime = seconds;
            }
            if (userStats.bestScore < score) {
                userStats.bestScore = score;
            }

            //Assigning new attributes to new entry.
            newGameNewStat.gamesPlayed = userStats.gamesPlayed;
            newGameNewStat.totalTimePlayed = userStats.totalTimePlayed;
            newGameNewStat.bestScore = userStats.bestScore;
            newGameNewStat.bestTime = userStats.bestTime;
            newGameNewStat.avatar = userStats.avatar;
            newGameNewStat.username = userStats.username;

            gameStats.push(newGameNewStat);

        }

        localStorage.setItem("gameStats", JSON.stringify(gameStats));

    }
}


/**
 * Creates table in Game Stats page. Each table entry corresponds to a game played.
 * @param {Array} gameStats - game stats array. 
 */
function drawStatsTable(gameStats) {
    let statsTable = document.getElementById("statsTable");
    let newStatsTable = document.createElement("table");

    let headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th class='avatar'></th>" +
        "<th>Player Name</th>" +
        "<th>Games Played</th>" +
        "<th>Time Played</th>" +
        "<th>Best Score</th>" +
        "<th>Best Time</th>"
    newStatsTable.appendChild(headerRow);

    let names = []

    if (gameStats.length === 0) {
        let emptyRow = document.createElement("tr");
        emptyRow.innerHTML = "<td>Oops, no games have been played yet...</td>"
        if (statsTable) {
            statsTable.appendChild(emptyRow);
        }
    }

    for (let userStat of gameStats) {
        if (names.includes(userStat.username)) {
            continue;
        }
        else {
            let tableRow = document.createElement("tr");
            tableRow.innerHTML = `<td class="avatar"><img src="${userStat.avatar}" alt="${userStat.avatar.slice(-4)}"<td>` +
                "<td>" + userStat.username + "</td>" +
                "<td>" + userStat.gamesPlayed + "</td>" +
                "<td>" + formatTime(userStat.totalTimePlayed) + "</td>" +
                "<td>" + userStat.bestScore + "</td>" +
                "<td>" + formatTime(userStat.bestTime) + "</td>";
            if (statsTable) {
                statsTable.appendChild(tableRow);
            }

            names.push(userStat.username);
        }
    }
}

/**
 * Creates table for game over popup.
 * @param {Array} gameStats - array of userStat objects - the top 10 scores.
 * @returns {HTMLTableElement} - The generated table element displaying the user statistics.
 */
function drawStatsPopup(gameStats) {
    console.log("printing...", gameStats);
    console.log(gameStats.length);

    let tablePopup = document.createElement("table");
    tablePopup.setAttribute("id", "popupTable");
    let headerRow = document.createElement("tr");
    headerRow.innerHTML = "<th class='avatar'></th>" +
        "<th>Player Name</th>" +
        "<th>Score</th>" +
        "<th>Time</th>";
    tablePopup.appendChild(headerRow);

    for (let userStat of gameStats) {
        if (userStat.ModePlayed === gameMode) {
            console.log(`${userStat} and gameMode ${gameMode}`);
            console.log("user :", userStat);
            let tableRow = document.createElement("tr");
            tableRow.innerHTML = `<td class="avatar"><img src="${userStat.avatar}" alt="${userStat.avatar.slice(-4)}"<td>` +
                "<td>" + userStat.username + "</td>" +
                "<td>" + userStat.score + "</td>" +
                "<td>" + formatTime(userStat.time) + "</td>";

            tablePopup.appendChild(tableRow);
        }

    }
    return tablePopup;
}

let gameStats = JSON.parse(localStorage.getItem("gameStats")) || [];
if (document.getElementById("statsTable")) {
    drawStatsTable(gameStats);
}