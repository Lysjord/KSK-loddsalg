
document.addEventListener("DOMContentLoaded", async () => {
    const selgerListe = [
        "Spiller 1", "Spiller 2", "Spiller 3", "Spiller 4", "Spiller 5",
        "Spiller 6", "Spiller 7", "Spiller 8", "Spiller 9", "Spiller 10",
        "Spiller 11", "Spiller 12", "Spiller 13", "Spiller 14", "Spiller 15",
        "Spiller 16", "Spiller 17", "Spiller 18", "Spiller 19", "Spiller 20"
    ];

    const selgerSelect = document.getElementById("selger");

    // Første valg: ikke-valgt
    const placeholder = document.createElement("option");
    placeholder.value = "";
    placeholder.textContent = "Velg fotballspiller";
    placeholder.disabled = true;
    placeholder.selected = true;
    selgerSelect.appendChild(placeholder);

    // Legg til alle selgere
    selgerListe.forEach(navn => {
        const option = document.createElement("option");
        option.value = navn;
        option.textContent = navn;
