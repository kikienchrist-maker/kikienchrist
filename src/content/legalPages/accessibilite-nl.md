---
title: "Toegankelijkheid"
pageSlug: "accessibilite"
lang: "nl"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---







---
title: "Accessibilité"
pageSlug: "accessibilite"
lang: "nl"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
content: |
  # Accessibilité : Verklagtiging

  **Kiki in Christ** stelt zich in staat om zijn site te maken toegankelijk in overeenkomst met het **Artikel 47 van de Wet van 10 februari 2005** en het **Grootere Raad voor de Verloop van de Accessibiliteit (RGAA 4.1)** / **WCAG 2.1 niveau AA**.

  ## 1. Status

  **Site web** : https://kikienchrist.vercel.app/  
  **Date van laatste evaluatie** : 15 januari 2025  
  **Niveau** : **AA (RGAA 4.1 / WCAG 2.1)**  
  **Status** : **In volgorde van audit — Conformiteit partiële tot 85%**  

  > Deze verklagtiging zal worden aangepast na volledige audit door een certificaatige toegankelijkheid expert.

  ## 2. Perimeter van de audit

  Pagina's testen (voorbeeldig representatief) :
  - Pagina van het begin (9 talen)
  - Pagina's van de boeken (4 boeken × 9 talen)
  - Newsletter / FAQ / Contact
  - Pagina's van de wetgeving (5 pagina's × 9 talen) — *diese pagina incluisief*
  - Blog (artikelen, categorieën, tags, series)
  - Bannière cookies (RGPD)

  Technologieën : **Astro 4 (Static HTML)** · **CSS Vanilla (lafoidieu-design.css)** · **JS Vanilla (ES Modules)** · **Vercel Edge Middleware**

  ## 3. Resultaten per kritiek (RGAA 4.1)

  | Thema | Kritiek conform / totale | Noten |
  |-------|---------------------------|-------|
  | **1. Afbeeldingen** | 8/9 | Afbeeldingen met alternatieve tekst voor alle afbeeldingen van inhoud. *Toewijzen: afbeeldingen decoratieve `alt=""`* |
  | **2. Cadres** | 3/3 | Geen iframe's, geen frames |
  | **3. Kleur** | 5/6 | Kleurcontrast ≥ 4.5:1 (tekst) / 3:1 (UI). *Toewijzen: focus zichtbaar op alle elementen* |
  | **4. Multimedië** | 4/4 | Geen video/audio auto. Geen ondertitels vereist (geen natief media) |
  | **5. Tabels** | 3/3 | Geen complexe tabellen van data |
  | **6. Links** | 6/6 | Links met expliciete tekst, geen "klik hier", focus zichtbaar |
  | **7. Scripts** | 5/6 | Accessibele scripten (ARIA, focus trap, Escape). *Toewijzen: veranderingen van inhoud aangezien* |
  | **8. Obligaties** | 8/9 | Taal, titel, H1-H6, landmarks. *Toewijzen: skip link* |
  | **9. Structuur** | 7/7 | HTML5 sémantisch, H1-H6, landmarks |
  | **10. Presentatie** | 6/7 | Responsabel, zoom 200% zonder verandering, geen tekst dat klopt |
  | **11. Formulieren** | 8/9 | Explicite labels, gedeeld, meldingen van fouten. *Toewijzen: autocomplete* |
  | **12. Navigation** | 7/8 | Menu met toegankelijkheid, focus zichtbaar, logische volgorde. *Toewijzen: skip link* |
  | **13. Consultatie** | 6/6 | Responsabel, orientatie, veranderen tekst |  

  **Totale aangemerkt** : **~77/91 kritiek conform (85%)**  

  ## 4. Non-conformities bekend en Plan van actie

  | Kritiek | Non-conformiteit | Prioriteit | Echtendatum |
  |---------|----------------|----------|----------|
  | 1.8 / 8.9 | **Skip link** (link vanuit het sneltoegang tot het huidige inhoudsbron) mancunt | Hoog | Q1 2025 |
  | 3.3 | Focus zichtbaar ongeloist op sommige knoppen (newsletter, taalverschakelingsknop) | Hoog | Q1 2025 |
  | 7.5 | Veranderingen van inhoud dynamisch (bannière cookies, panel) niet aangezien via `aria-live` | Middel | Q2 2025 |
  | 11.9 | Attribuut `autocomplete` mancunt op velden email/newsletter | Middel | Q1 2025 |
  | 12.8 | Rekenaar van de taalselectie (mobile) te testen | Laag | Q2 2025 |  

  ## 5. Contenues niet onder aanhouding van de obligatie van toegankelijkheid

  - Contenues derijkers : platformen van verkopen (Lulu, Payhip, Google Play), embeds van sociale media
  - Archief (oudere versies van paginas niet bewaard)
  - PDF's te downloaden (guides, extraits) — *toewijzen toegankelijk als gepubliceerd*  

  ## 6. Continuïteit

  - **Automatische tests** : `axe-core` in CI/CD (GitHub Actions)
  - **Manueel tests** : Navigation met klavier, NVDA/VoiceOver, zoom 200/400%
  - **Onderwijs** : Team sensibiliseerd RGAA/WCAG
  - **Audit externe** : Gepland jaarlijkse door een certificaatige expert

  ## 7. Pluriannuel schakelplan van toegankelijkheid (2025-2027)

  | Jaar | Doel |
  |-------|-----------|
  | **2025** | Corrigeren non-conformities hoë, volledige audit, certificaat partiële |
  | **2026** | Bereiken 100% RGAA 4.1 AA, toegankelijkheid PDF, tests gebruikershandicap |
  | **2027** | Keuze van toegankelijkheid, integreer RGAA 5 / WCAG 2.2, toegankelijkheid mobile-app |  

  ## 8. Contact toegankelijkheid / Referent

  Als u een toegankelijke problemen raadt :  

  📧 **accessibiliteit@kikienchrist.com** (of **contact@kikienchrist.com**)  
  📮 **Kiki in Christ — [Adres postale te vervangen]**  
  ⏱ **Dagelijkse antwoord** : 15 dagen of maximaal 15 dagen

  ## 9. Voies van recours

  Als de probleem niet is opgelost :  
  - **Defensie van rechten** : https://www.defensie-rechten.fr/  
  - **Referentie toegankelijkheid administratie** : op basis van uw organisatie

  ## 10. Technieken van ondersteuning testen

  - **Lectoren van e-screen** : NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
  - **Navigatie** : Firefox, Chrome, Safari, Edge (dernie versies)
  - **Zoom** : 100%, 200%, 400% (tekst alleen / volledige pagina)
  - **Klavier alleen** : Tab, Shift+Tab, Enter, Escape, Flèches

  ---  
  *Dernier bewerking : 15 januari 2025 — Versie 1.0*






