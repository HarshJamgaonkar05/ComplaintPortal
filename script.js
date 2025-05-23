// script.js
import { auth } from './firebase.js';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const loginBtn = document.getElementById("login-btn");
const signupBtn = document.getElementById("signup-btn");
const errorMsg = document.getElementById("error-message");

signupBtn.addEventListener("click", () => {
  createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((userCredential) => {
      location.href = "dashboard.html"; // Redirect to dashboard
    })
    .catch((error) => {
      errorMsg.textContent = error.message;
    });
});

loginBtn.addEventListener("click", () => {
  signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
    .then((userCredential) => {
      location.href = "dashboard.html"; // Redirect to dashboard
    })
    .catch((error) => {
      errorMsg.textContent = error.message;
    });
});

// Optional: Auto-login redirect if already logged in
onAuthStateChanged(auth, (user) => {
  if (user) {
    console.log("User logged in:", user.email);
  }
});
 