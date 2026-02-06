---
title: Sprint 02 Tasks
created: 2026-02-06
timezone: UTC-3
---

# Tasks

Regras:

- Cada tarefa deve ser verificavel.
- Tarefas pequenas (2-10 min), com rollback simples.
- Renomes devem evitar case-only rename em macOS (usar nome temporario).

## Task Breakdown

### P0 - Foundation (inventario + decisoes)

- task_id: OK-DOCS-001
  name: Inventariar arquivos e referencias em docs
  agent: explorer-agent
  skills: architecture
  priority: P0
  dependencies: []
  INPUT→OUTPUT→VERIFY: tree atual de `docs/` + grep de referencias -> lista de arquivos-alvo + lista de refs por arquivo -> revisar se inclui: `README.md`, `README.pt-BR.md`, `.opencode/commands/`, `.opencode/rules/`, `.opencode/prompts/`, `.opencode/skills/`, `.opencode/templates/`.

- task_id: OK-DOCS-002
  name: Fechar decisoes do conjunto minimo e docs contextuais
  agent: product-owner
  skills: plan-writing
  priority: P0
  dependencies: [OK-DOCS-001]
  INPUT→OUTPUT→VERIFY: inventario -> lista final de docs essenciais + quais docs sao contextuais (FRONTEND/BACKEND/DATABASE/API) -> aprovado em `docs/requirements/docs-standardization/PLAN.md`.

- task_id: OK-DOCS-003
  name: Atualizar contratos canonicos (requirements/sprint/context)
  agent: project-planner
  skills: plan-writing
  priority: P0
  dependencies: [OK-DOCS-002]
  INPUT→OUTPUT→VERIFY: `docs/requirements/docs-standardization/DATA_CONTRACTS.md` -> paths canonicos finalizados (upper) + regra contextual (nao criar artefatos nao aplicaveis).

### P0 - Renomes (docs/requirements + docs/sprint)

- task_id: OK-DOCS-010
  name: Renomear requirements existentes para canonical upper
  agent: documentation-writer
  skills: documentation-templates
  priority: P0
  dependencies: [OK-DOCS-003]
  INPUT→OUTPUT→VERIFY: `docs/requirements/*` -> arquivos canonicos `*_STATEMENT.md`, etc -> grep nao encontra nomes antigos.

- task_id: OK-DOCS-011
  name: Renomear sprints existentes para canonical upper
  agent: documentation-writer
  skills: documentation-templates
  priority: P0
  dependencies: [OK-DOCS-003]
  INPUT→OUTPUT→VERIFY: `docs/sprint/Sprint-*/` -> `SPRINT_GOAL.md`, `BACKLOG.md`, `TASKS.md`, `RISK_REGISTER.md`.

- task_id: OK-DOCS-012
  name: Padronizar nomes de arquivos auxiliares em docs
  agent: documentation-writer
  skills: documentation-templates
  priority: P0
  dependencies: [OK-DOCS-002]
  INPUT→OUTPUT→VERIFY: `docs/ACTION_ITEMS.md` e demais -> nomes canonicos -> grep confirma ausencia do path antigo.

### P1 - Atualizar referencias (workflow OpenKit)

- task_id: OK-DOCS-020
  name: Atualizar READMEs da raiz para links canonicos
  agent: documentation-writer
  skills: documentation-templates
  priority: P1
  dependencies: [OK-DOCS-010, OK-DOCS-011, OK-DOCS-012]
  INPUT→OUTPUT→VERIFY: `README.md`, `README.pt-BR.md` -> links para `docs/` apontam para nomes finais.

- task_id: OK-DOCS-021
  name: Atualizar rules para novos paths
  agent: project-planner
  skills: plan-writing
  priority: P1
  dependencies: [OK-DOCS-010, OK-DOCS-011, OK-DOCS-012]
  INPUT→OUTPUT→VERIFY: `.opencode/rules/MASTER.md` -> paths canonicos (upper) -> grep nao encontra nomes antigos.

- task_id: OK-DOCS-022
  name: Atualizar commands para novos paths e docs contextuais
  agent: project-planner
  skills: plan-writing
  priority: P1
  dependencies: [OK-DOCS-021]
  INPUT→OUTPUT→VERIFY: `.opencode/commands/*.md` -> requirements/sprint em upper + `/context` gera docs contextuais apenas quando aplicavel.

- task_id: OK-DOCS-023
  name: Atualizar prompts para novos paths
  agent: project-planner
  skills: plan-writing
  priority: P1
  dependencies: [OK-DOCS-021]
  INPUT→OUTPUT→VERIFY: `.opencode/prompts/*.md` -> lista de artefatos atualizada.

- task_id: OK-DOCS-024
  name: Atualizar skills/templates para novo padrao
  agent: documentation-writer
  skills: documentation-templates
  priority: P1
  dependencies: [OK-DOCS-022, OK-DOCS-023]
  INPUT→OUTPUT→VERIFY: `.opencode/skills/**/SKILL.md` + `.opencode/templates/**` -> paths canonicos + novos templates de docs contextuais.

### P1 - Enxugamento (consolidar docs de contexto)

- task_id: OK-DOCS-030
  name: Remover pastas contextuais nao aplicaveis neste repo
  agent: documentation-writer
  skills: documentation-templates
  priority: P1
  dependencies: [OK-DOCS-012]
  INPUT→OUTPUT→VERIFY: `docs/frontend/`, `docs/backend/`, `docs/api/`, `docs/security/`, `docs/development/`, `docs/architecture/` -> consolidado ou removido -> `docs/` fica navegavel.

### Phase X - Verification

- task_id: OK-DOCS-090
  name: Validar ausencia de referencias antigas e links
  agent: test-engineer
  skills: testing-patterns
  priority: P0
  dependencies: [OK-DOCS-020, OK-DOCS-024, OK-DOCS-030]
  INPUT→OUTPUT→VERIFY: grep por nomes antigos (`ProblemStatement.md`, `Tasks.md`, `Action_Items.md`, etc.) -> zero matches; executar `python .opencode/scripts/checklist.py .`.
