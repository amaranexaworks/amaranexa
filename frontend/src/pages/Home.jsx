import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ChevronDown, Play, CheckCircle2, Zap } from 'lucide-react';

function useAutoScroll(speed = 0.7) {
  useEffect(() => {
    let raf;
    let hovered = false;
    let userScrolled = false;
    let resumeTimer;

    const pause = () => { hovered = true; };
    const resume = () => {
      hovered = false;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { userScrolled = false; }, 800);
    };
    const onWheel = () => {
      userScrolled = true;
      clearTimeout(resumeTimer);
      resumeTimer = setTimeout(() => { if (!hovered) userScrolled = false; }, 2500);
    };

    const frame = () => {
      if (!hovered && !userScrolled) {
        const atBottom = window.scrollY + window.innerHeight >= document.body.scrollHeight - 4;
        if (!atBottom) window.scrollBy(0, speed);
      }
      raf = requestAnimationFrame(frame);
    };

    document.body.addEventListener('mouseenter', pause);
    document.body.addEventListener('mouseleave', resume);
    document.addEventListener('wheel', onWheel, { passive: true });
    document.addEventListener('touchstart', onWheel, { passive: true });

    const startTimer = setTimeout(() => { raf = requestAnimationFrame(frame); }, 1200);

    return () => {
      clearTimeout(startTimer);
      clearTimeout(resumeTimer);
      cancelAnimationFrame(raf);
      document.body.removeEventListener('mouseenter', pause);
      document.body.removeEventListener('mouseleave', resume);
      document.removeEventListener('wheel', onWheel);
      document.removeEventListener('touchstart', onWheel);
    };
  }, [speed]);
}

const TECH_STACK = [
  { icon: '🐍', name: 'Python' }, { icon: '⚛️', name: 'React' }, { icon: '🤖', name: 'TensorFlow' },
  { icon: '📱', name: 'Flutter' }, { icon: '🎮', name: 'Unity' }, { icon: '⚡', name: 'JavaScript' },
  { icon: '🌐', name: 'HTML & CSS' }, { icon: '🔌', name: 'Arduino' }, { icon: '🗄️', name: 'SQL' },
  { icon: '🎨', name: 'Figma' }, { icon: '📊', name: 'Data Science' }, { icon: '🔒', name: 'Cyber Security' },
];

import { Hero, LifeAtAmara, StudentGallery, HeroTestimonials, PartnerSchools } from '../components/Hero';
import { Perks } from '../components/Perks';
import { CTA } from '../components/CTA';
import { getHomeContent, getHomeContentSync } from '../utils/homeStore';

const MENTORS = [
  { name: 'Arjun Mehta', role: 'AI & Machine Learning Lead', exp: '6 years at Google Brain', avatar: 'https://i.pravatar.cc/300?u=mentor1', tags: ['Python', 'TensorFlow', 'LLMs'] },
  { name: 'Priya Nair', role: 'Full-Stack Web Expert', exp: '5 years at Flipkart', avatar: 'https://i.pravatar.cc/300?u=mentor2', tags: ['React', 'Node.js', 'UI/UX'] },
  { name: 'Rahul Sinha', role: 'Robotics & Hardware', exp: '4 years at ISRO', avatar: 'https://i.pravatar.cc/300?u=mentor3', tags: ['Arduino', 'C++', 'IoT'] },
  { name: 'Sneha Kapoor', role: 'Game Dev & Creative Tech', exp: '5 years at Ubisoft', avatar: 'https://i.pravatar.cc/300?u=mentor4', tags: ['Unity', 'C#', 'Game Design'] },
];

const FAQS = [
  { q: 'What age group is Amara Nexa for?', a: 'Our programs are designed for students in Grade 5 through Grade 12 (ages 10–18). The curriculum scales with the student\'s level — beginners start with visual coding and HTML; advanced students dive into AI model training and full-stack apps.' },
  { q: 'Do students need a personal laptop?', a: 'No. Every Amara Nexa lab is equipped with high-performance RTX laptops at each workstation. Students only need to show up — all hardware, software, and accounts are set up and ready.' },
  { q: 'How does a school partner with Amara Nexa?', a: 'Schools fill out our partnership form or book a demo call. We visit the campus, assess a suitable room, and present a full lab setup proposal within 48 hours. Installation takes about 7 working days.' },
  { q: 'What does the monthly stipend program look like?', a: 'Students who maintain 90%+ attendance and complete their monthly project milestones receive a fixed stipend deposited to their UPI/bank account. This teaches financial responsibility alongside technical skills.' },
  { q: 'Is coding experience required to join?', a: 'Not at all. We start from absolute zero. Our first modules are visual and drag-based, designed to build intuition before introducing text-based code. Students progress at their own pace within a structured curriculum.' },
  { q: 'What happens after a student completes the program?', a: 'Students earn a Amara Nexa certification, build a portfolio of real projects, and gain access to our internship and startup incubation network. Top performers are referred directly to partner companies for internships.' },
];

