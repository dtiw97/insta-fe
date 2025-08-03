import { useState } from 'react'
import { Send, X } from 'lucide-react'
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
import { useCommentsStore } from '@/zustand/comments'

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
  // Get Zustand store state and actions
  const { 
    commentText, 
    replyTarget, 
    setCommentText, 
    clearCommentText, 
    clearReplyTarget 
  } = useCommentsStore();

  // Handle new comment submission
  const handleCommentSubmit = () => {
    if (commentText.trim()) {
      // In a real app, this would send the comment to a server
      console.log('New comment submitted:', commentText);
      
      if (replyTarget) {
        console.log(`💬 Replying to comment ID: ${replyTarget.commentId} (@${replyTarget.username})`);
      }
      
      // Clear both comment text and reply target after submission
      clearCommentText();
      clearReplyTarget();
    }
  };

  // Handle clearing reply target when user wants to cancel replying
  const handleClearReply = () => {
    // Remove the @username tag from the comment text
    if (replyTarget) {
      const tagToRemove = `@${replyTarget.username} `;
      const newText = commentText.replace(tagToRemove, '').trim();
      setCommentText(newText);
    }
    // Clear the reply target
    clearReplyTarget();
  };

  // Handle reply to a specific comment (this is called from Comment component)
  const handleReply = (commentId: string) => {
    console.log('Reply to comment:', commentId);
    // The actual reply tagging is now handled by Zustand store in Comment component
    // This function could be used for other reply-related logic if needed
  };

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
          {/* Reply indicator */}
          {/* {replyTarget && (
            <div className="mb-2 px-3 py-2 bg-blue-50 rounded-lg flex items-center justify-between">
              <span className="text-sm text-blue-700">
                Replying to <strong>@{replyTarget.username}</strong>
              </span>
              <button
                onClick={handleClearReply}
                className="text-blue-500 hover:text-blue-700"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          )} */}
          
          <div className="flex items-center space-x-3">
            {/* Comment input - now controlled by Zustand */}
            <div className="flex-1 flex items-center space-x-2">
              <input
                type="text"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                placeholder={
                  replyTarget 
                    ? `Reply to @${replyTarget.username}...` 
                    // : `Add a comment for ${postUsername}...`
                    : "Add a comment"
                }
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleCommentSubmit()}
              />
              <Button
                onClick={handleCommentSubmit}
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-blue-500"
                disabled={!commentText.trim()}
              >
                <Send className="h-5 w-5 rotate-45" />
              </Button>
            </div>
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  )
} 