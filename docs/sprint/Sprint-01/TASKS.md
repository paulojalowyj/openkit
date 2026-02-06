---
title: Sprint 01 Tasks
created: 2026-02-06
timezone: UTC-3
---

# Tasks

Regras:

- Cada tarefa deve ser verificavel.
- Tarefas pequenas (2-10 min), com rollback simples.
- Preferir logica pura + injecao de dependencias para facilitar testes.

## Status (2026-02-06)

- Implementacao core (init manifest + upgrade planner/applier + flags + CI defaults): concluida.
- Testes (`node --test`): concluido.
- Revisao de seguranca (path traversal / symlink / backups): concluida.
- Documentacao no README: concluida.
- Validacao final: automatizada concluida (`npm test` + `python .opencode/scripts/checklist.py .`); validacao manual do comando em um projeto real ainda pendente.

## Task Breakdown

### P0 - Foundation

- task_id: OK-UPG-001
  name: Definir contrato do manifest (v1)
  agent: project-planner
  skills: plan-writing, architecture
  priority: P0
  dependencies: []
  INPUT→OUTPUT→VERIFY: `docs/requirements/cli-upgrade/DATA_CONTRACTS.md` -> schema v1 + regras legacy -> revisar se cobre drift detection e decisoes.

- task_id: OK-UPG-002
  name: Extrair logica de hashing e file listing
  agent: backend-specialist
  skills: clean-code
  priority: P0
  dependencies: [OK-UPG-001]
  INPUT→OUTPUT→VERIFY: `docs/requirements/cli-upgrade/PLAN.md` -> funcs puras planejadas -> testes conseguem chamar sem I/O real.

### P0 - Init manifest

- task_id: OK-UPG-010
  name: Atualizar `init` para gerar manifest
  agent: backend-specialist
  skills: clean-code
  priority: P0
  dependencies: [OK-UPG-001]
  INPUT→OUTPUT→VERIFY: `bin/cli.js` + helper de manifest -> `openkit init` cria `.opencode/openkit.manifest.json` -> verificar em um temp project.

### P0 - Upgrade command

- task_id: OK-UPG-020
  name: Implementar planner de upgrade (dry-run first)
  agent: backend-specialist
  skills: clean-code
  priority: P0
  dependencies: [OK-UPG-002]
  INPUT→OUTPUT→VERIFY: template file list + manifest -> plano (add/update/conflict/orphan) -> testes unitarios validam contagens e paths.

- task_id: OK-UPG-021
  name: Implementar aplicacao de operacoes + backup
  agent: backend-specialist
  skills: clean-code
  priority: P0
  dependencies: [OK-UPG-020]
  INPUT→OUTPUT→VERIFY: plano -> escreve arquivos com backup -> simular falha (test) e confirmar backup criado.

- task_id: OK-UPG-022
  name: Resolver conflitos (TTY vs non-TTY)
  agent: backend-specialist
  skills: clean-code
  priority: P0
  dependencies: [OK-UPG-020]
  INPUT→OUTPUT→VERIFY: conflitos -> prompt em TTY; em non-TTY default skip; flags mudam comportamento -> testes cobrindo ambos.

- task_id: OK-UPG-023
  name: Wiring do comando `openkit upgrade` (flags + exit codes)
  agent: backend-specialist
  skills: clean-code
  priority: P0
  dependencies: [OK-UPG-021, OK-UPG-022]
  INPUT→OUTPUT→VERIFY: `bin/cli.js` -> `openkit upgrade --dry-run` imprime resumo; `--fail-on-changes` retorna code 2 com conflitos.

### P1 - Tests

- task_id: OK-UPG-030
  name: Adicionar harness de testes com `node:test`
  agent: test-engineer
  skills: testing-patterns
  priority: P1
  dependencies: [OK-UPG-020]
  INPUT→OUTPUT→VERIFY: `test/` + `package.json:scripts.test` atualizado -> `npm test` executa testes reais.

- task_id: OK-UPG-031
  name: Testar cenarios principais (manifest/legacy/non-interactive)
  agent: test-engineer
  skills: testing-patterns
  priority: P1
  dependencies: [OK-UPG-030, OK-UPG-021, OK-UPG-022]
  INPUT→OUTPUT→VERIFY: fixtures -> asserts para add/update/skip/orphan + exit codes -> rodar `npm test`.

### P1 - Docs

- task_id: OK-UPG-040
  name: Documentar `openkit upgrade` no README
  agent: documentation-writer
  skills: documentation-templates
  priority: P1
  dependencies: [OK-UPG-023]
  INPUT→OUTPUT→VERIFY: `README.md` e `README.pt-BR.md` -> exemplos de uso + flags CI -> leitura rapida valida entendimento.

### P1 - Security review

- task_id: OK-UPG-050
  name: Revisao de seguranca (paths, symlinks, backups)
  agent: security-auditor
  skills: vulnerability-scanner
  priority: P1
  dependencies: [OK-UPG-021]
  INPUT→OUTPUT→VERIFY: checklist de hardening -> validar que nao ha escrita fora do destino e que symlinks sao tratados.

### Phase X - Verification

- task_id: OK-UPG-090
  name: Validacao final (lint/tests/manual)
  agent: test-engineer
  skills: testing-patterns
  priority: P0
  dependencies: [OK-UPG-031]
  INPUT→OUTPUT→VERIFY: executar `npm test`; rodar `openkit upgrade` em um projeto real -> confirmar logs e backups.

## Dependency Graph (hard blockers)

- OK-UPG-001 -> OK-UPG-010
- OK-UPG-002 -> OK-UPG-020
- OK-UPG-020 -> OK-UPG-021 -> OK-UPG-023
- OK-UPG-020 -> OK-UPG-022 -> OK-UPG-023
- OK-UPG-023 -> OK-UPG-040
- OK-UPG-020 -> OK-UPG-030 -> OK-UPG-031 -> OK-UPG-090
