import { createTRPCReact } from '@trpc/react-query'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

// Import our existing PostData type from components
import type { PostData } from '../components/Feed'

// Define our API interface that matches the backend
// This ensures type safety without direct imports
export interface AppRouter {
  getPosts: {
    query: () => PostData[]
  }
  createPost: {
    mutate: (input: {
      username: string
      userAvatar: string
      image: string
      caption: string
    }) => PostData
  }
  likePost: {
    mutate: (input: { id: string }) => PostData
  }
  getPostById: {
    query: (input: { id: string }) => PostData
  }
  unlikePost: {
    mutate: (input: { id: string }) => PostData
  }
}

// Create the React Query tRPC client for hooks
// This gives us hooks like useQuery, useMutation with full type safety
export const trpc = createTRPCReact<any>()

// Create a vanilla tRPC client for direct API calls  
export const trpcClient = createTRPCProxyClient<any>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8787/trpc', // Your backend URL
      
      // Optional: Add headers for authentication later
      // headers: async () => {
      //   return {
      //     authorization: `Bearer ${getAuthToken()}`,
      //   }
      // },
    }),
  ],
}) 