import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";
import "../index.css";

import { Feed } from "@/components/Feed";
import type { PostData } from "@/components/Feed";
import { Header } from "@/components/Header";

// Helper function to make tRPC HTTP calls
async function trpcCall(procedure: string, input?: any): Promise<any> {
  const url = `http://localhost:8787/trpc/${procedure}`;
  const isQuery = ['getPosts', 'getPostById'].includes(procedure);
  
  if (isQuery) {
    // For queries, use GET request
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Failed to fetch ${procedure}`);
    const data = await response.json();
    
    return data.result?.data || data;
  } else {
    // For mutations, use POST request
    const response = await fetch(url, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error(`Failed to call ${procedure}`);
    const data = await response.json();

    return data.result?.data || data;
  }
}

// Query function for getting posts
// Function to fetch posts from the server
async function getPostsQueryFn(): Promise<PostData[]> {
  console.log("🔄 Fetching posts via tRPC...");
  const result = await trpcCall('getPosts');
  console.log("📡 tRPC response:", result);

  return result;
};

// Query key is like a unique identifier for this data in React Query's cache
// We use 'posts' since this query fetches posts data
// The 'as const' ensures TypeScript treats this as a readonly tuple
// Query keys can be more complex like ['posts', userId, filters] to be more specific
const postsQueryKey = ['posts'] as const;

export const Route = createFileRoute("/")({
  // Loader runs before component and prefetches data
  loader: async ({ context }) => {
    // Get query client from context
    const queryClient = (context as any).queryClient;
    
    // Prefetch posts data into React Query cache using our query key
    // When the component loads, it will find this data in the cache using the same key
    return await queryClient.ensureQueryData({
      queryKey: postsQueryKey, // React Query uses this key to store/retrieve the data
      queryFn: getPostsQueryFn,
      staleTime: 1000 * 60 * 5, // 5 minutes
    });
  },
  component: App,
});

function App() {
  const queryClient = useQueryClient();

  // useSuspenseQuery uses the same query key to find the prefetched data in cache
  // If the data wasn't in cache, it would use queryFn to fetch it
  const { data: posts } = useSuspenseQuery({
    queryKey: postsQueryKey, // Must match the key used in loader
    queryFn: getPostsQueryFn,
    staleTime: 1000 * 60 * 5,
  });

  // Mutation for liking posts
  const likeMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("👍 Liking post via tRPC:", postId);
      return await trpcCall('likePost', { id: postId });
    },
    // Optimistic update
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey });
      const previousPosts = queryClient.getQueryData<PostData[]>(postsQueryKey);

      queryClient.setQueryData<PostData[]>(postsQueryKey, (old) =>
        old?.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        ) ?? []
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      console.error(`❌ Failed to like post: ${postId}`, err);
      if (context?.previousPosts) {
        queryClient.setQueryData(postsQueryKey, context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
    },
  });

  // Mutation for unliking posts
  const unlikeMutation = useMutation({
    mutationFn: async (postId: string) => {
      console.log("👎 Unliking post via tRPC:", postId);
      return await trpcCall('unlikePost', { id: postId });
    },
    onMutate: async (postId: string) => {
      await queryClient.cancelQueries({ queryKey: postsQueryKey });
      const previousPosts = queryClient.getQueryData<PostData[]>(postsQueryKey);

      queryClient.setQueryData<PostData[]>(postsQueryKey, (old) =>
        old?.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        ) ?? []
      );

      return { previousPosts };
    },
    onError: (err, postId, context) => {
      console.error(`❌ Failed to unlike post: ${postId}`, err);
      if (context?.previousPosts) {
        queryClient.setQueryData(postsQueryKey, context.previousPosts);
      }
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: postsQueryKey });
    },
  });

  // Handler functions
  const handleLikePost = async (postId: string) => {
    likeMutation.mutate(postId);
  };

  const handleUnlikePost = async (postId: string) => {
    unlikeMutation.mutate(postId);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Clean component - loader handles initial fetch */}
      <Feed
        posts={posts}
        isLoading={false} // Always false since data is prefetched
        error={null}      // Error boundaries will handle errors
        onLikePost={handleLikePost}
        onUnlikePost={handleUnlikePost}
      />
    </div>
  );
}
