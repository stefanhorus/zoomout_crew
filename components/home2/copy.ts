"use client";

import { useLanguage } from "@/contexts/LanguageContext";

// Textele paginii /home2 (varianta de prima pagină făcută după principiile Taste Skill), separat de restul site-ului
// ca pagina de test să poată fi ștearsă dintr-o bucată. „Cluj‑Napoca” folosește cratima care nu se rupe la capăt de rând.

const en = {
  meta: { title: "Zoomout_crew, video and drone crew from Cluj-Napoca" },
  hero: {
    title: "Video and drone crew from Cluj‑Napoca",
    lead: "We film commercials, social media content, aftermovies and music videos for brands, events and artists, on the ground and from the air.",
    action: "Get a quote",
    zoom: "Zoom",
    zoomHelp: "Fewer, larger frames or the whole contact sheet at once",
    strip: "Frames from our projects",
    count: "{frames} frames from {projects} projects",
  },
  work: {
    title: "Selected work",
    link: "See the project",
    projects: {
      panoramic: {
        category: "Restaurant film",
        where: "On top of the Buscat ski slope, an hour from Cluj",
        made: "Restaurant presentation and après-ski events",
        with: "With Visual Delights",
      },
      bigbelly: {
        category: "Opening night",
        where: "Their new location in Cluj‑Napoca",
        made: "The opening, on the ground and from the air",
        with: "For Big Belly",
      },
      tinyhouse: {
        category: "Promo films",
        where: "Rimetea, 50 km from Cluj",
        made: "The cabin, the valley and a weekend away",
        with: "Filmed in exchange for a night's stay",
      },
      lifeispink: {
        category: "Promo film",
        where: "Inside a van lined in pink fabric",
        made: "Shot after dark, from the doors to the road",
        with: "For Life Is Pink",
      },
    },
  },
  about: {
    title: "The crew",
    facts: [
      ["Based in", "Cluj‑Napoca, Romania"],
      ["Started", "Filming from the sky"],
      ["Films", "On the ground and from the air"],
    ],
    text: "We look at the whole picture first: your goal, your audience, the place and the people. Then we zoom in on the details that make it worth watching, as a small crew that moves fast and cares about every cut.",
    clientsWord: "Clients",
    clients: [
      [
        ["Casa Numaa", "Restaurant"],
        ["Big Belly", "Restaurant"],
        ["Panoramic 360 Transilvania", "Après-ski"],
        ["Remote Tiny House Retreat", "Cabin"],
        ["Multiverse", "Rooftop party"],
        ["Utopic", "Events"],
      ],
      [
        ["Rotaract Cluj", "Charity"],
        ["Lepas", "Cars"],
        ["Bacademia", "Exam prep"],
        ["One Society", "Fashion, London"],
        ["WeLovePNG", "Fashion"],
        ["Wild West Tour", "Travel, USA"],
      ],
    ],
  },
  services: {
    title: "What we make",
    groups: [
      {
        name: "On the ground",
        summary: "Commercials, social media, events and music videos, filmed by a small crew.",
        items: [
          ["Commercials and brand films", "From the idea and the storyboard to the final cut."],
          ["Reels, TikToks and Shorts", "Vertical videos made for the feed and cut to the beat."],
          ["Talking heads and sketches", "Scripts and sketches that make people stop and listen."],
          ["Interviews", "Real people on camera, like the drivers at the Lepas test drive."],
          ["Event coverage", "The whole day or night, from the setup to the last song."],
          ["Aftermovies", "Your event in a few minutes, the way it felt."],
          ["Music videos", "Concept, set and camera, like Nico Ramírez's set at sunset."],
          ["Restaurants and venues", "The room, the food and the people who make the place."],
        ],
      },
      {
        name: "From the air",
        summary: "4K drone video and photos of venues, crowds, cities and landscapes.",
        items: [
          ["4K aerial video", "Wide, steady shots from the drone, in 4K."],
          ["Aerial photos", "Stills from above, included with every drone shoot."],
          ["Venues and properties", "The place and what is around it, like a villa in Sardinia."],
          ["Crowds from above", "The scale of an event, like ten thousand rubber ducks on the river."],
          ["Rooftops at sunset", "The city from its highest roofs, at the best hour."],
          ["Landscapes and travel", "Mountains, coasts and cities, from Rimetea to New York."],
        ],
      },
      {
        name: "In the edit",
        summary: "Editing, colour and sound, delivered in a version for every screen.",
        items: [
          ["Editing and storytelling", "We cut until the story holds from the first second."],
          ["Colour grading", "One consistent look across every shot."],
          ["Sound design", "Music, effects and the mix, so it sounds as good as it looks."],
          ["Cuts for every platform", "Versions for the web, Reels, TikTok and YouTube."],
          ["Big-screen masters", "Full-quality files for screens at events and in venues."],
          ["LUTs and presets", "The colour looks we use ourselves, sold in our shop."],
        ],
      },
    ],
  },
  process: {
    title: "From idea to screen",
    previous: "Previous moment",
    next: "Next moment",
    moments: [
      ["First, a call", "We start from your goal and your audience: what the video has to do and where people will watch it."],
      ["Then the plan", "Together we shape the idea, the script and the shot list, and pick the place, the hour and the light."],
      ["On the ground", "On location with camera and drone, as a small crew that moves fast and stays out of the way."],
      ["Up in the air", "The drone takes the wide shots: the venue, the crowd and the place around it."],
      ["In the edit", "Editing, colour grading and sound design, until every cut feels right."],
      ["Delivered", "Final files for every screen: the web, Reels, TikTok, YouTube or the big screen."],
    ],
  },
  reviews: {
    title: "Kind words",
    items: [
      {
        name: "Naim Onuk",
        role: "CEO, Utopic and Visual Delights",
        quote:
          "They fit our playful style, and they are not afraid to go along with our wild (sometimes unhinged, tbh) ideas… When you need those crazy, dangerous shots, you call them.",
      },
      {
        name: "Florin Marius",
        role: "Owner, Remote Tiny House Retreat",
        quote: "The collaboration with them was excellent. The materials they created perfectly highlighted the beauty of the place.",
      },
      {
        name: "Rotaract Cluj",
        role: "Charity Duck Race",
        quote:
          "He didn't just capture the ducks floating on the river, but perfectly timed the shots to show the energy of the crowds lining the banks.",
      },
    ],
  },
  places: {
    title: "Where we've filmed",
    groups: [
      {
        name: "Cluj and around",
        rows: [
          ["Piața Unirii, Cluj‑Napoca", "Casa Numaa"],
          ["The tallest residential building in Romania", "Nico Ramírez, live at sunset"],
          ["CBC Skygarden Rooftop, Cluj", "Multiverse Party"],
          ["The river in Cluj", "Rotaract duck race"],
          ["Sun Garden, Cluj", "Lepas test drive"],
          ["Buscat ski slope", "Panoramic 360 Transilvania"],
          ["Rimetea", "Remote Tiny House Retreat"],
        ],
      },
      {
        name: "Further away",
        rows: [
          ["London", "One Society, three commercials"],
          ["The US West Coast", "Wild West Tour, seven weeks"],
          ["Sardinia", "LA VILLA SUNHOUSE"],
          ["New York", "Central Park from the air"],
          ["Los Angeles", "The Hollywood Hills"],
          ["Oxford", "The colleges from above"],
          ["Edinburgh", "A city on its hills"],
        ],
      },
    ],
  },
  closing: {
    title: "Tell us what you want to film",
    text: "We'll come back with an idea, a plan and a price.",
    write: "Or write to",
    based: "We're based in Cluj‑Napoca and travel for the right project.",
  },
  footer: {
    statement: "A small crew that sees the bigger picture.",
    legal: "© 2026 Zoomout_crew. All rights reserved.",
    nav: [
      ["/", "Home"],
      ["/portfolio", "Portfolio"],
      ["/services", "Services"],
      ["/about", "About"],
      ["/shop", "Shop"],
      ["/contact", "Contact"],
    ],
    city: "Cluj‑Napoca, Romania",
    time: "in Cluj right now",
    start: "Start a project",
  },
};

