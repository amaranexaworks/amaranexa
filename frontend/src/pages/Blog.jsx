import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, ChevronDown, MoreVertical, MessageSquare, Heart } from 'lucide-react';
import { getPosts } from '../utils/blogStore';

const CATEGORIES = [
  "All Posts",
  "Robotics",
  "Artificial Intelligence",
  "Science",
  "Web Development",
  "Drone"
];

const MORE_CATEGORIES = [
  "Machine Learning",
  "Coding for Kids",
  "STEM Education",
  "Future of Tech",
  "Student Projects"
];

const ALL_CATEGORIES = [...CATEGORIES.slice(1), ...MORE_CATEGORIES];

export const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [activeCategory, setActiveCategory] = useState("All Posts");
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  // Re-sync when tab becomes visible (admin may have edited posts)
  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setPosts(getPosts());
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  const filteredPosts = posts.filter(post => {
    const matchesCategory =
      activeCategory === "All Posts" || post.category === activeCategory;
    const matchesSearch =
      !searchQuery ||
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleCategorySelect = (cat) => {
    setActiveCategory(cat);
    setIsMoreOpen(false);
  };

  const isMoreActive = MORE_CATEGORIES.includes(activeCategory);

  return (
    <div className="pt-20 bg-white min-h-screen">
      {/* Category Navigation */}
      <div className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-slate-200 shadow-sm">
        <div className="max-w-7xl mx-auto px-8 flex items-center h-14 gap-0">

          {/* Scrollable category buttons */}
          <div className="flex items-center gap-1 overflow-x-auto no-scrollbar min-w-0">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => handleCategorySelect(cat)}
                className={`text-sm font-semibold whitespace-nowrap px-4 py-1.5 rounded-full transition-all ${
                  activeCategory === cat
                    ? 'bg-brand-accent text-white shadow-sm'
                    : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* More Dropdown */}
          <div className="relative shrink-0 ml-2">
            <button
              onClick={() => setIsMoreOpen(v => !v)}
              className={`flex items-center gap-1 text-sm font-semibold whitespace-nowrap px-4 py-1.5 rounded-full transition-all ${
                isMoreActive || isMoreOpen
                  ? 'bg-brand-accent text-white shadow-sm'
                  : 'text-slate-500 hover:bg-slate-100 hover:text-slate-800'
              }`}
            >
              {isMoreActive ? activeCategory : 'More'}
              <ChevronDown
                size={14}
                className={`transition-transform duration-200 ${isMoreOpen ? 'rotate-180' : ''}`}
              />
            </button>

            <AnimatePresence>
              {isMoreOpen && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setIsMoreOpen(false)} />
                  <motion.div
                    initial={{ opacity: 0, y: -6, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -6, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className="absolute top-full left-0 mt-2 w-52 bg-white border border-slate-100 shadow-2xl rounded-2xl py-2 z-20"
                  >
                    {MORE_CATEGORIES.map((cat) => (
                      <button
                        key={cat}
                        onClick={() => handleCategorySelect(cat)}
                        className={`w-full text-left px-5 py-2.5 text-sm transition-colors ${
                          activeCategory === cat
                            ? 'text-brand-accent font-semibold bg-brand-accent/5'
                            : 'text-slate-600 hover:bg-slate-50 hover:text-brand-accent'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </motion.div>
                </>
              )}
            </AnimatePresence>
          </div>

          {/* Divider */}
          <div className="w-px h-5 bg-slate-200 mx-6 shrink-0" />

          {/* Search — grows to fill remaining space */}
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={15} />
            <input
              type="text"
              placeholder="Search posts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-full text-sm focus:outline-none focus:border-brand-accent/50 focus:bg-white transition-all"
            />
          </div>
        </div>
      </div>

      {/* Posts Grid */}
      <section className="px-8 py-16 max-w-7xl mx-auto">
        {/* Active filter label */}
        {(activeCategory !== "All Posts" || searchQuery) && (
          <div className="flex items-center gap-3 mb-8">
            <p className="text-sm text-slate-500">
              {filteredPosts.length} post{filteredPosts.length !== 1 ? 's' : ''} in
              {activeCategory !== "All Posts" && <span className="font-semibold text-brand-accent"> {activeCategory}</span>}
              {searchQuery && <span className="font-semibold text-slate-700"> "{searchQuery}"</span>}
            </p>
            <button
              onClick={() => { setActiveCategory("All Posts"); setSearchQuery(""); }}
              className="text-xs text-slate-400 hover:text-slate-600 underline transition-colors"
            >
              Clear
            </button>
          </div>
        )}

        {filteredPosts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg font-medium">No posts found.</p>
            <p className="text-slate-300 text-sm mt-2">Try a different category or search term.</p>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-10">
            {filteredPosts.map((post) => (
              <motion.article
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="group bg-white border border-slate-100 rounded-sm overflow-hidden flex flex-col"
              >
                {/* Image */}
                <div className="aspect-[16/10] overflow-hidden relative">
                  <img
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                  />
                  {/* Category Badge */}
                  <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-xs font-bold text-slate-700 px-3 py-1 rounded-full border border-slate-100">
                    {post.category}
                  </span>
                </div>

                {/* Content */}
                <div className="p-8 flex-1 flex flex-col">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span>{post.date}</span>
                      <span>•</span>
                      <span>{post.readTime}</span>
                    </div>
                  </div>

                  <h2 className="text-xl font-bold text-slate-900 mb-3 leading-tight group-hover:text-brand-accent transition-colors cursor-pointer">
                    {post.title}
                  </h2>

                  <p className="text-slate-500 text-sm leading-relaxed mb-6 line-clamp-3">
                    {post.excerpt}
                  </p>

                  <div className="mt-auto pt-5 border-t border-slate-100 flex items-center gap-5">
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <MessageSquare size={15} />
                      <span>{post.comments}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-slate-400 text-sm">
                      <Heart size={15} className={post.likes > 0 ? "fill-red-400 text-red-400" : ""} />
                      {post.likes > 0 && <span>{post.likes}</span>}
                    </div>
                  </div>
                </div>
              </motion.article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
};
