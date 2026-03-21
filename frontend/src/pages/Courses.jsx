import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Sparkles, Wrench } from 'lucide-react';
import { getPagesContent } from '../utils/pagesStore';

const CARD_ACCENTS = [
  'from-emerald-400 to-teal-500',
  'from-violet-500 to-purple-600',
  'from-orange-400 to-rose-500',
  'from-sky-400 to-blue-600',
  'from-pink-400 to-fuchsia-600',
  'from-amber-400 to-orange-500',
  'from-teal-400 to-cyan-500',
  'from-indigo-400 to-violet-600',
  'from-rose-400 to-pink-600',
];

const LEVEL_STYLES = {
  Beginner:     'bg-emerald-50 text-emerald-700 border-emerald-200',
  Intermediate: 'bg-blue-50 text-blue-700 border-blue-200',
  Advanced:     'bg-purple-50 text-purple-700 border-purple-200',
};

// Per-course metadata keyed by course id (1-indexed as in pagesStore default)
const COURSE_META = {
  1: { minGrade: 3, maxGrade: 8,  level: 'Beginner',     builds: ['🤖 Build a Robot', '⚡ Sensor Control', '🔧 Circuit Design'] },
  2: { minGrade: 7, maxGrade: 12, level: 'Advanced',      builds: ['🧠 Train an AI Model', '👁 Computer Vision', '💬 NLP Chatbot'] },
  3: { minGrade: 3, maxGrade: 10, level: 'Beginner',      builds: ['🎮 Ship a Game', '🌍 3D World', '⚙ Game Mechanics'] },
  4: { minGrade: 5, maxGrade: 12, level: 'Intermediate',  builds: ['🌐 Build a Website', '⚛ React App', '📱 Responsive UI'] },
  5: { minGrade: 7, maxGrade: 12, level: 'Intermediate',  builds: ['📱 iOS App', '🤖 Android App', '🚀 Publish to Store'] },
  6: { minGrade: 9, maxGrade: 12, level: 'Advanced',      builds: ['🔐 Ethical Hacking', '🛡 Security Audit', '🏴 CTF Challenge'] },
  7: { minGrade: 6, maxGrade: 12, level: 'Intermediate',  builds: ['📊 Data Dashboard', '🤖 ML Model', '📈 Predictions'] },
  8: { minGrade: 4, maxGrade: 10, level: 'Beginner',      builds: ['🎨 Design an App UI', '📐 Figma Prototype', '🖌 Brand System'] },
  9: { minGrade: 9, maxGrade: 12, level: 'Advanced',      builds: ['☁ AWS Deployment', '📦 Scale Systems', '⚡ CI/CD Pipeline'] },
};

const GRADE_FILTERS = ['All', 'Grade 3–5', 'Grade 6–8', 'Grade 9–12'];

function matchesGrade(meta, filter) {
  if (filter === 'All') return true;
  if (filter === 'Grade 3–5') return meta.minGrade <= 5;
  if (filter === 'Grade 6–8') return meta.minGrade <= 8 && meta.maxGrade >= 6;
  if (filter === 'Grade 9–12') return meta.maxGrade >= 9;
  return true;
}

