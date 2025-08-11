# Dokumentation for Webhotel Opsætning på Netgiganten

Denne fil beskriver den nuværende konfiguration og arbejdsgang for `aitut.eu`-projektet på webhotellet.

## Oversigt

Projektet er en moderne React/TypeScript-applikation, der bygges med Vite. Det kører som en dynamisk Node.js-applikation via cPanel, hvor en Express-server serverer de statisk byggede filer. Kildekoden hentes fra et privat GitHub-repository.

---

## Nøglekomponenter

1.  **Kildekode:**
    *   **Repository:** `git@github.com:ai-tut/aitut_site.git` (Privat)
    *   **Adgang:** Sker via en SSH-nøgle (`~/.ssh/Github_aitut`), der er tilføjet til en personlig GitHub-konto med adgang til repository'et.
    *   **SSH Konfiguration:** `~/.ssh/config`-filen sikrer, at den korrekte nøgle bruges til `github.com`.

2.  **Node.js Miljø:**
    *   **Styring:** Håndteres af "Setup Node.js App" i cPanel.
    *   **Version:** Node.js v22.13.1 eller nyere.
    *   **Dependencies:** Pakker specificeret i `package.json` installeres via `npm install` og placeres i et virtuelt miljø styret af CloudLinux.

3.  **Byggeproces (Build Process):**
    *   **Værktøj:** Vite bruges til at bygge og optimere projektet.
    *   **Kommando:** `npm run build`
    *   **Output:** Denne kommando genererer en `dist`-mappe, som indeholder de færdige, produktionsklare HTML-, CSS- og JavaScript-filer.

4.  **Servering (Serving):**
    *   **Server:** En lille Express.js-server, defineret i `app.js`.
    *   **Funktion:**
        1.  Starter en Node.js-proces.
        2.  Serverer statisk indhold fra `dist`-mappen.
        3.  Håndterer "client-side routing" ved at omdirigere alle requests til `dist/index.html`, så React Router kan overtage.
    *   **Startup Fil:** `app.js` er sat som "Application startup file" i cPanel.

---

## Arbejdsgang for Opdateringer

Følg disse trin for at opdatere hjemmesiden med ny kode:

1.  **Udvikl lokalt:** Lav ændringer i koden på din egen computer.
2.  **Push til GitHub:** Commit og push dine ændringer til `main`-branchen på GitHub.
    ```bash
    git add .
    git commit -m "Din besked"
    git push origin main
    ```
3.  **Log ind på serveren:**
    ```bash
    ssh cffbkvcw@web3.netgiganten.dk
    ```
4.  **Naviger til projektmappen:**
    ```bash
    cd /home/cffbkvcw/aitut.eu
    ```
5.  **Hent ændringer fra GitHub:**
    ```bash
    git pull origin main
    ```
    *(Du kan blive bedt om adgangskoden til din SSH-nøgle, `Github_aitut`).*

6.  **Installer nye afhængigheder (hvis nødvendigt):**
    Hvis du har tilføjet eller opdateret pakker i `package.json`.
    ```bash
    npm install
    ```
7.  **Byg projektet igen:**
    Dette er det vigtigste skridt for at opdatere frontenden.
    ```bash
    npm run build
    ```
8.  **Genstart Node.js Applikationen:**
    *   Log ind på cPanel.
    *   Gå til "Setup Node.js App".
    *   Find `aitut.eu`-applikationen.
    *   Klik på **"RESTART"**-knappen.

Din hjemmeside er nu opdateret med de seneste ændringer.