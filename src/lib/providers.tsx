// For now, let's create a simple data fetching setup
// Once you install the tRPC dependencies, we can switch to full tRPC

import type { PostData } from "../components/Feed";

// Simple API client that mimics tRPC structure
export class ApiClient {
  private baseUrl = "http://localhost:8787/trpc";

  async getPosts(): Promise<PostData[]> {
    const response = await fetch(`${this.baseUrl}/getPosts`);
    if (!response.ok) throw new Error("Failed to fetch posts");
    const data = await response.json();

    // tRPC wraps data in a result object
    return data.result?.data || data;
  }

  async createPost(input: {
    username: string;
    userAvatar: string;
    image: string;
    caption: string;
  }): Promise<PostData> {
    const response = await fetch(`${this.baseUrl}/createPost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(input),
    });
    if (!response.ok) throw new Error("Failed to create post");
    const data = await response.json();

    // tRPC wraps data in a result object
    return data.result?.data || data;
  }

  async likePost(id: string): Promise<PostData> {
    const response = await fetch(`${this.baseUrl}/likePost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Failed to like post");
    // return response.json()
    const data = await response.json();

    // tRPC wraps data in a result object
    return data.result?.data || data;
  }

  async unlikePost(id: string): Promise<PostData> {
    const response = await fetch(`${this.baseUrl}/unlikePost`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    if (!response.ok) throw new Error("Failed to unlike post");
    const data = await response.json();
    return data.result?.data || data;
  }
}

// Create a singleton instance
export const apiClient = new ApiClient();

// Simple provider for now - we'll upgrade to tRPC later
export function AppProviders({ children }: { children: React.ReactNode }) {
  return <div>{children}</div>;
}
