# OpenKit - AI First Spec-Driven Development Framework

> Configure an AI First Spec-Driven Development environment with primary agents, 15 specialized agents, 33+ domain skills, and 18 development commands.

 Language Options: [English](README.md) | [Português](README.pt-BR.md)

## What is OpenKit?

OpenKit is a **framework** that configures an **AI First Spec-Driven Development** environment using specialized agents, commands, and skills.

OpenKit consists of:

- **4 Primary Agents** - `orchestrator` (default), `build`, `plan`, `chat`
- **15 Specialized Agents** - Subagents focused on specific domains
- **13 Built-in Tools** - File operations, search, user interaction, task tracking
- **33+ Domain Skills** - Knowledge modules loaded on-demand
- **18 Commands** - Slash commands for task orchestration
- **Master Ruleset** - Universal quality and consistency rules

## Quick Start

```bash
# Install OpenCode Framework in your project
npx @paulojalowyj/openkit init

# Or with an optional project blueprint
npx @paulojalowyj/openkit init --blueprint fullstack

# Use the OpenCode Framework
# (run opencode in your project and use / commands)
opencode
```

> **Important:** Use `npx` to run OpenKit commands. Do not install OpenKit as a project dependency (`npm install @paulojalowyj/openkit`). OpenKit is a CLI tool, not a runtime library.

## Upgrade

```bash
# Preview changes (no writes)
npx @paulojalowyj/openkit upgrade --dry-run

# Apply safe upgrades (non-interactive defaults to skipping conflicts)
npx @paulojalowyj/openkit upgrade

# CI mode: fail job when customizations/conflicts exist
npx @paulojalowyj/openkit upgrade --fail-on-changes
```

## About OpenCode

OpenCode is a terminal-based AI coding agent that OpenKit uses to execute commands and manage agents.

