// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCz8pT8ebVqx_yt-M3ajeoAMZ-2P68GsTw",
  authDomain: "expense-tracker-35d95.firebaseapp.com",
  projectId: "expense-tracker-35d95",
  storageBucket: "expense-tracker-35d95.appspot.com",
  messagingSenderId: "1087047375413",
  appId: "1:1087047375413:web:8bf0059a1de3685f3e2f7c",
  measurementId: "G-H5NK4J1PT3"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app);
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

export { db, auth, provider, doc, setDoc };

