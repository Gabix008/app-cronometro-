import {  initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';


const firebaseConfig = {
  apiKey: "AIzaSyAqT9lddNwPW2KymLDTF779BujV6UNkzpk",
  authDomain: "app-cronometro.firebaseapp.com",
  projectId: "app-cronometro",
  storageBucket: "app-cronometro.appspot.com",
  messagingSenderId: "98787965007",
  appId: "1:98787965007:web:faf51a5c248339933e523a"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app)
export { db, auth };
