import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useInView } from 'motion/react';
import {
  ChevronLeft, ChevronRight, CheckCircle2, Star, BrainCircuit, Quote,
  Clock, Terminal, Zap, Play, ArrowUpRight, Cpu, Gamepad2, Bot,
  Trophy, Users, Rocket, BookOpen, Globe, Award, X
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { getPagesContent } from '../utils/pagesStore';
import { TiltCard } from '../components/TiltCard';

// ── Animated stat counter ──
function AnimCounter({ target, suffix = '', duration = 1800 }) {
  const [count, setCount] = useState(0);
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= target) { setCount(target); clearInterval(timer); }
      else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target, duration]);
  return <span ref={ref}>{count.toLocaleString()}{suffix}</span>;
}

// ── Countdown Timer ──
function parseStartDate(str) {
  if (!str) return null;
  const MONTHS = { january:0,february:1,march:2,april:3,may:4,june:5,july:6,august:7,september:8,october:9,november:10,december:11 };
  const parts = str.toLowerCase().replace(/(\d+)(st|nd|rd|th)/, '$1').split(' ');
  const day = parseInt(parts[0]);
  const monthIdx = MONTHS[parts[1]];
  if (isNaN(day) || monthIdx === undefined) return null;
  const now = new Date();
  const d = new Date(now.getFullYear(), monthIdx, day);
  if (d < now) d.setFullYear(now.getFullYear() + 1);
  return d;
}

