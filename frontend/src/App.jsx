import { useState, useEffect, useRef } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';

function CursorGlow() {
  const pos = useRef({ x: -400, y: -400 });
  const divRef = useRef(null);

  useEffect(() => {
    let raf;
    const move = (e) => {
      pos.current = { x: e.clientX, y: e.clientY };
      if (!raf) {
        raf = requestAnimationFrame(() => {
          if (divRef.current) {
            divRef.current.style.transform = `translate(${pos.current.x - 150}px, ${pos.current.y - 150}px)`;
          }
          raf = null;
        });
      }
    };
    window.addEventListener('mousemove', move);
    return () => { window.removeEventListener('mousemove', move); cancelAnimationFrame(raf); };
  }, []);

  return (
    <div
      ref={divRef}
      className="fixed top-0 left-0 pointer-events-none z-[9998] rounded-full"
      style={{
        width: 300,
        height: 300,
        background: 'radial-gradient(circle, rgba(79,70,229,0.10) 0%, rgba(6,182,212,0.05) 40%, transparent 70%)',
        willChange: 'transform',
      }}
    />
  );
}

function ScrollProgressBar() {
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const pct = (h.scrollTop / (h.scrollHeight - h.clientHeight)) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div className="fixed top-0 left-0 right-0 z-[999] h-[3px] pointer-events-none">
      <div
        className="h-full"
        style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #00b96b, #3b82f6, #8b5cf6)', transition: 'width 0.05s linear' }}
      />
    </div>
  );
}
import { Navbar } from './components/Navbar';
import { ChatWidget } from './components/ChatWidget';
import { Footer } from './components/Footer';
import { Home } from './pages/Home';
import { Courses } from './pages/Courses';
import { Schools } from './pages/Schools';
import { Blog } from './pages/Blog';
import { SummerCamps } from './pages/SummerCamps';
import { Admin } from './pages/Admin';

// ── WhatsApp number — update this to your real number (country code + number, no + or spaces)
const WHATSAPP_NUMBER = '919059690058';
const WHATSAPP_MESSAGE = 'Hi! I\'m interested in Amara Nexa programs. Can you tell me more?';

function WhatsAppButton() {
  const location = useLocation();
  if (location.pathname === '/admin') return null;

  const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(WHATSAPP_MESSAGE)}`;

  return (
    <motion.a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay: 1, type: 'spring', stiffness: 260, damping: 20 }}
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.95 }}
      className="fixed bottom-8 right-8 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-2xl"
      style={{ backgroundColor: '#25D366', boxShadow: '0 8px 32px rgba(37,211,102,0.4)' }}
      title="Chat with us on WhatsApp"
    >
      {/* WhatsApp SVG icon */}
      <svg width="28" height="28" viewBox="0 0 32 32" fill="white" xmlns="http://www.w3.org/2000/svg">
        <path d="M16 2C8.268 2 2 8.268 2 16c0 2.492.672 4.826 1.845 6.833L2 30l7.374-1.818A13.93 13.93 0 0 0 16 30c7.732 0 14-6.268 14-14S23.732 2 16 2zm0 25.4a11.37 11.37 0 0 1-5.8-1.592l-.416-.247-4.373 1.078 1.11-4.254-.27-.435A11.36 11.36 0 0 1 4.6 16C4.6 9.704 9.704 4.6 16 4.6S27.4 9.704 27.4 16 22.296 27.4 16 27.4zm6.22-8.52c-.34-.17-2.01-1-2.327-.11-.316.89-1.23 1.44-1.43 1.55-.19.1-.38.11-.72-.04-.34-.17-1.44-.53-2.74-1.69-1.01-.9-1.7-2.01-1.9-2.35-.19-.34-.02-.52.15-.69.15-.15.34-.38.51-.57.17-.19.22-.33.33-.55.11-.22.06-.41-.03-.57-.09-.17-.72-1.74-.99-2.38-.26-.62-.53-.54-.72-.55h-.62c-.22 0-.57.08-.87.41-.3.33-1.14 1.12-1.14 2.73s1.17 3.16 1.33 3.38c.17.22 2.3 3.51 5.57 4.92.78.34 1.39.54 1.86.69.78.25 1.49.21 2.05.13.63-.09 1.93-.79 2.2-1.55.27-.76.27-1.41.19-1.55-.08-.13-.3-.22-.64-.39z"/>
      </svg>
    </motion.a>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isAdmin = location.pathname === '/admin';
  const isSummerCamp = location.pathname === '/summer-camps';
  const isSchools = location.pathname === '/schools';
  const hideNavFooter = isAdmin || isSummerCamp || isSchools;

  return (
      <div className="min-h-screen bg-white font-sans text-zinc-900 selection:bg-brand-primary selection:text-white">
        <CursorGlow />
        <ScrollProgressBar />
        {!hideNavFooter && <Navbar />}
        <main>
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 18, filter: 'blur(4px)' }}
              animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
              exit={{ opacity: 0, y: -12, filter: 'blur(2px)' }}
              transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            >
              <Routes location={location}>
                <Route path="/" element={<Home />} />
                <Route path="/courses" element={<Courses />} />
                <Route path="/schools" element={<Schools />} />
                <Route path="/blog" element={<Blog />} />
                <Route path="/summer-camps" element={<SummerCamps />} />
                <Route path="/admin" element={<Admin />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
        {!hideNavFooter && <Footer />}
        <WhatsAppButton />
        <ChatWidget />
      </div>
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppContent />
    </BrowserRouter>
  );
}
