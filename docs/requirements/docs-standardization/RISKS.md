---
title: Docs Standardization - Risks
created: 2026-02-06
timezone: UTC-3
---

# RISKS (Docs Standardization)

| ID | Risk | Impact | Mitigation |
|---|---|---|---|
| DOC-01 | FS case-insensitive (macOS) nao aplica rename por case | Arquivos somem/ficam com nome errado | Evitar case-only rename; usar rename com sufixo temporario |
| DOC-02 | Referencias a paths antigos ficam no repo | Workflows quebram (SDD gate, /impl) | Atualizacao sistematica + grep de validacao |
| DOC-03 | Consolidacao remove informacao util | Perda de conhecimento | Mapeamento aprovado + mover conteudo antes de apagar |
| DOC-04 | Templates divergentes do padrao | Regressoes futuras | Centralizar skeleton em `.opencode/templates/` e referenciar por commands |
