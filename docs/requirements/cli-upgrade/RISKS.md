---
title: CLI Upgrade - Risks
created: 2026-02-06
timezone: UTC-3
---

# RISKS (CLI Upgrade)

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| UPG-01 | Detectar customizacao errado (false positive/negative) | Sobrescrever customizacao ou bloquear upgrade | Manifest com `baseSha256` + algoritmo deterministico; default seguro em CI (skip) |
| UPG-02 | Escrita fora do projeto (path traversal/symlink) | Corrupcao/risco de seguranca | Normalizar paths, rejeitar `..`, tratar symlinks com cuidado, validar root |
| UPG-03 | Non-interactive trava por prompt | CI bloqueado | Proibir prompt quando `!isTTY`; usar flags e defaults documentados |
| UPG-04 | Backup incompleto | Perda de dados do usuario | Backup por arquivo antes de escrever/remover; escrever via temp+rename |
| UPG-05 | Drift de template nao rastreado | Upgrades inconsistentes | Registrar versao + `templateSha256` no manifest; atualizar sempre em init/upgrade |
