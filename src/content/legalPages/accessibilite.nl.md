---
title: 'Toegankelijkheid'
description: 'Toegankelijkheidsverklaring RGAA / WCAG 2.1 AA voor de Kiki en Christ website.'
pageSlug: 'accessibilite'
lang: 'nl'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Toegankelijkheid

## Verklaring van toegankelijkheid

Kiki in Christ stelt zich vast om zijn site toegankelijk te maken in overeenstemming met het **RGAA 4.1** (Geschiedenis van de Verkopering van Accessibiliteit) en het **WCAG 2.1 niveau AA**.

## Toegankelijkheid

**Partiële toegankelijkheid** — Laatste inschrijving: januari 2025

### Toegankelijke criteriumen (voorbeeld)

- ✅ Structuur semantisch HTML5 (header, main, nav, footer, section, article)
- ✅ Hoërstructuur van titels (h1-h6) in overeenstemming
- ✅ Contrast tussen kleuren ≥ 4.5:1 (tekst) / 3:1 (UI)
- ✅ Complete navigatie met toetsenbord (focus is zichtbaar, logisch)
- ✅ Links van evitatie (Skip Link) naar het hoofdinhoud
- ✅ Aanvullende attributen `alt` op alle informatiebronnen
- ✅ Formulieren: expliciete labels, toegankelijke meldingen van fouten
- ✅ Taal van de pagina (`lang`) en veranderingen van taal (`lang` op elementen)
- ✅ ARIA: combobox voor de taalselecteur, `aria-expanded`, `aria-controls`
- ✅ Responsabel: mobile-first, zoom tot 200% zonder verlies van inhoud
- ✅ Geen toegankelijke content clignend, geen automatisch niet toegankelijke beweging

### Kritische punten aanpassing

- ⚠️ Certijns PDF (ebooks) niet taggeld — werkzaamheid
- ⚠️ YouTube-clip's met ingebeeld: onderdrukking van onderdrukking
- ⚠️ Inschrijvingen van handigheidsgebruikers niet nog meer uitgevoerd

## Functies van toegankelijkheid

### Toetsenbord

| Toets             | Actie                                        |
| ----------------- | -------------------------------------------- |
| `Tab`             | Navigeren tussen focusbare elementen         |
| `Shift+Tab`       | Navigatie in het opposie                     |
| `Enter` / `Space` | Activeren knoppen, links                     |
| `Esc`             | Sluiten modales, dropdowns, mobile-menu      |
| `Alt+L`           | Ga naar de taalselecteur (als implementeerd) |

### Zoom en toon

- Zoom in browser tot 200%: toegankelijk, geen horizontale overflow
- Systemische typografië redimensionbare (rem/em units)
- Mode sombre/klar respecteerd (`prefers-color-scheme`)

### Lesers van toegankelijkheid

Testen met: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Correcte toon van titels, landmarks, status (expanded/collapsed)
- Taal wordt correct geannuleerd per pagina

## Berichten een probleem

U raakt in een toegankelijke problemen? Contacter ons:

- **Email** : kikienchrist@gmail.com (onderwerp: "Toegankelijkheid")
- **Formulier** : [Contactpagina](/nl/contact/)

We zorgen ervoor dat we binnen 48 uur antwoord geven en binnen 30 dagen de problemen oplossen.

## Referentie

- [RGAA 4.1](https://toegankelijkheid.numerieke.gouv.nl/methode/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Guide test RGAA](https://toegankelijkheid.numerieke.gouv.nl/outils/)
