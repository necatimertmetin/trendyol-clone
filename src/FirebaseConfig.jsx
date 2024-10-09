import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// Firebase Configuration
const firebaseConfig = {
  apiKey: "AIzaSyCSClu_SrKYFSDNoYmY546vUwpU2MaI1BE",
  authDomain: "turkjustice-64229.firebaseapp.com",
  projectId: "turkjustice-64229",
  storageBucket: "turkjustice-64229.appspot.com",
  messagingSenderId: "1047263961020",
  appId: "1:1047263961020:web:cc46cfbb4d277c6c2795b9",
  measurementId: "G-4YZ8B0M70T"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Firebase Authentication

export { auth };
