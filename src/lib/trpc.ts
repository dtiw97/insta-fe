import { createTRPCReact } from '@trpc/react-query'
import { createTRPCProxyClient, httpBatchLink } from '@trpc/client'

// Import our existing PostData type from components
import type { PostData } from '../components/Feed'

// Create the tRPC React hooks client
// We use 'any' for now since we don't have direct access to backend router type
export const trpc = createTRPCReact<any>()

// Create a vanilla tRPC client for direct API calls if needed
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

// Export types for the procedures we know exist on our backend
// This helps with autocompletion and type safety
export type RouterInputs = {
  createPost: {
    username: string
    userAvatar: string  
    image: string
    caption: string
  }
  likePost: { id: string }
  unlikePost: { id: string }
  getPostById: { id: string }
}

export type RouterOutputs = {
  getPosts: PostData[]
  getPostById: PostData
  createPost: PostData
  likePost: PostData
  unlikePost: PostData
} 