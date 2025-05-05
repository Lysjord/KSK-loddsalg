// Sett inn din Firebase-konfigurasjon under.
// Du finner den i Firebase Console > Innstillinger > Prosjektinnstillinger > "SDK setup and config".

// Eksempel:
const firebaseConfig = {
  apiKey: "DIN_API_KEY",
  authDomain: "DITT_PROSJEKT.firebaseapp.com",
  projectId: "DITT_PROSJEKT_ID",
  storageBucket: "DITT_PROSJEKT.appspot.com",
  messagingSenderId: "XXXXXX",
  appId: "1:XXXXXXX:web:XXXXXXX"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });
