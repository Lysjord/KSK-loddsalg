document.addEventListener("DOMContentLoaded", async () => {
    // Sett opp 20 plasser – du kan senere fylle inn navn i denne listen
    const selgerListe = new Array(20).fill("").map((_, i) => `Spiller ${i + 1}`);

    const selgerSelect = document.getElementById("selger");

    // Lag først "Velg fotballspiller"-knappen
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Velg fotballspiller";
    placeholder.disabled = true;
    placeholder.selected = true;
    selgerSelect.appendChild(placeholder);

    // Legg til 20 tomme plasser som du kan endre manuelt i filen
    selgerListe.forEach(navn => {
        const option = document.createElement("option");
        option.value = navn;
        option.textContent = navn;
        selgerSelect.appendChild(option);
    });

    // Resten av funksjonaliteten (skjema, Firebase, validering osv.)
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
