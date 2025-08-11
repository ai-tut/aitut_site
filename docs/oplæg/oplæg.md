## **Arkitektonisk Oplæg: Det Orkestrerede Monorepo**

Dette dokument beskriver en arkitektur, hvor en central "core-site" applikation dynamisk indlæser og præsenterer moduler (React-pakker) og indhold (MDX-bøger) fra uafhængige Git-repositories, der er integreret som submoduler.

### **1\. Hovedfilosofi og Struktur**

Vi bygger ikke én monolitisk applikation. Vi bygger en **orkestrator** (core-site), der dirigerer et **orkester** af pakker (/packages) og spiller efter en **partitur** af indhold (/content).

**Vigtig pointe om git submodules:** Din tidligere frustration er almindelig. Fejlen opstår ofte, når man glemmer, at et monorepo med submoduler er to-delt: Hoved-repoet sporer kun, *hvilket commit* et submodule skal pege på. Man skal eksplicit bede om at hente selve submodulets kode. Vores workflow vil indbygge dette, så det bliver automatisk og fejlfrit.

**Visuel Struktur:**

/main-project-repo/  
├── .git/  
├── .gitmodules      \<-- Her defineres vores submoduler  
│  
├── content/         \<-- Mappe til content-submoduler  
│   ├── bog-ux-2025/ \<── GIT SUBMODULE (eget repo)  
│   └── ...andet\_indhold/  
│  
├── packages/        \<-- Mappe til package-submoduler  
│   ├── ui-kit/      \<── GIT SUBMODULE (eget repo med egen package.json)  
│   └── ...andet\_modul/  
│  
└── site/            \<-- Vores core React/Vite app (Orkestratoren)  
    ├── src/  
    │   └── App.tsx  
    └── ...

### **2\. "Inklusionsfilen": Vores registry.json**

Dette er kernen i din idé og løsningen på mange problemer. I stedet for at core-site skal have kendskab til specifikke filer i submodulerne, læser den en "registreringsfil" på et kendt sted.

#### **Pakke-registrering: packages/registry.json**

Denne fil fortæller core-site, hvilke UI- eller logik-pakker der er tilgængelige.

// /packages/registry.json  
{  
  "modules": \[  
    {  
      "name": "ui-kit",  
      "path": "./ui-kit",  
      "entry": "src/index.ts"  
    },  
    {  
      "name": "data-visualizations",  
      "path": "./data-visualizations",  
      "entry": "src/index.ts"  
    }  
  \]  
}

#### **Indholds-registrering: content/registry.json**

Denne fil fortæller core-site, hvilke "bøger" eller indholdssamlinger der er tilgængelige.

// /content/registry.json  
{  
  "collections": \[  
    {  
      "id": "web-ux-2025",  
      "path": "./bog-ux-2025",  
      "toc": "toc.yml"  
    },  
    {  
      "id": "sales-funnel-guide",  
      "path": "./dansk-webdesign-sales-funnel",  
      "toc": "toc.yml"  
    }  
  \]  
}

### **3\. core-site: Orkestratoren**

site-applikationen er bevidst holdt minimal. Dens primære ansvar er at læse konfigurationen, opsætte routing, rendere indholdet og vise en meningsfuld fallback.

#### **Build-processen: Den Robuste Initialisering**

Vores pre-build\-script er hjertet i operationen. Det kører **hver gang** før Vite starter og sikrer, at hele projektet er sundt og klar.

**Scriptets Udvidede Ansvar:**

1. **Hent Submoduler:** Kør git submodule update \--init \--recursive. Dette sikrer, at alle submodul-mapper indeholder den korrekte kode, som hovedprojektet forventer.  
2. **Installer Afhængigheder i Submoduler:** Dette er det **kritiske** nye trin. Scriptet skal iterere gennem de registrerede pakker og installere deres afhængigheder.  
   * Læs packages/registry.json.  
   * For hvert modul i listen (f.eks. ui-kit):  
     * Naviger ind i modulets mappe (f.eks. cd ../packages/ui-kit).  
     * Kør npm install (eller pnpm install, yarn install). Dette installerer alle de afhængigheder, som ui-kit selv har brug for (f.eks. lucide-react, clsx).  
     * Naviger tilbage til site\-mappen.  
