//Fetching HTML form and users array from local storage.
let loginForm = document.getElementById("login");
let users = JSON.parse(localStorage.getItem("users")) || [];

/**
 * Displays an HTML message in the designated container for a bad login attempt.
 * The message will be visible for 5 seconds before being cleared.
 *
 * @param {String} message - The HTML message to be displayed.
 * @returns {void}
 */
function badLogin(message) {
  let badLoginContainer = document.getElementById("bad-login-container");
  badLoginContainer.innerHTML = message;

  setTimeout(function () {
    badLoginContainer.innerHTML = ""; // Remove the message after 5 seconds
  }, 5000); // 5000 milliseconds = 5 seconds
}

/**
 * Performs a single player login by comparing the input data to the users' information.
 * If the login is successful, the username of the logged-in user is saved in local storage.
 * If there is no match for the login information, an error message is displayed and the login is prevented.
 *
 * @param {Event} event - The submit event triggered by the login form submission.
 * @returns {void}
 */
function singlePlayerLogin(event) {
  let loggedInUser = null;
  //Single Player Login Inputs
  let usernameEmailInput = document.getElementById("username-or-email").value;
  let passwordInput = document.getElementById("password").value;

  //Iterating over each user and comparing login information, to see if any is a match.
  for (let i = 0; i < users.length; i++) {
    if ((users[i].username === usernameEmailInput ||
      users[i].email === usernameEmailInput) && users[i].password === passwordInput) {
      loggedInUser = users[i].username;
      localStorage.setItem("currentUser", loggedInUser);
      break;
    }
  }

  // If there's no match.
  if (loggedInUser === null) {
    badLogin("<p>Invalid username/password.</p>");
    event.preventDefault();
  }
}

/**
 * Performs a multiplayer login by comparing the input data to the users' information.
 * If the login is successful for both players, their usernames are saved in local storage.
 * If there are any issues with the login (e.g., invalid username/password or repeated information),
 * an error message is displayed and the login is prevented.
 *
 * @param {Event} event - The submit event triggered by the login form submission.
 * @returns {void}
 */
function multiplayerLogin(event) {
  // Will save the users that match the input data given. Will then be saved in local storage.
  let loggedInUsers = [];

  // Multiplayer Login Inputs
  let multiplayerAUsernameEmail = document.getElementById("playerA-username").value;
  let multiplayerAPassword = document.getElementById("playerA-password").value;
  let multiplayerBUsernameEmail = document.getElementById("playerB-username").value;
  let multiplayerBPassword = document.getElementById("playerB-password").value;

  let validPlayerA = false;
  let validPlayerB = false;

  // Comparing user information to playerA input
  for (let user of users) {
    if ((user.username === multiplayerAUsernameEmail || user.email === multiplayerAUsernameEmail) 
    && user.password === multiplayerAPassword) {
      validPlayerA = true;
      loggedInUsers.push(user.username);
      break;
    }
  }

  // Comparing user information to playerB input
  for (let user of users) {
    if ((user.username === multiplayerBUsernameEmail || user.email === multiplayerBUsernameEmail) 
    && user.password === multiplayerBPassword) {
      validPlayerB = true;
      loggedInUsers.push(user.username);
      break;
    }
  }

  // Check if both players have valid login credentials and they are not the same user
  if (validPlayerA && validPlayerB && loggedInUsers[0] !== loggedInUsers[1]) {
    localStorage.setItem("multiplayerUsers", loggedInUsers);
  } else {
    badLogin("<p>Invalid username/password.</p>");
    event.preventDefault();
  }
}

document.addEventListener("submit", function (event) {
  if (event.target.matches("#login")) {
    const multiplayerCheck = document.getElementById("multiplayer-userA");
    console.log(multiplayerCheck);
    if (!multiplayerCheck) {
      singlePlayerLogin(event);
    } else {
      multiplayerLogin(event);
    }
  }
});