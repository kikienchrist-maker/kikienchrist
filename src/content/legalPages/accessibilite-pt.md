---
title: "Acessibilidade"
pageSlug: "accessibilite"
lang: "pt"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
requiredByLaw: true
jurisdiction: ["EU", "FR"]
---








title: "Acessibilidade"
pageSlug: "acessibilidade"
lang: "pt"
lastUpdated: "2025-01-15T00:00:00+01:00"
version: "1.0"
content: |
  # Acessibilidade: Declaração de Conformidade

  **Kiki en Christ** se compromete a tornar seu site acessível conforme ao **Artigo 47 da Lei n°2005-102** e ao **Referencial Geral de Melhoria da Acessibilidade (RGAA 4.1)** / **WCAG 2.1 nível AA**.

  ## 1. Estado de Conformidade

  **Site web** : https://kikienchrist.vercel.app/  
  **Data da última avaliação** : 15 de janeiro de 2025  
  **Nível visado** : **AA (RGAA 4.1 / WCAG 2.1)**  
  **Status** : **Em andamento — Conformidade parcial estimada ~85%**

  > Esta declaração será atualizada após o audit completo por um expert em acessibilidade.

  ## 2. Perímetro do Audit

  Páginas testadas (exemplo representativo) : 
  - Página de início (9 línguas)
  - Páginas livros (4 livros × 9 línguas)
  - Newsletter / FAQ / Contacto
  - Páginas legais (5 páginas × 9 línguas) — *esta página incluída*
  - Blog (artigos, categorias, tags, séries)
  - Banner de cookies (RGPD)

  Tecnologias : **Astro 4 (HTML estático)** · **CSS Vanilla (lafoidieu-design.css)** · **JS Vanilla (ES Modules)** · **Middleware Vercel Edge**

  ## 3. Resultados por critério (RGAA 4.1)

  | Tema | Critérios conformes / Total | Notas |
  |-------|---------------------------|-------|
  | **1. Imagens** | 8/9 | Textos alternativos presentes em todas as imagens de conteúdo. *A verificar: imagens decorativas `alt=""`* |
  | **2. Cadros** | 3/3 | Não existem iframes, frames |
  | **3. Cores** | 5/6 | Contraste ≥ 4.5:1 (texto) / 3:1 (UI). *A verificar: foco visível em todos os elementos* |
  | **4. Multimídia** | 4/4 | Não há vídeos/áudios auto-reproduzidos. Não há subtítulos requisitados (não há mídia nativa) |
  | **5. Tabelas** | 3/3 | Não há tabelas de dados complexos |
  | **6. Links** | 6/6 | Textos de link explicitos, não há "clique aqui", foco visível |
  | **7. Scripts** | 5/6 | JS acessível (ARIA, foco trap, Escape). *A verificar: mudanças de conteúdo anunciadas* |
  | **8. Elementos obrigatórios** | 8/9 | Língua, título, seções H1-H6, landmarks. *A verificar: link skip* |
  | **9. Estrutura** | 7/7 | HTML5 semântico, seções ordenadas, listas, landmarks |
  | **10. Présentação** | 6/7 | Responsivo, zoom 200% sem perda, não há conteúdo clignotante |
  | **11. Formulários** | 8/9 | Labels explicitos, agrupamento, mensagens de erro. *A verificar: autocomplete* |
  | **12. Navegação** | 7/8 | Menu de teclado, foco visível, ordem lógica. *A verificar: link skip* |
  | **13. Consulta** | 6/6 | Responsivo, orientação, redimensionamento de texto |

  **Total estimado** : **~77/91 critérios conformes (85%)**

  ## 4. Conflitos conhecidos e plano de ação

  | Critério | Conflito | Prioridade | Data |
  |---------|-------------|----------|----------|
  | 1.8 / 8.9 | **Link skip** (link de acesso rápido ao conteúdo principal) ausente | Alto | Q1 2025 |
  | 3.3 | Foco visível insuficiente em alguns botões (newsletter, switcher de idiomas) | Alto | Q1 2025 |
  | 7.5 | Mudanças de conteúdo dinâmicas (banner de cookies, panel) não anunciadas via `aria-live` | Média | Q2 2025 |
  | 11.9 | Atributo `autocomplete` ausente em campos de email/newsletter | Média | Q1 2025 |
  | 12.8 | Ordem de seleção do idioma (mobile) a verificar | Baixa | Q2 2025 |

  ## 5. Conteúdos não obrigatórios à acessibilidade

  - Conteúdos externos : plataformas de venda (Lulu, Payhip, Google Play), redes sociais embed
  - Arquivos PDF descarregáveis (guias, extractos) — *a tornar acessíveis se publicados*

  ## 6. Ameliorações continuas

  - **Testes automatizados** : `axe-core` na CI/CD (GitHub Actions)
  - **Testes manuais** : Navegação teclado única, NVDA/VoiceOver, zoom 200/400%
  - **Formação** : Equipe sensibilizada RGAA/WCAG
  - **Audit externo** : Programado anualmente por expert certificado

  ## 7. Plano anual de acessibilidade (2025-2027)

  | Ano | Objetivos |
  |-------|-----------|
  | **2025** | Corrigir conflitos altos, audit completo, certificação parcial |
  | **2026** | Atingir 100% RGAA 4.1 AA, acessibilidade PDF, testes de usuários com deficiência |
  | **2027** | Manter conformidade, integrar RGAA 5 / WCAG 2.2, acessibilidade aplicada mobile |

  ## 8. Contato para acessibilidade / Referência

  Você encontrou um problema de acessibilidade? Informe-o :

  📧 **accessibilite@kikienchrist.com** (ou **contato@kikienchrist.com**)  
  📮 **Kiki en Christ — [Endereço postal a preencher]**  
  ⏱ **Duração de resposta** : 15 dias úteis máximo

  ## 9. Portas de recurso

  Se o problema não for resolvido : 
  - **Defensor dos direitos** : https://www.defenseurdesdroits.fr/
  - **Referente à acessibilidade da administração** : conforme sua organização

  ## 10. Tecnologias de assistência testadas

  - **Lectores de tela** : NVDA (Windows), VoiceOver (macOS/iOS), TalkBack (Android)
  - **Navegadores** : Firefox, Chrome, Safari, Edge (versões mais recentes)
  - **Zoom** : 100%, 200%, 400% (texto único / página completa)
  - **Teclado único** : Tab, Shift+Tab, Enter, Escape, Flèches

  ---
  *Última atualização : 15 de janeiro de 2025 — Versão 1.0*
requiredByLaw: true
jurisdiction: ["UE", "FR"]
---
```

"
requiredByLaw: undefined
jurisdiction: undefined
---









