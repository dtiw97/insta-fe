import { Send } from 'lucide-react'
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { 
  Drawer, 
  DrawerContent, 
  DrawerHeader, 
  DrawerTitle, 
  DrawerClose 
} from '@/components/ui/drawer'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Comment, type CommentData } from './Comment'
import { useCommentsStore } from '@/zustand/comments'
import trpcCall from "@/lib/apicall";

interface CommentsDrawerProps {
  isOpen: boolean
  onClose: () => void
  comments: CommentData[]
  postUsername: string
  commentsCount: number
  postId: string // Add postId prop for comment creation
}

// Schema for creating regular comments
const CreateCommentSchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  username: z.string().min(1, "Username is required"),
  userAvatar: z.string().url("Must be a valid URL"),
  text: z
    .string()
    .min(1, "Comment text is required")
    .max(300, "Comment too long"),
});

// Enhanced schema for creating replies (supports nested replies)
const CreateReplySchema = z.object({
  postId: z.string().min(1, "Post ID is required"),
  commentId: z.string().min(1, "Comment ID is required"),
  replyId: z.string().optional(), // Optional - for nested replies
  username: z.string().min(1, "Username is required"),
  userAvatar: z.string().url("Must be a valid URL"),
  text: z
    .string()
    .min(1, "Reply text is required")
    .max(300, "Reply too long"),
});

type CreateCommentInput = z.infer<typeof CreateCommentSchema>;
type CreateReplyInput = z.infer<typeof CreateReplySchema>;

// Function to create a regular comment
async function createComment(input: CreateCommentInput): Promise<any> {
  const validatedData = CreateCommentSchema.parse(input);
  console.log("🚀 Creating comment with validated data:", validatedData);
  
  const result = await trpcCall("addComment", validatedData);
  console.log("✅ Comment created successfully:", result);
  
  return result;
}

// Function to create a reply to a comment (or nested reply)
async function createReply(input: CreateReplyInput): Promise<any> {
  const validatedData = CreateReplySchema.parse(input);
  console.log("🚀 Creating reply with validated data:", validatedData);
  
  const result = await trpcCall("addReply", validatedData);
  console.log("✅ Reply created successfully:", result);
  
  return result;
}

export function CommentsDrawer({ 
  isOpen, 
  onClose, 
  comments, 
  postId 
}: CommentsDrawerProps) {
  const queryClient = useQueryClient();
  
  // Get Zustand store state and actions
  const { 
    commentText, 
    replyTarget, 
    setCommentText, 
    clearCommentText, 
    clearReplyTarget 
  } = useCommentsStore();

  // React Query mutation for creating regular comments
  const createCommentMutation = useMutation({
    mutationFn: createComment,
    onSuccess: (result) => {
      console.log("🎉 Comment created successfully!");
      
      // Invalidate posts to refresh the comment count and comments list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      // Clear comment text and reply target after successful submission
      clearCommentText();
      clearReplyTarget();
      
      // Optional: Show success feedback
      console.log("💬 Comment added to post:", result);
    },
    onError: (error: any) => {
      console.error("❌ Failed to create comment:", error);
      
      // Handle validation errors
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.issues);
      }
      
      // Show error feedback to user
      alert(`Failed to add comment: ${error.message}`);
    },
  });

  // React Query mutation for creating replies (including nested replies)
  const createReplyMutation = useMutation({
    mutationFn: createReply,
    onSuccess: (result) => {
      console.log("🎉 Reply created successfully!");
      
      // Invalidate posts to refresh the comment count and replies list
      queryClient.invalidateQueries({ queryKey: ["posts"] });
      
      // Clear comment text and reply target after successful submission
      clearCommentText();
      clearReplyTarget();
      
      // Optional: Show success feedback
      console.log("💬 Reply added:", result);
    },
    onError: (error: any) => {
      console.error("❌ Failed to create reply:", error);
      
      // Handle validation errors
      if (error instanceof z.ZodError) {
        console.error("Validation errors:", error.issues);
      }
      
      // Show error feedback to user
      alert(`Failed to add reply: ${error.message}`);
    },
  });

  // Handle comment/reply submission with nested reply support
  const handleSubmit = () => {
    if (!commentText.trim()) return;

    // Check if we're replying to something or adding a regular comment
    if (replyTarget) {
      // We're replying to a comment or nested reply
      const replyData: CreateReplyInput = {
        postId: postId,
        commentId: replyTarget.commentId, // Always the top-level comment ID
        replyId: replyTarget.replyId, // Will be undefined for regular replies, set for nested replies
        username: "xX_Rand_dude_Xx", // Fixed user for now
        userAvatar: "https://media.npr.org/assets/img/2022/01/04/ap_862432864149-3b9c48cc946a5eccab772a75c5b434fddfdae43a.jpg?s=1100&c=50&f=jpeg", // Fixed avatar
        text: commentText.trim(),
      };

      if (replyTarget.isNestedReply) {
        console.log(`💬 Creating nested reply to reply ID: ${replyTarget.replyId} in comment: ${replyTarget.commentId} (@${replyTarget.username})`);
      } else {
        console.log(`💬 Creating regular reply to comment ID: ${replyTarget.commentId} (@${replyTarget.username})`);
      }
      
      createReplyMutation.mutate(replyData);
    } else {
      // We're adding a regular comment
      const commentData: CreateCommentInput = {
        postId: postId,
        username: "xX_Rand_dude_Xx", // Fixed user for now
        userAvatar: "https://media.npr.org/assets/img/2022/01/04/ap_862432864149-3b9c48cc946a5eccab772a75c5b434fddfdae43a.jpg?s=1100&c=50&f=jpeg", // Fixed avatar
        text: commentText.trim(),
      };

      console.log("💬 Adding regular comment to post");
      createCommentMutation.mutate(commentData);
    }
  };


  // Handle reply to a specific comment (this is called from Comment component)
  const handleReply = (commentId: string) => {
    console.log('Reply to comment:', commentId);
    // The actual reply tagging is now handled by Zustand store in Comment component
    // This function could be used for other reply-related logic if needed
  };

  // Check if any mutation is pending
  const isSubmitting = createCommentMutation.isPending || createReplyMutation.isPending;

  // Get reply type for UI display
  const getReplyType = () => {
    if (!replyTarget) return null;
    return replyTarget.isNestedReply ? "nested reply" : "reply";
  };

  return (
    <Drawer open={isOpen} onOpenChange={onClose}>
      <DrawerContent className="max-h-[90vh] max-w-lg mx-auto">
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
                {replyTarget.isNestedReply ? (
                  <>Replying to <strong>@{replyTarget.username}</strong> (nested reply)</>
                ) : (
                  <>Replying to <strong>@{replyTarget.username}</strong></>
                )}
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
                    : "Add a comment"
                }
                className="flex-1 border border-gray-300 rounded-full px-4 py-2 text-sm outline-none focus:border-blue-500"
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                disabled={isSubmitting} // Disable while submitting
              />
              <Button
                onClick={handleSubmit}
                variant="ghost"
                size="icon"
                className="h-10 w-10 text-blue-500"
                disabled={!commentText.trim() || isSubmitting}
              >
                {isSubmitting ? (
                  <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <Send className="h-5 w-5 rotate-45" />
                )}
              </Button>
            </div>
          </div>
          
          {/* Loading indicator */}
          {isSubmitting && (
            <div className="mt-2 text-xs text-gray-500 text-center">
              {replyTarget ? `Adding ${getReplyType()}...` : "Adding comment..."}
            </div>
          )}
        </div>
      </DrawerContent>
    </Drawer>
  )
} 