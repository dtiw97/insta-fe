import { Post } from './Post'
import type { CommentData } from './Comment'

// Updated interface for posts to use the new CommentData structure
interface PostData {
  id: string
  username: string
  userAvatar: string
  image: string
  caption: string
  likes: number
  timeAgo: string
  comments: CommentData[] // Updated to use CommentData instead of simple Comment
  totalCommentsCount?: number // Optional property for total comments including replies
}

// Export the PostData interface so it can be used by Post component
export type { PostData }

function getTotalCommentsCount(comments: CommentData[]): number {
  return comments.reduce((total, comment) => {
    let count = 1 // Count the comment itself
    if (comment.replies) {
      count += comment.replies.length // Add replies count
    }
    return total + count
  }, 0)
}

// Props interface for the Feed component
interface FeedProps {
  posts: PostData[]
  isLoading: boolean
  error: string | null
  onLikePost: (postId: string) => Promise<void>
  onUnlikePost: (postId: string) => Promise<void>
}

// Our Feed component - displays a list of posts
export function Feed({ posts, isLoading, error, onLikePost, onUnlikePost }: FeedProps) {
  // Loading state
  if (isLoading) {
    return (
      <div className="max-w-lg mx-auto">
        <div className="space-y-4 p-4">
          {/* Loading skeleton */}
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg p-4 animate-pulse">
              <div className="flex items-center space-x-3 mb-3">
                <div className="w-10 h-10 bg-gray-300 rounded-full"></div>
                <div className="h-4 bg-gray-300 rounded w-24"></div>
              </div>
              <div className="h-64 bg-gray-300 rounded mb-3"></div>
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-center">
          <p className="text-red-600 mb-2">😞 Failed to load posts</p>
          <p className="text-red-500 text-sm">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-3 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  // Empty state
  if (posts.length === 0) {
    return (
      <div className="max-w-lg mx-auto p-4">
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
          <p className="text-gray-600 mb-2">📱 No posts yet</p>
          <p className="text-gray-500 text-sm">Be the first to share something!</p>
        </div>
      </div>
    )
  }

  // Success state - render posts
  return (
    <div className="max-w-xl mx-auto">
      {/* Posts List */}
      <div className="rounded-b-lg overflow-y-hidden">
        {posts.map((post) => (
          <Post 
            key={post.id} 
            post={{
              ...post,
              // Calculate total comments including replies
              totalCommentsCount: getTotalCommentsCount(post.comments)
            }}
            onLike={() => onLikePost(post.id)}
            onUnlike={() => onUnlikePost(post.id)}
          />
        ))}
      </div>
      
      {/* End of Feed Indicator */}
      <div className="text-center py-8">
        <p className="text-gray-500">
          You've seen all {posts.length} posts! 🎉
        </p>
      </div>
    </div>
  )
} 