import { motion } from 'motion/react';
import { Check, X, Zap, Trophy, Rocket } from 'lucide-react';

const AMARA_FEATURES = [
  'Lab setup inside your school',
  'High-performance RTX laptops provided',
  'Professional in-person mentor',
  'Monthly stipend for top students',
  'Annual laptop prizes',
  'Real AI & coding projects',
  'Startup incubation & funding',
  'Internship referrals',
  'Amara Nexa certification',
  'Zero travel required',
];

const OTHERS = [
  { label: 'Regular Tuition', icon: '📚', bad: ['No laptops provided', 'Travel required', 'No stipend', 'No real projects', 'No internship path'], note: '₹3,000–8,000/month' },
  { label: 'Online Apps', icon: '📱', bad: ['Video-only learning', 'No hands-on hardware', 'No mentor interaction', 'No real stipend', 'Generic certificates'], note: 'BYJU\'s, Unacademy etc.' },
];

export const ComparisonTable = () => {
  return (
    <section className="py-28 px-8 overflow-hidden" style={{ background: 'linear-gradient(135deg, #0a0f1a 0%, #1a1040 50%, #0c1a2e 100%)' }}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 mb-5">
            <Trophy size={13} className="text-brand-accent" />
            <span className="text-xs font-black text-white/70 uppercase tracking-[0.2em]">Why Amara Nexa?</span>
          </div>
          <h2 className="text-5xl md:text-6xl font-display font-bold text-white leading-tight">
            There's nothing else<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent">quite like this.</span>
          </h2>
          <p className="text-white/50 mt-5 text-lg max-w-lg mx-auto">
            We put a professional AI lab inside your school. No other program does that.
          </p>
        </motion.div>

        {/* Cards */}
        <div className="grid md:grid-cols-3 gap-6 items-start">

          {/* Other option 1 */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-white/5 p-7 opacity-60"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="text-3xl mb-4">{OTHERS[0].icon}</div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{OTHERS[0].note}</p>
            <h3 className="text-xl font-black text-white/70 mb-6">{OTHERS[0].label}</h3>
            <div className="space-y-3">
              {OTHERS[0].bad.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <X size={11} className="text-red-400" strokeWidth={3} />
                  </div>
                  <span className="text-white/40 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Amara Nexa — center, elevated */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.0 }}
            className="relative rounded-[2rem] p-7 md:-mt-6 md:mb-6 z-10"
            style={{ background: 'linear-gradient(135deg, #4f46e5, #3730a3)' }}
          >
            {/* Glow */}
            <div className="absolute inset-0 rounded-[2rem] blur-2xl opacity-40 -z-10" style={{ background: 'linear-gradient(135deg, #4f46e5, #06b6d4)' }} />

            {/* Badge */}
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-2 bg-brand-accent/20 border border-brand-accent/30 px-3 py-1.5 rounded-full">
                <Zap size={11} className="text-brand-accent fill-brand-accent" />
                <span className="text-brand-accent text-[10px] font-black uppercase tracking-widest">Recommended</span>
              </div>
              <Rocket size={20} className="text-white/60" />
            </div>

            <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">Inside your school</p>
            <h3 className="text-2xl font-black text-white mb-6">Amara Nexa</h3>

            <div className="space-y-3">
              {AMARA_FEATURES.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.05 * i }}
                  className="flex items-center gap-3"
                >
                  <div className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0">
                    <Check size={11} className="text-white" strokeWidth={3} />
                  </div>
                  <span className="text-white/90 text-sm font-medium">{item}</span>
                </motion.div>
              ))}
            </div>

            <motion.button
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="mt-8 w-full py-3.5 rounded-xl bg-white text-brand-primary font-black text-sm hover:shadow-2xl hover:shadow-white/20 transition-shadow"
            >
              Get your school on board →
            </motion.button>
          </motion.div>

          {/* Other option 2 */}
          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="rounded-[2rem] border border-white/5 p-7 opacity-60"
            style={{ background: 'rgba(255,255,255,0.03)' }}
          >
            <div className="text-3xl mb-4">{OTHERS[1].icon}</div>
            <p className="text-white/40 text-xs font-bold uppercase tracking-widest mb-1">{OTHERS[1].note}</p>
            <h3 className="text-xl font-black text-white/70 mb-6">{OTHERS[1].label}</h3>
            <div className="space-y-3">
              {OTHERS[1].bad.map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-500/10 flex items-center justify-center shrink-0">
                    <X size={11} className="text-red-400" strokeWidth={3} />
                  </div>
                  <span className="text-white/40 text-sm">{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
};
