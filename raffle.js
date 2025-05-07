// Oppdatert funksjon for å registrere loddkjøp med loddnumre function registrerLoddkjop(navn, telefon, antall, selger) { const loddkjopRef = firebase.firestore().collection("loddkjop"); const loddRef = firebase.firestore().collection("loddnumre");

// Hent siste loddnummer
loddRef.orderBy("nummer", "desc").limit(1).get()
    .then((snapshot) => {
        let sisteLoddNummer = 0;
        if (!snapshot.empty) {
            sisteLoddNummer = snapshot.docs[0].data().nummer;
        }

        // Generer loddnumre
        const nyeLoddNumre = [];
        for (let i = 1; i <= antall; i++) {
            sisteLoddNummer++;
            nyeLoddNumre.push(sisteLoddNummer);
            // Legg til hvert loddnummer i 'loddnumre'-kolleksjonen
            loddRef.add({ nummer: sisteLoddNummer });
        }

        // Opprett kjøpsdokument
        loddkjopRef.add({
            navn: navn,
            telefon: telefon,
            antall: antall,
            selger: selger,
            loddnumre: nyeLoddNumre,
            tidspunkt: firebase.firestore.Timestamp.now()
        }).then(() => {
            console.log("Loddkjøp registrert med loddnumre:", nyeLoddNumre);
        }).catch((error) => {
            console.error("Feil ved registrering av loddkjøp:", error);
        });
    })
    .catch((error) => {
        console.error("Feil ved henting av siste loddnummer:", error);
    });

}

// Eksempel på bruk: // registrerLoddkjop("Tomas Fremnesvik", "41210238", 3, "Viljar");

