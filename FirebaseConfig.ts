// FirebaseConfig.js
import firebase from "firebase/compat/app";
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import "firebase/compat/storage";


// Your Firebase project configuration (from Firebase Console)
 const firebaseConfig = {
    apiKey: "AIzaSyA0UTbAvRWCheukNzm4-DUWXHKlE2X2q2k",
    authDomain: "frontcraft-36a90.firebaseapp.com",
    projectId: "frontcraft-36a90",
    storageBucket: "frontcraft-36a90.firebasestorage.app",
    messagingSenderId: "861086747402",
    appId: "1:861086747402:web:a4acc427cce718ebb708f3"
};

// Initialize Firebase
export {firebase} ;
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
