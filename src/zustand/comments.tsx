import { create } from 'zustand'

// Define the Comment type
interface Comment {
  id: string
  username: string
  text: string
  timeAgo: string
  likes: number
  replies?: Comment[]
}

// Define the reply target for tagging
interface ReplyTarget {
  commentId: string
  username: string
}

// Define the store state interface
interface CommentsState {
  comments: Comment[]
  replyTarget: ReplyTarget | null // Track which comment we're replying to
  commentText: string // Current comment input text
  
  // Comment management
  addComment: (comment: Comment) => void
  addReply: (parentId: string, reply: Comment) => void
  likeComment: (commentId: string) => void
  unlikeComment: (commentId: string) => void
  
  // Reply tagging functionality
  setReplyTarget: (commentId: string, username: string) => void
  clearReplyTarget: () => void
  setCommentText: (text: string) => void
  clearCommentText: () => void
}

// Create the store
export const useCommentsStore = create<CommentsState>((set, get) => ({
  // Initial state
  comments: [],
  replyTarget: null,
  commentText: '',

  // Add a new top-level comment
  addComment: (comment) => 
    set((state) => ({
      comments: [...state.comments, comment]
    })),

  // Add a reply to an existing comment
  addReply: (parentId, reply) =>
    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment.id === parentId) {
          return {
            ...comment,
            replies: [...(comment.replies || []), reply]
          }
        }
        return comment
      })
    })),

  // Like a comment
  likeComment: (commentId) =>
    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: comment.likes + 1 }
        }
        return comment
      })
    })),

  // Unlike a comment  
  unlikeComment: (commentId) =>
    set((state) => ({
      comments: state.comments.map(comment => {
        if (comment.id === commentId) {
          return { ...comment, likes: Math.max(0, comment.likes - 1) }
        }
        return comment
      })
    })),

  // Set reply target and replace any existing @username tag with the new one
  setReplyTarget: (commentId, username) =>
    set((state) => {
      const newTag = `@${username} `;
      
      // If there's already a reply target, remove the old tag first
      let cleanText = state.commentText;
      if (state.replyTarget) {
        const oldTag = `@${state.replyTarget.username} `;
        cleanText = cleanText.replace(oldTag, '').trim();
      }
      
      // Add the new tag
      // If there's existing text (after removing old tag), add a space before the tag
      const newText = cleanText 
        ? `${cleanText} ${newTag}` 
        : newTag;
      
      return {
        replyTarget: { commentId, username },
        commentText: newText
      };
    }),

  // Clear reply target
  clearReplyTarget: () =>
    set(() => ({
      replyTarget: null
    })),

  // Set comment text
  setCommentText: (text) =>
    set(() => ({
      commentText: text
    })),

  // Clear comment text
  clearCommentText: () =>
    set(() => ({
      commentText: ''
    }))
}))
