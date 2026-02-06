---
title: Docs Standardization - Migration Plan
created: 2026-02-06
timezone: UTC-3
---

# PLAN (Docs Standardization)

## Project Type

META (framework repo maintenance): padronizacao de documentacao e ajustes no sistema de agentes/comandos.

## Success Criteria

- `docs/` segue padrao de nomeacao (`MAIUSCULAS.md` / `UPPER_SNAKE_CASE.md`).
- Requirements e sprints seguem contratos canonicos (ver `docs/requirements/docs-standardization/DATA_CONTRACTS.md`).
- Referencias em `.opencode/` e nos READMEs apontam para paths canonicos.
- Documentacao do OpenKit e contextual: artefatos opcionais (frontend/backend) so existem quando o projeto tiver esse contexto.
- Estrutura minima e templates existem para reutilizacao (geracao consistente).

## Definicao de "Essencial" (minimo)

Um doc e essencial quando:

- e ponto de entrada (index),
- e necessario para executar o workflow SDD (requirements/sprints + commands/rules),
- e uma referencia primaria (agents/skills/commands/workflow).

## Estrutura minima (docs/) - sempre presente

- `docs/README.md` (index)
- `docs/ARCHITECTURE.md`
- `docs/WORKFLOW.md`
- `docs/COMMANDS.md`
- `docs/AGENTS.md`
- `docs/SKILLS.md`
- `docs/EXTENDING.md`

Opcional (manter somente se for realmente usado): `docs/BLUEPRINTS.md`, `docs/CONTRIBUTING.md`, `docs/FAQ.md`.

## Docs contextuais (criar apenas quando aplicavel)

Esses docs sao gerados/atualizados por workflows como `/context` e so devem existir quando o projeto tiver o componente correspondente:

- Frontend: `docs/FRONTEND.md`
- Backend/API: `docs/BACKEND.md` e/ou `docs/API.md`
- Banco de dados: `docs/DATABASE.md`

Rationale: evitar pastas/arquivos vazios em projetos que nao tem FE/BE.

## Templates (reutilizacao)

Adicionar templates em `.opencode/templates/` para:

- requirements (ja existem: SDD-*) com paths canonicos atualizados
- sprint tasks (SDD-Tasks) com paths canonicos atualizados
- docs contextuais (novo): esqueletos de `FRONTEND.md`, `BACKEND.md`, `DATABASE.md`, `API.md`, `ACTION_ITEMS.md`

## Estrategia de migracao

1) Inventariar arquivos em `docs/` e referencias em `.opencode/`/READMEs.
2) Renomear artifacts de requirements/sprint para canonical upper (evitar case-only rename; usar nome temporario).
3) Atualizar referencias em rules/commands/prompts/skills/templates.
4) Enxugar docs "context pack" (subpastas) para o minimo e/ou converter em docs contextuais top-level.
5) Validar: grep por paths antigos e rodar `python .opencode/scripts/checklist.py .`.

## Rollback

- Fazer mudancas em etapas pequenas para permitir revert facil.
