
import React, { createContext, useContext, useState, useEffect } from 'react';
import { recentInsights, extraInsights, staticFrameworks } from '../components/third-fold/insights-data';

// Define the shape of a Post
export interface BlogPost {
  id: string | number;
  title: string;
  description: string;
  category: string; 
  tag: string; 
  date: string;
  readTime?: string;
  image?: string;
  content?: string | any; 
  type: 'INSIGHT' | 'FRAMEWORK';
}

interface BlogContextType {
  posts: BlogPost[];
  loading: boolean;
  addPost: (post: Omit<BlogPost, 'id'>) => Promise<void>;
  updatePost: (id: string | number, updatedPost: Partial<BlogPost>) => Promise<void>;
  deletePost: (id: string | number) => Promise<void>;
  getPostBySlug: (slug: string) => BlogPost | undefined;
}

const BlogContext = createContext<BlogContextType | undefined>(undefined);

// Helper to normalize data from your existing files
// Assign unique IDs based on index or content hash to ensure they are manageable
const initialStaticPosts: BlogPost[] = [
  ...recentInsights.map((p, i) => ({ ...p, id: `static-insight-${i}`, type: 'INSIGHT' as const, category: p.tag })),
  ...extraInsights.map((p, i) => ({ ...p, id: `static-extra-${i}`, type: 'INSIGHT' as const, category: p.tag })),
  // Add frameworks to the initial state
  ...staticFrameworks.map((p, i) => ({ ...p, id: `static-framework-${i}`, type: 'FRAMEWORK' as const, category: p.category, tag: p.tag }))
];

const LOCAL_STORAGE_KEY = 'socceo_blog_posts';

export const BlogProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch posts from LocalStorage on mount
  useEffect(() => {
    loadPosts();
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
        const storedPosts = localStorage.getItem(LOCAL_STORAGE_KEY);
        if (storedPosts) {
            // Se já tem posts salvos no navegador, usa eles
            setPosts(JSON.parse(storedPosts));
        } else {
            // CRÍTICO: Se não tem nada salvo, carrega os estáticos E SALVA no storage.
            // Isso torna os posts iniciais editáveis/excluíveis pelo Admin.
            setPosts(initialStaticPosts);
            localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(initialStaticPosts));
        }
    } catch (e) {
        console.error("Erro ao carregar posts locais", e);
        // Fallback
        setPosts(initialStaticPosts);
    } finally {
        setLoading(false);
    }
  };

  const savePostsToStorage = (newPosts: BlogPost[]) => {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(newPosts));
  };

  const addPost = async (postData: Omit<BlogPost, 'id'>) => {
      // Simula delay de rede
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const newPost = { ...postData, id: Date.now() } as BlogPost;
      const updatedPosts = [newPost, ...posts];
      
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);
  };

  const updatePost = async (id: string | number, updatedPostData: Partial<BlogPost>) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedPosts = posts.map(p => p.id === id ? { ...p, ...updatedPostData } as BlogPost : p);
      
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);
  };

  const deletePost = async (id: string | number) => {
      await new Promise(resolve => setTimeout(resolve, 500));

      const updatedPosts = posts.filter(p => p.id !== id);
      
      setPosts(updatedPosts);
      savePostsToStorage(updatedPosts);
  };

  const getPostBySlug = (slug: string) => {
    const slugify = (text: string) => text.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
    return posts.find(p => slugify(p.title) === slug);
  };

  return (
    <BlogContext.Provider value={{ posts, loading, addPost, updatePost, deletePost, getPostBySlug }}>
      {children}
    </BlogContext.Provider>
  );
};

export const useBlog = () => {
  const context = useContext(BlogContext);
  if (!context) {
    throw new Error('useBlog must be used within a BlogProvider');
  }
  return context;
};
