# OpenKit Blueprints

> Optional project blueprints for quick start with pre-configured stacks.

---

## Table of Contents

| Blueprint | Stack | Use Case |
|-----------|-------|-----------|
| **[Fullstack Blueprint](#fullstack-blueprint)** | React + Vite + TanStack + FastAPI + SQLAlchemy | Full-stack web applications |

---

## Fullstack Blueprint

**Location:** `@blueprints/fullstack/`

### Overview

Production-ready full-stack project structure with development and production Docker Compose configurations.

### Stack Details

**Frontend:**
```
- React 18: Modern, component-based
- Vite: Fast dev server, optimized builds
- TanStack Query: Server state management (caching, refetching, deduping)
- TanStack Router: Type-safe routing with file-based routes
- Tailwind CSS: Utility-first styling
- ShadcnUI: Accessible, customizable components
```

**Backend:**
```
- FastAPI: Async, modern Python, automatic OpenAPI docs
- SQLAlchemy: ORM with migration support
- Alembic: Database migrations
- PostgreSQL: Robust relational database
- Redis: Caching and Celery broker
- Celery: Async task queue for background jobs
```

**Infrastructure:**
```
- Docker: Containerization
- Docker Compose (dev): Development environment
- Docker Compose (prod): Production environment
- Poetry: Python dependency management
```

### Project Structure

```
fullstack/
├── backend/
│   ├── app/
│   │   ├── api/         # API endpoints
│   │   ├── core/        # Core configuration
│   │   ├── models/       # SQLAlchemy models
│   │   ├── routers/      # FastAPI routers
│   │   ├── schemas/      # Pydantic schemas
│   │   ├── services/     # Business logic
│   │   ├── tasks/        # Celery tasks
│   │   ├── database.py   # DB connection
│   │   ├── main.py       # FastAPI app
│   │   └── settings.py   # App settings
│   ├── migrations/        # Alembic migrations
│   ├── pyproject.toml   # Python dependencies
│   └── Dockerfile
├── frontend/
│   ├── src/
│   │   ├── components/ # React components
│   │   │   └── ui/     # ShadcnUI components
│   │   ├── lib/       # Utilities and API config
│   │   ├── routes/    # TanStack Router routes
│   │   └── main.tsx   # React entry
│   ├── index.html
│   ├── package.json
│   ├── tailwind.config.ts
│   ├── vite.config.ts
│   └── Dockerfile
├── docker-compose.dev.yml  # Development environment
├── docker-compose.prod.yml # Production environment
└── README.md
```

### Quick Start

```bash
# Initialize with blueprint
npx @paulojalowyj/openkit init --blueprint fullstack \
  --project-name "My Project" \
  --project-identifier "my-project"

# Start development environment
cd my-project
docker compose -f docker-compose.dev.yml up -d

# Run migrations
docker compose -f docker-compose.dev.yml exec backend alembic upgrade head

# Access:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Development Pattern

**Backend (using OpenKit):**

1. Create Model in `backend/app/models/`
2. Create Schema in `backend/app/schemas/`
3. Create Service in `backend/app/services/`
4. Create Router in `backend/app/routers/` and register in `main.py`
5. Generate migration: `alembic revision --autogenerate -m "description"`

**Frontend (using OpenKit):**

1. Add components ShadcnUI: `npx shadcn-ui@latest add button card input`
2. Create page/component
3. Use TanStack Query to query API:
   ```tsx
   const { data } = useQuery({
     queryKey: ['items'],
     queryFn: () => fetch('${API_BASE}/items/').then(r => r.json()),
   })
   ```

### Features Included

- **Pre-configured Docker environments** (dev and prod)
- **Example fullstack implementation** (Model/Schema/Service/Router)
- **Initial migration with sample data**
- **TanStack Query integration** for server state
- **ShadcnUI setup** for UI components
- **Alembic for migrations**
- **Celery worker for background tasks**
- **PostgreSQL and Redis** containers
- **Poetry for Python dependencies**

### Customization

The blueprint is a starting point. Customize as needed:

- **Add more API endpoints** in `backend/app/routers/`
- **Create additional models** in `backend/app/models/`
- **Add frontend pages** in `frontend/src/routes/`
- **Customize Tailwind theme** in `frontend/tailwind.config.ts`
- **Add more services** to `backend/app/services/`
- **Configure Celery tasks** in `backend/app/tasks/`

### When to Use

**Use fullstack blueprint when:**
- Building a typical web application
- Team is comfortable with Python + React
- Want production-ready setup from day one
- Need authentication, database, API, UI

**Consider alternatives when:**
- Edge deployment is required (Hono/Bun)
- Team expertise is in different stack (Node.js, Go)
- Specific requirements don't fit (mobile-first React Native)
- Legacy systems must integrate

---

## Related Documentation

- [Stack Selection Skill](../.opencode/skills/stack-selection/SKILL.md) - How to choose tech stacks
- [create Command](COMMANDS.md#create) - How to bootstrap projects
- [Backend Specialist](AGENTS.md#backend-specialist) - Backend development
- [Frontend Specialist](AGENTS.md#frontend-specialist) - Frontend development

---

## Finding Blueprints

Blueprints are located in `blueprints/<blueprint-name>/`.

To see available blueprints:

```bash
# List all blueprints
ls blueprints/

# Read specific blueprint
cat blueprints/fullstack/README.md
```

---

## Creating Custom Blueprints

To create a custom blueprint:

1. Create directory `blueprints/<name>/`
2. Add `README.md` with:
   - Overview
   - Stack details
   - Project structure
   - Quick start
   - Features included
   - Customization guide
3. Add template files (use `{{PLACEHOLDER}}` for dynamic values)
4. Update OpenKit to recognize blueprint

---

## Contributing Blueprints

Have a great blueprint to share? Contribute it!

1. Create blueprint following the structure above
2. Test it thoroughly
3. Submit PR to [github.com/paulojalowyj/openkit](https://github.com/paulojalowyj/openkit)

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
