import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, ChevronLeft, ChevronDown, Terminal } from 'lucide-react';
import { Link } from 'react-router-dom';
import { MeetingForm } from '../components/MeetingForm';
import { getPagesContent, getPagesContentSync } from '../utils/pagesStore';
import { getHomeContent, getHomeContentSync } from '../utils/homeStore';

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
  'bg-sky-500/20 border-sky-500/40 text-sky-300',
  'bg-rose-500/20 border-rose-500/40 text-rose-300',
  'bg-amber-500/20 border-amber-500/40 text-amber-300',
  'bg-indigo-500/20 border-indigo-500/40 text-indigo-300',
];


export const Schools = () => {
  const [showMeetingForm, setShowMeetingForm] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const servicesRef = useRef(null);
  const [content, setContent] = useState(getPagesContentSync().schools);
  const [partnerSchools, setPartnerSchools] = useState(getHomeContentSync().partnerSchools || []);

  useEffect(() => {
    getPagesContent().then(p => setContent(p.schools));
    getHomeContent().then(c => { if (c.partnerSchools?.length) setPartnerSchools(c.partnerSchools); });
  }, []);

  useEffect(() => {
    const handleClick = (e) => {
      if (servicesRef.current && !servicesRef.current.contains(e.target)) {
        setServicesOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    const sync = () => { if (!document.hidden) getPagesContent().then(p => setContent(p.schools)); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);

  return (
    <div className="min-h-screen text-white selection:bg-blue-600 selection:text-white" style={{ background: '#09090b' }}>
      {/* Sub Navbar */}
      <nav className="fixed top-0 left-0 right-0 backdrop-blur-md z-50 border-b border-white/5" style={{ background: 'rgba(9, 9, 11, 0.92)' }}>
        <div className="max-w-7xl mx-auto px-8 h-20 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="bg-gradient-to-br from-brand-primary to-brand-secondary p-2 rounded-xl group-hover:scale-105 transition-transform shadow-lg">
                <Terminal size={18} className="text-white" />
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-lg tracking-tight text-white">AMARA<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">NEXA</span></span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-white/40 uppercase">AI Education Labs</span>
              </div>
            </Link>
            <div className="h-6 w-px bg-white/10 hidden md:block" />
            <Link
              to="/"
              className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-bold text-slate-400 hover:text-white transition-all uppercase tracking-widest"
            >
              <ChevronLeft size={14} /> Back to Home
            </Link>
          </div>
          <div className="hidden md:flex items-center gap-10">
            {[
              { label: 'Home', href: '#home' },
              { label: 'Labs', href: '#labs' },
              { label: 'Products', href: '#products' },
              { label: 'Contact Us', href: '#contact' },
            ].map((link) => (
              <a key={link.label} href={link.href} className="text-sm font-medium text-slate-400 hover:text-white transition-colors">
                {link.label}
              </a>
            ))}

            {/* Services dropdown */}
            <div className="relative" ref={servicesRef}>
              <button
                onClick={() => setServicesOpen(o => !o)}
                className="flex items-center gap-1.5 text-sm font-medium text-slate-400 hover:text-white transition-colors"
              >
                Services <ChevronDown size={14} className={`transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} />
              </button>
              <AnimatePresence>
                {servicesOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.18 }}
                    className="absolute top-full right-0 mt-3 w-72 rounded-2xl border border-white/10 shadow-2xl overflow-hidden"
                    style={{ background: 'rgba(9,9,11,0.98)', backdropFilter: 'blur(20px)' }}
                  >
                    {(content.servicesDropdown || getPagesContentSync().schools.servicesDropdown || []).map((item, i) => (
                      <a
                        key={i}
                        href="#services"
                        onClick={() => setServicesOpen(false)}
                        className="flex flex-col px-5 py-4 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0 group"
                      >
                        <span className="text-sm font-bold text-white group-hover:text-blue-400 transition-colors">{item.label}</span>
                        <span className="text-xs text-slate-500 mt-0.5">{item.desc}</span>
                      </a>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <button
            onClick={() => setShowMeetingForm(true)}
            className="bg-blue-600 text-white px-6 py-2.5 rounded-lg font-bold text-sm hover:bg-blue-700 transition-all flex items-center gap-2"
          >
            Book a Meeting <ArrowUpRight size={16} />
          </button>
        </div>
      </nav>

      {/* Hero */}
      <section id="home" className="pt-24 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-10"
          style={{ backgroundImage: 'linear-gradient(rgba(148,163,184,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(148,163,184,0.15) 1px, transparent 1px)', backgroundSize: '50px 50px' }} />
        <div className="w-full px-8 xl:px-16 grid lg:grid-cols-[1fr_1.1fr] gap-12 items-center relative z-10">
          <motion.div initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }} className="pl-4 xl:pl-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-500/10 border border-blue-400/20 mb-6">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-[11px] font-black text-blue-400 uppercase tracking-[0.2em]">For Schools & Institutions</span>
            </div>
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-display font-bold mb-6 leading-[1.05] tracking-tight">
              {content.heroHeadline}{' '}
              <span style={{ background: 'linear-gradient(90deg, #f59e0b, #f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>{content.heroAccent}</span>
            </h1>
            <p className="text-lg text-slate-400 max-w-xl mb-10 leading-relaxed">{content.heroSubtitle}</p>
            <button
              onClick={() => setShowMeetingForm(true)}
              className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-10 py-4 rounded-xl font-bold text-lg hover:from-blue-500 hover:to-indigo-500 transition-all flex items-center gap-3 shadow-xl shadow-blue-600/25"
            >
              Book a Meeting <ArrowUpRight size={20} />
            </button>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8, delay: 0.2 }} className="relative w-full">
            <div className="rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl w-full aspect-video">
              <video
                autoPlay
                muted
                loop
                playsInline
                className="w-full h-full object-cover"
              >
                <source src="https://videos.pexels.com/video-files/3209828/3209828-uhd_2560_1440_25fps.mp4" type="video/mp4" />
              </video>
            </div>
            <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 blur-[100px] rounded-full" />
          </motion.div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-16 px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
              <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em]">Simple Process</span>
            </div>
            <h2 className="text-5xl font-display font-bold text-white leading-tight">
              How It <span className="text-[#EAB308]">Works</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg max-w-xl mx-auto">From first call to first project — we handle everything in between.</p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-14 left-[22%] right-[22%] h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            {(() => {
              const HOW_IT_WORKS_BG = [
                'linear-gradient(135deg,#dbeafe,#bfdbfe)',
                'linear-gradient(135deg,#fef3c7,#fde68a)',
                'linear-gradient(135deg,#d1fae5,#a7f3d0)',
              ];
              return (content.howItWorks || getPagesContentSync().schools.howItWorks || []).map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15, duration: 0.6 }}
                className="bg-white/5 rounded-[2.5rem] border border-white/10 p-8 hover:border-white/20 transition-all hover:-translate-y-1 relative overflow-hidden"
              >
                <div className="absolute top-6 right-7 text-6xl font-black text-white/5 select-none">0{i + 1}</div>
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6 text-2xl" style={{ background: HOW_IT_WORKS_BG[i % HOW_IT_WORKS_BG.length] }}>
                  {step.emoji}
                </div>
                <h3 className="text-xl font-black text-white mb-3">{step.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{step.desc}</p>
                <div className="mt-6 w-8 h-1 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
              </motion.div>
            ));
            })()}
          </div>
        </div>
      </section>

      {/* Labs */}
      <section id="labs" className="py-16 px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-end mb-10 gap-6">
            <div className="max-w-2xl">
              <h2 className="text-5xl font-display font-bold mb-6">
                {content.labsTitle.split(' ').slice(0, -1).join(' ')} <span className="text-blue-500">{content.labsTitle.split(' ').slice(-1)}</span>
              </h2>
              <p className="text-slate-400 text-lg">{content.labsSubtitle}</p>
            </div>
            <div className="text-[#EAB308] font-mono text-sm tracking-widest uppercase">Infrastructure & Education</div>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            {content.labItems.map((lab) => (
              <div key={lab.id} className="group relative rounded-[3rem] overflow-hidden aspect-video border border-white/10">
                <img src={lab.image} alt={lab.title} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent p-10 flex flex-col justify-end">
                  <h3 className="text-3xl font-bold mb-2">{lab.title}</h3>
                  <p className="text-slate-300">{lab.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Success Stories */}
      <section className="py-16 px-8 bg-transparent">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
              <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em]">Proven Results</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              Schools We <span className="text-[#EAB308]">Transformed</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">Real labs. Real schools. Real impact on thousands of students across India.</p>
          </motion.div>

          {(() => {
            const SUCCESS_STORY_COLORS = ['#3b82f6', '#8b5cf6', '#06b6d4'];
            return (
          <div className="grid md:grid-cols-3 gap-7">
            {(content.successStories || getPagesContentSync().schools.successStories || []).map((item, i) => {
              const color = SUCCESS_STORY_COLORS[i % SUCCESS_STORY_COLORS.length];
              return (
              <motion.a
                key={i}
                href={item.video}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1, duration: 0.5 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group block rounded-3xl overflow-hidden relative bg-slate-800/60"
              >
                {/* Colored top border accent */}
                <div className="absolute top-0 left-0 right-0 h-1 z-10" style={{ background: color }} />

                {/* Image */}
                <div className="h-52 overflow-hidden relative">
                  <img src={item.image} alt={item.school} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" referrerPolicy="no-referrer" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent" />
                  {/* Play button */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300 group-hover:scale-110 bg-black/40 backdrop-blur-md border border-white/20 group-hover:border-white/40">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="white" className="ml-1 drop-shadow-lg"><polygon points="7,4 20,12 7,20" /></svg>
                    </div>
                  </div>
                </div>

                {/* Content area */}
                <div className="p-6 pt-4">
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <div>
                      <h3 className="text-lg font-bold text-white mb-0.5">{item.school}</h3>
                      <p className="text-slate-500 text-sm">{item.location}</p>
                    </div>
                    <div className="px-3 py-1.5 rounded-lg text-xs font-bold" style={{ background: `${color}15`, color: color, border: `1px solid ${color}30` }}>
                      {item.students}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-3 border-t border-white/8">
                    <span className="text-slate-500 text-xs">Students impacted</span>
                    <span className="text-xs font-semibold flex items-center gap-1 transition-colors" style={{ color: color }}>
                      Watch Story <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.a>
              );
            })}
          </div>
            );
          })()}
        </div>
      </section>

      {/* What Our School Partners Say */}
      <section className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-5">
              <span className="text-xs font-black text-white/80 uppercase tracking-[0.2em]">Testimonials</span>
            </div>
            <h2 className="text-4xl lg:text-5xl font-display font-bold text-white leading-tight">
              What Our Partners <span className="text-[#EAB308]">Say</span>
            </h2>
            <p className="text-slate-400 mt-4 text-lg max-w-2xl mx-auto">Hear from principals and coordinators who partnered with us.</p>
          </motion.div>

          {/* 3-column grid */}
          {(() => {
            const TESTIMONIAL_GRADIENTS = [
              'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
              'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            ];
            return (
          <div className="grid md:grid-cols-3 gap-8">
            {(content.schoolTestimonials || getPagesContentSync().schools.schoolTestimonials || []).map((t, i) => {
              const gradient = TESTIMONIAL_GRADIENTS[i % TESTIMONIAL_GRADIENTS.length];
              return (
              <motion.a
                key={i}
                href={t.video}
                target="_blank"
                rel="noopener noreferrer"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.12 }}
                whileHover={{ y: -8, scale: 1.02 }}
                className="group block rounded-3xl overflow-hidden relative"
                style={{ background: gradient }}
              >
                {/* Decorative circles */}
                <div className="absolute -top-10 -right-10 w-32 h-32 rounded-full bg-white/10 blur-sm" />
                <div className="absolute -bottom-8 -left-8 w-24 h-24 rounded-full bg-white/10 blur-sm" />

                <div className="relative p-7">
                  {/* Top row: avatar + play button */}
                  <div className="flex items-center justify-between mb-5">
                    <div className="flex items-center gap-3">
                      <img src={t.image} alt={t.name} className="w-14 h-14 rounded-2xl object-cover border-2 border-white/30 shadow-lg" referrerPolicy="no-referrer" />
                      <div>
                        <p className="font-bold text-white text-sm drop-shadow-sm">{t.name}</p>
                        <p className="text-white/70 text-xs">{t.role}</p>
                      </div>
                    </div>
                    {/* Play button */}
                    <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all duration-300 shadow-lg">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="white" className="drop-shadow-md ml-0.5"><polygon points="8,5 19,12 8,19" /></svg>
                    </div>
                  </div>

                  {/* Quote */}
                  <div className="bg-white/15 backdrop-blur-sm rounded-2xl p-5 mb-4">
                    <svg className="w-6 h-6 text-white/40 mb-2" fill="currentColor" viewBox="0 0 24 24"><path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983z" /></svg>
                    <p className="text-white text-sm leading-relaxed font-medium">{t.quote}</p>
                  </div>

                  {/* Stars + Watch label */}
                  <div className="flex items-center justify-between">
                    <div className="flex gap-1">
                      {[...Array(5)].map((_, si) => (
                        <svg key={si} className="w-4 h-4 fill-yellow-300 drop-shadow-sm" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <span className="text-white/80 text-xs font-bold uppercase tracking-wider group-hover:text-white transition-colors flex items-center gap-1.5">
                      Watch Video <ArrowUpRight size={12} />
                    </span>
                  </div>
                </div>
              </motion.a>
              );
            })}
          </div>
            );
          })()}
        </div>
      </section>

      {/* Products */}
      <section id="products" className="py-16 px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-5xl font-display font-bold mb-6">
              {content.productsTitle.split(' ').slice(0, -1).join(' ')} <span className="text-purple-500">{content.productsTitle.split(' ').slice(-1)}</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">{content.productsSubtitle}</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {content.products.map((product) => (
              <div key={product.id} className="bg-white/5 p-8 rounded-[2rem] border border-white/5 hover:border-purple-500/30 transition-all group">
                <div className="w-14 h-14 bg-purple-500/10 text-purple-500 rounded-2xl flex items-center justify-center font-bold text-lg mb-6 group-hover:scale-110 transition-transform">
                  {product.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{product.title}</h3>
                <p className="text-slate-400 text-sm leading-relaxed">{product.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="py-14 bg-transparent relative z-10 overflow-hidden">
        <div className="max-w-7xl mx-auto px-8 text-center">
          <h2 className="text-2xl font-bold text-white mb-12" dangerouslySetInnerHTML={{ __html: (content.socialProofHeadline || '30+ schools trust our services for their students').replace(/(\d+\+)/, '<span class="text-[#EAB308]">$1</span>') }} />
        </div>

        {/* Floating Schools Marquee - Row 1 */}
        <div className="relative w-full overflow-hidden mb-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div className="flex gap-4 whitespace-nowrap animate-marquee-ltr">
            {(() => {
              const half = Math.ceil(partnerSchools.length / 2);
              const row1 = partnerSchools.length ? partnerSchools.slice(0, half) : [];
              const items = [...row1, ...row1];
              return items.map((s, i) => (
                <div key={i} className={`flex-shrink-0 px-6 py-3 rounded-full border text-sm font-semibold animate-float-${i % 4} ${PILL_COLORS[i % PILL_COLORS.length]}`}>
                  {s.name}
                </div>
              ));
            })()}
          </div>
        </div>

        {/* Floating Schools Marquee - Row 2 (reverse) */}
        <div className="relative w-full overflow-hidden" style={{ maskImage: 'linear-gradient(to right, transparent, black 8%, black 92%, transparent)' }}>
          <div className="flex gap-4 whitespace-nowrap animate-marquee-rtl">
            {(() => {
              const half = Math.ceil(partnerSchools.length / 2);
              const row2 = partnerSchools.length ? partnerSchools.slice(half) : [];
              const items = [...row2, ...row2];
              return items.map((s, i) => (
                <div key={i} className={`flex-shrink-0 px-6 py-3 rounded-full border text-sm font-semibold animate-float-${(i + 2) % 4} ${PILL_COLORS[(i + 8) % PILL_COLORS.length]}`}>
                  {s.name}
                </div>
              ));
            })()}
          </div>
        </div>


        <style>{`
          @keyframes marquee-ltr {
            0% { transform: translateX(0); }
            100% { transform: translateX(-50%); }
          }
          @keyframes marquee-rtl {
            0% { transform: translateX(-50%); }
            100% { transform: translateX(0); }
          }
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
      </section>

      {/* Contact */}
      <section id="contact" className="py-16 px-8">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-5xl font-display font-bold mb-6">
            {content.contactHeadline.split(' ').slice(0, -1).join(' ')} <span className="text-blue-500">{content.contactHeadline.split(' ').slice(-1)}</span>
          </h2>
          <p className="text-slate-400 text-lg mb-8">{content.contactSubtitle}</p>
          <div className="flex justify-center">
            <button
              onClick={() => setShowMeetingForm(true)}
              className="bg-blue-600 text-white px-20 py-5 rounded-2xl font-bold text-lg hover:shadow-2xl hover:shadow-blue-600/30 transition-all flex items-center gap-3"
            >
              Book a Meeting <ArrowUpRight size={22} />
            </button>
          </div>
        </div>
      </section>

      <MeetingForm isOpen={showMeetingForm} onClose={() => setShowMeetingForm(false)} />
    </div>
  );
};
