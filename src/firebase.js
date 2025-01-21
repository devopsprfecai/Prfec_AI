// firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";


const firebaseConfig = {
  apiKey: "AIzaSyBTTI4hYWkyX7QDvwqdnIWIgNM25WgPu6A",
  authDomain: "prfecai-auth.firebaseapp.com",
  projectId: "prfecai-auth",
  storageBucket: "prfecai-auth.appspot.com",
  messagingSenderId: "349382070894",
  appId: "1:349382070894:web:afeef9e54ba4bb0ae2cc7f",
  measurementId: "G-42TLWVPDJB",
  databaseURL: "https://prfecai-auth-default-rtdb.firebaseio.com/",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const database = getDatabase(app);
const dbStore = getFirestore(app);


export { auth, database, dbStore };
