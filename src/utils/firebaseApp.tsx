import { initializeApp } from "firebase/app";
import { getFirestore, collection } from 'firebase/firestore';


const firebaseConfig = {
    apiKey: "AIzaSyBmu9Lhj9Stp8dhamvCA4oi16o_jU4qnQM",
    authDomain: "reason-score.firebaseapp.com",
    databaseURL: "https://reason-score.firebaseio.com",
    projectId: "reason-score",
    storageBucket: "reason-score.appspot.com",
    messagingSenderId: "403624872089",
    appId: "1:403624872089:web:5d9685888a79f58ebe5008"
};
// Initialize Firebase
export const firebaseApp = initializeApp(firebaseConfig);
export const firestore = getFirestore(firebaseApp);
export const firestoreMainPath = 'beta01';
