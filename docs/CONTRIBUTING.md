# Contributing to OpenKit

> Guide to contributing code, agents, skills, and commands to OpenKit.

---

## How to Contribute

There are many ways to contribute to OpenKit:

| Type | Description | How to Contribute |
|-------|-------------|-------------------|
| **Bug Reports** | Report bugs or issues | [Open an Issue](https://github.com/paulojalowyj/openkit/issues) |
| **Feature Requests** | Suggest new features | [Open an Issue](https://github.com/paulojalowyj/openkit/issues) |
| **Code Contributions** | Fix bugs, add features | Submit a Pull Request |
| **Documentation** | Improve docs, fix typos | Submit a PR to `docs/` |
| **New Agents** | Add specialized agents | Submit a PR to `.opencode/prompts/` |
| **New Skills** | Add domain knowledge | Submit a PR to `.opencode/skills/` |
| **New Commands** | Add slash commands | Submit a PR to `.opencode/commands/` |
| **New Blueprints** | Add project blueprints | Submit a PR to `blueprints/` |

---

## Reporting Bugs

When reporting bugs, provide:

### Bug Template

```markdown
**Description:**
[Brief description of the bug]

**Steps to Reproduce:**
1. [Step 1]
2. [Step 2]
3. [Step 3]

**Expected Behavior:**
[What should happen]

**Actual Behavior:**
[What actually happens]

**Environment:**
- Node.js version: [e.g., 20.0.0]
- OpenKit version: [e.g., 1.1.23]
- Operating system: [e.g., macOS, Linux, Windows]
- LLM Provider: [e.g., OpenAI, Claude, Local]

**Logs/Error Messages:**
[Any relevant logs or error messages]
```

---

## Suggesting Features

When suggesting features, provide:

### Feature Template

```markdown
**Title:** [Clear, concise title]

**Problem:**
[What problem does this solve?]

**Proposed Solution:**
[How should it work?]

**Alternatives Considered:**
[What other approaches did you consider?]

**Use Cases:**
[Specific examples of when this would be useful]

**Additional Context:**
[Any other relevant information]
```

---

## Code Contributions

### Getting Started

1. **Fork the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/openkit.git
   cd openkit
   ```

2. **Create a branch**
   ```bash
   git checkout -b feat/your-feature-name
   # or
   git checkout -b fix/issue-number
   ```

3. **Make your changes**

4. **Test your changes**
   ```bash
   npm install
   npm test
   ```

5. **Commit your changes**
   ```bash
   git add .
   git commit -m "feat: add new feature"
   ```

6. **Push to your fork**
   ```bash
   git push origin feat/your-feature-name
   ```

7. **Create Pull Request**
   - Go to GitHub
   - Click "New Pull Request"
   - Fill out PR template

### Commit Message Format

Follow conventional commits:

| Type | Description |
|-------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation changes |
| `style` | Code style changes (formatting) |
| `refactor` | Code refactoring |
| `test` | Test additions or changes |
| `chore` | Maintenance tasks |
| `perf` | Performance improvements |
| `ci` | CI/CD changes |

Examples:
```bash
git commit -m "feat: add new agent for mobile development"
git commit -m "fix: resolve issue with stack-selection skill"
git commit -m "docs: update contributing guidelines"
git commit -m "refactor: improve agent orchestration logic"
```

### Code Style

Follow these guidelines:

- **Clean Code**: Follow `@[skills/clean-code]` principles
- **Functions**: ≤ 20 lines, max 3 arguments
- **Naming**: Descriptive, consistent
- **Comments**: Use sparingly, let code be self-documenting
- **Formatting**: Consistent with existing code
- **Type Safety**: Use TypeScript types, no `any`
- **Error Handling**: Proper error handling throughout

### Testing

- Write tests for new features
- Test on multiple platforms (macOS, Linux, Windows)
- Test with different LLM providers
- Ensure existing tests still pass

---

## Contributing Agents

### Agent Structure

An agent file follows this structure:

```markdown
# Agent Name

## Your Philosophy
[Brief description of agent's approach]

## Your Mindset
[How agent thinks about problems]

## What You Do
[What agent is responsible for]

## Key Skills
[Skills agent loads]

## When to Use
[When to invoke this agent]
```

### Creating a New Agent

1. **Define the domain** - What is the agent responsible for?
2. **Identify skills** - What domain skills should it load?
3. **Write the philosophy** - How does the agent approach problems?
4. **Document expertise** - What does the agent know?
5. **Define when to use** - When should this agent be invoked?
6. **Update ARCHITECTURE.md** - Add agent to the list

### Example: Creating a Data Scientist Agent

```markdown
# Data Scientist

## Your Philosophy
**Data science is not just algorithms—it's business insight.** Every analysis should answer a business question.

## Your Mindset
When analyzing data, I think:
- **Questions over data**: Understand the problem first
- **Visualization is key**: Show, don't just tell
- **Model simplicity**: Start simple, add complexity only if needed
- **Validation is critical**: Never trust results without verification

## What You Do
- Exploratory data analysis
- Feature engineering
- Model selection and training
- Model evaluation and validation
- Insight extraction and communication

## Key Skills
- ML/AI best practices
- Statistical analysis
- Data visualization

## When to Use
- Analyzing datasets
- Building ML models
- Extracting insights from data
- Creating data visualizations
```

---

## Contributing Skills

### Skill Structure

A skill file follows this structure:

```markdown
---
name: skill-name
description: Brief description of skill purpose
allowed-tools: Read, Write, Edit, Glob, Grep, Bash, etc.
---

# Skill Name

> Brief description of what this skill teaches.

---

## When to Use This Skill

Use this skill when:
- [Use case 1]
- [Use case 2]
- [Use case 3]

---

## Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `file1.md` | Description | When to read |
| `file2.md` | Description | When to read |
```

### Creating a New Skill

1. **Define the domain** - What knowledge does this skill provide?
2. **Identify files** - What supporting files are needed?
3. **Write content** - Use clear, principle-based teaching
4. **Teach thinking, not patterns** - Focus on decision-making
5. **Add examples** - Show how to apply principles
6. **Create content map** - List supporting files
7. **Update ARCHITECTURE.md** - Add skill to the list

### Example: Creating a GraphQL Skill

```markdown
---
name: graphql-patterns
description: GraphQL design principles and best practices
allowed-tools: Read, Write, Edit, Glob, Grep
---

# GraphQL Patterns

> GraphQL design principles and best practices.
> **Teaches thinking, not fixed patterns.**

---

## When to Use This Skill

Use this skill when:
- Designing GraphQL schemas
- Implementing GraphQL resolvers
- Optimizing GraphQL queries
- GraphQL authentication/authorization

---

## Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `schema-design.md` | Schema design principles | Designing schemas |
| `resolvers.md` | Resolver patterns | Implementing resolvers |
| `optimization.md` | Query optimization | Performance issues |
| `security.md` | Security best practices | Adding auth/authorization |

---

# Schema Design

## Principles
1. **Think in types**: Model your domain, not your tables
2. **Granular resolvers**: Keep resolvers small and focused
3. **N+1 prevention**: Use data loaders for related data
4. **Mutations**: Separate read and write concerns

## Anti-Patterns
 **Don't:** Mirror database schema exactly
 **Do:** Design schema based on UI and domain needs

## Example
[Show example schema with explanation]
```

---

## Contributing Commands

### Command Structure

A command file follows this structure:

```markdown
---
description: Brief description of command
subtask: false/true
---

# COMMAND NAME ACTIVATED

**User input:** $ARGUMENTS

## Workflow

[Step-by-step workflow]

## Examples

[Bash examples]
```

### Creating a New Command

1. **Define the purpose** - What does this command do?
2. **Identify agents** - Which agents should it invoke?
3. **Design the workflow** - What steps should it follow?
4. **Add stop points** - Where should it ask for user approval?
5. **Document examples** - Show how to use the command
6. **Update ARCHITECTURE.md** - Add command to the list

### Example: Creating a /refactor Command

```markdown
---
description: Refactor code following clean-code principles
subtask: false
---

# /refactor - Refactoring

**User input:** $ARGUMENTS

## Workflow

1. Identify what to refactor
2. Analyze code for violations
3. Propose refactoring plan
4. Execute refactoring
5. Run tests to verify

## Examples

```bash
# Refactor entire file
/refactor src/components/UserCard.tsx

# Refactor specific function
/refactor refactor validateUser function
```
```

---

## Contributing Blueprints

### Blueprint Structure

A blueprint follows this structure:

```
blueprints/<name>/
├── README.md          # Overview and quick start
├── AGENTS.md          # Blueprint-specific agents (optional)
├── backend/
│   ├── app/
│   │   ├── api/
│   │   ├── core/
│   │   ├── models/
│   │   ├── routers/
│   │   ├── schemas/
│   │   └── services/
│   ├── Dockerfile
│   └── pyproject.toml
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── lib/
│   │   └── routes/
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   └── vite.config.ts
├── docker-compose.dev.yml
└── docker-compose.prod.yml
```

### Creating a New Blueprint

See [BLUEPRINTS.md](BLUEPRINTS.md#creating-custom-blueprints) for details.

---

## Contributing Documentation

### Documentation Structure

Documentation is located in `docs/`:

```
docs/
├── README.md              # Documentation index
├── ARCHITECTURE.md        # Technical framework details
├── AGENTS.md              # Agent reference
├── SKILLS.md              # Skill reference
├── COMMANDS.md            # Command reference
├── WORKFLOW.md            # Development workflows
├── BLUEPRINTS.md          # Blueprint reference
├── CONTRIBUTING.md        # This file
├── EXTENDING.md           # How to extend OpenKit
└── FAQ.md                # Frequently asked questions
```

### Improving Documentation

1. **Fix typos or grammar** - Small edits welcome
2. **Add examples** - More examples help users
3. **Clarify sections** - Make unclear sections clearer
4. **Update outdated info** - Keep docs current
5. **Add visual aids** - Diagrams, screenshots help

---

## Contribution Checklist

Before submitting a PR, verify:

- [ ] **Tests pass** - All tests passing
- [ ] **Linting passes** - No linting errors
- [ ] **Code follows style** - Consistent with existing code
- [ ] **Documentation updated** - Relevant docs updated
- [ ] **Commits are clear** - Conventional commit format
- [ ] **Branch is up to date** - Synced with main branch
- [ ] **PR description is complete** - Explains what and why

---

## Design Guidelines

When contributing to UI/UX:

- **Follow frontend-design principles** - Use `@[skills/frontend-design]`
- **Accessibility first** - Ensure WCAG compliance
- **Mobile responsive** - Design mobile-first
- **Color contrast** - Meet WCAG AA standards
- **Keyboard navigation** - Ensure all features work with keyboard
- **Performance** - Optimize for speed and bundle size

---

## Security Guidelines

When contributing security-related code:

- **Follow security-auditor principles** - Use `@[skills/vulnerability-scanner]`
- **Validate all inputs** - Never trust user input
- **Use parameterized queries** - Prevent SQL injection
- **Sanitize output** - Prevent XSS
- **Use secure headers** - Follow OWASP guidelines
- **Keep dependencies updated** - Regular dependency audits
- **Never commit secrets** - Use environment variables

---

## Community Guidelines

- **Be respectful** - Treat everyone with respect
- **Be constructive** - Focus on what is best for the project
- **Be patient** - Not everyone responds immediately
- **Welcome newcomers** - Help new contributors get started
- **Focus on what, not who** - Discuss code and ideas, not people
- **Give credit** - Acknowledge contributions

---

## Getting Help

- **GitHub Issues**: [github.com/paulojalowyj/openkit/issues](https://github.com/paulojalowyj/openkit/issues)
- **Discussions**: [github.com/paulojalowyj/openkit/discussions](https://github.com/paulojalowyj/openkit/discussions)

---

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

## Thank You!

Thank you for contributing to OpenKit! Every contribution helps make this project better for everyone.
