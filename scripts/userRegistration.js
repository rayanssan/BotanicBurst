/*  Handles object representation of users */
class User {
    /** Constructor for an user. Each user has a username, 
    * an email address, an age, a gender, a password, and an avatar choice.
    * 
    * @param {String} username
    * @param {String} email
    * @param {String} password
    * @param {String} age
    * @param {String} gender
    * @param {String} avatar
    * @returns {void}
    */
    constructor(username, email, password, age, gender, avatar) {
        this.username = username;
        this.email = email;
        this.password = password;
        this.age = age;
        this.gender = gender;
        this.avatar = avatar;
    }
}

/*
Array of user objects created with the provided information in the sign up form. 
Information will be accessed and compared when user wants to login. */
let avatarSelect;
let avatarChoices = document.querySelectorAll(".icon-choice");

avatarChoices.forEach(avatar => {
    avatar.addEventListener("click", (event) => {
        let src = event.target.src;
        avatarSelect = src;
        avatarChoices.forEach(choice => {
            if (choice !== avatar) {
                choice.classList.remove('selectedIcon');
            }
        });
        avatar.classList.add('selectedIcon');
    });
});


/**
 * Creates a new user with the information provided by the user and stores it in local storage.
 *
 * @param {void}
 * @returns {void}
 */
function addUserToLocalStorage() {
    let user = null;
    /* Getting information */
    let usernameInput = document.getElementById("username").value;
    let emailInput = document.getElementById("email").value;
    let passwordInput = document.getElementById("password").value;
    let ageInput = document.getElementById("age").value;
    let genderInput = document.getElementById("gender").value;

    /* Check if any required input field is empty */
    if (
        !usernameInput ||
        !emailInput ||
        !passwordInput ||
        !ageInput ||
        !genderInput
    ) {
        // Prevent an empty user from being put into local storage
        return;
    }

    /* Creating a user object with the retrieved information. */
    user = new User(usernameInput, emailInput, passwordInput, ageInput, genderInput, avatarSelect);

    /* Retrieves users array from local storage 
      if one exists, if not with || we create an empty array. We do 
      this to stop the local storage info from being deleted each time a new user signs up. 
      This way, we can store the information of all the users that have signed up, and they can all log in.  */

    let users = JSON.parse(localStorage.getItem("users")) || [];

    /* Pushing the new user object to the users array */
    users.push(user);

    /* Storing information in local storage */
    /* JSON stringify method converts the user object into a string that is then pushed to web storage.
      Useful info: https://www.w3schools.com/js/js_json_stringify.asp */

    localStorage.setItem("users", JSON.stringify(users));
    localStorage.setItem("currentUser", user.username);
}

let registerPlayButton = document.getElementById('register-play-game-button');
registerPlayButton.addEventListener('click', addUserToLocalStorage);




