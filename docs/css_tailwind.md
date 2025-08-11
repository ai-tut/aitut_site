## **Arkitektur: Flydende CSS-Tematisering**

Dette dokument beskriver en model for dynamisk, indholdsbestemt tematisering i vores monorepo. Målet er at tillade hver indholdssamling eller pakke at have sit eget unikke farveskema, uden at det skaber konflikter med den globale UI-struktur.

### **1\. Kernekoncept: Adskillelse af Struktur og Tema**

Vi deler vores styling op i to lag:

1. **Struktur (Global):** Defineres i core-site's tailwind.config.js. Dette lag bestemmer, *hvordan* komponenter er bygget. F.eks. at en knap har padding, rounded corners og en border-width. Disse regler er de samme for hele sitet.  
2. **Tema (Flydende):** Defineres i hver enkelt indholdssamling (f.eks. bog-ux-2025). Dette lag bestemmer, *hvordan* komponenter ser ud. F.eks. at en knaps baggrundsfarve er blå i én bog og grøn i en anden.

Broen mellem disse to lag er **CSS Custom Properties**.

### **2\. Implementeringsplan**

#### **Trin 1: Konfigurer tailwind.config.js med CSS-variabler**

I vores core-site applikation opdaterer vi tailwind.config.js til at bruge variabler i stedet for faste farveværdier. Dette er inspireret af den måde, shadcn/ui håndterer tematisering.

// site/tailwind.config.js

