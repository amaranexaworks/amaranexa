import { useState, useEffect, useRef } from 'react';
import { Terminal, Menu, X, Zap, ChevronDown, MessageCircle, Code, Bot, Globe, Shield, Gamepad2, Database, BookOpen, GraduationCap, ArrowRight, Sparkles } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getNavLinks } from '../utils/navStore';
import { EnrollmentForm } from './EnrollmentForm';

const COURSE_ITEMS = [
  { icon: Bot, label: 'AI & Machine Learning', desc: 'Build real AI models with Python', color: 'text-violet-500', bg: 'bg-violet-50' },
  { icon: Globe, label: 'Web Development', desc: 'React, HTML/CSS, full-stack apps', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Code, label: 'Python Programming', desc: 'From beginner to advanced', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Gamepad2, label: 'Game Development', desc: 'Unity, C# & 2D/3D games', color: 'text-orange-500', bg: 'bg-orange-50' },
  { icon: Shield, label: 'Cybersecurity', desc: 'Ethical hacking & defence', color: 'text-red-500', bg: 'bg-red-50' },
  { icon: Database, label: 'Data Science', desc: 'Analytics, charts & insights', color: 'text-cyan-500', bg: 'bg-cyan-50' },
];

export const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [coursesOpen, setCoursesOpen] = useState(false);
  const [announcementVisible, setAnnouncementVisible] = useState(true);
  const dropdownRef = useRef(null);
  const closeTimer = useRef(null);

  useEffect(() => {
    getNavLinks().then(links => setNavLinks(links.filter(l => l.enabled)));
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) getNavLinks().then(links => setNavLinks(links.filter(l => l.enabled)));
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); setCoursesOpen(false); }, [location.pathname]);

  const openDropdown = () => { clearTimeout(closeTimer.current); setCoursesOpen(true); };
  const closeDropdown = () => { closeTimer.current = setTimeout(() => setCoursesOpen(false), 150); };

  if (isAdmin) return null;

  const ANNOUNCEMENT_BAR_H = announcementVisible ? 36 : 0;

  return (
    <>
      {/* ── Announcement Bar ── */}
      {announcementVisible && (
        <div className="fixed top-0 left-0 right-0 z-[70] h-9 bg-gradient-to-r from-brand-primary via-indigo-500 to-brand-secondary flex items-center justify-center px-4">
          <div className="flex items-center gap-2 text-white text-xs font-semibold">
            <Sparkles size={12} className="shrink-0 animate-pulse" />
            <span>Limited school partnerships open for 2026 — </span>
            <button onClick={() => setShowEnrollmentForm(true)} className="underline underline-offset-2 hover:no-underline font-bold">
              Reserve your slot →
            </button>
          </div>
          <button
            onClick={() => setAnnouncementVisible(false)}
            className="absolute right-3 text-white/70 hover:text-white transition-colors"
          >
            <X size={14} />
          </button>
        </div>
      )}

      {/* ── Gradient accent line ── */}
      <div
        className="fixed left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent z-[60]"
        style={{ top: ANNOUNCEMENT_BAR_H }}
      />

      {/* ── Main Nav ── */}
      <nav
        className={`fixed left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-slate-900/5 border-b border-slate-200/60'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-100'
        }`}
        style={{ top: ANNOUNCEMENT_BAR_H + 2 }}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">

            {/* Logo */}
            <Link to="/" className="flex items-center gap-3 group shrink-0">
              <div className="relative">
                <div className="absolute inset-0 bg-brand-primary rounded-xl blur opacity-40 group-hover:opacity-70 transition-opacity duration-300" />
                <div className="relative bg-gradient-to-br from-brand-primary to-brand-secondary p-2 rounded-xl group-hover:scale-105 transition-transform duration-300 shadow-lg">
                  <Terminal size={20} strokeWidth={2.5} className="text-white" />
                </div>
              </div>
              <div className="flex flex-col leading-none">
                <span className="font-display font-extrabold text-xl tracking-tight text-slate-900">
                  AMARA<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">NEXA</span>
                </span>
                <span className="text-[9px] font-bold tracking-[0.2em] text-slate-400 uppercase">AI Education Labs</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <div className="hidden md:flex items-center gap-0.5">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                const isCourses = link.href === '/courses';

                if (isCourses) {
                  return (
                    <div
                      key={link.id}
                      className="relative"
                      ref={dropdownRef}
                      onMouseEnter={openDropdown}
                      onMouseLeave={closeDropdown}
                    >
                      <button
                        className={`relative flex items-center gap-1 px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                          isActive || coursesOpen
                            ? 'text-brand-primary bg-brand-primary/8'
                            : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                        }`}
                      >
                        {link.label}
                        <ChevronDown size={14} className={`transition-transform duration-200 ${coursesOpen ? 'rotate-180' : ''}`} />
                        {isActive && (
                          <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full" />
                        )}
                      </button>

                      {/* Mega Dropdown */}
                      <div
                        className={`absolute top-full left-1/2 -translate-x-1/2 mt-2 w-[520px] transition-all duration-200 ${
                          coursesOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'
                        }`}
                      >
                        <div className="bg-white rounded-2xl shadow-2xl shadow-slate-900/10 border border-slate-100 overflow-hidden">
                          <div className="px-5 pt-4 pb-2 border-b border-slate-50">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest">What we teach</p>
                          </div>
                          <div className="p-3 grid grid-cols-2 gap-1">
                            {COURSE_ITEMS.map((item) => (
                              <Link
                                key={item.label}
                                to="/courses"
                                className="flex items-start gap-3 p-3 rounded-xl hover:bg-slate-50 transition-colors group"
                              >
                                <div className={`${item.bg} p-2 rounded-lg shrink-0`}>
                                  <item.icon size={16} className={item.color} />
                                </div>
                                <div>
                                  <p className="text-sm font-semibold text-slate-800 group-hover:text-brand-primary transition-colors">{item.label}</p>
                                  <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                                </div>
                              </Link>
                            ))}
                          </div>
                          <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
                            <p className="text-xs text-slate-500">Grades 5–12 · No experience needed</p>
                            <Link to="/courses" className="flex items-center gap-1 text-xs font-bold text-brand-primary hover:gap-2 transition-all">
                              View all courses <ArrowRight size={12} />
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 ${
                      isActive
                        ? 'text-brand-primary bg-brand-primary/8'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-full" />
                    )}
                  </Link>
                );
              })}
            </div>

            {/* Right side */}
            <div className="hidden md:flex items-center gap-2">
              {/* WhatsApp */}
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition-colors"
              >
                <MessageCircle size={16} />
                <span className="text-xs">WhatsApp</span>
              </a>

              {/* Divider */}
              <div className="w-px h-5 bg-slate-200" />

              {/* Book a Demo */}
              <button
                onClick={() => setShowEnrollmentForm(true)}
                className="flex items-center gap-2 bg-gradient-to-r from-brand-primary to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-brand-primary/30 hover:scale-[1.03] transition-all duration-200 active:scale-95"
              >
                <Zap size={14} className="fill-white" />
                Book a Demo
              </button>
            </div>

            {/* Mobile hamburger */}
            <button
              className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              onClick={() => setMobileOpen(v => !v)}
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${mobileOpen ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              const isCourses = link.href === '/courses';
              return (
                <div key={link.id}>
                  <Link
                    to={link.href}
                    className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                      isActive ? 'text-brand-primary bg-brand-primary/8' : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                    }`}
                  >
                    {link.label}
                    {isCourses && <ChevronDown size={14} />}
                  </Link>
                  {isCourses && (
                    <div className="ml-4 mt-1 space-y-0.5">
                      {COURSE_ITEMS.map(item => (
                        <Link key={item.label} to="/courses" className="flex items-center gap-2 px-3 py-2 rounded-lg text-xs text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors">
                          <item.icon size={12} className={item.color} />
                          {item.label}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
            <div className="pt-3 space-y-2">
              <a
                href="https://wa.me/919999999999"
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-center gap-2 border border-emerald-200 text-emerald-600 px-5 py-3 rounded-xl text-sm font-bold"
              >
                <MessageCircle size={16} />
                Chat on WhatsApp
              </a>
              <button
                onClick={() => { setShowEnrollmentForm(true); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-brand-primary to-indigo-700 text-white px-5 py-3 rounded-xl text-sm font-bold"
              >
                <Zap size={14} className="fill-white" />
                Book a Demo
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Spacer */}
      <div style={{ height: ANNOUNCEMENT_BAR_H + 66 }} />

      <EnrollmentForm isOpen={showEnrollmentForm} onClose={() => setShowEnrollmentForm(false)} />
    </>
  );
};
