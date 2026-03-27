import { useState, useEffect, useRef } from 'react';
import {
  LayoutDashboard, Search, Newspaper, Plus, Pencil, Trash2, X, ChevronDown,
  Navigation2, GripVertical, Eye, EyeOff, Home, BookOpen, GraduationCap, Tent,
  Image, Upload, LogOut, Film
} from 'lucide-react';
import { getPosts, addPost, updatePost, deletePost } from '../utils/blogStore';
import { getNavLinks, addNavLink, updateNavLink, deleteNavLink } from '../utils/navStore';
import { getHomeContent, updateHomeSection } from '../utils/homeStore';
import { getPagesContent, updatePage } from '../utils/pagesStore';
import {
  loginAdmin, verifyToken,
  fetchMedia, uploadMedia, deleteMedia, getMediaUrl
} from '../utils/api';

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
  { icon: BookOpen, label: 'Blog Settings', id: 'blogpage' },
  { icon: Image, label: 'Media Gallery', id: 'media' },
];

const emptyForm = {
  title: '',
  excerpt: '',
  image: '',
  category: '',
  readTime: ''
};

// ── Login Screen ──────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const data = await loginAdmin(username, password);
      if (data.error) { setError(data.error); return; }
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin_username', data.username);
      onLogin();
    } catch {
      setError('Connection failed. Is the backend running?');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="bg-white rounded-3xl border border-zinc-200 shadow-sm p-8 w-full max-w-sm">
        <div className="flex items-center gap-2 mb-8 justify-center">
          <div className="bg-black text-white p-1.5 rounded-lg">
            <LayoutDashboard size={20} />
          </div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <h2 className="text-xl font-bold text-center mb-1">Sign In</h2>
        <p className="text-zinc-400 text-sm text-center mb-6">Enter your credentials to continue</p>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm rounded-xl px-4 py-3 mb-4">{error}</div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Username</label>
            <input
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Password</label>
            <input
              type="password"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              minLength={6}
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800 transition-colors"
          >
            Sign In
          </button>
        </form>
      </div>
    </div>
  );
}

