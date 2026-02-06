---
title: Sprint 02 Risk Register
created: 2026-02-06
timezone: UTC-3
---

# Risk Register

| ID | Risk | Trigger | Mitigation | Owner |
|---|---|---|---|---|
| R-01 | Renome case-only falha em macOS | FS case-insensitive + git ignora mudanca | `git mv` em 2 passos com nome temporario; validar com `git status`. | Maintainer Docs |
| R-02 | Workflow OpenKit quebra | Commands/rules/prompt/template desatualizado | Atualizar sistematicamente `.opencode/` e rodar verificacao de referencias. | Maintainer Framework |
| R-03 | Links externos quebrados | Usuarios/bookmarks apontam para paths antigos | (Opcional) manter stubs de compat por 1 release, ou aceitar breaking change e documentar. | Maintainer Docs |
| R-04 | Perda de informacao na consolidacao | Remocao de subpastas sem incorporar conteudo | Mapeamento aprovado antes; commits pequenos; revisao manual do index. | Documentation Writer |
| R-05 | PR muito grande e conflituoso | Mudanca massiva de arquivos | Sprint isolado, etapas pequenas, ordenacao: renomes -> refs -> consolidacao -> validacao. | Maintainer |
