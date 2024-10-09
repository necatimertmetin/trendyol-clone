import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase, ref, get, set } from "firebase/database"; // Realtime Database için gerekli importlar

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSClu_SrKYFSDNoYmY546vUwpU2MaI1BE",
  authDomain: "turkjustice-64229.firebaseapp.com",
  projectId: "turkjustice-64229",
  storageBucket: "turkjustice-64229.appspot.com",
  messagingSenderId: "1047263961020",
  appId: "1:1047263961020:web:cc46cfbb4d277c6c2795b9",
  measurementId: "G-4YZ8B0M70T",
  databaseURL: "https://turkjustice-64229-default-rtdb.europe-west1.firebasedatabase.app/", // Realtime Database URL
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication
const db = getDatabase(app); // Realtime Database

export { auth, db };