export type Home2Copy = typeof en;

const ro: Home2Copy = {
  meta: { title: "Zoomout_crew, echipă video și dronă din Cluj-Napoca" },
  hero: {
    title: "Echipă video și dronă din Cluj‑Napoca",
    lead: "Filmăm reclame, conținut pentru social media, aftermovie-uri și videoclipuri pentru branduri, evenimente și artiști, de la sol și din aer.",
    action: "Cere o ofertă",
    zoom: "Zoom",
    zoomHelp: "Mai puține cadre, mai mari, sau toată foaia de contact deodată",
    strip: "Cadre din proiectele noastre",
    count: "{frames} de cadre din {projects} proiecte",
  },
  work: {
    title: "Proiecte alese",
    link: "Vezi proiectul",
    projects: {
      panoramic: {
        category: "Film de prezentare",
        where: "În vârful pârtiei Buscat, la o oră de Cluj",
        made: "Prezentarea restaurantului și petrecerile après-ski",
        with: "Cu Visual Delights",
      },
      bigbelly: {
        category: "Seara de deschidere",
        where: "Noua lor locație din Cluj‑Napoca",
        made: "Deschiderea, de la sol și din aer",
        with: "Pentru Big Belly",
      },
      tinyhouse: {
        category: "Filme de promovare",
        where: "Rimetea, la 50 km de Cluj",
        made: "Căsuța, valea și un weekend departe de oraș",
        with: "Filmat în schimbul unei nopți de cazare",
      },
      lifeispink: {
        category: "Film de promovare",
        where: "Într-o dubă îmbrăcată în material roz",
        made: "Filmat noaptea, de la uși până în stradă",
        with: "Pentru Life Is Pink",
      },
    },
  },
  about: {
    title: "Echipa",
    facts: [
      ["Din", "Cluj‑Napoca, România"],
      ["Am început", "Filmând din aer"],
      ["Filmăm", "De la sol și din aer"],
    ],
    text: "Ne uităm întâi la imaginea de ansamblu: scopul tău, publicul, locul și oamenii. Apoi facem zoom pe detaliile care merită privite, ca o echipă mică, rapidă, căreia îi pasă de fiecare tăietură.",
    clientsWord: "Clienți",
    clients: [
      [
        ["Casa Numaa", "Restaurant"],
        ["Big Belly", "Restaurant"],
        ["Panoramic 360 Transilvania", "Après-ski"],
        ["Remote Tiny House Retreat", "Cabană"],
        ["Multiverse", "Petrecere pe acoperiș"],
        ["Utopic", "Evenimente"],
      ],
      [
        ["Rotaract Cluj", "Caritate"],
        ["Lepas", "Mașini"],
        ["Bacademia", "Pregătire pentru examene"],
        ["One Society", "Modă, Londra"],
        ["WeLovePNG", "Modă"],
        ["Wild West Tour", "Călătorii, SUA"],
      ],
    ],
  },
  services: {
    title: "Ce facem",
    groups: [
      {
        name: "De la sol",
        summary: "Reclame, social media, evenimente și videoclipuri, filmate de o echipă mică.",
        items: [
          ["Reclame și filme de brand", "De la idee și storyboard până la montajul final."],
          ["Reels, TikTok și Shorts", "Video-uri verticale făcute pentru feed și tăiate pe ritm."],
          ["Talking heads și sketch-uri", "Scenarii și sketch-uri care îi fac pe oameni să se oprească."],
          ["Interviuri", "Oameni reali în fața camerei, ca șoferii de la test drive-ul Lepas."],
          ["Evenimente", "Toată ziua sau toată noaptea, de la montaj până la ultima piesă."],
          ["Aftermovie-uri", "Evenimentul tău în câteva minute, așa cum s-a simțit."],
          ["Videoclipuri", "Concept, decor și cameră, ca setul lui Nico Ramírez la apus."],
          ["Restaurante și locații", "Sala, mâncarea și oamenii care fac locul."],
        ],
      },
      {
        name: "Din aer",
        summary: "Video și fotografii 4K cu drona: locații, mulțimi, orașe și peisaje.",
        items: [
          ["Video aerian 4K", "Cadre largi și stabile cu drona, în 4K."],
          ["Fotografii aeriene", "Imagini de sus, incluse la fiecare filmare cu drona."],
          ["Locații și proprietăți", "Locul și ce e în jurul lui, ca o vilă din Sardinia."],
          ["Mulțimi văzute de sus", "Cât de mare e un eveniment, ca zece mii de rățuște pe râu."],
          ["Acoperișuri la apus", "Orașul de pe cele mai înalte acoperișuri, la cea mai bună oră."],
          ["Peisaje și călătorii", "Munți, coaste și orașe, de la Rimetea la New York."],
        ],
      },
      {
        name: "La montaj",
        summary: "Montaj, culoare și sunet, livrate în câte o variantă pentru fiecare ecran.",
        items: [
          ["Montaj și poveste", "Tăiem până când povestea ține din prima secundă."],
          ["Color grading", "Un aspect unitar în toate cadrele."],
          ["Sound design", "Muzică, efecte și mixaj, ca să sune la fel de bine cum arată."],
          ["Variante pentru fiecare platformă", "Pentru web, Reels, TikTok și YouTube."],
          ["Fișiere pentru ecrane mari", "La calitate maximă, pentru ecranele de la evenimente și din locații."],
          ["LUT-uri și preseturi", "Aspectele de culoare pe care le folosim și noi, în magazinul nostru."],
        ],
      },
    ],
  },
  process: {
    title: "De la idee la ecran",
    previous: "Momentul anterior",
    next: "Momentul următor",
    moments: [
      ["Întâi, un telefon", "Pornim de la scopul și publicul tău: ce trebuie să facă video-ul și unde îl vor vedea oamenii."],
      ["Apoi planul", "Construim împreună ideea, scenariul și lista de cadre și alegem locul, ora și lumina."],
      ["De la sol", "La fața locului, cu camera și drona, ca o echipă mică, rapidă și discretă."],
      ["Din aer", "Drona prinde cadrele largi: locația, mulțimea și locul din jur."],
      ["La montaj", "Montaj, color grading și sound design, până când fiecare tăietură sună bine."],
      ["Livrat", "Fișierele finale pentru fiecare ecran: web, Reels, TikTok, YouTube sau ecranul mare."],
    ],
  },
  reviews: {
    title: "Vorbe bune",
    items: [
      {
        name: "Naim Onuk",
        role: "CEO, Utopic și Visual Delights",
        quote:
          "Se potrivesc stilului nostru jucăuș și nu se tem să meargă pe urmele ideilor noastre sălbatice (uneori chiar nebunești, să fiu sincer)… Când ai nevoie de acele cadre nebunești, periculoase, îi chemi pe ei.",
      },
      {
        name: "Florin Marius",
        role: "Proprietar, Remote Tiny House Retreat",
        quote: "Colaborarea cu ei a fost excelentă. Materialele pe care le-a creat au pus perfect în valoare frumusețea locului.",
      },
      {
        name: "Rotaract Cluj",
        role: "Cursa de caritate cu rățuște",
        quote:
          "Nu a captat doar rățuștele care plutesc pe râu, ci a cronometrat perfect cadrele ca să arate energia mulțimii de pe maluri.",
      },
    ],
  },
  places: {
    title: "Unde am filmat",
    groups: [
      {
        name: "Clujul și împrejurimile",
        rows: [
          ["Piața Unirii, Cluj‑Napoca", "Casa Numaa"],
          ["Cea mai înaltă clădire rezidențială din România", "Nico Ramírez, live la apus"],
          ["CBC Skygarden Rooftop, Cluj", "Multiverse Party"],
          ["Râul din Cluj", "Cursa de rățuște Rotaract"],
          ["Sun Garden, Cluj", "Test drive Lepas"],
          ["Pârtia Buscat", "Panoramic 360 Transilvania"],
          ["Rimetea", "Remote Tiny House Retreat"],
        ],
      },
      {
        name: "Mai departe",
        rows: [
          ["Londra", "One Society, trei reclame"],
          ["Coasta de vest a SUA", "Wild West Tour, șapte săptămâni"],
          ["Sardinia", "LA VILLA SUNHOUSE"],
          ["New York", "Central Park din aer"],
          ["Los Angeles", "Dealurile Hollywood"],
          ["Oxford", "Colegiile văzute de sus"],
          ["Edinburgh", "Un oraș pe dealuri"],
        ],
      },
    ],
  },
  closing: {
    title: "Spune-ne ce vrei să filmezi",
    text: "Revenim cu o idee, un plan și un preț.",
    write: "Sau scrie-ne la",
    based: "Suntem din Cluj‑Napoca și ne deplasăm pentru proiectele potrivite.",
  },
  footer: {
    statement: "O echipă mică, cu o viziune de ansamblu.",
    legal: "© 2026 Zoomout_crew. Toate drepturile rezervate.",
    nav: [
      ["/", "Acasă"],
      ["/portfolio", "Portofoliu"],
      ["/services", "Servicii"],
      ["/about", "Despre noi"],
      ["/shop", "Magazin"],
      ["/contact", "Contact"],
    ],
    city: "Cluj‑Napoca, România",
    time: "acum, în Cluj",
    start: "Începe un proiect",
  },
};

export function useHome2Copy(): Home2Copy {
  const { language } = useLanguage();
  return language === "ro" ? ro : en;
}
