import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// ? TanStack Query ? \\
  const queryClient = new QueryClient()
// ? TanStack Query ? \\


createRoot(document.getElementById('root')!).render(
  <BrowserRouter>

    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  
  </BrowserRouter>,
)