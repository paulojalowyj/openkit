# OpenKit Commands

> Complete reference to all 18 slash commands in the OpenKit system.

---

## Table of Contents

| Command | Purpose | Agent |
|---------|---------|--------|
| **[/engineer](#engineer)** | Universal Builder: CoT driven planning + execution | Orchestrator |
| **[/specify](#specify)** | Specification: Create feature spec | Product Owner |
| **[/clarify](#clarify)** | Clarification: Resolve spec ambiguities | Product Owner |
| **[/plan](#plan)** | Planning: Create implementation plan | Project Planner |
| **[/tasks](#tasks)** | Tasking: Generate executable tasks | Project Planner |
| **[/analyze](#analyze)** | Analysis: Validate spec/plan/tasks | Project Planner |
| **[/checklist](#checklist)** | Checklist: Spec/plan readiness checks | Project Planner |
| **[/impl](#impl)** | Feature Implementation: Safe code changes | Backend/Frontend Specialists |
| **[/test](#test)** | Quality Assurance: Run unit checks and E2E suites | Test Engineer |
| **[/ui-ux](#ui-ux)** | Design Studio: Generate design systems and UI components | Frontend Specialist |
| **[/deploy](#deploy)** | Production: Safe deployment procedures and verifications | DevOps Engineer |
| **[/debug](#debug)** | Systematic Debugging: 4-phase root cause analysis | Debugger |
| **[/create](#create)** | New App: Bootstrap a project with guided setup | Project Planner |
| **[/brainstorm](#brainstorm)** | Ideation: Explore approaches before implementation | Brainstorming Skill |
| **[/context](#context)** | Repo Analysis: Generate context packs for LLMs | Explorer Agent |
| **[/doc](#doc)** | Documentation: Write manuals and API docs | Documentation Writer |
| **[/status](#status)** | Progress Tracking: View active tasks and stats | Project Planner |
| **[/preview](#preview)** | Dev Environment: Manage Docker Compose | DevOps Engineer |

---

## engineer

**File:** `.opencode/commands/engineer.md`

**Purpose:** Universal Builder with Chain of Thought (CoT) driven planning + execution.

**When to Use:**
- Complex, multi-domain tasks requiring coordination
- Full-stack features (backend + frontend + database + security)
- Architectural decisions and implementation
- Projects requiring multiple specialist agents

**How It Works:**

```
/engineer build a secure e-commerce checkout

Phase 1: Planning (project-planner only)
├── Requirements analysis
├── Tech stack selection
├── Architecture decisions
├── Create docs/requirements/
└── Create docs/sprint/Sprint-XX/

SDD Additions:
├── /specify -> PROBLEM_STATEMENT/USER_STORIES/ACCEPTANCE_CRITERIA/RISKS
├── /clarify -> resolve ambiguities
├── /plan -> PLAN.md + auxiliary artifacts
└── /tasks -> TASKS.md

STOP: Ask for approval

Phase 2: Implementation (parallel agents)
├── P0 (Foundation):
│   ├── database-architect
│   └── security-auditor
│
├── P1 (Core Backend):
│   └── backend-specialist
│
├── P2 (UI/UX):
│   └── frontend-specialist
│
└── P3 (Polish):
    ├── test-engineer
    └── performance-optimizer

STOP: Ask for final verification

Phase X: Verification (all scripts)
├── Security scan
├── Lint & type check
├── UX audit
├── Lighthouse audit
└── Playwright E2E
```

**Execution Order:**
- P0 (Foundation) → P1 (Core) → P2 (UI/UX) → P3 (Polish) → Phase X (Verification)
- Minimum 3 agents required for orchestration mode

**Usage Examples:**

```bash
# Full-stack feature
/engineer build user authentication system

# Architecture + implementation
/engineer design and implement real-time chat

# Multi-domain task
/engineer add payment processing with Stripe
```

**Related:**
- [Orchestrator Agent](AGENTS.md#orchestrator-mode) - Orchestrates multi-agent workflows
- [Project Planner Agent](AGENTS.md#project-planner) - Handles Phase 1 planning
- [WORKFLOW](WORKFLOW.md#engineer-command) - Detailed workflow

---

## specify

**File:** `.opencode/commands/specify.md`

**Purpose:** Create a feature specification focused on what and why.

**When to Use:**
- New feature definition
- Establishing acceptance criteria before planning

**Outputs:**
- `docs/requirements/<feature>/PROBLEM_STATEMENT.md`
- `docs/requirements/<feature>/USER_STORIES.md`
- `docs/requirements/<feature>/ACCEPTANCE_CRITERIA.md`
- `docs/requirements/<feature>/RISKS.md`

---

## clarify

**File:** `.opencode/commands/clarify.md`

**Purpose:** Resolve ambiguities in the feature specification.

**When to Use:**
- Spec has unclear requirements or assumptions

---

## tasks

**File:** `.opencode/commands/tasks.md`

**Purpose:** Generate executable tasks for `/impl`.

---

## analyze

**File:** `.opencode/commands/analyze.md`

**Purpose:** Validate consistency across spec, plan, and tasks.

---

## checklist

**File:** `.opencode/commands/checklist.md`

**Purpose:** Spec/plan readiness checks before implementation.

---

## impl

**File:** `.opencode/commands/impl.md`

**Purpose:** Feature Implementation with safe code changes from plan files.

**When to Use:**
- Implementing features from existing plans
- Making incremental changes to codebase
- Executing specific tasks defined in `docs/sprint/Sprint-XX/TASKS.md`

**How It Works:**

```
1. Analysis & Preparation
├── Read docs/sprint/ and docs/requirements/
├── Identify scope (new feature vs update)
└── Load state

2. Execution (The Loop)
├── For New Features (Codegen Mode):
│   ├── Load appropriate skills
│   ├── Write complete code (no TODOs)
│   ├── Update docs if needed
│   └── Update TASKS.md status
│
└── For Updates (Enhance Mode):
    ├── Determine affected files
    ├── Present plan if complex
    ├── Apply changes
    └── Verify locally

3. Progress Updates
└── Mark tasks in docs/sprint/Sprint-XX/TASKS.md as completed

STOP: Ask to run final verification
```

**Execution Modes:**

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

**Usage Examples:**

```bash
# Implement from plan
/impl

# Implement specific feature
/impl add dark mode to settings

# Fix specific issue
/impl fix validation error in checkout
```

**Output Requirements:**
- Production ready (no TODOs, strict typing, handled errors)
- Security appropriate to chosen stack
- Best practices specific to tech stack (not hardcoded)

**Related:**
- [Backend Specialist](AGENTS.md#backend-specialist) - Backend implementation
- [Frontend Specialist](AGENTS.md#frontend-specialist) - Frontend implementation
- [plan Command](#plan) - Creates plans that /impl executes

---

## plan

**File:** `.opencode/commands/plan.md`

**Purpose:** Task Planning with detailed breakdowns, sprint alignment, and INPUT→OUTPUT→VERIFY criteria.

**When to Use:**
- Planning new features
- Creating sprint plans
- Breaking down complex tasks
- Defining requirements and acceptance criteria

**How It Works:**

```
1. Stack Selection (NEW PROJECTS ONLY)
├── Check for existing stack
└── Ask user preferences (using stack-selection skill)

2. Socratic Gate
├── Use question tool for clarifications
├── Gather context
└── Identify requirements

3. Plan Creation
├── Create/update docs/requirements/<feature>/
│   ├── PROBLEM_STATEMENT.md
│   ├── USER_STORIES.md
│   ├── ACCEPTANCE_CRITERIA.md
│   ├── DATA_CONTRACTS.md
│   ├── RISKS.md
│   └── PLAN.md
│
├── Ask user about sprint (latest or new)
└── Create/update docs/sprint/Sprint-XX/
    ├── SPRINT_GOAL.md
    ├── BACKLOG.md
    ├── TASKS.md
    └── RISK_REGISTER.md

STOP: Ask for approval before proceeding
```

**ABSOLUTE RULES:**
-  NEVER write code during planning
-  NEVER use generic names like `plan.md`
-  ALWAYS use `docs/` as source of truth
-  ALWAYS create `docs/` if missing

**Documentation Standard:**

**Requirements** (`docs/requirements/<feature>/`):
- `PROBLEM_STATEMENT.md` - What problem are we solving?
- `USER_STORIES.md` - Who are the users and what do they want?
- `ACCEPTANCE_CRITERIA.md` - Definition of done
- `DATA_CONTRACTS.md` - Data structures and interfaces
- `RISKS.md` - Potential risks and mitigations
- `PLAN.md` - Implementation plan and rollout

**Sprint** (`docs/sprint/Sprint-XX/`):
- `SPRINT_GOAL.md` - What's the sprint objective?
- `BACKLOG.md` - What stories are in the sprint?
- `TASKS.md` - INPUT→OUTPUT→VERIFY task breakdown
- `RISK_REGISTER.md` - What could go wrong?

**Usage Examples:**

```bash
# Plan a feature
/plan create user authentication system

# Plan a fix
/plan fix login bug

# Plan architecture
/plan architecture for notifications

# Plan a sprint
/plan sprint 16 planning
```

**Related:**
- [Project Planner Agent](AGENTS.md#project-planner) - Creates plans
- [impl Command](#impl) - Executes plans
- [plan-writing Skill](SKILLS.md#plan-writing) - Task breakdown methodology

---

## test

**File:** `.opencode/commands/test.md`

**Purpose:** Quality Assurance - Run unit checks, integration tests, and E2E suites.

**When to Use:**
- Running all tests
- Checking code quality
- Validating implementation
- Pre-deployment verification

**How It Works:**

```
1. Test Execution
├── Unit tests (Vitest, Jest, Pytest)
├── Integration tests
└── E2E tests (Playwright)

2. Quality Checks
├── Linting (ESLint, Ruff)
├── Type checking (tsc, mypy)
└── Security scan (if backend)

3. Coverage Report
├── Generate coverage report
└── Identify gaps
```

**Validation Order:**
1. Security → Lint → Type Check → Tests → UX → SEO → Lighthouse/E2E

**All-in-One Command:**
```bash
python .opencode/scripts/verify_all.py . --url http://localhost:3000
```

**Usage Examples:**

```bash
# Run all tests
/test

# Run specific test suite
/test backend

# Run with coverage
/test --coverage
```

**Related:**
- [Test Engineer Agent](AGENTS.md#test-engineer) - Executes tests
- [testing-patterns Skill](SKILLS.md#testing-patterns) - Test strategies
- [webapp-testing Skill](SKILLS.md#webapp-testing) - E2E testing

---

## ui-ux

**File:** `.opencode/commands/ui-ux.md`

**Purpose:** Design Studio - Generate design systems and UI components.

**When to Use:**
- Creating UI components
- Designing user interfaces
- Creating design systems
- Reviewing UI for best practices

**How It Works:**

```
1. Design Thinking
├── Context analysis (audience, constraints, brand)
├── Deep design thinking (mandated)
└── User preference gathering

2. Design Commitment
├── Present design choices
├── Explain rationale
└── Get user approval

3. Implementation
├── Create components/pages
├── Apply styling (Tailwind, design system)
├── Ensure accessibility
└── Add animations and interactions
```

**Design Process:**
1. Constraint Analysis (timeline, content, brand, tech, audience)
2. Deep Design Thinking (context, identity, layout, emotion)
3. User Questions (specific based on analysis)
4. Design Commitment (geometry, typography, palette, effects)
5. Maestro Auditor (quality check before delivery)
6. Execution (HTML structure → CSS/Tailwind → Interactivity)
7. Reality Check (honest assessment)

**Usage Examples:**

```bash
# Design a component
/ui-ux create button component

# Design a page
/ui-ux create user profile page

# Create design system
/ui-ux create design system for brand X
```

**Related:**
- [Frontend Specialist Agent](AGENTS.md#frontend-specialist) - UI/UX implementation
- [frontend-design Skill](SKILLS.md#frontend-design) - Design principles

---

## deploy

**File:** `.opencode/commands/deploy.md`

**Purpose:** Production deployment with safe procedures and post-deployment verification.

**When to Use:**
- Deploying to production
- Deploying to staging
- Setting up deployment pipelines
- Rolling back deployments

**How It Works:**

```
1. Pre-Deployment
├── Run all tests
├── Security scan
├── Verify build
└── Create rollback plan

2. Deployment
├── Blue-green or canary deployment
├── Zero-downtime strategy
└── Monitor during rollout

3. Post-Deployment Verification
├── Health checks
├── Smoke tests
├── Monitor metrics
├── Check logs for errors
└── Verify functionality

4. Rollback (if needed)
├── Execute rollback plan
├── Investigate failure
└── Plan next deployment
```

**Deployment Strategies:**

**Blue-Green:**
- Deploy to green environment
- Switch traffic when verified
- Instant rollback to blue

**Canary:**
- Deploy to small percentage of users
- Monitor metrics
- Gradual rollout if successful

**Rolling:**
- Replace instances gradually
- Zero downtime
- Gradual risk mitigation

**Usage Examples:**

```bash
# Deploy to staging
/deploy staging

# Deploy to production
/deploy production

# Deploy with canary strategy
/deploy --canary 10%
```

**Related:**
- [DevOps Engineer Agent](AGENTS.md#devops-engineer) - Deployment management
- [deployment-procedures Skill](SKILLS.md#deployment-procedures) - Safe deployment workflows

---

## debug

**File:** `.opencode/commands/debug.md`

**Purpose:** Systematic debugging with 4-phase root cause analysis.

**When to Use:**
- Investigating complex errors
- Debugging production issues
- Analyzing bugs
- Root cause analysis

**How It Works:**

```
Phase 1: Evidence Collection
├── Gather logs
├── Collect error messages
├── Identify when/where it occurs
└── Reproduce issue

Phase 2: Hypothesis Generation
├── Brainstorm potential causes
├── Narrow down to most likely
└── Formulate hypothesis

Phase 3: Verification
├── Test hypothesis
├── Verify root cause
├── Eliminate false leads
└── Confirm true cause

Phase 4: Solution & Verification
├── Implement fix
├── Verify fix resolves issue
├── Add tests to prevent regression
└── Document findings
```

**Usage Examples:**

```bash
# Debug an issue
/debug investigate authentication failure

# Debug production error
/debug analyze 500 errors on /api/users

# Debug performance issue
/debug investigate slow page load times
```

**Related:**
- [Debugger Agent](AGENTS.md#debugger) - Root cause analysis
- [systematic-debugging Skill](SKILLS.md#systematic-debugging) - 4-phase methodology

---

## create

**File:** `.opencode/commands/create.md`

**Purpose:** New App - Bootstrap a project with guided setup.

**When to Use:**
- Creating a new project
- Bootstrapping application structure
- Setting up development environment

**How It Works:**

```
1. Project Questions
├── Project name
├── Project type (Web App, API, Mobile, etc.)
├── Framework preferences
├── Database preferences
└── Other preferences

2. Project Scaffolding
├── Create project structure
├── Install dependencies
├── Configure build tools
├── Set up linters
├── Create initial files
└── Initialize Git

3. OpenKit Setup
├── Install OpenKit if not present
├── Configure `opencode.json`
└── Set up initial docs/
```

**Usage Examples:**

```bash
# Create new web app
/create web app

# Create with blueprint
/create web app --blueprint fullstack

# Create API
/create API
```

**Related:**
- [Blueprints](BLUEPRINTS.md) - Available project blueprints
- [stack-selection Skill](SKILLS.md#stack-selection) - Tech stack selection

---

## brainstorm

**File:** `.opencode/commands/brainstorm.md`

**Purpose:** Ideation - Explore approaches before implementation.

**When to Use:**
- Complex, ambiguous requirements
- Exploring multiple approaches
- Understanding user needs better
- Before implementation for clarity

**How It Works:**

```
1. Context Gathering
├── Understand problem domain
├── Identify constraints
└── Ask clarifying questions

2. Ideation
├── Brainstorm multiple approaches
├── Identify pros/cons of each
├── Consider alternatives
└── Evaluate trade-offs

3. Recommendations
├── Present top options
├── Explain rationale
├── Highlight risks
└── Recommend approach
```

**Usage Examples:**

```bash
# Brainstorm approach
/brainstorm how to implement real-time notifications

# Brainstorm architecture
/brainstorm architecture for file upload system
```

**Related:**
- [brainstorming Skill](SKILLS.md#brainstorming) - Socratic questioning protocol

---

## context

**File:** `.opencode/commands/context.md`

**Purpose:** Repo Analysis - Generate context packs for LLMs.

**When to Use:**
- Generating documentation for LLMs
- Creating context for new developers
- Analyzing codebase structure
- Preparing for code review

**How It Works:**

```
1. Codebase Analysis
├── Scan project structure
├── Identify key files and patterns
├── Map dependencies
└── Document architecture

2. Context Generation
├── Create context pack
├── Include relevant documentation
├── Summarize code patterns
└── Identify conventions

3. Output
├── Structured context file
└── Ready for LLM consumption
```

**Usage Examples:**

```bash
# Generate context for entire repo
/context

# Generate context for specific area
/context backend
```

**Related:**
- [Explorer Agent](AGENTS.md#explorer-agent) - Codebase analysis

---

## doc

**File:** `.opencode/commands/doc.md`

**Purpose:** Documentation - Write manuals, API docs, and guides.

**When to Use:**
- Writing API documentation
- Creating user guides
- Updating READMEs
- Writing changelogs
- Adding inline documentation

**How It Works:**

```
1. Document Identification
├── What needs documentation?
├── Who is the audience?
├── What format is appropriate?

2. Content Creation
├── Write clear, concise content
├── Include examples
├── Add diagrams if helpful
└── Ensure completeness

3. Review & Update
├── Check for accuracy
├── Verify clarity
└── Update cross-references
```

**Usage Examples:**

```bash
# Write API documentation
/doc write API docs for /api/users

# Update README
/doc update README with installation instructions

# Write user guide
/doc create user guide for dashboard
```

**Related:**
- [Documentation Writer Agent](AGENTS.md#documentation-writer) - Documentation creation
- [documentation-templates Skill](SKILLS.md#documentation-templates) - Templates and structure

---

## status

**File:** `.opencode/commands/status.md`

**Purpose:** Progress Tracking - View active tasks, sprint progress, and project stats.

**When to Use:**
- Checking sprint progress
- Viewing active tasks
- Getting project overview
- Reviewing completion status

**How It Works:**

```
1. Sprint Analysis
├── Identify current sprint
├── Read SPRINT_GOAL.md
├── Parse BACKLOG.md
└── Parse TASKS.md

2. Status Calculation
├── Calculate completion percentage
├── Count completed/in-progress/pending tasks
└── Identify blockers

3. Report
├── Sprint goal
├── Progress summary
├── Task breakdown
└── Next steps
```

**Usage Examples:**

```bash
# View status
/status

# View specific sprint
/status sprint 16
```

**Related:**
- [Project Planner Agent](AGENTS.md#project-planner) - Manages sprints

---

## preview

**File:** `.opencode/commands/preview.md`

**Purpose:** Dev Environment - Manage Docker Compose for local development.

**When to Use:**
- Starting development environment
- Stopping services
- Viewing logs
- Managing containers

**How It Works:**

```
1. Environment Management
├── Start containers (docker compose up)
├── Stop containers (docker compose down)
├── Restart services
├── View logs
└── Execute commands in containers

2. Service Health
├── Check service status
├── Verify connectivity
└── Report issues
```

**Usage Examples:**

```bash
# Start dev environment
/preview up

# Stop services
/preview down

# View logs
/preview logs

# Execute command in container
/preview exec backend python manage.py migrate
```

**Related:**
- [DevOps Engineer Agent](AGENTS.md#devops-engineer) - Environment management

---

## Related Documentation

- [Agents Reference](AGENTS.md) - Agents that execute commands
- [Skills Reference](SKILLS.md) - Skills loaded by commands
- [Workflows](WORKFLOW.md) - How commands fit into development workflows
- [Architecture](ARCHITECTURE.md) - System architecture

---

## Command Selection Guide

| Situation | Command |
|------------|----------|
| **New project** | `/create` |
| **New feature (complex)** | `/engineer` |
| **New feature (simple)** | `/specify` → `/clarify` → `/plan` → `/tasks` → `/impl` |
| **Fix bug** | `/debug` |
| **Run tests** | `/test` |
| **Deploy** | `/deploy` |
| **Design UI** | `/ui-ux` |
| **Generate docs** | `/doc` |
| **Check progress** | `/status` |
| **Local dev** | `/preview` |
| **Explore options** | `/brainstorm` |
| **Understand codebase** | `/context` |
