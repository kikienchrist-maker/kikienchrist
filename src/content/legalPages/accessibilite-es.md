---
title: "Accesibilidad"
pageSlug: "accessibilite"
lang: "es"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---







---
# Accesibilidad

**Kiki en Cristo** se compromete a hacer su sitio web accesible conforme al **Articulo 47 de la Ley N°2005-102** y al **Referencial General de Mejoramiento de la Accesibilidad (RGAA 4.1)** / **WCAG 2.1 nivel AA**.

## 1. Estado de Conformidad

**Sitio web** : https://kikienchrist.vercel.app/  
**Fecha de última evaluación** : 15 de enero de 2025  
**Nivel visado** : **AA (RGAA 4.1 / WCAG 2.1)**  
**Estado** : **En curso de auditoría — Conformidad parcial estimada ~85%**

> Esta declaración será actualizada después de la auditoría completa por un experto en accesibilidad.

## 2. Perímetro de la auditoría

**Páginas evaluadas (ejemplo representativo) :**  
- Página de inicio (9 idiomas)  
- Páginas de libros (4 libros × 9 idiomas)  
- Newsletter / FAQ / Contacto  
- Páginas legales (5 páginas × 9 idiomas) — *esta página incluida*  
- Blog (artículos, categorías, tags, series)  
- Bannière de cookies (RGPD)

**Tecnologías :**  
- **Astro 4 (HTML estático)**  
- **CSS Vanilla (lafoidieu-design.css)**  
- **JS Vanilla (ES Modules)**  
- **Middleware Vercel Edge**

## 3. Resultados por criterio (RGAA 4.1)

| Tema | Críticas conformes / Total | Notas |
|-------|---------------------------|-------|
| **1. Imágenes** | 8/9 | Textos alternativos presentes en todas las imágenes de contenido. *A verificar: imágenes decorativas `alt=""`* |
| **2. Cadrones** | 3/3 | No hay iframes ni frames |
| **3. Colores** | 5/6 | Contraste ≥ 4.5:1 (texto) / 3:1 (UI). *A verificar: foco visible en todos los elementos* |
| **4. Multimédia** | 4/4 | No hay video/audio auto. No requiere subtítulos (no hay medios nativos) |
| **5. Tablas** | 3/3 | No hay tablas de datos complejos |
| **6. Enlaces** | 6/6 | Textos de enlace explícitos, no hay "cliquez aquí" y foco visible |
| **7. Scripts** | 5/6 | JS accesible (ARIA, foco trap, Escape). *A verificar: cambios de contenido anunciados* |
| **8. Elementos obligatorios** | 8/9 | Idioma, título, estructura H1-H6, landmarks. *A verificar: link skip* |
| **9. Estructura** | 7/7 | HTML5 semántico, headings ordenados, listas, landmarks |
| **10. Presentación** | 6/7 | Responsivo, zoom 200% sin pérdida, no hay contenido que vibre |
| **11. Formularios** | 8/9 | Labels explícitos, agrupación, mensajes de error. *A verificar: autocomplete* |
| **12. Navegación** | 7/8 | Menú por teclado, foco visible, orden logico. *A verificar: link skip* |
| **13. Consulta** | 6/6 | Responsivo, orientación, redimensionamiento de texto |

**Total estimado** : **~77/91 críticas conformes (85%)**

## 4. Non-conformidades conocidas y plan de acción

| Crítico | Non-conformidad | Prioridad | Echéance |
|---------|----------------|----------|----------|
| 1.8 / 8.9 | **Link skip** (enlace rápido al contenido principal) faltante | Alta | Q1 2025 |
| 3.3 | Foco visible insuficiente en algunos botones (newsletter, switchero de idiomas) | Alta | Q1 2025 |
| 7.5 | Cambios de contenido dinámicos (bannière cookies, panel) no anunciados mediante `aria-live` | Media | Q2 2025 |
| 11.9 | Atributo `autocomplete` faltante en campos de email/newsletter | Media | Q1 2025 |
| 12.8 | Orden de tabulación del selector de idioma (mobile) a verificar | Baja | Q2 2025 |

## 5. Contenidos no obligados a la accesibilidad

- Contenido externo : plataformas de venta (Lulu, Payhip, Google Play), redes sociales embed
- Archivos PDF descargables (guías, extractos) — *a rendir accesible si publicados*

## 6. Ampliaciones continuas

- **Pruebas automatizadas** : `axe-core` en CI/CD (GitHub Actions)
- **Pruebas manuales** : Navegador por teclado solo, NVDA/VoiceOver, zoom 200/400%
- **Formación** : Equipo sensibilizado RGAA/WCAG
- **Auditoría externa** : Previsión anual por experto certificado

## 7. Pliego anual de accesibilidad (2025-2027)

| Año | Objetivos |
|-------|-----------|
| **2025** | Corregir non-conformidades altas, auditoría completa, certificación parcial |
| **2026** | Atteñer 100% RGAA 4.1 AA, accesibilidad PDF, pruebas de usuarios con discapacidad |
| **2027** | Mantener conformidad, integrar RGAA 5 / WCAG 2.2, accesibilidad app móvil |

## 8. Contacto accesibilidad / référent

Vous rencontrez une difficulté d'accès ? Signalez-la : 

- 📧 **accessibilite@kikienchrist.com** (ou contact@kikienchrist.com)  
- 📮 **Kiki en Cristo — [Adresse postale à compléter]**  
- ⏱ **Délai de réponse** : 15 jours ouvrés maximum

## 9. Voies de recours

Si le problème n'est pas résolu :
- **Défenseur des droits** : https://www.defenseurdesdroits.fr/
- **Référent accessibilité administration** : selon votre organisation

## 10. Technologies d'assistance testées

- **Lecteurs d'écran** : NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
- **Navigateurs** : Firefox, Chrome, Safari, Edge (dernières versions)
- **Zoom** : 100%, 200%, 400% (texte solo / page complète)
- **Clavier solo** : Tab, Shift+Tab, Enter, Escape, Flèches






