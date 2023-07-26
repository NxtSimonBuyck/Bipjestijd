import { FirebaseOptions, initializeApp } from "firebase/app";
import { collection, doc, getFirestore, setDoc } from "firebase/firestore";
// ... other firebase imports

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig: FirebaseOptions = {
  apiKey: "AIzaSyC_ZusfQPmxjowrbGAuRSDe_e1p2g2jrK8",
  authDomain: "bipjestijd-902b0.firebaseapp.com",
  projectId: "bipjestijd-902b0",
  storageBucket: "bipjestijd-902b0.appspot.com",
  messagingSenderId: "669946174720",
  appId: "1:669946174720:web:90fadba999e2f8ca3527e5",
  measurementId: "G-Z8ZG4W21QL",
};

export const firebaseApp = initializeApp(firebaseConfig);

// used for the firestore refs
export const db = getFirestore(firebaseApp);

export const todosRef = collection(db, "todos");
console.log(todosRef);
