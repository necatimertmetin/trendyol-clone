// auth.js
import { auth } from './firebase-config';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from "firebase/auth";

// Kullanıcı kaydı işlemi
const registerUser = async (email, password) => {
  try {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    console.log("User registered:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error registering user:", error.message);
    throw error;
  }
};

// Kullanıcı girişi işlemi
const loginUser = async (email, password) => {
  try {
    const userCredential = await signInWithEmailAndPassword(auth, email, password);
    console.log("User logged in:", userCredential.user);
    return userCredential.user;
  } catch (error) {
    console.error("Error logging in user:", error.message);
    throw error;
  }
};

// Kullanıcı çıkış işlemi
const logoutUser = async () => {
  try {
    await signOut(auth);
    console.log("User logged out");
  } catch (error) {
    console.error("Error logging out:", error.message);
    throw error;
  }
};

// Export edilen fonksiyonlar
export { registerUser, loginUser, logoutUser };
