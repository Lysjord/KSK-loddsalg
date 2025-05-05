document.addEventListener("DOMContentLoaded", async () => {
    const selgerListe = [
        "Velg fotballspiller",  // Første valg i rullegardin
        "Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4", "Spiller 5",
        "Spiller 6", "Spiller 7", "Spiller 8", "Spiller 9", "Spiller 10",
        "Spiller 11", "Spiller 12", "Spiller 13", "Spiller 14", "Spiller 15",
        "Spiller 16", "Spiller 17", "Spiller 18", "Spiller 19", "Spiller 20"
    ];

    const selgerSelect = document.getElementById("selger");
    selgerListe.forEach((navn, index) => {
        const option = document.createElement("option");
        option.value = index === 0 ? "" : navn;
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
                loddNumre.push(tildelte + i);
            }

            kjøp.loddNumre = loddNumre;
            await kjøpRef.add(kjøp);
            document.getElementById("loddIgjen").textContent = 5000 - (tildelte + antall);
        }
    });
});
