import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Cpu, Sparkles, BrainCircuit, Quote, X, Star, Trophy, Zap, Play, Code, Bot, Monitor, Gamepad2, Lightbulb, Rocket } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { getHomeContent, getHomeContentSync } from '../utils/homeStore';

const ICON_MAP = { Code, Bot, BrainCircuit, Gamepad2, Lightbulb, Monitor, Cpu, Rocket, Zap, Star, Trophy, Play };
const getIcon = (name) => ICON_MAP[name] || Code;

const LAB_CARDS = [
  { title: 'Coding Lab', desc: 'Students writing real code', gradient: 'from-blue-500 to-indigo-600', icon: <Code size={36} className="text-white" /> },
  { title: 'Robotics', desc: 'Building & programming robots', gradient: 'from-emerald-500 to-teal-600', icon: <Bot size={36} className="text-white" /> },
  { title: 'AI Projects', desc: 'Training neural networks', gradient: 'from-violet-500 to-purple-600', icon: <BrainCircuit size={36} className="text-white" /> },
  { title: 'Game Dev', desc: 'Creating interactive games', gradient: 'from-orange-500 to-red-500', icon: <Gamepad2 size={36} className="text-white" /> },
  { title: 'Innovation', desc: 'Solving real-world problems', gradient: 'from-amber-500 to-yellow-600', icon: <Lightbulb size={36} className="text-white" /> },
  { title: 'Tech Office', desc: 'Professional lab setup', gradient: 'from-cyan-500 to-blue-600', icon: <Monitor size={36} className="text-white" /> },
];

const FALLBACK_GRADIENTS = [
  'from-brand-primary/30 to-brand-secondary/20',
  'from-brand-secondary/30 to-brand-accent/20',
  'from-brand-accent/30 to-brand-primary/20',
  'from-emerald-400/30 to-brand-primary/20',
  'from-brand-primary/20 to-emerald-400/30',
  'from-slate-400/20 to-brand-secondary/30',
];

const TYPEWRITER_WORDS = ['Robotics', 'Artificial Intelligence', 'Game Development', 'Web Development', 'Cyber Security', 'Data Science'];

const HERO_ROTATING_WORDS = ['CREATORS.', 'INNOVATORS.', 'ENGINEERS.', 'LEADERS.', 'BUILDERS.'];

const TECH_STACK = [
  { icon: '🐍', name: 'Python' }, { icon: '⚛️', name: 'React' }, { icon: '🤖', name: 'TensorFlow' },
  { icon: '📱', name: 'Flutter' }, { icon: '🎮', name: 'Unity' }, { icon: '⚡', name: 'JavaScript' },
  { icon: '🌐', name: 'HTML & CSS' }, { icon: '🔌', name: 'Arduino' }, { icon: '🗄️', name: 'SQL' },
  { icon: '🎨', name: 'Figma' }, { icon: '📊', name: 'Data Science' }, { icon: '🔒', name: 'Cyber Security' },
];


const PARTNER_SCHOOLS = [
  { name: 'St. Xavier High School', city: 'Mumbai' }, { name: 'DPS North Campus', city: 'Delhi' },
  { name: 'Greenwood International', city: 'Bangalore' }, { name: 'Oakridge Academy', city: 'Hyderabad' },
  { name: 'Ryan International', city: 'Pune' }, { name: 'Kendriya Vidyalaya', city: 'Chennai' },
  { name: 'Silver Oaks School', city: 'Vizag' }, { name: 'Narayana e-Techno', city: 'Vijayawada' },
];

