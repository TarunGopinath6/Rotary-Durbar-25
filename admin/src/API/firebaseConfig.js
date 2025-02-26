import { initializeApp } from "firebase/app";
import { getAuth, initializeAuth, setPersistence, browserLocalPersistence } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: process.env.REACT_APP_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_FIREBASE_PROJECT_ID,
  storageBucket: process.env.REACT_APP_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_FIREBASE_APP_ID,
  measurementId: process.env.REACT_APP_FIREBASE_MEASUREMENT_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = initializeAuth(app, {});


setPersistence(auth, browserLocalPersistence)
  .then(() => {
    // Now the user is persisted across page reloads
    // You can perform authentication tasks here like login, signup, etc.
    console.log('Persistence')
  })
  .catch((error) => {
    console.error("Error setting persistence: ", error);
  });

// export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
