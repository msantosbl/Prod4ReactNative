// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

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
const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