const GALLERY_STUDENTS = [
  {
    name: 'Aarav Sharma', grade: 'Grade 8', school: 'DPS North Campus, Delhi',
    subject: 'AI & Python', project: 'Built a Gemini-powered chatbot',
    quote: 'I never thought I could build real AI until I joined Amara Nexa. Now I teach my friends!',
    achievement: 'Top Performer · Oct 2024',
    gradient: 'linear-gradient(135deg,#7c3aed,#3b82f6)',
    glow: 'rgba(124,58,237,0.5)', emoji: '🤖', size: 180, offset: -20,
  },
  {
    name: 'Priya Reddy', grade: 'Grade 10', school: 'Oakridge Academy, Hyderabad',
    subject: 'Web Development', project: 'Launched her own portfolio website',
    quote: 'I built my first website in Week 3. My parents were speechless — it was live on the internet!',
    achievement: 'Student of the Month',
    gradient: 'conic-gradient(from 0deg,#F48C36,#FBBF24,#10b981,#3b82f6,#F48C36)',
    glow: 'rgba(244,140,54,0.6)', emoji: '🌐', size: 280, offset: 0, spinning: true,
  },
  {
    name: 'Rohan Menon', grade: 'Grade 9', school: 'Greenwood International, Bangalore',
    subject: 'Game Development', project: 'Created a 2D platformer game in Unity',
    quote: 'My game has 200+ plays on itch.io. I made that in just 6 weeks — unbelievable.',
    achievement: '200+ Game Downloads',
    gradient: 'linear-gradient(135deg,#10b981,#06b6d4)',
    glow: 'rgba(16,185,129,0.5)', emoji: '🎮', size: 200, offset: -35,
  },
  {
    name: 'Sneha Kapoor', grade: 'Grade 7', school: 'Ryan International, Pune',
    subject: 'Robotics', project: 'Programmed an Arduino obstacle-avoiding robot',
    quote: 'My robot actually moves on its own now. I coded it myself using sensors and Arduino!',
    achievement: 'Science Fair 1st Place',
    gradient: 'linear-gradient(135deg,#f59e0b,#ef4444)',
    glow: 'rgba(245,158,11,0.5)', emoji: '🤝', size: 160, offset: -10,
  },
];