export const Courses = () => {
  const [content, setContent] = useState(() => getPagesContent().courses);
  const [activeGrade, setActiveGrade] = useState('All');
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    const sync = () => { if (!document.hidden) setContent(getPagesContent().courses); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  const filtered = content.items.filter(course => {
    const meta = COURSE_META[course.id] || { minGrade: 3, maxGrade: 12 };
    return matchesGrade(meta, activeGrade);
  });

  return (
    <div className="pt-20 bg-white min-h-screen">

      {/* Hero Header */}
      <section className="relative px-8 pt-2 pb-6 max-w-7xl mx-auto overflow-hidden">
        <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-brand-primary/8 blur-[140px] rounded-full pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-violet-400/8 blur-[120px] rounded-full pointer-events-none" />

        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative z-10 text-center mx-auto"
        >
          <div className="inline-flex items-center gap-2 bg-brand-primary/10 text-brand-primary text-sm font-bold px-4 py-2 rounded-full mb-6 border border-brand-primary/20">
            <Sparkles size={14} />
            {content.items.length} Courses Available
          </div>
          <h1 className="text-6xl md:text-7xl font-display font-bold tracking-tighter text-slate-900 leading-[0.95] mb-6">
            {content.headline}{' '}
            <span className="text-gradient">{content.headlineGradient}</span>
          </h1>
          <p className="text-xl text-slate-500 font-medium leading-relaxed max-w-xl mx-auto">
            {content.subtitle}
          </p>
        </motion.div>
      </section>

      {/* Grade Filter Bar */}
      <div className="sticky top-20 z-30 bg-white/90 backdrop-blur-md border-b border-slate-100 px-8 py-4">
        <div className="max-w-7xl mx-auto flex items-center gap-3">
          <span className="text-xs font-bold text-slate-400 uppercase tracking-widest mr-2 shrink-0">Filter by Grade:</span>
          {GRADE_FILTERS.map(grade => (
            <button
              key={grade}
              onClick={() => setActiveGrade(grade)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all border ${
                activeGrade === grade
                  ? 'bg-brand-primary text-white border-brand-primary shadow-md shadow-brand-primary/20'
                  : 'text-slate-500 border-slate-200 hover:border-brand-primary/40 hover:text-brand-primary bg-white'
              }`}
            >
              {grade}
            </button>
          ))}
          <span className="ml-auto text-xs text-slate-400 font-medium">
            {filtered.length} course{filtered.length !== 1 ? 's' : ''}
          </span>
        </div>
      </div>

      {/* Course Cards */}
      <section className="py-16 px-8 max-w-7xl mx-auto pb-32">
        <AnimatePresence mode="popLayout">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((course, index) => {
              const originalIndex = content.items.findIndex(c => c.id === course.id);
              const accent = CARD_ACCENTS[originalIndex % CARD_ACCENTS.length];
              const meta = COURSE_META[course.id] || { minGrade: 3, maxGrade: 12, level: 'Beginner', builds: [] };
              const levelStyle = LEVEL_STYLES[meta.level] || LEVEL_STYLES.Beginner;
              const num = String(originalIndex + 1).padStart(2, '0');
              const isHovered = hoveredId === course.id;

              return (
                <motion.div
                  key={course.id}
                  layout
                  initial={{ opacity: 0, y: 24 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ delay: index * 0.04 }}
                  onMouseEnter={() => setHoveredId(course.id)}
                  onMouseLeave={() => setHoveredId(null)}
                  className="group relative bg-white rounded-[2rem] border border-slate-100 overflow-hidden cursor-pointer flex flex-col"
                  style={{
                    boxShadow: isHovered ? '0 20px 60px -10px rgba(0,0,0,0.15)' : '0 4px 20px -4px rgba(0,0,0,0.06)',
                    transition: 'box-shadow 0.35s ease, transform 0.35s ease',
                    transform: isHovered ? 'translateY(-4px)' : 'translateY(0)',
                  }}
                >
                  {/* Image */}
                  <div className="relative aspect-[16/10] overflow-hidden">
                    <img
                      src={course.image}
                      alt={course.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

                    {/* Course number badge */}
                    <div className={`absolute top-4 left-4 w-10 h-10 rounded-2xl bg-gradient-to-br ${accent} flex items-center justify-center shadow-lg`}>
                      <span className="text-white text-xs font-black">{num}</span>
                    </div>

                    {/* Grade badge */}
                    <div className="absolute top-4 right-4 bg-black/60 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-1 rounded-full">
                      Grade {meta.minGrade}–{meta.maxGrade}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6 flex-1 flex flex-col">
                    <div className={`w-8 h-1 rounded-full bg-gradient-to-r ${accent} mb-4`} />

                    <div className="flex items-start justify-between gap-3 mb-2">
                      <h3 className="text-xl font-bold text-slate-900 leading-snug group-hover:text-brand-primary transition-colors duration-200">
                        {course.title}
                      </h3>
                      <span className={`text-[10px] font-black px-2.5 py-1 rounded-full border shrink-0 ${levelStyle}`}>
                        {meta.level}
                      </span>
                    </div>

                    <p className="text-sm text-slate-500 leading-relaxed mb-4">
                      {course.desc}
                    </p>

                    {/* What you'll build */}
                    <div className="mt-auto">
                      <div className="flex items-center gap-1.5 mb-2">
                        <Wrench size={11} className="text-slate-400" />
                        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">What you'll build</span>
                      </div>
                      <div className="flex flex-wrap gap-1.5">
                        {(meta.builds || []).map((b, bi) => (
                          <span key={bi} className="text-[11px] font-semibold bg-slate-50 border border-slate-200 text-slate-600 px-2.5 py-1 rounded-full">
                            {b}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-end mt-4 pt-4 border-t border-slate-100">
                        <motion.div
                          animate={{ x: isHovered ? 4 : 0 }}
                          transition={{ duration: 0.2 }}
                          className="flex items-center gap-1.5 text-sm font-bold text-brand-primary"
                        >
                          Explore <ArrowRight size={14} />
                        </motion.div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom gradient border on hover */}
                  <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${accent} transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`} />
                </motion.div>
              );
            })}
          </div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="text-center py-24">
            <p className="text-slate-400 text-lg font-medium">No courses for this grade range yet.</p>
          </div>
        )}
      </section>
    </div>
  );
};
