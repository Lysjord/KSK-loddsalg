// firebase-config.js
var firebaseConfig = {
  apiKey: "AIzaSyApTlik7E_6euJJWFeVnAxqlbBK12Ir7Pc",
  authDomain: "ksk-loddsalg.firebaseapp.com",
  projectId: "ksk-loddsalg",
  storageBucket: "ksk-loddsalg.appspot.com",
  messagingSenderId: "535132446143",
  appId: "1:535132446143:web:820bc7d375eede7ed150a",
  measurementId: "G-XNE8EJX4GT"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });
