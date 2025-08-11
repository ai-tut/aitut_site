## **Arkitektonisk Oplæg: Det Orkestrerede Monorepo**

Dette dokument beskriver den implementerede orkestrerede monorepo-arkitektur baseret på MFP (Modular Frontend & Headless APIs) principperne. Arkitekturen kombinerer en central orkestrator med modulære komponenter og indholdssamlinger for at skabe en skalerbar og vedligeholdelsesvenlig Jamstack-løsning.

### **1\. Arkitektonisk Filosofi: Orkestrator-Mønsteret**

I stedet for en event-drevet tilgang har vi implementeret en orkestrator-baseret arkitektur, hvor hovedprojektet fungerer som den centrale koordinator. Dette sikrer deterministisk byggeprocesser og fuld kontrol over afhængigheder og versioner.

### **2\. Projektstruktur og Komponenter**

Den orkestrerede monorepo-arkitektur består af følgende hovedkomponenter:

```
aitut_website/
├── packages/                    # UI-moduler og komponenter
│   ├── registry.json           # Modul-registrering
│   └── [submodules]            # Git submoduler (ui-kit, etc.)
├── content/                     # Indholdssamlinger
│   ├── registry.json           # Indholdsregistrering
│   └── [submodules]            # Git submoduler (bog-ux-2025, etc.)
├── site/                       # Hovedapplikationen (React/Vite)
│   ├── src/
│   │   ├── config/
│   │   │   └── runtime.ts      # Auto-genereret konfiguration
│   │   └── App.tsx             # Hovedkomponent med routing
│   └── [standard Vite setup]
├── scripts/
│   └── pre-build.js            # Orkestrator-script
└── .github/workflows/
    └── deploy.yml              # CI/CD pipeline
```

**Kerneprincippet:** Orkestratorens `pre-build.js` script koordinerer alle moduler og indhold før hver build, hvilket sikrer konsistens og opdaterede afhængigheder.

### **3\. Orkestrator-Processen: Pre-Build Script**

Hjertet i arkitekturen er `scripts/pre-build.js`, som udfører følgende trin i rækkefølge:

#### **Trin 1: Submodule-Opdatering**
```javascript
// Opdaterer alle Git submoduler til deres seneste commits
git submodule update --init --recursive
```

#### **Trin 2: Afhængighedsinstallation**
```javascript
// Læser packages/registry.json og installerer npm-afhængigheder
// for hvert modul, der har en package.json
for (const module of packagesRegistry.modules) {
  if (fs.existsSync(packageJsonPath)) {
    execSync('npm install', { cwd: modulePath });
  }
}
```

#### **Trin 3: Runtime-Konfiguration**
```javascript
// Genererer site/src/config/runtime.ts baseret på registries
const runtimeConfig = {
  modules: packagesRegistry.modules,
  collections: contentRegistry.collections
};
```

**Resultat:** Hver gang `npm run dev`, `npm run build` eller `npm run preview` køres, sikrer pre-build scriptet, at alle moduler og indhold er opdateret og konfigureret korrekt.

### **4\. Registry-Systemet: Modulær Konfiguration**

Arkitekturen bruger to registry-filer til at definere moduler og indholdssamlinger:

#### **packages/registry.json**
```json
{
  "modules": [
    {
      "name": "ui-kit",
      "path": "./ui-kit",
      "entry": "src/index.ts"
    }
  ]
}
```

#### **content/registry.json**
```json
{
  "collections": [
    {
      "id": "web-ux-2025",
      "path": "./bog-ux-2025",
      "toc": "toc.yml"
    }
  ]
}
```

**Fordele ved Registry-Systemet:**
- **Deklarativ Konfiguration:** Alle moduler og indhold defineres eksplicit
- **Type-Sikkerhed:** TypeScript-interfaces sikrer konsistens
- **Skalerbarhed:** Nye moduler tilføjes simpelt ved at opdatere registry
- **Versionskontrol:** Registries er under versionskontrol og kan spores

### **5\. CI/CD Pipeline: Automatiseret Deployment**

Den nuværende CI/CD-pipeline i `.github/workflows/deploy.yml` implementerer følgende proces:

