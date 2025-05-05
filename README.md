# KSK-loddsalg
Loddsalg
# KSK Loddsalg – Komplett Webapp

## Innhold
Denne appen er laget for loddsalg til støtte for fotballag. Den består av:

- **Brukerside (`index.html`)**: Skjema for kjøp av lodd med navn, telefon, antall og selger.
- **Adminpanel (`admin.html`)**: Krever innlogging. Viser alle kjøp og gir mulighet for eksport.
- **Firebase-integrasjon**: Alle kjøp lagres i Firestore. Automatisk tildeling av loddnumre.
- **Visuell oversikt**: Teller for "Lodd igjen", kvittering for kjøper.
- **Modulær struktur**: JavaScript-filer er delt opp (`app.js`, `admin.js`).

## Konfigurasjon
1. Opprett et Firebase-prosjekt på [firebase.google.com](https://firebase.google.com)
2. Gå til **Prosjektinnstillinger > "SDK-konfigurasjon"** og kopier JavaScript-objektet
3. Lim inn din konfig i `firebase-config.js`

```js
const firebaseConfig = {
  apiKey: "...",
  authDomain: "...",
  projectId: "...",
  ...
};
firebase.initializeApp(firebaseConfig);
firebase.firestore().settings({ timestampsInSnapshots: true });
