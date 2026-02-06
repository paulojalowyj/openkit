---
title: Docs Standardization - Problem Statement
created: 2026-02-06
timezone: UTC-3
---

# Problem Statement

O diretorio `docs/` hoje mistura:

- nomes de arquivos inconsistentes (camelCase, lowercase, hifen, etc.),
- subpastas novas sem padrao (`docs/development/`, `docs/security/`, `docs/frontend/`, ...),
- referencias hardcoded em comandos/rules/prompts/templates.

Isso cria problemas recorrentes:

- links quebram com renomes (especialmente ao subir para ambientes case-sensitive),
- manutencao vira uma tarefa manual (duplicacao e docs fora do index),
- workflows do OpenKit (/context, /plan, /impl, /engineer) podem falhar ao procurar arquivos.

Novo escopo:

- Padronizar nomes de arquivos de documentacao para `MAIUSCULAS.md`.
- Para nomes com mais de uma palavra: `UPPER_SNAKE_CASE.md`.
- Enxugar `docs/` para o essencial, sem quebrar o workflow do OpenKit.
- Atualizar referencias e templates relacionados (principalmente `.opencode/`).

Nao faz parte desta fase (planning): renomear arquivos de fato.