const BUILD_PROJECTS = [
  {
    id: 'chatbot', label: 'AI Chatbot', emoji: '🤖', color: '#7c3aed', bg: 'from-violet-50 to-purple-50', border: 'border-violet-200',
    steps: [
      { icon: '📦', title: 'Set up Python environment', code: 'pip install google-generativeai' },
      { icon: '🔑', title: 'Connect to Gemini API', code: 'import google.generativeai as genai\ngenai.configure(api_key="YOUR_KEY")' },
      { icon: '🧠', title: 'Create the AI model', code: 'model = genai.GenerativeModel("gemini-pro")\nchat = model.start_chat()' },
      { icon: '💬', title: 'Send your first message', code: 'response = chat.send_message("Hello!")\nprint(response.text)' },
      { icon: '🚀', title: 'Your chatbot is live!', code: '# 🎉 Running on localhost:3000\n# Students built this in Week 2!' },
    ],
  },
  {
    id: 'game', label: '2D Game', emoji: '🎮', color: '#0ea5e9', bg: 'from-sky-50 to-blue-50', border: 'border-sky-200',
    steps: [
      { icon: '⚙️', title: 'Install Pygame', code: 'pip install pygame' },
      { icon: '🖥️', title: 'Create game window', code: 'import pygame\nscreen = pygame.display.set_mode((800, 600))' },
      { icon: '🎨', title: 'Draw the player', code: 'player = pygame.Rect(400, 500, 50, 50)\npygame.draw.rect(screen, (0,200,100), player)' },
      { icon: '🕹️', title: 'Add keyboard controls', code: 'keys = pygame.key.get_pressed()\nif keys[pygame.K_LEFT]: player.x -= 5' },
      { icon: '🏆', title: 'Game is playable!', code: '# 🎉 Running at 60 FPS\n# Students built this in Week 3!' },
    ],
  },
  {
    id: 'website', label: 'Live Website', emoji: '🌐', color: '#10b981', bg: 'from-emerald-50 to-green-50', border: 'border-emerald-200',
    steps: [
      { icon: '📁', title: 'Create project folder', code: 'mkdir my-website && cd my-website\nnpm create vite@latest .' },
      { icon: '🎨', title: 'Write your first component', code: 'export default function App() {\n  return <h1>Hello World!</h1>\n}' },
      { icon: '💅', title: 'Style with Tailwind CSS', code: '<h1 className="text-4xl font-bold\n  text-blue-600 text-center">\n  Hello World!\n</h1>' },
      { icon: '⚡', title: 'Add interactivity', code: 'const [count, setCount] = useState(0)\n<button onClick={() => setCount(c => c+1)}>\n  Clicked {count} times\n</button>' },
      { icon: '🌍', title: 'Deploy to the internet!', code: '# 🎉 Live at my-site.vercel.app\n# Students built this in Week 4!' },
    ],
  },
  {
    id: 'ai-model', label: 'AI Image Classifier', emoji: '🧠', color: '#f59e0b', bg: 'from-amber-50 to-yellow-50', border: 'border-amber-200',
    steps: [
      { icon: '📦', title: 'Install TensorFlow', code: 'pip install tensorflow numpy matplotlib' },
      { icon: '📸', title: 'Load training images', code: 'from tensorflow.keras.datasets import cifar10\n(x_train, y_train), _ = cifar10.load_data()' },
      { icon: '🏗️', title: 'Build neural network', code: 'model = Sequential([\n  Conv2D(32, (3,3), activation="relu"),\n  MaxPooling2D(),\n  Dense(10, activation="softmax")\n])' },
      { icon: '🔥', title: 'Train the model', code: 'model.compile(optimizer="adam",\n  loss="sparse_categorical_crossentropy")\nmodel.fit(x_train, y_train, epochs=10)' },
      { icon: '✅', title: 'Model is classifying images!', code: '# 🎉 Accuracy: 94.2%\n# Students built this in Week 6!' },
    ],
  },
];

