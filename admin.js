
// Admin-innlogging
function login() {
  const user = document.getElementById("adminUser").value;
  const pass = document.getElementById("adminPass").value;

  if (user === "tomasfremnesvik@gmail.com" && pass === "kskg2013") {
    document.getElementById("loginForm").style.display = "none";
    document.getElementById("adminContent").style.display = "block";
    lastInnAlt();
  } else {
    alert("Feil brukernavn eller passord.");
  }
}

async function lastInnAlt() {
  const db = firebase.firestore();
  const kjøpRef = await db.collection("loddkjop").get();

  const kjøpData = [];
  const spillerTeller = {};

  let kjøpHTML = "<table><tr><th>Navn</th><th>Telefon</th><th>Antall</th><th>Selger</th><th>Lodd</th><th>Tid</th></tr>";

  kjøpRef.forEach(doc => {
    const d = doc.data();
    kjøpData.push(d);
    kjøpHTML += `<tr><td>${d.navn}</td><td>${d.telefon}</td><td>${d.antall}</td><td>${d.selger}</td><td>${(d.loddNumre || []).join(', ')}</td><td>${new Date(d.tidspunkt).toLocaleString()}</td></tr>`;
    
    if (spillerTeller[d.selger]) {
      spillerTeller[d.selger] += d.antall;
    } else {
      spillerTeller[d.selger] = d.antall;
    }
  });

  kjøpHTML += "</table>";
  document.getElementById("kjopTabell").innerHTML = kjøpHTML;

  const statistikk = Object.entries(spillerTeller).sort((a,b) => b[1] - a[1]);
  let statHTML = "<table><tr><th>Spiller</th><th>Antall solgte lodd</th></tr>";
  statistikk.forEach(([spiller, antall]) => {
    statHTML += `<tr><td>${spiller}</td><td>${antall}</td></tr>`;
  });
  statHTML += "</table>";
  document.getElementById("statistikkTabell").innerHTML = statHTML;

  window._kjopData = kjøpData;
  window._statistikk = statistikk;
}

// Eksporter kjøp til CSV
function exportKjop() {
  const rows = [["Navn", "Telefon", "Antall", "Selger", "Lodd", "Tid"]];
  window._kjopData.forEach(d => {
    rows.push([d.navn, d.telefon, d.antall, d.selger, (d.loddNumre || []).join(', '), new Date(d.tidspunkt).toLocaleString()]);
  });
  downloadCSV(rows, `ksk-loddkjop-${new Date().toISOString().slice(0,10)}.csv`);
}

// Eksporter statistikk til CSV
function exportStatistikk() {
  const rows = [["Spiller", "Antall lodd"]];
  window._statistikk.forEach(([navn, antall]) => {
    rows.push([navn, antall]);
  });
  downloadCSV(rows, `ksk-salgsstatistikk-${new Date().toISOString().slice(0,10)}.csv`);
}

// CSV-generator
function downloadCSV(rows, filename) {
  const csvContent = rows.map(e => e.join(",")).join("\n");
  const blob = new Blob([csvContent], { type: "text/csv" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Trekning
function trekkVinner() {
  const alleLodd = [];
  window._kjopData.forEach(d => {
    (d.loddNumre || []).forEach(nr => {
      alleLodd.push({ nr, navn: d.navn, telefon: d.telefon, selger: d.selger });
    });
  });
  const tilfeldig = alleLodd[Math.floor(Math.random() * alleLodd.length)];
  document.getElementById("trekningsresultat").innerHTML = 
    `<strong>Vinner:</strong><br>Lodd nr ${tilfeldig.nr}<br>${tilfeldig.navn}<br>${tilfeldig.telefon}<br>Solgt av: ${tilfeldig.selger}`;
}
