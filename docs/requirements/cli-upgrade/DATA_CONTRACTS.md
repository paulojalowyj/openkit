---
title: CLI Upgrade - Data Contracts
created: 2026-02-06
timezone: UTC-3
---

# Data Contracts

## Manifest de instalacao

Arquivo proposto: `.opencode/openkit.manifest.json`

Rationale:

- `init` hoje copia arquivos, mas nao registra um baseline.
- Para upgrade seguro, precisamos detectar se o usuario modificou um arquivo desde o ultimo `init/upgrade`.
- Hash de conteudo (sha256) e uma forma simples e cross-platform para detectar drift.

### Schema (proposta v1)

```json
{
  "schemaVersion": 1,
  "managedBy": "@paulojalowyj/openkit",
  "openkitVersion": "0.1.1",
  "installedAt": "2026-02-06T00:00:00-03:00",
  "projectRoot": ".",
  "managedPaths": [
    ".opencode",
    "opencode.json"
  ],
  "files": [
    {
      "path": ".opencode/rules/MASTER.md",
      "kind": "template",
      "baseSha256": "<sha256-of-template-content-at-install>",
      "lastAppliedOpenkitVersion": "0.1.1",
      "decision": {
        "strategy": "follow-template",
        "onConflict": "prompt",
        "remember": true
      }
    },
    {
      "path": "opencode.json",
      "kind": "root-config",
      "baseSha256": "<sha256-of-template-content-at-install>",
      "lastAppliedOpenkitVersion": "0.1.1",
      "decision": {
        "strategy": "follow-template",
        "onConflict": "prompt",
        "remember": true
      }
    }
  ],
  "history": [
    {
      "type": "init",
      "openkitVersion": "0.1.1",
      "timestamp": "2026-02-06T00:00:00-03:00"
    }
  ]
}
```

Notas:

- `files[].baseSha256` representa o conteudo base instalado (template) e e usado para detectar customizacao: `sha256(atual) != baseSha256`.
- `decision` permite evoluir para "nao perguntar de novo" em arquivos que o usuario sempre quer manter.
- `history` oferece trilha minima para debug.

### Regras de compatibilidade

- Se o manifest nao existir: `upgrade` entra em modo legacy.
  - Interativo: pode perguntar para overwrite/skip.
  - Nao-interativo: default nao sobrescrever arquivos existentes (apenas adicionar ausentes), a menos de flags explicitas.

## Output de upgrade (contrato de saida)

Mesmo sem JSON output, o upgrade deve sempre produzir um resumo consistente contendo contagens e paths.

Campos logicos (para testes):

- `added[]`, `updated[]`, `skipped[]`, `conflicts[]`, `orphaned[]`, `backupsDir` (quando aplicavel)
- `exitCode` condicionado por `--fail-on-changes` / erros.