function StudentModal({ student, image, onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.85, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.85, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md rounded-[2.5rem] overflow-hidden shadow-2xl"
        style={{ background: 'linear-gradient(135deg,#0a0f1a,#1a1040)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Glow bg blob */}
        <div className="absolute inset-0 opacity-30 pointer-events-none" style={{ background: student.gradient.startsWith('conic') ? 'radial-gradient(circle at 50% 0%,#F48C36,transparent 60%)' : `radial-gradient(circle at 50% 0%,${student.glow},transparent 60%)` }} />

        {/* Close */}
        <button onClick={onClose} className="absolute top-5 right-5 z-10 w-9 h-9 rounded-full bg-white/10 border border-white/20 flex items-center justify-center hover:bg-white/20 transition-colors">
          <X size={16} color="white" />
        </button>

        {/* Top image section */}
        <div className="pt-10 pb-6 flex flex-col items-center gap-4 px-6">
          <div className="relative">
            <div className="absolute inset-0 rounded-full blur-xl opacity-60" style={{ background: student.gradient.startsWith('conic') ? '#F48C36' : student.glow }} />
            <div className="relative w-28 h-28 rounded-full border-4 border-white/20 overflow-hidden shadow-2xl">
              <img src={image} alt={student.name} className="w-full h-full object-cover" />
            </div>
            <div className="absolute -bottom-2 -right-2 w-9 h-9 rounded-full border-4 flex items-center justify-center text-base shadow-lg" style={{ background: student.gradient.startsWith('conic') ? '#F48C36' : student.glow, borderColor: '#0f172a' }}>
              {student.emoji}
            </div>
          </div>
          <div className="text-center">
            <h3 className="text-2xl font-black text-white">{student.name}</h3>
            <p className="text-white/50 text-sm mt-0.5">{student.grade} · {student.school}</p>
          </div>
          {/* Achievement badge */}
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full border border-amber-400/40 bg-amber-400/10">
            <Trophy size={12} className="text-amber-400" />
            <span className="text-amber-400 text-xs font-black">{student.achievement}</span>
          </div>
        </div>

        {/* Details */}
        <div className="px-6 pb-8 space-y-4">
          {/* Project card */}
          <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Zap size={13} className="text-emerald-400" />
              <span className="text-emerald-400 text-[10px] font-black uppercase tracking-widest">Project Built</span>
            </div>
            <p className="text-white font-bold text-sm">{student.project}</p>
            <span className="inline-block mt-2 px-3 py-1 rounded-full text-[10px] font-black text-white/70 border border-white/10" style={{ background: 'rgba(255,255,255,0.06)' }}>{student.subject}</span>
          </div>

          {/* Quote */}
          <div className="rounded-2xl p-4 border border-white/10" style={{ background: 'rgba(255,255,255,0.05)' }}>
            <div className="flex items-center gap-2 mb-2">
              <Star size={13} className="text-amber-400" />
              <span className="text-amber-400 text-[10px] font-black uppercase tracking-widest">Student Says</span>
            </div>
            <p className="text-white/80 text-sm leading-relaxed italic">"{student.quote}"</p>
          </div>

          {/* Stars */}
          <div className="flex justify-center gap-1 pt-1">
            {[...Array(5)].map((_, i) => <svg key={i} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>)}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

function getEmbedUrl(src) {
  if (!src) return null;
  const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
  if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&mute=1&loop=1&playlist=${ytMatch[1]}&controls=0`;
  const driveMatch = src.match(/drive\.google\.com\/file\/d\/([^/]+)/);
  if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
  return null;
}

// ── Rotating Hero Word ──────────────────────────────────────────────────────
function RotatingWord({ words }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex(i => (i + 1) % words.length);
    }, 2500);
    return () => clearInterval(interval);
  }, [words]);

  return (
    <span className="inline-block relative overflow-hidden align-bottom" style={{ height: '1em', verticalAlign: 'baseline' }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={words[index]}
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '-100%', opacity: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="inline-block"
          style={{ background: 'linear-gradient(90deg, #f97316, #ef4444)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
        >
          {words[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

// ── Typewriter ──────────────────────────────────────────────────────────────
function TypewriterText({ words }) {
  const [index, setIndex] = useState(0);
  const [displayed, setDisplayed] = useState('');
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[index];
    if (!deleting && displayed === word) {
      const t = setTimeout(() => setDeleting(true), 2200);
      return () => clearTimeout(t);
    }
    if (deleting && displayed === '') {
      setDeleting(false);
      setIndex(i => (i + 1) % words.length);
      return;
    }
    const t = setTimeout(() => {
      setDisplayed(deleting
        ? word.slice(0, displayed.length - 1)
        : word.slice(0, displayed.length + 1)
      );
    }, deleting ? 35 : 75);
    return () => clearTimeout(t);
  }, [displayed, deleting, index, words]);

  return (
    <span className="text-brand-primary font-black">
      {displayed}
      <span className="animate-pulse text-brand-primary">|</span>
    </span>
  );
}

// ── Animated Counter ────────────────────────────────────────────────────────
function AnimatedCounter({ target, suffix = '' }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting && !started.current) {
        started.current = true;
        const num = parseInt(String(target).replace(/[^0-9]/g, ''));
        const duration = 1800;
        const steps = 60;
        const increment = num / steps;
        let current = 0;
        const timer = setInterval(() => {
          current += increment;
          if (current >= num) { setCount(num); clearInterval(timer); }
          else setCount(Math.floor(current));
        }, duration / steps);
      }
    }, { threshold: 0.3 });
    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Video Card ──────────────────────────────────────────────────────────────
function VideoCard({ src, index = 0 }) {
  const [failed, setFailed] = useState(false);
  const embedUrl = getEmbedUrl(src);

  return (
    <div className="min-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden card-shadow relative shrink-0">
      {embedUrl ? (
        <iframe
          src={embedUrl}
          className="w-full h-full"
          allow="autoplay; encrypted-media"
          allowFullScreen
          title="video"
          style={{ border: 'none' }}
        />
      ) : failed ? (
        <div className={`w-full h-full bg-gradient-to-br ${FALLBACK_GRADIENTS[index % FALLBACK_GRADIENTS.length]} flex items-center justify-center`}>
          <div className="w-16 h-16 rounded-full bg-white/20 flex items-center justify-center">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="white"><polygon points="5,3 19,12 5,21" /></svg>
          </div>
        </div>
      ) : (
        <video autoPlay muted loop playsInline preload="auto" src={src} className="w-full h-full object-cover" onError={() => setFailed(true)} />
      )}
    </div>
  );
}

// ── Hero ────────────────────────────────────────────────────────────────────
export const Hero = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState(getHomeContentSync());

  useEffect(() => {
    getHomeContent().then(c => setContent(c));
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => setContent(c)); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const { hero } = content;

  return (
    <section className="relative min-h-screen flex flex-col items-center px-8 py-20 overflow-hidden bg-aurora bg-dot-grid">
      {/* Background overlay */}
      <div className="absolute inset-0 z-0 bg-white/60" />

      {/* Animated circuit dot grid overlay */}
      <div className="absolute inset-0 z-0 opacity-[0.03]"
        style={{
          backgroundImage: 'radial-gradient(circle, #00b96b 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
      />

      {/* Ambient Glows */}
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full animate-pulse z-0" />
      <div className="absolute bottom-1/4 -right-20 w-[500px] h-[500px] bg-brand-secondary/10 blur-[150px] rounded-full animate-pulse z-0" />

      {/* ── Hero Content ── */}
      <div className="max-w-7xl mx-auto text-center relative z-10 mb-20 w-full px-4">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-primary/10 border border-brand-primary/20 mb-6">
            <Sparkles size={16} className="text-brand-primary" />
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-brand-primary">{hero.badge}</span>
          </div>

          <div className="text-sm font-semibold text-slate-400 mb-4 flex items-center justify-center gap-2">
            <span className="w-6 h-px bg-slate-300" />
            Now teaching: <TypewriterText words={content.typewriterWords || TYPEWRITER_WORDS} />
            <span className="w-6 h-px bg-slate-300" />
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-display font-bold tracking-tight leading-[0.95] mb-8">
            <span className="text-slate-900">{hero.headlineLine1}</span>{' '}
            <span style={{ background: 'linear-gradient(90deg, #2563eb, #0ea5e9)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{hero.headlineGradient}</span>
            <br />
            <RotatingWord words={content.rotatingWords || HERO_ROTATING_WORDS} />
          </h1>

          <p className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto leading-relaxed font-medium">
            {hero.subtitle}
          </p>

          {/* CTA row */}
          <div className="flex items-center justify-center gap-4 flex-wrap">
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/schools')}
              className="flex items-center gap-3 bg-gradient-to-r from-brand-primary to-indigo-700 text-white px-12 py-5 rounded-2xl font-bold text-lg shadow-xl shadow-brand-primary/30 hover:shadow-2xl hover:shadow-brand-primary/40 transition-all"
            >
              Explore Labs <ArrowRight size={20} />
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/courses')}
              className="flex items-center gap-3 bg-white border border-slate-200 text-slate-700 px-10 py-5 rounded-2xl font-bold text-lg shadow-sm hover:shadow-md hover:border-slate-300 transition-all"
            >
              View Courses <ArrowRight size={20} />
            </motion.button>
          </div>
        </motion.div>
      </div>

    </section>
  );
};

const PILL_COLORS = [
  'bg-blue-500/20 border-blue-500/40 text-blue-300',
  'bg-emerald-500/20 border-emerald-500/40 text-emerald-300',
  'bg-purple-500/20 border-purple-500/40 text-purple-300',
  'bg-orange-500/20 border-orange-500/40 text-orange-300',
  'bg-pink-500/20 border-pink-500/40 text-pink-300',
  'bg-cyan-500/20 border-cyan-500/40 text-cyan-300',
  'bg-yellow-500/20 border-yellow-500/40 text-yellow-300',
  'bg-red-500/20 border-red-500/40 text-red-300',
  'bg-violet-500/20 border-violet-500/40 text-violet-300',
  'bg-teal-500/20 border-teal-500/40 text-teal-300',
  'bg-fuchsia-500/20 border-fuchsia-500/40 text-fuchsia-300',
  'bg-lime-500/20 border-lime-500/40 text-lime-300',
];

// ── PartnerSchools ───────────────────────────────────────────────────────────
export const PartnerSchools = () => {
  const [schools, setSchools] = useState(() => getHomeContentSync().partnerSchools?.length ? getHomeContentSync().partnerSchools : []);
  useEffect(() => { getHomeContent().then(c => { if (c.partnerSchools?.length) setSchools(c.partnerSchools); }); }, []);
  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => { if (c.partnerSchools?.length) setSchools(c.partnerSchools); }); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  // Ensure both rows always have content — if ≤4 schools, show all in both rows
  const half = Math.ceil(schools.length / 2);
  const row1 = schools.length > 0 ? schools.slice(0, half) : [];
  const row2 = schools.length > 0 ? (schools.length > 2 ? schools.slice(half) : [...schools].reverse()) : [];
  // Repeat enough times so marquee fills the screen
  const fill = (arr) => { if (!arr.length) return []; let r = []; while (r.length < 12) r = [...r, ...arr]; return r; };
  const doubled1 = fill(row1);
  const doubled2 = fill(row2);

  return (
    <div className="w-full py-14 overflow-hidden border-t border-slate-100" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1040 60%, #0c1a2e 100%)' }}>
      <p className="text-center text-[10px] font-black text-white/40 uppercase tracking-[0.35em] mb-8">Trusted by schools across India</p>

      <div className="relative w-full overflow-hidden mb-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="flex gap-4 whitespace-nowrap animate-marquee-ltr">
          {doubled1.map((school, i) => (
            <div key={i} className={`flex-shrink-0 px-6 py-3 rounded-full border text-sm font-semibold animate-float-${i % 4} ${PILL_COLORS[i % PILL_COLORS.length]}`}>
              {school.name}
            </div>
          ))}
        </div>
      </div>

      <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
        <div className="flex gap-4 whitespace-nowrap animate-marquee-rtl">
          {doubled2.map((school, i) => (
            <div key={i} className={`flex-shrink-0 px-6 py-3 rounded-full border text-sm font-semibold animate-float-${(i + 2) % 4} ${PILL_COLORS[(i + 4) % PILL_COLORS.length]}`}>
              {school.name}
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee-ltr { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-rtl { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        @keyframes float0 { 0%,100% { transform: translateY(0px); } 50% { transform: translateY(-6px); } }
        @keyframes float1 { 0%,100% { transform: translateY(-4px); } 50% { transform: translateY(4px); } }
        @keyframes float2 { 0%,100% { transform: translateY(-2px); } 50% { transform: translateY(6px); } }
        @keyframes float3 { 0%,100% { transform: translateY(4px); } 50% { transform: translateY(-4px); } }
        .animate-marquee-ltr { animation: marquee-ltr 30s linear infinite; }
        .animate-marquee-rtl { animation: marquee-rtl 25s linear infinite; }
        .animate-marquee-ltr:hover, .animate-marquee-rtl:hover { animation-play-state: paused; }
        .animate-float-0 { animation: float0 3s ease-in-out infinite; }
        .animate-float-1 { animation: float1 3.5s ease-in-out infinite; }
        .animate-float-2 { animation: float2 4s ease-in-out infinite; }
        .animate-float-3 { animation: float3 2.8s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

// ── StudentGallery ───────────────────────────────────────────────────────────
export const StudentGallery = () => {
  const [content, setContent] = useState(getHomeContentSync());
  const [activeStudent, setActiveStudent] = useState(null);

  useEffect(() => {
    getHomeContent().then(c => setContent(c));
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => setContent(c)); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const { gallery } = content;

  return (
    <>
      {/* ── Student Gallery — Scroll Stack ── */}
      <div className="w-full relative z-10 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1040 40%, #0c1a2e 100%)' }}>
        {/* Top wave */}
        <svg viewBox="0 0 1440 60" className="w-full block" style={{ marginBottom: '-2px' }} preserveAspectRatio="none">
          <path fill="white" d="M0,0 C360,60 1080,60 1440,0 L1440,0 L0,0 Z" />
        </svg>

        <div className="max-w-7xl mx-auto px-8 py-20">
          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 bg-white/10 border border-white/20 px-4 py-2 rounded-full mb-5">
              <div className="w-1.5 h-1.5 rounded-full bg-[#F48C36] animate-pulse" />
              <span className="text-[11px] font-black text-white/80 uppercase tracking-[0.25em]">Life at Amara Nexa</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-semibold text-white leading-tight mb-4">
              Where Kids Become <br />
              <span style={{ background: 'linear-gradient(90deg, #F48C36, #FBBF24)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Creators
              </span>
            </h2>
            <p className="text-white/50 text-base max-w-lg mx-auto font-normal">
              Every session, students go from zero to building something real — robots, games, AI models and more.
            </p>
          </motion.div>

          {/* Bento grid — hero left + 2×2 right */}
          {(() => {
            const HERO_CARD = {
              tag: '🤖 AI Project', tagColor: '#F48C36',
              name: 'Aarav Sharma', grade: 'Grade 8', school: 'DPS North Campus, Delhi',
              project: 'Built a Gemini-powered chatbot',
              img: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=900&q=80',
              student: 0,
            };
            const GRID_CARDS = [
              { tag: '🎮 Game Dev',     name: 'Priya Reddy',  grade: 'Grade 10', img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', student: 1 },
              { tag: '🔌 Robotics',     name: 'Sneha Kapoor', grade: 'Grade 7',  img: 'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=600&q=80', student: 3 },
              { tag: '🌐 Web Dev',      name: 'Rohan Menon',  grade: 'Grade 9',  img: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=600&q=80', student: 2 },
              { tag: '📊 Data Science', name: 'Kavya Iyer',   grade: 'Grade 11', img: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=600&q=80', student: 0 },
            ];

            return (
              <div className="grid md:grid-cols-5 gap-4">

                {/* ── Hero card (left, spans 2 of 5 cols) ── */}
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
                  className="md:col-span-2 relative rounded-[2rem] overflow-hidden group"
                  style={{ height: '560px' }}
                >
                  <img
                    src={HERO_CARD.img}
                    alt={HERO_CARD.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                </motion.div>

                {/* ── 2×2 right panel ── */}
                <div className="md:col-span-3 grid grid-cols-2 gap-4">
                  {GRID_CARDS.map((card, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 30 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
                      whileHover={{ scale: 1.02 }}
                      className="relative rounded-[2rem] overflow-hidden group"
                      style={{ height: '270px' }}
                    >
                      <img
                        src={card.img}
                        alt={card.name}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                      />
                    </motion.div>
                  ))}
                </div>

              </div>
            );
          })()}
        </div>

        {/* Bottom wave */}
        <svg viewBox="0 0 1440 60" className="w-full block" style={{ marginTop: '-2px' }} preserveAspectRatio="none">
          <path fill="white" d="M0,60 C360,0 1080,0 1440,60 L1440,60 L0,60 Z" />
        </svg>
      </div>

      {/* Student detail modal */}
      <AnimatePresence>
        {activeStudent !== null && (
          <StudentModal
            student={GALLERY_STUDENTS[activeStudent]}
            image={
              activeStudent === 0 ? (gallery?.cards?.[0]?.image || GALLERY_STUDENTS[0].image)
              : activeStudent === 1 ? (gallery?.mainImage || GALLERY_STUDENTS[1].image)
              : activeStudent === 2 ? (gallery?.cards?.[1]?.image || GALLERY_STUDENTS[2].image)
              : (gallery?.cards?.[2]?.image || GALLERY_STUDENTS[3].image)
            }
            onClose={() => setActiveStudent(null)}
          />
        )}
      </AnimatePresence>
    </>
  );
};

// ── LifeAtAmara ──────────────────────────────────────────────────────────────
export const LifeAtAmara = () => {
  const [content, setContent] = useState(getHomeContentSync());

  useEffect(() => {
    getHomeContent().then(c => setContent(c));
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => setContent(c)); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const { lifeSection } = content;

  return (
    <div className="w-full py-24 relative z-10 overflow-hidden bg-white">
      {/* Top decorative line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />

      <div className="max-w-7xl mx-auto px-8 mb-14">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-4">
              <div className="w-1.5 h-1.5 rounded-full bg-brand-primary animate-pulse" />
              <span className="text-[11px] font-black text-brand-primary uppercase tracking-[0.2em]">Inside the Lab</span>
            </div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
              {lifeSection.title}
            </h2>
            <p className="text-slate-500 mt-3 text-base max-w-lg font-medium">
              See real students, real labs, and real projects happening right now across our partner schools.
            </p>
          </div>

        </motion.div>
      </div>

      {/* Scrolling image strip */}
      <div className="relative">
        {/* Edge fades */}
        <div className="absolute left-0 top-0 bottom-0 w-24 bg-gradient-to-r from-white to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 bg-gradient-to-l from-white to-transparent z-10 pointer-events-none" />

        <div className="relative flex overflow-hidden">
          {(() => {
            const cards = (content.labCards?.length ? content.labCards : LAB_CARDS).map(c => ({
              ...c,
              icon: c.iconName ? (() => { const I = getIcon(c.iconName); return <I size={36} className="text-white" />; })() : c.icon,
            }));
            return (
              <motion.div
                animate={{ x: [0, -(336 * cards.length)] }}
                transition={{ duration: cards.length * 5, repeat: Infinity, ease: 'linear' }}
                className="flex gap-6 px-4"
              >
                {[...cards, ...cards].map((card, i) => (
                  <div key={i} className={`min-w-[320px] aspect-[3/4] rounded-[2.5rem] overflow-hidden card-shadow relative shrink-0 bg-gradient-to-br ${card.gradient}`}>
                    <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
                      <div className="w-20 h-20 rounded-3xl bg-white/20 backdrop-blur-sm flex items-center justify-center mb-6">
                        {card.icon}
                      </div>
                      <h3 className="text-xl font-bold text-white mb-2">{card.title}</h3>
                      <p className="text-white/80 text-sm">{card.desc}</p>
                    </div>
                  </div>
                ))}
              </motion.div>
            );
          })()}
        </div>
      </div>

      {/* Bottom decorative line */}
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-brand-primary/30 to-transparent" />
    </div>
  );
};

// ── TestimonialModal ──────────────────────────────────────────────────────────
function TestimonialModal({ t, onClose }) {
  const getVideoEmbedUrl = (src) => {
    if (!src) return null;
    const ytMatch = src.match(/(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/);
    if (ytMatch) return `https://www.youtube.com/embed/${ytMatch[1]}?autoplay=1&controls=1&rel=0`;
    const driveMatch = src.match(/drive\.google\.com\/file\/d\/([^/]+)/);
    if (driveMatch) return `https://drive.google.com/file/d/${driveMatch[1]}/preview`;
    return null;
  };

  const embedUrl = t.video ? getVideoEmbedUrl(t.video) : null;
  const hasVideo = embedUrl || t.video;

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return createPortal(
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.9)', backdropFilter: 'blur(12px)' }}
      onClick={onClose}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 40 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 40 }}
        transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
        className={`relative ${hasVideo ? 'w-full max-w-3xl' : 'w-full max-w-lg'} bg-white rounded-[2rem] overflow-hidden shadow-2xl`}
        onClick={e => e.stopPropagation()}
      >
        {/* Close */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 rounded-full bg-black/50 hover:bg-black/70 flex items-center justify-center transition-colors"
        >
          <X size={18} color="white" />
        </button>

        {/* Video player */}
        {embedUrl ? (
          <div className="w-full aspect-video bg-black">
            <iframe src={embedUrl} className="w-full h-full" allow="autoplay; encrypted-media; fullscreen" allowFullScreen title="parent testimonial" style={{ border: 'none' }} />
          </div>
        ) : t.video ? (
          <div className="w-full aspect-video bg-black">
            <video autoPlay controls playsInline src={t.video} className="w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-full h-48 bg-gradient-to-br from-brand-primary/20 via-violet-100 to-brand-secondary/20 flex items-center justify-center">
            <img src={t.avatar} alt={t.author} className="w-24 h-24 rounded-full border-4 border-white shadow-xl object-cover" referrerPolicy="no-referrer" />
          </div>
        )}

        {/* Author strip below video */}
        <div className="flex items-center gap-4 p-5 bg-white">
          <img src={t.avatar} alt={t.author} className="w-12 h-12 rounded-full border-2 border-brand-primary/20 object-cover shrink-0" referrerPolicy="no-referrer" />
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 text-base">{t.author}</p>
            <p className="text-xs text-slate-400 font-bold uppercase tracking-widest">{t.role}</p>
          </div>
          <div className="flex gap-0.5 shrink-0">
            {[...Array(5)].map((_, si) => (
              <svg key={si} className="w-4 h-4 fill-amber-400" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>,
    document.body
  );
}

// ── HeroTestimonials ─────────────────────────────────────────────────────────
export const HeroTestimonials = () => {
  const [content, setContent] = useState(getHomeContentSync());
  const [active, setActive] = useState(null);

  useEffect(() => {
    getHomeContent().then(c => setContent(c));
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => setContent(c)); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const { testimonials } = content;

  return (
    <section className="py-24 px-8">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-brand-primary/10 border border-brand-primary/20 mb-5">
            <span className="text-xs font-black text-brand-primary uppercase tracking-[0.2em]">Parent Reviews</span>
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight mb-4">
            What Parents Say <span className="text-gradient">About Us</span>
          </h2>
          <p className="text-slate-500 text-lg max-w-xl mx-auto">Click any card to hear parents speak about their experience.</p>
        </motion.div>

        <div className="flex flex-col gap-10 max-w-6xl mx-auto">
          {testimonials.items.map((t, i) => {
            const isEven = i % 2 === 0;

            const textBlock = (
              <div className="flex-1 flex flex-col justify-center py-6 px-2">
                <p className="font-black text-xl md:text-2xl" style={{ color: '#F48C36' }}>{t.author}</p>
                <p className="text-slate-500 text-sm mt-1">{t.role}</p>
                <p className="text-slate-700 text-lg md:text-xl leading-relaxed mt-6 font-medium italic">
                  "{t.quote}"
                </p>
              </div>
            );

            const videoBlock = (
              <div
                className="flex-1 relative aspect-video rounded-2xl overflow-hidden cursor-pointer group"
                onClick={() => setActive(t)}
              >
                <img
                  src={t.avatar}
                  alt={t.author}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-black/10 group-hover:bg-black/30 transition-all duration-300" />
                <div className="absolute bottom-4 left-4">
                  <div className="w-12 h-12 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center group-hover:scale-110 group-hover:bg-black/80 transition-all duration-300">
                    <Play size={18} className="fill-white text-white ml-0.5" />
                  </div>
                </div>
              </div>
            );

            return (
              <motion.div
                key={t.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="flex flex-col md:flex-row gap-8 items-center rounded-[2rem] p-5 md:p-8"
                style={{ background: '#fdf8f2' }}
              >
                {isEven ? <>{textBlock}{videoBlock}</> : <>{videoBlock}{textBlock}</>}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Testimonial popup modal */}
      <AnimatePresence>
        {active && <TestimonialModal t={active} onClose={() => setActive(null)} />}
      </AnimatePresence>
    </section>
  );
};
