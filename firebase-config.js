// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyApTliK7E_6euJJWFeVnAxqlbBK12Ir7Pc",
  authDomain: "ksk-loddsalg.firebaseapp.com",
  projectId: "ksk-loddsalg",
  storageBucket: "ksk-loddsalg.firebasestorage.app",
  messagingSenderId: "535132446143",
  appId: "1:535132446143:web:820bc7d375eedeb7ed150a",
  measurementId: "G-XNE8EJX4GT"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
