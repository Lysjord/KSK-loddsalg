function login() {
    const user = document.getElementById("adminUser").value;
    const pass = document.getElementById("adminPass").value;

    if (user === "Tomasfremnesvik@gmail.com" && pass === "kskg13") {
        document.getElementById("loginForm").style.display = "none";
        document.getElementById("adminContent").style.display = "block";
        loadKjop();
    } else {
        alert("Feil brukernavn eller passord.");
    }
}

async function loadKjop() {
    if (window.firebase) {
        const db = firebase.firestore();
        const ref = await db.collection("loddkjop").get();
        let html = "<table border='1' style='width:100%; border-collapse:collapse;'>";
        html += "<tr><th>Navn</th><th>Telefon</th><th>Antall</th><th>Selger</th><th>Loddnummer</th></tr>";
        ref.forEach(doc => {
            const d = doc.data();
            html += `<tr>
                <td>${d.navn}</td>
                <td>${d.telefon}</td>
                <td>${d.antall}</td>
                <td>${d.selger}</td>
                <td>${(d.loddNumre || []).join(", ")}</td>
            </tr>`;
        });
        html += "</table>";
        document.getElementById("kjopTabell").innerHTML = html;
    }
}

function exportData() {
    alert("Eksport til CSV ikke aktivert enda – kan legges til i neste versjon.");
}
