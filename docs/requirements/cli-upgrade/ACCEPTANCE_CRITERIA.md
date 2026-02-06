---
title: CLI Upgrade - Acceptance Criteria
created: 2026-02-06
timezone: UTC-3
---

# Acceptance Criteria

## Comportamento base

GIVEN um projeto com `.opencode/` instalado
WHEN eu rodo `openkit upgrade`
THEN a CLI avalia os arquivos do template atual do pacote contra o estado no projeto usando um manifest de instalacao.

## Manifest

GIVEN que eu rodei `openkit init`
THEN existe um arquivo `.opencode/openkit.manifest.json` contendo:
- versao do pacote OpenKit usada no install
- lista de arquivos gerenciados + sha256 base instalado por arquivo

GIVEN que eu rodei `openkit upgrade`
THEN o manifest e atualizado para refletir a nova versao do template e novos hashes base.

## Update silencioso para arquivos nao customizados

GIVEN um arquivo `X` gerenciado
AND `sha256(X_atual) == sha256_base_do_manifest`
WHEN eu rodo `openkit upgrade`
THEN `X` e sobrescrito automaticamente com a versao do template atual
AND o manifest e atualizado com o novo hash base.

## Prompt para arquivos customizados (interativo)

GIVEN um arquivo `Y` gerenciado
AND `sha256(Y_atual) != sha256_base_do_manifest`
AND `process.stdin.isTTY == true`
WHEN eu rodo `openkit upgrade`
THEN a CLI pergunta (overwrite/skip) para `Y`
AND aplica minha escolha
AND registra a decisao (para reduzir prompts repetidos) no manifest.

## Non-interactive (CI) seguro

GIVEN `process.stdin.isTTY == false`
WHEN eu rodo `openkit upgrade` sem flags
THEN a CLI nao solicita prompts
AND atualiza apenas arquivos considerados nao customizados pelo manifest
AND adiciona arquivos novos
AND pula arquivos customizados
AND retorna exit code 0.

GIVEN `process.stdin.isTTY == false`
WHEN eu rodo `openkit upgrade --fail-on-changes`
AND existem arquivos customizados/conflitantes
THEN a CLI retorna exit code != 0
AND imprime um resumo com a lista de conflitos.

## Arquivos removidos do template

GIVEN que um arquivo estava no manifest
AND nao existe mais no template do pacote
WHEN eu rodo `openkit upgrade`
THEN o arquivo e mantido no disco por default
AND a CLI reporta o arquivo como "orphaned" no resumo.

## Dry run

GIVEN um projeto qualquer
WHEN eu rodo `openkit upgrade --dry-run`
THEN nenhum arquivo e modificado
AND a CLI imprime o plano (add/update/skip/orphan) com contagens.

## Backups

GIVEN que a CLI vai sobrescrever/remover qualquer arquivo
WHEN `openkit upgrade` e executado
THEN a CLI cria um backup do estado anterior antes de aplicar mudancas.
