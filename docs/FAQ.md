# Frequently Asked Questions

> Common questions and troubleshooting for OpenKit.

---

## Table of Contents

| Topic | Questions |
|--------|------------|
| **[Getting Started](#getting-started)** | Installation, initialization, setup |
| **[Usage](#usage)** | Commands, agents, skills |
| **[Stack Selection](#stack-selection)** | Tech stack decisions |
| **[Architecture](#architecture)** | How it works internally |
| **[Troubleshooting](#troubleshooting)** | Common issues and solutions |
| **[Advanced](#advanced)** | Customization, extensions |

---

## Getting Started

### How do I install OpenKit?

```bash
# Install in your project
npx @paulojalowyj/openkit init

# Or with a blueprint
npx @paulojalowyj/openkit init --blueprint fullstack
```

### What gets installed?

OpenKit installs:

```
.opencode/              # Agent system
├── prompts/            # Agent prompts
├── skills/             # 33+ domain skills
├── commands/           # 18 slash commands
├── scripts/            # Validation scripts
└── rules/             # Master ruleset (MASTER.md)
opencode.json           # OpenCode runtime configuration
```

### Do I need OpenCode?

Yes. OpenKit requires the [OpenCode CLI](https://opencode.ai/docs) to execute commands and manage agents.

Install OpenCode:
```bash
npm install -g @opencode-ai/cli

# Or use the desktop app or IDE extension
# See https://opencode.ai/docs for options
```

### What LLM providers are supported?

OpenCode (and thus OpenKit) supports 75+ LLM providers including:
- OpenAI (GPT-4, etc.)
- Anthropic (Claude)
- Google (Gemini)
- Local models (Ollama, LM Studio, etc.)
- Many more...

See [OpenCode documentation](https://opencode.ai/docs/providers) for complete list.

### How do I configure models?

Model selection is managed by your OpenCode runtime/environment. OpenKit does not enforce model suggestions.

For provider setup and available model names, see:
- [Providers Documentation](https://opencode.ai/docs/providers)
- [Models Reference](https://opencode.ai/docs/models/)

---

## Usage

### How do I use OpenKit commands?

1. Start OpenCode CLI: `opencode`
2. Use slash commands in the terminal:
   ```
   /plan create user authentication
   /impl
   /test
   /deploy
   ```

### What's the difference between /engineer and /impl?

| Command | Use Case | Complexity |
|---------|-----------|------------|
| `/engineer` | Complex, multi-domain tasks | High |
| `/impl` | Execute plans or make changes | Medium |
| `/plan` → `/impl` | Planned feature development | Low |

**Rule of thumb:**
- Use `/engineer` for complex features requiring multiple specialists
- Use `/plan` → `/impl` for standard feature development
- Use `/impl` alone for incremental changes

### How do I choose which command to use?

See [WORKFLOW.md](WORKFLOW.md#workflow-selection-guide):

| Situation | Command |
|------------|----------|
| **New feature, simple** | `/plan` → `/impl` |
| **New feature, complex** | `/engineer` |
| **Bug fix** | `/debug` |
| **Quick change** | `/impl` |
| **Full-stack feature** | `/engineer` |
| **UI design only** | `/ui-ux` |
| **Deploy to production** | `/deploy` |
| **Run tests** | `/test` |
| **Check progress** | `/status` |

### Can I use multiple commands in one session?

Yes. You can chain commands:

```
/plan create user profile
# (Wait for approval)
/impl
# (Wait for completion)
/test
/deploy
```

Or use `/engineer` for full workflow in one command.

### How do I see what agents and skills are available?

- **Agents**: See [docs/AGENTS.md](AGENTS.md)
- **Skills**: See [docs/SKILLS.md](SKILLS.md)
- **Commands**: See [docs/COMMANDS.md](COMMANDS.md)

Or in terminal:
```
/ls agents
/ls skills
/ls commands
```

---

## Stack Selection

### Does OpenKit force a specific stack?

No. OpenKit uses a **flexible stack selection** approach:

1. Check existing stack
2. Ask user preferences
3. Suggest based on requirements (if user wants)
4. Document decision in `docs/requirements/<feature>/TechStack.md`

See [stack-selection skill](../.opencode/skills/stack-selection/SKILL.md) for details.

### What about the Fullstack Blueprint?

The Fullstack Blueprint in `@blueprints/fullstack/` is an **example**, not a requirement.

Use it as reference for:
- Production-ready structure
- Best practices for React + FastAPI
- Docker Compose configurations
- Example implementation

### Can I use a different stack than the blueprint?

Yes! OpenKit supports:

- **Frontend**: React, Next.js, Vue, Svelte, etc.
- **Backend**: FastAPI, Django, Express, Hono, etc.
- **Database**: PostgreSQL, MySQL, MongoDB, SQLite, serverless, etc.
- **State**: TanStack Query, Redux, Zustand, Context, etc.
- **UI**: ShadcnUI, Radix UI, Mantine, Material UI, etc.

See [stack-selection skill](../.opencode/skills/stack-selection/SKILL.md) for decision trees.

### How do I change the stack for an existing project?

If you want to change the stack:

1. Use `/brainstorm` to explore options
2. Document new stack decision in `docs/requirements/<feature>/TechStack.md`
3. Plan migration approach
4. Execute migration in phases

Example:
```
/brainstorm migrate from React to Vue
/plan migration to Vue 3
/impl
```

---

## Architecture

### How do agents work?

Agents are LLM-powered personas with:

1. **Philosophy** - How they approach problems
2. **Mindset** - How they think
3. **Expertise** - Technical knowledge
4. **Skills** - Domain-specific knowledge loaded on-demand

When invoked, agents:
1. Load relevant skills
2. Follow Master Ruleset
3. Execute tasks based on their expertise
4. Use question tool for user decisions

### How do skills work?

Skills are knowledge modules containing:

- Principles and patterns
- Decision trees
- Best practices
- Examples and templates

Skills are **loaded on-demand** by agents. For example:
- `backend-specialist` loads `python-patterns`, `api-patterns`
- `frontend-specialist` loads `frontend-design`, `nextjs-react-expert`

### What are the Master Ruleset?

The Master Ruleset (`MASTER.md`) contains universal rules for:

- Language consistency
- Question tool protocol
- Project structure
- Documentation standards
- Quality control

**All agents and commands must follow these rules.**

### How does orchestration work?

The `/engineer` command orchestrates multiple agents:

```
Phase 1: Planning (project-planner)
Phase 2: Implementation (parallel agents)
├─ P0: database-architect + security-auditor
├─ P1: backend-specialist
├─ P2: frontend-specialist
└─ P3: test-engineer + performance-optimizer
Phase X: Verification (all scripts)
```

Each phase has a **STOP point** asking for user approval.

---

## Troubleshooting

### OpenKit commands not found in OpenCode

**Problem:** Commands like `/plan` don't work in OpenCode.

**Solution:**
1. Verify OpenKit is installed: Check `.opencode/` exists
2. Restart OpenCode: Exit and restart CLI
3. Clear OpenCode cache: Check OpenCode documentation for cache location
4. Update OpenKit: `npm update @paulojalowyj/openkit`

### Agent doesn't follow rules

**Problem:** Agent not following expected behavior (e.g., not asking about stack).

**Solution:**
1. Verify prompt file is correct: Check `.opencode/prompts/<agent-name>.md`
2. Check MASTER.md is present: `.opencode/rules/MASTER.md`
3. Verify rule files and prompts are updated and loaded
4. Restart OpenCode session to refresh runtime context

### Scripts not executing

**Problem:** Validation scripts not running or failing.

**Solution:**
1. Check Python version: Requires Python 3.8+
2. Install dependencies: Check `requirements.txt` in scripts
3. Check permissions: Ensure scripts are executable
4. Run manually: `python .opencode/scripts/<script>.py .`

### Memory/Context limits

**Problem:** LLM not seeing all files or context.

**Solution:**
1. Use `/context` command to generate focused context pack
2. Be specific with requests: Narrow down scope
3. Use smaller models for context: Save larger models for execution
4. Use document references: Point to relevant docs instead of including all content

### Errors from OpenCode

**Problem:** OpenCode throwing errors about OpenKit.

**Solution:**
1. Check OpenKit version: Latest version may fix the issue
2. Check OpenCode version: Ensure compatibility
3. File an issue: [GitHub Issues](https://github.com/paulojalowyj/openkit/issues) with details

---

## Advanced

### Can I create custom agents?

Yes! See [EXTENDING.md](EXTENDING.md#creating-custom-agents) for complete guide.

Quick steps:
1. Create `.opencode/prompts/<agent-name>.md`
2. Define philosophy, mindset, expertise
3. Add agent registration to your runtime configuration
4. Update `.opencode/ARCHITECTURE.md`
5. Test thoroughly

### Can I create custom skills?

Yes! See [EXTENDING.md](EXTENDING.md#creating-custom-skills) for complete guide.

Quick steps:
1. Create `.opencode/skills/<skill-name>/`
2. Write main `SKILL.md` with content map
3. Create supporting files
4. Update `.opencode/ARCHITECTURE.md`
5. Test with agents

### Can I create custom commands?

Yes! See [EXTENDING.md](EXTENDING.md#creating-custom-commands) for complete guide.

Quick steps:
1. Create `.opencode/commands/<command>.md`
2. Define workflow and examples
3. Update `.opencode/ARCHITECTURE.md`
4. Implement in `bin/cli.js` if needed
5. Test thoroughly

### Can I customize the Master Ruleset?

You can **extend** the ruleset but shouldn't modify core rules.

To add custom rules:
1. Create `.opencode/rules/CUSTOM.md`
2. Add your team-specific rules
3. Reference from agent files

**Note:** Core rules in `MASTER.md` ensure system consistency. Modify carefully.

### How do I integrate with CI/CD?

Add OpenKit verification to your CI/CD:

```yaml
# GitHub Actions example
- name: OpenKit Validation
  run: |
    python .opencode/scripts/verify_all.py . --url ${{DEPLOY_URL}}
```

### How do I use OpenKit for code review?

Use the `/doc` command or specialized agents:

```bash
# Review code
opencode chat "Act as backend-specialist. Review this file: src/app/main.py"

# Run security audit
python .opencode/skills/vulnerability-scanner/scripts/security_scan.py .

# Run checklist
python .opencode/scripts/checklist.py .
```

---

## Still Need Help?

- **GitHub Issues**: [github.com/paulojalowyj/openkit/issues](https://github.com/paulojalowyj/openkit/issues)
- **Discussions**: [github.com/paulojalowyj/openkit/discussions](https://github.com/paulojalowyj/openkit/discussions)
- **OpenCode Documentation**: [opencode.ai/docs](https://opencode.ai/docs)
- **Architecture**: [.opencode/ARCHITECTURE.md](../.opencode/ARCHITECTURE.md)
- **Master Ruleset**: [.opencode/rules/MASTER.md](../.opencode/rules/MASTER.md)

---

## Related Documentation

- [Getting Started](../README.md) - Quick start guide
- [Agents Reference](AGENTS.md) - All 15 agents
- [Skills Reference](SKILLS.md) - 33+ skills
- [Commands Reference](COMMANDS.md) - 18 commands
- [Workflows](WORKFLOW.md) - Development workflows
- [Extending OpenKit](EXTENDING.md) - Customization guide
- [Contributing](CONTRIBUTING.md) - How to contribute
