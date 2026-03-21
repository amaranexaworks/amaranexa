import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Search, Newspaper, Plus, Pencil, Trash2, X, ChevronDown,
  Navigation2, GripVertical, Eye, EyeOff, Home, BookOpen, GraduationCap, Tent
} from 'lucide-react';
import { getPosts, addPost, updatePost, deletePost } from '../utils/blogStore';
import { getNavLinks, addNavLink, updateNavLink, deleteNavLink } from '../utils/navStore';
import { getHomeContent, updateHomeSection } from '../utils/homeStore';
import { getPagesContent, updatePage } from '../utils/pagesStore';

const BLOG_CATEGORIES = [
  "Robotics", "Artificial Intelligence", "Science",
  "Web Development", "Drone", "Machine Learning",
  "Coding for Kids", "STEM Education", "Future of Tech", "Student Projects"
];

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: 'Dashboard', id: 'dashboard' },
  { icon: Home, label: 'Home Page', id: 'homepage' },
  { icon: Navigation2, label: 'Home Menu', id: 'homemenu' },
  { icon: BookOpen, label: 'Courses Page', id: 'coursespage' },
  { icon: GraduationCap, label: 'Schools Page', id: 'schoolspage' },
  { icon: Tent, label: 'Summer Camps', id: 'summerpage' },
  { icon: Newspaper, label: 'Blog Posts', id: 'blog' },
];

const emptyForm = {
  title: '',
  excerpt: '',
  image: '',
  category: '',
  readTime: ''
};

