import { useState } from "react";
import { Heart, ChevronDown, ChevronUp } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useCommentsStore } from "@/zustand/comments";

// Define the structure of a comment with nested replies
export interface CommentData {
  id: string;
  username: string;
  userAvatar: string;
  text: string;
  likes: number;
  timeAgo: string;
  replies?: CommentData[]; // Optional replies array for nested comments
}

interface CommentProps {
  comment: CommentData;
  isReply?: boolean; // Whether this is a reply (nested comment)
  parentCommentId?: string; // ID of the parent comment (for nested replies)
  onReply?: (commentId: string) => void; // Function to handle replying (optional now)
}

export function Comment({ comment, isReply = false, parentCommentId, onReply }: CommentProps) {
  // State for managing like status and likes count
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(comment.likes);

  // State for managing whether replies are expanded or collapsed
  const [showReplies, setShowReplies] = useState(false);

  // Get Zustand store state and actions
  const { replyTarget, setReplyTarget } = useCommentsStore();

  // Handle like button click
  const handleLike = () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
    } else {
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
    }
  };



  // Handle reply button click - this triggers the tagging
  const handleReplyClick = () => {
    // Determine if we're replying to a top-level comment or a nested reply
    if (isReply && parentCommentId) {
      // This is a nested reply - we're replying to a reply
      const targetCommentId = parentCommentId; // The top-level comment
      const targetReplyId = comment.id; // The specific reply we're replying to
      
      // Check if we're already replying to this same reply
      const isAlreadyReplying = replyTarget?.replyId === comment.id;
      
      if (isAlreadyReplying) {
        console.log(`🏷️ Already replying to @${comment.username} (nested reply)`);
        return;
      }
      
      // Set reply target for nested reply
      setReplyTarget(targetCommentId, comment.username, targetReplyId);
      
      console.log(`🏷️ Replying to nested reply: @${comment.username} (Comment: ${targetCommentId}, Reply: ${targetReplyId})`);
      
    } else {
      // This is a top-level comment - regular reply
      const isAlreadyReplying = replyTarget?.commentId === comment.id && !replyTarget?.replyId;
      
      if (isAlreadyReplying) {
        console.log(`🏷️ Already replying to @${comment.username} (top-level comment)`);
        return;
      }
      
      // Set reply target for regular comment reply
      setReplyTarget(comment.id, comment.username); // No replyId for top-level comments
      
      console.log(`🏷️ Replying to comment: @${comment.username} (ID: ${comment.id})`);
    }

    // Also call the optional callback if provided (for backward compatibility)
    if (onReply) {
      onReply(comment.id);
    }

    // Show different messages based on context
    if (replyTarget && replyTarget.username !== comment.username) {
      console.log(
        `🔄 Switching reply from @${replyTarget.username} to @${comment.username}`
      );
    }
  };

  // Toggle replies visibility
  const toggleReplies = () => {
    setShowReplies(!showReplies);
  };

  return (
    <div className={`${isReply ? "mt-3" : "mb-4"}`}>
      {/* Comment Content */}
      <div className="flex items-start space-x-3 flex-row">
        {/* User Avatar */}
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={comment.userAvatar} alt={comment.username} />
          <AvatarFallback>
            {comment.username.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Comment Text and Actions */}
        <div className="flex min-w-0 flex-col">
          {/* Comment Text */}
          <div className="font-semibold text-sm flex items-center gap-1">
            {comment.username}{" "}
            <span className="font-light text-gray-500 text-xs">
              {comment.timeAgo}
            </span>
          </div>

          <div className="text-sm mt-1 mr-2 flex items-center gap-1">
            <span className="flex-1 w-dvw">{comment.text}</span>
            <button
              onClick={handleLike}
              className={`ml-5 font-semibold flex items-center justify-start gap-1 ${isLiked ? "text-red-500" : "hover:text-gray-700"}`}
            >
              <Heart
                className={`w-4 h-4 ${isLiked ? "text-red-500 fill-red-500" : "hover:text-gray-700"}`}
              />
              <div>{likesCount > 0 && `${likesCount} `}</div>
            </button>
          </div>

          {/* Comment Actions */}
          <div className="flex items-center space-x-4 mt-2 text-xxs text-gray-500">
            {/* Reply button - Shows visual feedback when this comment is being replied to */}
            <button
              onClick={handleReplyClick}
              className={`font-semibold transition-colors ${"hover:text-gray-700"}`}
            >
              Reply
            </button>
          </div>

          {/* Replies Section */}
          {comment.replies && comment.replies.length > 0 && (
            <div className="mt-2">
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
                      parentCommentId={comment.id} // Pass the parent comment ID for nested replies
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
  );
}
