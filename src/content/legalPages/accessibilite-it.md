---
title: "Accessibilità"
pageSlug: "accessibilite"
lang: "it"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---








title: "Accettibilità"
pageSlug: "accessibilità"
lang: "it"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
content: |
  # Accettibilità: Dichiarazione di conformità

  **Kiki in Cristo** si assicura di rendere il suo sito web accessibile in conformità con l'**Art. 47 della Legge n. 2005-102** e al **Riferimento Generale di Amministrazione di miglioramento dell'Accettibilità (RGAA 4.1)** / **WCAG 2.1, livello AA**.

  ## 1. Stato di conformità

  **Sito web**: https://kikienchrist.vercel.app/  
  **Data di ultima valutazione**: 15 gennaio 2025  
  **Livello visato**: **AA (RGAA 4.1 / WCAG 2.1)**  
  **Stato**: **In corso di audit — Conformità parziale stimata ~85%**

  > Questa dichiarazione sarà aggiornata dopo l'audizione completa da un esperto di accettibilità.

  ## 2. Raggio di audit

  **Pagine testate (esempio rappresentativo)**:
  - Pagine di accettazione (9 lingue)
  - Pagine di libri (4 libri × 9 lingue)
  - Newsletter / FAQ / Contatto
  - Pagine legali (5 pagine × 9 lingue) — *questa pagina incluso*
  - Blog (articoli, categorie, tag, serie)
  - Banniera cookies (RGPD)

  **Technologie**: **Astro 4 (HTML static)** · **CSS Vanilla (lafoidieu-design.css)** · **JS Vanilla (ES Modules)** · **Middleware Vercel Edge**

  ## 3. Resultati per criterio (RGAA 4.1)

  | Tema | Criteri conformi / Totale | Note |
  |-------|---------------------------|-------|
  | **1. Immagini** | 8/9 | Testo alternativo presenti su tutte le immagini di contenuto. *A verificare: immagini decorative `alt=""`* |
  | **2. Cadri** | 3/3 | Non utilizzano sezioni seccasse |
  | **3. Colore** | 5/6 | Contrasto ≥ 4.5:1 (testo) / 3:1 (UI). *A verificare: focus visibile su tutti gli elementi* |
  | **4. Multimedia** | 4/4 | Non utilizzano video/audio auto. Non richiedono sotto-titoli (non sono media native) |
  | **5. Tabulazioni** | 3/3 | Non utilizzano tabulazioni di dati complessi |
  | **6. Linki** | 6/6 | Testo di link esplicativo, non utilizzano "clicca qui" e focus visibile |
  | **7. Scripti** | 5/6 | Scripti accessibili (ARIA, focus trap, Escape). *A verificare: cambiamenti di contenuto annunciati* |
  | **8. Elementi obbligatori** | 8/9 | Lingua, titolo, struttura H1-H6, landmarki. *A verificare: link di scelta* |
  | **9. Struttura** | 7/7 | HTML5 seme, struttura ordonata, liste, landmarki |
  | **10. Presentazione** | 6/7 | Responsivo, zoom 200% senza perdita, non utilizzano contenuti che scintillano |
  | **11. Formulari** | 8/9 | Testo di label esplicativo, gruppo, messaggi di errore. *A verificare: autocomplete* |
  | **12. Navigation** | 7/8 | Menu coniato, focus visibile, struttura logica. *A verificare: link di scelta* |
  | **13. Consultazione** | 6/6 | Responsivo, orientamento, redimensionamento testo |

  **Totale stimato**: **~77/91 criti confori (85%)**

  ## 4. Non-conformità note e Piano di azione

  | Critere | Non-conformità | Priorità | Echelone |
  |---------|----------------|----------|----------|
  | 1.8 / 8.9 | **Link di scelta** (link di accesso rapido al contenuto principale) mancante | Alta | Q1 2025 |
  | 3.3 | Focus visibile insuffisante su alcuni bottoni (newsletter, switchero lingua) | Alta | Q1 2025 |
  | 7.5 | Cambiamenti di contenuto dinamici (banniera cookies, pannello) non annunciati via `aria-live` | Media | Q2 2025 |
  | 11.9 | Attributo `autocomplete` mancante su campi email/newsletter | Media | Q1 2025 |
  | 12.8 | Ordine di tabulazione del selezionatore di lingua (mobile) a verificare | Basso | Q2 2025 |

  ## 5. Contenuti non soggetti all'obbligo di accettibilità

  - Contenuti esterni: piattaforme di vendita (Lulu, Payhip, Google Play), rese sociali embed
  - Archivio (versioni precedenti delle pagine non mantenute)
  - File PDF downloadibili (guida, estratti) — *a rendere accessibili se pubblicati*

  ## 6. Amministrazioni continue

  - **Test automatici**: `axe-core` nella CI/CD (GitHub Actions)
  - **Test manuali**: Navigation coniato solo, NVDA/VoiceOver, zoom 200/400%
  - **Formazione**: Equipe sensibilizzata RGAA/WCAG
  - **Audit esterno**: previsto annualmente da esperto certificato

  ## 7. Piano di accettibilità plurianniario (2025-2027)

  | Anno | Obiettivi |
  |-------|-----------|
  | **2025** | Corregere non-conformità alte, audit completo, certificazione parziale |
  | **2026** | Atteggiare 100% RGAA 4.1 AA, accettabilità PDF, test utili di handicap |
  | **2027** | Mantenere conformità, integrare RGAA 5 / WCAG 2.2, accettabilità app mobile |

  ## 8. Contatti accettabilità / Riferimento

  Se si trova una difficoltà d'accessibilità, si segnala:

  📧 **accessibilita@kikienchrist.com** (o **contatto@kikienchrist.com**)  
  📮 **Kiki in Cristo — [Indirizzo postale a compilare]**  
  ⏱ **Tempo di risposta**: 15 giorni lavorativi massimo

  ## 9. Via di recupero

  Se il problema non è risolto:
  - **Defensori delle diritti**: https://www.defensordesdroits.fr/
  - **Riferimento accettabilità amministrazione**: secondo la vostra organizzazione

  ## 10. Tecnologie di assistenza testate

  - **Lectori d'occhi**: NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
  - **Navigatori**: Firefox, Chrome, Safari, Edge (ultime versioni)
  - **Zoom**: 100%, 200%, 400% (testo solo / pagina completa)
  - **Coniato solo**: Tab, Shift+Tab, Enter, Escape, Flèches

  ---
  *Derniera aggiornazione: 15 gennaio 2025 — Versione 1.0*
requiredByLaw: true
jurisdiction: ["UE", "FR"]
--- 
```

"
requiredByLaw: undefined
jurisdiction: undefined
---









