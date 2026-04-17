"use client";
import { createContext, useContext, useState, useEffect } from "react";
import { useNotifications } from "./notification-context";
import { useAuth } from "./auth-context";
import { db } from "@/lib/firebase";
import { 
  collection, 
  addDoc, 
  onSnapshot, 
  query, 
  orderBy, 
  deleteDoc, 
  doc, 
  updateDoc, 
  serverTimestamp, 
  increment,
  arrayUnion,
  arrayRemove
} from "firebase/firestore";

export type Comment = {
  id: string;
  author: string;
  avatar: string;
  content: string;
  likes: number;
  time: string;
  replies?: Comment[];
};

export type Post = {
  id: string;
  author: string;
  role: string;
  avatar: string;
  time: string;
  title?: string;
  content: string;
  likes: number;
  comments: Comment[];
  hasImage: boolean;
  image?: string;
  video?: string;
  link?: string;
  badges: string[];
  isPinned: boolean;
  isNotice: boolean;
  createdAt?: any;
};

type CommunityContextType = {
  posts: Post[];
  addPost: (post: Omit<Post, 'id' | 'likes' | 'comments' | 'time'>) => void;
  deletePost: (id: string) => void;
  editPost: (id: string, content: string) => void;
  togglePin: (id: string) => void;
  likePost: (id: string) => void;
  addComment: (postId: string, comment: Omit<Comment, 'id' | 'likes' | 'time' | 'replies'>) => void;
  likeComment: (postId: string, commentId: string) => void;
  replyComment: (postId: string, commentId: string, reply: Omit<Comment, 'id' | 'likes' | 'time' | 'replies'>) => void;
};

const CommunityContext = createContext<CommunityContextType | null>(null);

export function CommunityProvider({ children }: { children: React.ReactNode }) {
  const { addNotification } = useNotifications();
  const { user } = useAuth();
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    const q = query(collection(db, "community_posts"), orderBy("createdAt", "desc"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const fetchedPosts = snapshot.docs.map(doc => {
        const data = doc.data();
        let timeString = "Agora mesmo";
        if (data.createdAt) {
          const date = data.createdAt.toDate();
          timeString = date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' - ' + date.toLocaleDateString('pt-BR');
        }
        return {
          id: doc.id,
          ...data,
          time: timeString
        } as Post;
      });
      setPosts(fetchedPosts);
    }, (error) => {
      console.error("Firestore onSnapshot error:", error);
      // Optional: Handle handleFirestoreError if needed, but simple console.error is step 1
    });

    return () => unsubscribe();
  }, []);

  const addPost = async (post: Omit<Post, 'id' | 'likes' | 'comments' | 'time'>) => {
    try {
      await addDoc(collection(db, "community_posts"), {
        ...post,
        likes: 0,
        comments: [],
        createdAt: serverTimestamp(),
        authorUID: user?.uid || 'anonymous'
      });
      addNotification({
        type: 'post',
        message: `${post.author} fez uma nova publicação.`,
      });
    } catch (error) {
      console.error("Error adding post:", error);
    }
  };

  const deletePost = async (id: string) => {
    try {
      await deleteDoc(doc(db, "community_posts", id));
    } catch (error) {
      console.error("Error deleting post:", error);
    }
  };

  const editPost = async (id: string, content: string) => {
    try {
      await updateDoc(doc(db, "community_posts", id), { content });
    } catch (error) {
      console.error("Error editing post:", error);
    }
  };

  const togglePin = async (id: string) => {
    const postToToggle = posts.find(p => p.id === id);
    if (!postToToggle) return;
    try {
      await updateDoc(doc(db, "community_posts", id), { isPinned: !postToToggle.isPinned });
    } catch (error) {
      console.error("Error toggling pin:", error);
    }
  };

  const likePost = async (id: string) => {
    try {
      await updateDoc(doc(db, "community_posts", id), {
        likes: increment(1)
      });
      const post = posts.find(p => p.id === id);
      if (post) {
        addNotification({
          type: 'like',
          message: `Alguém curtiu a publicação de ${post.author}.`,
        });
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const addComment = async (postId: string, comment: Omit<Comment, 'id' | 'likes' | 'time' | 'replies'>) => {
    try {
      const postRef = doc(db, "community_posts", postId);
      const newComment = {
        ...comment,
        id: Math.random().toString(36).substring(2, 9),
        likes: 0,
        replies: [],
        createdAt: new Date().toISOString()
      };
      // In a real production app, comments would be a subcollection or we would read the current doc,
      // append the comment, and update. Here we can read the local state and push, or use arrayUnion
      // but arrayUnion requires the exact object to match when removing. Since we just add, arrayUnion is fine.
      const post = posts.find(p => p.id === postId);
      if(post) {
          await updateDoc(postRef, {
             comments: [...post.comments, newComment]
          })
      }

      if (post) {
        addNotification({
          type: 'reply',
          message: `${comment.author} comentou na publicação de ${post.author}.`,
        });
      }
    } catch (error) {
      console.error("Error adding comment:", error);
    }
  };

  const likeComment = async (postId: string, commentId: string) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    try {
      const updatedComments = post.comments.map(c => {
        if (c.id === commentId) return { ...c, likes: c.likes + 1 };
        if (c.replies) {
          return {
            ...c,
            replies: c.replies.map(r => r.id === commentId ? { ...r, likes: r.likes + 1 } : r)
          };
        }
        return c;
      });
      await updateDoc(doc(db, "community_posts", postId), { comments: updatedComments });
    } catch (error) {
      console.error("Error liking comment:", error);
    }
  };

  const replyComment = async (postId: string, commentId: string, reply: Omit<Comment, 'id' | 'likes' | 'time' | 'replies'>) => {
    const post = posts.find(p => p.id === postId);
    if (!post) return;
    try {
      const newReply = {
        ...reply,
        id: Math.random().toString(36).substring(2, 9),
        likes: 0,
        createdAt: new Date().toISOString()
      };
      const updatedComments = post.comments.map(c => 
        c.id === commentId ? { ...c, replies: [...(c.replies || []), newReply] } : c
      );
      await updateDoc(doc(db, "community_posts", postId), { comments: updatedComments });

      addNotification({
        type: 'reply',
        message: `${reply.author} respondeu a um comentário na publicação de ${post.author}.`,
      });
    } catch (error) {
      console.error("Error replying to comment:", error);
    }
  };

  return (
    <CommunityContext.Provider value={{ posts, addPost, deletePost, editPost, togglePin, likePost, addComment, likeComment, replyComment }}>
      {children}
    </CommunityContext.Provider>
  );
}

export const useCommunity = () => {
  const context = useContext(CommunityContext);
  if (!context) throw new Error("useCommunity must be used within a CommunityProvider");
  return context;
};
