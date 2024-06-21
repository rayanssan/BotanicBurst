let isMultiplayer = null; // Track multiplayer state

let form = document.getElementById('login');
let singlePlayerUsernameField = document.getElementById('username-or-email');
let singlePlayerPasswordField = document.getElementById('password');

// Storing single player form elements to be accessed later
let singlePlayerFormElements = [];
singlePlayerFormElements.push(singlePlayerUsernameField.parentElement);
singlePlayerFormElements.push(singlePlayerPasswordField.parentElement);

let playGameButton = document.getElementById('play-game-button');

/**
 * Alternates between single player and multiplayer mode in the login form.
 * If currently in multiplayer mode, switches to single player mode by showing the single player input field
 * and removing the multiplayer input fields. If currently in single player mode, switches to multiplayer mode
 * by removing the single player input fields and prepending the multiplayer input fields.
 * 
 * @param {void}
 * @returns {void}
 */
function toggleMultiplayer() {
    if (isMultiplayer) {
        // Remove multiplayer input fields if they exist
        let multiplayerUserA = document.getElementById('multiplayer-userA');
        let multiplayerPasswordA = document.getElementById('multiplayer-passwordA');
        let multiplayerUserB = document.getElementById('multiplayer-userB');
        let multiplayerPasswordB = document.getElementById('multiplayer-passwordB');

        form.removeChild(multiplayerUserA);
        form.removeChild(multiplayerPasswordA);
        form.removeChild(multiplayerUserB);
        form.removeChild(multiplayerPasswordB);

        form.style.flexDirection = 'column';

        // Add back single player input fields if they exist
        for (let i = singlePlayerFormElements.length; i >= 0; i--) {
            let element = singlePlayerFormElements[i];
            if (element && !form.contains(element)) {
                form.prepend(element);
            }
        }

        isMultiplayer = false;
        form.action = 'botanicBurst.html';
        document.getElementById('multiplayer-login-button').textContent = 'multiplayer login';
    } else {
        // Remove single player input fields if they exist
        for (let i = 0; i < singlePlayerFormElements.length; i++) {
            let element = singlePlayerFormElements[i];
            if (element && form.contains(element)) {
                form.removeChild(element);
            }
        }

        form.style.display = 'flex';
        form.style.flexDirection = 'row';
        form.style.flexWrap = 'wrap';
        form.style.justifyContent = 'center';


        // Create multiplayer input fields
        form.prepend(createMultiplayerField('multiplayer-passwordB', 'playerB-password', 'player 2 password', 'password'));
        form.prepend(createMultiplayerField('multiplayer-userB', 'playerB-username', 'player 2 username or e-mail', 'text'));
        form.prepend(createMultiplayerField('multiplayer-passwordA', 'playerA-password', 'player 1 password', 'password'));
        form.prepend(createMultiplayerField('multiplayer-userA', 'playerA-username', 'player 1 username or e-mail', 'text'));

        isMultiplayer = true;
        form.action = 'botanicBurstMultiplayer.html';
        document.getElementById('multiplayer-login-button').textContent = 'single player login';
    }
}

/**
 * Creates the multiplayer form fields with labels and input elements.
 *
 * @param {String} groupId - The ID for the parent div element of the form field.
 * @param {String} inputId - The ID for the input element.
 * @param {String} labelContent - The content/text of the label element.
 * @param {String} type - The type for the input element.
 * @returns {HTMLElement} - The created div element containing the form field.
 */
function createMultiplayerField(groupId, inputId, labelContent, type) {
    let group = document.createElement('div');
    group.className = 'form-group';
    group.id = groupId;

    let input = document.createElement('input');
    input.type = type;
    input.id = inputId;
    input.placeholder = ' ';
    input.required = true;

    let label = document.createElement('label');
    label.htmlFor = inputId;
    label.textContent = labelContent;

    group.appendChild(input);
    group.appendChild(label);

    return group;
}

// Attach event listener to the multiplayer login button
document.getElementById('multiplayer-login-button').addEventListener('click', toggleMultiplayer);

