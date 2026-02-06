---
title: CLI Upgrade - User Stories
created: 2026-02-06
timezone: UTC-3
---

# User Stories

## Core

1. Como usuario do OpenKit, eu quero executar `openkit upgrade` para atualizar meus arquivos `.opencode/` para a versao mais recente do template do pacote, sem perder minhas customizacoes.
2. Como usuario que customizou regras/comandos/skills dentro de `.opencode/`, eu quero ser avisado arquivo-a-arquivo quando houver conflito e escolher sobrescrever ou pular.
3. Como usuario que nao customizou nada, eu quero que o upgrade seja silencioso e rapido.

## CI / Non-interactive

4. Como usuario rodando em CI (sem TTY), eu quero que `openkit upgrade` nao trave esperando prompt e use defaults seguros.
5. Como usuario rodando em CI, eu quero flags para falhar o job quando houver conflitos que exigiriam acao manual.

## Backward compatibility

6. Como usuario que instalou antes do manifest existir, eu quero que `openkit upgrade` funcione mesmo sem manifest, adotando um comportamento conservador e/orientado por flags.

## Observabilidade

7. Como usuario, eu quero um resumo final do que foi atualizado/adicionado/pulado/nao-gerenciado para eu revisar.