/\*\* @type {import('tailwindcss').Config} \*/  
module.exports \= {  
  // ... andre indstillinger  
  theme: {  
    container: {  
      center: true,  
      padding: "2rem",  
      screens: {  
        "2xl": "1400px",  
      },  
    },  
    extend: {  
      colors: {  
        border: 'hsl(var(--border))',  
        input: 'hsl(var(--input))',  
        ring: 'hsl(var(--ring))',  
        background: 'hsl(var(--background))',  
        foreground: 'hsl(var(--foreground))',  
        primary: {  
          DEFAULT: 'hsl(var(--primary))',  
          foreground: 'hsl(var(--primary-foreground))',  
        },  
        secondary: {  
          DEFAULT: 'hsl(var(--secondary))',  
          foreground: 'hsl(var(--secondary-foreground))',  
        },  
        // ... og så videre for destructive, muted, accent, etc.  
      },  
      borderRadius: {  
        lg: \`var(--radius)\`,  
        md: \`calc(var(--radius) \- 2px)\`,  
        sm: "calc(var(--radius) \- 4px)",  
      },  
      // ...  
    },  
  },  
  // ...  
}

**Hvad har vi gjort?** Vores Tailwind-klasser som bg-primary eller border peger nu ikke på en farve, men på en variabel (--primary, \--border). Uden disse variabler er vores site "farveløst".

#### **Trin 2: Definer Temaer i Indholds-Repositories**

Nu kan hver indholdssamling definere sine egne farver. I f.eks. content/bog-ux-2025/ opretter vi en theme.css-fil.

/\* content/bog-ux-2025/theme.css \*/

/\* Dette er temaet for UX-bogen. Det er professionelt og afdæmpet. \*/  
@layer base {  
  :root {  
    \--background: 0 0% 100%; /\* Hvid \*/  
    \--foreground: 222.2 84% 4.9%; /\* Mørkeblå/Sort \*/

    \--primary: 222.2 47.4% 11.2%; /\* Primær Mørkeblå \*/  
    \--primary-foreground: 210 40% 98%; /\* Tekst på primær: Næsten hvid \*/

    \--secondary: 210 40% 96.1%; /\* Sekundær Gråblå \*/  
    \--secondary-foreground: 222.2 47.4% 11.2%; /\* Tekst på sekundær: Mørkeblå \*/

    \--border: 214.3 31.8% 91.4%;  
    \--ring: 222.2 84% 4.9%;

    \--radius: 0.5rem; /\* Vi kan endda tematisere border-radius \*/  
  }  
}

Samtidig kan en anden bog, f.eks. content/kreativ-kodning/, have et helt andet tema:

/\* content/kreativ-kodning/theme.css \*/

/\* Dette er temaet for en bog om kreativ kodning. Det er lyst og farverigt. \*/  
@layer base {  
  :root {  
    \--background: 20 14.3% 4.1%;  /\* Mørk koksgrå \*/  
    \--foreground: 60 9.1% 97.8%; /\* Hvid \*/

    \--primary: 346.8 77.2% 49.8%; /\* Primær: Skarp Pink \*/  
    \--primary-foreground: 355.7 100% 97.3%;

    \--secondary: 240 3.7% 15.9%; /\* Sekundær: Lidt lysere koksgrå \*/  
    \--secondary-foreground: 60 9.1% 97.8%;

    \--border: 240 3.7% 15.9%;  
    \--ring: 346.8 77.2% 49.8%;

    \--radius: 0.3rem;  
  }  
}

#### **Trin 3: Dynamisk Indlæsning af Tema i core-site**

Dette er det sidste, afgørende skridt. Hvordan fortæller vi core-site, hvilket tema den skal bruge?

1. **Opdater toc.yml:** Vi tilføjer en theme-sti i hver bogs indholdsfortegnelse.  
   \# content/bog-ux-2025/toc.yml  
   bookTitle: "Webdesign & UX i 2025"  
   theme: "./theme.css" \# Sti relativt til roden af dette submodule  
   chapters:  
     \# ...

2. **Kopiér Tema-filen:** Vores pre-build-script, som allerede kopierer MDX-filer, skal nu også kopiere theme.css-filen over i en public-mappe i site, f.eks. site/public/themes/bog-ux-2025.css.  
3. **Dynamisk indlæsning i React:** Vi laver en ThemeLoader-komponent i core-site, der lytter til den aktuelle route og injicerer den korrekte stylesheet-fil i dokumentets \<head\>.  
   // site/src/components/ThemeLoader.tsx  
   import React, { useEffect } from 'react';  
   import { useLocation } from 'react-router-dom';  
   import { collections } from '../config/runtime'; // Vores autogenererede config

   export function ThemeLoader() {  
     const location \= useLocation();

     useEffect(() \=\> {  
       // Find den aktuelle collection baseret på URL'en  
       const currentCollectionId \= location.pathname.split('/')\[1\];  
       const currentCollection \= collections.find(c \=\> c.id \=== currentCollectionId);

       // Fjern eventuelle gamle tema-stylesheets for at undgå konflikter  
       document.querySelectorAll('link\[data-theme\]').forEach(el \=\> el.remove());

       if (currentCollection && currentCollection.theme) {  
         const link \= document.createElement('link');  
         link.rel \= 'stylesheet';  
         link.href \= \`/themes/${currentCollection.id}.css\`; // Peger på den kopierede fil i public  
         link.setAttribute('data-theme', 'true'); // Markér den som en tema-fil  
         document.head.appendChild(link);  
       }

     }, \[location\]); // Kør effekten hver gang URL'en ændrer sig

     return null; // Denne komponent renderer intet selv  
   }

   Vi placerer så \<ThemeLoader /\> i toppen af vores App.tsx.

### **Konklusion**

Denne model giver os det bedste fra alle verdener:

* **Global Konsistens:** Alle knapper er strukturelt ens, fordi de bruger de samme Tailwind-klasser.  
* **Lokal Kreativitet:** Hver bog eller pakke kan have sit eget fuldstændige visuelle udtryk ved at definere en simpel CSS-fil.  
* **Ingen "CSS Helvede":** Vi overskriver aldrig klasser. Vi udskifter værdier i CSS-variabler, hvilket er en ren og konfliktfri operation.  
* **Flydende og Performant:** Temaet skiftes lynhurtigt ved klientsiden, når brugeren navigerer, uden at hele siden skal genindlæses.

Dette er en robust, skalerbar og moderne løsning på et komplekst problem.