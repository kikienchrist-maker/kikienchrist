---
title: "Dostępność"
pageSlug: "accessibilite"
lang: "pl"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---







---
title: "Accessibility"
pageSlug: "accessibilite"
lang: "pl"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
content: |
  # Przestrzenność
  **Kiki en Christ** jest zobowiązany do przestrzeniagniecia w zgodzie z Art. 47 Ustawy z dnia 10.1.2005 w sprawie informatyki i wolności (UW) oraz zgodnie z **Rozporządzeniem Generalnego dla Zwiększenia Przestrzenności (RGAA 4.1)** / **WCAG 2.1, poziom AA**.

  ## 1. Stosunek do przestrzeniagniecia

  **Strona internetowa** : https://kikienchrist.vercel.app/  
  **Data ostatniej oceny** : 15 stycznia 2025  
  **Nivej przestrzeniagniecia** : **AA (RGAA 4.1 / WCAG 2.1)**  
  **Status** : **Przestrzeniagniecie w trakcie auditu — przestrzeniagniecie częściowe przewidywane ~85%**

  > Ta deklaracja zostanie zaktualizowana po zakończeniu pełnego auditu przez experta przestrzeniagniecznego.

  ## 2. Zasięg auditu

  Strony testowane (reprzesnienie przypadkowe) :
  - Strona glowna (9 języków)
  - Strony książek (4 książek × 9 języków)
  - Newsletter / FAQ / Kontakt
  - Strony prawne (5 stron × 9 języków) — *ta strona wkladana*
  - Blog (artykuły, kategorie, tagi, serii)
  - Bannik cookies (RGPD)

  Technologie : **Astro 4 (HTML statyczny)** · **CSS Vanillę (lafoidieu-design.css)** · **JS Vanillę (ES Modules)** · **Middleware Vercel Edge**

  ## 3. Wyniki według kryteriów (RGAA 4.1)

  | Temat | Kryteria przestrzeniagniecia / Wielokrotności | Notatki |
  |-------|------------------------------------------|-------|
  | **1. Obrazów** | 8/9 | Texty alternatywne na wszystkich obrazach zawierających zawartość. *Do sprawdzenia: obrazy z dodatkowymi opisami `alt=""`* |
  | **2. Cadry** | 3/3 | Nie istnieją iframe, nie istnieją frame |
  | **3. Kolorów** | 5/6 | Kontrast ≥ 4.5:1 (teksty) / 3:1 (UI). *Do sprawdzenia: widoczność foci na wszystkich elementach* |
  | **4. Multimediów** | 4/4 | Nie istnieją video/audio auto. Nie istnieją wymagania na sous-titrusy (nie istnieją mediana natywna) |
  | **5. Tablic** | 3/3 | Nie istnieją tablice danych złożone |
  | **6. Linków** | 6/6 | Texty linków explicite, nie istnieje "kliknij tutaj", widoczna foca |
  | **7. Skryptów** | 5/6 | Skrypty dostępne (ARIA, foca trap, Escape). *Do sprawdzenia: zmiany zawartości powiadomione* |
  | **8. Elementów wymaganych** | 8/9 | Język, tytuł, struktura H1-H6, landmarks. *Do sprawdzenia: link skip* |
  | **9. Struktury** | 7/7 | HTML5 sémantyczny, headings orneowane, lists, landmarks |
  | **10. Przestrzeniagniecia** | 6/7 | Responsywność, zoom 200% bez zmian, nie istnieje zawartość klęczonego |
  | **11. Formularzy** | 8/9 | Linki explicite, grupowanie, komunikaty błędów. *Do sprawdzenia: automatyzacja* |
  | **12. Navigation** | 7/8 | Menu klawiety, widoczna foca, kolejność logicka. *Do sprawdzenia: link skip* |
  | **13. Przestrzeniagniecia** | 6/6 | Responsywność, orientacja, redimensionowanie tekstu |

  **Wielokrotności przewidywane** : **~77/91 kryterii przestrzeniagniecia (85%)**

  ## 4. Nieprzestrzeniagniecia znane i plan działania

  | Kryterium | Nieprzestrzeniagniecie | Priorność | Echelon |
  |---------|----------------------|----------|----------|
  | 1.8 / 8.9 | **Link skip** (link do dostępu szybkiego do głównego zawartości) brakujący | Haute | Q1 2025 |
  | 3.3 | Widoczność foci nieufficjalna na niektórych przyciskach (newsletter, przeszkadzacz języków) | Haute | Q1 2025 |
  | 7.5 | Nie powiadomienie o zmianach zawartości dynamicznych (bannik cookies, panel) nie powiadomione przez `aria-live` | Moyenne | Q2 2025 |
  | 11.9 | Nie istnieje atrybut `autocomplete` na polach e-mail/newsletter | Moyenne | Q1 2025 |
  | 12.8 | Kolejność tabulacji przeszkadzaczu języków (mobile) do sprawdzenia | Basse | Q2 2025 |

  ## 5. Strony nie przestrzeniagniecia

  - Strony nieodpowiedzialne : platformy sprzedaży (Lulu, Payhip, Google Play), embedowane resewy
  - Archyv (wczesne wersje stron nie dostarczane)
  - Pliki PDF dostarczane (kursy, fragmenty) — *do przestrzeniagniecia, jeśli zostaną opublikowane*

  ## 6. Rozwój

  - **Testy automatyczne** : `axe-core` w CI/CD (GitHub Actions)
  - **Testy manuale** : Navigation klawiety tylko, NVDA/VoiceOver, zoom 200/400%
  - **Sensibilizacja** : Ekipa przestrzeniagniecznej
  - **Audit externe** : Zaprojeczany na rok przez experta przestrzeniagniecznego

  ## 7. Plan przestrzeniagnieczy (2025-2027)

  | Rok | Obiekty |
  |-------|-----------|
  | **2025** | Przestrzeniagniecie w trakcie auditu — przestrzeniagniecie częściowe przewidywane ~85% |
  | **2026** | Przestrzeniagniecie 100% RGAA 4.1 AA, dostępność PDF, testy użytkowników zdarzeń |
  | **2027** | Przestrzeniagniecie, integracja RGAA 5 / WCAG 2.2, dostępność aplikacji mobilnej |

  ## 8. Kontakt przestrzeniagnieczy / Referent

  Jeśli spotyka się problem z dostępnością, zgłaszaj go : 

  📧 **accessibilite@kikienchrist.com** ( lub kontakt@kikienchrist.com)  
  📮 **Kiki en Christ — [Adres południowy do zaktualizowania]**  
  ⏱ **Długość odpowiedzi** : 15 dni roboczych maksymalne

  ## 9. Przezgrywane

  Jeśli problem nie zostanie rozwiązany :
  - **Defensywa praw** : https://www.defenseurdesdroits.fr/
  - **Referent przestrzeniagnieczny administracyjny** : w zależności od Twojej organizacji

  ## 10. Technologie pomocy testowane

  - **Lectory klawiety** : NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
  - **Navigatory** : Firefox, Chrome, Safari, Edge (dane najnowsze)
  - **Zoom** : 100%, 200%, 400% (teksty tylko / stronę completa)
  - **Klaiety tylko** : Tab, Shift+Tab, Enter, Escape, Flèches

  ---
  *Dane ostatniej aktualizacji : 15 stycznia 2025 — Wersja 1.0*
requiredByLaw: true
jurisdiction: ["EU", "PL"]
---






