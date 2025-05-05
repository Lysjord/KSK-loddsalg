document.addEventListener("DOMContentLoaded", async () => {
    const selgerListe = ["Selger 1", "Selger 2", "Selger 3"];
    const selgerSelect = document.getElementById("selger");

    selgerListe.forEach(navn => {
        const option = document.createElement("option");
        option.value = navn;
        option.textContent = navn;
        selgerSelect.appendChild(option);
    });

    const form = document.getElementById("loddsalgForm");
    const kvittering = document.getElementById("kvittering");

    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const navn = document.getElementById("navn").value.trim();
        const telefon = document.getElementById("telefon").value.trim();
        const antall = parseInt(document.getElementById("antall").value);
        const selger = document.getElementById("selger").value;

        if (!navn || !telefon || !antall || !selger) {
            alert("Fyll ut alle felter.");
            return;
        }

        const kjøp = {
            navn,
            telefon,
            antall,
            selger,
            tidspunkt: new Date().toISOString(),
        };

        kvittering.innerHTML = `Takk for kjøpet, ${navn}! Du har kjøpt ${antall} lodd.`;
        kvittering.style.display = "block";

        // Firebase lagring
        if (window.firebase) {
            const db = firebase.firestore();
            const kjøpRef = db.collection("loddkjop");
            const snapshot = await kjøpRef.get();
            let tildelte = snapshot.docs.reduce((sum, doc) => sum + (doc.data().antall || 0), 0);

            if (tildelte + antall > 5000) {
                alert("Ikke nok lodd igjen.");
                return;
            }

            const loddNumre = [];
            for (let i = 1; i <= antall; i++) {
                loddNumre.push(t
