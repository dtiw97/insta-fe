import { StrictMode } from 'react'
import ReactDOM from 'react-dom/client'
import { RouterProvider, createRouter } from '@tanstack/react-router'
import { QueryClient } from '@tanstack/react-query'

// Import the generated route tree
import { routeTree } from './routeTree.gen'

// Import our providers for tRPC and React Query
import { AppProviders } from './lib/providers'

import './index.css'
import reportWebVitals from './reportWebVitals.ts'

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      gcTime: 1000 * 60 * 10, // 10 minutes
    },
  },
})

// Create a new router instance with query client in context
const router = createRouter({
  routeTree,
  context: {
    // Provide query client to all loaders
    queryClient,
  },
  defaultPreload: 'intent',
  scrollRestoration: true,
  defaultStructuralSharing: true,
  defaultPreloadStaleTime: 0,
})

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router
  }
  
  // Add context type for loaders
  interface RouteContext {
    queryClient: QueryClient
  }
}

// Render the app with providers
const rootElement = document.getElementById('app')
if (rootElement && !rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement)
  root.render(
    <StrictMode>
      <AppProviders queryClient={queryClient}>
        <RouterProvider router={router} />
      </AppProviders>
    </StrictMode>,
  )
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals()
