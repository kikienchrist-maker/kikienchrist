---
title: 'Accessibility'
description: 'Accessibility statement RGAA / WCAG 2.1 AA for the Kiki en Christ website.'
pageSlug: 'accessibilite'
lang: 'en'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Accessibility

## Compliance Declaration

Kiki en Christ commits to making its site accessible in accordance with the **RGAA 4.1** (General Reference for Improving Accessibility) and the **WCAG 2.1 AA**.

## Compliance Status

**Partially Compliant** — Last audit: January 2025

### Criteria Met (Sample)

- ✅ Semantic HTML5 structure (header, main, nav, footer, section, article)
- ✅ Consistent title hierarchy (h1-h6)
- ✅ Contrast ratio ≥ 4.5:1 (text) / 3:1 (UI)
- ✅ Complete keyboard navigation (focus visible, logical order)
- ✅ Skip link for evasive links (Skip Link)
- ✅ Alt attributes on all informative images
- ✅ Forms: explicit labels, accessible error messages
- ✅ Page language (`lang`) and language changes (`lang` on elements)
- ✅ ARIA: combobox for language selector, `aria-expanded`, `aria-controls`
- ✅ Responsive: mobile-first, zoom up to 200% without losing content
- ✅ No blinking content, no non-controlled auto-scrolling

### Known Improvements

- ⚠️ Some PDFs (e-books) not tagged — ongoing work
- ⚠️ YouTube embedded videos: subtitles not guaranteed
- ⚠️ User-handicapped audits not yet conducted

## Accessibility Features

### Keyboard Shortcuts

| Key               | Action                                   |
| ----------------- | ---------------------------------------- |
| `Tab`             | Navigate focusable elements              |
| `Shift+Tab`       | Reverse navigation                       |
| `Enter` / `Space` | Activate buttons, links                  |
| `Esc`             | Close modals, dropdowns, mobile menu     |
| `Alt+L`           | Go to language selector (if implemented) |

### Zoom and Display

- Browser zoom up to 200%: readable content, no horizontal overflow
- System font size adjustable (rem/em units)
- Dark/light mode respected (`prefers-color-scheme`)

### Screen Readers

Tested with: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Correct announcements of titles, landmarks, states (expanded/collapsed)
- Correct language announced by page

## Report a Problem

If you encounter an accessibility issue, please contact us:

- **Email** : kikienchrist@gmail.com (subject: "Accessibility")
- **Form** : [Contact Page](/en/contact/)

We commit to responding within 48 hours and correcting within 30 days.

## References

- [RGAA 4.1](https://accessibility.numerique.gouv.fr/methode/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [RGAA Guide](https://accessibility.numerique.gouv.fr/outils/)
