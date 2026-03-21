import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Trophy, Laptop, Rocket, Sparkles, Star, Gift } from 'lucide-react';
import { getHomeContent, getHomeContentSync } from '../utils/homeStore';

const PERK_CONFIG = [
  {
    icon: Trophy,
    iconBg: 'from-amber-400 to-orange-500',
    glow: 'rgba(251,191,36,0.25)',
    accent: '#FBBF24',
    badge: '💰 Monthly Rewards',
    highlight: null,
  },
  {
    icon: Laptop,
    iconBg: 'from-brand-primary to-indigo-600',
    glow: 'rgba(79,70,229,0.25)',
    accent: '#4f46e5',
    badge: '🎁 Free Hardware',
    highlight: true, // featured card
  },
  {
    icon: Rocket,
    iconBg: 'from-emerald-400 to-teal-500',
    glow: 'rgba(16,185,129,0.25)',
    accent: '#10b981',
    badge: '🚀 Startup Path',
    highlight: null,
  },
];

export const Perks = () => {
  const [content, setContent] = useState(getHomeContentSync().perks);

  useEffect(() => {
    getHomeContent().then(c => setContent(c.perks));
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => setContent(c.perks)); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <section id="perks" className="relative py-28 px-8 overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-[#0d0d1f] to-slate-900" />
      <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-brand-primary/10 blur-[120px] rounded-full" />
      <div className="absolute bottom-1/3 right-1/4 w-80 h-80 bg-amber-400/10 blur-[100px] rounded-full" />

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
            <Gift size={13} className="text-amber-400" />
            <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em]">Student Incentives</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-display font-bold text-white leading-tight mb-4">
            {content.title}
          </h2>
          <p className="text-white/50 text-base max-w-xl mx-auto font-normal">{content.subtitle}</p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-stretch">
          {content.items.map((perk, index) => {
            const cfg = PERK_CONFIG[index % PERK_CONFIG.length];
            const Icon = cfg.icon;
            const isFeatured = cfg.highlight;

            return (
              <motion.div
                key={perk.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.12, duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                viewport={{ once: true }}
                className={`relative rounded-[2rem] overflow-hidden flex flex-col ${
                  isFeatured ? 'md:-mt-4 md:-mb-4' : ''
                }`}
                style={{
                  background: isFeatured
                    ? 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #2563eb 100%)'
                    : 'rgba(255,255,255,0.05)',
                  border: isFeatured ? '2px solid rgba(255,255,255,0.25)' : '1px solid rgba(255,255,255,0.08)',
                  boxShadow: `0 0 60px ${cfg.glow}`,
                }}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute top-5 right-5 flex items-center gap-1.5 bg-amber-400 text-slate-900 text-[10px] font-black px-3 py-1.5 rounded-full uppercase tracking-widest">
                    <Star size={9} className="fill-slate-900" />
                    Most Valued
                  </div>
                )}

                <div className="p-8 flex flex-col flex-1">
                  {/* Icon */}
                  <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${cfg.iconBg} flex items-center justify-center mb-6 shadow-lg`}>
                    <Icon size={26} className="text-white" />
                  </div>

                  {/* Badge label */}
                  <span
                    className="inline-block text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full mb-4 w-fit"
                    style={{
                      background: isFeatured ? 'rgba(255,255,255,0.2)' : `${cfg.accent}20`,
                      color: isFeatured ? 'white' : cfg.accent,
                      border: `1px solid ${isFeatured ? 'rgba(255,255,255,0.25)' : `${cfg.accent}40`}`,
                    }}
                  >
                    {cfg.badge}
                  </span>

                  <h3 className={`text-2xl font-display font-bold mb-3 ${isFeatured ? 'text-white' : 'text-white'}`}>
                    {perk.title}
                  </h3>
                  <p className={`text-sm leading-relaxed flex-1 ${isFeatured ? 'text-white/80' : 'text-white/50'}`}>
                    {perk.desc}
                  </p>

                  {/* Featured laptop highlight */}
                  {isFeatured && (
                    <div className="mt-8 p-4 rounded-2xl bg-white/15 border border-white/20">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center text-xl">💻</div>
                        <div>
                          <p className="text-white font-black text-sm">RTX Laptop — Yours to Keep</p>
                          <p className="text-white/60 text-[11px] font-medium">Awarded to top performers every year</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Stars */}
                  <div className="flex items-center gap-1 mt-6">
                    {[...Array(5)].map((_, si) => (
                      <svg key={si} className="w-3 h-3" style={{ fill: cfg.accent }} viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                    <span className="text-[10px] font-bold ml-1" style={{ color: cfg.accent }}>5.0</span>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom note */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 mt-14 flex-wrap"
        >
          {['Attendance-based rewards', 'RTX laptops for top performers', 'Real stipends for real projects', 'Startup seed funding'].map((item, i) => (
            <div key={i} className="flex items-center gap-2 text-white/40 text-sm font-medium">
              <Sparkles size={12} className="text-brand-primary/60" />
              {item}
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
};
