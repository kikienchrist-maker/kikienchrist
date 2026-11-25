---
title: 'Accessibilità'
description: 'Dichiarazione di accessibilità RGAA / WCAG 2.1 AA per il sito Kiki en Christ.'
pageSlug: 'accessibilite'
lang: 'it'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Accessibilità

## Dirottamento di conformità

Kiki en Christ si assicura di rendere il suo sito accessibile in conformità con **RGAA 4.1** (Riferimento Generale di Amministrazione della Accessibilità) e con **WCAG 2.1, livello AA**.

## Stato di conformità

**Conformità parziale** — Ultimo controllo: gennaio 2025

### Criteri rispettati (esempio)

- ✅ Struttura semantica HTML5 (header, main, nav, footer, section, article)
- ✅ Hierarchia dei titoli (h1-h6) coerente
- ✅ Contrasto colori ≥ 4.5:1 (testo) / 3:1 (UI)
- ✅ Navigation con accesso con il clavier completo (focus visibile, ordine logico)
- ✅ Linki di evitamento (Link Skip) verso il contenuto principale
- ✅ Attributi `alt` su tutte le immagini informative
- ✅ Formulari: labellopi esposti, messaggi di errore accessibili
- ✅ Lingua della pagina (`lang`) e cambiamenti di lingua (`lang` su elementi)
- ✅ ARIA: combobox per selezione della lingua, `aria-expanded`, `aria-controls`
- ✅ Responsivi: primo azzero, zoom fino a 200% senza perdita di contenuto
- ✅ Non contenuti che scintillano, non movimenti non controllabili

### Punti di miglioramento noti

- ⚠️ Certi PDF (ebook) non taggati — lavoro in corso
- ⚠️ Videolezioni YouTube incorporate: sotto-titoli non garantiti
- ⚠️ Audits di utenti con disabilità non ancora realizzati

## Funzionalità di accessibilità

### Raccordi con il clavier

| Tasto                | Impiego                                              |
| -------------------- | ---------------------------------------------------- |
| `Tab`                | Navigare tra elementi focusabili                     |
| `Shift+Tab`          | Navigation inversa                                   |
| `Entrata` / `Espace` | Accedere a bottoni, linki                            |
| `Esc`                | Chiudere modali, dropdowns, menu mobile              |
| `Alt+L`              | Passare al selezionatore di lingua (se implementato) |

### Zoom e visualizzazione

- Zoom del browser fino a 200%: contenuto leggibile, non scendere in bordo orizzontale
- Sfumatura del carattere sistema riscaldabile (unità rem/em)
- Modo scuro/ chiaro rispettato (`prefers-color-scheme`)

### Lettori di schermo

Testato con: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Annotazione corretta dei titoli, landmarki, stati (expanded/collapsed)
- Lingua annotata correttamente da pagina

## Informare un problema

Se incontri una difficoltà d'accessibilità? Contattaci:

- **Email** : kikienchrist@gmail.com (oggetto: "Accessibilità")
- **Formulario** : [Pagine Contatto](/it/contacto/)

Siamo assicurati di rispondere sotto 48 ore e di correggere sotto 30 giorni.

## Riferimenti

- [RGAA 4.1](https://accessibilita.numerico.gov.it/methode/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Guida di test RGAA](https://accessibilita.numerico.gov.it/outils/)
