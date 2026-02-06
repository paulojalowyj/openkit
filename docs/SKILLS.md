# OpenKit Skills

> Complete reference to 33+ domain skills in the OpenKit system.

---

## Table of Contents

| Category | Skills |
|----------|---------|
| **[Stack Selection](#stack-selection)** | `stack-selection` |
| **[Frontend & Design](#frontend--design)** | `frontend-design`, `nextjs-react-expert`, `tailwind-patterns` |
| **[Backend & Data](#backend--data)** | `python-patterns`, `api-patterns`, `database-design` |
| **[Testing & Quality](#testing--quality)** | `testing-patterns`, `webapp-testing`, `tdd-workflow` |
| **[Security](#security)** | `vulnerability-scanner`, `red-team-tactics` |
| **[DevOps & Infrastructure](#devops--infrastructure)** | `deployment-procedures`, `server-management`, `docker-expert` |
| **[Architecture & Planning](#architecture--planning)** | `architecture`, `plan-writing`, `brainstorming` |
| **[Performance](#performance)** | `performance-profiling` |
| **[Frontend Guidelines](#frontend-guidelines)** | `web-design-guidelines`, `seo-fundamentals` |
| **[Mobile](#mobile)** | `mobile-design` |
| **[Localization](#localization)** | `i18n-localization` |
| **[Documentation](#documentation)** | `documentation-templates`, `code-review-checklist` |
| **[Core Patterns](#core-patterns)** | `clean-code`, `lint-and-validate`, `bash-linux` |

---

## Stack Selection

### stack-selection

**File:** `.opencode/skills/stack-selection/SKILL.md`

**Purpose:** Tech stack selection with decision trees, user preferences, and blueprint defaults.

**Features:**
- Decision trees for backend (framework, database, ORM)
- Decision trees for frontend (framework, state management, UI library)
- User preference gathering via `question` tool
- Trade-off explanations for different options
- No hardcoded stacks - always user-driven
- Template for documenting stack decisions (`TechStack.md`)

**When to Use:**
- Starting a new project (no existing code)
- Adding a new feature that could use different stacks
- User asks "what stack should I use?"
- Migration between technologies is being considered

**Key Concepts:**
- Always check existing stack before suggesting
- Always ask user preferences
- Explain trade-offs of options
- Document rationale for decisions
- Use Fullstack Blueprint as reference, not requirement

**Related:**
- [Agents Reference](AGENTS.md) - Agents that use this skill
- [Backend Specialist](AGENTS.md#backend-specialist) - Uses for backend decisions
- [Frontend Specialist](AGENTS.md#frontend-specialist) - Uses for frontend decisions

---

## Frontend & Design

### frontend-design

**File:** `.opencode/skills/frontend-design/SKILL.md`

**Purpose:** Design thinking and decision-making for web UI. Teaches principles, not fixed values.

**Features:**
- UI/UX Engine with 50+ styles and 97 palettes
- Deep design thinking methodology
- Constraint analysis (timeline, content, brand, tech, audience)
- UX Psychology principles (Hick's Law, Fitts' Law, Miller's Law, etc.)
- Layout principles (Golden Ratio, 8-point grid)
- Color principles (60-30-10 rule, color psychology)
- Typography principles (scale selection, pairing)
- Visual effects (glassmorphism, shadows, gradients)
- Animation principles (timing, easing, performance)
- Anti-patterns (AI tendencies, dark patterns)

**When to Use:**
- Before coding - Learn design principles (color, typography, UX psychology)
- Making design decisions (colors, fonts, layouts, spacing)
- Creating design systems
- Auditing existing designs

**Related Files:**
- `ux-psychology.md` - User psychology deep dive
- `color-system.md` - Color theory and selection
- `typography-system.md` - Font pairing and scale
- `visual-effects.md` - Effects principles
- `animation-guide.md` - Motion design
- `decision-trees.md` - Context-specific templates

---

### nextjs-react-expert

**File:** `.opencode/skills/nextjs-react-expert/SKILL.md`

**Purpose:** React and Next.js performance optimization from Vercel Engineering.

**Features:**
- React performance patterns
- Next.js optimization (Server Components, caching, streaming)
- Bundle analysis and optimization
- Waterfall elimination
- Code splitting strategies
- Image optimization (next/image)
- Font optimization
- SSR/SSG/ISR patterns
- Server Actions best practices

**When to Use:**
- Building React components, optimizing performance
- Eliminating waterfalls, reducing bundle size
- Implementing server/client-side optimizations
- Reviewing code for performance issues

**Key Concepts:**
- Measure before optimizing (Profiling)
- Server Components by default
- Automatic request memoization (Next.js fetch)
- Parallel data fetching
- Streaming progressive rendering
- CPU-bound offloading

---

### tailwind-patterns

**File:** `.opencode/skills/tailwind-patterns/SKILL.md`

**Purpose:** Tailwind CSS v4 principles, CSS-first configuration, design token architecture.

**Features:**
- Tailwind v4 CSS-first configuration
- Container queries
- Modern patterns
- Design token architecture
- Utility-first thinking
- Custom theme configuration
- Responsive design patterns
- Dark mode strategies

**When to Use:**
- Setting up Tailwind CSS
- Creating design systems with Tailwind
- Customizing Tailwind theme
- Writing responsive layouts
- Implementing dark mode

**Key Concepts:**
- CSS-first over JS config (Tailwind v4)
- Design tokens for consistency
- Container queries for adaptive UI
- Utility-first, component-driven

---

## Backend & Data

### python-patterns

**File:** `.opencode/skills/python-patterns/SKILL.md`

**Purpose:** Python development principles and decision-making. Framework selection, async patterns, type hints.

**Features:**
- Framework selection (FastAPI vs Django vs Flask)
- Async/Await patterns
- Type hints and Pydantic
- Project structure
- Error handling
- Database patterns
- Testing patterns
- Performance considerations

**When to Use:**
- Building Python APIs (FastAPI, Django, Flask)
- Writing async Python code
- Using Pydantic for validation
- Structuring Python projects
- Writing Python tests

**Key Concepts:**
- async def vs def in FastAPI
- Pydantic v2 validation
- SQLAlchemy patterns
- Celery background tasks
- Poetry dependency management

---

### api-patterns

**File:** `.opencode/skills/api-patterns/SKILL.md`

**Purpose:** API design principles and decision-making. REST vs GraphQL vs tRPC.

**Features:**
- REST vs GraphQL vs tRPC decision tree
- Resource naming, HTTP methods, status codes
- Response format (envelope pattern)
- Error handling
- Pagination strategies
- API versioning
- Authentication patterns (JWT, OAuth, Passkey)
- Rate limiting
- OpenAPI/Swagger documentation
- Security testing (OWASP API Top 10)

**When to Use:**
- Designing REST APIs
- Considering GraphQL or tRPC
- Structuring API responses
- Implementing authentication
- Setting up rate limiting
- Writing API documentation

**Key Concepts:**
- Choose API style based on consumers
- Consistent response formats
- Proper HTTP status codes
- Input validation at API boundary
- OpenAPI documentation

---

### database-design

**File:** `.opencode/skills/database-design/SKILL.md`

**Purpose:** Database design principles and decision-making. Schema design, indexing strategy, ORM selection.

**Features:**
- Database selection (PostgreSQL, MySQL, SQLite, MongoDB, etc.)
- Schema design principles
- Normalization and denormalization
- Indexing strategies
- ORM selection (Prisma, Drizzle, SQLAlchemy, etc.)
- Migration strategies
- Relationship modeling
- Query optimization

**When to Use:**
- Designing database schemas
- Selecting appropriate database
- Creating migrations
- Optimizing queries
- Setting up ORM

**Key Concepts:**
- Database type by use case (relational vs document vs graph)
- Index for read-heavy workloads
- Migration versioning
- Foreign key constraints
- Data integrity

---

## Testing & Quality

### testing-patterns

**File:** `.opencode/skills/testing-patterns/SKILL.md`

**Purpose:** Testing patterns and principles. Unit, integration, and E2E strategies.

**Features:**
- Unit testing strategies
- Integration testing patterns
- E2E testing approaches
- Mocking and stubbing
- Test coverage
- Test organization
- CI/CD integration

**When to Use:**
- Writing tests
- Setting up test infrastructure
- Improving test coverage
- Organizing test suites

**Key Concepts:**
- Test pyramid (many unit, fewer integration, minimal E2E)
- Mock external dependencies
- Test behavior, not implementation
- Test boundary conditions

---

### webapp-testing

**File:** `.opencode/skills/webapp-testing/SKILL.md`

**Purpose:** Web application testing principles. E2E, Playwright, browser testing.

**Features:**
- Playwright E2E automation
- Browser testing strategies
- Cross-browser testing
- Mobile testing
- Accessibility testing
- Visual regression testing
- API integration testing

**When to Use:**
- Writing E2E tests with Playwright
- Setting up browser testing
- Testing user flows
- Accessibility testing
- Cross-browser testing

**Key Concepts:**
- Test user journeys, not just pages
- Parallel test execution
- Headless vs headed mode
- Screenshot on failure
- Accessibility assertions

---

### tdd-workflow

**File:** `.opencode/skills/tdd-workflow/SKILL.md`

**Purpose:** Test-Driven Development workflow principles. RED-GREEN-REFACTOR cycle.

**Features:**
- TDD cycle (Write failing test → Make pass → Refactor)
- Test-first development
- Refactoring strategies
- Design emergent through tests
- Incremental development

**When to Use:**
- Following TDD methodology
- Writing tests before code
- Refactoring with safety net
- Emergent design

**Key Concepts:**
- RED: Write failing test
- GREEN: Make test pass (minimal code)
- REFACTOR: Improve code while tests pass
- Repeat

---

## Security

### vulnerability-scanner

**File:** `.opencode/skills/vulnerability-scanner/SKILL.md`

**Purpose:** Advanced vulnerability analysis principles. OWASP 2025, Supply Chain Security.

**Features:**
- OWASP Top 10 vulnerabilities
- Supply chain security
- Dependency analysis
- Input validation
- SQL injection prevention
- XSS, CSRF prevention
- Security headers
- Authentication & authorization
- Secrets management

**When to Use:**
- Conducting security audits
- Scanning dependencies
- Reviewing code for security issues
- Setting up security policies

**Key Concepts:**
- Validate everything, trust nothing
- Least privilege principle
- Defense in depth
- Security by design

---

### red-team-tactics

**File:** `.opencode/skills/red-team-tactics/SKILL.md`

**Purpose:** Red team tactics principles based on MITRE ATT&CK. Attack phases, detection evasion.

**Features:**
- MITRE ATT&CK framework
- Attack phases (Reconnaissance, Initial Access, Execution, etc.)
- Detection evasion
- Lateral movement
- Persistence
- Exfiltration
- Reporting

**When to Use:**
- Conducting penetration tests
- Simulating attacks
- Testing security controls
- Red teaming exercises

**Key Concepts:**
- Think like attacker
- Test detection capabilities
- Document findings
- Recommendations for remediation

---

## DevOps & Infrastructure

### deployment-procedures

**File:** `.opencode/skills/deployment-procedures/SKILL.md`

**Purpose:** Production deployment principles. Safe deployment workflows, rollback strategies.

**Features:**
- Safe deployment workflows
- Blue-green deployment
- Canary deployments
- Rollback strategies
- Verification procedures
- Post-deployment monitoring
- Zero-downtime deployments

**When to Use:**
- Deploying to production
- Setting up deployment pipelines
- Planning deployment strategies
- Handling deployment failures

**Key Concepts:**
- Always have rollback plan
- Verify after deployment
- Gradual rollout for risk mitigation
- Monitor post-deployment

---

### server-management

**File:** `.opencode/skills/server-management/SKILL.md`

**Purpose:** Server management principles. Process management, monitoring, scaling decisions.

**Features:**
- Process management (systemd, Docker, PM2)
- Monitoring and logging
- Performance monitoring
- Scaling strategies (vertical vs horizontal)
- Load balancing
- Backup strategies
- Disaster recovery

**When to Use:**
- Managing production servers
- Setting up monitoring
- Planning scaling
- Implementing backups
- Disaster recovery planning

**Key Concepts:**
- Everything is a process
- Monitor everything
- Backups are mandatory
- Plan for failure

---

## Architecture & Planning

### architecture

**File:** `.opencode/skills/architecture/SKILL.md`

**Purpose:** Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation.

**Features:**
- Requirements analysis
- Architectural patterns selection
- Trade-off evaluation
- ADR (Architecture Decision Record) documentation
- High-level design principles
- Scalability considerations
- Technology selection

**When to Use:**
- Making architecture decisions
- Selecting architectural patterns
- Evaluating trade-offs
- Documenting architectural decisions

**Key Concepts:**
- Document architectural decisions
- Consider trade-offs
- Justify choices with requirements
- Plan for evolution

---

### plan-writing

**File:** `.opencode/skills/plan-writing/SKILL.md`

**Purpose:** Structured task planning with clear breakdowns, dependencies, and verification criteria.

**Features:**
- Task breakdown structure
- INPUT→OUTPUT→VERIFY format
- Dependency management
- Risk assessment
- Acceptance criteria
- Sprint planning

**When to Use:**
- Creating task plans
- Breaking down features
- Planning sprints
- Defining acceptance criteria

**Key Concepts:**
- Clear INPUT and OUTPUT
- Verification criteria
- Dependency mapping
- Risk identification

---

### brainstorming

**File:** `.opencode/skills/brainstorming/SKILL.md`

**Purpose:** Socratic questioning protocol + user communication. Mandatory for complex requests.

**Features:**
- Socratic questioning protocol
- Dynamic questioning based on context
- Progress reporting
- Error handling
- Context gathering

**When to Use:**
- Complex, ambiguous requests
- Requirements gathering
- Exploring approaches
- Understanding user needs

**Key Concepts:**
- Ask clarifying questions
- Don't assume
- Reflect understanding
- Iterate to clarity

---

## Performance

### performance-profiling

**File:** `.opencode/skills/performance-profiling/SKILL.md`

**Purpose:** Performance profiling principles. Measurement, analysis, and optimization techniques.

**Features:**
- Measurement strategies
- Profiling tools
- Analysis techniques
- Optimization strategies
- Core Web Vitals
- Bundle analysis
- Server-side optimization
- Client-side optimization

**When to Use:**
- Optimizing performance
- Analyzing bottlenecks
- Measuring Core Web Vitals
- Reducing bundle size

**Key Concepts:**
- Measure before optimizing
- Optimize where it matters
- Consider trade-offs
- Use appropriate tools

---

## Frontend Guidelines

### web-design-guidelines

**File:** `.opencode/skills/web-design-guidelines/SKILL.md`

**Purpose:** Review UI code for Web Interface Guidelines compliance. Use when asked to "review my UI", "check accessibility", etc.

**Features:**
- Accessibility audit (WCAG, ARIA, keyboard navigation)
- Performance guidelines
- SEO considerations
- Mobile-first design
- Cross-browser compatibility
- Responsive design
- Color contrast
- Typography guidelines

**When to Use:**
- Reviewing UI for best practices
- Checking accessibility
- Auditing design
- Ensuring cross-browser compatibility

---

### seo-fundamentals

**File:** `.opencode/skills/seo-fundamentals/SKILL.md`

**Purpose:** SEO fundamentals, E-E-A-T, Core Web Vitals, and Google algorithm principles.

**Features:**
- On-page SEO
- Off-page SEO
- Technical SEO
- Core Web Vitals
- Meta tags and structured data
- Sitemap and robots.txt
- Content optimization
- E-E-A-T (Experience, Expertise, Authoritativeness, Trustworthiness)

**When to Use:**
- Optimizing pages for search engines
- Implementing technical SEO
- Writing SEO-friendly content
- Improving Core Web Vitals for SEO

---

## Mobile

### mobile-design

**File:** `.opencode/skills/mobile-design/SKILL.md`

**Purpose:** Mobile-first design thinking and decision-making for iOS and Android apps.

**Features:**
- iOS design guidelines
- Android design guidelines
- Touch interaction patterns
- Mobile performance patterns
- Platform conventions
- Device-specific considerations
- App store guidelines

**When to Use:**
- Building React Native or Flutter apps
- Native iOS/Android development
- Mobile UI design
- Mobile performance optimization

---

## Localization

### i18n-localization

**File:** `.opencode/skills/i18n-localization/SKILL.md`

**Purpose:** Internationalization and localization patterns. Detecting hardcoded strings, managing translations, RTL support.

**Features:**
- Detecting hardcoded strings
- Translation file management
- Locale file structure
- RTL (right-to-left) support
- Number/date/currency formatting
- Pluralization
- Context-specific translations

**When to Use:**
- Adding i18n support
- Managing translations
- Supporting RTL languages
- Formatting for locales

---

## Documentation

### documentation-templates

**File:** `.opencode/skills/documentation-templates/SKILL.md`

**Purpose:** Documentation templates and structure guidelines. README, API docs, code comments, AI-friendly docs.

**Features:**
- README templates
- API documentation structure
- Code comment guidelines
- Changelog templates
- Documentation structure
- AI-friendly documentation

**When to Use:**
- Writing README files
- Creating API documentation
- Writing inline code comments
- Creating changelogs

---

### code-review-checklist

**File:** `.opencode/skills/code-review-checklist/SKILL.md`

**Purpose:** Code review guidelines covering code quality, security, and best practices.

**Features:**
- Code quality checklist
- Security review checklist
- Performance review checklist
- Best practices checklist
- Review process

**When to Use:**
- Conducting code reviews
- Creating review guidelines
- Establishing review process

---

## Core Patterns

### clean-code

**File:** `.opencode/skills/clean-code/SKILL.md`

**Purpose:** Pragmatic coding standards. Concise, direct, no over-engineering.

**Features:**
- SRP (Single Responsibility Principle)
- DRY (Don't Repeat Yourself)
- KISS (Keep It Simple, Stupid)
- Functions ≤ 20 lines
- Max 3 arguments
- Guard clauses
- Descriptive naming
- No unnecessary comments

**When to Use:**
- Writing code
- Refactoring code
- Reviewing code quality
- Establishing coding standards

**Key Principles:**
- Code should be self-documenting
- Less is more
- Clear over clever
- Consistent naming

---

### lint-and-validate

**File:** `.opencode/skills/lint-and-validate/SKILL.md`

**Purpose:** Automatic quality control, linting, and static analysis procedures.

**Features:**
- Linting strategies
- Type checking
- Static analysis
- Pre-commit hooks
- CI/CD integration
- Automated validation

**When to Use:**
- Setting up linting
- Running type checks
- Establishing validation procedures
- Pre-commit hook configuration

---

### bash-linux

**File:** `.opencode/skills/bash-linux/SKILL.md`

**Purpose:** Bash/Linux terminal patterns. Critical commands, piping, error handling, scripting.

**Features:**
- Bash scripting patterns
- Piping and redirection
- Error handling
- File operations
- Process management
- System utilities
- Git operations

**When to Use:**
- Writing Bash scripts
- Terminal automation
- CI/CD scripting
- System administration tasks

---

## Related Documentation

- [Agents Reference](AGENTS.md) - How agents use skills
- [Commands Reference](COMMANDS.md) - How commands invoke agents and skills
- [Architecture](ARCHITECTURE.md) - System architecture
- [Workflows](WORKFLOW.md) - Development workflows

---

## Finding Specific Skills

Skills are located in `.opencode/skills/<skill-name>/SKILL.md`.

To find a specific skill:

```bash
# List all skills
ls .opencode/skills/

# Read specific skill
cat .opencode/skills/<skill-name>/SKILL.md
```
