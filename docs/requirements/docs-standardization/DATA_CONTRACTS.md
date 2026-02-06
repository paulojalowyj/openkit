---
title: Docs Standardization - Data Contracts
created: 2026-02-06
timezone: UTC-3
---

# DATA_CONTRACTS

Este documento define contratos de nomeacao e caminhos para que o workflow do OpenKit continue funcionando apos a padronizacao.

## 1) Convencao de nomeacao (arquivos)

Regras (normativas):

- Extensao: sempre `.md`.
- 1 palavra: `MAIUSCULAS.md`.
- 2+ palavras: `UPPER_SNAKE_CASE.md`.
- Sem espacos, sem hifens, sem camelCase.

Exemplos:

- `README.md` (ok)
- `ACTION_ITEMS.md` (ok)
- `QUALITY_GATES.md` (ok)
- `quality-gates.md` (nao permitido)

## 2) Convencao de nomeacao (diretorios)

Regra proposta para evitar quebra de workflow:

- Diretorios estruturais permanecem como hoje (compat):
  - `docs/requirements/`
  - `docs/sprint/`
  - `docs/sprint/Sprint-XX/`
- Identificadores variaveis permanecem:
  - `<feature>` em `docs/requirements/<feature>/`: `kebab-case` (ex: `cli-upgrade`, `docs-standardization`).

Rationale: comandos e prompts assumem esses caminhos; mudar diretorios adiciona risco de quebra em massa.

## 3) Contrato canonico: Requirements

Local:

- `docs/requirements/<feature>/`

Arquivos canonicos (novos):

- `docs/requirements/<feature>/PROBLEM_STATEMENT.md`
- `docs/requirements/<feature>/USER_STORIES.md`
- `docs/requirements/<feature>/ACCEPTANCE_CRITERIA.md`
- `docs/requirements/<feature>/DATA_CONTRACTS.md`
- `docs/requirements/<feature>/RISKS.md`
- `docs/requirements/<feature>/PLAN.md`

Compatibilidade (durante migracao):

- Ate completar o sprint, pode existir o par legado em CamelCase (ex: `ProblemStatement.md`) apenas como etapa intermediaria.
- Ao final, o canonical e o novo formato (upper).

## 4) Contrato canonico: Sprint

Local:

- `docs/sprint/Sprint-XX/`

Arquivos canonicos (novos):

- `docs/sprint/Sprint-XX/SPRINT_GOAL.md`
- `docs/sprint/Sprint-XX/BACKLOG.md`
- `docs/sprint/Sprint-XX/TASKS.md`
- `docs/sprint/Sprint-XX/RISK_REGISTER.md`

## 5) Contrato canonico: Docs contextuais (por projeto)

Regra:

- Nao criar pastas/arquivos de documentacao que nao fazem sentido para o projeto.

Artefatos contextuais (criar apenas quando aplicavel):

- Frontend presente -> `docs/FRONTEND.md`
- Backend/API presente -> `docs/BACKEND.md` e/ou `docs/API.md`
- Banco de dados presente -> `docs/DATABASE.md`

Artefatos sempre presentes quando o workflow exigir (independente de stack):

- `docs/ACTION_ITEMS.md` (backlog de riscos/gaps)

Templates:

- Templates de docs contextuais vivem em `.opencode/templates/` e devem ser usados por `/context`.

## 6) Links relativos (Markdown)

Regras para evitar quebra em ambientes case-sensitive (GitHub, Linux CI):

- Sempre linkar usando o path canonico e capitalizacao exata.
- Preferir links relativos estaveis (a partir do arquivo atual), evitando caminhos "subir e descer" longos.
- Nao linkar para diretorios (ex: `docs/api/`); linkar para um arquivo canonical (ex: `docs/API.md`).

Padrao recomendado:

- Dentro de `docs/`: `./ARQUIVO.md` (mesma pasta) ou `./PASTA/ARQUIVO.md` (quando inevitavel).
- Fora de `docs/`: `docs/ARQUIVO.md`.

## 7) Impacto no workflow do OpenKit

Os seguintes componentes assumem caminhos/nomes e devem ser atualizados na implementacao:

- Commands (`.opencode/commands/*.md`): citam explicitamente os nomes de requirements e sprint.
- Rules (`.opencode/rules/*.md`), especialmente `.opencode/rules/MASTER.md`.
- Prompts (`.opencode/prompts/*.md`): listam artefatos esperados.
- Skills e templates (`.opencode/skills/**`, `.opencode/templates/**`): templates de plano/tarefas.
