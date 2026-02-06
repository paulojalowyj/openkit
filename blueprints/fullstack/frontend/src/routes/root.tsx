import { createFileRoute } from '@tanstack/react-router'

const Index = () => {
  throw new Error('/')
}

export const Route = createFileRoute('/')({ component: Index })