import React from 'react'
import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { createRouter, RouterProvider, createRoute } from '@tanstack/react-router'
import './index.css'

const queryClient = new QueryClient()

const API_BASE = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000'

type Item = { id: number; name: string; description?: string }

function ItemsList() {
  const { data: items, isLoading } = queryClient.useQuery({
    queryKey: ['items'],
    queryFn: () => fetch(`${API_BASE}/items/`).then(r => r.json() as Promise<Item[]>),
  })

  if (isLoading) return <div className="p-4 text-gray-600">Carregando itens...</div>

  return (
    <div className="space-y-3">
      {items?.map(item => (
        <div key={item.id} className="p-4 border border-gray-200 rounded-lg bg-white">
          <h3 className="font-semibold text-gray-900">{item.name}</h3>
          {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
        </div>
      ))}
    </div>
  )
}

const rootRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: () => (
    <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
      <div className="text-center max-w-2xl px-4">
        <h1 className="text-4xl font-bold mb-4 text-white">{{PROJECT_NAME}}</h1>
        <p className="text-slate-400 mb-8">
          Projeto inicial com Tailwind CSS + ShadcnUI
        </p>
        <div className="bg-slate-800 rounded-lg p-6 text-left">
          <h2 className="text-lg font-semibold mb-3 text-white">Exemplo API Integration</h2>
          <p className="text-sm text-slate-400 mb-4">
            Este componente usa TanStack Query para consumir a API do backend (/items/).
            Execute a migration inicial para ver os dados de exemplo.
          </p>
          <ItemsList />
        </div>
      </div>
    </div>
  ),
})

const router = createRouter({
  routeTree: rootRoute,
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
    </QueryClientProvider>
  </React.StrictMode>
)