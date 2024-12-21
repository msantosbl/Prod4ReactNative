// FirebaseConfig.js
import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Tu configuración de Firebase (de la consola de Firebase)
const firebaseConfig = {
   apiKey: "AIzaSyA0UTbAvRWCheukNzm4-DUWXHKlE2X2q2k",
   authDomain: "frontcraft-36a90.firebaseapp.com",
   projectId: "frontcraft-36a90",
   storageBucket: "frontcraft-36a90.appspot.com",
   messagingSenderId: "861086747402",
   appId: "1:861086747402:web:a4acc427cce718ebb708f3",
};

// Inicializa Firebase y sus servicios
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, db, storage};
