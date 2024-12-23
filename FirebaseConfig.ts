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

// Solicitar permisos para notificaciones push
export async function requestUserPermission() {
    const authStatus = await messaging().requestPermission();
    const enabled =
        authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        authStatus === messaging.AuthorizationStatus.PROVISIONAL;

    if (enabled) {
        console.log('Permiso para notificaciones otorgado:', authStatus);
    } else {
        console.log('Permiso para notificaciones denegado.');
    }
}

// Obtener y registrar el token
export async function getAndRegisterToken() {
    const token = await messaging().getToken();
    if (token) {
        console.log('Token obtenido:', token);
        // Guarda el token en Firestore
        const userTokenRef = doc(db, "user_tokens", "usuario_id");
        await setDoc(userTokenRef, { token });
    } else {
        console.log('No se pudo obtener el token.');
    }
}
