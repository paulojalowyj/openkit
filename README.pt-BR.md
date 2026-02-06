# OpenKit - Framework de Desenvolvimento AI-First Spec-Driven

> Configure um ambiente de Desenvolvimento AI-First Spec-Driven com agentes primários, 15 agentes especializados, 33+ skills de domínio e 18 comandos de desenvolvimento.

 Opções de Idioma: [Inglês](README.md) | [Português](README.pt-BR.md)

## O que é o OpenKit?

OpenKit é um **framework** que configura um ambiente de **Desenvolvimento AI-First Spec-Driven** utilizando agentes especializados, comandos e skills.

OpenKit consiste de:

- **4 Agentes Primários** - `orchestrator` (default), `build`, `plan`, `chat`
- **15 Agentes Especializados** - Subagentes focados por domínio
- **33+ Skills de Domínio** - Módulos de conhecimento carregados sob demanda
- **18 Comandos** - Comandos slash para orquestração de tarefas
- **Master Ruleset** - Regras universais de qualidade e consistência

## Início Rápido

```bash
# Instalar OpenKit no seu projeto
npx @paulojalowyj/openkit init

# Ou com um blueprint de projeto opcional
npx @paulojalowyj/openkit init --blueprint fullstack

# Usar o OpenKit
# (execute `opencode` no seu projeto e use os comandos /)
opencode
```

> **Importante:** Use `npx` para executar comandos do OpenKit. Não instale o OpenKit como dependência do projeto (`npm install @paulojalowyj/openkit`). OpenKit é uma ferramenta CLI, não uma biblioteca de runtime.

## Upgrade

```bash
# Ver o plano (sem escrever arquivos)
npx @paulojalowyj/openkit upgrade --dry-run

# Aplicar upgrades seguros (sem TTY, conflitos sao pulados por default)
npx @paulojalowyj/openkit upgrade

# CI: falhar o job quando houver customizacoes/conflitos
npx @paulojalowyj/openkit upgrade --fail-on-changes
```

## Sobre o OpenCode

OpenCode é um agente de código AI baseado em terminal que o OpenKit usa para executar comandos e gerenciar agentes.

