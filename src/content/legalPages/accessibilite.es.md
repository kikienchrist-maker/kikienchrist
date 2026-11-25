---
title: 'Accesibilidad'
description: 'Declaración de accesibilidad RGAA / WCAG 2.1 AA para el sitio web Kiki en Christ.'
pageSlug: 'accessibilite'
lang: 'es'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Accesibilidad

## Afirmación de conformidad

Kiki en Christ se compromete a hacer su sitio accesible conforme al **RGAA 4.1** (Referente General de Mejora de la Accesibilidad) y al **WCAG 2.1 nivel AA**.

## Estado de conformidad

**Conformidad parcial** — Último audit: enero 2025

### Críticas respetadas (ejemplo)

- ✅ Sintaxis semántica HTML5 (header, main, nav, footer, section, article)
- ✅ Hierarquía de títulos (h1-h6) coherente
- ✅ Contraste de colores ≥ 4.5:1 (texto) / 3:1 (UI)
- ✅ Navegación clavista completa (se visible el foco, orden lógico)
- ✅ Enlaces de evitamiento (Link Skip) hacia el contenido principal
- ✅ Atributos `alt` en todas las imágenes informativas
- ✅ Formularios: etiquetas explicativas, mensajes de error accesibles
- ✅ Idioma de la página (`lang`) y cambios de idioma (`lang` en elementos)
- ✅ ARIA: combobox para seleccionador de idioma, `aria-expanded`, `aria-controls`
- ✅ Responsivo: móvil-first, zoom hasta 200% sin pérdida de contenido
- ✅ No contenido que clina, no movimiento automático no controlado

### Puntos de mejora conocidos

- ⚠️ PDFs (ebooks) no etiquetados — trabajo en curso
- ⚠️ Videos YouTube incorporados: subtítulos no garantizados
- ⚠️ Audits de usuarios con discapacidades no aún realizados

## Funcionalidades de accesibilidad

### Raccourcis clavistas

| Tecla             | Acción                                     |
| ----------------- | ------------------------------------------ |
| `Tab`             | Navegar entre elementos focables           |
| `Shift+Tab`       | Navegar inversa                            |
| `Enter` / `Space` | Activar botones, enlaces                   |
| `Esc`             | Cerrar modales, dropdowns, menú móvil      |
| `Alt+L`           | Ir al selector de idioma (si implementado) |

### Zoom y visualización

- Zoom navegador hasta 200%: contenido legible, sin desbordamiento horizontal
- Sistema de fuentes redimensionable (units rem/em)
- Modo oscuro/claro respetado (`prefers-color-scheme`)

### Lectores de pantalla

Prueba con: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Anuncian correctamente los títulos, landmarks, estados (expanded/collapsed)
- Idioma anunciado correctamente por página

## Informar un problema

Si encuentras una dificultad de accesibilidad, contacta con nosotros:

- **Correo electrónico** : contacto@kikienchrist.com (asunto: "Accesibilidad")
- **Formulario** : [Página de Contacto](/es/contacto/)

Nos comprometemos a responder en 48 horas y corregir en 30 días.

## Referencias

- [RGAA 4.1](https://accesibilidad.numerico.gob.es/método/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Guía de pruebas RGAA](https://accesibilidad.numerico.gob.es/otros/)

## Historial

| Fecha      | Versión | Notas                                                    |
| ---------- | ------- | -------------------------------------------------------- |
| 15/01/2025 | 1.0     | Afirmación inicial, audit automático (axe-core) + manual |