// ── Blog Post Form Modal ──────────────────────────────────────────────────────
function BlogPostModal({ post, onSave, onClose }) {
  const [form, setForm] = useState(post ? {
    title: post.title,
    excerpt: post.excerpt,
    image: post.image,
    category: post.category,
    readTime: post.readTime || post.read_time || ''
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
        <div className="flex items-center justify-between p-6 border-b border-zinc-100">
          <h2 className="text-lg font-bold">{post ? 'Edit Post' : 'New Blog Post'}</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Title *</label>
            <input name="title" value={form.title} onChange={handleChange} required placeholder="Enter post title"
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Excerpt / Summary *</label>
            <textarea name="excerpt" value={form.excerpt} onChange={handleChange} required rows={4} placeholder="Write a short summary..."
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all resize-none" />
          </div>

          <div>
            <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Cover Image URL</label>
            <input name="image" value={form.image} onChange={handleChange} placeholder="https://images.unsplash.com/..."
              className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all" />
            {form.image && (
              <div className="mt-2 h-32 rounded-xl overflow-hidden border border-zinc-100">
                <img src={form.image} alt="preview" className="w-full h-full object-cover" />
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Category *</label>
              <select name="category" value={form.category} onChange={handleChange} required
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all appearance-none bg-white">
                <option value="">Select category</option>
                {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Read Time</label>
              <input name="readTime" value={form.readTime} onChange={handleChange} placeholder="e.g. 5 min read"
                className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all" />
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
            <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800 transition-colors">
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
            <input type="text" placeholder="Search data..."
              className="pl-10 pr-4 py-2 rounded-xl border border-zinc-200 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-black/5" />
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
                    <span className={`px-2 py-1 rounded-full text-[10px] font-bold uppercase ${school.status === 'Active' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'}`}>
                      {school.status}
                    </span>
                  </td>
                  <td className="px-6 py-4"><button className="text-zinc-400 hover:text-black">Edit</button></td>
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
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [filterCat, setFilterCat] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    getPosts().then(setPosts);
  }, []);

  const handleSave = async (formData) => {
    if (modal === 'new') {
      await addPost(formData);
    } else {
      await updatePost(modal.id, formData);
    }
    setPosts(await getPosts());
    setModal(null);
  };

  const handleDelete = async (id) => {
    await deletePost(id);
    setPosts(await getPosts());
    setDeleteConfirm(null);
  };

  const filtered = posts.filter(p => {
    const matchCat = filterCat === 'All' || p.category === filterCat;
    const matchSearch = !searchQuery || p.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Blog Posts</h1>
          <p className="text-zinc-500 text-sm">{posts.length} total posts</p>
        </div>
        <button onClick={() => setModal('new')} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
          <Plus size={16} /> New Post
        </button>
      </div>

      <div className="flex items-center gap-4 mb-6 flex-wrap">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" size={15} />
          <input type="text" placeholder="Search posts..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
            className="pl-9 pr-4 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 w-56" />
        </div>
        <div className="relative">
          <select value={filterCat} onChange={e => setFilterCat(e.target.value)}
            className="pl-3 pr-8 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/5 appearance-none bg-white">
            <option value="All">All Categories</option>
            {BLOG_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
          <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
        </div>
      </div>

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
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {post.image && <img src={post.image} alt="" className="w-12 h-12 rounded-xl object-cover shrink-0" />}
                        <div className="min-w-0">
                          <p className="font-semibold text-zinc-900 line-clamp-1 max-w-xs">{post.title}</p>
                          <p className="text-zinc-400 text-xs mt-0.5 line-clamp-1 max-w-xs">{post.excerpt}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2.5 py-1 bg-zinc-100 text-zinc-600 rounded-full text-[11px] font-semibold whitespace-nowrap">{post.category}</span>
                    </td>
                    <td className="px-6 py-4 text-zinc-500 whitespace-nowrap">{post.date}</td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3 text-zinc-500 text-xs">
                        <span>{post.comments || 0} comments</span>
                        <span>{post.likes || 0} likes</span>
                        <span className="text-zinc-400">{post.readTime || post.read_time}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => setModal(post)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(post.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
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

      {modal && <BlogPostModal post={modal === 'new' ? null : modal} onSave={handleSave} onClose={() => setModal(null)} />}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 size={22} className="text-red-500" />
            </div>
            <h3 className="text-lg font-bold mb-2">Delete Post?</h3>
            <p className="text-zinc-500 text-sm mb-6">This action cannot be undone.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
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
  const [modal, setModal] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [form, setForm] = useState({ label: '', href: '' });

  useEffect(() => {
    getNavLinks().then(setLinks);
  }, []);

  const openNew = () => { setForm({ label: '', href: '' }); setModal('new'); };
  const openEdit = (link) => { setForm({ label: link.label, href: link.href }); setModal(link); };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!form.label.trim() || !form.href.trim()) return;
    if (modal === 'new') {
      await addNavLink(form);
    } else {
      await updateNavLink(modal.id, form);
    }
    setLinks(await getNavLinks());
    setModal(null);
  };

  const handleToggle = async (link) => {
    await updateNavLink(link.id, { ...link, enabled: !link.enabled });
    setLinks(await getNavLinks());
  };

  const handleDelete = async (id) => {
    await deleteNavLink(id);
    setLinks(await getNavLinks());
    setDeleteConfirm(null);
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Home Menu</h1>
          <p className="text-zinc-500 text-sm">Manage which links appear in the navbar</p>
        </div>
        <button onClick={openNew} className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-zinc-800 transition-colors">
          <Plus size={16} /> Add Link
        </button>
      </div>

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
                      <button onClick={() => handleToggle(link)}
                        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors ${link.enabled ? 'bg-emerald-50 text-emerald-600 hover:bg-emerald-100' : 'bg-zinc-100 text-zinc-400 hover:bg-zinc-200'}`}>
                        {link.enabled ? <Eye size={13} /> : <EyeOff size={13} />}
                        {link.enabled ? 'Visible' : 'Hidden'}
                      </button>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <button onClick={() => openEdit(link)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-zinc-600 hover:bg-zinc-100 transition-colors">
                          <Pencil size={13} /> Edit
                        </button>
                        <button onClick={() => setDeleteConfirm(link.id)} className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-red-500 hover:bg-red-50 transition-colors">
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

      {modal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-zinc-100">
              <h2 className="text-lg font-bold">{modal === 'new' ? 'Add Nav Link' : 'Edit Nav Link'}</h2>
              <button onClick={() => setModal(null)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-zinc-100 transition-colors"><X size={18} /></button>
            </div>
            <form onSubmit={handleSave} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Label *</label>
                <input value={form.label} onChange={e => setForm({ ...form, label: e.target.value })} required placeholder="e.g. Courses"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all" />
              </div>
              <div>
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">URL / Path *</label>
                <input value={form.href} onChange={e => setForm({ ...form, href: e.target.value })} required placeholder="e.g. /courses"
                  className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 transition-all" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setModal(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-bold bg-black text-white hover:bg-zinc-800 transition-colors">{modal === 'new' ? 'Add Link' : 'Save Changes'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-lg font-bold mb-2">Remove Link?</h3>
            <p className="text-zinc-500 text-sm mb-6">This will remove the link from the navbar.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Remove</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Media Gallery Section ─────────────────────────────────────────────────────
function MediaGallerySection() {
  const [media, setMedia] = useState([]);
  const [filter, setFilter] = useState('all');
  const [uploading, setUploading] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const fileRef = useRef(null);

  const load = async () => {
    const category = filter === 'all' ? undefined : filter;
    setMedia(await fetchMedia(category));
  };

  useEffect(() => { load(); }, [filter]);

  const handleUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    try {
      await uploadMedia(Array.from(files));
      await load();
    } catch (err) {
      console.error('Upload failed:', err);
    }
    setUploading(false);
    if (fileRef.current) fileRef.current.value = '';
  };

  const handleDelete = async (id) => {
    await deleteMedia(id);
    await load();
    setDeleteConfirm(null);
  };

  const formatSize = (bytes) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">Media Gallery</h1>
          <p className="text-zinc-500 text-sm">Upload and manage photos & videos of children</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="relative">
            <select value={filter} onChange={e => setFilter(e.target.value)}
              className="pl-3 pr-8 py-2 border border-zinc-200 rounded-xl text-sm focus:outline-none bg-white appearance-none">
              <option value="all">All Media</option>
              <option value="photo">Photos</option>
              <option value="video">Videos</option>
            </select>
            <ChevronDown size={14} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" />
          </div>
          <label className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-colors cursor-pointer ${uploading ? 'bg-zinc-400 text-white' : 'bg-black text-white hover:bg-zinc-800'}`}>
            <Upload size={16} />
            {uploading ? 'Uploading...' : 'Upload Files'}
            <input ref={fileRef} type="file" multiple accept="image/*,video/*" onChange={handleUpload} className="hidden" disabled={uploading} />
          </label>
        </div>
      </div>

      {media.length === 0 ? (
        <div className="bg-white rounded-[2rem] border border-zinc-200 shadow-sm py-20 text-center">
          <Image size={48} className="mx-auto mb-3 text-zinc-300" />
          <p className="text-zinc-400 font-medium">No media uploaded yet.</p>
          <p className="text-zinc-300 text-sm mt-1">Upload photos and videos of children to display on the website.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {media.map(item => (
            <div key={item.id} className="bg-white rounded-2xl border border-zinc-200 overflow-hidden group relative">
              {item.category === 'video' ? (
                <div className="aspect-video bg-zinc-100 flex items-center justify-center relative">
                  <video src={getMediaUrl(item.url)} className="w-full h-full object-cover" />
                  <div className="absolute inset-0 flex items-center justify-center">
                    <Film size={32} className="text-white drop-shadow-lg" />
                  </div>
                </div>
              ) : (
                <div className="aspect-square bg-zinc-100">
                  <img src={getMediaUrl(item.url)} alt={item.alt_text || item.original_name} className="w-full h-full object-cover" />
                </div>
              )}
              <div className="p-3">
                <p className="text-xs font-semibold text-zinc-700 truncate">{item.original_name}</p>
                <div className="flex items-center justify-between mt-1">
                  <span className="text-[10px] text-zinc-400">{formatSize(item.size)}</span>
                  <button onClick={() => setDeleteConfirm(item.id)} className="text-red-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                </div>
              </div>
              <button
                onClick={() => { navigator.clipboard.writeText(getMediaUrl(item.url)); }}
                className="absolute top-2 right-2 bg-black/60 text-white text-[10px] px-2 py-1 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
              >
                Copy URL
              </button>
            </div>
          ))}
        </div>
      )}

      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl p-8 max-w-sm w-full text-center">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4"><Trash2 size={22} className="text-red-500" /></div>
            <h3 className="text-lg font-bold mb-2">Delete Media?</h3>
            <p className="text-zinc-500 text-sm mb-6">This will permanently delete the file.</p>
            <div className="flex gap-3 justify-center">
              <button onClick={() => setDeleteConfirm(null)} className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-500 hover:bg-zinc-100 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="px-5 py-2.5 rounded-xl text-sm font-bold bg-red-500 text-white hover:bg-red-600 transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

// ── Shared Editor Primitives ──────────────────────────────────────────────────
function Field({ label, value, onChange, type = 'input', multiline = false, placeholder = '' }) {
  return (
    <div>
      <label className="block text-sm font-semibold text-zinc-700 mb-1.5">{label}</label>
      {(type === 'textarea' || multiline) ? (
        <textarea value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder} rows={3}
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10 resize-none" />
      ) : (
        <input type={type === 'number' ? 'number' : 'text'} value={value ?? ''} onChange={e => onChange(e.target.value)} placeholder={placeholder}
          className="w-full px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
      )}
    </div>
  );
}

function SaveBtn({ onClick }) {
  const [saved, setSaved] = useState(false);
  const [saving, setSaving] = useState(false);
  const handle = async () => {
    setSaving(true);
    try { await onClick(); } catch {}
    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };
  return (
    <button onClick={handle} disabled={saving}
      className={`px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${saved ? 'bg-emerald-500 text-white' : saving ? 'bg-zinc-400 text-white' : 'bg-black text-white hover:bg-zinc-800'}`}>
      {saving ? 'Saving...' : saved ? 'Saved' : 'Save Changes'}
    </button>
  );
}

function EditorCard({ title, children, onDelete }) {
  return (
    <div className="bg-white rounded-[2rem] border border-zinc-200 p-8 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm uppercase tracking-widest text-zinc-400">{title}</h3>
        {onDelete && (
          <button onClick={onDelete} className="text-red-400 hover:text-red-600 transition-colors p-1 rounded-lg hover:bg-red-50">
            <Trash2 size={15} />
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function SectionHeader({ title, desc }) {
  return (
    <div className="mb-2">
      <h2 className="text-xl font-bold">{title}</h2>
      {desc && <p className="text-zinc-500 text-sm mt-1">{desc}</p>}
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

  const handleAdd = () => { const url = newUrl.trim(); if (!url) return; setVideos([...videos, url]); setPreviewUrl(url); setNewUrl(''); };

  return (
    <div className="space-y-6">
      <EditorCard title="Section Settings">
        <Field label="Section Title" value={title} onChange={setTitle} />
      </EditorCard>
      <EditorCard title="Video URLs (carousel)">
        <p className="text-xs text-zinc-400 bg-amber-50 border border-amber-100 rounded-xl px-4 py-3">
          <strong className="text-amber-700">Supported:</strong> YouTube links, Google Drive share links, or direct video URLs (.mp4, .webm). For Drive: make sure sharing is set to <strong>"Anyone with the link"</strong>.
        </p>
        <div className="space-y-2">
          {videos.map((url, i) => (
            <div key={i} className="flex items-center gap-3">
              <span className="w-6 h-6 bg-zinc-100 rounded-full flex items-center justify-center text-xs font-bold text-zinc-400 shrink-0">{i + 1}</span>
              <span className="flex-1 text-xs font-mono text-zinc-500 bg-zinc-50 px-3 py-2 rounded-xl truncate">{url}</span>
              <button onClick={() => setPreviewUrl(url)} className="text-xs text-zinc-400 hover:text-zinc-700 px-2 py-1 rounded-lg hover:bg-zinc-100 transition-colors shrink-0">Preview</button>
              <button onClick={() => setVideos(videos.filter((_, idx) => idx !== i))} className="text-red-400 hover:text-red-600 transition-colors shrink-0"><Trash2 size={15} /></button>
            </div>
          ))}
        </div>
        <div className="flex gap-3">
          <input value={newUrl} onChange={e => setNewUrl(e.target.value)} onKeyDown={e => e.key === 'Enter' && handleAdd()} placeholder="Paste direct .mp4 video URL..."
            className="flex-1 px-4 py-2.5 border border-zinc-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-black/10" />
          <button onClick={handleAdd} className="px-4 py-2.5 bg-zinc-900 text-white rounded-xl text-sm font-semibold hover:bg-black">Add</button>
        </div>
        {previewUrl && (
          <div className="mt-2">
            <p className="text-xs font-semibold text-zinc-500 mb-2">Preview:</p>
            <video key={previewUrl} src={previewUrl} controls className="w-full max-h-48 rounded-xl object-cover bg-zinc-100" />
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
      <EditorCard title="Section Settings"><Field label="Section Title" value={title} onChange={setTitle} /></EditorCard>
      <div className="flex items-center justify-between">
        <p className="font-semibold text-zinc-700">Testimonials ({items.length})</p>
        <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800"><Plus size={15} /> Add</button>
      </div>
      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-5 flex gap-4 items-start">
            <img src={item.avatar || 'https://i.pravatar.cc/150'} alt="" className="w-11 h-11 rounded-full object-cover shrink-0" referrerPolicy="no-referrer" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-zinc-900">{item.author} <span className="font-normal text-zinc-400">- {item.role}</span></p>
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
        <EditorCard key={item.id} title={`Card ${i + 1} - ${item.size === 'large' ? 'Wide' : 'Standard'}`}>
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
        <EditorCard key={i} title={`Gallery Card ${i + 1} - ${card.tag}`}>
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

// ── Stats Editor ─────────────────────────────────────────────────────────────
function StatsEditor({ data, onSave }) {
  const defaults = [
    { value: 5000, suffix: '+', label: 'Students Enrolled', color: 'text-brand-primary' },
    { value: 54, suffix: '+', label: 'Partner Schools', color: 'text-violet-500' },
    { value: 9, suffix: '', label: 'Courses Available', color: 'text-amber-500' },
    { value: 100, suffix: '%', label: 'Lab Uptime', color: 'text-emerald-500' },
  ];
  const [stats, setStats] = useState(data || defaults);
  const update = (i, key, val) => { const s = [...stats]; s[i] = { ...s[i], [key]: val }; setStats(s); };
  return (
    <div className="space-y-4">
      <SectionHeader title="Homepage Stats" desc="Edit the counter numbers shown on the homepage" />
      {stats.map((s, i) => (
        <EditorCard key={i} title={`Stat ${i + 1}`}>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Value" type="number" value={s.value} onChange={v => update(i, 'value', parseInt(v) || 0)} />
            <Field label="Suffix" value={s.suffix} onChange={v => update(i, 'suffix', v)} placeholder="+ or %" />
            <Field label="Label" value={s.label} onChange={v => update(i, 'label', v)} />
          </div>
        </EditorCard>
      ))}
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(stats)} /></div>
    </div>
  );
}

// ── Partner Schools Editor ───────────────────────────────────────────────────
function PartnerSchoolsEditor({ data, onSave }) {
  const [schools, setSchools] = useState(data || []);
  const update = (i, key, val) => { const s = [...schools]; s[i] = { ...s[i], [key]: val }; setSchools(s); };
  const add = () => setSchools([...schools, { name: '', city: '' }]);
  const remove = (i) => setSchools(schools.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Partner Schools" desc="Schools shown in the scrolling marquee" />
      {schools.map((s, i) => (
        <EditorCard key={i} title={s.name || `School ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="School Name" value={s.name} onChange={v => update(i, 'name', v)} />
            <Field label="City" value={s.city} onChange={v => update(i, 'city', v)} />
          </div>
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add School</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(schools)} /></div>
    </div>
  );
}

// ── Mentors Editor ───────────────────────────────────────────────────────────
function MentorsEditor({ data, onSave }) {
  const [mentors, setMentors] = useState(data || []);
  const update = (i, key, val) => { const s = [...mentors]; s[i] = { ...s[i], [key]: val }; setMentors(s); };
  const add = () => setMentors([...mentors, { name: '', role: '', exp: '', avatar: '', tags: [] }]);
  const remove = (i) => setMentors(mentors.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Mentors" desc="Team members shown in Meet the Mentors section" />
      {mentors.map((m, i) => (
        <EditorCard key={i} title={m.name || `Mentor ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" value={m.name} onChange={v => update(i, 'name', v)} />
            <Field label="Role" value={m.role} onChange={v => update(i, 'role', v)} />
            <Field label="Experience" value={m.exp} onChange={v => update(i, 'exp', v)} placeholder="6 years at Google" />
            <Field label="Avatar URL" value={m.avatar} onChange={v => update(i, 'avatar', v)} />
          </div>
          <Field label="Tags (comma-separated)" value={(m.tags || []).join(', ')} onChange={v => update(i, 'tags', v.split(',').map(t => t.trim()).filter(Boolean))} placeholder="Python, TensorFlow, LLMs" />
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Mentor</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(mentors)} /></div>
    </div>
  );
}

// ── FAQs Editor ──────────────────────────────────────────────────────────────
function FAQsEditor({ data, onSave }) {
  const [faqs, setFaqs] = useState(data || []);
  const update = (i, key, val) => { const s = [...faqs]; s[i] = { ...s[i], [key]: val }; setFaqs(s); };
  const add = () => setFaqs([...faqs, { q: '', a: '' }]);
  const remove = (i) => setFaqs(faqs.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="FAQs" desc="Frequently Asked Questions shown on the homepage" />
      {faqs.map((f, i) => (
        <EditorCard key={i} title={f.q || `FAQ ${i + 1}`} onDelete={() => remove(i)}>
          <Field label="Question" value={f.q} onChange={v => update(i, 'q', v)} />
          <Field label="Answer" value={f.a} onChange={v => update(i, 'a', v)} multiline />
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add FAQ</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(faqs)} /></div>
    </div>
  );
}

// ── Tech Stack Editor ────────────────────────────────────────────────────────
function TechStackEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { icon: '', name: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Tech Stack" desc="Technologies shown at the bottom of the homepage" />
      {items.map((t, i) => (
        <EditorCard key={i} title={t.name || `Tech ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Emoji Icon" value={t.icon} onChange={v => update(i, 'icon', v)} placeholder="🐍" />
            <Field label="Name" value={t.name} onChange={v => update(i, 'name', v)} placeholder="Python" />
          </div>
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Tech</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── Student Gallery Editor ───────────────────────────────────────────────────
function StudentGalleryEditor({ data, onSave }) {
  const [students, setStudents] = useState(data || []);
  const update = (i, key, val) => { const s = [...students]; s[i] = { ...s[i], [key]: val }; setStudents(s); };
  const add = () => setStudents([...students, { name: '', grade: '', school: '', subject: '', project: '', quote: '', achievement: '', emoji: '' }]);
  const remove = (i) => setStudents(students.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Student Gallery" desc="Student success stories shown on the homepage" />
      {students.map((s, i) => (
        <EditorCard key={i} title={s.name || `Student ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" value={s.name} onChange={v => update(i, 'name', v)} />
            <Field label="Grade" value={s.grade} onChange={v => update(i, 'grade', v)} placeholder="Grade 8" />
            <Field label="School" value={s.school} onChange={v => update(i, 'school', v)} />
            <Field label="Subject" value={s.subject} onChange={v => update(i, 'subject', v)} />
          </div>
          <Field label="Project" value={s.project} onChange={v => update(i, 'project', v)} />
          <Field label="Quote" value={s.quote} onChange={v => update(i, 'quote', v)} multiline />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Achievement" value={s.achievement} onChange={v => update(i, 'achievement', v)} />
            <Field label="Emoji" value={s.emoji} onChange={v => update(i, 'emoji', v)} placeholder="🤖" />
          </div>
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Student</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(students)} /></div>
    </div>
  );
}

// ── Lab Cards Editor ─────────────────────────────────────────────────────────
function LabCardsEditor({ data, onSave }) {
  const [cards, setCards] = useState(data || []);
  const update = (i, key, val) => { const s = [...cards]; s[i] = { ...s[i], [key]: val }; setCards(s); };
  const add = () => setCards([...cards, { title: '', desc: '', gradient: 'from-blue-500 to-indigo-600', iconName: 'Code' }]);
  const remove = (i) => setCards(cards.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Lab Cards" desc="Icon cards shown in the Life at Amara Nexa carousel" />
      {cards.map((c, i) => (
        <EditorCard key={i} title={c.title || `Card ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Title" value={c.title} onChange={v => update(i, 'title', v)} />
            <Field label="Description" value={c.desc} onChange={v => update(i, 'desc', v)} />
            <Field label="Icon Name" value={c.iconName} onChange={v => update(i, 'iconName', v)} placeholder="Code, Bot, BrainCircuit..." />
            <Field label="Gradient" value={c.gradient} onChange={v => update(i, 'gradient', v)} placeholder="from-blue-500 to-indigo-600" />
          </div>
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Card</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(cards)} /></div>
    </div>
  );
}

// ── Blog Categories Editor ───────────────────────────────────────────────────
function BlogCategoriesEditor({ data, onSave }) {
  const [cats, setCats] = useState((data || []).join('\n'));
  return (
    <div className="space-y-4">
      <SectionHeader title="Blog Categories" desc="Category filters shown on the blog page (one per line)" />
      <textarea value={cats} onChange={e => setCats(e.target.value)} rows={10} className="w-full px-4 py-3 border border-zinc-200 rounded-xl bg-white focus:ring-2 focus:ring-black/5 focus:border-zinc-400 transition-colors font-mono text-sm" />
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(cats.split('\n').map(c => c.trim()).filter(Boolean))} /></div>
    </div>
  );
}

// ── Announcement Bar Editor ──────────────────────────────────────────────────
function AnnouncementEditor({ data, onSave }) {
  const defaults = { enabled: true, text: 'Limited school partnerships open for 2026 —', linkText: 'Reserve your slot →' };
  const [form, setForm] = useState(data || defaults);
  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));
  return (
    <div className="space-y-4">
      <SectionHeader title="Announcement Bar" desc="The gradient bar shown above the navbar" />
      <EditorCard title="Announcement Settings">
        <div className="flex items-center gap-3 mb-2">
          <label className="relative inline-flex items-center cursor-pointer">
            <input type="checkbox" checked={!!form.enabled} onChange={e => set('enabled', e.target.checked)} className="sr-only peer" />
            <div className="w-11 h-6 bg-zinc-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-zinc-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-black" />
          </label>
          <span className="text-sm font-semibold text-zinc-700">{form.enabled ? 'Visible' : 'Hidden'}</span>
        </div>
        <Field label="Announcement Text" value={form.text} onChange={v => set('text', v)} placeholder="Limited school partnerships open for 2026 —" />
        <Field label="Link Text (click opens enrollment form)" value={form.linkText} onChange={v => set('linkText', v)} placeholder="Reserve your slot →" />
      </EditorCard>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(form)} /></div>
    </div>
  );
}

// ── Camp Stats Editor ─────────────────────────────────────────────────────────
function CampStatsEditor({ data, onSave }) {
  const [stats, setStats] = useState(data || []);
  const update = (i, key, val) => { const s = [...stats]; s[i] = { ...s[i], [key]: val }; setStats(s); };
  return (
    <div className="space-y-4">
      <SectionHeader title="Camp Stats" desc="The 4 counter stats shown at the top of the Summer Camps page" />
      {stats.map((s, i) => (
        <EditorCard key={i} title={`Stat ${i + 1}`}>
          <div className="grid grid-cols-3 gap-4">
            <Field label="Value" type="number" value={s.value} onChange={v => update(i, 'value', parseInt(v) || 0)} />
            <Field label="Suffix" value={s.suffix} onChange={v => update(i, 'suffix', v)} placeholder="+ or %" />
            <Field label="Label" value={s.label} onChange={v => update(i, 'label', v)} />
          </div>
        </EditorCard>
      ))}
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(stats)} /></div>
    </div>
  );
}

// ── Video Testimonials Editor (Summer Camps) ──────────────────────────────────
function VideoTestimonialsEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { name: '', role: '', quote: '', avatar: '', thumb: '', video: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Video Testimonials" desc="Testimonial cards shown in the Stories section of Summer Camps" />
      {items.map((t, i) => (
        <EditorCard key={i} title={t.name || `Testimonial ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" value={t.name} onChange={v => update(i, 'name', v)} />
            <Field label="Role" value={t.role} onChange={v => update(i, 'role', v)} placeholder="Student, Grade 9" />
          </div>
          <Field label="Quote" value={t.quote} onChange={v => update(i, 'quote', v)} multiline />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Avatar URL" value={t.avatar} onChange={v => update(i, 'avatar', v)} placeholder="https://images.unsplash.com/..." />
            <Field label="Thumbnail URL" value={t.thumb} onChange={v => update(i, 'thumb', v)} placeholder="https://images.unsplash.com/..." />
          </div>
          {t.avatar && <img src={t.avatar} alt="" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />}
          <Field label="Video URL (embed)" value={t.video} onChange={v => update(i, 'video', v)} placeholder="https://www.youtube.com/embed/..." />
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Testimonial</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── Advantages Editor (Summer Camps) ──────────────────────────────────────────
function AdvantagesEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { title: '', desc: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Advantages" desc="Why choose us cards shown on Summer Camps page" />
      {items.map((adv, i) => (
        <EditorCard key={i} title={adv.title || `Advantage ${i + 1}`} onDelete={() => remove(i)}>
          <Field label="Title" value={adv.title} onChange={v => update(i, 'title', v)} />
          <Field label="Description" value={adv.desc} onChange={v => update(i, 'desc', v)} multiline />
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Advantage</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── How It Works Editor (Schools) ─────────────────────────────────────────────
function HowItWorksEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { emoji: '', title: '', desc: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="How It Works" desc="The 3-step process shown on the Schools page" />
      {items.map((step, i) => (
        <EditorCard key={i} title={step.title || `Step ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Emoji" value={step.emoji} onChange={v => update(i, 'emoji', v)} placeholder="🤝" />
            <Field label="Title" value={step.title} onChange={v => update(i, 'title', v)} />
          </div>
          <Field label="Description" value={step.desc} onChange={v => update(i, 'desc', v)} multiline />
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Step</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── Success Stories Editor (Schools) ──────────────────────────────────────────
function SuccessStoriesEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { school: '', location: '', students: '', image: '', video: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Success Stories" desc="School transformation cards shown on the Schools page" />
      {items.map((s, i) => (
        <EditorCard key={i} title={s.school || `Story ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="School Name" value={s.school} onChange={v => update(i, 'school', v)} />
            <Field label="Location" value={s.location} onChange={v => update(i, 'location', v)} placeholder="Hyderabad" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Students Count" value={s.students} onChange={v => update(i, 'students', v)} placeholder="500+" />
            <Field label="Video URL" value={s.video} onChange={v => update(i, 'video', v)} placeholder="https://www.youtube.com/..." />
          </div>
          <Field label="Image URL" value={s.image} onChange={v => update(i, 'image', v)} placeholder="https://images.unsplash.com/..." />
          {s.image && <img src={s.image} alt="" className="h-28 w-full rounded-xl object-cover" referrerPolicy="no-referrer" />}
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Story</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── School Testimonials Editor ────────────────────────────────────────────────
function SchoolTestimonialsEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { name: '', role: '', quote: '', image: '', video: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="School Testimonials" desc="Principal and coordinator testimonials on the Schools page" />
      {items.map((t, i) => (
        <EditorCard key={i} title={t.name || `Testimonial ${i + 1}`} onDelete={() => remove(i)}>
          <div className="grid grid-cols-2 gap-4">
            <Field label="Name" value={t.name} onChange={v => update(i, 'name', v)} />
            <Field label="Role" value={t.role} onChange={v => update(i, 'role', v)} placeholder="Principal, DPS Hyderabad" />
          </div>
          <Field label="Quote" value={t.quote} onChange={v => update(i, 'quote', v)} multiline />
          <div className="grid grid-cols-2 gap-4">
            <Field label="Image URL" value={t.image} onChange={v => update(i, 'image', v)} placeholder="https://i.pravatar.cc/150?u=..." />
            <Field label="Video URL" value={t.video} onChange={v => update(i, 'video', v)} placeholder="https://www.youtube.com/..." />
          </div>
          {t.image && <img src={t.image} alt="" className="w-12 h-12 rounded-full object-cover" referrerPolicy="no-referrer" />}
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Testimonial</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── Services Dropdown Editor (Schools) ────────────────────────────────────────
function ServicesDropdownEditor({ data, onSave }) {
  const [items, setItems] = useState(data || []);
  const update = (i, key, val) => { const s = [...items]; s[i] = { ...s[i], [key]: val }; setItems(s); };
  const add = () => setItems([...items, { label: '', desc: '' }]);
  const remove = (i) => setItems(items.filter((_, j) => j !== i));
  return (
    <div className="space-y-4">
      <SectionHeader title="Services Dropdown" desc="Items shown in the Services nav dropdown on the Schools page" />
      {items.map((item, i) => (
        <EditorCard key={i} title={item.label || `Service ${i + 1}`} onDelete={() => remove(i)}>
          <Field label="Label" value={item.label} onChange={v => update(i, 'label', v)} placeholder="National Competitions" />
          <Field label="Description" value={item.desc} onChange={v => update(i, 'desc', v)} placeholder="Inter-school tech fests & robotics challenges" />
        </EditorCard>
      ))}
      <button onClick={add} className="w-full py-3 border-2 border-dashed border-zinc-300 rounded-xl text-zinc-500 font-semibold hover:border-zinc-400 hover:text-zinc-700 transition-colors">+ Add Service</button>
      <div className="flex justify-end"><SaveBtn onClick={() => onSave(items)} /></div>
    </div>
  );
}

// ── Blog Page Section ─────────────────────────────────────────────────────────
function BlogPageSection() {
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPagesContent().then(p => { setContent(p.blog || {}); setLoading(false); });
  }, []);

  const save = async (data) => {
    const updated = await updatePage('blog', data);
    setContent(updated.blog || {});
  };

  if (loading || !content) return <div className="text-zinc-400 py-20 text-center">Loading blog settings...</div>;

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Blog Page</h1><p className="text-zinc-500 text-sm">Edit categories shown on /blog</p></div>
      </div>
      <BlogCategoriesEditor data={content.categories} onSave={cats => save({ ...content, categories: cats })} />
    </>
  );
}

// ── Homepage Section ──────────────────────────────────────────────────────────
function HomepageSection() {
  const [activeTab, setActiveTab] = useState('hero');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeContent().then(c => { setContent(c); setLoading(false); });
  }, []);

  const handleSave = async (section, data) => {
    const updated = await updateHomeSection(section, data);
    setContent(updated);
  };

  const TABS = [
    { id: 'announcement', label: 'Announcement Bar' },
    { id: 'hero', label: 'Hero' },
    { id: 'videos', label: 'Life at Amara' },
    { id: 'labcards', label: 'Lab Cards' },
    { id: 'testimonials', label: 'Testimonials' },
    { id: 'perks', label: 'Perks' },
    { id: 'students', label: 'Students' },
    { id: 'schools', label: 'Partner Schools' },
    { id: 'techstack', label: 'Tech Stack' },
    { id: 'faqs', label: 'FAQs' },
    { id: 'cta', label: 'CTA' },
  ];

  if (loading || !content) return <div className="text-zinc-400 py-20 text-center">Loading home content...</div>;

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
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:text-zinc-800 hover:bg-zinc-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>
      {activeTab === 'announcement' && <AnnouncementEditor data={content.announcement} onSave={d => handleSave('announcement', d)} />}
      {activeTab === 'hero' && <HeroEditor data={content.hero} onSave={d => handleSave('hero', d)} />}
      {activeTab === 'videos' && <VideosEditor data={content.lifeSection} onSave={d => handleSave('lifeSection', d)} />}
      {activeTab === 'labcards' && <LabCardsEditor data={content.labCards} onSave={d => handleSave('labCards', d)} />}
      {activeTab === 'testimonials' && <TestimonialsEditor data={content.testimonials} onSave={d => handleSave('testimonials', d)} />}
      {activeTab === 'perks' && <PerksEditor data={content.perks} onSave={d => handleSave('perks', d)} />}
      {activeTab === 'students' && <StudentGalleryEditor data={content.studentGallery} onSave={d => handleSave('studentGallery', d)} />}
      {activeTab === 'schools' && <PartnerSchoolsEditor data={content.partnerSchools} onSave={d => handleSave('partnerSchools', d)} />}
      {activeTab === 'techstack' && <TechStackEditor data={content.techStack} onSave={d => handleSave('techStack', d)} />}
      {activeTab === 'faqs' && <FAQsEditor data={content.faqs} onSave={d => handleSave('faqs', d)} />}
      {activeTab === 'cta' && <CTAEditor data={content.cta} onSave={d => handleSave('cta', d)} />}
    </>
  );
}

// ── Courses Page Section ──────────────────────────────────────────────────────
function CoursesPageSection() {
  const [activeTab, setActiveTab] = useState('header');
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({ title: '', image: '', desc: '' });

  useEffect(() => {
    getPagesContent().then(p => { setContent(p.courses); setLoading(false); });
  }, []);

  const save = async (data) => {
    const updated = await updatePage('courses', data);
    setContent(updated.courses);
  };

  const openAdd = () => { setForm({ title: '', image: '', desc: '' }); setModal('new'); };
  const openEdit = (item) => { setForm({ title: item.title, image: item.image, desc: item.desc }); setModal(item); };

  const handleCardSave = async (e) => {
    e.preventDefault();
    let items;
    if (modal === 'new') items = [...content.items, { ...form, id: Date.now() }];
    else items = content.items.map(it => it.id === modal.id ? { ...it, ...form } : it);
    await save({ ...content, items });
    setModal(null);
  };

  if (loading || !content) return <div className="text-zinc-400 py-20 text-center">Loading courses...</div>;

  const TABS = [{ id: 'header', label: 'Header' }, { id: 'cards', label: 'Course Cards' }];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Courses Page</h1><p className="text-zinc-500 text-sm">Edit content shown on /courses</p></div>
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
            <button onClick={openAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800"><Plus size={15} /> Add Course</button>
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
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPagesContent().then(p => { setContent(p.schools); setLoading(false); });
  }, []);

  const save = async (data) => {
    const updated = await updatePage('schools', data);
    setContent(updated.schools);
  };

  if (loading || !content) return <div className="text-zinc-400 py-20 text-center">Loading schools...</div>;

  const TABS = [
    { id: 'hero', label: 'Hero' },
    { id: 'howitworks', label: 'How It Works' },
    { id: 'labs', label: 'Labs' },
    { id: 'successstories', label: 'Success Stories' },
    { id: 'schooltestimonials', label: 'Testimonials' },
    { id: 'products', label: 'Products' },
    { id: 'services', label: 'Services' },
    { id: 'servicesdropdown', label: 'Services Dropdown' },
    { id: 'contact', label: 'Contact' },
  ];

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Schools Page</h1><p className="text-zinc-500 text-sm">Edit content shown on /schools</p></div>
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'howitworks' && (
        <HowItWorksEditor data={content.howItWorks} onSave={d => save({ ...content, howItWorks: d })} />
      )}

      {activeTab === 'successstories' && (
        <SuccessStoriesEditor data={content.successStories} onSave={d => save({ ...content, successStories: d })} />
      )}

      {activeTab === 'schooltestimonials' && (
        <SchoolTestimonialsEditor data={content.schoolTestimonials} onSave={d => save({ ...content, schoolTestimonials: d })} />
      )}

      {activeTab === 'servicesdropdown' && (
        <ServicesDropdownEditor data={content.servicesDropdown} onSave={d => save({ ...content, servicesDropdown: d })} />
      )}

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
            <Field label="Social Proof Text" value={content.socialProofHeadline} onChange={v => setContent(c => ({ ...c, socialProofHeadline: v }))} />
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
  const [content, setContent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(null);
  const [form, setForm] = useState({});

  useEffect(() => {
    getPagesContent().then(p => { setContent(p.summerCamps); setLoading(false); });
  }, []);

  const save = async (data) => {
    const updated = await updatePage('summerCamps', data);
    setContent(updated.summerCamps);
  };

  if (loading || !content) return <div className="text-zinc-400 py-20 text-center">Loading summer camps...</div>;

  const TABS = [
    { id: 'camps', label: 'Camps' },
    { id: 'campstats', label: 'Camp Stats' },
    { id: 'advantages', label: 'Advantages' },
    { id: 'videotestimonials', label: 'Video Testimonials' },
    { id: 'benefits', label: 'Benefits' },
    { id: 'testimonials', label: 'Testimonials' },
  ];

  const openCampAdd = () => { setForm({ category: '', title: 'SUMMER CAMP', grades: '', details: '', startDate: '', image: '' }); setModal('camp-new'); };
  const openCampEdit = (camp) => { setForm({ ...camp, details: (camp.details ?? []).join(', ') }); setModal({ type: 'camp', item: camp }); };
  const saveCamp = async (e) => {
    e.preventDefault();
    const campData = { ...form, details: form.details.split(',').map(d => d.trim()).filter(Boolean) };
    let camps;
    if (modal === 'camp-new') camps = [...content.camps, { ...campData, id: Date.now() }];
    else camps = content.camps.map(c => c.id === modal.item.id ? { ...c, ...campData } : c);
    await save({ ...content, camps });
    setModal(null);
  };

  const openBenefitAdd = () => { setForm({ title: '', desc: '' }); setModal('benefit-new'); };
  const openBenefitEdit = (b) => { setForm({ title: b.title, desc: b.desc }); setModal({ type: 'benefit', item: b }); };
  const saveBenefit = async (e) => {
    e.preventDefault();
    let benefits;
    if (modal === 'benefit-new') benefits = [...content.benefits, { ...form, id: Date.now() }];
    else benefits = content.benefits.map(b => b.id === modal.item.id ? { ...b, ...form } : b);
    await save({ ...content, benefits });
    setModal(null);
  };

  const openTestimonialAdd = () => { setForm({ name: '', role: '', content: '', rating: 5 }); setModal('testimonial-new'); };
  const openTestimonialEdit = (t) => { setForm({ name: t.name, role: t.role, content: t.content, rating: t.rating }); setModal({ type: 'testimonial', item: t }); };
  const saveTestimonial = async (e) => {
    e.preventDefault();
    let testimonials;
    if (modal === 'testimonial-new') testimonials = [...content.testimonials, { ...form, id: Date.now(), rating: Number(form.rating) }];
    else testimonials = content.testimonials.map(t => t.id === modal.item.id ? { ...t, ...form, rating: Number(form.rating) } : t);
    await save({ ...content, testimonials });
    setModal(null);
  };

  const isCampModal = modal === 'camp-new' || (modal && modal.type === 'camp');
  const isBenefitModal = modal === 'benefit-new' || (modal && modal.type === 'benefit');
  const isTestimonialModal = modal === 'testimonial-new' || (modal && modal.type === 'testimonial');

  return (
    <>
      <div className="flex items-center justify-between mb-8">
        <div><h1 className="text-2xl font-bold">Summer Camps Page</h1><p className="text-zinc-500 text-sm">Edit content shown on /summer-camps</p></div>
      </div>
      <div className="flex gap-2 mb-8 flex-wrap">
        {TABS.map(tab => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${activeTab === tab.id ? 'bg-black text-white' : 'bg-white border border-zinc-200 text-zinc-500 hover:bg-zinc-50'}`}>
            {tab.label}
          </button>
        ))}
      </div>

      {activeTab === 'campstats' && (
        <CampStatsEditor data={content.campStats} onSave={d => save({ ...content, campStats: d })} />
      )}

      {activeTab === 'advantages' && (
        <AdvantagesEditor data={content.advantages} onSave={d => save({ ...content, advantages: d })} />
      )}

      {activeTab === 'videotestimonials' && (
        <VideoTestimonialsEditor data={content.videoTestimonials} onSave={d => save({ ...content, videoTestimonials: d })} />
      )}

      {activeTab === 'camps' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <p className="font-semibold text-zinc-700">Camps ({content.camps.length})</p>
            <button onClick={openCampAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800"><Plus size={15} /> Add Camp</button>
          </div>
          <div className="space-y-3">
            {content.camps.map(camp => (
              <div key={camp.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-5 flex gap-4 items-start">
                {camp.image && <img src={camp.image} alt="" className="w-20 h-16 rounded-xl object-cover shrink-0" referrerPolicy="no-referrer" />}
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900">{camp.category} - {camp.title}</p>
                  <p className="text-xs text-zinc-400 mt-1">Grade {camp.grades} - Starts {camp.startDate}</p>
                  <p className="text-xs text-zinc-400">{(camp.details ?? []).join(' - ')}</p>
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
            <button onClick={openBenefitAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800"><Plus size={15} /> Add</button>
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
            <button onClick={openTestimonialAdd} className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded-xl text-sm font-bold hover:bg-zinc-800"><Plus size={15} /> Add</button>
          </div>
          <div className="space-y-3">
            {content.testimonials.map(t => (
              <div key={t.id} className="bg-white rounded-[1.5rem] border border-zinc-200 p-4 flex gap-4 items-start">
                <div className="w-10 h-10 rounded-full bg-zinc-100 flex items-center justify-center font-bold text-zinc-600 shrink-0">{t.name[0]}</div>
                <div className="flex-1 min-w-0">
                  <p className="font-bold text-zinc-900 text-sm">{t.name} <span className="font-normal text-zinc-400">- {t.role}</span></p>
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
                <label className="block text-sm font-semibold text-zinc-700 mb-1.5">Rating (1-5)</label>
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
  const [authed, setAuthed] = useState(false);
  const [checking, setChecking] = useState(true);
  const [activeSection, setActiveSection] = useState('dashboard');

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { setChecking(false); return; }
    verifyToken().then(ok => {
      setAuthed(ok);
      setChecking(false);
    }).catch(() => setChecking(false));
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_username');
    setAuthed(false);
  };

  if (checking) return (
    <div className="min-h-screen flex items-center justify-center bg-zinc-50">
      <div className="animate-pulse text-zinc-400">Checking authentication...</div>
    </div>
  );

  if (!authed) return <LoginScreen onLogin={() => setAuthed(true)} />;

  return (
    <div className="flex min-h-screen bg-zinc-50">
      <aside className="w-64 bg-white border-r border-zinc-200 p-6 hidden lg:flex flex-col">
        <div className="flex items-center gap-2 mb-10">
          <div className="bg-black text-white p-1.5 rounded-lg"><LayoutDashboard size={20} /></div>
          <span className="font-bold text-lg">Admin Panel</span>
        </div>

        <nav className="space-y-1 flex-1">
          {NAV_ITEMS.map((item) => (
            <button key={item.id} onClick={() => setActiveSection(item.id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors ${activeSection === item.id ? 'bg-black text-white' : 'text-zinc-500 hover:bg-zinc-100'}`}>
              <item.icon size={18} />
              {item.label}
            </button>
          ))}
        </nav>

        <button onClick={handleLogout}
          className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors mt-4">
          <LogOut size={18} /> Logout
        </button>
      </aside>

      <main className="flex-1 p-8 overflow-auto">
        {activeSection === 'dashboard' && <DashboardSection />}
        {activeSection === 'homepage' && <HomepageSection />}
        {activeSection === 'homemenu' && <HomeMenuSection />}
        {activeSection === 'coursespage' && <CoursesPageSection />}
        {activeSection === 'schoolspage' && <SchoolsPageSection />}
        {activeSection === 'summerpage' && <SummerCampsPageSection />}
        {activeSection === 'blog' && <BlogSection />}
        {activeSection === 'blogpage' && <BlogPageSection />}
        {activeSection === 'media' && <MediaGallerySection />}
      </main>
    </div>
  );
};
