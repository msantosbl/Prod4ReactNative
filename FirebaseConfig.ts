import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import messaging from '@react-native-firebase/messaging';

// Tu configuración de Firebase
const firebaseConfig = {
   apiKey: "AIzaSyCqj-5sry96Nzp8mAr6U2nDXC4Qf02_cLQ",
   authDomain: "frontcraft-mobileprod4.firebaseapp.com",
   projectId: "frontcraft-mobileprod4",
   storageBucket: "frontcraft-mobileprod4.firebasestorage.app",
   messagingSenderId: "912709853795",
   appId: "1:912709853795:web:ee5ea89be064fdee4e8e56",
   measurementId: "G-2D3QCS3FH1"
};

// Inicializar Firebase
const app = initializeApp(firebaseConfig);


// Exportar Firestore y otros servicios
const db = getFirestore(app);

export { app, db };
