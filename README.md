# MFP Jamstack Orkestrator

Dette projekt implementerer det **Orkestrerede Monorepo** arkitektur som beskrevet i `/docs/oplæg.md`.

## Arkitektur Oversigt

Vi bygger ikke én monolitisk applikation. Vi bygger en **orkestrator** (core-site), der dirigerer et **orkester** af pakker (/packages) og spiller efter en **partitur** af indhold (/content).

### Struktur

```
/main-project-repo/
├── .git/
├── .gitmodules          # Definerer vores submoduler
│
├── content/             # Mappe til content-submoduler
│   ├── registry.json    # Registrering af tilgængelige samlinger
│   └── bog-ux-2025/     # GIT SUBMODULE (eget repo)
│
├── packages/            # Mappe til package-submoduler
│   ├── registry.json    # Registrering af tilgængelige moduler
│   └── ui-kit/          # GIT SUBMODULE (eget repo med egen package.json)
│
├── site/                # Vores core React/Vite app (Orkestratoren)
│   ├── src/
│   │   ├── App.tsx
│   │   └── config/
│   │       └── runtime.ts  # Auto-genereret konfiguration
│   └── ...
│
└── scripts/
    └── pre-build.js     # Pre-build script der håndterer submoduler
```

## Kom i Gang

### 1. Installation
```bash
npm install
```

### 2. Udvikling
```bash
npm run dev
```

Pre-build scriptet kører automatisk og:
- Opdaterer git submoduler
- Installerer afhængigheder i submoduler
- Genererer runtime konfiguration

### 3. Build til produktion
```bash
npm run build
```

## Tilføjelse af Nyt Indhold

### Tilføj en ny content samling:
1. Opret et nyt Git-repository for indholdet
2. Tilføj som submodule: `git submodule add <repo_url> content/<samling_navn>`
3. Opdater `content/registry.json` med den nye samlings information
4. Commit ændringerne

### Tilføj et nyt UI-modul:
1. Opret et nyt Git-repository for modulet
2. Tilføj som submodule: `git submodule add <repo_url> packages/<modul_navn>`
3. Opdater `packages/registry.json` med den nye pakkes information
4. Commit ændringerne

## MFP Principper

Dette projekt følger **MFP (Modular Frontend & Headless APIs)** principperne:

- **Separation of Concerns**: Klar adskillelse mellem frontend og backend
- **Single Responsibility**: Hver komponent/service har ét ansvar
- **KISS**: Hold det simpelt og vedligeholdelsesvenligt

## Scripts

- `npm run dev` - Start udviklings-server
- `npm run build` - Byg til produktion
- `npm run preview` - Preview production build
- `npm run lint` - Kør linting

## Teknologier

- **Frontend**: React, TypeScript, Vite, Tailwind CSS
- **Routing**: React Router
- **Build**: Vite med custom pre-build script
- **Styling**: Tailwind CSS med shadcn/ui komponenter
