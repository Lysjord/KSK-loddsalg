// Funksjon for å registrere loddkjøp og lagre i Firestore
function registrerLodd() {
    const navn = document.getElementById('navn').value;
    const telefon = document.getElementById('telefon').value;
    const antall = parseInt(document.getElementById('antall').value);
    const selger = document.getElementById('selger').value;
    const tidspunkt = new Date().toLocaleString();

    // Hent eksisterende loddnummer
    firebase.firestore().collection('system').doc('loddnummer').get().then((doc) => {
        let sisteLodd = doc.exists ? doc.data().sisteLodd : 0;
        let loddnummerListe = [];

        // Opprett loddnummer for dette kjøpet
        for (let i = 1; i <= antall; i++) {
            sisteLodd++;
            loddnummerListe.push(sisteLodd);
        }

        // Lagre loddkjøpet i Firestore
        firebase.firestore().collection('loddkjop').add({
            navn: navn,
            telefon: telefon,
            antall: antall,
            selger: selger,
            tidspunkt: tidspunkt,
            loddnummer: loddnummerListe
        }).then(() => {
            console.log('Loddkjøp lagret med loddnummer:', loddnummerListe);

            // Oppdater siste loddnummer i Firestore
            firebase.firestore().collection('system').doc('loddnummer').set({
                sisteLodd: sisteLodd
            });

            // Oppdater solgte lodd i appen
            firebase.firestore().collection('loddkjop').get().then((snapshot) => {
                let totaltSolgte = 0;
                snapshot.forEach((doc) => {
                    totaltSolgte += doc.data().antall;
                });
                document.getElementById('solgteLodd').textContent = totaltSolgte;
            });
        });
    });
}
