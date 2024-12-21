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


// The Cloud Functions for Firebase SDK to create Cloud Functions and triggers.
const {logger} = require("firebase-functions");
const {onRequest} = require("firebase-functions/v2/https");
const {onDocumentCreated} = require("firebase-functions/v2/firestore");
// Take the text parameter passed to this HTTP endpoint and insert it into
// Firestore under the path /messages/:documentId/original
exports.addmessage = onRequest(async (req, res) => {
   // Grab the text parameter.
   const original = req.query.text;
   // Push the new message into Firestore using the Firebase Admin SDK.
   const writeResult = await getFirestore()
       .collection("jugadores")
       .add({original: original});
   // Send back a message that we've successfully written the message
   res.json({result: `Message with ID: ${writeResult.id} added.`});
 });

// Listens for new messages added to /messages/:documentId/original
// and saves an uppercased version of the message
// to /messages/:documentId/uppercase
exports.makeuppercase = onDocumentCreated("/messages/{documentId}", (event) => {
   // Grab the current value of what was written to Firestore.
   const original = event.data.data().original;
 
   // Access the parameter `{documentId}` with `event.params`
   logger.log("Uppercasing", event.params.documentId, original);
 
   const uppercase = original.toUpperCase();
 
   // You must return a Promise when performing
   // asynchronous tasks inside a function
   // such as writing to Firestore.
   // Setting an 'uppercase' field in Firestore document returns a Promise.
   return event.data.ref.set({uppercase}, {merge: true});
 });

export { app, db, storage};