```yaml
name: Deploy to autut.eu

on:
  push:
    branches: [ main ]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - name: Checkout code
        uses: actions/checkout@v4

      - name: Set up Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'

      - name: Install dependencies
        run: npm ci

      - name: Build project
        run: npm run build  # Kører automatisk pre-build.js

      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

**Deployment-Flow:**
1. **Trigger:** Push til `main` branch
2. **Pre-Build:** Orkestrator opdaterer submoduler og genererer konfiguration
3. **Build:** Vite bygger den statiske site fra `site/` mappen
4. **Deploy:** Statiske filer deployes til GitHub Pages

### **7\. Eksterne Repositories og Uafhængige Deploy-Scripts**

En af de store styrker ved den orkestrerede arkitektur er, at både `/packages` og `/content` kan indeholde Git submoduler fra helt uafhængige repositories. Dette giver maksimal fleksibilitet:

#### **Eksterne Repository Integration**

```bash
# Tilføj et eksternt UI-modul
git submodule add https://github.com/external-org/awesome-ui-kit.git packages/awesome-ui-kit

# Tilføj eksternt indhold
git submodule add https://github.com/content-team/marketing-content.git content/marketing-content
```

Derefter opdateres de relevante registry-filer:

**packages/registry.json:**
```json
{
  "modules": [
    {
      "name": "ui-kit",
      "path": "./ui-kit",
      "entry": "src/index.ts"
    },
    {
      "name": "awesome-ui-kit",
      "path": "./awesome-ui-kit",
      "entry": "dist/index.js"
    }
  ]
}
```

#### **Uafhængige Deploy-Scripts i Eksterne Repos**

Eksterne repositories kan have deres egne CI/CD-pipelines og deploy-scripts, som kører uafhængigt af hovedprojektet:

**Eksempel: awesome-ui-kit/.github/workflows/build-and-test.yml**
```yaml
name: Build and Test UI Kit

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run test
      - run: npm run build
      - run: npm run lint
```

#### **Fordele ved Denne Tilgang**

* **Uafhængighed:** Eksterne teams kan udvikle og deploye deres moduler selvstændigt
* **Versionskontrol:** Hovedprojektet kan vælge præcis hvilken version af hvert modul der skal bruges
* **Kvalitetssikring:** Eksterne repos kan have deres egne test- og kvalitetsprocedurer
* **Skalerbarhed:** Ubegrænset antal eksterne bidragydere uden at påvirke hovedprojektets kompleksitet

#### **Orkestrator-Koordination**

Når `pre-build.js` kører, håndterer den automatisk både lokale og eksterne submoduler:

```javascript
// Opdaterer ALLE submoduler (lokale og externe)
git submodule update --init --recursive

// Installerer afhængigheder for alle moduler med package.json
for (const module of packagesRegistry.modules) {
  const modulePath = path.join(projectRoot, 'packages', module.name);
  if (fs.existsSync(path.join(modulePath, 'package.json'))) {
    execSync('npm install', { cwd: modulePath });
  }
}
```

**Resultat:** Hovedprojektet fungerer som en "orkestrator", der samler og koordinerer moduler fra forskellige kilder, mens hvert modul kan udvikles og testes uafhængigt.

### **8\. Konklusion: Orkestrator vs. Event-Drevet**

Den orkestrerede tilgang giver følgende fordele over en event-drevet arkitektur:

* **Deterministisk:** Byggeprocessen er forudsigelig og reproducerbar
* **Kontrolleret:** Fuld kontrol over hvornår og hvordan afhængigheder opdateres
* **Simpel:** Færre moving parts og mindre kompleksitet
* **Fejlhåndtering:** Bedre mulighed for at håndtere fejl i byggeprocessen
* **Debugging:** Lettere at debugge problemer i en lineær proces
* **Eksterne Moduler:** Seamless integration af uafhængige repositories med egne deploy-scripts

**MFP-Compliance:** Arkitekturen overholder MFP-principperne ved at:
- Adskille frontend (React/Vite) fra potentielle backend-services
- Implementere modulær struktur med klare ansvarsområder
- Følge KISS-princippet med en simpel, men kraftfuld orkestrator-model
- Understøtte uafhængige teams og repositories gennem submodule-systemet

Ved at bruge denne orkestrerede tilgang skaber vi et robust, skalerbart og vedligeholdelsesvenligt system, der lever op til MFP Jamstack Kanon og samtidig giver maksimal fleksibilitet for eksterne bidragydere.