---
title: Sprint 01 Risk Register
created: 2026-02-06
timezone: UTC-3
---

# Risk Register

| ID | Risk | Trigger | Mitigation | Owner |
|---|---|---|---|---|
| R-01 | Overwrite indevido em CI | Non-tty + flags mal definidas | Default skip + `--fail-on-changes` + backups | Maintainer CLI |
| R-02 | UX com prompts excessivos | Muitos arquivos customizados | Overwrite-all/skip-all + lembrar decisoes no manifest | Maintainer CLI |
| R-03 | Legacy installs sem manifest | Usuarios antigos | Modo legacy conservador + doc clara | Maintainer CLI |
| R-04 | Corrupcao parcial | Falha no meio da escrita | Backup + escrita atomica | Maintainer CLI |
| R-05 | Symlink/path traversal | Projeto com symlinks maliciosos | Nao seguir symlinks + validar paths relativos | Security Auditor |
