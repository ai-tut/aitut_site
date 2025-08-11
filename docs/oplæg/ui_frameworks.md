## **UI Beskrivelse: Det Orkestrerede Monorepo & Frameworks**

Dette dokument definerer den overordnede UI-filosofi og de grundlæggende designprincipper for vores platform. Målet er at skabe en brugergrænseflade, der er ren, performant og fleksibel, og som elegant kan tilpasse sig det specifikke indhold, den præsenterer.

### **Overordnet Tech-Stack**

Vores UI er bygget på en moderne, tre-lags stack, der sikrer maksimal fleksibilitet, kontrol og tilgængelighed.

* **Core Framework:** **React (via Vite)** danner grundlaget for vores applikationslogik og rendering.  
* **Styling Engine:** **Tailwind CSS** bruges til al utility-first styling, layout og responsivitet.  
* **Komponent-arkitektur:** Vi bruger **shadcn/ui** som en metode til at bygge vores ui-kit. Dette giver os fuldt ejerskab over komponentkoden.  
* **Funktionalitet & Tilgængelighed:** **Radix UI** fungerer som den "usynlige" motor under shadcn/ui. Det leverer den grundlæggende, headless funktionalitet og sikrer, at alle komponenter er fuldt tilgængelige (a11y) fra starten.

### **1\. Visuel Filosofi: "Ny Skandinavisk Minimalisme"**

Vores visuelle identitet er direkte inspireret af koncepterne i de fremlagte rapporter, især "Ny Skandinavisk Minimalisme" og balancen mellem "stilren men farverig".

* **Stilrent Fundament:** Kernen i vores UI er bygget på principperne om klarhed, funktionalitet og rigeligt med negativt rum (whitespace). Vi bruger **Tailwind CSS** til at skabe et stringent, utility-first system, hvor layout, afstand og typografisk skala er globalt defineret og konsistent på tværs af hele platformen. Dette sikrer en rolig og forudsigelig brugeroplevelse.  
* **Farverig Personlighed:** Det "farverige" element opnås gennem vores **flydende tematisering**. Hver indholdssamling kan definere sin egen unikke farvepalet. Dette betyder, at en bog om UX kan have et afdæmpet, professionelt tema, mens en bog om kreativ kodning kan have et dristigt, neon-inspireret tema. Den strukturelle UI forbliver den samme, men dens "hud" skifter dynamisk.

### **2\. Grundlæggende Layout: Bogen som Interface**

Brugerfladen er designet som en digital bog eller et læsemiljø. Layoutet er opdelt i to primære zoner for at optimere læsbarhed og navigation.

* **Navigations-Sidebar (Venstre):** En vedvarende sidebar, der viser bogens indholdsfortegnelse (toc.yml). Den er hierarkisk opbygget med kapitler og sider. Den aktuelle side er tydeligt markeret, og kapitler kan foldes ud og ind. På mindre skærme vil denne sidebar kollapse til en "hamburger"-menu for at prioritere indholdet.  
* **Indholdsområde (Højre):** Dette er scenen, hvor vores MDX-indhold kommer til live. Området er designet med en optimal linjebredde for læsning. Vi bruger Tailwinds @tailwindcss/typography (prose-klasser) som base for at sikre smuk formatering af standard Markdown-elementer (overskrifter, lister, links, etc.) "ud af boksen".

### **3\. Komponentbibliotek: ui-kit**

Alle interaktive elementer stammer fra vores dedikerede ui-kit pakke. Denne pakke er bygget med **shadcn/ui**, hvilket betyder, at vi får fuld kontrol over vores komponenters udseende, da de ikke er et eksternt bibliotek, men en del af vores egen kodebase.

**Kernekomponenter inkluderer:**

* **Button:** Bruges til al primær interaktion, såsom "Næste/Forrige side" og eventuelle Call-to-Actions i MDX-indholdet. Designet er subtilt med klare hover- og focus-tilstande.  
* **Alert / Callout:** Vores specialdesignede komponent til at fremhæve vigtige informationer, citater eller advarsler direkte i indholdet. Den bruger Alert-primitiver fra shadcn/ui.  
* **Card:** Bruges til at præsentere links til andre bøger på en forside eller til at gruppere relateret indhold.  
* **Accordion:** Anvendes i navigations-sidebaren til at håndtere kapitler.  
* **CodeBlock:** En specialdesignet komponent til at vise kodeeksempler med syntax highlighting (f.eks. ved hjælp af rehype-pretty-code) og en "Kopiér"-knap.

Alle disse komponenter er **strukturelt ens** på tværs af hele sitet, men deres farver (baggrund, tekst, border) styres af det **aktive tema**.

### **4\. Typografi**

Typografien er en hjørnesten i vores design.

* **Skala:** Vi definerer en harmonisk og responsiv typografisk skala i tailwind.config.js. Dette sikrer visuel konsistens fra den mindste brødtekst til den største overskrift.  
* **Fonte:** Vi kan definere en global "fallback"-font (f.eks. en ren sans-serif som Inter), men hver temafil (theme.css) kan potentielt overskrive denne for at give en bog sin egen unikke typografiske stemme (f.eks. en serif-font for en mere traditionel bog).  
* **Læsbarhed:** prose-klasserne sikrer optimal kontrast og linjehøjde for lange tekststykker.

### **5\. Interaktion og Animation**

Interaktioner er subtile og formålsdrevne. Vi undgår unødvendige animationer, der kan distrahere fra indholdet.

* **Mikrointeraktioner:** Hover-effekter på links og knapper, fokus-ringe på formularfelter og bløde overgange for Accordion-udvidelser giver brugeren øjeblikkelig feedback.  
* **Tilgængelighed (a11y):** Ved at bruge **Radix UI** som fundament for vores shadcn/ui-komponenter, sikrer vi, at alle interaktive elementer er fuldt tilgængelige fra starten med korrekt ARIA-attributter og tastaturnavigation.

### **Samlet Udtryk**

Resultatet er en brugerflade, der føles som et premium, specialbygget produkt. Den er **ren og forudsigelig** i sin struktur, men **levende og udtryksfuld** i sin præsentation. Ved at adskille den globale UI-logik fra den lokale tematisering opnår vi en skalerbar og vedligeholdelsesvenlig platform, der kan vokse og tilpasse sig ethvert fremtidigt indhold uden at gå på kompromis med sin kerneidentitet.