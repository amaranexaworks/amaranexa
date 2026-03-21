import { useState, useEffect } from 'react';
import { Terminal, Menu, X, Zap } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { getNavLinks } from '../utils/navStore';
import { EnrollmentForm } from './EnrollmentForm';

export const Navbar = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const [showEnrollmentForm, setShowEnrollmentForm] = useState(false);
  const [navLinks, setNavLinks] = useState([]);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    setNavLinks(getNavLinks().filter(l => l.enabled));
  }, []);

  useEffect(() => {
    const handleVisibility = () => {
      if (!document.hidden) setNavLinks(getNavLinks().filter(l => l.enabled));
    };
    document.addEventListener('visibilitychange', handleVisibility);
    return () => document.removeEventListener('visibilitychange', handleVisibility);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  // Close mobile on route change
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  if (isAdmin) return null;

  return (
    <>
      {/* Gradient top accent line */}
      <div className="fixed top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-brand-primary via-brand-secondary to-brand-accent z-[60]" />

      <nav
        className={`fixed top-[2px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? 'bg-white/95 backdrop-blur-2xl shadow-lg shadow-slate-900/5 border-b border-slate-200/60'
            : 'bg-white/90 backdrop-blur-xl border-b border-slate-100'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 lg:h-18">

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

            {/* Desktop Nav Links */}
            <div className="hidden md:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.href;
                return (
                  <Link
                    key={link.id}
                    to={link.href}
                    className={`relative px-4 py-2 rounded-lg text-sm font-semibold tracking-wide transition-all duration-200 group ${
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
            <div className="flex items-center gap-3">
              {/* CTA button */}
              <button
                onClick={() => setShowEnrollmentForm(true)}
                className="hidden md:flex items-center gap-2 bg-gradient-to-r from-brand-primary to-indigo-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:shadow-xl hover:shadow-brand-primary/30 hover:scale-[1.03] transition-all duration-200 active:scale-95"
              >
                <Zap size={14} className="fill-white" />
                Book a Demo
              </button>

              {/* Mobile hamburger */}
              <button
                className="md:hidden w-9 h-9 flex items-center justify-center rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                {mobileOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-300 ${
            mobileOpen ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="bg-white/95 backdrop-blur-xl border-t border-slate-100 px-6 py-4 space-y-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.id}
                  to={link.href}
                  className={`block px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'text-brand-primary bg-brand-primary/8'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
                  }`}
                >
                  {link.label}
                </Link>
              );
            })}
            <div className="pt-3 pb-1">
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

      {/* Spacer so content doesn't go under fixed nav */}
      <div className="h-[66px]" />

      <EnrollmentForm
        isOpen={showEnrollmentForm}
        onClose={() => setShowEnrollmentForm(false)}
      />
    </>
  );
};
