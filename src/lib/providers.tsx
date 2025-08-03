import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

// Accept query client as prop instead of creating a new one
interface AppProvidersProps {
  children: React.ReactNode;
  queryClient?: QueryClient;
}

// Main provider component that wraps your app
export function AppProviders({ children, queryClient }: AppProvidersProps) {
  // Create fallback query client if none provided (for backward compatibility)
  const client = queryClient || new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 1000 * 60 * 5, // 5 minutes
        gcTime: 1000 * 60 * 10, // 10 minutes
      },
    },
  });

  return (
    <QueryClientProvider client={client}>
      {children}
    </QueryClientProvider>
  )
}
