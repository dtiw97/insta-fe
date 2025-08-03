import { useState } from 'react'
import { Heart, MessageCircle, ChevronDown, ChevronUp } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'

// Define the structure of a comment with nested replies
export interface CommentData {
  id: string
  username: string
  userAvatar: string
  text: string
  likes: number
  timeAgo: string
  replies?: CommentData[] // Optional replies array for nested comments
}

interface CommentProps {
  comment: CommentData
  isReply?: boolean // Whether this is a reply (nested comment)
  onReply?: (commentId: string) => void // Function to handle replying
}

export function Comment({ comment, isReply = false, onReply }: CommentProps) {
  // State for managing like status and likes count
  const [isLiked, setIsLiked] = useState(false)
  const [likesCount, setLikesCount] = useState(comment.likes)
  
  // State for managing whether replies are expanded or collapsed
  const [showReplies, setShowReplies] = useState(false)
  
  // State for managing reply input
  const [showReplyInput, setShowReplyInput] = useState(false)
  const [replyText, setReplyText] = useState('')

  // Handle like button click
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false)
      setLikesCount(prev => prev - 1)
    } else {
      setIsLiked(true)
      setLikesCount(prev => prev + 1)
    }
  }

  // Handle reply submission
  const handleReplySubmit = () => {
    if (replyText.trim()) {
      // In a real app, this would send the reply to a server
      console.log('Reply submitted:', replyText)
      setReplyText('')
      setShowReplyInput(false)
      // Optionally call the onReply callback
      if (onReply) {
        onReply(comment.id)
      }
    }
  }

  // Toggle replies visibility
  const toggleReplies = () => {
    setShowReplies(!showReplies)
  }

  return (
    <div className={`${isReply ? 'ml-8 mt-3' : 'mb-4'}`}>
      {/* Comment Content */}
      <div className="flex items-start space-x-3">
        {/* User Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.userAvatar} alt={comment.username} />
          <AvatarFallback>{comment.username.charAt(0).toUpperCase()}</AvatarFallback>
        </Avatar>

        {/* Comment Text and Actions */}
        <div className="flex-1 min-w-0">
          {/* Comment Text */}
          <div className="bg-gray-100 rounded-2xl px-4 py-2">
            <div className="font-semibold text-sm">{comment.username}</div>
            <div className="text-sm mt-1">{comment.text}</div>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 text-xxs text-gray-500">
            <span>{comment.timeAgo}</span>
            
            {/* Like button */}
            <button 
              onClick={handleLike}
              className={`font-semibold ${isLiked ? 'text-red-500' : 'hover:text-gray-700'}`}
            >
              {likesCount > 0 && `${likesCount} `}Like
            </button>
            
            {/* Reply button - only show for top-level comments */}
            {!isReply && (
              <button 
                onClick={() => setShowReplyInput(!showReplyInput)}
                className="font-semibold hover:text-gray-700"
              >
                Reply
              </button>
            )}
          </div>

          {/* Reply Input */}
          {showReplyInput && (
            <div className="mt-3 flex items-center space-x-2">
              <div className="flex-1 flex items-center space-x-2">
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="Write a reply..."
                  className="flex-1 bg-gray-100 rounded-full px-3 py-1 text-sm outline-none"
                  onKeyPress={(e) => e.key === 'Enter' && handleReplySubmit()}
                />
                <Button
                  onClick={handleReplySubmit}
                  variant="ghost"
                  size="sm"
                  className="text-blue-500 font-semibold text-xs"
                  disabled={!replyText.trim()}
                >
                  Post
                </Button>
              </div>
            </div>
          )}

          {/* Replies Section */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-3">
              {/* Toggle Replies Button */}
              <button
                onClick={toggleReplies}
                className="flex items-center space-x-1 text-xxs font-semibold text-gray-600 hover:text-gray-800"
              >
                {showReplies ? (
                  <>
                    <ChevronUp className="h-4 w-4" />
                    <span>Hide {comment.replies.length} replies</span>
                  </>
                ) : (
                  <>
                    <ChevronDown className="h-4 w-4" />
                    <span>View {comment.replies.length} replies</span>
                  </>
                )}
              </button>

              {/* Replies List */}
              {showReplies && (
                <div className="mt-2">
                  {comment.replies.map((reply) => (
                    <Comment
                      key={reply.id}
                      comment={reply}
                      isReply={true}
                      onReply={onReply}
                    />
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
} 