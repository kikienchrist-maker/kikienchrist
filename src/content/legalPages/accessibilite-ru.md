---
title: "Доступность"
pageSlug: "accessibilite"
lang: "ru"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---







---
title: "Accessibility"
pageSlug: "accessibilite"
lang: "ru"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
content: |
  # Accessibility: Declaration of Compliance

  **Kiki en Christ** commits to making its website accessible in accordance with Article 47 of the Law No. 2005-102 and the General Reference Framework for Improving Accessibility (RGAA 4.1) / WCAG 2.1 level AA.

  ## 1. Compliance State

  **Website URL:** https://kikienchrist.vercel.app/  
  **Last Audit Date:** January 15, 2025  
  **Target Level:** **AA (RGAA 4.1 / WCAG 2.1)**  
  **Status:** **Partially compliant, estimated ~85%**  

  > This declaration will be updated after a complete audit by a certified accessibility expert.

  ## 2. Audit Scope

  Tested Pages (representative sample):
  - Homepage (9 languages)
  - Book Pages (4 books × 9 languages)
  - Newsletter / FAQ / Contact
  - Legal Pages (5 pages × 9 languages) — *included*
  - Blog (articles, categories, tags, series)
  - Cookie Banner (RGPD)

  Technologies: **Astro 4 (Static HTML)** · **Vanilla CSS (lafoidieu-design.css)** · **Vanilla JS (ES Modules)** · **Vercel Edge Middleware**

  ## 3. Results by Criterion (RGAA 4.1)

  | Category | Criteria Conformed / Total | Notes |
  |----------|---------------------------|-------|
  | **1. Images** | 8/9 | Alt text present on all images of content. *To verify: decorative images with `alt=""`* |
  | **2. Frames** | 3/3 | No iframes, no frames |
  | **3. Colors** | 5/6 | Contrast ≥ 4.5:1 (text) / 3:1 (UI). *To verify: focus visible on all elements* |
  | **4. Multimedia** | 4/4 | No video/audio autoplay. No media required for audio/visual content |
  | **5. Tables** | 3/3 | No complex data tables |
  | **6. Links** | 6/6 | Explicit links text, no "click here", focus visible |
  | **7. Scripts** | 5/6 | Accessible JS (ARIA, focus trap, Escape). *To verify: changes of content announced* |
  | **8. Mandatory Elements** | 8/9 | Language, title, H1-H6 structure, landmarks. *To verify: skip link* |
  | **9. Structure** | 7/7 | HTML5 semantic, ordered headings, lists, landmarks |
  | **10. Presentation** | 6/7 | Responsive, no flickering content |
  | **11. Forms** | 8/9 | Explicit labels, grouping, error messages. *To verify: autocomplete* |
  | **12. Navigation** | 7/8 | Keyboard menu, focus visible, logical order. *To verify: skip link* |
  | **13. Consultation** | 6/6 | Responsive, orientation, text resizing |  

  **Estimated Total:** **~77/91 criteria conformed (85%)**  

  ## 4. Known Non-Conformities & Action Plan

  | Criterion | Non-conformity | Priority | Deadline |
  |-----------|----------------|----------|----------|
  | 1.8 / 8.9 | **Missing Skip link (quick access to main content)** | High | Q1 2025 |
  | 3.3 | Focus visible insufficient on some buttons (newsletter, language switcher) | High | Q1 2025 |
  | 7.5 | Dynamic content changes (banner cookies, panel) not announced via `aria-live` | Medium | Q2 2025 |
  | 11.9 | Attribute `autocomplete` missing on email/newsletter fields | Medium | Q1 2025 |
  | 12.8 | Order of language selector (mobile) to verify | Low | Q2 2025 |

  ## 5. Non-Compliant Content

  - Third-party content: platforms for sale (Lulu, Payhip, Google Play), embed social media
  - Archives (outdated versions of pages not maintained)
  - Downloadable PDF files (guides, excerpts) — *to make accessible if published*

  ## 6. Continuous Improvements

  - **Automated Testing** : `axe-core` in CI/CD (GitHub Actions)
  - **Manual Testing** : Keyboard navigation only, NVDA/VoiceOver, zoom 200/400%
  - **Training** : Team sensitized to RGAA/WCAG
  - **External Audit** : Pre-scheduled by certified expert

  ## 7. Triennial Accessibility Plan (2025-2027)

  | Year | Objectives |
  |------|-----------|
  | **2025** | Correct high non-conformities, complete audit, partial certification |
  | **2026** | Reach 100% RGAA 4.1 AA, accessibility PDF, user testing |
  | **2027** | Maintain compliance, integrate RGAA 5 / WCAG 2.2, mobile accessibility |  

  ## 8. Contact Accessibility / Reference

  If you encounter an accessibility issue, please report it:

  📧 **accessibilite@kikienchrist.com** (or **contact@kikienchrist.com**)  
  📮 **Kiki en Christ — [Address to be completed]**  
  ⏱ **Response Time:** Maximum 15 working days

  ## 9. Remedies

  If the problem is not resolved:
  - **Rights Protection** : https://www.defenseurdesdroits.fr/
  - **Accessibility Reference for Administration** : according to your organization

  ## 10. Accessibility Technologies Tested

  - **Screen Readers** : NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
  - **Browsers** : Firefox, Chrome, Safari, Edge (latest versions)
  - **Zoom** : 100%, 200%, 400% (text only / full page)
  - **Keyboard Only** : Tab, Shift+Tab, Enter, Escape, Arrow keys

  ---  
  *Last update: January 15, 2025 — Version 1.0*






