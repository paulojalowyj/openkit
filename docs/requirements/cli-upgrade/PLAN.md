---
title: CLI Upgrade - Plan
created: 2026-02-06
timezone: UTC-3
---

# PLAN (CLI Upgrade)

## Project Type

BACKEND (CLI tooling): pacote Node.js que manipula arquivos locais e faz prompts no terminal.

## Success Criteria

- `openkit upgrade` atualiza a instalacao do OpenKit em um projeto sem destruir customizacoes.
- Modo nao-interativo (CI) e seguro por default e nao trava.
- Manifest existe apos `init` e e usado para drift detection.
- Testes cobrem o planner/aplicador e os casos de conflito.

## Tech Stack (existente)

- Node >= 18 (evidencia: `package.json:engines.node`).
- CLI: `commander`, `inquirer`, `chalk`, `fs-extra`, `glob` (evidencia: `package.json`).
- ESM (`"type": "module"`) (evidencia: `package.json`).

## File Structure (mudancas planejadas)

- `bin/cli.js`: adicionar comando `upgrade` e reaproveitar helpers.
- `bin/lib/` (novo, opcional): extrair logica de manifest + hashing + planejamento/aplicacao de operacoes para facilitar testes.
- `.opencode/openkit.manifest.json` (arquivo gerado no projeto do usuario).
- `test/` (novo): testes com `node:test` focados na logica do upgrade.

## Command Design

### `openkit upgrade`

Objetivo: atualizar `.opencode/` e (se aplicavel) `opencode.json` no projeto atual (`process.cwd()`).

Flags propostas:

- `--dry-run`: calcula plano e imprime resumo sem escrever.
- `--yes`: assume defaults no prompt (apenas em TTY). Em conflitos, default recomendado: `skip`.
- `--force`: reinstala `.opencode/` inteira (com backup) e sobrescreve `opencode.json`.
- `--overwrite-changed`: em non-interactive, permite sobrescrever arquivos customizados (sempre com backup).
- `--fail-on-changes`: em non-interactive, retorna exit code != 0 se houver qualquer conflito/customizacao detectada.
- `--prune`: remove arquivos que nao existem mais no template (default: manter e reportar).
- `--manifest-path <path>`: override para testes/edge cases (default: `.opencode/openkit.manifest.json`).

Exit codes (proposta):

- `0`: sucesso (inclui "conflitos pulados" se `--fail-on-changes` nao estiver ativo).
- `2`: conflitos detectados e `--fail-on-changes` ativo.
- `1`: erro inesperado (I/O, permissao, parse de manifest).

## Upgrade Algorithm

### Inputs

- `templateDir`: `path.join(__dirname, '..', '.opencode')` + `opencode.json` (evidencia: `bin/cli.js`).
- `projectDir`: `process.cwd()`.
- `manifestPath`: `<projectDir>/.opencode/openkit.manifest.json`.

### Step 0: Preflight

- Detectar TTY: `process.stdin.isTTY`.
- Validar que `<projectDir>/.opencode` existe; se nao existe, falhar com mensagem clara pedindo `openkit init`.
- Carregar manifest:
  - Se existe: parse JSON, validar `schemaVersion`.
  - Se nao existe: modo legacy.

### Step 1: Enumerar arquivos do template

- Listar todos os arquivos (nodir) sob `.opencode` do pacote.
- Adicionar item especial para `opencode.json` (na raiz do projeto) se ele for gerenciado.
- Normalizar paths com `/` e garantir que sao relativos (sem `..`).

### Step 2: Planejar operacoes

Para cada arquivo do template (path relativo):

1. Calcular `templateSha = sha256(conteudo_template)`.
2. Se arquivo nao existe no projeto: `ADD`.
3. Se arquivo existe:
   - Se existe manifest e ha `baseSha` para o path:
     - `currentSha = sha256(conteudo_atual)`.
     - Se `currentSha == baseSha`: `UPDATE_SILENT`.
     - Se `currentSha != baseSha`: `CONFLICT`.
   - Se nao ha manifest (legacy) ou nao ha entrada:
     - `CONFLICT_LEGACY`.

Arquivos que estao no manifest mas nao estao na lista do template atual:

- Marcar como `ORPHANED` (default keep).

### Step 3: Resolver conflitos

Interativo (TTY):

- Para cada `CONFLICT`/`CONFLICT_LEGACY`, prompt overwrite/skip (opcional overwrite-all/skip-all).
- Registrar a decisao no manifest (ex: `decision.strategy`).

Nao-interativo:

- Default: `skip` em qualquer conflito.
- Se `--overwrite-changed`: tratar conflitos como overwrite.
- Se `--fail-on-changes`: retornar exit code 2 se existir qualquer conflito (mesmo que skip).

### Step 4: Aplicar operacoes (com rollback)

- Se houver qualquer overwrite/remocao: criar `backupsDir` unico.
- Para cada operacao que modifica:
  - Copiar arquivo atual para backup.
  - Escrever novo conteudo (ideal: temp + rename).
- Para `--prune`: remover orphaned (com backup).

### Step 5: Atualizar manifest

- Para cada arquivo realmente aplicado: atualizar `baseSha256` para o hash do conteudo instalado.
- Para cada arquivo skip: manter `baseSha256` anterior e registrar a decisao.
- Registrar entrada em `history` com timestamp + versao.

## Changes to `init`

Atualizar `openkit init` para:

- Ao final da copia de `.opencode/` e (quando aplicado) `opencode.json`, gerar o manifest com o baseline do template instalado.
- Se `--force`: gerar um manifest novo correspondente ao estado recem-instalado.

## Testing Strategy

- Framework: `node:test`.
- Separar planner (puro) de resolver de prompt (injeção de dependencia) para testes.

Casos minimos:

- Sem manifest (legacy): non-interactive add-only; interactive prompts.
- Com manifest: update silencioso de arquivo inalterado.
- Conflito detectado: overwrite/skip.
- `--dry-run` nao escreve.
- Orphaned detectado e reportado; `--prune` remove com backup.

## Rollback Plan

- Sempre criar backup antes de overwrite/remocao.
- Em falha parcial: reportar `backupsDir` e instruir restauracao manual.