function BuildDemo() {
  const [selected, setSelected] = useState(null);
  const [step, setStep] = useState(0);
  const [techStack, setTechStack] = useState(TECH_STACK);
  useEffect(() => { getHomeContent().then(c => { if (c.techStack?.length) setTechStack(c.techStack); }); }, []);
  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => { if (c.techStack?.length) setTechStack(c.techStack); }); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const project = BUILD_PROJECTS.find(p => p.id === selected);

  const startDemo = (id) => {
    clearInterval(intervalRef.current);
    setSelected(id);
    setStep(0);
    setRunning(true);
  };

  useEffect(() => {
    if (!running || !project) return;
    if (step >= project.steps.length - 1) { setRunning(false); return; }
    intervalRef.current = setTimeout(() => setStep(s => s + 1), 1400);
    return () => clearTimeout(intervalRef.current);
  }, [running, step, project]);

  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-6xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 mb-5">
            <Zap size={13} className="text-emerald-600" />
            <span className="text-xs font-black text-emerald-600 uppercase tracking-[0.2em]">Live Preview</span>
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">Build in <span style={{ background: 'linear-gradient(135deg,#4f46e5,#06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>60 Seconds</span></h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">Pick a project and watch exactly what a student builds in their first weeks at Amara Nexa.</p>
        </motion.div>

        {/* Project type selector */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
          {BUILD_PROJECTS.map((p, i) => (
            <motion.button
              key={p.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08 }}
              whileHover={{ y: -4 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => startDemo(p.id)}
              className={`relative p-5 rounded-[1.5rem] border-2 text-left transition-all ${selected === p.id ? p.border + ' shadow-lg' : 'border-slate-100 hover:border-slate-200'} bg-white`}
            >
              {selected === p.id && (
                <motion.div layoutId="selector" className={`absolute inset-0 rounded-[1.4rem] bg-gradient-to-br ${p.bg} -z-10`} />
              )}
              <span className="text-3xl mb-3 block">{p.emoji}</span>
              <p className="font-bold text-slate-900 text-sm">{p.label}</p>
              <p className="text-slate-400 text-xs mt-0.5 flex items-center gap-1">
                <Play size={10} fill="currentColor" /> Click to demo
              </p>
            </motion.button>
          ))}
        </div>

        {/* Demo terminal */}
        <AnimatePresence mode="wait">
          {project && (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="rounded-[2rem] overflow-hidden border border-slate-200 shadow-2xl"
            >
              <div className="flex items-center gap-2 px-6 py-4 bg-slate-900">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
                <span className="ml-3 text-slate-400 text-xs font-mono">{project.label} — Amara Nexa Lab</span>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-xs text-slate-500">Step {step + 1}/{project.steps.length}</span>
                  {running && <motion.div className="w-2 h-2 rounded-full bg-green-400" animate={{ opacity: [1, 0.3, 1] }} transition={{ duration: 1, repeat: Infinity }} />}
                  {!running && step === project.steps.length - 1 && <CheckCircle2 size={14} className="text-green-400" />}
                </div>
              </div>
              <div className="grid md:grid-cols-2 bg-slate-950">
                <div className="border-r border-slate-800 p-6 space-y-2">
                  {project.steps.map((s, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: i <= step ? 1 : 0.25, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className={`flex items-center gap-3 p-3 rounded-xl transition-all ${i === step ? 'bg-white/10' : ''}`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center text-sm shrink-0 ${i < step ? 'bg-green-500/20' : i === step ? 'bg-white/10' : 'bg-white/5'}`}>
                        {i < step ? <CheckCircle2 size={14} className="text-green-400" /> : <span>{s.icon}</span>}
                      </div>
                      <span className={`text-sm font-medium ${i <= step ? 'text-white' : 'text-slate-600'}`}>{s.title}</span>
                    </motion.div>
                  ))}
                </div>
                <div className="p-6 font-mono">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={step}
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -6 }}
                      transition={{ duration: 0.3 }}
                    >
                      <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest">// {project.steps[step].title}</p>
                      <pre className="text-sm leading-7 whitespace-pre-wrap" style={{ color: '#a5f3fc' }}>{project.steps[step].code}</pre>
                    </motion.div>
                  </AnimatePresence>
                  {!running && step === project.steps.length - 1 && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="mt-8">
                      <button
                        onClick={() => startDemo(project.id)}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold text-white"
                        style={{ background: `linear-gradient(135deg, ${project.color}, ${project.color}99)` }}
                      >
                        <Play size={13} fill="white" /> Replay Demo
                      </button>
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {!selected && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12 text-slate-400">
            <div className="text-5xl mb-4">👆</div>
            <p className="font-medium">Pick a project type above to see the magic</p>
          </motion.div>
        )}

        {/* Tech Marquee — always visible below */}
        <div className="mt-12 -mx-8 overflow-hidden border-t border-slate-100 pt-10">
          <p className="text-center text-[10px] font-black text-slate-300 uppercase tracking-[0.35em] mb-5">Technologies our students master</p>
          <div className="relative flex overflow-hidden mb-3">
            <motion.div
              animate={{ x: [0, `-${techStack.length * 160}px`] }}
              transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}
              className="flex gap-3 shrink-0"
            >
              {[...techStack, ...techStack, ...techStack].map((tech, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 shrink-0 hover:border-brand-primary/30 transition-colors">
                  <span className="text-lg">{tech.icon}</span>
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{tech.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
          <div className="relative flex overflow-hidden">
            <motion.div
              animate={{ x: [`-${techStack.length * 80}px`, '0px'] }}
              transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
              className="flex gap-3 shrink-0"
            >
              {[...techStack.slice().reverse(), ...techStack.slice().reverse(), ...techStack.slice().reverse()].map((tech, i) => (
                <div key={i} className="flex items-center gap-2 bg-slate-50 border border-slate-100 rounded-2xl px-4 py-2.5 shrink-0 hover:border-brand-primary/30 transition-colors">
                  <span className="text-lg">{tech.icon}</span>
                  <span className="text-xs font-bold text-slate-600 whitespace-nowrap">{tech.name}</span>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}

function MeetMentors() {
  const [mentors, setMentors] = useState(MENTORS);
  useEffect(() => { getHomeContent().then(c => { if (c.mentors?.length) setMentors(c.mentors); }); }, []);
  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => { if (c.mentors?.length) setMentors(c.mentors); }); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-50 border border-violet-200 mb-5">
            <span className="text-xs font-black text-violet-600 uppercase tracking-[0.2em]">Expert Instructors</span>
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900 leading-tight">Meet the <span className="text-gradient">Mentors</span></h2>
          <p className="text-slate-500 mt-4 text-lg max-w-xl mx-auto">Industry veterans who left big tech to build the next generation of creators.</p>
        </motion.div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {mentors.map((m, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              whileHover={{ y: -6 }}
              className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all overflow-hidden group"
            >
              <div className="relative h-52 overflow-hidden">
                <img src={m.avatar} alt={m.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" referrerPolicy="no-referrer" />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/60 to-transparent" />
              </div>
              <div className="p-6">
                <h3 className="font-black text-slate-900 text-lg">{m.name}</h3>
                <p className="text-brand-primary text-xs font-bold mb-1">{m.role}</p>
                <p className="text-slate-400 text-xs mb-4">{m.exp}</p>
                <div className="flex flex-wrap gap-1.5">
                  {m.tags.map(tag => (
                    <span key={tag} className="px-2 py-0.5 bg-slate-50 border border-slate-100 rounded-full text-[10px] font-bold text-slate-500">{tag}</span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection() {
  const [open, setOpen] = useState(null);
  const [faqs, setFaqs] = useState(FAQS);
  useEffect(() => { getHomeContent().then(c => { if (c.faqs?.length) setFaqs(c.faqs); }); }, []);
  useEffect(() => {
    const sync = () => { if (!document.hidden) getHomeContent().then(c => { if (c.faqs?.length) setFaqs(c.faqs); }); };
    document.addEventListener('visibilitychange', sync);
    return () => document.removeEventListener('visibilitychange', sync);
  }, []);
  return (
    <section className="py-24 px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-50 border border-amber-200 mb-5">
            <span className="text-xs font-black text-amber-600 uppercase tracking-[0.2em]">Got Questions?</span>
          </div>
          <h2 className="text-5xl font-display font-bold text-slate-900">Frequently Asked</h2>
        </motion.div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="bg-white rounded-[1.5rem] border border-slate-100 shadow-sm overflow-hidden"
            >
              <button
                onClick={() => setOpen(open === i ? null : i)}
                className="w-full flex items-center justify-between p-6 text-left hover:bg-slate-50 transition-colors"
              >
                <span className="font-bold text-slate-900 pr-4">{faq.q}</span>
                <motion.div animate={{ rotate: open === i ? 180 : 0 }} transition={{ duration: 0.25 }} className="shrink-0">
                  <ChevronDown size={18} className="text-slate-400" />
                </motion.div>
              </button>
              <AnimatePresence>
                {open === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                    className="overflow-hidden"
                  >
                    <p className="px-6 pb-6 text-slate-500 text-sm leading-relaxed border-t border-slate-50 pt-4">{faq.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}


export const Home = () => {
  // useAutoScroll(0.7);

  return (
    <div className="bg-white">
      <Hero />
      <LifeAtAmara />
      <BuildDemo />
      <StudentGallery />
      <Perks />
      <HeroTestimonials />
      <PartnerSchools />
      <MeetMentors />
      <FAQSection />
      <CTA />
    </div>
  );
};
