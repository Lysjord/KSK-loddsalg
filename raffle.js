document.getElementById('kjopSkjema').addEventListener('submit', async function (e) { e.preventDefault();

const navn = document.getElementById('navn').value;
const telefon = document.getElementById('telefon').value;
const antall = parseInt(document.getElementById('antall').value);
const selger = document.getElementById('selger').value;
const loddkjopRef = firebase.firestore().collection('loddkjop');

try {
    const loddkjopSnapshot = await loddkjopRef.get();
    const antallSolgteLodd = loddkjopSnapshot.docs.reduce((sum, doc) => {
        const data = doc.data();
        return sum + (data.lodd ? data.lodd.length : 0);
    }, 0);

    const startLoddnummer = antallSolgteLodd + 1;
    const loddNumre = [];

    for (let i = 0; i < antall; i++) {
        loddNumre.push(startLoddnummer + i);
    }

    await loddkjopRef.add({
        navn: navn,
        telefon: telefon,
        selger: selger,
        antall: antall,
        lodd: loddNumre,
        tidspunkt: new Date().toISOString()
    });

    alert('Kjøp registrert. Loddnumre: ' + loddNumre.join(', '));
    document.getElementById('kjopSkjema').reset();

} catch (error) {
    console.error('Feil ved registrering av kjøp:', error);
    alert('Det oppstod en feil ved registrering av kjøp. Vennligst prøv igjen.');
}

});

