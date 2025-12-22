"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

type Language = "en" | "ro";

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

const translations: Record<Language, Record<string, string>> = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.portfolio": "Portfolio",
    "nav.services": "Services",
    "nav.adventures": "Adventures",
    "nav.shop": "Shop",
    "nav.about": "About",
    "nav.game": "Game",
    "nav.contact": "Contact",
    
    // Game page
    "game.title": "Drone Games",
    "game.subtitle": "Choose your game mode and start playing!",
    "game.enemies": "Enemies",
    "game.mode1.title": "Avoid & Collect",
    "game.mode1.description": "Control the drone freely. Avoid red obstacles and collect yellow stars!",
    "game.mode2.title": "Space Invaders",
    "game.mode2.description": "Destroy all enemies! Shoot and avoid enemy bullets.",
    "game.backToMenu": "Back to Menu",
    "game.instructions1": "Move your mouse or finger to control the drone. Avoid red obstacles and collect yellow stars!",
    "game.instructions2": "Move with mouse/touch or arrow keys. Click/Space to shoot. Destroy all enemies!",
    "game.controls1": "🖱️ Move mouse or 👆 touch to control • ⭐ Collect stars (+10) • ⛔ Avoid obstacles",
    "game.controls2": "🖱️ Move mouse/touch to move • 🖱️ Click/Tap or ⌨️ Space to shoot • ⚔️ Destroy all enemies!",
    "game.score": "Score",
    "game.speed": "Speed",
    "game.ready": "Ready to Fly?",
    "game.instructions": "Move with mouse/touch or arrow keys. Click/Space to shoot. Destroy all enemies!",
    "game.start": "Start Game",
    "game.gameOver": "Game Over!",
    "game.finalScore": "Final Score",
    "game.wellDone": "Well done! Try again to beat your score.",
    "game.playAgain": "Play Again",
    "game.menu": "Menu",
    "game.controls": "🖱️ Move mouse/touch to move • 🖱️ Click/Tap or ⌨️ Space to shoot • ⚔️ Destroy all enemies!",
    
    // Home page
    "home.tagline": "Professional aerial footage & more",
    "home.cta": "See portfolio",
    "home.workedWith": "Proudly Worked With:",
    
    // About page
    "about.title": "About Us",
    "about.subtitle": "Professional aerial footage and cinematography services",
    "about.mission": "Our Mission",
    "about.mission.text1": "At Zoomout_crew, we specialize in capturing breathtaking aerial footage that tells your story from a unique perspective. Whether it's real estate showcases, event coverage, commercial projects, or cinematic adventures, we bring professional drone cinematography to every project.",
    "about.mission.text2": "Our passion for aerial photography and videography drives us to deliver exceptional quality and creative vision that elevates your content above the rest.",
    "about.whatWeDo": "What We Do",
    "about.aerialCinematography": "Aerial Cinematography",
    "about.aerialCinematography.desc": "Stunning aerial footage for films, documentaries, and creative projects.",
    "about.realEstate": "Real Estate",
    "about.realEstate.desc": "Professional property showcases that highlight unique features and locations.",
    "about.eventCoverage": "Event Coverage",
    "about.eventCoverage.desc": "Complete event documentation from unique aerial perspectives.",
    "about.commercial": "Commercial Projects",
    "about.commercial.desc": "High-end commercial videography for brands and marketing campaigns.",
    "about.whyChoose": "Why Choose Us",
    "about.professionalEquipment": "Professional Equipment",
    "about.professionalEquipment.desc": "State-of-the-art drones and camera systems for the highest quality footage.",
    "about.creativeVision": "Creative Vision",
    "about.creativeVision.desc": "Unique perspectives and creative storytelling that make your content stand out.",
    "about.experiencedTeam": "Experienced Team",
    "about.experiencedTeam.desc": "Skilled pilots and cinematographers with years of experience in aerial videography.",
    "about.reliableService": "Reliable Service",
    "about.reliableService.desc": "Professional, punctual, and committed to delivering exceptional results on time.",
    "about.readyToWork": "Ready to Work Together?",
    "about.readyToWork.text": "Let's bring your vision to life from above.",
    "about.getInTouch": "Get in Touch",
    "about.reviews.title": "What Our Clients Say",
    "about.reviews.review1.text": "Ca CEO al Utopic (echipa de planificare evenimente) și Visual Delights Marketing Agency, am lucrat mult cu Zoomout Crew. Se potrivesc stilului nostru jucăuș și nu se tem să meargă pe urmele ideilor noastre sălbatice (uneori chiar nebunești, să fiu sincer), motiv pentru care au fost alegerea perfectă pentru noi. Când ai nevoie de acele cadre nebunești, periculoase, îi chemi pe ei. Sunt pasionați de ceea ce fac și gata să testeze limitele capacităților lor. Prin urmare, îi recomand dacă te aliniezi și tu cu o viziune îndrăzneață și creativă.",
    "about.reviews.review1.textOriginal": "As the CEO of Utopic (event planning crew) and Visual Delights Marketing Agency, I got to work a lot with Zoomout Crew. They fit our playful style, and they are not afraid to go along with our wild (sometimes unhinged, tbh) ideas, which is why they were the perfect fit for us. When you need those crazy, dangerous shots, you call them. They are passionate about what they do and ready to test the limits of their capabilities. Therefore, I recommend them if you align with a bold, creative vision as well.",
    "about.reviews.review1.name": "Naim Onuk",
    "about.reviews.review1.initials": "NO",
    "about.reviews.review1.role": "CEO Utopic (event planning crew) and Visual Delights Marketing Agency",
    "about.reviews.review2.text": "Amazing work! They captured our property beautifully from every angle.",
    "about.reviews.review2.name": "Sarah Miller",
    "about.reviews.review2.initials": "SM",
    "about.reviews.review2.role": "Real Estate Agent",
    "about.reviews.review3.text": "Professional, creative, and delivered exactly what we needed. Highly recommended!",
    "about.reviews.review3.name": "Mike Rodriguez",
    "about.reviews.review3.initials": "MR",
    "about.reviews.review3.role": "Marketing Director",
    "about.reviews.review4.text": "I had the pleasure of hosting at Remote Tiny House Retreat a particularly kind and professional couple, who, in exchange for a night's accommodation, proposed to create some stunning drone footage to promote the location. The collaboration with them was excellent. The materials they created perfectly highlighted the beauty of the place. I recommend them with confidence and would be happy to see them again anytime.",
    "about.reviews.review4.textOriginal": "Am avut plăcerea de a găzdui la Remote Tiny House Retreat un cuplu deosebit de amabil și profesionist, care, în schimbul unei nopți de cazare, mi-a propus să realizeze câteva filmări superbe cu drona pentru promovarea locației. Colaborarea cu ei a fost excelentă🫂 Materialele pe care le-a creat au pus perfect în valoare frumusețea locului🤗🪄🌻 Îi recomand cu încredere și m-aș bucura să îi revăd oricând💯",
    "about.reviews.review4.name": "Florin Marius",
    "about.reviews.review4.initials": "FM",
    "about.reviews.review4.role": "Remote Tiny House Retreat Owner",
    "about.reviews.review5.text": "Horus delivered truly exceptional coverage for our Charity Duck Race in Cluj. What stood out most was his incredible attention to detail, he didn't just capture the ducks floating on the river, but perfectly timed the shots to show the energy of the crowds lining the banks. He managed to catch the most critical moment, the actual launch of the 10 thousand rubber ducks from the cage, with absolute precision. The footage has been a huge asset for Rotaract and Interact, helping us in showcasing the true scale and excitement of the event. If you want a drone pilot who catches the moments that matter, I highly recommend him!",
    "about.reviews.review5.textOriginal": "Horus delivered truly exceptional coverage for our Charity Duck Race in Cluj. What stood out most was his incredible attention to detail, he didn't just capture the ducks floating on the river, but perfectly timed the shots to show the energy of the crowds lining the banks. He managed to catch the most critical moment, the actual launch of the 10 thousand rubber ducks from the cage, with absolute precision. The footage has been a huge asset for Rotaract and Interact, helping us in showcasing the true scale and excitement of the event. If you want a drone pilot who catches the moments that matter, I highly recommend him!",
    "about.reviews.review5.name": "Rotaract Cluj",
    "about.reviews.review5.initials": "RC",
    "about.reviews.review5.role": "Charity Event Organizer",
    "about.reviews.showOriginal": "Show original (Romanian)",
    "about.reviews.showOriginalEnglish": "Show original (English)",
    "about.reviews.showTranslated": "Show translated",
    
    // Portfolio page
    "portfolio.title": "Portfolio",
    "portfolio.subtitle": "Explore our collection of professional aerial footage and cinematography",
    "portfolio.allProjects": "All Projects",
    "portfolio.aerial": "Aerial",
    "portfolio.realEstate": "Real Estate",
    "portfolio.events": "Events",
    "portfolio.commercial": "Commercial",
    "portfolio.noProjects": "No projects found in this category.",
    
    // Services page
    "services.title": "Services",
    "services.subtitle": "Professional aerial services tailored to bring your vision to life",
    "services.allServices": "All Services",
    "services.filming": "Filming",
    "services.editing": "Editing",
    "services.aerialFilmingHour": "Aerial Filming per Hour",
    "services.aerialFilmingHour.desc": "Professional aerial filming service per hour. We capture your project on video, and you receive all raw footage plus complimentary aerial photographs.",
    "services.aerialFilmingHour.feature1": "Hourly aerial filming",
    "services.aerialFilmingHour.feature2": "4K/8K raw video files",
    "services.aerialFilmingHour.feature3": "Bonus aerial photographs",
    "services.aerialFilmingHour.feature4": "Quick turnaround delivery",
    "services.aerialFilmingDay": "Aerial Filming Full Day",
    "services.aerialFilmingDay.desc": "Professional aerial filming service for a full day. We capture your project on video, and you receive all raw footage plus complimentary aerial photographs.",
    "services.aerialFilmingDay.feature1": "Full day aerial filming",
    "services.aerialFilmingDay.feature2": "4K/8K raw video files",
    "services.aerialFilmingDay.feature3": "Bonus aerial photographs",
    "services.aerialFilmingDay.feature4": "Quick turnaround delivery",
    "services.postProduction": "Professional Post-Production",
    "services.postProduction.desc": "Professional editing of your footage with color grading, transitions, and sound design. Price decreases for multiple videos.",
    "services.postProduction.feature1": "4K/8K editing",
    "services.postProduction.feature2": "Color grading & color correction",
    "services.postProduction.feature3": "Sound design & mixing",
    "services.postProduction.feature4": "Multiple export formats",
    "services.postProduction.feature5": "Discount for multiple videos",
    "services.postProduction.pricing": "Post-Production Pricing:",
    "services.postProduction.pricing1": "1 video:",
    "services.postProduction.pricing2": "2-3 videos:",
    "services.postProduction.pricing3": "4+ videos:",
    "services.highlights": "Highlights",
    "services.noServices": "No services found in this category.",
    
    // Adventures page
    "adventures.title": "Adventures",
    "adventures.subtitle": "Our cinematic travel journal — unique journeys captured from above",
    "adventures.all": "All Adventures",
    "adventures.europe": "Europe",
    "adventures.asia": "Asia",
    "adventures.americas": "Americas",
    "adventures.africa": "Africa",
    "adventures.oceania": "Oceania",
    "adventures.highlights": "Highlights",
    "adventures.gallery": "Gallery",
    "adventures.noAdventures": "No adventures found in this region.",
    
    // Contact page
    "contact.title": "Contact Us!",
    "contact.subtitle": "Let's get in touch! Whether you have a project in mind or just want to say hi.",
    "contact.name": "Name",
    "contact.namePlaceholder": "Your name",
    "contact.email": "Email",
    "contact.emailPlaceholder": "you@example.com",
    "contact.message": "Message",
    "contact.messagePlaceholder": "Write your message...",
    "contact.sending": "Sending...",
    "contact.send": "Send Message",
    "contact.success": "Thank you for your message! 🚀",
    "contact.error": "Oops! Something went wrong. Please try again.",
    "contact.footer": "All rights reserved.",
    
    // Shop page
    "shop.title": "Shop",
    "shop.subtitle": "Discover our premium selection of drones, accessories, and merchandise",
    "shop.allProducts": "All Products",
    "shop.physical": "Physical",
    "shop.digital": "Digital",
    "shop.inStock": "In Stock",
    "shop.outOfStock": "Out of Stock",
    "shop.addToCart": "Add to Cart",
    "shop.noProducts": "No products found in this category.",
  },
  ro: {
    // Navigation
    "nav.home": "Acasă",
    "nav.portfolio": "Portofoliu",
    "nav.services": "Servicii",
    "nav.adventures": "Aventuri",
    "nav.shop": "Magazin",
    "nav.about": "Despre",
    "nav.game": "Joc",
    "nav.contact": "Contact",
    
    // Game page
    "game.title": "Jocuri Dronă",
    "game.subtitle": "Alege modul de joc și începe să joci!",
    "game.enemies": "Inamici",
    "game.mode1.title": "Evită și Colectează",
    "game.mode1.description": "Controlează drona liber. Evită obstacolele roșii și colectează stelele galbene!",
    "game.mode2.title": "Space Invaders",
    "game.mode2.description": "Distruge toți inamicii! Trage și evită proiectilele inamicilor.",
    "game.backToMenu": "Înapoi la Meniu",
    "game.instructions1": "Mișcă mouse-ul sau degetul pentru a controla drona. Evită obstacolele roșii și colectează stelele galbene!",
    "game.instructions2": "Mișcă cu mouse/touch sau tastele săgeți. Click/Space pentru a trage. Distruge toți inamicii!",
    "game.controls1": "🖱️ Mișcă mouse-ul sau 👆 atingere pentru control • ⭐ Colectează stele (+10) • ⛔ Evită obstacole",
    "game.controls2": "🖱️ Mișcă mouse/touch pentru mișcare • 🖱️ Click/Tap sau ⌨️ Space pentru a trage • ⚔️ Distruge toți inamicii!",
    "game.score": "Scor",
    "game.speed": "Viteză",
    "game.ready": "Gata de Zbor?",
    "game.instructions": "Mișcă cu mouse/touch sau tastele săgeți. Click/Space pentru a trage. Distruge toți inamicii!",
    "game.start": "Începe Jocul",
    "game.gameOver": "Joc Terminat!",
    "game.finalScore": "Scor Final",
    "game.wellDone": "Felicitări! Încearcă din nou pentru a-ți depăși scorul.",
    "game.playAgain": "Joacă Din Nou",
    "game.menu": "Meniu",
    "game.controls": "🖱️ Mișcă mouse/touch pentru mișcare • 🖱️ Click/Tap sau ⌨️ Space pentru a trage • ⚔️ Distruge toți inamicii!",
    
    // Home page
    "home.tagline": "Filmări aeriene profesionale & mai mult",
    "home.cta": "Vezi portofoliul",
    "home.workedWith": "Mândri Că Am Colaborat Cu:",
    
    // About page
    "about.title": "Despre Noi",
    "about.subtitle": "Servicii profesionale de filmări aeriene și cinematografie",
    "about.mission": "Misiunea Noastră",
    "about.mission.text1": "La Zoomout_crew, ne specializăm în captarea unor imagini aeriene uimitoare care îți spun povestea dintr-o perspectivă unică. Fie că sunt prezentări imobiliare, acoperire de evenimente, proiecte comerciale sau aventuri cinematice, aducem cinematografie profesională cu drone la fiecare proiect.",
    "about.mission.text2": "Pasiunea noastră pentru fotografia și videografia aeriană ne determină să livrăm calitate excepțională și viziune creativă care ridică conținutul tău deasupra restului.",
    "about.whatWeDo": "Ce Facem",
    "about.aerialCinematography": "Cinematografie Aeriană",
    "about.aerialCinematography.desc": "Imagini aeriene uimitoare pentru filme, documentare și proiecte creative.",
    "about.realEstate": "Imobiliare",
    "about.realEstate.desc": "Prezentări profesionale de proprietăți care evidențiază caracteristici și locații unice.",
    "about.eventCoverage": "Acoperire Evenimente",
    "about.eventCoverage.desc": "Documentare completă a evenimentelor din perspective aeriene unice.",
    "about.commercial": "Proiecte Comerciale",
    "about.commercial.desc": "Videografie comercială de înaltă calitate pentru branduri și campanii de marketing.",
    "about.whyChoose": "De Ce Să Ne Alegi",
    "about.professionalEquipment": "Echipament Profesional",
    "about.professionalEquipment.desc": "Drone și sisteme de camere de ultimă generație pentru imagini de cea mai înaltă calitate.",
    "about.creativeVision": "Viziune Creativă",
    "about.creativeVision.desc": "Perspective unice și povestiri creative care fac conținutul tău să iasă în evidență.",
    "about.experiencedTeam": "Echipă Experiențiată",
    "about.experiencedTeam.desc": "Piloți și operatori de imagine calificați cu ani de experiență în videografie aeriană.",
    "about.reliableService": "Serviciu De Încredere",
    "about.reliableService.desc": "Profesional, punctual și dedicat să livrăm rezultate excepționale la timp.",
    "about.readyToWork": "Gata Să Lucrăm Împreună?",
    "about.readyToWork.text": "Hai să dăm viață viziunii tale din înălțime.",
    "about.getInTouch": "Ia Legătura",
    "about.reviews.title": "Ce Spun Clienții Noștri",
    "about.reviews.review1.text": "Ca CEO al Utopic (echipa de planificare evenimente) și Visual Delights Marketing Agency, am lucrat mult cu Zoomout Crew. Se potrivesc stilului nostru jucăuș și nu se tem să meargă pe urmele ideilor noastre sălbatice (uneori chiar nebunești, să fiu sincer), motiv pentru care au fost alegerea perfectă pentru noi. Când ai nevoie de acele cadre nebunești, periculoase, îi chemi pe ei. Sunt pasionați de ceea ce fac și gata să testeze limitele capacităților lor. Prin urmare, îi recomand dacă te aliniezi și tu cu o viziune îndrăzneață și creativă.",
    "about.reviews.review1.name": "Naim Onuk",
    "about.reviews.review1.initials": "NO",
    "about.reviews.review1.role": "CEO Utopic (organizator de evenimente) și Visual Delights Marketing Agency",
    "about.reviews.review1.textOriginal": "As the CEO of Utopic (event planning crew) and Visual Delights Marketing Agency, I got to work a lot with Zoomout Crew. They fit our playful style, and they are not afraid to go along with our wild (sometimes unhinged, tbh) ideas, which is why they were the perfect fit for us. When you need those crazy, dangerous shots, you call them. They are passionate about what they do and ready to test the limits of their capabilities. Therefore, I recommend them if you align with a bold, creative vision as well.",
    "about.reviews.review2.text": "Lucrare minunată! Au capturat proprietatea noastră frumos din fiecare unghi.",
    "about.reviews.review2.name": "Maria Ionescu",
    "about.reviews.review2.initials": "MI",
    "about.reviews.review2.role": "Agent Imobiliar",
    "about.reviews.review3.text": "Profesioniști, creativi și au livrat exact ce aveam nevoie. Recomand cu căldură!",
    "about.reviews.review3.name": "Mihai Radu",
    "about.reviews.review3.initials": "MR",
    "about.reviews.review3.role": "Director Marketing",
    "about.reviews.review4.text": "Am avut plăcerea de a găzdui la Remote Tiny House Retreat un cuplu deosebit de amabil și profesionist, care, în schimbul unei nopți de cazare, mi-a propus să realizeze câteva filmări superbe cu drona pentru promovarea locației. Colaborarea cu ei a fost excelentă🫂 Materialele pe care le-a creat au pus perfect în valoare frumusețea locului🤗🪄🌻 Îi recomand cu încredere și m-aș bucura să îi revăd oricând💯",
    "about.reviews.review4.textOriginal": "Am avut plăcerea de a găzdui la Remote Tiny House Retreat un cuplu deosebit de amabil și profesionist, care, în schimbul unei nopți de cazare, mi-a propus să realizeze câteva filmări superbe cu drona pentru promovarea locației. Colaborarea cu ei a fost excelentă🫂 Materialele pe care le-a creat au pus perfect în valoare frumusețea locului🤗🪄🌻 Îi recomand cu încredere și m-aș bucura să îi revăd oricând💯",
    "about.reviews.review4.name": "Florin Marius",
    "about.reviews.review4.initials": "FM",
    "about.reviews.review4.role": "Proprietar Remote Tiny House Retreat",
    "about.reviews.review5.text": "Horus a oferit o acoperire cu adevărat excepțională pentru cursa noastră de caritate cu rațe în Cluj. Ceea ce a ieșit în evidență cel mai mult a fost atenția lui incredibilă la detalii, nu a captat doar rațele plutesc pe râu, ci a cronometrat perfect cadrele pentru a arăta energia mulțimilor care se aliniază pe maluri. A reușit să prindă momentul cel mai critic, lansarea efectivă a celor 10 mii de rațe de cauciuc din cușcă, cu precizie absolută. Materialele au fost un atu imens pentru Rotaract și Interact, ajutându-ne să prezentăm adevărata dimensiune și entuziasmul evenimentului. Dacă vrei un pilot de drone care prinde momentele care contează, îl recomand cu căldură!",
    "about.reviews.review5.textOriginal": "Horus delivered truly exceptional coverage for our Charity Duck Race in Cluj. What stood out most was his incredible attention to detail, he didn't just capture the ducks floating on the river, but perfectly timed the shots to show the energy of the crowds lining the banks. He managed to catch the most critical moment, the actual launch of the 10 thousand rubber ducks from the cage, with absolute precision. The footage has been a huge asset for Rotaract and Interact, helping us in showcasing the true scale and excitement of the event. If you want a drone pilot who catches the moments that matter, I highly recommend him!",
    "about.reviews.review5.name": "Rotaract Cluj",
    "about.reviews.review5.initials": "RC",
    "about.reviews.review5.role": "Organizator Eveniment Caritabil",
    "about.reviews.showOriginal": "Afișează original (Română)",
    "about.reviews.showOriginalEnglish": "Afișează original (Engleză)",
    "about.reviews.showTranslated": "Afișează tradus",
    
    // Portfolio page
    "portfolio.title": "Portofoliu",
    "portfolio.subtitle": "Explorează colecția noastră de imagini aeriene profesionale și cinematografie",
    "portfolio.allProjects": "Toate Proiectele",
    "portfolio.aerial": "Aerian",
    "portfolio.realEstate": "Imobiliare",
    "portfolio.events": "Evenimente",
    "portfolio.commercial": "Comercial",
    "portfolio.noProjects": "Nu s-au găsit proiecte în această categorie.",
    
    // Services page
    "services.title": "Servicii",
    "services.subtitle": "Servicii aeriene profesionale adaptate pentru a da viață viziunii tale",
    "services.allServices": "Toate Serviciile",
    "services.filming": "Filmare",
    "services.editing": "Editare",
    "services.aerialFilmingHour": "Filmare Aeriană pe Oră",
    "services.aerialFilmingHour.desc": "Serviciu profesional de filmare aeriană pe oră. Captăm proiectul tău pe video și primești toate materialele brute plus fotografii aeriene gratuite.",
    "services.aerialFilmingHour.feature1": "Filmare aeriană pe oră",
    "services.aerialFilmingHour.feature2": "Fișiere video brute 4K/8K",
    "services.aerialFilmingHour.feature3": "Fotografii aeriene bonus",
    "services.aerialFilmingHour.feature4": "Livrare rapidă",
    "services.aerialFilmingDay": "Filmare Aeriană Zi Completă",
    "services.aerialFilmingDay.desc": "Serviciu profesional de filmare aeriană pentru o zi completă. Captăm proiectul tău pe video și primești toate materialele brute plus fotografii aeriene gratuite.",
    "services.aerialFilmingDay.feature1": "Filmare aeriană zi completă",
    "services.aerialFilmingDay.feature2": "Fișiere video brute 4K/8K",
    "services.aerialFilmingDay.feature3": "Fotografii aeriene bonus",
    "services.aerialFilmingDay.feature4": "Livrare rapidă",
    "services.postProduction": "Post-Producție Profesională",
    "services.postProduction.desc": "Editare profesională a materialelor tale cu color grading, tranziții și design sonor. Prețul scade pentru mai multe videouri.",
    "services.postProduction.feature1": "Editare 4K/8K",
    "services.postProduction.feature2": "Color grading și corecție de culoare",
    "services.postProduction.feature3": "Design sonor și mixare",
    "services.postProduction.feature4": "Mai multe formate de export",
    "services.postProduction.feature5": "Reducere pentru mai multe videouri",
    "services.postProduction.pricing": "Prețuri Post-Producție:",
    "services.postProduction.pricing1": "1 videoclip:",
    "services.postProduction.pricing2": "2-3 videoclipuri:",
    "services.postProduction.pricing3": "4+ videoclipuri:",
    "services.highlights": "Caracteristici",
    "services.noServices": "Nu s-au găsit servicii în această categorie.",
    
    // Adventures page
    "adventures.title": "Aventuri",
    "adventures.subtitle": "Jurnalul nostru de călătorii cinematice — călătorii unice capturate din înălțime",
    "adventures.all": "Toate Aventurile",
    "adventures.europe": "Europa",
    "adventures.asia": "Asia",
    "adventures.americas": "Americi",
    "adventures.africa": "Africa",
    "adventures.oceania": "Oceania",
    "adventures.highlights": "Puncte De Atracție",
    "adventures.gallery": "Galerie",
    "adventures.noAdventures": "Nu s-au găsit aventuri în această regiune.",
    
    // Contact page
    "contact.title": "Contactează-ne!",
    "contact.subtitle": "Hai să ne conectăm! Fie că ai un proiect în minte sau vrei doar să spui salut.",
    "contact.name": "Nume",
    "contact.namePlaceholder": "Numele tău",
    "contact.email": "Email",
    "contact.emailPlaceholder": "tu@exemplu.com",
    "contact.message": "Mesaj",
    "contact.messagePlaceholder": "Scrie mesajul tău...",
    "contact.sending": "Se trimite...",
    "contact.send": "Trimite Mesaj",
    "contact.success": "Mulțumim pentru mesaj! 🚀",
    "contact.error": "Ups! Ceva a mers greșit. Te rugăm să încerci din nou.",
    "contact.footer": "Toate drepturile rezervate.",
    
    // Shop page
    "shop.title": "Magazin",
    "shop.subtitle": "Descoperă selecția noastră premium de drone, accesorii și mărfuri",
    "shop.allProducts": "Toate Produsele",
    "shop.physical": "Fizice",
    "shop.digital": "Digitale",
    "shop.inStock": "În Stoc",
    "shop.outOfStock": "Stoc Epuizat",
    "shop.addToCart": "Adaugă în Coș",
    "shop.noProducts": "Nu s-au găsit produse în această categorie.",
  },
};

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>("en");

  // Load language from localStorage on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") as Language;
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "ro")) {
      setLanguageState(savedLanguage);
    }
  }, []);

  // Save language to localStorage when it changes
  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem("language", lang);
  };

  const t = (key: string): string => {
    return translations[language][key] || key;
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider");
  }
  return context;
}

