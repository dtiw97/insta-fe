import { createFileRoute } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import "../index.css";

import { Feed } from "@/components/Feed";
import type { PostData } from "@/components/Feed";
import { Header } from "@/components/Header";

import { apiClient } from "@/lib/providers";

export const Route = createFileRoute("/")({
  component: App,
});

function App() {

  // const { data: posts, isLoading, error } = trpc.getPosts.useQuery();

  // const { mutate: likePost } = trpc.likePost.useMutation();
  // const { mutate: unlikePost } = trpc.unlikePost.useMutation();

  // State management for posts data
  const [posts, setPosts] = useState<PostData[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  async function loadPosts() {
    try {
      setIsLoading(true);
      setError(null);

      console.log("🔄 Starting to fetch posts...");

      // Fetch posts from API
      const fetchedPosts = await apiClient.getPosts();

      console.log("📡 Raw API response:", fetchedPosts);

      if (fetchedPosts) {
        setPosts(fetchedPosts);
        console.log(
          "✅ Posts loaded successfully:",
          fetchedPosts.length,
          "posts"
        );
      } else {
        console.error("❌ Posts data is not an array:", fetchedPosts);
        setError("Invalid data format received from server");
        setPosts([]);
      }
    } catch (err) {
      console.error("❌ Failed to load posts:", err);
      setError(err instanceof Error ? err.message : "Failed to load posts");

      // Fallback to empty array
      setPosts([]);
    } finally {
      setIsLoading(false);
    }
  }

  // Function to handle liking a post
  const handleLikePost = async (postId: string) => {
    try {
      console.log("👍 Liking post:", postId);

      // Optimistic update - update UI immediately
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes + 1 } : post
        )
      );

      // Send request to backend
      await apiClient.likePost(postId);

      console.log("✅ Post liked successfully");
    } catch (err) {
      console.error("❌ Failed to like post:", err);

      // Revert optimistic update on error
      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    }
  };

  const handleUnlikePost = async (postId: string) => {
    try {
      console.log("👍 Unliking post:", postId);

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );

      await apiClient.unlikePost(postId);

      console.log("✅ Post unliked successfully");
    } catch (err) {
      console.error("❌ Failed to unlike post:", err);

      setPosts((currentPosts) =>
        currentPosts.map((post) =>
          post.id === postId ? { ...post, likes: post.likes - 1 } : post
        )
      );
    }
  };

  // Load posts when component mounts
  useEffect(() => {
    loadPosts();
  }, []); // Empty dependency array means this runs once on mount

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />

      {/* Pass data and handlers to Feed component */}
      <Feed
        posts={posts}
        isLoading={isLoading}
        error={error}
        onLikePost={handleLikePost}
        onUnlikePost={handleUnlikePost}
      />
    </div>
  );
}
