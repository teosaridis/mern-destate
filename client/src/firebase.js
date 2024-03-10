// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API,
  authDomain: "mern-blog-5e9f0.firebaseapp.com",
  projectId: "mern-blog-5e9f0",
  storageBucket: "mern-blog-5e9f0.appspot.com",
  messagingSenderId: "1027103996507",
  appId: "1:1027103996507:web:de899052faecb128f7dd7e",
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
