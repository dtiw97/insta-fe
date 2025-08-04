import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import trpcCall from "@/lib/apicall";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { PostData } from "@/components/Feed";

// Define the schema for creating a post
const CreatePostSchema = z.object({
  username: z
    .string()
    .min(1, "Username is required")
    .max(50, "Username too long"),
  userAvatar: z.string().url("Must be a valid avatar URL"),
  image: z.string().url("Must be a valid image URL"),
  caption: z
    .string()
    .min(1, "Caption is required")
    .max(500, "Caption too long"),
});

// Type inference from schema
type CreatePostInput = z.infer<typeof CreatePostSchema>;

// Function to create a post with validation
async function createPost(input: CreatePostInput): Promise<PostData> {
  // Validate input data against schema
  const validatedData = CreatePostSchema.parse(input);

  console.log("🚀 Creating post with validated data:", validatedData);

  // Send to backend via tRPC
  const result = await trpcCall("createPost", validatedData);

  console.log("✅ Post created successfully:", result);
  return result;
}

export const Route = createFileRoute("/createPost")({
  component: RouteComponent,
});

function RouteComponent() {
  const queryClient = useQueryClient();
  const navigate = Route.useNavigate();
  // Form state
  const [formData, setFormData] = useState<CreatePostInput>({
    username: "john_doe",
    userAvatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
    image: "",
    caption: "",
  });

  // Form validation errors
  const [errors, setErrors] = useState<
    Partial<Record<keyof CreatePostInput, string>>
  >({});

  // React Query mutation for creating posts
  const createPostMutation = useMutation({
    mutationFn: createPost,
    onSuccess: (newPost) => {
      console.log(`🎉 Post created successfully! ${newPost.id}`);

      // Invalidate and refetch posts to show the new post
      queryClient.invalidateQueries({ queryKey: ["posts"] });

      // Reset form
      setFormData({
        username: "john_doe",
        userAvatar:
          "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150",
        image: "",
        caption: "",
      });
      setErrors({});

      // Optional: Show success message or redirect
      // Redirect to home page after successful post creation
      navigate({ to: "/" });
    },
    onError: (error: any) => {
      console.error("❌ Failed to create post:", error);

      // Handle validation errors from Zod
      if (error instanceof z.ZodError) {
        const fieldErrors: Partial<Record<keyof CreatePostInput, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof CreatePostInput] = issue.message;
          }
        });
        setErrors(fieldErrors);
      } else {
        // Handle other errors
        alert(`Failed to create post: ${error.message}`);
      }
    },
  });

  // Handle form input changes
  const handleInputChange = (field: keyof CreatePostInput, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      // Validate form data
      const validatedData = CreatePostSchema.parse(formData);

      // Clear any previous errors
      setErrors({});

      // Submit the post
      createPostMutation.mutate(validatedData);
    } catch (error) {
      if (error instanceof z.ZodError) {
        // Handle validation errors
        const fieldErrors: Partial<Record<keyof CreatePostInput, string>> = {};
        error.issues.forEach((issue) => {
          if (issue.path[0]) {
            fieldErrors[issue.path[0] as keyof CreatePostInput] = issue.message;
          }
        });
        setErrors(fieldErrors);
      }
    }
  };

  return (
    <div className="max-w-lg mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6 text-center">Create New Post</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        {/* Username Field */}
        <div>
          <Input
            type="text"
            placeholder="Username"
            value={formData.username}
            onChange={(e) => handleInputChange("username", e.target.value)}
            className={errors.username ? "border-red-500" : ""}
            disabled // Keep disabled for now since it's a fixed user
          />
          {errors.username && (
            <p className="text-red-500 text-sm mt-1">{errors.username}</p>
          )}
        </div>

        {/* User Avatar Field */}
        <div>
          <Input
            type="text"
            placeholder="User Avatar URL"
            value={formData.userAvatar}
            onChange={(e) => handleInputChange("userAvatar", e.target.value)}
            className={errors.userAvatar ? "border-red-500" : ""}
            disabled // Keep disabled for now since it's a fixed user
          />
          {errors.userAvatar && (
            <p className="text-red-500 text-sm mt-1">{errors.userAvatar}</p>
          )}
        </div>

        {/* Image URL Field */}
        <div>
          <Input
            type="text"
            placeholder="Image URL"
            value={formData.image}
            onChange={(e) => handleInputChange("image", e.target.value)}
            className={errors.image ? "border-red-500" : ""}
          />
          {errors.image && (
            <p className="text-red-500 text-sm mt-1">{errors.image}</p>
          )}
        </div>

        {/* Caption Field */}
        <div>
          <Input
            type="text"
            placeholder="What's on your mind?"
            value={formData.caption}
            onChange={(e) => handleInputChange("caption", e.target.value)}
            className={errors.caption ? "border-red-500" : ""}
          />
          {errors.caption && (
            <p className="text-red-500 text-sm mt-1">{errors.caption}</p>
          )}
        </div>

        {/* Submit Button */}
        <Button
          type="submit"
          className="w-full cursor-pointer"
          disabled={createPostMutation.isPending}
        >
          {createPostMutation.isPending ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              Creating Post...
            </span>
          ) : (
            "Create Post"
          )}
        </Button>
      </form>

      <span className="text-xs text-gray-500">
        You may insert this url
        https://media.npr.org/assets/img/2022/01/04/ap_862432864149-3b9c48cc946a5eccab772a75c5b434fddfdae43a.jpg?s=1100&c=50&f=jpeg
      </span>

      {/* Success/Error Status */}
      {createPostMutation.isError && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <p className="text-red-700 text-sm">
            Failed to create post. Please try again.
          </p>
        </div>
      )}
    </div>
  );
}