3. **Læs Registries:** Scriptet læser ../packages/registry.json og ../content/registry.json.  
4. **Generer Konfiguration:** Scriptet genererer en src/config/runtime.ts-fil inde i site. Denne fil vil eksportere den parsede information, så React-appen kan importere den statisk.  
   * Den omdanner toc.yml-filerne til JSON.  
   * Den skaber et kort over tilgængelige komponenter og stier, som Vite kan bruge til at finde modulerne.

Denne sekvens garanterer, at når Vite endelig starter, er alle submoduler ikke bare til stede, men også fuldt installerede og klar til at blive importeret.

#### **Eksempel: site/src/App.tsx**

import React, { Suspense } from 'react';  
import { BrowserRouter, Routes, Route } from 'react-router-dom';  
import { collections, modules } from './config/runtime'; // Autogenereret fil\!

// En funktion til dynamisk at hente en MDX side  
const loadContentPage \= (collectionId, pageSlug) \=\> {  
  // Logik til at finde den korrekte .mdx filsti fra 'collections'  
  // og derefter dynamisk importere den.  
  // f.eks. React.lazy(() \=\> import(\`../../content/${path\_to\_mdx}\`))  
  // Dette er en forsimpling.  
  return React.lazy(() \=\> Promise.resolve({ default: () \=\> \<div\>Side Indhold\</div\> }));  
};

// En funktion til at hente komponenter fra vores pakker  
const getModuleComponent \= (moduleName, componentName) \=\> {  
    // Logik til at hente en specifik komponent fra et modul  
    // f.eks. React.lazy(() \=\> import('ui-kit').then(module \=\> ({ default: module\[componentName\] })))  
    return () \=\> \<div\>Dynamisk Komponent\</div\>;  
}

function App() {  
  // Hvis 'collections' er tom, er der noget galt med build-processen.  
  if (\!collections || collections.length \=== 0\) {  
    return (  
      \<div className="flex h-screen items-center justify-center"\>  
        \<div className="text-center"\>  
          \<h1 className="text-2xl font-bold"\>Service Utilgængelig\</h1\>  
          \<p className="text-slate-500"\>  
            Indholdet kunne ikke indlæses korrekt. Tjek venligst konfigurationen.  
          \</p\>  
        \</div\>  
      \</div\>  
    );  
  }

  return (  
    \<BrowserRouter\>  
      {/\* Her ville vi have navigation, header, etc. bygget baseret på 'collections' \*/}  
      \<Suspense fallback={\<div\>Indlæser...\</div\>}\>  
        \<Routes\>  
          {/\* Dynamisk opbygning af routes baseret på indholdet \*/}  
          {collections.map(collection \=\> (  
            collection.pages.map(page \=\> (  
              \<Route  
                key={\`${collection.id}-${page.slug}\`}  
                path={\`/${collection.id}/${page.slug}\`}  
                element={React.createElement(loadContentPage(collection.id, page.slug))}  
              /\>  
            ))  
          ))}

          {/\* En forside eller fallback route \*/}  
          \<Route path="/" element={\<div\>Velkommen til den digitale bog\!\</div\>} /\>  
        \</Routes\>  
      \</Suspense\>  
    \</BrowserRouter\>  
  );  
}

export default App;

### **4\. Workflow i Praksis**

**Tilføjelse af et nyt UI-modul:**

1. Opret et nyt Git-repository for modulet.  
2. I main-project-repo, kør: git submodule add \<repo\_url\> packages/\<module\_navn\>  
3. Opdater packages/registry.json med den nye pakkes information.  
4. Commit ændringerne i main-project-repo (både .gitmodules og registry.json).

**Opdatering af indhold:**

1. Gå ind i den relevante content-submodule mappe (cd content/bog-ux-2025).  
2. Lav ændringer, commit, og push til *submodulets* remote.  
3. Gå tilbage til main-project-repo (cd ../..).  
4. git add content/bog-ux-2025 for at registrere, at hovedprojektet nu skal pege på det nye commit.  
5. Commit og push i main-project-repo.

Dette workflow sikrer, at alt er eksplicit, og at core-site altid ved præcis, hvilken version af hver pakke og hvert stykke indhold den skal bygge med.