- **Open Source** - 95K+ GitHub stars, 2.5M+ monthly developers
- **Multi-platform** - Terminal (TUI), Desktop app, IDE extension
- **75+ LLM Providers** - Claude, GPT, Gemini, local models, and more
- **Privacy-first** - No code or context data storage
- [Official Documentation →](https://opencode.ai/docs)

**Usage:** Run `opencode` in your project to access OpenKit commands.

## Framework Agents

### Primary Agents

- **`orchestrator`**: Default agent for AI-First SDD orchestration (all tools)
- **`chat`**: Q&A only, read-only tools, no planning or execution
- **`build`**: Full access for implementation (if configured)
- **`plan`**: Restricted access for analysis (if configured)

**Configuration:** Agent capabilities, tools, and permissions are defined in `opencode.json`.

### Specialized Agents (15 subagents)

| Agent                   | Focus                      |
| ----------------------- | -------------------------- |
| `backend-specialist`    | Python/FastAPI, SQL        |
| `frontend-specialist`   | React (TanStack), UI       |
| `test-engineer`         | QA, E2E (Playwright)       |
| `mobile-developer`      | iOS, Android, React Native |
| `devops-engineer`       | Docker, CI/CD              |
| `database-architect`    | Schema, Migrations         |
| `debugger`              | Root Cause Analysis        |
| `performance-optimizer` | Web Vitals, Bundle size    |
| `security-auditor`      | Compliance, OWASP          |
| `penetration-tester`    | Offensive Security         |
| `explorer-agent`        | Code Analysis              |
| `project-planner`       | Task Breakdown             |
| `product-owner`         | Requirements, Backlog      |
| `seo-specialist`        | Ranking, GEO               |
| `documentation-writer`  | Manuals, Docs              |

### Suggested Models by Workflow

Use these suggestions as guidance at runtime, based on the workflow you are executing:

| Workflow | Primary | Alternatives |
| ----------------------------- | ------------------------- | ------------------------------------------- |
| Orchestration and planning (`/engineer`, `/plan`) | `openai/gpt-5.2` | `anthropic/claude-opus-4.5`, `zai/glm-4.7-thinking` |
| Backend/frontend implementation (`/impl`) | `openai/gpt-5.3-codex` | `anthropic/claude-sonnet-4.5`, `zai/glm-4.7-flash` |
| Debugging and root-cause analysis (`/debug`) | `openai/gpt-5.2-codex` | `anthropic/claude-opus-4.5`, `zai/glm-4.7-thinking` |
| Testing and QA (`/test`) | `openai/gpt-5.3-codex` | `anthropic/claude-sonnet-4.5`, `zai/glm-4.7-flash` |
| Documentation and product (`/doc`, backlog work) | `openai/gpt-5.3-codex` | `anthropic/claude-haiku-4.5`, `zai/glm-4.5-air` |

## Built-in Tools

OpenCode provides 13 built-in tools for file operations, search, and interaction:

### File Operations
- **`read`** - Read file contents
- **`edit`** - Modify existing files with exact string replacements
- **`write`** - Create new files or overwrite existing ones
- **`patch`** - Apply patch files

### Search & Discovery
- **`glob`** - Find files by pattern (`**/*.ts`)
- **`grep`** - Search file contents with regex
- **`list`** - List directory contents

### Execution
- **`bash`** - Execute shell commands (git, npm, build, test)

### User Interaction
- **`question`** - Ask user questions with multiple options
- **`todowrite`** - Create and update task lists
- **`todoread`** - Read existing todo lists

### Knowledge & Web
- **`skill`** - Load domain-specific skills
- **`webfetch`** - Fetch web content for documentation

**Tool Configuration:** Defined per-agent in `opencode.json`. The **orchestrator has access to all 13 tools** for maximum flexibility.

## Domain Skills

Modular knowledge domains loaded on-demand:

### Frontend & Design
- `frontend-design` - UI/UX Engine with 50+ styles and 97 palettes
- `nextjs-react-expert` - React performance, Vercel engineering best practices
- `tailwind-patterns` - Tailwind v4 utilities, design tokens
- `mobile-design` - iOS/Android mobile development patterns

### Backend & Data
- `python-patterns` - FastAPI best practices, Pydantic, Async/Await
- `database-design` - Schema optimization, Alembic migrations
- `api-patterns` - RESTful design, Error handling standards

### Quality & Security
- `webapp-testing` - Playwright E2E automation, browser testing
- `vulnerability-scanner` - Security auditing, dependency analysis
- `clean-code` - Universal coding standards (mandatory)
- `testing-patterns` - Unit, integration, and E2E testing strategies

### Architecture & Planning
- `architecture` - Architectural decision-making framework
- `plan-writing` - Structured task planning
- `brainstorming` - Socratic questioning protocol

### Operational
- `deployment-procedures` - Production deployment principles
- `server-management` - Process management, monitoring
- `performance-profiling` - Measurement and optimization techniques

## Commands

Streamlined commands for OpenCode TUI:

| Command       | Purpose                                                  |
| ------------- | -------------------------------------------------------- |
| `/engineer`   | Universal Builder: CoT driven planning + execution       |
| `/specify`    | Specification: Create feature spec                       |
| `/clarify`    | Clarification: Resolve spec ambiguities                  |
| `/plan`       | Planning: Create implementation plan                     |
| `/tasks`      | Tasking: Generate executable tasks                       |
| `/analyze`    | Analysis: Validate spec/plan/tasks consistency           |
| `/checklist`  | Checklist: Spec/plan readiness checks                    |
| `/impl`       | Feature Implementation: Safe code changes                |
| `/test`       | Quality Assurance: Run unit checks and E2E suites        |
| `/ui-ux`      | Design Studio: Generate design systems and UI components |
| `/deploy`     | Production: Safe deployment procedures and verifications |
| `/debug`      | Systematic Debugging: 4-phase root cause analysis        |
| `/create`     | New App: Bootstrap a project with guided setup           |
| `/brainstorm` | Ideation: Explore approaches before implementation       |
| `/context`    | Repo Analysis: Generate context packs for LLMs           |
| `/doc`        | Documentation: Write manuals and API docs                |
| `/status`     | Progress Tracking: View active tasks and stats           |
| `/preview`    | Dev Environment: Manage Docker Compose                   |

## How It Works

1. **Install OpenKit**: `npx @paulojalowyj/openkit init` installs OpenKit in your project
2. **Framework Ready**: Agents, skills, commands, and rules are set up
3. **Development**: Run `opencode` in your project and follow the SDD flow (`/specify` → `/clarify` → `/plan` → `/tasks` → `/impl`)
4. **Results**: Specialized agents execute tasks following the Master Ruleset

## Blueprints (Optional)

As an additional resource, OpenKit offers project blueprints:

### Full-Stack Blueprint

Production-ready full-stack project structure:

- **Frontend**: React 18 + Vite + TanStack Query + TanStack Router + Tailwind CSS + ShadcnUI
- **Backend**: FastAPI + SQLAlchemy + Alembic (migrations)
- **Infrastructure**: Docker Compose (dev and prod), PostgreSQL, Redis, Celery worker
- **Example**: Model/Schema/Service/Router with initial migration and sample data

```bash
npx @paulojalowyj/openkit init --blueprint fullstack \
  --project-name "My Project" \
  --project-identifier "my-project"
```

**Development:**

```bash
# Start services (pre-configured .env)
docker compose -f docker-compose.dev.yml up -d

# Run migrations to see sample data
docker compose -f docker-compose.dev.yml exec backend alembic upgrade head

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

## Documentation

### Core Documentation
- **[OpenKit Documentation](docs/README.md)** - Complete guide to the OpenKit system
- **[System Architecture](docs/ARCHITECTURE.md)** - Technical framework details
- **[Agents Reference](docs/AGENTS.md)** - All 15 specialized agents
- **[Skills Reference](docs/SKILLS.md)** - Complete skill reference
- **[Commands Reference](docs/COMMANDS.md)** - All slash commands
- **[Workflows](docs/WORKFLOW.md)** - Development workflows

### Rules & Tools
- **[Master Ruleset](.opencode/rules/MASTER.md)** - Universal quality rules
- **[Tool Usage Protocol](.opencode/rules/TOOL_USAGE.md)** - Correct tool selection and usage patterns
- **[TodoList Examples](.opencode/rules/TODOLIST_EXAMPLES.md)** - Task tracking best practices
- **[Agent Template](.opencode/rules/AGENT_TEMPLATE.md)** - Template for creating new agents

### Configuration
- `opencode.json` - Runtime configuration (tools, agents, permissions)

## Contributing

The OpenCode Framework is designed to be extensible:

- **Add new skills** - Create `SKILL.md` in `.opencode/skills/<skill-name>/`
- **Create custom agents** - Add agent definition in `opencode.json` and prompt in `.opencode/prompts/`
- **Define commands** - Add command files in `.opencode/commands/`
- **Contribute rules** - Add rule files to `.opencode/rules/`
- **Configure tools** - Edit `opencode.json` to control agent tool access

**See also:**
- [Agent Template](.opencode/rules/AGENT_TEMPLATE.md) - Guide for creating new agents
- [Tool Usage Protocol](.opencode/rules/TOOL_USAGE.md) - Correct tool usage patterns

## Support

- **Issues**: [GitHub Issues](https://github.com/paulojalowyj/openkit/issues)
- **Documentation**: See `.opencode/` directory
- **Architecture**: [.opencode/ARCHITECTURE.md](.opencode/ARCHITECTURE.md)
