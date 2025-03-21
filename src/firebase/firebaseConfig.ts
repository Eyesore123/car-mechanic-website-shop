import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
// Additional imports for Firebase Emulators and Firebase functions:
// import { connectFirestoreEmulator } from "firebase/firestore";
// import { connectAuthEmulator } from "firebase/auth";
// import { getFunctions, connectFunctionsEmulator } from "firebase/functions";

// Firebase configuration

const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,  
};

// Initialize Firebase

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
setPersistence(auth, browserLocalPersistence);

export const db = getFirestore(app);

// Emulators for local development

// const functions = getFunctions(app);

// if (process.env.NODE_ENV === 'development') {
//     connectFirestoreEmulator(db, 'localhost', 8080);
//     connectAuthEmulator(auth, 'http://localhost:9099');
//     connectFunctionsEmulator(functions, 'localhost', 5001);
//     console.log('Using Firebase emulators in development mode');
// }

// export { functions };

export const storage = getStorage(app);
export default app;