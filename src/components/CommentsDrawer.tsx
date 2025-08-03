import { useState } from 'react'
import { Send } from 'lucide-react'
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
// import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { Comment, type CommentData } from './Comment'

interface CommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  comments: CommentData[]
  postUsername: string
  commentsCount: number
}

export function CommentsDrawer({ 
  isOpen, 
  onClose, 
  comments, 
  postUsername, 
  commentsCount 
}: CommentsDrawerProps) {
  // State for new comment input
  const [newComment, setNewComment] = useState('')

  // Handle new comment submission
  const handleCommentSubmit = () => {
    if (newComment.trim()) {
      // In a real app, this would send the comment to a server
      console.log('New comment submitted:', newComment)
      setNewComment('')
      // You would typically update the comments list here
    }
  }

  // Handle reply to a specific comment
  const handleReply = (commentId: string) => {
    console.log('Reply to comment:', commentId)
    // In a real app, you would handle the reply logic here
  }

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh] max-w-md mx-auto">
        {/* Header */}
        <DrawerHeader className="h-0">
          <DrawerTitle className="text-center max-h-0">
            
          </DrawerTitle>
          <DrawerClose />
        </DrawerHeader>

        {/* Comments List */}
        <div className="flex-1 overflow-y-auto p-4">
          {comments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No comments yet</p>
              <p className="text-sm text-gray-400 mt-1">Be the first to comment!</p>
            </div>
          ) : (
            <div className="space-y-1">
              {comments.map((comment) => (
                <Comment
                  key={comment.id}
                  comment={comment}
                  onReply={handleReply}
                />
              ))}
            </div>
          )}
        </div>

        <Separator />

        {/* Add Comment Section */}
        <div className="p-4 bg-white">
          <div className="flex items-center space-x-3">

            {/* Comment input */}
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder={`Add a comment for ${postUsername}...`}
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <Button
                onClick={handleCommentSubmit}
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-blue-500"
                disabled={!newComment.trim()}
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 