function useCountdown(targetDate) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  useEffect(() => {
    if (!targetDate) return;
    const tick = () => {
      const diff = targetDate - new Date();
      if (diff <= 0) { setTimeLeft({ days:0, hours:0, minutes:0, seconds:0 }); return; }
      setTimeLeft({ days: Math.floor(diff/86400000), hours: Math.floor((diff%86400000)/3600000), minutes: Math.floor((diff%3600000)/60000), seconds: Math.floor((diff%60000)/1000) });
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [targetDate]);
  return timeLeft;
}

const CAMP_COLORS = [
  { accent: '#3B82F6', bg: 'from-blue-600 to-indigo-700', light: 'bg-blue-50 text-blue-600 border-blue-200', icon: Bot },
  { accent: '#8B5CF6', bg: 'from-purple-600 to-violet-700', light: 'bg-purple-50 text-purple-600 border-purple-200', icon: Cpu },
  { accent: '#F59E0B', bg: 'from-amber-500 to-orange-600', light: 'bg-amber-50 text-amber-600 border-amber-200', icon: Gamepad2 },
];

const STATS = [
  { value: 5000, suffix: '+', label: 'Students Enrolled', icon: Users },
  { value: 98, suffix: '%', label: 'Parent Satisfaction', icon: Trophy },
  { value: 12, suffix: '+', label: 'Camp Tracks', icon: BookOpen },
  { value: 6, suffix: '+', label: 'Cities', icon: Globe },
];

const GALLERY_IMAGES = [
  { src: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80', label: 'Robotics Lab', span: 'row-span-2' },
  { src: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', label: 'Coding Session', span: '' },
  { src: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80', label: 'Game Dev', span: '' },
  { src: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80', label: 'Computer Lab', span: '' },
  { src: 'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=600&q=80', label: 'Team Projects', span: '' },
];

const VIDEO_TESTIMONIALS = [
  { name: 'Arjun Sharma', role: 'Student, Grade 9', quote: 'I built my first AI model in just 5 days. This camp changed how I think about technology.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', thumb: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', accent: '#a78bfa' },
  { name: 'Priya Nair', role: 'Parent of Grade 7 Student', quote: 'My daughter came back confident, creative, and with a working robot she built herself. Worth every rupee.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', thumb: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)', accent: '#f472b6' },
  { name: 'Karan Mehta', role: 'Student, Grade 11', quote: 'The Game Dev camp was intense but amazing. I shipped my first Unity game and it is on my portfolio now.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', thumb: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ', gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)', accent: '#38bdf8' },
];

const ADVANTAGES = [
  { icon: Rocket, title: 'Real Projects, Day 1', desc: 'No boring theory. Students dive straight into building real products — robots, apps, and games from Day 1.', color: 'text-blue-600', bg: 'bg-blue-50' },
  { icon: Award, title: 'IITian Mentors', desc: 'Every batch is led by IITians and industry professionals who know how to make complex topics simple and fun.', color: 'text-purple-600', bg: 'bg-purple-50' },
  { icon: Trophy, title: 'National Competitions', desc: 'Top performers get fast-tracked to national tech fests and robotics championships across India.', color: 'text-amber-600', bg: 'bg-amber-50' },
  { icon: Users, title: 'Small Batch Sizes', desc: 'Max 15 students per batch ensures every child gets individual attention and progresses at their own pace.', color: 'text-emerald-600', bg: 'bg-emerald-50' },
  { icon: BookOpen, title: 'Certificate + Portfolio', desc: 'Every student earns a verified certificate and leaves with a professional portfolio of completed projects.', color: 'text-rose-600', bg: 'bg-rose-50' },
  { icon: Globe, title: 'Pan-India Community', desc: 'Join a network of 5000+ young innovators, access alumni events, workshops, and mentorship beyond camp.', color: 'text-cyan-600', bg: 'bg-cyan-50' },
];

// ── Camp Carousel ──
function CampCarousel({ camps }) {
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const timerRef = useRef(null);
  const total = camps.length;

  const SLIDE_IMAGES = [
    'https://images.unsplash.com/photo-1485827404703-89b55fcc595e?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=1400&q=80',
    'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=1400&q=80',
  ];

  const SLIDE_GRADIENTS = [
    'linear-gradient(135deg, rgba(59,130,246,0.85), rgba(79,70,229,0.9))',
    'linear-gradient(135deg, rgba(139,92,246,0.85), rgba(109,40,217,0.9))',
    'linear-gradient(135deg, rgba(245,158,11,0.85), rgba(234,88,12,0.9))',
  ];

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setDirection(1);
      setCurrent(prev => (prev + 1) % total);
    }, 4000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, [total]);

  const go = (dir) => {
    setDirection(dir);
    setCurrent(prev => (prev + dir + total) % total);
    resetTimer();
  };

  const goTo = (idx) => {
    setDirection(idx > current ? 1 : -1);
    setCurrent(idx);
    resetTimer();
  };

  const camp = camps[current] ?? camps[0];
  const color = CAMP_COLORS[current] ?? CAMP_COLORS[0];
  const Icon = color.icon;

  const variants = {
    enter: (d) => ({ x: d > 0 ? '100%' : '-100%', opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? '-100%' : '100%', opacity: 0 }),
  };

  return (
    <div className="relative rounded-[2rem] overflow-hidden" style={{ minHeight: 420 }}>
      <AnimatePresence initial={false} custom={direction} mode="wait">
        <motion.div
          key={current}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ type: 'tween', duration: 0.5, ease: 'easeInOut' }}
          className="relative w-full rounded-[2rem] overflow-hidden"
          style={{ minHeight: 420 }}
        >
          {/* Background image */}
          <div className="absolute inset-0">
            <img
              src={SLIDE_IMAGES[current % SLIDE_IMAGES.length]}
              alt={camp.title}
              className="w-full h-full object-cover"
              referrerPolicy="no-referrer"
            />
            <div className="absolute inset-0" style={{ background: SLIDE_GRADIENTS[current % SLIDE_GRADIENTS.length] }} />
          </div>

          {/* Content overlay */}
          <div className="relative z-10 flex flex-col justify-center px-10 md:px-16 py-14" style={{ minHeight: 420 }}>
            <div className="max-w-xl">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center">
                  <Icon size={24} className="text-white" />
                </div>
                <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm border border-white/20 text-white text-xs font-bold uppercase tracking-wider">
                  {camp.category || `Track ${current + 1}`}
                </span>
              </div>
              <h3 className="text-3xl md:text-4xl font-display font-extrabold text-white mb-3 leading-tight">{camp.title}</h3>
              <p className="text-white/80 text-base md:text-lg leading-relaxed mb-6 max-w-md">
                {camp.details?.[0] || camp.description || 'Immersive hands-on experience for young innovators.'}
              </p>
              <div className="flex flex-wrap items-center gap-3 mb-6">
                {camp.grades && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
                    <Users size={14} /> {camp.grades}
                  </span>
                )}
                {camp.startDate && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-medium">
                    <Clock size={14} /> {camp.startDate}
                  </span>
                )}
                {camp.price && (
                  <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/15 backdrop-blur-sm border border-white/20 text-white text-sm font-bold">
                    {camp.price}
                  </span>
                )}
              </div>
              <button className="inline-flex items-center gap-2 bg-white text-slate-900 px-7 py-3 rounded-xl font-bold text-sm hover:shadow-xl hover:scale-105 transition-all">
                Enroll Now <ArrowUpRight size={16} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>

      {/* Left/Right arrows */}
      <button
        onClick={() => go(-1)}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
      >
        <ChevronLeft size={20} />
      </button>
      <button
        onClick={() => go(1)}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white hover:bg-white/30 transition-all hover:scale-110"
      >
        <ChevronRight size={20} />
      </button>

      {/* Dot indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-20 flex items-center gap-2">
        {Array.from({ length: total }).map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-2 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-white' : 'w-2 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>
    </div>
  );
}

export const SummerCamps = () => {
  const navigate = useNavigate();
  const [selectedCamp, setSelectedCamp] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [videoModal, setVideoModal] = useState(null);
  const [content, setContent] = useState(() => getPagesContent().summerCamps);

  useEffect(() => {
    const sync = () => { if (!document.hidden) setContent(getPagesContent().summerCamps); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const camps = content.camps;
  const activeCamp = camps[selectedCamp] ?? camps[0];
  const campColor = CAMP_COLORS[selectedCamp] ?? CAMP_COLORS[0];
  const CampIcon = campColor.icon;
  const target = parseStartDate(activeCamp.startDate);
  const { days, hours, minutes, seconds } = useCountdown(target);

  return (
    <div className="min-h-screen text-slate-900" style={{ background: '#fffbeb' }}>

      {/* ── Gradient top bar ── */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-amber-400 via-orange-500 to-yellow-400 z-[60] pointer-events-none" />

      {/* ── Navbar ── */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled ? 'border-b border-amber-200/60 shadow-sm' : 'border-b border-transparent'
      }`} style={{ background: 'rgba(255,251,235,0.92)', backdropFilter: 'blur(20px)' }}>
        <div className="max-w-7xl mx-auto px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <a href="/" className="flex items-center gap-3 group" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
              <div className="bg-gradient-to-br from-amber-500 to-orange-600 p-2 rounded-xl">
                <Terminal size={18} className="text-white" />
              </div>
              <span className="font-display font-extrabold text-lg tracking-tight text-slate-900">
                AMARA<span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 to-orange-500">NEXA</span>
              </span>
            </a>
            <div className="h-5 w-px bg-amber-200" />
            <a href="/" className="flex items-center gap-1.5 text-xs font-bold text-amber-700/60 hover:text-slate-900 transition-colors uppercase tracking-widest" onClick={(e) => { e.preventDefault(); window.location.href = '/'; }}>
              <ChevronLeft size={14} /> Home
            </a>
          </div>
          <div className="hidden md:flex items-center gap-8">
            {[{label:'Camps',href:'#camps'},{label:'Why Us',href:'#why'},{label:'Gallery',href:'#gallery'},{label:'Stories',href:'#stories'}].map((l) => (
              <a key={l.label} href={l.href} className="text-sm font-semibold text-amber-800/60 hover:text-slate-900 transition-colors">{l.label}</a>
            ))}
          </div>
          <button className="flex items-center gap-2 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-5 py-2.5 rounded-xl font-bold text-sm hover:shadow-lg hover:shadow-amber-500/30 transition-all">
            <Zap size={14} className="fill-white" /> Book Now
          </button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section className="pt-28 pb-16 px-8 relative overflow-hidden bg-gradient-to-b from-amber-50/80 to-[#fffbeb]">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-amber-200/40 rounded-full blur-[120px] pointer-events-none" />
        <div className="absolute top-20 right-0 w-[400px] h-[400px] bg-orange-200/40 rounded-full blur-[100px] pointer-events-none" />
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-300 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">
              <Zap size={12} className="fill-amber-500" /> Summer 2026 · Limited Seats
            </span>
            <h1 className="text-5xl lg:text-7xl font-display font-extrabold text-slate-900 leading-tight mb-6">
              Build Real Things.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500">This Summer.</span>
            </h1>
            <p className="text-amber-900/60 text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              Immersive 5-day coding camps for students in grades 2–12. Robotics, AI, and Game Development — hands-on, no fluff.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <a href="#camps" className="bg-gradient-to-r from-amber-500 to-orange-600 text-white px-8 py-4 rounded-xl font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/30 hover:scale-105 transition-all flex items-center gap-2">
                Choose Your Camp <ArrowUpRight size={20} />
              </a>
              <a href="#gallery" className="bg-white border border-amber-200 text-slate-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-amber-50 hover:border-amber-300 transition-all flex items-center gap-2 shadow-sm">
                <Play size={18} className="fill-slate-700 text-slate-700" /> See Inside
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-12 px-8 border-y border-amber-200/50 bg-amber-50/50">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
          {STATS.map((s, i) => {
            const Icon = s.icon;
            return (
              <motion.div key={s.label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }} className="text-center">
                <Icon size={22} className="text-amber-600 mx-auto mb-2" />
                <div className="text-3xl lg:text-4xl font-display font-extrabold text-slate-900 mb-1">
                  <AnimCounter target={s.value} suffix={s.suffix} />
                </div>
                <p className="text-slate-500 text-sm font-medium">{s.label}</p>
              </motion.div>
            );
          })}
        </div>
      </section>

      {/* ── CHOOSE YOUR CAMP — Auto-slide Carousel ── */}
      <section id="camps" className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">Choose Your Track</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900">Pick Your Camp</h2>
            <p className="text-amber-900/60 mt-3 text-lg">Three tracks. One mission — build real things.</p>
          </motion.div>

          {/* Carousel */}
          <CampCarousel camps={camps} />
        </div>
      </section>

      {/* ── WHY CHOOSE US ── */}
      <section id="why" className="py-20 px-8 bg-amber-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-amber-200 bg-white text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">Why Choose Us</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900">Advantages of Our Camps</h2>
            <p className="text-slate-500 mt-3 text-lg max-w-xl mx-auto">Everything designed so your child leaves with skills, confidence, and something to show.</p>
          </motion.div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ADVANTAGES.map((adv, i) => {
              const Icon = adv.icon;
              return (
                <motion.div
                  key={adv.title}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.5 }}
                  className="bg-white border border-amber-200/60 rounded-[2rem] p-7 hover:border-amber-300 hover:-translate-y-1 hover:shadow-lg transition-all group"
                >
                  <div className={`w-12 h-12 rounded-2xl ${adv.bg} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                    <Icon size={22} className={adv.color} />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900 mb-2">{adv.title}</h3>
                  <p className="text-slate-500 text-sm leading-relaxed">{adv.desc}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── INSIDE OUR CAMPS (Gallery) ── */}
      <section id="gallery" className="py-20 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-amber-200 bg-amber-50 text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">Behind the Scenes</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900">Inside Our Summer Camps</h2>
            <p className="text-slate-500 mt-3 text-lg">Real students. Real projects. Real fun.</p>
          </motion.div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 auto-rows-[220px]">
            {GALLERY_IMAGES.map((img, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.5 }}
                className={`relative rounded-[2rem] overflow-hidden group cursor-pointer ${i === 0 ? 'row-span-2' : ''}`}
              >
                <img src={img.src} alt={img.label} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="absolute bottom-4 left-4 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0">
                  <span className="text-white font-bold text-sm bg-white/20 backdrop-blur-sm px-3 py-1.5 rounded-full border border-white/20">{img.label}</span>
                </div>
                {/* Play button for video feel */}
                {i === 0 && (
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center group-hover:scale-110 transition-transform">
                      <Play size={22} className="fill-white text-white ml-1" />
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── VIDEO TESTIMONIALS ── */}
      <section id="stories" className="py-20 px-8 bg-amber-50/50">
        <div className="max-w-7xl mx-auto">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <span className="inline-block px-4 py-1.5 rounded-full border border-amber-200 bg-white text-amber-700 text-xs font-bold uppercase tracking-widest mb-4">Real Stories</span>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-slate-900">What Students & Parents Say</h2>
            <p className="text-slate-500 mt-3 text-lg">5000+ happy families. Here's what they experienced.</p>
          </motion.div>

          {/* Video testimonial cards — gradient style */}
          <div className="grid md:grid-cols-3 gap-6">
            {VIDEO_TESTIMONIALS.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                className="relative rounded-[2rem] overflow-hidden group cursor-pointer"
                style={{ background: t.gradient, minHeight: 380 }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-40 h-40 rounded-full bg-white/10 pointer-events-none" />
                <div className="absolute -bottom-8 -left-8 w-32 h-32 rounded-full bg-white/10 pointer-events-none" />

                {/* Video thumbnail area */}
                <div className="relative mx-6 mt-6 rounded-2xl overflow-hidden h-44 group/thumb" onClick={() => setVideoModal(t.video)}>
                  <img src={t.thumb} alt={t.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-black/30 group-hover/thumb:bg-black/40 transition-colors" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-white/25 backdrop-blur-md border-2 border-white/40 flex items-center justify-center group-hover:scale-110 transition-all shadow-lg shadow-black/20">
                      <Play size={22} className="fill-white text-white ml-1" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-full bg-black/50 backdrop-blur-sm text-white text-[10px] font-bold tracking-wider uppercase">Watch Story</span>
                </div>

                {/* Quote box */}
                <div className="mx-6 mt-4 p-4 rounded-xl bg-white/15 backdrop-blur-sm border border-white/20">
                  <div className="flex gap-0.5 mb-2">
                    {[...Array(5)].map((_, j) => <Star key={j} size={12} className="fill-yellow-300 text-yellow-300" />)}
                  </div>
                  <p className="text-white/90 text-sm leading-relaxed line-clamp-2">"{t.quote}"</p>
                </div>

                {/* Author */}
                <div className="flex items-center gap-3 mx-6 mt-4 mb-6">
                  <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border-2 border-white/40 shadow-md" referrerPolicy="no-referrer" />
                  <div>
                    <p className="font-bold text-white text-sm">{t.name}</p>
                    <p className="text-white/60 text-xs">{t.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

        </div>
      </section>

      {/* ── Video Modal ── */}
      <AnimatePresence>
        {videoModal && (
          <motion.div
            key="video-modal-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(8px)' }}
            onClick={() => setVideoModal(null)}
          >
            <motion.div
              key="video-modal-content"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl rounded-2xl overflow-hidden shadow-2xl"
              style={{ aspectRatio: '16/9' }}
              onClick={(e) => e.stopPropagation()}
            >
              <iframe
                src={`${videoModal}?autoplay=1&rel=0`}
                title="Testimonial Video"
                className="w-full h-full border-0"
                style={{ width: '100%', height: '100%' }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
              <button
                onClick={() => setVideoModal(null)}
                className="absolute top-3 right-3 w-10 h-10 rounded-full bg-black/60 backdrop-blur-sm border border-white/20 flex items-center justify-center text-white hover:bg-white/20 transition-colors z-10"
              >
                <X size={20} />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── FOOTER CTA ── */}
      <section className="py-20 px-8 text-center relative overflow-hidden bg-gradient-to-br from-amber-100/60 via-orange-50 to-yellow-50">
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-300/50 to-transparent" />
        <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="max-w-2xl mx-auto relative z-10">
          <span className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-amber-300 bg-amber-100 text-amber-700 text-xs font-bold uppercase tracking-widest mb-6">
            <Zap size={12} className="fill-amber-500" /> Limited Seats · Summer 2026
          </span>
          <h2 className="text-4xl lg:text-5xl font-display font-extrabold text-slate-900 mb-6 leading-tight">
            Ready to start your child's<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-500 via-orange-500 to-yellow-500">AI journey?</span>
          </h2>
          <p className="text-amber-900/60 mb-10 text-lg">Secure your spot in the most advanced school coding program in India.</p>
          <button className="inline-flex items-center gap-3 bg-gradient-to-r from-amber-500 to-orange-600 text-white px-10 py-4 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-amber-500/40 hover:scale-105 transition-all">
            <Zap size={20} className="fill-white" /> Book a Camp Today
          </button>
        </motion.div>
      </section>

    </div>
  );
};
