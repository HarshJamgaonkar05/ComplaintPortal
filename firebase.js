
// firebase.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";

const firebaseConfig = {
  apiKey: "AIzaSyBED6Ry-fi4VNr4wGPYJ1_q36uoRjfES8E",
  authDomain: "complaint-portal-99a4e.firebaseapp.com",
  projectId: "complaint-portal-99a4e",
  storageBucket: "complaint-portal-99a4e.appspot.com", // fixed typo from earlier
  messagingSenderId: "308373542541",
  appId: "1:308373542541:web:13d43aac4607e088a5f4c4",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