- **Open Source** - 95K+ estrelas no GitHub, 2.5M+ desenvolvedores mensais
- **Multi-plataforma** - Terminal (TUI), App Desktop, Extensão de IDE
- **75+ Provedores de LLM** - Claude, GPT, Gemini, modelos locais, e mais
- **Privacidade em primeiro lugar** - Sem armazenamento de código ou dados de contexto
- [Documentação Oficial →](https://opencode.ai/docs)

**Uso:** Execute `opencode` em seu projeto para acessar os comandos do OpenKit.

## Agentes do Framework

Agentes primários padrão:
- `orchestrator`: agente default para orquestração AI-First SDD (todas as tools)
- `build`: acesso completo para implementação
- `plan`: acesso restrito para análise
- `chat`: apenas Q&A, sem planejamento, sem execução

OpenKit inclui 15 agentes especializados:

| Agente                  | Foco                          |
| ----------------------- | ----------------------------- |
| `backend-specialist`    | Python/FastAPI, SQL           |
| `frontend-specialist`   | React (TanStack), UI          |
| `test-engineer`         | QA, E2E (Playwright)          |
| `mobile-developer`      | iOS, Android, React Native    |
| `devops-engineer`       | Docker, CI/CD                 |
| `database-architect`    | Schema, Migrations            |
| `debugger`              | Análise de Causa Raiz         |
| `performance-optimizer` | Web Vitals, Tamanho do bundle |
| `security-auditor`      | Compliance, OWASP             |
| `penetration-tester`    | Segurança Ofensiva            |
| `explorer-agent`        | Análise de Código             |
| `project-planner`       | Divisão de Tarefas            |
| `product-owner`         | Requisitos, Backlog           |
| `seo-specialist`        | Ranking, GEO                  |
| `documentation-writer`  | Manuais, Documentação         |

## Skills de Domínio

Domínios de conhecimento modulares carregados sob demanda:

### Frontend & Design
- `frontend-design` - Motor UI/UX com 50+ estilos e 97 paletas
- `nextjs-react-expert` - Performance React, melhores práticas do Vercel
- `tailwind-patterns` - Utilitários Tailwind v4, design tokens
- `mobile-design` - Padrões de desenvolvimento mobile iOS/Android

### Backend & Dados
- `python-patterns` - Melhores práticas FastAPI, Pydantic, Async/Await
- `database-design` - Otimização de schema, migrations Alembic
- `api-patterns` - Design RESTful, padrões de tratamento de erro

### Qualidade & Segurança
- `webapp-testing` - Automação E2E Playwright, testes de navegador
- `vulnerability-scanner` - Auditoria de segurança, análise de dependências
- `clean-code` - Padrões universais de código (obrigatório)
- `testing-patterns` - Estratégias de testes unitários, integração e E2E

### Arquitetura & Planejamento
- `architecture` - Framework de decisão arquitetural
- `plan-writing` - Planejamento estruturado de tarefas
- `brainstorming` - Protocolo de perguntas socráticas

### Operacional
- `deployment-procedures` - Princípios de deploy em produção
- `server-management` - Gerenciamento de processos, monitoramento
- `performance-profiling` - Técnicas de medição e otimização

## Comandos

Comandos simplificados para o OpenCode TUI:

| Comando       | Propósito                                                                |
| ------------- | ------------------------------------------------------------------------ |
| `/engineer`   | Builder Universal: Planejamento CoT + execução                           |
| `/specify`    | Especificação: Criar spec da feature                                     |
| `/clarify`    | Clarificação: Resolver ambiguidades da spec                              |
| `/plan`       | Planejamento: Criar plano de implementação                               |
| `/tasks`      | Tasking: Gerar tarefas executáveis                                       |
| `/analyze`    | Análise: Validar consistência spec/plan/tasks                            |
| `/checklist`  | Checklist: Prontidão de spec/plan                                        |
| `/impl`       | Implementação de Feature: Mudanças seguras de código                     |
| `/test`       | Garantia de Qualidade: Executa checagens unitárias e suites E2E          |
| `/ui-ux`      | Studio de Design: Gera sistemas de design e componentes UI               |
| `/deploy`     | Produção: Procedimentos seguros de deploy e verificações                 |
| `/debug`      | Debugging Sistemático: Análise de causa raiz em 4 fases                  |
| `/create`     | Novo App: Bootstrapping com setup guiado                                 |
| `/brainstorm` | Ideação: Explorar abordagens antes de implementar                        |
| `/context`    | Análise de Repo: Gera context packs para LLMs                            |
| `/doc`        | Documentação: Escreve manuais e docs de API                              |
| `/status`     | Rastreamento de Progresso: Visualiza tarefas ativas e estatísticas       |
| `/preview`    | Ambiente de Desenvolvimento: Gerencia Docker Compose                     |

## Como Funciona

1. **Instalar OpenKit**: `npx @paulojalowyj/openkit init` instala o OpenKit em seu projeto
2. **Framework Pronto**: Agents, skills, commands, rules e configuração de modelo estão prontos
3. **Desenvolvimento**: Execute `opencode` e siga o fluxo SDD (`/specify` → `/clarify` → `/plan` → `/tasks` → `/impl`)
4. **Resultados**: Agentes especializados executam tarefas seguindo o Master Ruleset

## Blueprints (Opcional)

Como recurso adicional, o OpenKit oferece blueprints de projeto:

### Blueprint Full-Stack

Estrutura de projeto full-stack pronta para produção:

- **Frontend**: React 18 + Vite + TanStack Query + TanStack Router + Tailwind CSS + ShadcnUI
- **Backend**: FastAPI + SQLAlchemy + Alembic (migrations)
- **Infraestrutura**: Docker Compose (dev e prod), PostgreSQL, Redis, worker Celery
- **Exemplo**: Model/Schema/Service/Router com migration inicial e dados de exemplo

```bash
npx @paulojalowyj/openkit init --blueprint fullstack \
  --project-name "Meu Projeto" \
  --project-identifier "meu-projeto"
```

**Desenvolvimento:**

```bash
# Iniciar serviços (com .env pré-configurado)
docker compose -f docker-compose.dev.yml up -d

# Rodar migrations para ver dados de exemplo
docker compose -f docker-compose.dev.yml exec backend alembic upgrade head

# Acesse:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Documentação

- **[Documentação OpenKit](docs/README.md)** - Guia completo do sistema OpenKit
- **[Arquitetura do Sistema](docs/ARCHITECTURE.md)** - Detalhes técnicos do framework
- **[Referência de Agents](docs/AGENTS.md)** - Todos os 15 agentes especializados
- **[Referência de Skills](docs/SKILLS.md)** - Referência completa de skills
- **[Referência de Comandos](docs/COMMANDS.md)** - Todos os comandos slash
- **[Workflows](docs/WORKFLOW.md)** - Workflows de desenvolvimento
- **[Regras Master](.opencode/rules/MASTER.md)** - Regras universais de qualidade

## Contribuindo

O OpenKit foi projetado para ser extensível:

- Adicione novos skills via `.opencode/skills/`
- Crie prompts de agentes em `.opencode/prompts/`
- Defina comandos em `.opencode/commands/`
- Contribua com regras em `.opencode/rules/`

## Suporte

- **Issues**: [GitHub Issues](https://github.com/paulojalowyj/openkit/issues)
- **Documentação**: Veja o diretório `.opencode/`
- **Arquitetura**: [.opencode/ARCHITECTURE.md](.opencode/ARCHITECTURE.md)
