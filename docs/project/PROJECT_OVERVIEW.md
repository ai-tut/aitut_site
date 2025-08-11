# Projektbeskrivelse: aitut_website

**Dato:** 2024-07-16

## 1. Overordnet Arkitektur

Dette projekt er struktureret som et **monorepo**, der administreres med `npm workspaces`. Målet er at adskille frontend-applikationen (`site`) fra indholdet (`content`), samtidig med at de kan udvikles og deployes som en samlet enhed.

Projektets rod indeholder konfigurationsfiler, der gælder for hele projektet, herunder:

*   `package.json`: Definerer projektets afhængigheder og `workspaces`.
*   `.gitmodules`: Definerer Git-submodulerne, der bruges til indholdsstyring.
*   `vite.config.ts` (i `site`-mappen): Håndterer byggeprocessen for frontend-applikationen, inklusiv PostCSS og Tailwind CSS.

### 1.1. Workspaces

`package.json` i roden er konfigureret med følgende `workspaces`:

```json
"workspaces": [
  "site",
  "content/*"
]
```

Denne konfiguration instruerer `npm` i at behandle `site`-mappen og alle undermapper i `content` som separate pakker. Dette muliggør:

*   **Centraliseret afhængighedsstyring:** `npm install` i roden installerer afhængigheder for alle workspaces.
*   **Lokal linking:** Pakker kan referere til hinanden lokalt, hvilket er essentielt for at `site` kan importere og rendere indhold fra `content`-pakkerne.

### 1.2. Git Submodules

Projektet anvender Git submodules til at administrere eksterne indholds-repositories. Dette adskiller indholdets Git-historik fra hovedprojektets historik.

*   **Konfiguration:** `.gitmodules`-filen definerer de submoduler, der er i brug. Stierne i denne fil er blevet rettet fra relative til **absolutte stier** for at undgå cirkulære referencer og sikre, at de peger korrekt på de lokale Git-repositories.
*   **Workflows:**
    1.  Ændringer laves og committes *inde i* submodule-mappen (f.eks. `content/lorem-ipsum-bog`).
    2.  Hoved-repositoryet opdateres derefter for at pege på den nye commit-hash for submodulet.

## 2. Frontend (`site`)

Frontend-applikationen er bygget med følgende teknologier:

*   **Framework:** React
*   **Build Tool:** Vite
*   **Styling:** Tailwind CSS
*   **UI Komponenter:** Shadcn UI

### 2.1. Styling og Tema

*   **Tailwind CSS:** Bruges til al styling. Konfigurationen findes i `site/tailwind.config.js`.
*   **PostCSS:** Behandles direkte af Vite gennem `site/vite.config.ts`. Tidligere konflikter blev løst ved at fjerne overflødige `postcss.config.js`-filer i både roden og `site`-mappen.
*   **Tema-skifter:** Funktionaliteten til at skifte mellem lyst og mørkt tema er implementeret. Problemer med denne funktionalitet skyldtes primært de nævnte konfigurationskonflikter og forventes løst efter overgangen til en ren monorepo-struktur.

## 3. Indhold (`content`)

Indholdet er organiseret i separate Git-repositories og integreret som submoduler.

*   `content/lorem-ipsum-bog`: Indeholder en samling Markdown-filer.
*   `content/bog-ux-2025`: Et andet indholds-repository.

Denne struktur gør det muligt for forfattere at arbejde på indhold uafhængigt af frontend-udviklingen.

## 4. Gennemførte Fejlfindings- og Løsningsprocesser

1.  **Problem: Submoduler blev sporet som almindelige filer.**
    *   **Årsag:** Forkerte, relative stier i `.gitmodules` (`url = ./content/...`) skabte en cirkulær reference.
    *   **Løsning:** Stierne blev opdateret til absolutte stier, der peger på de korrekte lokale Git-repositories. Efterfølgende blev Git-historikken renset ved at fjerne den forkerte sporing og committe den korrekte submodule-konfiguration.

2.  **Problem: Tema-skifter virkede ikke.**
    *   **Årsag:** Flere `postcss.config.js`-filer var i konflikt med den PostCSS-konfiguration, der allerede var defineret i `vite.config.ts`.
    *   **Løsning:** Alle overflødige `postcss.config.js`-filer blev slettet.

3.  **Problem: Projektet fungerede ikke som et ægte monorepo.**
    *   **Årsag:** `package.json` i roden manglede `workspaces`-definitionen. Dette forhindrede `npm` i at linke `site` og `content`-pakkerne korrekt.
    *   **Løsning:** `workspaces`-feltet blev tilføjet til `package.json`, og `npm install` blev kørt fra roden for at etablere den korrekte monorepo-struktur.

## 5. Næste Skridt

*   **Verificer Tema-skifter:** Bekræft, at tema-skifteren nu fungerer som forventet efter de seneste arkitektoniske ændringer.
*   **Indholds-integration:** Begynd at bygge den logik i `site`-applikationen, der skal hente og rendere Markdown-indholdet fra `content`-mapperne.
*   **Deployment:** Konfigurer `deploy.yml` workflowet til at håndtere byggeprocessen for et monorepo, inklusiv initialisering af submoduler.