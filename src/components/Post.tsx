import { useState, useEffect } from "react";
import { Heart, MessageCircle, Bookmark, MoreHorizontal } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CommentsDrawer } from "./CommentsDrawer";
import type { PostData } from "./Feed";

// Props interface for the Post component
interface PostProps {
  post: PostData;
  onLike?: () => Promise<void>; // Optional callback for liking posts
  onUnlike?: () => Promise<void>; // Optional callback for unliking posts
}

// Our Post component - it receives post data as a prop
export function Post({ post, onLike, onUnlike }: PostProps) {
  // State management for UI-only features
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(post.likes);
  const [isBookmarked, setIsBookmarked] = useState(false);

  // State for comments drawer
  const [isCommentsOpen, setIsCommentsOpen] = useState(false);

  // State for double-tap heart animation
  const [showHeartAnimation, setShowHeartAnimation] = useState(false);

  // Function to handle like button click
  const handleLike = async () => {
    if (isLiked) {
      // If already liked, unlike it (local state only for now)
      setIsLiked(false);
    } else {
      // If not liked, like it
      setIsLiked(true);
      setLikesCount((prev) => prev + 1);
      // Call the API to like the post (if provided)
      if (onLike) {
        try {
          await onLike();
        } catch (error) {
          // Revert on error
          setIsLiked(false);
          console.error("Failed to like post:", error);
        }
      }
    }
  };

  const handleUnlike = async () => {
    if (isLiked) {
      setIsLiked(false);
      setLikesCount((prev) => prev - 1);
      if (onUnlike) {
        try {
          await onUnlike();
        } catch (error) {
          console.error("Failed to unlike post:", error);
        }
      }
    }
  };

  useEffect(() => {
    setLikesCount(post.likes);
  }, [handleLike, handleUnlike]);

  // Function to handle image double-tap/click for liking
  const handleImageLike = async () => {
    // Only like if not already liked (Instagram behavior)
    if (!isLiked) {
      setIsLiked(true);

      // Call the API to like the post (if provided)
      if (onLike) {
        try {
          await onLike();
        } catch (error) {
          // Revert on error
          setIsLiked(false);
          console.error("Failed to like post:", error);
        }
      }
    }

    // Show heart animation regardless
    setShowHeartAnimation(true);
    setTimeout(() => {
      setShowHeartAnimation(false);
    }, 1000);
  };

  // Function to handle bookmark button click
  const handleBookmark = () => {
    setIsBookmarked(!isBookmarked);
  };

  // Function to open comments drawer
  const handleCommentsClick = () => {
    setIsCommentsOpen(true);
  };

  // Calculate total comments count including replies
  const totalCommentsCount =
    post.totalCommentsCount ||
    post.comments.reduce((total, comment) => {
      let count = 1; // Count the comment itself
      if (comment.replies) {
        count += comment.replies.length; // Add replies count
      }
      return total + count;
    }, 0);

  return (
    <>
      <Card className="w-full mx-auto border-0 rounded-none shadow-none pt-0">
        <CardContent className="p-0">
          {/* Post Header - contains user info and options */}
          <div className="flex items-center justify-between p-4">
            <div className="flex items-center space-x-3 ">
              {/* User Avatar */}
              <Avatar className="h-8 w-8">
                <AvatarImage src={post.userAvatar} alt={post.username} />
                <AvatarFallback>
                  {post.username.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              {/* Username */}
              <span className="font-semibold text-sm">{post.username}</span>
            </div>
            {/* More options button */}
            <Button variant="ghost" size="icon" className="h-8 w-8">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </div>

          {/* Post Image with double-tap to like */}
          <div className="relative cursor-pointer select-none">
            <img
              src={post.image}
              alt="Post content"
              className="w-full aspect-square object-cover"
              onDoubleClick={handleImageLike}
            />

            {/* Heart Animation Overlay */}
            {showHeartAnimation && (
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                <Heart
                  className="h-24 w-24 text-red-500 fill-red-500 animate-bounce drop-shadow-lg"
                  style={{
                    animation: "heartPop 1s ease-out forwards",
                  }}
                />
              </div>
            )}
          </div>

          {/* Action Buttons - Like, Comment, Share, Bookmark */}
          <div className="flex items-center justify-between px-2 pt-2 ">
            <div className="flex items-start justify-start space-x-4">
              {/* Like Button - now interactive! */}
              <div className="flex items-center ">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={isLiked ? handleUnlike : handleLike}
                >
                  <Heart
                    className={`h-8 w-8 transition-colors ${
                      isLiked ? "fill-red-500 text-red-500" : "text-black"
                    }`}
                  />
                </Button>

                <span className="font-semibold text-sm h-8 flex items-center justify-center">
                  {likesCount.toLocaleString()}{" "}
                </span>
              </div>

              {/* Comment Button - opens drawer */}
              <div className="flex items-center ">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8"
                  onClick={handleCommentsClick}
                >
                  <MessageCircle className="h-8 w-8" />
                  <span className="font-semibold text-sm h-8 flex items-center justify-center">
                    {totalCommentsCount}
                  </span>
                </Button>
              </div>
            </div>

            {/* Bookmark Button - now interactive! */}
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={handleBookmark}
            >
              <Bookmark
                className={`h-8 w-8 transition-colors ${
                  isBookmarked ? "fill-black text-black" : "text-black"
                }`}
              />
            </Button>
          </div>

          {/* Likes Count - now updates dynamically! */}

          {/* Caption */}
          <div className="px-4">
            <span className="font-semibold text-sm mr-2">{post.username}</span>
            <span className="text-sm">{post.caption}</span>
          </div>

          {/* Time ago */}
          <div className="px-4 pb-4">
            <span className="text-gray-500 text-xxs uppercase">
              {post.timeAgo}
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Comments Drawer */}
      <CommentsDrawer
        isOpen={isCommentsOpen}
        onClose={() => setIsCommentsOpen(false)}
        comments={post.comments}
        postUsername={post.username}
        commentsCount={totalCommentsCount}
      />
    </>
  );
}
