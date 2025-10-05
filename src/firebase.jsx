// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { GoogleAuthProvider } from "firebase/auth";
import { getDatabase } from "firebase/database";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyBDrBOU5gRCZxTKut-1H75ddvxRk4tuA1k",
  authDomain: "mudralaya-a9bd0.firebaseapp.com",
  databaseURL: "https://mudralaya-a9bd0-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "mudralaya-a9bd0",
  storageBucket: "mudralaya-a9bd0.firebasestorage.app",
  messagingSenderId: "110898391725",
  appId: "1:110898391725:web:46ddfb4909e4fd1b3fb424"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);


export const auth = getAuth(app);
export const db = getDatabase(app);
export const googleProvider = new GoogleAuthProvider();