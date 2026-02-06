# Opencode System Architecture

> Comprehensive AI Agent Capability Expansion Toolkit (Optimized for Z.AI Coding Plan)

---

## Overview

Opencode Agent System is a modular system consisting of:

- **15 Specialist Agents** - Domain-specific prompts for implementation
- **Primary Agents** - Build, Plan, Chat, and Orchestrator for interactive workflows
- **33 Skills** - Domain-specific knowledge modules
- **18 Commands** - Streamlined slash command procedures
- **1 Master Ruleset** - Fonte única para qualidade e consistência

---

## Directory Structure

```plaintext
.opencode/
├── ARCHITECTURE.md          # This file
├── prompts/                 # Agent prompts
├── skills/                  # Capability Modules
├── commands/                # Slash Commands (/slash)
├── rules/                   # MASTER.md (única fonte de regras)
├── scripts/                 # Automation & Validation

```

---

## Agents (15)

Optimized for domain separation and execution quality.

| Agent | Focus | Key Skills |
| ----- | ----- | ---------- |
| `backend-specialist` | Python/FastAPI, SQL | api-patterns, database-design, python-patterns |
| `frontend-specialist` | React (TanStack), UI | frontend-design, nextjs-react-expert, tailwind-patterns |
| `test-engineer` | QA, E2E (Playwright) | testing-patterns, webapp-testing, tdd-workflow |
| `mobile-developer` | iOS, Android, RN | mobile-design |
| `devops-engineer` | Docker, CI/CD | deployment-procedures, server-management |
| `security-auditor` | Compliance, OWASP | vulnerability-scanner, red-team-tactics |
| `penetration-tester` | Offensive Security | red-team-tactics |
| `database-architect` | Schema, Migrations | database-design |
| `project-planner` | Task Breakdown | brainstorming, plan-writing, architecture |
| `product-owner` | Requirements, Backlog | plan-writing, brainstorming |
| `explorer-agent` | Code Analysis | architecture, systematic-debugging |
| `debugger` | Root Cause Analysis | systematic-debugging |
| `performance-optimizer` | Web Vitals | performance-profiling |
| `seo-specialist` | Ranking, Geo | seo-fundamentals, geo-fundamentals |
| `documentation-writer` | Manuals, Docs | documentation-templates |

---

## Skills (Highlights)

Modular knowledge domains loaded on-demand.

**Stack Selection (NEW):**
| Skill | Purpose |
|-------|---------|
| `stack-selection` | Tech stack selection with decision trees, user preferences, and blueprint defaults |

**Core Skills:**

### Frontend & Design (Migrated Engine)
| Skill | Capabilities |
| ----- | ------------ |
| `frontend-design` | **UI/UX Engine**: 50+ styles, 97 palettes, auto-design system generator |
| `nextjs-react-expert` | React performance, Vercel engineering best practices |
| `tailwind-patterns` | Tailwind v4 utilities, design tokens |

### Backend & Data
| Skill | Capabilities |
| ----- | ------------ |
| `python-patterns` | FastAPI best practices, Pydantic, Async/Await |
| `database-design` | Schema optimization, Alembic migrations |
| `api-patterns` | RESTful design, Error handling standards |

### Quality & Security
| Skill | Capabilities |
| ----- | ------------ |
| `webapp-testing` | Playwright E2E automation, browser testing |
| `vulnerability-scanner` | Security auditing, dependency analysis |
| `clean-code` | Universal coding standards (mandatory) |

---

## Commands

Streamlined commands for OpenCode workflows. Invoke with `/command`.

| Command | Purpose |
| ------- | ------- |
| `/engineer` | **Universal Builder**: CoT (Chain of Thought) driven planning + execution |
| `/impl` | **Feature Implementation**: Reasoning Loop for safe code changes |
| `/plan` | **Task Planning**: Detailed breakdowns and sprint alignment |
| `/test` | **Quality Assurance**: Run unit checks and E2E suites |
| `/ui-ux` | **Design Studio**: Generate design systems and UI components |
| `/deploy` | **Production**: Safe deployment procedures and verifications |
| `/debug` | **Systematic Debugging**: 4-phase root cause analysis |
| `/context` | **Repo Analysis**: Generate context packs for LLMs |
| `/doc` | **Documentation**: Write manuals and API docs |
| `/status` | **Progress Tracking**: View active tasks and stats |
| `/preview` | **Dev Environment**: Manage Docker Compose (`scripts/auto_preview.py`) |

---

## Core Rules (Mandatory)

Tudo consolidado em `.opencode/rules/MASTER.md`:

1.  Runtime model choice and Socratic Gate.
2.  Regras universais de linguagem, clean code e dependências.
3.  Protocolo de roteamento de agentes e carregamento de skills.
4.  Documentação de sprints, planos e artefatos oficiais.
5.  Checklist final e scripts obrigatórios (Security -> Lint -> Tests -> UX -> SEO).
6.  **User Interaction Protocol (MANDATORY)**: Use `question` tool for ALL user choices, preferences, and clarifications. NEVER ask multi-option questions inline.

---

## Automation Scripts

Located in `.opencode/scripts/`.

| Script | Usage | Description |
| ------ | ----- | ----------- |
| `auto_preview.py` | `python .opencode/scripts/auto_preview.py start` | Manages full-stack env via Docker Compose |
| `checklist.py` | `python .opencode/scripts/checklist.py .` | Fast validation (Lint, Tests, Security) |
| `verify_all.py` | `python .opencode/scripts/verify_all.py . --url <URL>` | Full suite (Lighthouse, E2E, SEO, Mobile) |
| `session_manager.py` | `python .opencode/scripts/session_manager.py status` | Project stats and stack detection |

---

## Quick Reference

**"I want to build a new feature"**
> Use `/plan` then `/impl` (or `/engineer` for complex tasks).

**"I want to design a UI"**
> Use `/ui-ux` to generate a system, then `frontend-specialist`.

**"I want to test everything"**
> Use `/test` locally, then `/deploy` for verification.

**"I want to verify the project"**
> Run `python .opencode/scripts/checklist.py .`
