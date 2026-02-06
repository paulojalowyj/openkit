# OpenKit Documentation

> Complete documentation for the OpenKit AI-First Spec-Driven Development Framework.

---

## Table of Contents

| Document | Description |
|----------|-------------|
| **[Getting Started](#getting-started)** | Installation, quick start, and basic concepts |
| **[System Architecture](#system-architecture)** | How OpenKit works, agents, skills, and commands |
| **[Agents](AGENTS.md)** | Detailed guide to all 15 specialized agents |
| **[Skills](SKILLS.md)** | Complete reference to 33+ domain skills |
| **[Commands](COMMANDS.md)** | All 18 slash commands and their usage |
| **[Workflows](WORKFLOW.md)** | Development workflows and best practices |
| **[Blueprints](BLUEPRINTS.md)** | Project blueprints and how to use them |
| **[Installation Prevention](INSTALLATION_PREVENTION.md)** | How OpenKit prevents incorrect installation |
| **[Contributing](CONTRIBUTING.md)** | How to contribute to OpenKit |
| **[Extending](EXTENDING.md)** | How to create custom agents, skills, and commands |
| **[Frequently Asked Questions](FAQ.md)** | Common questions and troubleshooting |

### Architecture Decision Records (ADRs)

| ADR | Title | Status |
|-----|-------|--------|
| [ADR-0001](adr/ADR_0001_PREVENT_INCORRECT_INSTALLATION.md) | Prevent Incorrect OpenKit Installation | Accepted |

---

## What is OpenKit?

OpenKit is a **framework** that configures an **AI-First Spec-Driven Development** environment using specialized agents, commands, and skills.

### Core Components

```
OpenKit
├── 4 Primary Agents        - build, plan, chat, orchestrator
├── 15 Specialized Agents   - Domain-specific experts (frontend, backend, etc.)
├── 33+ Domain Skills      - Knowledge modules loaded on-demand
├── 18 Commands            - Slash commands for task orchestration
└── Master Ruleset         - Universal quality and consistency rules
```

### What is OpenCode?

OpenCode is a terminal-based AI coding agent that OpenKit uses to execute commands and manage agents.

- **Open Source** - 95K+ GitHub stars, 2.5M+ monthly developers
- **Multi-platform** - Terminal (TUI), Desktop app, IDE extension
- **75+ LLM Providers** - Claude, GPT, Gemini, local models, and more
- **Privacy-first** - No code or context data storage
- [Official Documentation →](https://opencode.ai/docs)

---

## Getting Started

### Prerequisites

- **Node.js** >= 18.0.0
- **OpenCode CLI** (installed with OpenKit)
- **Any LLM provider** (OpenAI, Claude, Anthropic, local models, etc.)

### Installation

```bash
# Install OpenKit in your project
npx @paulojalowyj/openkit init

# Or with a project blueprint
npx @paulojalowyj/openkit init --blueprint fullstack

# Use OpenKit
# (Run opencode in your project and use / commands)
opencode
```

> **Important:** Always use `npx` to run OpenKit commands. Do not install OpenKit as a project dependency. See [Installation Prevention](INSTALLATION_PREVENTION.md) for details.

### What Gets Installed?

OpenKit installs the following in your project:

```
.your-project/
├── .opencode/              # Agent system
│   ├── agents/             # 15 specialized agents
│   ├── skills/             # 33+ domain skills
│   ├── commands/           # 18 slash commands
│   ├── scripts/            # Validation and utility scripts
│   └── rules/             # Master ruleset (MASTER.md)
├── opencode.json           # OpenCode runtime configuration
└── README.md              # Updated with OpenKit info
```

### Quick Start Example

```bash
# 1. Install OpenKit
npx @paulojalowyj/openkit init

# 2. Start OpenCode TUI
opencode

# 3. Plan a new feature
/plan create user authentication

# 4. Implement the plan
/impl

# 5. Test the implementation
/test

# 6. Deploy to production
/deploy
```

---

## System Architecture

### Primary Agents

Primary agents manage the development workflow:

| Agent | Purpose | Access Level |
|--------|---------|--------------|
| `build` | Full implementation | Full access |
| `plan` | Analysis and planning | Restricted (read-only) |
| `chat` | Q&A | Q&A only (no planning, no execution) |
| `orchestrator` | Complex multi-agent coordination | Full access |

### Specialized Agents

OpenKit includes 15 specialized agents for different domains:

| Domain | Agents |
|---------|---------|
| **Frontend** | `frontend-specialist` |
| **Backend** | `backend-specialist` |
| **Database** | `database-architect` |
| **Testing** | `test-engineer` |
| **Security** | `security-auditor`, `penetration-tester` |
| **DevOps** | `devops-engineer` |
| **Mobile** | `mobile-developer` |
| **Performance** | `performance-optimizer` |
| **SEO** | `seo-specialist` |
| **Planning** | `project-planner`, `product-owner` |
| **Analysis** | `explorer-agent`, `debugger` |
| **Documentation** | `documentation-writer` |

### Suggested Models by Workflow

Use runtime model selection according to the workflow being executed:

| Workflow | Primary | Alternatives |
|----------|---------|-------------|
| Orchestration and planning (`/engineer`, `/plan`) | `openai/gpt-5.2` | `anthropic/claude-opus-4.5`, `zai/glm-4.7-thinking` |
| Implementation (`/impl`) | `openai/gpt-5.3-codex` | `anthropic/claude-sonnet-4.5`, `zai/glm-4.7-flash` |
| Debugging (`/debug`) | `openai/gpt-5.2-codex` | `anthropic/claude-opus-4.5`, `zai/glm-4.7-thinking` |
| Testing (`/test`) | `openai/gpt-5.3-codex` | `anthropic/claude-sonnet-4.5`, `zai/glm-4.7-flash` |
| Documentation and product (`/doc`, backlog refinement) | `openai/gpt-5.3-codex` | `anthropic/claude-haiku-4.5`, `zai/glm-4.5-air` |

### Domain Skills

Skills are knowledge modules loaded on-demand by agents:

| Category | Skills |
|----------|---------|
| **Frontend** | `frontend-design`, `nextjs-react-expert`, `tailwind-patterns` |
| **Backend** | `python-patterns`, `api-patterns`, `database-design` |
| **Testing** | `testing-patterns`, `webapp-testing`, `tdd-workflow` |
| **Security** | `vulnerability-scanner`, `red-team-tactics` |
| **DevOps** | `deployment-procedures`, `server-management` |
| **Planning** | `plan-writing`, `brainstorming`, `architecture` |
| **Stack Selection** | `stack-selection` |
| **... and more** | 33+ skills total |

### Commands

Commands are slash commands used in OpenCode TUI:

| Command | Purpose |
|---------|---------|
| `/engineer` | Universal builder with planning + execution |
| `/impl` | Safe feature implementation |
| `/plan` | Task planning and sprint alignment |
| `/test` | Quality assurance and testing |
| `/ui-ux` | Design studio and UI components |
| `/deploy` | Production deployment and verification |
| `/debug` | Systematic debugging (4-phase) |
| `/create` | Bootstrap new projects |
| `/brainstorm` | Ideation and exploration |
| `/context` | Generate context packs for LLMs |
| `/doc` | Write documentation |
| `/status` | View active tasks and progress |

### Master Ruleset

The Master Ruleset (`MASTER.md`) is the single source of truth for:

- Language detection and consistency
- Question tool protocol (when to use `question` tool)
- Project structure and standards
- Sprint documentation requirements
- Quality control and validation scripts

All agents and commands follow these universal rules.

---

## Development Workflow

### Standard Workflow

```
1. Planning Phase
   /plan <feature-name>
   └── Creates docs/requirements/<feature>/
   └── Updates docs/sprint/Sprint-XX/

2. Implementation Phase
   /impl
   └── Executes plan using specialized agents
   └── Updates task status in docs/sprint/Sprint-XX/TASKS.md

3. Testing Phase
   /test
   └── Runs unit tests, E2E tests, validation scripts

4. Deployment Phase
   /deploy
   └── Safe deployment procedures
   └── Post-deployment verification

5. Documentation Phase (Optional)
   /doc
   └── Updates API docs, README, etc.
```

### Alternative: Engineer Command

The `/engineer` command combines planning and execution in one workflow:

```
/engineer build user authentication system
├── Phase 1: Planning (with project-planner)
├── STOP: Ask for approval
├── Phase 2: Implementation (parallel agents)
│   ├── P0: database-architect + security-auditor
│   ├── P1: backend-specialist
│   ├── P2: frontend-specialist
│   └── P3: test-engineer + performance-optimizer
├── STOP: Ask for final verification
└── Phase X: Verification scripts
```

---

## Stack Selection

OpenKit uses a **flexible stack selection** approach:

### For New Projects

1. **Check for existing stack** - None exists
2. **Ask user preferences** - Using `question` tool
3. **Suggest based on requirements** - Using `stack-selection` skill
4. **Document decision** - In `docs/requirements/<feature>/TechStack.md`

### For Existing Projects

1. **Check for existing stack** - Read `package.json`, `pyproject.toml`, etc.
2. **Maintain consistency** - Use existing technologies
3. **Ask before changes** - "You're using [X]. Continue or change?"

### Stack Selection Skill

The `stack-selection` skill provides:

- Decision trees for backend (framework, database, ORM)
- Decision trees for frontend (framework, state management, UI library)
- Trade-off explanations for different options
- No hardcoded stacks - always user-driven

---

## Blueprints

OpenKit offers optional project blueprints:

### Fullstack Blueprint

Reference blueprint in `@blueprints/fullstack/`:

- **Frontend**: React 18 + Vite + TanStack Query + TanStack Router + Tailwind + ShadcnUI
- **Backend**: FastAPI + SQLAlchemy + Alembic + PostgreSQL + Redis + Celery
- **Infrastructure**: Docker Compose (dev and prod)

Use as reference, not requirement.

```bash
npx @paulojalowyj/openkit init --blueprint fullstack
```

---



## Documentation Structure

OpenKit documentation is organized as follows:

```
docs/
├── README.md              # This file
├── ARCHITECTURE.md        # Deep dive into system architecture
├── AGENTS.md              # Detailed guide to all agents
├── SKILLS.md              # Complete skill reference
├── COMMANDS.md            # All slash commands
├── WORKFLOW.md            # Development workflows
├── BLUEPRINTS.md          # Project blueprints
├── CONTRIBUTING.md        # How to contribute
└── EXTENDING.md           # How to extend OpenKit
```

For technical framework details, see `.opencode/ARCHITECTURE.md`.

---

## Contributing

OpenKit is designed to be extensible. See [CONTRIBUTING.md](CONTRIBUTING.md) for:

- How to contribute code
- How to add new skills
- How to create custom agents
- How to define new commands
- Coding standards and guidelines

---

## Support

- **GitHub Issues**: [github.com/paulojalowyj/openkit/issues](https://github.com/paulojalowyj/openkit/issues)
- **OpenCode Documentation**: [opencode.ai/docs](https://opencode.ai/docs)
- **Architecture**: [.opencode/ARCHITECTURE.md](../.opencode/ARCHITECTURE.md)
- **Master Ruleset**: [.opencode/rules/MASTER.md](../.opencode/rules/MASTER.md)

---

## License

MIT License - See [LICENSE](../LICENSE) for details.
