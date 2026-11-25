---
title: 'Barrierefreiheit'
description: 'Barrierefreiheitserklärung RGAA / WCAG 2.1 AA für die Kiki en Christ Website.'
pageSlug: 'accessibilite'
lang: 'de'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Zugänglichkeit

## Bestimmung der Übereinstimmung

Kiki in Christ verspricht, dass sein Online-Portal Zugänglichkeit nach dem **RGAA 4.1** (Gesamterleger für Verbesserung der Zugänglichkeit) und den **WCAG 2.1 niveau AA** erfüllt.

## Übersicht der Übereinstimmung

**Partiell** — Letzter Überprüfung: Januar 2025

### Rechtfertigte (Auswahl)

- ✅ Sémantische Struktur HTML5 (Header, Main, Nav, Footer, Section, Article)
- ✅ Übereinstimmung der Titel (h1-h6)
- ✅ Kontrast der Farben ≥ 4.5:1 (Text) / 3:1 (UI)
- ✅ Kürzungsleiste (Skip Link) für den Hauptinhalt
- ✅ Attribut `alt` auf alle Informationsbilder
- ✅ Formulare: explizite Labels, zugängliche Fehlermeldungen
- ✅ Sprache der Seite (`lang`) und Übersetzungen von Elementen
- ✅ ARIA: combobox für Sprachwahl, `aria-expanded`, `aria-controls`
- ✅ Responsiver: mobile-first, Zoom bis 200% ohne Kontextverlust
- ✅ Keine Blinkende Inhalte, keine automatisch nicht kontrollierbare Bewegungen

### Punkte für Verbesserung bekannt

- ⚠️ Einige PDF (eBooks) nicht taggbar — Arbeit in progress
- ⚠️ YouTube-Videos mit eingebauten Überschriften: garantiert nicht
- ⚠️ Audits für Menschen mit Behinderungen noch nicht durchgeführt

## Funktionalitäten der Zugänglichkeit

### Kürzungsleiste

| Taste             | Aktion                                             |
| ----------------- | -------------------------------------------------- |
| `Tab`             | Navigieren zwischen focusbaren Elementen           |
| `Shift+Tab`       | Umkehrnavigation                                   |
| `Enter` / `Space` | Aktivieren von Buttons, Links                      |
| `ESC`             | Schließen von Modalkästen, Dropdowns, Mobile-Menüs |
| `Alt+L`           | Wechsel zur Sprachwahl (falls implementiert)       |

### Zoom und Anzeige

- Zoom des Browsers bis 200%: leseleicht, keine Horizontale-Überlauf
- Systemliche Schriftgröße veränderbar (rem/em Einheiten)
- Schattierungsmodus und Helligkeitmodus respektiert (`prefers-color-scheme`)

### Leser für Leser

Testiert mit: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Genauere Aufforderungen von Titeln, Landmarken, Zuständen (ausgezogen/ausgezogen)
- Sprache der Seite korrekt angesprochen

## Anzeigen eines Problems

Sie haben eine Zugänglichkeitsproblematik? Kontaktieren Sie uns:

- **E-Mail** : kontakt@kikienchrist.com (Betreff: "Zugänglichkeit")
- **Formular** : [Kontaktseite](/de/contact/)

Wir versprechen, innerhalb von 48 Stunden zu antworten und innerhalb von 30 Tagen zu korrigieren.

## Referenzmaterialien

- [RGAA 4.1](https://accessibilite.numerique.gouv.fr/methode/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Testguide für RGAA](https://accessibilite.numerique.gouv.fr/outils/)
