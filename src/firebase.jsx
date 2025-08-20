import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
    apiKey: "AIzaSyBHHfMyGUf8VvIyhWpztkKoAHDf51r6xnM",
    authDomain: "caribesbackend.firebaseapp.com",
    projectId: "caribesbackend",
    storageBucket: "caribesbackend.firebasestorage.app",
    messagingSenderId: "412570457484",
    appId: "1:412570457484:web:4d59e9cbea1f51f0a072a9",
    measurementId: "G-Q955BBHRHM"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
