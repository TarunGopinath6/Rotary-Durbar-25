import { initializeApp } from "firebase/app";

import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCACdpg1DMLAEN9-FaKPw1oXptiKEw3kmc",
  authDomain: "rotary-durbar.firebaseapp.com",
  projectId: "rotary-durbar",
  storageBucket: "rotary-durbar.firebasestorage.app",
  messagingSenderId: "833557278111",
  appId: "1:833557278111:web:e38c9bba056b9a927261aa",
  measurementId: "G-7S5CN0PF7K",
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);

export default app;
