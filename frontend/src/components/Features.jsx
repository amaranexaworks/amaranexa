import { useState, useEffect } from 'react';
import { Building2, Laptop, Cpu, Briefcase } from 'lucide-react';
import { motion } from 'motion/react';
import { getHomeContent } from '../utils/homeStore';

const ICONS = [Building2, Laptop, Cpu, Briefcase];
const COLORS = [
  { color: 'text-brand-primary', bg: 'bg-brand-primary/10' },
  { color: 'text-brand-secondary', bg: 'bg-brand-secondary/10' },
  { color: 'text-brand-accent', bg: 'bg-brand-accent/10' },
  { color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
];

const LAB_IMAGES = [
  'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1522202176988-66273c2fd55f?auto=format&fit=crop&w=800&q=80',
  'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80',
];

export const Features = () => {
  const [content, setContent] = useState(() => getHomeContent().features);

  useEffect(() => {
    const sync = () => { if (!document.hidden) setContent(getHomeContent().features); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <section id="model" className="py-14 px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <h2 className="text-3xl md:text-4xl font-display font-bold mb-3 tracking-tight text-white">{content.title}</h2>
        <p className="text-slate-400 max-w-2xl mx-auto text-base font-medium">{content.subtitle}</p>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        {content.items.map((item, index) => {
          const Icon = ICONS[index] ?? Building2;
          const { color, bg } = COLORS[index] ?? COLORS[0];
          const isLarge = item.size === 'large';
          const image = LAB_IMAGES[index];

          return (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className={`${isLarge ? 'md:col-span-2' : ''} rounded-2xl relative overflow-hidden group border border-white/10 hover:border-white/20 transition-all`}
            >
              {/* Lab Image */}
              <div className="relative h-40 overflow-hidden">
                <img
                  src={image}
                  alt={item.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  referrerPolicy="no-referrer"
                />
                <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#0a1228]" />
              </div>

              {/* Content */}
              <div className="p-6 pt-2 relative z-10" style={{ background: 'rgba(10,18,40,0.95)' }}>
                <div className={`${bg} w-10 h-10 rounded-xl flex items-center justify-center ${color} mb-3 -mt-8 relative z-10 border border-white/10`}>
                  <Icon size={20} />
                </div>
                <h3 className="text-base font-bold mb-2 text-white">{item.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{item.desc}</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
};
