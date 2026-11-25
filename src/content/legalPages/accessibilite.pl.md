---
title: 'Dostępność'
description: 'Oświadczenie o dostępności RGAA / WCAG 2.1 AA dla strony Kiki en Christ.'
pageSlug: 'accessibilite'
lang: 'pl'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Ograniczalność

## Zgodzenie z ograniczalnością

Kiki w Christ oznacza, że jego stronę będzie dostępna w zgodzie z **RGAA 4.1** (Referat Głównej Ograniczalności) i **WCAG 2.1 nivela AA**.

## Stosowanie zgodności

**Ograniczona zgodność** — Ostatni audit: styczeń 2025

### Zasady zgodności (zbiór)

- ✅ Struktura semantyczna HTML5 (header, main, nav, footer, section, article)
- ✅ Hierarchia tytułów (h1-h6) spełniająca się
- ✅ Kontrast kolorów ≥ 4.5:1 (tekst) / 3:1 (UI)
- ✅ Wszystkie elementy, które są przyciskami, mają attribute `alt`
- ✅ Wszystkie linki są zaznaczone jako "zakres"
- ✅ Wszystkie formularze mają explicitne etykiety i dostępne komunikaty błędów
- ✅ Strona językowa (`lang`) i zmiany języka (`lang` na elementach)
- ✅ ARIA: combobox dla selektora języka, `aria-expanded`, `aria-controls`
- ✅ Responsywność: mobile-first, zoom do 200% bez utraty treści
- ✅ Nie ma treści, które się gęśią lub nie ma ani nie ma ani nie ma

### Znaczniki optymalizacji

- ⚠️ Niektóre PDF (ebooks) nie są tagowane — pracujemy nad tym
- ⚠️ YouTube, które są włączane w videoch: niegarantowane tłumaczenia
- ⚠️ Nieudaną próby testów użytkowników z disabilitiesami

## Funkcje ograniczalności

### Przyciski klawiatury

| Klawisz           | Akcja                                                   |
| ----------------- | ------------------------------------------------------- |
| `Tab`             | Przejdź między elementami, które mogą być przyciskami   |
| `Shift+Tab`       | Przejdź w odwrotnej kolejności                          |
| `Enter` / `Space` | Wybierz przyciski, linki                                |
| `Esc`             | Zamykaj modale, dropdowns, menu mobile                  |
| `Alt+L`           | Przejdź do selektora języka (jeśli jest implementowany) |

### Zmiana rozdzielczości i widoczności

- Zmiana rozdzielczości w przeglądarki do 200%: treści lizable, bez utraty horizontalnej
- Systemy czcionek rednie (rem/em units)
- Zasady czarno-czerwonej i czarna czarno

### Lectywy

Testowane z: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Zawartość stron jest anulowana poprawnie, landmarks, stan (wybrane/nie wybrane)
- Język anulowany poprawnie na stronach

## Zgłoś problem

Jeśli masz problem z dostępnoscią, skontaktuj się z nami:

- **E-mail** : kontakt@kikienchrist.com (temat: "Ograniczalność")
- **Formularz** : [Strona kontaktowa](/pl/kontakt/)

Znajdziemy się w stanie odpowiedzić w ciągu 48 godzin i poprawić w ciągu 30 dni.

## Referencje

- [RGAA 4.1](https://ograniczalnosc.numerique.gouv.fr/methode/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Przewodnik testów RGAA](https://ograniczalnosc.numerique.gouv.fr/outils/)

## Historia

| Data       | Wersja | Notatki                                                          |
| ---------- | ------ | ---------------------------------------------------------------- |
| 15/01/2025 | 1.0    | Zgodność początkowa, automatyczny audit (axiory-core) + manualny |
