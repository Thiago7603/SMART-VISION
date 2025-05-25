// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDzfyQuzjBTXsXsh_I3OBvHoYU4mT_h0Ow",
  authDomain: "app-smartvision.firebaseapp.com",
  projectId: "app-smartvision",
  storageBucket: "app-smartvision.firebasestorage.app",
  messagingSenderId: "386214928210",
  appId: "1:386214928210:web:02445dc33e038d1d09248b",
  measurementId: "G-Z1G1Y7XMRY"
};

// Initialize Firebase
// Initialize Firebase
export const app = initializeApp(firebaseConfig);
// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
export const Storage = getStorage(app);  