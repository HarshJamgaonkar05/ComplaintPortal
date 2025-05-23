import { initializeApp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-app.js";
import { getFirestore, collection, addDoc, getDocs, serverTimestamp } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged, signOut } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-auth.js";
import { doc, getDoc, updateDoc } from "https://www.gstatic.com/firebasejs/10.12.0/firebase-firestore.js";


// 🔧 Firebase Config
const firebaseConfig = {
  apiKey: "AIzaSyBED6Ry-fi4VNr4wGPYJ1_q36uoRjfES8E",
  authDomain: "complaint-portal-99a4e.firebaseapp.com",
  projectId: "complaint-portal-99a4e",
  storageBucket: "complaint-portal-99a4e.firebasestorage.app",
  messagingSenderId: "308373542541",
  appId: "1:308373542541:web:13d43aac4607e088a5f4c4",
  measurementId: "G-XEWY6FHKNW"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// 🔐 Auth Check
onAuthStateChanged(auth, user => {
  if (!user) {
    location.href = "index.html"; // If not logged in, redirect
  }
});

// 📤 Submit Complaint
const submitBtn = document.getElementById("submit-btn");
const complainant = document.getElementById("complainant");
const complaint = document.getElementById("complaint");
const msg = document.getElementById("form-message");
const list = document.getElementById("complaint-list");

submitBtn.addEventListener("click", async () => {
  if (!complainant.value || !complaint.value.trim()) {
    msg.textContent = "Please fill both fields!";
    return;
  }

  try {
    await addDoc(collection(db, "complaints"), {
      by: complainant.value,
      text: complaint.value,
      timestamp: serverTimestamp(),
      response: "",
      responseTimestamp: null,
    });
    msg.textContent = "Complaint submitted! 💕";
    complaint.value = "";
    fetchComplaints();
  } catch (err) {
    msg.textContent = "Error: " + err.message;
  }
});

// 📥 Show Complaints
async function fetchComplaints() {
  const querySnapshot = await getDocs(collection(db, "complaints"));
  list.innerHTML = "";

  querySnapshot.forEach(doc => {
    const data = doc.data();
    const li = document.createElement("li");

    // Format complaint timestamp
    const complaintTime = data.timestamp ? data.timestamp.toDate().toLocaleString() : "Unknown time";

    // Response text and time
    const hasResponse = data.response && data.response.trim() !== "";
    const responseTime = data.responseTimestamp ? data.responseTimestamp.toDate().toLocaleString() : "";

    li.innerHTML = `
      <div><strong>${data.by}:</strong> ${data.text}</div>
      <small style="color:#888;">Filed on: ${complaintTime}</small>
      <div style="margin-top: 8px;">
        ${hasResponse ? 
          `<div><strong>Response:</strong> ${data.response}</div>
           <small style="color:#888;">Responded on: ${responseTime}</small>`
          : 
          `<textarea placeholder="Write your response..." rows="2" style="width: 100%; margin-top: 5px;"></textarea>
           <button style="margin-top:5px;">Submit Response</button>`
        }
      </div>
    `;

    // If no response, add event listener to submit button
    if (!hasResponse) {
      const textarea = li.querySelector("textarea");
      const btn = li.querySelector("button");

      btn.addEventListener("click", async () => {
        const responseText = textarea.value.trim();
        if (!responseText) {
          alert("Response cannot be empty!");
          return;
        }
        try {
          // Update Firestore document with response and timestamp
          await updateDoc(doc.ref, {
            response: responseText,
            responseTimestamp: serverTimestamp(),
          });
          fetchComplaints(); // Refresh list
        } catch (err) {
          alert("Error submitting response: " + err.message);
        }
      });
    }

    list.appendChild(li);
  });
}


fetchComplaints();

// 🚪 Logout
document.getElementById("logout-btn").addEventListener("click", () => {
  signOut(auth).then(() => {
    location.href = "index.html";
  });
});
