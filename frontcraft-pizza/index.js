
import { getMessaging, getToken } from "firebase/messaging";
import messaging from '@react-native-firebase/messaging';
import { Alert } from 'react-native';


const functions = require('firebase-functions/v1');
// The Firebase Admin SDK to access Firestore.
const admin = require("firebase-admin");
admin.initializeApp();


// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addMessage = functions.https.onRequest(async (req, res) => {
    // Grab the text parameter.
    const original = req.query.text;
    // Push the new message into Firestore using the Firebase Admin SDK.
    const writeResult = await admin
      .firestore()
      .collection("messages")
      .add({ original: original });
    // Send back a message that we've successfully written the message
    res.json({ result: `Message with ID: ${writeResult.id} added.` });
  });

  // Listens for new messages added to /messages/:documentId/original and creates an
// uppercase version of the message to /messages/:documentId/uppercase
exports.makeUppercase = functions.firestore
.document("/messages/{documentId}")
.onCreate((snap, context) => {
  // Grab the current value of what was written to Firestore.
  const original = snap.data().original;

  // Access the parameter `{documentId}` with `context.params`
  functions.logger.log("Uppercasing", context.params.documentId, original);

  const uppercase = original.toUpperCase();

  // You must return a Promise when performing asynchronous tasks inside a Functions such as
  // writing to Firestore.
  // Setting an 'uppercase' field in Firestore document returns a Promise.
  return snap.ref.set({ uppercase }, { merge: true });
});
// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });

exports.sendNotificationOnFirestoreUpdate = functions.firestore
    .document('jugadores')
    .onWrite(async (change, context) => {
        // Obtener el payload de la notificación
        const newValue = change.after.data();
        const notificationPayload = {
            notification: {
                title: "Nueva acción en Firestore",
                body: `Un documento fue actualizado: ${newValue.name}`,
                clickAction: "https://localhost:8081",
            }
        };

        // Obtener tokens registrados
        const tokens = await admin.firestore().collection('user_tokens').get();
        const tokenList = tokens.docs.map(doc => doc.data().token);

        // Enviar notificación
        if (tokenList.length > 0) {
            await admin.messaging().sendToDevice(tokenList, notificationPayload);
        }
    });

    const messaging = getMessaging();

getToken(messaging, { vapidKey: "YOUR_PUBLIC_VAPID_KEY" })
    .then((currentToken) => {
        if (currentToken) {
            console.log("Token obtenido: ", currentToken);
            // Guardar el token en Firestore
            saveTokenToFirestore(currentToken);
        } else {
            console.log("No se pudo obtener el token.");
        }
    })
    .catch((err) => {
        console.error("Error al obtener el token: ", err);
    });

function saveTokenToFirestore(token) {
    const db = getFirestore();
    const userTokenRef = doc(db, "user_tokens", "usuario_id");
    setDoc(userTokenRef, { token });
};


useEffect(() => {
    // Listener para notificaciones en primer plano
    const unsubscribe = messaging().onMessage(async remoteMessage => {
        Alert.alert('Notificación recibida', JSON.stringify(remoteMessage.notification.body));
    });

    return unsubscribe; // Desmontar listener
}, []);

const functions = require("firebase-functions");
const admin = require("firebase-admin");
admin.initializeApp();

// Envía notificaciones cuando se escriben o actualizan documentos en la colección "jugadores"
exports.notifyOnJugadorChange = functions.firestore
    .document("jugadores}")
    .onWrite(async (change, context) => {
        const documentId = context.params.documentId;

        // Detectar si el documento fue creado, actualizado o eliminado
        if (!change.before.exists) {
            // Documento creado
            const newValue = change.after.data();
            await sendNotification(`Nuevo jugador añadido: ${newValue.name}`);
        } else if (!change.after.exists) {
            // Documento eliminado
            const oldValue = change.before.data();
            await sendNotification(`Jugador eliminado: ${oldValue.name}`);
        } else {
            // Documento actualizado
            const newValue = change.after.data();
            await sendNotification(`Jugador actualizado: ${newValue.name}`);
        }
    });

// Función para enviar notificaciones
async function sendNotification(message) {
    const tokensSnapshot = await admin.firestore().collection("user_tokens").get();
    const tokens = tokensSnapshot.docs.map(doc => doc.data().token);

    if (tokens.length > 0) {
        const payload = {
            notification: {
                title: "Actualización en Jugadores",
                body: message,
                clickAction: "https://localhost:8081", // Ajusta la URL si es necesario
            },
        };

        try {
            await admin.messaging().sendToDevice(tokens, payload);
            console.log("Notificación enviada correctamente");
        } catch (error) {
            console.error("Error al enviar la notificación:", error);
        }
    } else {
        console.log("No hay tokens disponibles para enviar la notificación.");
    }
}
