import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Rocket } from 'lucide-react';

function createConfetti(canvas) {
  const ctx = canvas.getContext('2d');
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;

  const colors = ['#4f46e5', '#06b6d4', '#f59e0b', '#10b981', '#ef4444', '#8b5cf6', '#ec4899', '#f97316'];
  const pieces = [];

  for (let i = 0; i < 200; i++) {
    pieces.push({
      x: canvas.width / 2 + (Math.random() - 0.5) * 200,
      y: canvas.height / 2,
      w: Math.random() * 12 + 4,
      h: Math.random() * 8 + 3,
      color: colors[Math.floor(Math.random() * colors.length)],
      vy: -(Math.random() * 15 + 5),
      vx: (Math.random() - 0.5) * 15,
      gravity: 0.25,
      rot: Math.random() * 360,
      rotSpeed: (Math.random() - 0.5) * 15,
      opacity: 1,
    });
  }

  let frame = 0;
  const maxFrames = 250;

  function draw() {
    if (frame > maxFrames) {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      return;
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    for (const p of pieces) {
      p.vy += p.gravity;
      p.y += p.vy;
      p.x += p.vx;
      p.vx *= 0.99;
      p.rot += p.rotSpeed;
      if (frame > maxFrames - 80) {
        p.opacity = Math.max(0, p.opacity - 0.015);
      }

      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate((p.rot * Math.PI) / 180);
      ctx.globalAlpha = p.opacity;
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    }

    frame++;
    requestAnimationFrame(draw);
  }

  draw();

  const handleResize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };
  window.addEventListener('resize', handleResize);
  return () => window.removeEventListener('resize', handleResize);
}

export default function LaunchCover({ children }) {
  const alreadyLaunched = sessionStorage.getItem('amaranexa-launched') === 'true';
  const [launched, setLaunched] = useState(alreadyLaunched);
  const [showWelcome, setShowWelcome] = useState(false);
  const canvasRef = useRef(null);
  const [count, setCount] = useState(null);

  const handleLaunch = useCallback(() => {
    setCount(3);
  }, []);

  useEffect(() => {
    if (count === null) return;
    if (count > 0) {
      const t = setTimeout(() => setCount(count - 1), 800);
      return () => clearTimeout(t);
    }
    // count === 0, launch!
    setLaunched(true);
    sessionStorage.setItem('amaranexa-launched', 'true');
    setShowWelcome(true);
    if (canvasRef.current) {
      createConfetti(canvasRef.current);
    }
    // Hide welcome after 4 seconds
    const t = setTimeout(() => setShowWelcome(false), 4000);
    return () => clearTimeout(t);
  }, [count]);

  return (
    <>
      {/* Confetti canvas - always present, above everything */}
      <canvas
        ref={canvasRef}
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 9999 }}
      />

      {/* Welcome message after launch */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            key="welcome"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, y: -40 }}
            transition={{ duration: 0.6, ease: 'easeOut' }}
            className="fixed inset-0 flex items-center justify-center pointer-events-none"
            style={{ zIndex: 9998 }}
          >
            <div className="text-center">
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-5xl md:text-7xl font-display font-black text-brand-primary drop-shadow-lg"
              >
                Welcome!
              </motion.h2>
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8, duration: 0.6 }}
                className="text-xl md:text-2xl text-slate-600 font-medium mt-3"
              >
                to AmaraNexa AI Education Labs
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {!launched && (
          <motion.div
            key="cover"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            className="fixed inset-0 flex flex-col items-center justify-center overflow-hidden"
            style={{ zIndex: 9998 }}
          >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900" />

            {/* Animated particles */}
            <div className="absolute inset-0 overflow-hidden">
              {Array.from({ length: 30 }).map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1 h-1 rounded-full bg-white/20"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                  }}
                  animate={{
                    y: [0, -30, 0],
                    opacity: [0.1, 0.5, 0.1],
                  }}
                  transition={{
                    duration: 3 + Math.random() * 3,
                    repeat: Infinity,
                    delay: Math.random() * 3,
                  }}
                />
              ))}
            </div>

            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.03]"
              style={{
                backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.5) 1px, transparent 1px)',
                backgroundSize: '40px 40px',
              }}
            />

            {/* Ambient glow */}
            <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-primary/20 blur-[150px] rounded-full" />

            {/* Content */}
            <div className="relative z-10 text-center px-8">
              {/* Logo */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.2 }}
                className="mb-8"
              >
                <div className="inline-flex items-center gap-3 mb-6">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-secondary flex items-center justify-center shadow-xl shadow-brand-primary/30">
                    <span className="text-white text-2xl font-mono font-bold">&gt;_</span>
                  </div>
                </div>
                <h1 className="text-5xl md:text-7xl font-display font-black text-white tracking-tight mb-3">
                  AMARA<span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary">NEXA</span>
                </h1>
                <p className="text-lg text-white/40 font-medium tracking-[0.3em] uppercase">
                  AI Education Labs
                </p>
              </motion.div>

              {/* Tagline */}
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="text-white/60 text-lg md:text-xl mb-12 max-w-md mx-auto"
              >
                The future of school coding is here.
              </motion.p>

              {/* Countdown or Launch button */}
              {count !== null && count > 0 ? (
                <motion.div
                  key={count}
                  initial={{ scale: 2, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  exit={{ scale: 0.5, opacity: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-8xl font-display font-black text-transparent bg-clip-text bg-gradient-to-r from-brand-primary to-brand-secondary"
                >
                  {count}
                </motion.div>
              ) : (
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLaunch}
                  className="group relative inline-flex items-center gap-3 px-12 py-5 rounded-2xl font-bold text-lg text-white overflow-hidden"
                >
                  {/* Button gradient bg */}
                  <div className="absolute inset-0 bg-gradient-to-r from-brand-primary to-brand-secondary rounded-2xl" />
                  {/* Shimmer */}
                  <div
                    className="absolute inset-0 opacity-0 group-hover:opacity-30"
                    style={{
                      background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.4), transparent)',
                      backgroundSize: '200% 100%',
                      animation: 'shimmer 2s infinite',
                    }}
                  />
                  {/* Shadow */}
                  <div className="absolute inset-0 rounded-2xl shadow-2xl shadow-brand-primary/40" />

                  <Rocket size={22} className="relative z-10 group-hover:rotate-[-20deg] transition-transform" />
                  <span className="relative z-10">Launch Website</span>
                </motion.button>
              )}
            </div>

            {/* Bottom text */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.5 }}
              className="absolute bottom-8 text-white/20 text-xs tracking-widest uppercase"
            >
              Click to explore
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Website content - always rendered behind */}
      {children}
    </>
  );
}
