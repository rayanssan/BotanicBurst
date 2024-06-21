/* 
  ITW (2022/23);
  Grupo: 04;
  Número: 60282, Nome: Rayan Serafim Santana, PL: 25;
  Número: 60527, Nome: Marta Dias Maia, PL: 25;
  Número: 56736, Nome: Helena Isabel Vargas Duarte, PL: 25
*/

"use strict";

let botanicBurstPage = document.getElementById("botanicBurstPage");
let botanicBurstMultiplayerPage = document.getElementById("botanicBurstMultiplayerPage");

let profilePage = document.getElementById("profilePage");
let multiplayerProfilesPage = document.getElementById("multiplayerProfilesPage");

const userData = JSON.parse(localStorage.getItem("users"));
let currentUser = localStorage.getItem("currentUser");

let multiplayerUsers;
if (localStorage.getItem("multiplayerUsers")) {
  multiplayerUsers = localStorage.getItem("multiplayerUsers").split(',');
}

// Single player elements
let avatarNavElement = document.getElementById("avatar-nav");
let navUsername = document.getElementById("navUsername");
let profilePageAvatar = document.getElementById("avatar");
let nameProfile = document.getElementById("nameProfile");
let emailProfile = document.getElementById("emailProfile");
let ageProfile = document.getElementById("ageProfile");
let genderProfile = document.getElementById("genderProfile");
let passwordProfile = document.getElementById("passwordProfile");

// Multiplayer elements
let avatarNavElementA = document.getElementById("avatar-nav-player-a");
let avatarNavElementB = document.getElementById("avatar-nav-player-b");
let navUsernameA = document.getElementById("navUsernameA");
let navUsernameB = document.getElementById("navUsernameB");
let profilePageAvatarA = document.getElementById("avatar-A");
let profilePageAvatarB = document.getElementById("avatar-B");
let nameProfileA = document.getElementById("nameProfile-A");
let nameProfileB = document.getElementById("nameProfile-B");
let emailProfileA = document.getElementById("emailProfile-A");
let emailProfileB = document.getElementById("emailProfile-B");
let ageProfileA = document.getElementById("ageProfile-A");
let ageProfileB = document.getElementById("ageProfile-B");
let genderProfileA = document.getElementById("genderProfile-A");
let genderProfileB = document.getElementById("genderProfile-B");
let passwordProfileA = document.getElementById("passwordProfile-A");
let passwordProfileB = document.getElementById("passwordProfile-B");

let currentUserData = userData.find(user => user.username === currentUser);
let multiplayerUserAData;
let multiplayerUserBData;
if (localStorage.getItem("multiplayerUsers")) {
  multiplayerUserAData = userData.find(user => user.username === multiplayerUsers[0]);
  multiplayerUserBData = userData.find(user => user.username === multiplayerUsers[1]);
}

if (currentUserData) {
  if (botanicBurstPage) {
    avatarNavElement.firstChild.src = currentUserData.avatar;
    navUsername.innerHTML = currentUserData.username;
  }
  else if (botanicBurstMultiplayerPage) {
    avatarNavElementA.children[0].src = multiplayerUserAData.avatar;
    avatarNavElementB.children[0].src = multiplayerUserBData.avatar;
    navUsernameA.innerHTML = multiplayerUserAData.username;
    navUsernameB.innerHTML = multiplayerUserBData.username;
  }
  if (profilePage) {
    profilePageAvatar.querySelector("img").src = currentUserData.avatar;
    nameProfile.innerHTML = currentUserData.username;
    emailProfile.innerHTML = currentUserData.email;
    ageProfile.innerHTML = currentUserData.age;
    genderProfile.innerHTML = currentUserData.gender;
    passwordProfile.innerHTML = "•".repeat(currentUserData.password.length);
  }

  if (multiplayerProfilesPage) {
    profilePageAvatarA.querySelector("img").src = multiplayerUserAData.avatar;
    profilePageAvatarB.querySelector("img").src = multiplayerUserBData.avatar;
    nameProfileA.innerHTML = multiplayerUserAData.username;
    nameProfileB.innerHTML = multiplayerUserBData.username;
    emailProfileA.innerHTML = multiplayerUserAData.email;
    emailProfileB.innerHTML = multiplayerUserBData.email;
    ageProfileA.innerHTML = multiplayerUserAData.age;
    ageProfileB.innerHTML = multiplayerUserBData.age;
    genderProfileA.innerHTML = multiplayerUserAData.gender;
    genderProfileB.innerHTML = multiplayerUserBData.gender;
    passwordProfileA.innerHTML = "•".repeat(multiplayerUserAData.password.length);
    passwordProfileB.innerHTML = "•".repeat(multiplayerUserBData.password.length);
  }
}


