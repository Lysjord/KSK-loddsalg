p
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
// Redigerbare lister (lagres midlertidig i Firestore for enkelhet)

// LAST INN spillere/premier/sponsorer
document.addEventListener("DOMContentLoaded", () => {
  if (location.pathname.includes("admin.html")) {
    firebase.firestore().collection("system").doc("konfig").get().then(doc => {
      const data = doc.exists ? doc.data() : {};
      visRedigerbarListe("spillere", data.spillere || []);
      visRedigerbarListe("premier", data.premier || []);
      visRedigerbarListe("sponsorer", data.sponsorer || []);
    });
  }
});

function visRedigerbarListe(type, liste) {
  let html = `<ul id="${type}Liste">`;
  liste.forEach((item, i) => {
    html += `<li>
      <input type="text" value="${item}" onchange="lagreEndring('${type}', ${i}, this.value)">
      <button onclick="fjernElement('${type}', ${i})">Fjern</button>
    </li>`;
  });
  html += `</ul>
    <button onclick="leggTilElement('${type}')">+ Legg til ${type}</button>`;
  document.getElementById(`${type}Redigering`).innerHTML = html;
}

function lagreEndring(type, index, nyVerdi) {
  firebase.firestore().collection("system").doc("konfig").get().then(doc => {
    const data = doc.data() || {};
    if (!data[type]) data[type] = [];
    data[type][index] = nyVerdi;
    firebase.firestore().collection("system").doc("konfig").set(data);
  });
}

function leggTilElement(type) {
  firebase.firestore().collection("system").doc("konfig").get().then(doc => {
    const data = doc.data() || {};
    if (!data[type]) data[type] = [];
    data[type].push("Ny oppføring");
    firebase.firestore().collection("system").doc("konfig").set(data).then(() => {
      visRedigerbarListe(type, data[type]);
    });
  });
}

function fjernElement(type, index) {
  firebase.firestore().collection("system").doc("konfig").get().then(doc => {
    const data = doc.data() || {};
    if (!data[type]) return;
    data[type].splice(index, 1);
    firebase.firestore().collection("system").doc("konfig").set(data).then(() => {
      visRedigerbarListe(type, data[type]);
    });
  });
}
// LAST OPP SPONSORBILDE
function lastOppSponsor() {
  const fil = document.getElementById("sponsorBilde").files[0];
  if (!fil) return alert("Velg et bilde først");

  const storageRef = firebase.storage().ref("sponsorer/" + fil.name);
  storageRef.put(fil).then(snapshot => {
    return snapshot.ref.getDownloadURL();
  }).then(url => {
    // Lagre URL i system/konfig -> sponsorbilder
    firebase.firestore().collection("system").doc("konfig").get().then(doc => {
      const data = doc.data() || {};
      if (!data.sponsorbilder) data.sponsorbilder = [];
      data.sponsorbilder.push(url);
      firebase.firestore().collection("system").doc("konfig").set(data).then(() => {
        alert("Sponsorbilde lastet opp!");
        visSponsorbilder(data.sponsorbilder);
      });
    });
  });
}

function visSponsorbilder(liste) {
  let html = "<div style='display:flex;flex-wrap:wrap;gap:10px;'>";
  liste.forEach(url => {
    html += `<img src="${url}" style="height:80px;border:1px solid #ccc;" />`;
  });
  html += "</div>";
  document.getElementById("sponsorRedigering").innerHTML += html;
}
