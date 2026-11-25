---
title: 'Acessibilidade'
description: 'Declaração de acessibilidade RGAA / WCAG 2.1 AA para o site Kiki en Christ.'
pageSlug: 'accessibilite'
lang: 'pt'
translationKey: 'accessibilite'
lastUpdated: '2026-11-24'
---

# Acessibilidade

## Declaração de conformidade

Kiki en Christ se compromete a tornar seu site acessível conforme ao **RGAA 4.1** (Referencial Geral de Acessibilidade) e ao **WCAG 2.1 nível AA**.

## Estado de conformidade

**Conformidade parcial** — Audit final: janeiro de 2025

### Críticas respeitadas (exemplos)

- ✅ Estrutura semântica HTML5 (header, main, nav, footer, section, article)
- ✅ Hierarquia dos títulos (h1-h6) coerente
- ✅ Contraste de cores ≥ 4.5:1 (texto) / 3:1 (UI)
- ✅ Navegação por teclado completa (focus visível, ordem lógica)
- ✅ Links de evitação (Link Skip) para o conteúdo principal
- ✅ Atributos `alt` em todas as imagens informativas
- ✅ Formulários: labels explicativos, mensagens de erro acessíveis
- ✅ Idioma da página (`lang`) e mudanças de idioma (`lang` em elementos)
- ✅ ARIA: combobox para seleção de idioma, `aria-expanded`, `aria-controls`
- ✅ Responsividade: mobile-first, zoom até 200% sem perda de conteúdo
- ✅ Não conteúdo que vibra, não movimento automático não controlável

### Ponto de melhoria conhecido

- ⚠️ PDFs (ebooks) não marcados — trabalho em andamento
- ⚠️ Vídeos YouTube incorporados: subtítulos não garantidos
- ⚠️ Audits de usuários com deficiência ainda não realizados

## Funções de acessibilidade

### Raccourcis clavier

| Tecla             | Ação                                      |
| ----------------- | ----------------------------------------- |
| `Tab`             | Navegar entre elementos focáveis          |
| `Shift+Tab`       | Navegação inversa                         |
| `Enter` / `Space` | Ativar botões, links                      |
| `Esc`             | Fechar modais, dropdowns, menu mobile     |
| `Alt+L`           | Ir ao seletor de idioma (se implementado) |

### Zoom e visualização

- Zoom do navegador até 200%: conteúdo lido, não houve borda horizontal
- Fonte sistema redimensionável (unidades rem/em)
- Modo escuro/claro respeitado (`prefers-color-scheme`)

### Leitores de tela

Testado com: NVDA (Windows), VoiceOver (macOS/iOS), Orca (Linux)

- Anúncios corretos dos títulos, landmarks, estados (expandido/collapsado)
- Idioma anúnciado corretamente por página

## Informar um problema

Você encontra dificuldades de acessibilidade? Entre em contato conosco:

- **Email** : contato@kikienchrist.com (assunto: "Acessibilidade")
- **Formulário** : [Página de Contato](/pt/contacto/)

Nos comprometemos a responder em até 48 horas e corrigir em até 30 dias.

## Referências

- [RGAA 4.1](https://acessibilidade.numerique.gouv.br/metodologia/rgaa/)
- [WCAG 2.1](https://www.w3.org/WAI/WCAG21/quickref/)
- [Guia de Testes do RGAA](https://acessibilidade.numerique.gouv.br/outros/)

## História

| Data       | Versão | Notas                                                    |
| ---------- | ------ | -------------------------------------------------------- |
| 15/01/2025 | 1.0    | Declaração inicial, audit automático (axe-core) + manual |