// ── Blog Post Form Modal ──────────────────────────────────────────────────────
function BlogPostModal({ post, onSave, onClose }) {
  const [form, setForm] = useState(post ? {
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    category: post.category,
    readTime: post.readTime
  } : emptyForm);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title.trim() || !form.excerpt.trim() || !form.category) return;
    onSave(form);
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-lg font-bold">{post ? 'Edit Post' : 'New Blog Post'}</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Title */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Title *</label>
            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter post title"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
            />
          </div>

          {/* Excerpt */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Excerpt / Summary *</label>
            <textarea
              name="excerpt"
              value={form.excerpt}
              onChange={handleChange}
              required
              rows={4}
              placeholder="Write a short summary of the post..."
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none"
            />
          </div>

          {/* Image URL */}
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Cover Image URL</label>
            <input
              name="image"
              value={form.image}
              onChange={handleChange}
              placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
            />
            {form.image && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-zinc-100">
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            {/* Category */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Category *</label>
              <select
                name="category"
                value={form.category}
                onChange={handleChange}
                required
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all appearance-none bg-white"
              >
                <option value="">Select category</option>
                {BLOG_CATEGORIES.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* Read Time */}
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Read Time</label>
              <input
                name="readTime"
                value={form.readTime}
                onChange={handleChange}
                placeholder="e.g. 5 min read"
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800 transition-colors"
            >
              {post ? 'Save Changes' : 'Publish Post'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// ── Dashboard Section ─────────────────────────────────────────────────────────
function DashboardSection() {
  return (
    <>
      <header className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-2xl font-bold">Good morning, Admin</h1>
          <p className="text-zinc-500 text-sm">Here's what's happening with CodeOffice today.</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={16} />
            <input
              type="text"
              placeholder="Search data..."
              className="pl-10 pr-4 py-2 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/5"
            />
          </div>
          <div className="w-10 h-10 rounded-full bg-zinc-200 border-2 border-white shadow-sm" />
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {[
          { label: 'Total Schools', value: '54', trend: '+12%' },
          { label: 'Active Students', value: '12,405', trend: '+18%' },
          { label: 'Revenue (MTD)', value: '$45,200', trend: '+8%' },
          { label: 'Lab Uptime', value: '99.9%', trend: 'Stable' },
        ].map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-3xl border border-zinc-200 shadow-sm">
            <p className="text-zinc-500 text-xs font-bold uppercase tracking-widest mb-2">{stat.label}</p>
            <div className="flex items-end justify-between">
              <h3 className="text-3xl font-bold">{stat.value}</h3>
              <span className="text-emerald-600 text-xs font-bold">{stat.trend}</span>
            </div>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-zinc-100 flex justify-between items-center">
          <h3 className="font-bold">Recent Partner Schools</h3>
          <button className="text-xs font-bold text-zinc-400 hover:text-black uppercase tracking-widest">View All</button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-bold tracking-widest">
                <th className="px-6 py-4">School Name</th>
                <th className="px-6 py-4">Location</th>
                <th className="px-6 py-4">Students</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-100">
              {[
                { name: 'St. Xavier High', loc: 'Mumbai', students: '450', status: 'Active' },
                { name: 'Greenwood Int.', loc: 'Bangalore', students: '320', status: 'Pending' },
                { name: 'DPS North', loc: 'Delhi', students: '580', status: 'Active' },
                { name: 'Oakridge Academy', loc: 'Hyderabad', students: '210', status: 'Active' },
              ].map((school) => (
                <tr key={school.name} className="hover:bg-zinc-50 transition-colors">
                  <td className="px-6 py-4 font-bold">{school.name}</td>
                  <td className="px-6 py-4 text-zinc-500">{school.loc}</td>
                  <td className="px-6 py-4 text-zinc-500">{school.students}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${
                      school.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'
                    }`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="text-zinc-400 hover:text-black">Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}

// ── Blog Section ──────────────────────────────────────────────────────────────
function BlogSection() {
  const [posts, setPosts] = useState([]);
  const [modal, setModal] = useState(null); // null | 'new' | post object
  const [deleteConfirm, setDeleteConfirm] = useState(null); // post id
  const [filterCat, setFilterCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setPosts(getPosts());
  }, []);

  const handleSave = (formData) => {
    if (modal === 'new') {
      setPosts(addPost(formData));
    } else {
      setPosts(updatePost(modal.id, formData));
    }
    setModal(null);
  };

  const handleDelete = (id) => {
    setPosts(deletePost(id));
    setDeleteConfirm(null);
  };

  const filtered = posts.filter(p => {
    const matchCat = filterCat === 'All' || p.category === filterCat;
    const matchSearch = !searchQuery ||
      p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-zinc-500 text-sm">{posts.length} total posts</p>
        </div>
        <button
          onClick={() => setModal('new')}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> New Post
        </button>
      </div>

      {/* Filters */}
      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
          <input
            type="text"
            placeholder="Search posts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 w-56"
          />
        </div>
        <div className="relative">
          <select
            value={filterCat}
            onChange={e => setFilterCat(e.target.value)}
            className="pl-3 pr-8 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none bg-white"
          >
            <option value="All">All Categories</option>
            {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>
      </div>

      {/* Posts Table */}
      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden">
        {filtered.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            <Newspaper size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No posts found.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-bold tracking-widest border-b border-zinc-100">
                  <th className="px-6 py-4">Post</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Date</th>
                  <th className="px-6 py-4">Engagement</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {filtered.map(post => (
                  <tr key={post.id} className="hover:bg-zinc-50 transition-colors">
                    {/* Post preview */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.image && (
                          <img
                            src={post.image}
                            alt=""
                            className="w-12 h-12 rounded-xl object-cover shrink-0"
                          />
                        )}
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 line-clamp-1 max-w-xs">{post.title}</p>
                          <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1 max-w-xs">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    {/* Category */}
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[11px] font-semibold whitespace-nowrap">
                        {post.category}
                      </span>
                    </td>
                    {/* Date */}
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{post.date}</td>
                    {/* Engagement */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-zinc-500 text-xs">
                        <span>💬 {post.comments}</span>
                        <span>❤️ {post.likes}</span>
                        <span className="text-zinc-400">{post.readTime}</span>
                      </div>
                    </td>
                    {/* Actions */}
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setModal(post)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(post.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* New / Edit Modal */}
      {modal && (
        <BlogPostModal
          post={modal === 'new' ? null : modal}
          onSave={handleSave}
          onClose={() => setModal(null)}
        />
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Post?</h3>
            <p className="text-zinc-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Home Menu Section ─────────────────────────────────────────────────────────
function HomeMenuSection() {
  const [links, setLinks] = useState([]);
  const [modal, setModal] = useState(null); // null | 'new' | link object
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ label: '', href: '' });

  useEffect(() => {
    setLinks(getNavLinks());
  }, []);

  const openNew = () => {
    setForm({ label: '', href: '' });
    setModal('new');
  };

  const openEdit = (link) => {
    setForm({ label: link.label, href: link.href });
    setModal(link);
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.href.trim()) return;
    if (modal === 'new') {
      setLinks(addNavLink(form));
    } else {
      setLinks(updateNavLink(modal.id, form));
    }
    setModal(null);
  };

  const handleToggle = (link) => {
    setLinks(updateNavLink(link.id, { enabled: !link.enabled }));
  };

  const handleDelete = (id) => {
    setLinks(deleteNavLink(id));
    setDeleteConfirm(null);
  };

  return (
    <>
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Home Menu</h1>
          <p className="text-zinc-500 text-sm">Manage which links appear in the navbar</p>
        </div>
        <button
          onClick={openNew}
          className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors"
        >
          <Plus size={16} /> Add Link
        </button>
      </div>

      {/* Links Table */}
      <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm overflow-hidden">
        {links.length === 0 ? (
          <div className="py-20 text-center text-zinc-400">
            <Navigation2 size={40} className="mx-auto mb-3 opacity-30" />
            <p className="font-medium">No nav links configured.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="bg-zinc-50 text-zinc-500 uppercase text-[10px] font-bold tracking-widest border-b border-zinc-100">
                  <th className="px-6 py-4">Label</th>
                  <th className="px-6 py-4">URL / Path</th>
                  <th className="px-6 py-4">Visible</th>
                  <th className="px-6 py-4">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {links.map((link) => (
                  <tr key={link.id} className="hover:bg-zinc-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <GripVertical size={16} className="text-zinc-300" />
                        <span className="font-semibold text-zinc-900">{link.label}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">{link.href}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleToggle(link)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${
                          link.enabled
                            ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100'
                            : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'
                        }`}
                      >
                        {link.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                        {link.enabled ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => openEdit(link)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors"
                        >
                          <Pencil size={13} /> Edit
                        </button>
                        <button
                          onClick={() => setDeleteConfirm(link.id)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors"
                        >
                          <Trash2 size={13} /> Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add / Edit Modal */}
      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold">{modal === 'new' ? 'Add Nav Link' : 'Edit Nav Link'}</h2>
              <button
                onClick={() => setModal(null)}
                className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"
              >
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Label *</label>
                <input
                  value={form.label}
                  onChange={e => setForm({ ...form, label: e.target.value })}
                  required
                  placeholder="e.g. Courses"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">URL / Path *</label>
                <input
                  value={form.href}
                  onChange={e => setForm({ ...form, href: e.target.value })}
                  required
                  placeholder="e.g. /courses"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setModal(null)}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800 transition-colors"
                >
                  {modal === 'new' ? 'Add Link' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Remove Link?</h3>
            <p className="text-zinc-500 text-sm mb-6">This will remove the link from the navbar.</p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={() => setDeleteConfirm(null)}
                className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(deleteConfirm)}
                className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Shared Editor Primitives ──────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'input', placeholder = '' }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">{label}</label>
      {type === 'textarea' ? (
        <textarea
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          rows={3}
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none"
        />
      ) : (
        <input
          type="text"
          value={value ?? ''}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
        />
      )}
    </div>
  );
}

function SaveBtn({ onClick }) {
  const [saved, setSaved] = useState(false);
  const handle = () => { onClick(); setSaved(true); setTimeout(() => setSaved(false), 2000); };
  return (
    <button
      onClick={handle}
      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : 'bg-black text-white hover:bg-zinc-800'}`}
    >
      {saved ? '✓ Saved' : 'Save Changes'}
    </button>
  );
}

function EditorCard({ title, children }) {
  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 space-y-5">
      <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">{title}</h3>
      {children}
    </div>
  );
}

// ── Hero Editor ───────────────────────────────────────────────────────────────
function HeroEditor({ data, onSave }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-6">
      <EditorCard title="Badge & Headline">
        <Field label="Badge Text" value={form.badge} onChange={v => set('badge', v)} />
        <div className="grid grid-cols-3 gap-4">
          <Field label="Line 1" value={form.headlineLine1} onChange={v => set('headlineLine1', v)} placeholder="BUILD THE" />
          <Field label="Gradient Line" value={form.headlineGradient} onChange={v => set('headlineGradient', v)} placeholder="NEXT GEN OF" />
          <Field label="Line 3" value={form.headlineLine3} onChange={v => set('headlineLine3', v)} placeholder="CREATORS." />
        </div>
        <Field label="Subtitle" value={form.subtitle} onChange={v => set('subtitle', v)} type="textarea" />
      </EditorCard>
      <EditorCard title="CTA Buttons">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Primary Button" value={form.cta1} onChange={v => set('cta1', v)} />
          <Field label="Secondary Button" value={form.cta2} onChange={v => set('cta2', v)} />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <Field label="Student Count" value={form.studentCount} onChange={v => set('studentCount', v)} placeholder="5,000+" />
          <Field label="Student Description" value={form.studentDesc} onChange={v => set('studentDesc', v)} />
        </div>
      </EditorCard>
      <EditorCard title="Video & Floating Stats">
        <Field label="Hero Video URL" value={form.videoUrl} onChange={v => set('videoUrl', v)} placeholder="https://..." />
        <div className="grid grid-cols-2 gap-6">
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Floating Card 1</p>
            <Field label="Label" value={form.stat1Label} onChange={v => set('stat1Label', v)} />
            <Field label="Value" value={form.stat1Value} onChange={v => set('stat1Value', v)} placeholder="99.8%" />
          </div>
          <div className="space-y-3">
            <p className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Floating Card 2</p>
            <Field label="Label" value={form.stat2Label} onChange={v => set('stat2Label', v)} />
            <Field label="Value" value={form.stat2Value} onChange={v => set('stat2Value', v)} placeholder="100%" />
          </div>
        </div>
      </EditorCard>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(form)} /></div>
    </div>
  );
}

// ── Videos Editor ─────────────────────────────────────────────────────────────
function VideosEditor({ data, onSave }) {
  const [title, setTitle] = useState(data.title);
  const [videos, setVideos] = useState(data.videos);
  const [newUrl, setNewUrl] = useState('');
  const [previewUrl, setPreviewUrl] = useState('');

  const handleAdd = () => {
    const url = newUrl.trim();
    if (!url) return;
    setVideos([...videos, url]);
    setPreviewUrl(url);
    setNewUrl('');
  };

  return (
    <div className="space-y-6">
      <EditorCard title="Section Settings">
        <Field label="Section Title" value={title} onChange={setTitle} />
      </EditorCard>

      <EditorCard title="Video URLs (carousel)">
        <p className="text-xs text-zinc-400 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <strong className="text-amber-700">Supported:</strong> YouTube links (youtube.com/watch, youtu.be, shorts), Google Drive share links, or direct video URLs (.mp4, .webm). For Drive: make sure sharing is set to <strong>"Anyone with the link"</strong>.
        </p>

        <div className="space-y-2">
          {videos.map((url, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">{i + 1}</span>
              <span className="flex-1 text-xs font-mono text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl truncate">{url}</span>
              <button onClick={() => setPreviewUrl(url)} className="text-xs text-zinc-400 hover:text-zinc-700 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors shrink-0">
                Preview
              </button>
              <button onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 transition-colors shrink-0">
                <Trash2 size={15} />
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-3">
          <input
            value={newUrl}
            onChange={e => setNewUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleAdd()}
            placeholder="Paste direct .mp4 video URL..."
            className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
          />
          <button onClick={handleAdd} className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-black">
            Add
          </button>
        </div>

        {/* Video preview */}
        {previewUrl && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-zinc-500 mb-2">Preview:</p>
            <video
              key={previewUrl}
              src={previewUrl}
              controls
              className="w-full max-h-48 rounded-xl object-cover bg-zinc-100"
              onError={() => {}}
            />
          </div>
        )}
      </EditorCard>

      <div className="flex justify-end"><SaveBtn onClick={() => onSave({ title, videos })} /></div>
    </div>
  );
}

// ── Testimonials Editor ───────────────────────────────────────────────────────
function TestimonialsEditor({ data, onSave }) {
  const [title, setTitle] = useState(data.title);
  const [items, setItems] = useState(data.items);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ quote: '', author: '', role: '', avatar: '', video: '' });

  const openAdd = () => { setForm({ quote: '', author: '', role: '', avatar: '', video: '' }); setModal('new'); };
  const openEdit = (item) => { setForm({ quote: item.quote, author: item.author, role: item.role, avatar: item.avatar || '', video: item.video || '' }); setModal(item); };

  const handleSave = (e) => {
    e.preventDefault();
    if (modal === 'new') setItems([...items, { ...form, id: Date.now() }]);
    else setItems(items.map(t => t.id === modal.id ? { ...t, ...form } : t));
    setModal(null);
  };

  return (
    <div className="space-y-6">
      <EditorCard title="Section Settings">
        <Field label="Section Title" value={title} onChange={setTitle} />
      </EditorCard>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-zinc-700">Testimonials ({items.length})</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800">
          <Plus size={15} /> Add
        </button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-5 flex gap-4 items-start">
            <img src={item.avatar || 'https://i.pravatar.cc/150'} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900">{item.author} <span className="font-normal text-zinc-400">— {item.role}</span></p>
              <p className="text-xs text-zinc-500 mt-1 line-clamp-2">"{item.quote}"</p>
            </div>
            <div className="flex gap-1.5 shrink-0">
              <button onClick={() => openEdit(item)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"><Pencil size={14} /></button>
              <button onClick={() => setItems(items.filter(t => t.id !== item.id))} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave({ title, items })} /></div>

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="font-bold text-lg">{modal === 'new' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <Field label="Quote *" value={form.quote} onChange={v => setForm(f => ({ ...f, quote: v }))} type="textarea" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Author Name *" value={form.author} onChange={v => setForm(f => ({ ...f, author: v }))} />
                <Field label="Role" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} placeholder="Parent of Xth Grader" />
              </div>
              <Field label="Avatar URL" value={form.avatar} onChange={v => setForm(f => ({ ...f, avatar: v }))} placeholder="https://i.pravatar.cc/150?u=..." />
              {form.avatar && <img src={form.avatar} alt="" className="w-14 h-14 rounded-full object-cover" referrerPolicy="no-referrer" />}
              <div>
                <Field label="Video URL (optional)" value={form.video} onChange={v => setForm(f => ({ ...f, video: v }))} placeholder="YouTube, Google Drive, or direct video URL" />
                <p className="text-xs text-zinc-400 mt-1">Supported: YouTube links, Google Drive share links, or direct .mp4 URLs</p>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

// ── Features Editor ───────────────────────────────────────────────────────────
function FeaturesEditor({ data, onSave }) {
  const [title, setTitle] = useState(data.title);
  const [subtitle, setSubtitle] = useState(data.subtitle);
  const [items, setItems] = useState(data.items);
  const update = (id, key, val) => setItems(items.map(it => it.id === id ? { ...it, [key]: val } : it));

  return (
    <div className="space-y-6">
      <EditorCard title="Section Header">
        <Field label="Section Title" value={title} onChange={setTitle} />
        <Field label="Subtitle" value={subtitle} onChange={setSubtitle} type="textarea" />
      </EditorCard>
      {items.map((item, i) => (
        <EditorCard key={item.id} title={`Card ${i + 1} — ${item.size === 'large' ? 'Wide' : 'Standard'}`}>
          <Field label="Title" value={item.title} onChange={v => update(item.id, 'title', v)} />
          <Field label="Description" value={item.desc} onChange={v => update(item.id, 'desc', v)} type="textarea" />
        </EditorCard>
      ))}
      <div className="flex justify-end"><SaveBtn onClick={() => onSave({ title, subtitle, items })} /></div>
    </div>
  );
}

// ── Perks Editor ──────────────────────────────────────────────────────────────
function PerksEditor({ data, onSave }) {
  const [title, setTitle] = useState(data.title);
  const [subtitle, setSubtitle] = useState(data.subtitle);
  const [items, setItems] = useState(data.items);
  const update = (id, key, val) => setItems(items.map(it => it.id === id ? { ...it, [key]: val } : it));

  return (
    <div className="space-y-6">
      <EditorCard title="Section Header">
        <Field label="Section Title" value={title} onChange={setTitle} />
        <Field label="Subtitle" value={subtitle} onChange={setSubtitle} type="textarea" />
      </EditorCard>
      {items.map((item, i) => (
        <EditorCard key={item.id} title={`Perk ${i + 1}`}>
          <Field label="Title" value={item.title} onChange={v => update(item.id, 'title', v)} />
          <Field label="Description" value={item.desc} onChange={v => update(item.id, 'desc', v)} type="textarea" />
        </EditorCard>
      ))}
      <div className="flex justify-end"><SaveBtn onClick={() => onSave({ title, subtitle, items })} /></div>
    </div>
  );
}

// ── CTA Editor ────────────────────────────────────────────────────────────────
function CTAEditor({ data, onSave }) {
  const [form, setForm] = useState(data);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  return (
    <div className="space-y-6">
      <EditorCard title="CTA Section">
        <Field label="Badge Text" value={form.badge} onChange={v => set('badge', v)} />
        <Field label="Headline" value={form.headline} onChange={v => set('headline', v)} />
        <Field label="Headline Accent (gradient)" value={form.headlineAccent} onChange={v => set('headlineAccent', v)} />
        <Field label="Subtitle" value={form.subtitle} onChange={v => set('subtitle', v)} type="textarea" />
        <Field label="Button Text" value={form.buttonText} onChange={v => set('buttonText', v)} />
      </EditorCard>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(form)} /></div>
    </div>
  );
}

// ── Gallery Editor ────────────────────────────────────────────────────────────
function GalleryEditor({ data, onSave }) {
  const [mainImage, setMainImage] = useState(data.mainImage);
  const [cards, setCards] = useState(data.cards);
  const updateCard = (i, key, val) => setCards(cards.map((c, idx) => idx === i ? { ...c, [key]: val } : c));

  return (
    <div className="space-y-6">
      <EditorCard title="Left Feature Photo">
        <Field label="Main Image URL" value={mainImage} onChange={setMainImage} placeholder="https://images.unsplash.com/..." />
        {mainImage && <img src={mainImage} alt="" className="h-40 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
      </EditorCard>
      {cards.map((card, i) => (
        <EditorCard key={i} title={`Gallery Card ${i + 1} — ${card.tag}`}>
          <Field label="Image URL" value={card.image} onChange={v => updateCard(i, 'image', v)} placeholder="https://images.unsplash.com/..." />
          {card.image && <img src={card.image} alt="" className="h-32 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
          <div className="grid grid-cols-2 gap-4">
            <Field label="Tag" value={card.tag} onChange={v => updateCard(i, 'tag', v)} placeholder="Web Development" />
            <Field label="Caption" value={card.caption} onChange={v => updateCard(i, 'caption', v)} />
          </div>
          <Field label="Sub-text" value={card.sub} onChange={v => updateCard(i, 'sub', v)} />
        </EditorCard>
      ))}
      <div className="flex justify-end"><SaveBtn onClick={() => onSave({ mainImage, cards })} /></div>
    </div>
  );
}

// ── Homepage Section ──────────────────────────────────────────────────────────
function HomepageSection() {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState(() => getHomeContent());

  const handleSave = (section, data) => {
    const updated = updateHomeSection(section, data);
    setContent(updated);
  };

  const TABS = [
    { id: 'hero', label: 'Hero' },
    { id: 'gallery', label: 'Gallery' },
    { id: 'videos', label: 'Videos' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'features', label: 'Features' },
    { id: 'perks', label: 'Perks' },
    { id: 'cta', label: 'CTA' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Home Page</h1>
          <p className="text-zinc-500 text-sm">Edit every section visible on the home page</p>
        </div>
      </div>

      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
              activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && <HeroEditor data={content.hero} onSave={d => handleSave('hero', d)} />}
      {activeTab === 'gallery' && <GalleryEditor data={content.gallery} onSave={d => handleSave('gallery', d)} />}
      {activeTab === 'videos' && <VideosEditor data={content.lifeSection} onSave={d => handleSave('lifeSection', d)} />}
      {activeTab === 'testimonials' && <TestimonialsEditor data={content.testimonials} onSave={d => handleSave('testimonials', d)} />}
      {activeTab === 'features' && <FeaturesEditor data={content.features} onSave={d => handleSave('features', d)} />}
      {activeTab === 'perks' && <PerksEditor data={content.perks} onSave={d => handleSave('perks', d)} />}
      {activeTab === 'cta' && <CTAEditor data={content.cta} onSave={d => handleSave('cta', d)} />}
    </>
  );
}

// ── Courses Page Section ──────────────────────────────────────────────────────
function CoursesPageSection() {
  const [activeTab, setActiveTab] = useState('header');
  const [content, setContent] = useState(() => getPagesContent().courses);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', image: '', desc: '' });

  const save = (data) => {
    const updated = updatePage('courses', data);
    setContent(updated.courses);
  };

  const openAdd = () => { setForm({ title: '', image: '', desc: '' }); setModal('new'); };
  const openEdit = (item) => { setForm({ title: item.title, image: item.image, desc: item.desc }); setModal(item); };

  const handleCardSave = (e) => {
    e.preventDefault();
    let items;
    if (modal === 'new') {
      items = [...content.items, { ...form, id: Date.now() }];
    } else {
      items = content.items.map(it => it.id === modal.id ? { ...it, ...form } : it);
    }
    save({ ...content, items });
    setModal(null);
  };

  const TABS = [{ id: 'header', label: 'Header' }, { id: 'cards', label: 'Course Cards' }];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Courses Page</h1>
          <p className="text-zinc-500 text-sm">Edit content shown on /courses</p>
        </div>
      </div>
      <div className="flex gap-2 mb-8">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'header' && (
        <div className="space-y-6">
          <EditorCard title="Page Header">
            <Field label="Headline (e.g. OUR)" value={content.headline} onChange={v => setContent(c => ({ ...c, headline: v }))} />
            <Field label="Gradient Word (e.g. CURRICULUM)" value={content.headlineGradient} onChange={v => setContent(c => ({ ...c, headlineGradient: v }))} />
            <Field label="Subtitle" value={content.subtitle} onChange={v => setContent(c => ({ ...c, subtitle: v }))} type="textarea" />
          </EditorCard>
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {activeTab === 'cards' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-zinc-700">Course Cards ({content.items.length})</p>
            <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800">
              <Plus size={15} /> Add Course
            </button>
          </div>
          <div className="grid md:grid-cols-2 gap-4">
            {content.items.map(item => (
              <div key={item.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-4 flex gap-4 items-start">
                {item.image && <img src={item.image} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm">{item.title}</p>
                  <p className="text-xs text-zinc-400 mt-1 line-clamp-2">{item.desc}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openEdit(item)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => save({ ...content, items: content.items.filter(i => i.id !== item.id) })} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="font-bold text-lg">{modal === 'new' ? 'Add Course' : 'Edit Course'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100"><X size={18} /></button>
            </div>
            <form onSubmit={handleCardSave} className="p-6 space-y-4">
              <Field label="Course Title *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <Field label="Image URL" value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} placeholder="https://images.unsplash.com/..." />
              {form.image && <img src={form.image} alt="" className="h-28 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
              <Field label="Description" value={form.desc} onChange={v => setForm(f => ({ ...f, desc: v }))} type="textarea" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ── Schools Page Section ──────────────────────────────────────────────────────
function SchoolsPageSection() {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState(() => getPagesContent().schools);

  const save = (data) => {
    const updated = updatePage('schools', data);
    setContent(updated.schools);
  };

  const TABS = [
    { id: 'hero', label: 'Hero' },
    { id: 'labs', label: 'Labs' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Schools Page</h1>
          <p className="text-zinc-500 text-sm">Edit content shown on /schools</p>
        </div>
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'hero' && (
        <div className="space-y-6">
          <EditorCard title="Hero Section">
            <Field label="Headline" value={content.heroHeadline} onChange={v => setContent(c => ({ ...c, heroHeadline: v }))} />
            <Field label="Accent (yellow highlight)" value={content.heroAccent} onChange={v => setContent(c => ({ ...c, heroAccent: v }))} />
            <Field label="Subtitle" value={content.heroSubtitle} onChange={v => setContent(c => ({ ...c, heroSubtitle: v }))} type="textarea" />
            <Field label="Hero Image URL" value={content.heroImage} onChange={v => setContent(c => ({ ...c, heroImage: v }))} placeholder="https://images.unsplash.com/..." />
            {content.heroImage && <img src={content.heroImage} alt="" className="h-36 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
          </EditorCard>
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {activeTab === 'labs' && (
        <div className="space-y-6">
          <EditorCard title="Labs Section Header">
            <Field label="Title" value={content.labsTitle} onChange={v => setContent(c => ({ ...c, labsTitle: v }))} />
            <Field label="Subtitle" value={content.labsSubtitle} onChange={v => setContent(c => ({ ...c, labsSubtitle: v }))} type="textarea" />
          </EditorCard>
          {content.labItems.map((lab, i) => (
            <EditorCard key={lab.id} title={`Lab ${i + 1}`}>
              <Field label="Title" value={lab.title} onChange={v => setContent(c => ({ ...c, labItems: c.labItems.map(l => l.id === lab.id ? { ...l, title: v } : l) }))} />
              <Field label="Description" value={lab.desc} onChange={v => setContent(c => ({ ...c, labItems: c.labItems.map(l => l.id === lab.id ? { ...l, desc: v } : l) }))} type="textarea" />
              <Field label="Image URL" value={lab.image} onChange={v => setContent(c => ({ ...c, labItems: c.labItems.map(l => l.id === lab.id ? { ...l, image: v } : l) }))} />
              {lab.image && <img src={lab.image} alt="" className="h-28 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
            </EditorCard>
          ))}
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {activeTab === 'products' && (
        <div className="space-y-6">
          <EditorCard title="Products Section Header">
            <Field label="Title" value={content.productsTitle} onChange={v => setContent(c => ({ ...c, productsTitle: v }))} />
            <Field label="Subtitle" value={content.productsSubtitle} onChange={v => setContent(c => ({ ...c, productsSubtitle: v }))} type="textarea" />
          </EditorCard>
          {content.products.map((product, i) => (
            <EditorCard key={product.id} title={`Product ${i + 1}`}>
              <Field label="Icon Text (3-4 chars)" value={product.icon} onChange={v => setContent(c => ({ ...c, products: c.products.map(p => p.id === product.id ? { ...p, icon: v } : p) }))} placeholder="LMS" />
              <Field label="Title" value={product.title} onChange={v => setContent(c => ({ ...c, products: c.products.map(p => p.id === product.id ? { ...p, title: v } : p) }))} />
              <Field label="Description" value={product.desc} onChange={v => setContent(c => ({ ...c, products: c.products.map(p => p.id === product.id ? { ...p, desc: v } : p) }))} type="textarea" />
            </EditorCard>
          ))}
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {activeTab === 'services' && (
        <div className="space-y-6">
          <EditorCard title="Services Section">
            <Field label="Title" value={content.servicesTitle} onChange={v => setContent(c => ({ ...c, servicesTitle: v }))} />
            <Field label="Events Count (badge)" value={content.eventsCount} onChange={v => setContent(c => ({ ...c, eventsCount: v }))} placeholder="15+" />
          </EditorCard>
          {content.services.map((service, i) => (
            <EditorCard key={service.id} title={`Service ${i + 1}`}>
              <Field label="Title" value={service.title} onChange={v => setContent(c => ({ ...c, services: c.services.map(s => s.id === service.id ? { ...s, title: v } : s) }))} />
              <Field label="Description" value={service.desc} onChange={v => setContent(c => ({ ...c, services: c.services.map(s => s.id === service.id ? { ...s, desc: v } : s) }))} type="textarea" />
            </EditorCard>
          ))}
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {activeTab === 'contact' && (
        <div className="space-y-6">
          <EditorCard title="Social Proof & Contact">
            <Field label="Social Proof Text (shows above contact)" value={content.socialProofHeadline} onChange={v => setContent(c => ({ ...c, socialProofHeadline: v }))} />
            <Field label="Contact Headline" value={content.contactHeadline} onChange={v => setContent(c => ({ ...c, contactHeadline: v }))} />
            <Field label="Contact Subtitle" value={content.contactSubtitle} onChange={v => setContent(c => ({ ...c, contactSubtitle: v }))} type="textarea" />
          </EditorCard>
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}
    </>
  );
}

// ── Summer Camps Page Section ─────────────────────────────────────────────────
function SummerCampsPageSection() {
  const [activeTab, setActiveTab] = useState('camps');
  const [content, setContent] = useState(() => getPagesContent().summerCamps);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  const save = (data) => {
    const updated = updatePage('summerCamps', data);
    setContent(updated.summerCamps);
  };

  const TABS = [
    { id: 'camps', label: 'Camps' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  const openCampAdd = () => {
    setForm({ category: '', title: 'SUMMER CAMP', grades: '', details: '', startDate: '', image: '' });
    setModal('camp-new');
  };
  const openCampEdit = (camp) => {
    setForm({ ...camp, details: (camp.details ?? []).join(', ') });
    setModal({ type: 'camp', item: camp });
  };
  const saveCamp = (e) => {
    e.preventDefault();
    const campData = { ...form, details: form.details.split(',').map(d => d.trim()).filter(Boolean) };
    let camps;
    if (modal === 'camp-new') {
      camps = [...content.camps, { ...campData, id: Date.now() }];
    } else {
      camps = content.camps.map(c => c.id === modal.item.id ? { ...c, ...campData } : c);
    }
    save({ ...content, camps });
    setModal(null);
  };

  const openBenefitAdd = () => { setForm({ title: '', desc: '' }); setModal('benefit-new'); };
  const openBenefitEdit = (b) => { setForm({ title: b.title, desc: b.desc }); setModal({ type: 'benefit', item: b }); };
  const saveBenefit = (e) => {
    e.preventDefault();
    let benefits;
    if (modal === 'benefit-new') {
      benefits = [...content.benefits, { ...form, id: Date.now() }];
    } else {
      benefits = content.benefits.map(b => b.id === modal.item.id ? { ...b, ...form } : b);
    }
    save({ ...content, benefits });
    setModal(null);
  };

  const openTestimonialAdd = () => { setForm({ name: '', role: '', content: '', rating: 5 }); setModal('testimonial-new'); };
  const openTestimonialEdit = (t) => { setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating }); setModal({ type: 'testimonial', item: t }); };
  const saveTestimonial = (e) => {
    e.preventDefault();
    let testimonials;
    if (modal === 'testimonial-new') {
      testimonials = [...content.testimonials, { ...form, id: Date.now(), rating: Number(form.rating) }];
    } else {
      testimonials = content.testimonials.map(t => t.id === modal.item.id ? { ...t, ...form, rating: Number(form.rating) } : t);
    }
    save({ ...content, testimonials });
    setModal(null);
  };

  const isCampModal = modal === 'camp-new' || (modal && modal.type === 'camp');
  const isBenefitModal = modal === 'benefit-new' || (modal && modal.type === 'benefit');
  const isTestimonialModal = modal === 'testimonial-new' || (modal && modal.type === 'testimonial');

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Summer Camps Page</h1>
          <p className="text-zinc-500 text-sm">Edit content shown on /summer-camps</p>
        </div>
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'camps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-zinc-700">Camps ({content.camps.length})</p>
            <button onClick={openCampAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800">
              <Plus size={15} /> Add Camp
            </button>
          </div>
          <div className="space-y-3">
            {content.camps.map(camp => (
              <div key={camp.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-5 flex gap-4 items-start">
                {camp.image && <img src={camp.image} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900">{camp.category} — {camp.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">Grade {camp.grades} · Starts {camp.startDate}</p>
                  <p className="text-xs text-zinc-400">{(camp.details ?? []).join(' · ')}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openCampEdit(camp)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => save({ ...content, camps: content.camps.filter(c => c.id !== camp.id) })} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'benefits' && (
        <div className="space-y-6">
          <EditorCard title="Benefits Section">
            <Field label="Section Title" value={content.benefitsTitle} onChange={v => setContent(c => ({ ...c, benefitsTitle: v }))} />
          </EditorCard>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-zinc-700">Benefits ({content.benefits.length})</p>
            <button onClick={openBenefitAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800">
              <Plus size={15} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {content.benefits.map(b => (
              <div key={b.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-4 flex gap-4 items-start">
                <div className="flex-1">
                  <p className="font-bold text-zinc-900 text-sm">{b.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">{b.desc}</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openBenefitEdit(b)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => save({ ...content, benefits: content.benefits.filter(x => x.id !== b.id) })} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {activeTab === 'testimonials' && (
        <div className="space-y-6">
          <EditorCard title="Testimonials Section">
            <Field label="Section Title" value={content.testimonialsTitle} onChange={v => setContent(c => ({ ...c, testimonialsTitle: v }))} />
          </EditorCard>
          <div className="flex items-center justify-between">
            <p className="font-semibold text-zinc-700">Testimonials ({content.testimonials.length})</p>
            <button onClick={openTestimonialAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800">
              <Plus size={15} /> Add
            </button>
          </div>
          <div className="space-y-3">
            {content.testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-4 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 shrink-0">{t.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm">{t.name} <span className="font-normal text-zinc-400">— {t.role}</span></p>
                  <p className="text-xs text-zinc-500 mt-1 line-clamp-2">"{t.content}"</p>
                </div>
                <div className="flex gap-1.5 shrink-0">
                  <button onClick={() => openTestimonialEdit(t)} className="p-1.5 text-zinc-400 hover:text-zinc-700 hover:bg-zinc-100 rounded-lg"><Pencil size={14} /></button>
                  <button onClick={() => save({ ...content, testimonials: content.testimonials.filter(x => x.id !== t.id) })} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded-lg"><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
          <div className="flex justify-end"><SaveBtn onClick={() => save(content)} /></div>
        </div>
      )}

      {/* Camp Modal */}
      {isCampModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="font-bold text-lg">{modal === 'camp-new' ? 'Add Camp' : 'Edit Camp'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100"><X size={18} /></button>
            </div>
            <form onSubmit={saveCamp} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Category (e.g. ROBOTICS)" value={form.category} onChange={v => setForm(f => ({ ...f, category: v }))} />
                <Field label="Title (e.g. SUMMER CAMP)" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Field label="Grades (e.g. 2nd to 12th)" value={form.grades} onChange={v => setForm(f => ({ ...f, grades: v }))} />
                <Field label="Start Date (e.g. 9th March)" value={form.startDate} onChange={v => setForm(f => ({ ...f, startDate: v }))} />
              </div>
              <Field label="Details (comma-separated)" value={form.details} onChange={v => setForm(f => ({ ...f, details: v }))} placeholder="3D Design, Sensor Integration, Electronics" />
              <Field label="Image URL" value={form.image} onChange={v => setForm(f => ({ ...f, image: v }))} placeholder="https://images.unsplash.com/..." />
              {form.image && <img src={form.image} alt="" className="h-28 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Benefit Modal */}
      {isBenefitModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="font-bold text-lg">{modal === 'benefit-new' ? 'Add Benefit' : 'Edit Benefit'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100"><X size={18} /></button>
            </div>
            <form onSubmit={saveBenefit} className="p-6 space-y-4">
              <Field label="Title *" value={form.title} onChange={v => setForm(f => ({ ...f, title: v }))} />
              <Field label="Description" value={form.desc} onChange={v => setForm(f => ({ ...f, desc: v }))} type="textarea" />
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Testimonial Modal */}
      {isTestimonialModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h3 className="font-bold text-lg">{modal === 'testimonial-new' ? 'Add Testimonial' : 'Edit Testimonial'}</h3>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100"><X size={18} /></button>
            </div>
            <form onSubmit={saveTestimonial} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Name *" value={form.name} onChange={v => setForm(f => ({ ...f, name: v }))} />
                <Field label="Role (e.g. Parent of 7th Grader)" value={form.role} onChange={v => setForm(f => ({ ...f, role: v }))} />
              </div>
              <Field label="Testimonial Content *" value={form.content} onChange={v => setForm(f => ({ ...f, content: v }))} type="textarea" />
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Rating (1–5)</label>
                <select value={form.rating} onChange={e => setForm(f => ({ ...f, rating: e.target.value }))}
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 bg-white">
                  {[5, 4, 3, 2, 1].map(n => <option key={n} value={n}>{n} Star{n > 1 ? 's' : ''}</option>)}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

// ── Admin Page ────────────────────────────────────────────────────────────────
export const Admin = () => {
  const [activeSection, setActiveSection] = useState('dashboard');

  return (
    <div className="flex min-h-screen bg-zinc-50">
      {/* Sidebar */}
      <aside className="w-64 bg-white border-r border-zinc-200 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                activeSection === item.id
                  ? 'bg-black text-white'
                  : 'text-zinc-500 hover:bg-zinc-100'
              }`}
            >
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8 overflow-auto">
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'homepage' && <HomepageSection />}
        {activeSection === 'homemenu' && <HomeMenuSection />}
        {activeSection === 'coursespage' && <CoursesPageSection />}
        {activeSection === 'schoolspage' && <SchoolsPageSection />}
        {activeSection === 'summerpage' && <SummerCampsPageSection />}
        {activeSection === 'blog' && <BlogSection />}
      </main>
    </div>
  );
};
