// Sett inn din Firebase-konfigurasjon under.
// Du finner den i Firebase Console > Innstillinger > Prosjektinnstillinger > "SDK setup and config".

// const firebaseConfig = {
  apiKey: "AIzaSyApTliK7E_6euJJWFeVnAxqlbBK12Ir7Pc",
  authDomain: "ksk-loddsalg.firebaseapp.com",
  projectId: "ksk-loddsalg",
  storageBucket: "ksk-loddsalg.firebasestorage.app",
  messagingSenderId: "535132446143",
  appId: "1:535132446143:web:820bc7d375eedeb7ed150a",
  measurementId: "G-XNE8EJX4GT"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });
