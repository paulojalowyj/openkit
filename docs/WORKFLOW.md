# OpenKit Workflows

> Development workflows and best practices for the OpenKit system.

---

## Table of Contents

| Workflow | Description |
|----------|-------------|
| **[Standard Development Workflow](#standard-development-workflow)** | Plan → Implement → Test → Deploy |
| **[Engineer Command Workflow](#engineer-command-workflow)** | Orchestrated multi-agent workflow |
| **[Task Planning Workflow](#task-planning-workflow)** | Creating plans with /plan command |
| **[Implementation Workflow](#implementation-workflow)** | Executing plans with /impl command |
| **[Testing Workflow](#testing-workflow)** | Quality assurance with /test command |
| **[Deployment Workflow](#deployment-workflow)** | Safe deployment with /deploy command |
| **[Debugging Workflow](#debugging-workflow)** | Root cause analysis with /debug command |
| **[Stack Selection Workflow](#stack-selection-workflow)** | Choosing technologies for new projects |

---

## Standard Development Workflow

The standard OpenKit development workflow follows a clear progression from planning to deployment.

```
┌─────────────┐
│  Planning   │
│  ( /plan )  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│Implementation│
│ ( /impl )   │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│   Testing   │
│  ( /test )  │
└──────┬──────┘
       │
       ▼
┌─────────────┐
│ Deployment  │
│ ( /deploy ) │
└─────────────┘
```

### When to Use Standard Workflow

- Feature development
- Bug fixes
- Incremental improvements
- Routine tasks

### Advantages

- Clear progression
- Checkpoints between phases
- Flexibility to adjust at each stage
- Separation of concerns

---

## Engineer Command Workflow

The `/engineer` command combines planning and execution in one orchestrated workflow.

```
/engineer build user authentication system

┌─────────────────────────────────────────┐
│ Phase 1: Planning                      │
│ Agent: project-planner                  │
├─────────────────────────────────────────┤
│ • Requirements analysis                 │
│ • Tech stack selection                 │
│ • Architecture decisions                │
│ • Create docs/requirements/            │
│ • Create docs/sprint/Sprint-XX/       │
└─────────────────────────────────────────┘
                │
                ▼
         ┌───────────┐
         │   STOP    │
         │ Approval?  │
         └─────┬─────┘
               │
         Yes ──┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Phase 2: Implementation (Parallel)   │
├─────────────────────────────────────────┤
│ P0 (Foundation):                       │
│ • database-architect                   │
│ • security-auditor                    │
│                                       │
│ P1 (Core Backend):                     │
│ • backend-specialist                   │
│                                       │
│ P2 (UI/UX):                         │
│ • frontend-specialist                  │
│                                       │
│ P3 (Polish):                         │
│ • test-engineer                      │
│ • performance-optimizer                │
└─────────────────────────────────────────┘
                │
                ▼
         ┌───────────┐
         │   STOP    │
         │ Approval?  │
         └─────┬─────┘
               │
         Yes ──┘
               │
               ▼
┌─────────────────────────────────────────┐
│ Phase X: Verification (All Scripts)  │
├─────────────────────────────────────────┤
│ • Security scan                        │
│ • Lint & type check                   │
│ • UX audit                            │
│ • Lighthouse audit                      │
│ • Playwright E2E                      │
└─────────────────────────────────────────┘
```

### Execution Order (P0 → P1 → P2 → P3 → Phase X)

| Priority | Phase | Agents | When Complete |
|----------|--------|---------|---------------|
| P0 | Foundation | `database-architect`, `security-auditor` | STOP: Ask user |
| P1 | Core Backend | `backend-specialist` | STOP: Ask user |
| P2 | UI/UX | `frontend-specialist` | STOP: Ask user |
| P3 | Polish | `test-engineer`, `performance-optimizer` | STOP: Ask user |
| Phase X | Verification | All scripts | Complete |

### When to Use Engineer Workflow

- Complex, multi-domain tasks
- Full-stack features (backend + frontend + database + security)
- Architectural decisions + implementation
- Projects requiring coordination of multiple specialists

### Advantages

- Orchestrated multi-agent coordination
- Clear separation of concerns
- Checkpoints between phases
- Automatic verification scripts

### Disadvantages

- Slower for simple tasks
- Overkill for single-domain changes
- Multiple stop points

---

## Task Planning Workflow

The `/plan` command creates structured plans with INPUT→OUTPUT→VERIFY criteria and follows SDD prerequisites.

```
/specify create user authentication
/clarify
/plan create user authentication

1. Stack Selection (NEW PROJECTS ONLY)
   ├─ Check existing stack
   └─ Ask user preferences

2. Socratic Gate
   ├─ Use question tool for clarifications
   ├─ Gather context
   └─ Identify requirements

   3. Plan Creation
    ├─ Create docs/requirements/<feature>/
    │  ├─ PROBLEM_STATEMENT.md
    │  ├─ USER_STORIES.md
    │  ├─ ACCEPTANCE_CRITERIA.md
    │  ├─ DATA_CONTRACTS.md
    │  ├─ RISKS.md
    │  └─ PLAN.md
   │
   ├─ Ask user about sprint (latest or new)
    └─ Create docs/sprint/Sprint-XX/
       ├─ SPRINT_GOAL.md
       ├─ BACKLOG.md
       ├─ TASKS.md (INPUT→OUTPUT→VERIFY)
       └─ RISK_REGISTER.md

4. STOP: Ask for approval
```

### Documentation Standard

**Requirements** (`docs/requirements/<feature>/`):

| File | Purpose |
|------|----------|
| `PROBLEM_STATEMENT.md` | What problem are we solving? |
| `USER_STORIES.md` | Who are the users and what do they want? |
| `ACCEPTANCE_CRITERIA.md` | Definition of done |
| `DATA_CONTRACTS.md` | Data structures and interfaces |
| `RISKS.md` | Potential risks and mitigations |
| `PLAN.md` | Implementation plan and rollout |

**Sprint** (`docs/sprint/Sprint-XX/`):

| File | Purpose |
|------|----------|
| `SPRINT_GOAL.md` | What's the sprint objective? |
| `BACKLOG.md` | What stories are in the sprint? |
| `TASKS.md` | INPUT→OUTPUT→VERIFY task breakdown |
| `RISK_REGISTER.md` | What could go wrong? |

### When to Use Plan Workflow

- Planning new features
- Creating sprint plans
- Breaking down complex tasks
- Defining requirements and acceptance criteria

### Advantages

- Clear documentation structure
- Sprint alignment
- Risk identification
- Verification criteria built in

---

## Implementation Workflow

The `/impl` command executes plans with safe code changes.

```
/impl

1. Analysis & Preparation
   ├─ Read docs/sprint/ and docs/requirements/
   ├─ Identify scope (new feature vs update)
   └─ Load state

2. Execution (The Loop)
   ├─ For New Features (Codegen Mode):
   │  ├─ Load appropriate skills
   │  ├─ Write complete code (no TODOs)
   │  ├─ Update docs if needed
   │  └─ Update TASKS.md status
   │
   └─ For Updates (Enhance Mode):
      ├─ Determine affected files
      ├─ Present plan if complex
      ├─ Apply changes safely
      └─ Verify locally

3. Progress Updates
   └─ Mark tasks in docs/sprint/Sprint-XX/TASKS.md as completed

4. STOP: Ask to run final verification
```

### Execution Modes

**Codegen Mode (New Features):**
- Write complete, production-ready code
- No TODO comments
- Strict typing
- Proper error handling
- Update docs/requirements/ and TASKS.md

**Enhance Mode (Updates):**
- Modify existing code
- Present plan if complex
- Apply changes safely
- Verify functionality

### When to Use Implementation Workflow

- Implementing features from existing plans
- Making incremental changes
- Executing specific tasks from TASKS.md

---

## Testing Workflow

The `/test` command runs quality assurance checks.

```
/test

1. Test Execution
   ├─ Unit tests (Vitest, Jest, Pytest)
   ├─ Integration tests
   └─ E2E tests (Playwright)

2. Quality Checks
   ├─ Linting (ESLint, Ruff)
   ├─ Type checking (tsc, mypy)
   └─ Security scan (if backend)

3. Coverage Report
   ├─ Generate coverage report
   └─ Identify gaps
```

### Validation Order

1. **Security** → 2. **Lint** → 3. **Type Check** → 4. **Tests** → 5. **UX** → 6. **SEO** → 7. **Lighthouse/E2E**

### All-in-One Command

```bash
python .opencode/scripts/verify_all.py . --url http://localhost:3000
```

### When to Use Testing Workflow

- Running all tests before deployment
- Checking code quality
- Validating implementation
- Pre-deployment verification

---

## Deployment Workflow

The `/deploy` command manages safe production deployments.

```
/deploy production

1. Pre-Deployment
   ├─ Run all tests
   ├─ Security scan
   ├─ Verify build
   └─ Create rollback plan

2. Deployment
   ├─ Blue-green or canary deployment
   ├─ Zero-downtime strategy
   └─ Monitor during rollout

3. Post-Deployment Verification
   ├─ Health checks
   ├─ Smoke tests
   ├─ Monitor metrics
   ├─ Check logs for errors
   └─ Verify functionality

4. Rollback (if needed)
   ├─ Execute rollback plan
   ├─ Investigate failure
   └─ Plan next deployment
```

### Deployment Strategies

| Strategy | Description | Use When |
|----------|-------------|-----------|
| **Blue-Green** | Deploy to green, switch when verified, instant rollback to blue | Critical systems, instant rollback needed |
| **Canary** | Deploy to small percentage, monitor, gradual rollout | Risk mitigation, gradual rollout |
| **Rolling** | Replace instances gradually, zero downtime | Stateless services, gradual risk |

### When to Use Deployment Workflow

- Deploying to production
- Deploying to staging
- Setting up deployment pipelines
- Rolling back deployments

---

## Debugging Workflow

The `/debug` command performs 4-phase systematic debugging.

```
/debug investigate authentication failure

Phase 1: Evidence Collection
├─ Gather logs
├─ Collect error messages
├─ Identify when/where it occurs
└─ Reproduce issue

Phase 2: Hypothesis Generation
├─ Brainstorm potential causes
├─ Narrow down to most likely
└─ Formulate hypothesis

Phase 3: Verification
├─ Test hypothesis
├─ Verify root cause
├─ Eliminate false leads
└─ Confirm true cause

Phase 4: Solution & Verification
├─ Implement fix
├─ Verify fix resolves issue
├─ Add tests to prevent regression
└─ Document findings
```

### When to Use Debugging Workflow

- Investigating complex errors
- Debugging production issues
- Analyzing bugs
- Root cause analysis

---

## Stack Selection Workflow

For new projects, use the `stack-selection` skill to choose technologies.

```
New Project Setup

1. Check for Existing Stack
   ├─ Look for package.json, pyproject.toml, go.mod
   └─ If exists, maintain consistency

2. Context Analysis
   ├─ What are you building?
   ├─ What's the scale?
   ├─ What's the timeline?
   ├─ What's your team expertise?
   └─ Any constraints?

3. Ask User Preferences
   ├─ "Do you have any tech stack preferences?"
   ├─ Options: "I have specific preferences" or "Suggest based on requirements"

4. If User Wants Suggestions
   ├─ Use decision trees from stack-selection skill
   ├─ Provide options with trade-offs
   └─ Explain rationale

5. Document Decision
   ├─ Create docs/requirements/<feature>/TechStack.md
   ├─ Frontend stack
   ├─ Backend stack
   ├─ Infrastructure
   └─ Rationale for each choice
```

### Decision Trees

The `stack-selection` skill provides decision trees for:

**Backend:**
- Framework selection (FastAPI, Django, Flask, Express, Hono, etc.)
- Database selection (PostgreSQL, MySQL, SQLite, MongoDB, serverless)
- ORM selection (SQLAlchemy, Prisma, Drizzle, etc.)

**Frontend:**
- Framework selection (React, Next.js, Vue, Svelte, etc.)
- State management (TanStack Query, Redux, Zustand, Context, etc.)
- UI library (ShadcnUI, Radix UI, Mantine, etc.)
- Styling (Tailwind, styled-components, CSS Modules, etc.)

### When to Use Stack Selection Workflow

- Starting a new project (no existing code)
- Adding a new feature with different stack options
- User asks "what stack should I use?"
- Migration between technologies

---

## Workflow Comparison

| Workflow | Speed | Coordination | Complexity | Use Case |
|-----------|--------|---------------|-------------|-----------|
| **Standard** | Fast | Low | Low | Routine tasks, simple features |
| **Engineer** | Slow | High | High | Complex multi-domain tasks |
| **Plan → Impl** | Medium | Low | Medium | Planned features |
| **Debug** | Variable | Low | High | Troubleshooting |

---

## Workflow Checklist

### Before Starting Any Workflow

- [ ] Check for existing code and stack
- [ ] Understand requirements fully
- [ ] Identify appropriate workflow
- [ ] Verify OpenKit is installed

### During Workflow

- [ ] Follow workflow steps
- [ ] Update documentation as you go
- [ ] Use question tool for decisions
- [ ] Maintain stack consistency

### After Workflow

- [ ] Run quality checks
- [ ] Update task status in TASKS.md
- [ ] Document any learnings
- [ ] Update relevant docs/

---

## Workflow Selection Guide

| Situation | Recommended Workflow |
|------------|-------------------|
| **New feature, simple** | `/plan` → `/impl` |
| **New feature, complex** | `/engineer` |
| **Bug fix** | `/debug` |
| **Quick change** | `/impl` (no plan) |
| **Full-stack feature** | `/engineer` |
| **UI design only** | `/ui-ux` |
| **Deploy to production** | `/deploy` |
| **Run tests** | `/test` |
| **Check progress** | `/status` |

---

## Related Documentation

- [Commands Reference](COMMANDS.md) - Detailed command documentation
- [Agents Reference](AGENTS.md) - Agents that execute workflows
- [Skills Reference](SKILLS.md) - Skills loaded during workflows
- [Architecture](ARCHITECTURE.md) - System architecture
