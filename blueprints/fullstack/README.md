## OpenKit Fullstack Blueprint

Template inicial com estrutura backend (FastAPI) + frontend (React) configurado, exemplo fullstack com migrations e dados de exemplo.

### O que está incluído

- **Frontend**: React 18 + Vite + TanStack Query + TanStack Router + Tailwind CSS + ShadcnUI
- **Backend**: FastAPI + SQLAlchemy + Alembic (migrations)
- **Infra**: Docker Compose (dev e prod), PostgreSQL, Redis, Celery worker
- **Exemplo fullstack**: Model/Schema/Service/Router com migration inicial e dados de exemplo

### Início Rápido

```bash
# Iniciar com um único comando
docker compose -f docker-compose.dev.yml up -d

# Rodar migrations para ver dados de exemplo
docker compose -f docker-compose.dev.yml exec backend alembic upgrade head

# Acesse:
# Frontend: http://localhost:5173
# Backend API: http://localhost:8000
# API Docs: http://localhost:8000/docs
```

### Padrão de Development

#### Backend - usando OpenCode

1. Criar Model em `backend/app/models/`
2. Criar Schema em `backend/app/schemas/`
3. Criar Service em `backend/app/services/`
4. Criar Router em `backend/app/routers/` e registrar em `main.py`
5. Gerar migration: `alembic revision --autogenerate -m "descricao"`

#### Frontend - usando OpenCode

1. Adicionar componentes ShadcnUI: `npx shadcn-ui@latest add button card input`
2. Criar página/componente
3. Usar TanStack Query para consultar API:
   ```tsx
   const { data } = useQuery({
     queryKey: ['items'],
     queryFn: () => fetch('${API_BASE}/items/').then(r => r.json()),
   })
   ```

### Estrutura

```
backend/app/
├── models/         # SQLAlchemy models (ex: models/item.py)
├── schemas/        # Pydantic schemas (ex: schemas/item.py)
├── services/       # Business logic (ex: services/item_service.py)
├── routers/        # API routes (ex: routers/items.py)
└── migrations/     # Alembic migrations

frontend/src/
├── components/ui/  # ShadcnUI components
├── lib/
│   ├── api.ts      # API config
│   └── utils.ts    # Utils para ShadcnUI
└── routes/         # TanStack Router
```