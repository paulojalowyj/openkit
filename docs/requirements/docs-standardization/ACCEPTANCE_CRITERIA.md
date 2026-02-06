---
title: Docs Standardization - Acceptance Criteria
created: 2026-02-06
timezone: UTC-3
---

# Acceptance Criteria

## Naming

- Todos os arquivos Markdown em `docs/` seguem `MAIUSCULAS.md`.
- Quando o nome tiver mais de uma palavra, ele segue `UPPER_SNAKE_CASE.md`.

## Requirements e Sprint (workflow do OpenKit)

- Requirements de uma feature existem em `docs/requirements/<feature>/` com nomes canonicos definidos em `DATA_CONTRACTS.md`.
- Artefatos de sprint existem em `docs/sprint/Sprint-XX/` com nomes canonicos definidos em `DATA_CONTRACTS.md`.
- Todos os comandos/rules/prompts/templates que referenciam requirements/sprint apontam para os nomes canonicos.

## Enxugamento sem quebra

- Existe uma definicao explicita de "essencial" e um conjunto minimo de docs recomendado.
- Documentos fora do conjunto minimo sao removidos ou condensados para o conjunto minimo, sem perder informacao critica de uso.

## Referencias e links

- Root `README.md` e `README.pt-BR.md` nao contem links quebrados para `docs/`.
- `.opencode/commands/`, `.opencode/rules/`, `.opencode/prompts/`, `.opencode/skills/` e `.opencode/templates/` nao referenciam caminhos antigos.

## Plataforma e compatibilidade

- O plano contempla renomes case-only (macOS default case-insensitive) sem risco de o Git ignorar a mudanca.
