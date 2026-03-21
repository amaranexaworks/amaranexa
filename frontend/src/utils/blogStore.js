import { fetchBlogPosts, createBlogPost, updateBlogPost, deleteBlogPost } from './api';

const DEFAULT_POSTS = [
  {
    id: 1,
    title: "How Experiential Learning Programs for Kids Transform Traditional Education Through Real-World Skills?",
    excerpt: "Imagine your child building a drone instead of just reading about physics. Building an AI that works instead of memorizing definitions. Creating robots that actually move instead of staring at diagrams. This is the promise of experiential learning — and it's revolutionizing how we educate the next generation.",
    date: "5 days ago",
    read_time: "14 min read",
    image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80",
    category: "Robotics",
    comments: 0,
    likes: 0
  },
  {
    id: 2,
    title: "Early Coding Education for Kids: Preparing Children for a Tech-Driven Future",
    excerpt: "Pause for a moment and think about the world your child is growing up in. It's a world shaped by technology at every step — smartphones that recognize faces, apps that predict what you want, cars that drive themselves. The children who will thrive are those who understand the language behind these innovations.",
    date: "Jan 15",
    read_time: "5 min read",
    image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80",
    category: "Coding for Kids",
    comments: 0,
    likes: 2
  },
  {
    id: 3,
    title: "How AI is Reshaping the Future of STEM Education in Schools",
    excerpt: "Artificial Intelligence is no longer just a buzzword — it's becoming a core part of how students learn, explore, and create. From personalized learning paths to AI-powered tutors, schools are beginning to harness the power of AI to transform the classroom experience.",
    date: "Jan 10",
    read_time: "8 min read",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80",
    category: "Artificial Intelligence",
    comments: 3,
    likes: 7
  },
  {
    id: 4,
    title: "Why Science Labs Are the Future of Hands-On Learning",
    excerpt: "Traditional science education relies heavily on theory and textbooks. But research consistently shows that hands-on experimentation produces deeper understanding, stronger retention, and more passionate learners. Here's why lab-based science education is critical for the next generation.",
    date: "Jan 5",
    read_time: "6 min read",
    image: "https://images.unsplash.com/photo-1532094349884-543559052261?auto=format&fit=crop&w=800&q=80",
    category: "Science",
    comments: 1,
    likes: 4
  },
  {
    id: 5,
    title: "Building Your First Web App: A Student's Journey",
    excerpt: "Six months ago, I didn't know what HTML stood for. Today, I've built a fully functional web application that helps my school manage its coding club. This is my story — and why I believe every student should learn web development.",
    date: "Dec 28",
    read_time: "10 min read",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80",
    category: "Web Development",
    comments: 5,
    likes: 12
  },
  {
    id: 6,
    title: "From the Ground Up: How Students Are Building and Flying Their Own Drones",
    excerpt: "What happens when you give a 14-year-old the tools to build a drone from scratch? You get an engineer in the making. CodeOffice students across the country are now building, programming, and flying their own drones as part of our advanced robotics curriculum.",
    date: "Dec 20",
    read_time: "7 min read",
    image: "https://images.unsplash.com/photo-1473968512647-3e447244af8f?auto=format&fit=crop&w=800&q=80",
    category: "Drone",
    comments: 2,
    likes: 9
  }
];

// Normalize DB row (read_time) to frontend format (readTime) for backward compat
function normalize(post) {
  return {
    ...post,
    readTime: post.read_time || post.readTime || '',
    date: post.date || (post.created_at ? new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : ''),
  };
}

export async function getPosts() {
  try {
    const posts = await fetchBlogPosts();
    if (Array.isArray(posts) && posts.length > 0) return posts.map(normalize);
  } catch { /* fall through to defaults */ }
  return DEFAULT_POSTS;
}

export async function addPost(postData) {
  try {
    const created = await createBlogPost({
      title: postData.title,
      excerpt: postData.excerpt,
      image: postData.image || '',
      category: postData.category || '',
      read_time: postData.readTime || postData.read_time || '',
    });
    return normalize(created);
  } catch (err) {
    console.error('addPost error:', err);
    return null;
  }
}

export async function updatePost(id, data) {
  try {
    const updated = await updateBlogPost(id, {
      title: data.title,
      excerpt: data.excerpt,
      image: data.image || '',
      category: data.category || '',
      read_time: data.readTime || data.read_time || '',
    });
    return normalize(updated);
  } catch (err) {
    console.error('updatePost error:', err);
    return null;
  }
}

export async function deletePost(id) {
  try {
    await deleteBlogPost(id);
    return true;
  } catch (err) {
    console.error('deletePost error:', err);
    return false;
  }
}

// Kept for backward compatibility — sync versions using defaults
export function getPostsSync() {
  return DEFAULT_POSTS;
}
