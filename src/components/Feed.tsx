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

// Sample data for our feed with nested comments - kept for reference
// This data structure matches what our API returns
// const mockPosts: PostData[] = [
//   {
//     id: '1',
//     username: 'nature_lover',
//     userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e7?w=100&h=100&fit=crop&crop=face',
//     image: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop',
//     caption: 'Beautiful sunset in the mountains 🌅',
//     likes: 1234,
//     timeAgo: '2 hours ago',
//     comments: [
//       { 
//         id: 'c1', 
//         username: 'photographer_pro', 
//         userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         text: 'Amazing shot! What camera did you use?', 
//         likes: 12,
//         timeAgo: '1h',
//         replies: [
//           {
//             id: 'r1',
//             username: 'nature_lover',
//             userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e7?w=100&h=100&fit=crop&crop=face',
//             text: 'Thanks! I used a Canon EOS R5 with a 24-70mm lens',
//             likes: 5,
//             timeAgo: '45m'
//           },
//           {
//             id: 'r2',
//             username: 'camera_geek',
//             userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
//             text: 'That\'s an amazing camera! Great choice 📸',
//             likes: 2,
//             timeAgo: '30m'
//           }
//         ]
//       },
//       { 
//         id: 'c2', 
//         username: 'travel_buddy', 
//         userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
//         text: 'This makes me want to go hiking!', 
//         likes: 8,
//         timeAgo: '45m',
//         replies: [
//           {
//             id: 'r3',
//             username: 'mountain_explorer',
//             userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
//             text: 'You should totally do it! This trail is beginner-friendly',
//             likes: 3,
//             timeAgo: '20m'
//           }
//         ]
//       },
//       { 
//         id: 'c3', 
//         username: 'mountain_explorer', 
//         userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
//         text: 'Which mountain is this?', 
//         likes: 4,
//         timeAgo: '30m'
//       }
//     ]
//   },
//   {
//     id: '2',
//     username: 'coffee_addict',
//     userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//     image: 'https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop',
//     caption: 'Perfect morning coffee ☕️ Ready to tackle the day!',
//     likes: 892,
//     timeAgo: '4 hours ago',
//     comments: [
//       { 
//         id: 'c4', 
//         username: 'barista_life', 
//         userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e7?w=100&h=100&fit=crop&crop=face',
//         text: 'That latte art is perfect!', 
//         likes: 15,
//         timeAgo: '3h',
//         replies: [
//           {
//             id: 'r4',
//             username: 'coffee_addict',
//             userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//             text: 'Thank you! Took me years to master this technique ☕️',
//             likes: 7,
//             timeAgo: '2h'
//           }
//         ]
//       },
//       { 
//         id: 'c5', 
//         username: 'morning_person', 
//         userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
//         text: 'This is exactly what I need right now', 
//         likes: 6,
//         timeAgo: '2h'
//       }
//     ]
//   },
//   {
//     id: '3',
//     username: 'urban_explorer',
//     userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
//     image: 'https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=400&h=400&fit=crop',
//     caption: 'City lights never get old ✨ #nightphotography',
//     likes: 2156,
//     timeAgo: '6 hours ago',
//     comments: [
//       { 
//         id: 'c6', 
//         username: 'night_owl', 
//         userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
//         text: 'The reflections are incredible!', 
//         likes: 22,
//         timeAgo: '5h'
//       },
//       { 
//         id: 'c7', 
//         username: 'city_life', 
//         userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
//         text: 'I love this view!', 
//         likes: 18,
//         timeAgo: '4h',
//         replies: [
//           {
//             id: 'r5',
//             username: 'urban_explorer',
//             userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
//             text: 'Thanks! This spot is my favorite for night photography',
//             likes: 9,
//             timeAgo: '3h'
//           },
//           {
//             id: 'r6',
//             username: 'photo_enthusiast',
//             userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//             text: 'Could you share the location? I\'d love to try this shot!',
//             likes: 4,
//             timeAgo: '2h'
//           }
//         ]
//       },
//       { 
//         id: 'c8', 
//         username: 'photographer_pro', 
//         userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         text: 'Great composition and timing', 
//         likes: 31,
//         timeAgo: '3h'
//       }
//     ]
//   },
//   {
//     id: '4',
//     username: 'food_enthusiast',
//     userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
//     image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=400&fit=crop',
//     caption: 'Homemade pizza night! 🍕 Recipe in my story',
//     likes: 567,
//     timeAgo: '8 hours ago',
//     comments: [
//       { 
//         id: 'c9', 
//         username: 'pizza_lover', 
//         userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e7?w=100&h=100&fit=crop&crop=face',
//         text: 'This looks absolutely delicious!', 
//         likes: 12,
//         timeAgo: '7h'
//       },
//       { 
//         id: 'c10', 
//         username: 'home_chef', 
//         userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
//         text: 'Can you share the dough recipe?', 
//         likes: 8,
//         timeAgo: '6h',
//         replies: [
//           {
//             id: 'r7',
//             username: 'food_enthusiast',
//             userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
//             text: 'Of course! Check my story - I posted the full recipe there 🍕',
//             likes: 5,
//             timeAgo: '5h'
//           }
//         ]
//       }
//     ]
//   },
//   {
//     id: '5',
//     username: 'beach_vibes',
//     userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
//     image: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&h=400&fit=crop',
//     caption: 'Paradise found 🏝️ Nothing beats a day at the beach',
//     likes: 3421,
//     timeAgo: '12 hours ago',
//     comments: [
//       { 
//         id: 'c11', 
//         username: 'ocean_lover', 
//         userAvatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100&h=100&fit=crop&crop=face',
//         text: 'This water is so crystal clear!', 
//         likes: 45,
//         timeAgo: '11h'
//       },
//       { 
//         id: 'c12', 
//         username: 'vacation_mode', 
//         userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
//         text: 'I need a beach day ASAP', 
//         likes: 28,
//         timeAgo: '10h'
//       },
//       { 
//         id: 'c13', 
//         username: 'travel_dreams', 
//         userAvatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
//         text: 'Where is this beautiful place?', 
//         likes: 19,
//         timeAgo: '9h',
//         replies: [
//           {
//             id: 'r8',
//             username: 'beach_vibes',
//             userAvatar: 'https://images.unsplash.com/photo-1544725176-7c40e5a71c5e?w=100&h=100&fit=crop&crop=face',
//             text: 'This is Maldives! Absolutely breathtaking in person 🌴',
//             likes: 15,
//             timeAgo: '8h'
//           },
//           {
//             id: 'r9',
//             username: 'island_hopper',
//             userAvatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b0e7?w=100&h=100&fit=crop&crop=face',
//             text: 'Adding this to my bucket list right now! 🗺️',
//             likes: 7,
//             timeAgo: '7h'
//           }
//         ]
//       }
//     ]
//   }
// ]

// Helper function to count total comments including replies
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
    <div className="max-w-lg mx-auto ">
      {/* Posts List */}
      <div className="space-y-0 rounded-b-lg overflow-y-hidden">
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