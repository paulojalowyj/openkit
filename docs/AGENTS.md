# OpenKit Agents

> Complete reference to all 15 specialized agents in the OpenKit system.

---

## Table of Contents

| Agent | Domain |
|--------|---------|
| [Backend Specialist](#backend-specialist) | Python/FastAPI, SQL |
| [Frontend Specialist](#frontend-specialist) | React (TanStack), UI |
| [Test Engineer](#test-engineer) | QA, E2E (Playwright) |
| [Mobile Developer](#mobile-developer) | iOS, Android, React Native |
| [DevOps Engineer](#devops-engineer) | Docker, CI/CD |
| [Database Architect](#database-architect) | Schema, Migrations |
| [Debugger](#debugger) | Root Cause Analysis |
| [Performance Optimizer](#performance-optimizer) | Web Vitals, Bundle size |
| [Security Auditor](#security-auditor) | Compliance, OWASP |
| [Penetration Tester](#penetration-tester) | Offensive Security |
| [Explorer Agent](#explorer-agent) | Code Analysis |
| [Project Planner](#project-planner) | Task Breakdown |
| [Product Owner](#product-owner) | Requirements, Backlog |
| [SEO Specialist](#seo-specialist) | Ranking, GEO |
| [Documentation Writer](#documentation-writer) | Manuals, Docs |

---

## Suggested Models by Workflow

These are runtime suggestions to help choose the right model for each workflow.

| Workflow | Primary | Alternatives |
|----------|---------|-------------|
| Orchestration and planning (`/engineer`, `/plan`) | `openai/gpt-5.2` | `anthropic/claude-opus-4.5`, `zai/glm-4.7-thinking` |
| Backend/frontend implementation (`/impl`) | `openai/gpt-5.3-codex` | `anthropic/claude-sonnet-4.5`, `zai/glm-4.7-flash` |
| Debugging and incident analysis (`/debug`) | `openai/gpt-5.2-codex` | `anthropic/claude-opus-4.5`, `zai/glm-4.7-thinking` |
| Testing and QA (`/test`) | `openai/gpt-5.3-codex` | `anthropic/claude-sonnet-4.5`, `zai/glm-4.7-flash` |
| Documentation and product workflows (`/doc`, backlog work) | `openai/gpt-5.3-codex` | `anthropic/claude-haiku-4.5`, `zai/glm-4.5-air` |

---

## Backend Specialist

**File:** `.opencode/prompts/backend-specialist.md`

**Domain:** Python/FastAPI, SQL, API Development

**Expertise:**
- FastAPI, Django, Flask (Python)
- Express, Fastify, Hono (Node.js)
- SQLAlchemy, Prisma, Drizzle ORM
- PostgreSQL, SQLite, serverless databases
- API patterns (REST, GraphQL, tRPC)
- Authentication & Authorization (JWT, OAuth, Passkey)
- Background jobs (Celery, ARQ)
- Input validation (Pydantic, Zod)

**Key Skills:**
- `@[skills/python-patterns]` - FastAPI best practices, Pydantic, Async/Await
- `@[skills/api-patterns]` - REST vs GraphQL vs tRPC
- `@[skills/database-design]` - Schema optimization, migrations
- `@[skills/stack-selection]` - Tech stack selection

**When to Use:**
- Building REST, GraphQL, or tRPC APIs
- Implementing authentication/authorization
- Setting up database connections and ORM
- Creating middleware and validation
- Designing API architecture
- Handling background jobs and queues
- Integrating third-party services
- Securing backend endpoints
- Optimizing server performance
- Debugging server-side issues

**Quality Control:**
```bash
# After editing any file:
npm run lint && npx tsc --noEmit  # TypeScript
ruff check                           # Python
```

---

## Frontend Specialist

**File:** `.opencode/prompts/frontend-specialist.md`

**Domain:** React (TanStack), UI/UX, Design

**Expertise:**
- React 18, Next.js, Vite
- TanStack Query (server state), TanStack Router
- State management (Zustand, Context API, Redux Toolkit)
- Tailwind CSS, design systems
- UI libraries (ShadcnUI, Radix UI, Mantine)
- Accessibility (WCAG, ARIA, keyboard navigation)
- Performance optimization (bundle analysis, lazy loading)
- TypeScript strict mode
- Responsive design (mobile-first)
- Animation and motion design

**Key Skills:**
- `@[skills/frontend-design]` - UI/UX Engine, 50+ styles, 97 palettes
- `@[skills/nextjs-react-expert]` - React performance, Vercel engineering
- `@[skills/tailwind-patterns]` - Tailwind v4 utilities, design tokens
- `@[skills/stack-selection]` - Tech stack selection

**When to Use:**
- Building React/Next.js components or pages
- Designing frontend architecture and state management
- Optimizing performance (after profiling)
- Implementing responsive UI or accessibility
- Setting up styling (Tailwind, design systems)
- Code reviewing frontend implementations
- Debugging UI issues or React problems

**Quality Control:**
```bash
# After editing any file:
npm run lint && npx tsc --noEmit
```

---

## Test Engineer

**File:** `.opencode/prompts/test-engineer.md`

**Domain:** QA, Testing, E2E (Playwright)

**Expertise:**
- Unit testing (Vitest, Jest, Pytest)
- Integration testing
- E2E testing (Playwright, Cypress)
- TDD (Test-Driven Development)
- Test coverage analysis
- Mocking and stubbing
- Test automation and CI/CD

**Key Skills:**
- `@[skills/testing-patterns]` - Unit, integration, E2E strategies
- `@[skills/webapp-testing]` - Playwright E2E, browser testing
- `@[skills/tdd-workflow]` - RED-GREEN-REFACTOR cycle
- `@[skills/clean-code]` - Testable code patterns

**When to Use:**
- Writing tests for new features
- Setting up test infrastructure
- Debugging test failures
- Improving test coverage
- Optimizing test performance
- Code reviewing test quality

**Quality Control:**
```bash
# Run test suites
npm run test           # Node.js
pytest                 # Python
```

---

## Mobile Developer

**File:** `.opencode/prompts/mobile-developer.md`

**Domain:** iOS, Android, React Native, Flutter

**Expertise:**
- React Native (iOS + Android)
- Flutter
- Native iOS (Swift) and Android (Kotlin)
- Mobile UI/UX patterns
- Mobile-specific performance optimization
- Push notifications
- App stores (App Store, Play Store)
- Device APIs (camera, GPS, sensors)

**Key Skills:**
- `@[skills/mobile-design]` - iOS/Android mobile development patterns
- `@[skills/clean-code]` - Mobile-first coding standards

**When to Use:**
- Building mobile apps (React Native, Flutter, native)
- Implementing mobile-specific features
- Optimizing mobile performance
- Debugging mobile issues
- Setting up mobile infrastructure

---

## DevOps Engineer

**File:** `.opencode/prompts/devops-engineer.md`

**Domain:** Docker, CI/CD, Deployment

**Expertise:**
- Docker and containerization
- Kubernetes orchestration
- CI/CD pipelines (GitHub Actions, GitLab CI, CircleCI)
- Cloud deployment (AWS, GCP, Azure, Vercel, Railway)
- Infrastructure as Code (Terraform, Pulumi)
- Monitoring and logging
- Secret management
- Rolling deployments and rollbacks

**Key Skills:**
- `@[skills/deployment-procedures]` - Safe deployment workflows
- `@[skills/server-management]` - Process management, monitoring
- `@[skills/deployment-procedures]` - Deployment and Docker practices

**When to Use:**
- Setting up CI/CD pipelines
- Deploying to production
- Managing infrastructure
- Monitoring and logging setup
- Rollback procedures
- Scaling applications

---

## Database Architect

**File:** `.opencode/prompts/database-architect.md`

**Domain:** Schema Design, Migrations, Data

**Expertise:**
- Schema design and normalization
- Database selection (PostgreSQL, MySQL, SQLite, MongoDB, etc.)
- Migration tools (Alembic, Prisma Migrate, Knex)
- ORM selection and configuration
- Indexing strategies
- Query optimization
- Data modeling for specific use cases

**Key Skills:**
- `@[skills/database-design]` - Schema optimization, migrations
- `@[skills/api-patterns]` - Data contracts, API design

**When to Use:**
- Designing database schemas
- Creating migrations
- Selecting appropriate databases
- Optimizing queries
- Setting up data architecture
- Code reviewing database changes

---

## Debugger

**File:** `.opencode/prompts/debugger.md`

**Domain:** Root Cause Analysis, Troubleshooting

**Expertise:**
- 4-phase systematic debugging methodology
- Root cause analysis
- Log analysis
- Error tracking and diagnosis
- Performance bottlenecks
- Memory leaks
- Race conditions
- Distributed tracing

**Key Skills:**
- `@[skills/systematic-debugging]` - 4-phase debugging methodology
- `@[skills/clean-code]` - Preventative patterns

**When to Use:**
- Debugging complex issues
- Investigating production problems
- Analyzing error logs
- Performance troubleshooting
- Memory leak investigation

---

## Performance Optimizer

**File:** `.opencode/prompts/performance-optimizer.md`

**Domain:** Web Vitals, Bundle Size, Speed

**Expertise:**
- Core Web Vitals (LCP, FID, CLS)
- Bundle analysis and optimization
- Code splitting
- Lazy loading
- Image optimization
- Caching strategies
- CDN configuration
- Server-side optimization

**Key Skills:**
- `@[skills/performance-profiling]` - Measurement and optimization techniques
- `@[skills/nextjs-react-expert]` - React performance
- `@[skills/clean-code]` - Performance-first patterns

**When to Use:**
- Optimizing page load times
- Reducing bundle size
- Improving Core Web Vitals
- Analyzing performance bottlenecks
- Setting up caching strategies

---

## Security Auditor

**File:** `.opencode/prompts/security-auditor.md`

**Domain:** Compliance, OWASP, Security

**Expertise:**
- OWASP Top 10 vulnerabilities
- Authentication & authorization patterns
- Input validation and sanitization
- SQL injection prevention
- XSS, CSRF, and other attack vectors
- Security headers
- Dependency vulnerability scanning
- Compliance (GDPR, SOC2, HIPAA)

**Key Skills:**
- `@[skills/vulnerability-scanner]` - Security auditing, dependency analysis
- `@[skills/vulnerability-scanner]` - Security best practices

**When to Use:**
- Conducting security audits
- Implementing authentication/authorization
- Reviewing code for security issues
- Scanning dependencies for vulnerabilities
- Setting up security policies
- Compliance auditing

**Quality Control:**
```bash
# Security scan
python .opencode/scripts/security_scan.py .
```

---

## Penetration Tester

**File:** `.opencode/prompts/penetration-tester.md`

**Domain:** Offensive Security, Red Teaming

**Expertise:**
- Ethical hacking
- Penetration testing
- Vulnerability exploitation
- MITRE ATT&CK framework
- Social engineering
- Network security testing
- Web application testing

**Key Skills:**
- `@[skills/red-team-tactics]` - Attack phases, detection evasion
- `@[skills/vulnerability-scanner]` - Vulnerability analysis

**When to Use:**
- Conducting penetration tests
- Simulating attacks
- Testing security controls
- Red teaming exercises

---

## Explorer Agent

**File:** `.opencode/prompts/explorer-agent.md`

**Domain:** Code Analysis, Discovery

**Expertise:**
- Codebase exploration
- Pattern detection
- Code quality analysis
- Architecture analysis
- Dependency mapping
- Code documentation

**Key Skills:**
- `@[skills/architecture]` - Architectural analysis
- `@[skills/clean-code]` - Code quality assessment

**When to Use:**
- Exploring new codebases
- Understanding code structure
- Generating documentation
- Code quality analysis
- Architecture review

---

## Project Planner

**File:** `.opencode/prompts/project-planner.md`

**Domain:** Task Breakdown, Planning

**Expertise:**
- Sprint planning
- Task breakdown (INPUT→OUTPUT→VERIFY)
- Risk assessment
- Requirements analysis
- User stories and acceptance criteria
- Sprint goals and backlogs

**Key Skills:**
- `@[skills/plan-writing]` - Structured task planning
- `@[skills/brainstorming]` - Socratic questioning
- `@[skills/architecture]` - High-level planning

**When to Use:**
- Creating sprint plans
- Breaking down features
- Writing requirements
- Risk assessment
- Task estimation

---

## Product Owner

**File:** `.opencode/prompts/product-owner.md`

**Domain:** Requirements, Backlog, User Stories

**Expertise:**
- Requirements elicitation
- User story writing
- Backlog management
- Prioritization frameworks (MoSCoW, RICE)
- Stakeholder management
- Roadmap planning

**Key Skills:**
- `@[skills/brainstorming]` - Socratic questioning
- `@[skills/plan-writing]` - Structured planning

**When to Use:**
- Writing user stories
- Managing backlogs
- Prioritizing features
- Roadmap planning
- Stakeholder communication

---

## SEO Specialist

**File:** `.opencode/prompts/seo-specialist.md`

**Domain:** SEO, GEO, Ranking

**Expertise:**
- SEO fundamentals (on-page, off-page, technical SEO)
- Core Web Vitals
- Meta tags and structured data
- Sitemap and robots.txt
- GEO (Generative Engine Optimization)
- Content optimization
- Performance impact on SEO

**Key Skills:**
- `@[skills/seo-fundamentals]` - SEO principles
- `@[skills/geo-fundamentals]` - AI search engine optimization
- `@[skills/performance-profiling]` - SEO performance factors

**When to Use:**
- Optimizing pages for search engines
- Implementing structured data
- Improving Core Web Vitals
- Content optimization
- GEO optimization

---

## Documentation Writer

**File:** `.opencode/prompts/documentation-writer.md`

**Domain:** Manuals, API Docs, Guides

**Expertise:**
- Technical writing
- API documentation (OpenAPI/Swagger)
- User manuals and guides
- README documentation
- Inline code comments
- Changelogs and release notes

**Key Skills:**
- `@[skills/documentation-templates]` - Documentation templates and structure

**When to Use:**
- Writing API documentation
- Creating user guides
- Updating READMEs
- Writing changelogs
- Code commenting

---



## Related Documentation

- [System Architecture](ARCHITECTURE.md) - How agents interact
- [Skills Reference](SKILLS.md) - All domain skills
- [Commands Reference](COMMANDS.md) - All slash commands
- [Workflows](WORKFLOW.md) - Development workflows
