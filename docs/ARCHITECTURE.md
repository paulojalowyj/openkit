# OpenKit Architecture

> Technical architecture and system design details.

---

## Table of Contents

| Topic | Description |
|--------|-------------|
| **[System Overview](#system-overview)** | High-level architecture |
| **[Component Breakdown](#component-breakdown)** | Agents, skills, commands, ruleset |
| **[Data Flow](#data-flow)** | How data flows through system |
| **[Execution Model](#execution-model)** | How commands are executed |
| **[Agent Model](#agent-model)** | How agents work |
| **[Skill Model](#skill-model)** | How skills work |
| **[Orchestration](#orchestration)** | Multi-agent coordination |
| **[Configuration](#configuration)** | How system is configured |
| **[Extensibility](#extensibility)** | How to extend the system |

---

## System Overview

OpenKit is a **modular AI agent system** built on top of OpenCode CLI.

```
┌─────────────────────────────────────────┐
│         OpenCode CLI             │
│  (Terminal, Desktop, IDE)         │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│         OpenKit System            │
│  (Agents + Skills + Commands)        │
└────────────┬────────────────────────┘
             │
             ▼
┌─────────────────────────────────────────┐
│      LLM Provider(s)            │
│  (OpenAI, Claude, Local, etc.)    │
└─────────────────────────────────────────┘
```

### Core Components

1. **Agents (15)** - Specialized LLM-powered personas
2. **Skills (33+)** - Domain knowledge modules
3. **Commands (13)** - Slash commands for task orchestration
4. **Master Ruleset** - Universal quality and consistency rules
5. **Validation Scripts** - Quality assurance automation

---

## Component Breakdown

### Agents

**Location:** `.opencode/prompts/`

**Structure:**
```
agents/
├── backend-specialist.md      # Python/FastAPI expertise
├── frontend-specialist.md     # React/TanStack expertise
├── test-engineer.md          # QA, testing expertise
├── database-architect.md      # Schema, migration expertise
├── security-auditor.md       # Security, compliance expertise
├── ... (11 more agents)
```

**Agent Anatomy:**

| Component | Purpose |
|-----------|----------|
| **Philosophy** | How agent approaches problems |
| **Mindset** | How agent thinks |
| **Expertise Areas** | Technical knowledge domains |
| **What You Do** | Specific responsibilities |
| **Key Skills** | Skills agent loads |
| **When to Use** | When agent should be invoked |
| **Quality Control** | Checklist and validation requirements |

**Agent Configuration:**

```json
{
  "agents": {
    "backend-specialist": {
      "model": "zai-coding-plan/glm-4.7-flash",
      "provider": "openai",
      "temperature": 0.7,
      "max_tokens": 8000
    }
  }
}
```

### Skills

**Location:** `.opencode/skills/<skill-name>/`

**Structure:**
```
skills/
├── stack-selection/
│   └── SKILL.md
├── frontend-design/
│   ├── SKILL.md
│   ├── ux-psychology.md
│   ├── color-system.md
│   ├── typography-system.md
│   └── ...
├── python-patterns/
│   ├── SKILL.md
│   ├── async-patterns.md
│   ├── pydantic-patterns.md
│   └── ...
└── ... (30+ more skills)
```

**Skill Anatomy:**

| Component | Purpose |
|-----------|----------|
| **Frontmatter** | Skill name, description, allowed tools |
| **When to Use** | When skill should be loaded |
| **Content Map** | Supporting files and when to read |
| **Principles** | Core principles and patterns |
| **Decision Trees** | Frameworks for making decisions |
| **Examples** | Practical applications |
| **Anti-Patterns** | What to avoid |
| **Scripts** | Validation and automation (optional) |

**Skill Frontmatter:**

```markdown
---
name: skill-name
description: Brief description
allowed-tools: Read, Write, Edit, Glob, Grep, Bash
---

# Skill Name

> Description of what this skill teaches.
```

### Commands

**Location:** `.opencode/commands/`

**Structure:**
```
commands/
├── engineer.md
├── impl.md
├── plan.md
├── test.md
└── ... (9 more commands)
```

**Command Anatomy:**

| Component | Purpose |
|-----------|----------|
| **Description** | What command does |
| **Workflow** | Step-by-step execution process |
| **Stop Points** | Where to ask for user approval |
| **Examples** | Usage examples |
| **Subtask Flag** | Whether command is independent or sub-command |

### Master Ruleset

**Location:** `.opencode/rules/MASTER.md`

**Structure:**

| Section | Purpose |
|---------|----------|
| **Context & Language** | Language detection and consistency |
| **Question Tool Protocol** | When and how to use question tool |
| **Project Structure** | Directory and file standards |
| **Sprint Documentation** | Documentation requirements |
| **Quality Control** | Validation script order |
| **Final Checklist** | Before task completion |

### Validation Scripts

**Location:** `.opencode/scripts/`

**Purpose:** Automated quality assurance.

| Script | Purpose |
|---------|----------|
| `checklist.py` | Run all validation scripts in order |
| `security_scan.py` | Security vulnerability scanning |
| `lint_runner.py` | Linting and type checking |
| `test_runner.py` | Test execution |
| `ux_audit.py` | UI/UX and accessibility audit |
| `seo_checker.py` | SEO validation |
| `verify_all.py` | Run all scripts with server URL |

---

## Data Flow

### Command Execution Flow

```
User Input
    │
    ▼
┌─────────────────┐
│  OpenCode TUI  │
└───────┬────────┘
        │
        ▼
┌─────────────────┐
│   Command      │
│   (e.g., /plan)│
└───────┬────────┘
        │
        ▼
┌─────────────────┐
│   Agent(s)    │
│   + Skills     │
└───────┬────────┘
        │
        ▼
┌─────────────────┐
│   Output       │
│   (Code, Docs)│
└─────────────────┘
```

### Agent-Skill Interaction

```
Agent Invocation
    │
    ├─→ Load Agent File
    │
    ├─→ Identify Required Skills
    │
    ├─→ Load Skill Files
    │
    ├─→ Apply Skill Knowledge
    │
    └─→ Generate Response
```

### LLM Interaction

```
Agent + Skills
    │
    ├─→ Format as System Prompt
    │
    ├─→ Include Skill Content
    │
    ├─→ Include Agent Context
    │
    ├─→ Send to LLM Provider
    │
    ├─→ Receive Response
    │
    └─→ Process and Output
```

---

## Execution Model

### Command Types

**Independent Commands:**
- Execute without other commands
- Have `subtask: false`
- Examples: `/plan`, `/impl`, `/test`

**Sub-Commands:**
- Invoked by other commands
- Have `subtask: true`
- Examples: Helper workflows within larger commands

### Execution Phases

**Plan-Impl Pattern:**
```
/plan (planning only)
    ↓ STOP (approval)
/impl (implementation)
    ↓ STOP (verification)
/test
```

**Engineer Pattern:**
```
/engineer
    ↓ Phase 1 (planning)
    ↓ STOP (approval)
    ↓ Phase 2 (implementation - parallel agents)
    ├─ P0 (foundation)
    ├─ P1 (core)
    ├─ P2 (UI/UX)
    └─ P3 (polish)
    ↓ STOP (approval)
    ↓ Phase X (verification - all scripts)
```

### Stop Points

Commands use **STOP points** to request user approval:

```markdown
**STOP:** Use the question tool to ask:
> "Plan recorded in `docs/requirements/` and `docs/sprint/Sprint-XX/`. Review it and confirm with 'yes' to proceed with implementation, or tell me what to adjust."

**DO NOT CONTINUE WITHOUT EXPLICIT USER APPROVAL.**
```

---

## Agent Model

### Agent as Persona

An agent is an LLM persona with:

1. **Identity** - Who the agent is (e.g., "Backend Development Architect")
2. **Philosophy** - How they approach problems
3. **Expertise** - What they know
4. **Behaviors** - How they respond

### Agent Invocation

When OpenCode invokes an agent:

1. **Load agent prompt** - Read `.opencode/prompts/<agent-name>.md`
2. **Identify skills** - Frontmatter lists skills to load
3. **Load skills** - Read skill files dynamically
4. **Construct prompt** - Combine agent identity + skills + user request
5. **Send to LLM** - Provider configured in runtime settings
6. **Process response** - Generate output according to agent role

### Agent Specialization

Agents are **domain-specific**:

| Domain | Agent | Key Skills |
|--------|--------|------------|
| Backend | `backend-specialist` | python-patterns, api-patterns, database-design |
| Frontend | `frontend-specialist` | frontend-design, nextjs-react-expert, tailwind-patterns |
| Testing | `test-engineer` | testing-patterns, webapp-testing, tdd-workflow |
| Security | `security-auditor` | vulnerability-scanner, red-team-tactics |

---

## Skill Model

### Skill as Knowledge Module

A skill is a **knowledge container** with:

1. **Principles** - Core concepts
2. **Patterns** - Reusable approaches
3. **Decision Trees** - Frameworks for choices
4. **Examples** - Practical applications
5. **Anti-Patterns** - What to avoid

### Skill Loading

Skills are loaded **on-demand**:

```markdown
## Frontend Specialist

## Key Skills
- `@[skills/frontend-design]` - UI/UX Engine with 50+ styles
- `@[skills/nextjs-react-expert]` - React performance
- `@[skills/tailwind-patterns]` - Tailwind v4 utilities
```

When agent is invoked, skills are:
1. Read from `.opencode/skills/<skill-name>/SKILL.md`
2. Content map identifies relevant supporting files
3. Supporting files read when needed
4. Knowledge integrated into agent prompt

### Skill Granularity

Skills are organized by **topic**, not by task:

- **Good**: `frontend-design` (covers all frontend design)
- **Bad**: `create-button` (too specific)

Benefits:
- Reusable across multiple tasks
- Easier to maintain
- Consistent knowledge base

---

## Orchestration

### Multi-Agent Coordination

The `/engineer` command orchestrates multiple agents:

```
┌─────────────────────────────────────┐
│         Phase 1: Planning          │
│         Agent: project-planner       │
└─────────────┬─────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   Phase 2: Implementation      │
├─────────────────────────────────────┤
│ P0: Parallel execution               │
│ ├── database-architect               │
│ └── security-auditor                │
│                                     │
│ P1: Sequential                    │
│ └── backend-specialist               │
│                                     │
│ P2: Sequential                    │
│ └── frontend-specialist              │
│                                     │
│ P3: Parallel execution               │
│ ├── test-engineer                    │
│ └── performance-optimizer           │
└─────────────┬─────────────────────┘
              │
              ▼
┌─────────────────────────────────────┐
│   Phase X: Verification        │
│   All validation scripts             │
└─────────────────────────────────────┘
```

### Execution Order

| Priority | Phase | Agents | Parallel? |
|----------|--------|---------|----------|
| P0 | Foundation | database-architect, security-auditor | Yes |
| P1 | Core Backend | backend-specialist | No |
| P2 | UI/UX | frontend-specialist | No |
| P3 | Polish | test-engineer, performance-optimizer | Yes |
| Phase X | Verification | All scripts (no agents) | N/A |

### Coordination Protocol

1. **Phase completion** - Each phase has clear completion criteria
2. **STOP points** - User approval between phases
3. **State sharing** - `docs/sprint/Sprint-XX/TASKS.md` tracks progress
4. **Error handling** - Failures stop execution and prompt for direction

---

## Configuration

OpenKit uses `opencode.json` for agent/tool/permission configuration.

Model/provider selection is managed by your OpenCode runtime/environment.

For provider setup and model availability, see:
- https://opencode.ai/docs/providers
- https://opencode.ai/docs/models/

---

## Extensibility

### Adding New Components

OpenKit is designed for easy extension:

| Component | Location | How to Add |
|-----------|--------|------------|
| **Agent Prompt** | `.opencode/prompts/` | Create `.md` file and register in runtime config |
| **Skill** | `.opencode/skills/<name>/` | Create directory with `SKILL.md`, update `ARCHITECTURE.md` |
| **Command** | `.opencode/commands/` | Create `.md` file, implement in `bin/cli.js` |
| **Script** | `.opencode/scripts/` | Create Python script, reference from agents/commands |

### Extension Guidelines

See [EXTENDING.md](EXTENDING.md) for complete guide.

**Key Principles:**
- **Modularity**: Each component is independent
- **On-demand loading**: Skills loaded only when needed
- **Consistency**: Follow existing patterns and conventions
- **Documentation**: Document usage and examples
- **Testing**: Test thoroughly before contributing

### Custom Workflows

Create custom workflows by:

1. **Combining commands**: Use multiple commands in sequence
2. **Creating new commands**: Build on existing patterns
3. **Extending agents**: Add new skills or expertise
4. **Custom rules**: Add team-specific rules in `.opencode/rules/CUSTOM.md`

---

## Related Documentation

- [Agents Reference](AGENTS.md) - Detailed agent documentation
- [Skills Reference](SKILLS.md) - Complete skill reference
- [Commands Reference](COMMANDS.md) - All slash commands
- [Workflows](WORKFLOW.md) - Development workflows
- [Extending OpenKit](EXTENDING.md) - Customization guide
- [Master Ruleset](../.opencode/rules/MASTER.md) - Universal rules

---

## Technical Details

### File Formats

- **Agents**: Markdown (`.md`)
- **Skills**: Markdown (`.md`)
- **Commands**: Markdown (`.md`)
- **Configuration**: JSON (`.json`)
- **Scripts**: Python (`.py`)

### Dependencies

OpenKit CLI dependencies (`package.json`):
- `@opencode-ai/plugin` - OpenCode integration
- `inquirer` - Interactive prompts
- `chalk` - Terminal styling
- `fs-extra` - File operations
- `glob` - Pattern matching

### Node.js Version

Required: `>= 18.0.0`

### Environment Variables

No required environment variables for OpenKit itself.

Agents/commands may use project-specific env vars as needed.

---

## Design Principles

### Core Principles

1. **Modularity**: Each component is independent
2. **On-demand**: Skills loaded only when needed
3. **Single source of truth**: Keep runtime settings centralized
4. **Universal rules**: All follow MASTER.md
5. **User control**: Always ask preferences, never assume

### Anti-Patterns

**Don't:**
- Hardcode specific technologies
- Skip user preferences
- Mix concerns in single component
- Create tightly coupled system

**Do:**
- Use decision frameworks
- Provide options with trade-offs
- Document rationale
- Make components reusable

---

## Need Help?

- **GitHub Issues**: [github.com/paulojalowyj/openkit/issues](https://github.com/paulojalowyj/openkit/issues)
- **Discussions**: [github.com/paulojalowyj/openkit/discussions](https://github.com/paulojalowyj/openkit/discussions)
- **OpenCode Documentation**: [opencode.ai/docs](https://opencode.ai/docs)

---

## License

MIT License - See [LICENSE](../LICENSE) for details.
