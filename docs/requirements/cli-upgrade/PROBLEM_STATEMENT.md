---
title: CLI Upgrade - Problem Statement
created: 2026-02-06
timezone: UTC-3
---

# Problem Statement

Hoje o `@paulojalowyj/openkit` instala o template do OpenKit no projeto do usuario via `openkit init`, copiando `.opencode/` e (opcionalmente) `opencode.json` (ver `bin/cli.js`).

Problema:

- Nao existe um mecanismo oficial de upgrade para atualizar a instalacao quando o pacote evolui (novos agentes/skills/regras/scripts).
- O caminho atual para atualizar e rodar `init --force`, que remove e recria `.opencode/` e pode sobrescrever `opencode.json`.
- Isso cria risco alto de destruir customizacoes do usuario e tambem torna dificil rodar upgrades de forma segura em CI (sem TTY).

Objetivo:

Introduzir `openkit upgrade` para atualizar `.opencode/` (e possivelmente `opencode.json`) no projeto do usuario com deteccao de drift e prompts por arquivo customizado, similar ao fluxo do shadcn/ui.

Constraints:

- Node >= 18 (ver `package.json:engines.node`).
- Precisa ser seguro por default em modo nao-interativo.
- Precisa ser compatível com instalacoes existentes sem manifest (usuarios que ja rodaram `init`).
