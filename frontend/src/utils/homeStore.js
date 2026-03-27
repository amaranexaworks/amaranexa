import { fetchPageContent, savePageContent } from './api';

const DEFAULT_HOME_CONTENT = {
  hero: {
    badge: "The Future of Education",
    headlineLine1: "BUILD THE",
    headlineGradient: "NEXT GEN OF",
    headlineLine3: "CREATORS.",
    subtitle: "We transform school classrooms into high-tech AI development labs. Real hardware, professional mentors, and the skills to lead the future.",
    cta1: "Join the Network",
    cta2: "Explore Labs",
    studentCount: "5,000+",
    studentDesc: "Building AI Agents daily",
    videoUrl: "",
    stat1Label: "AI Accuracy",
    stat1Value: "99.8%",
    stat2Label: "Lab Uptime",
    stat2Value: "100%",
  },
  lifeSection: {
    title: "Life at Amara Nexa",
    videos: [],
  },
  testimonials: {
    title: "What Parents Say About Us",
    items: [
      { id: 1, quote: "Amara Nexa transformed my son's perspective on technology. He's not just playing games; he's building them.", author: "Priya Sharma", role: "Parent of 8th Grader", avatar: "https://i.pravatar.cc/150?u=parent1", video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: 2, quote: "The professional lab environment in school is exactly what was missing. My daughter is now excited about AI.", author: "Rajesh Iyer", role: "Parent of 10th Grader", avatar: "https://i.pravatar.cc/150?u=parent2", video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
      { id: 3, quote: "Seeing my child earn a stipend for a real-world project was a proud moment. This is real education.", author: "Anjali Gupta", role: "Parent of 9th Grader", avatar: "https://i.pravatar.cc/150?u=parent3", video: "https://www.youtube.com/watch?v=dQw4w9WgXcQ" },
    ],
  },
  features: {
    title: "The Lab Ecosystem",
    subtitle: "We don't just provide a room; we provide a complete professional infrastructure for the AI generation.",
    items: [
      { id: 1, title: "Professional Office Setup", desc: "We transform standard school rooms into high-end tech offices. Ergonomic furniture, high-speed fiber, and professional aesthetics to inspire real work.", size: "large" },
      { id: 2, title: "RTX Laptops", desc: "Every student station is equipped with high-performance hardware capable of training local LLMs.", size: "small" },
      { id: 3, title: "AI Curriculum", desc: "From prompt engineering to neural network architecture. Real-world skills for the 2030 economy.", size: "small" },
      { id: 4, title: "Real-World Projects", desc: "Students don't just solve puzzles. They build actual tools for local businesses and startups, earning real stipends for their contributions.", size: "large" },
    ],
  },
  perks: {
    title: "Student Incentives",
    subtitle: "We reward innovation. Our students are treated like professional engineers from day one.",
    items: [
      { id: 1, title: "Monthly Stipends", desc: "Students earn a basic stipend for maintaining 90% attendance and completing project milestones." },
      { id: 2, title: "Annual Prizes", desc: "Top performers in our annual exams receive high-end development laptops to continue their journey." },
      { id: 3, title: "Startup Incubation", desc: "Exceptional projects receive seed funding and mentorship to transform into real-world startups." },
    ],
  },
  gallery: {
    mainImage: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80',
    cards: [
      { image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80', tag: 'Web Development', caption: 'From Zero to Live Website', sub: 'Students ship their first portfolio in just 4 weeks' },
      { image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80', tag: 'AI & Python', caption: 'Coding the Future of AI', sub: 'Training real models with Python & TensorFlow' },
      { image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80', tag: 'Collaborative Learning', caption: 'Teamwork Makes the Dream Work', sub: 'Students pair-program, review code, and grow together' },
    ],
  },
  cta: {
    badge: "Limited Partnerships 2026",
    headline: "Ready to build the",
    headlineAccent: "next generation?",
    subtitle: "Join the network of elite schools transforming education. Request a pilot lab setup for your institution today.",
    buttonText: "Book a Demo",
  },
  typewriterWords: ['Robotics', 'Artificial Intelligence', 'Game Development', 'Web Development', 'Cyber Security', 'Data Science'],
  rotatingWords: ['CREATORS.', 'INNOVATORS.', 'ENGINEERS.', 'LEADERS.', 'BUILDERS.'],
  techStack: [
    { icon: '🐍', name: 'Python' }, { icon: '⚛️', name: 'React' }, { icon: '🤖', name: 'TensorFlow' },
    { icon: '📱', name: 'Flutter' }, { icon: '🎮', name: 'Unity' }, { icon: '⚡', name: 'JavaScript' },
    { icon: '🌐', name: 'HTML & CSS' }, { icon: '🔌', name: 'Arduino' }, { icon: '🗄️', name: 'SQL' },
    { icon: '🎨', name: 'Figma' }, { icon: '📊', name: 'Data Science' }, { icon: '🔒', name: 'Cyber Security' },
  ],
  partnerSchools: [
    { name: 'St. Xavier High School', city: 'Mumbai' }, { name: 'DPS North Campus', city: 'Delhi' },
    { name: 'Greenwood International', city: 'Bangalore' }, { name: 'Oakridge Academy', city: 'Hyderabad' },
    { name: 'Ryan International', city: 'Pune' }, { name: 'Kendriya Vidyalaya', city: 'Chennai' },
    { name: 'Silver Oaks School', city: 'Vizag' }, { name: 'Narayana e-Techno', city: 'Vijayawada' },
  ],
  labCards: [
    { title: 'Coding Lab', desc: 'Students writing real code', gradient: 'from-blue-500 to-indigo-600', iconName: 'Code' },
    { title: 'Robotics', desc: 'Building & programming robots', gradient: 'from-emerald-500 to-teal-600', iconName: 'Bot' },
    { title: 'AI Projects', desc: 'Training neural networks', gradient: 'from-violet-500 to-purple-600', iconName: 'BrainCircuit' },
    { title: 'Game Dev', desc: 'Creating interactive games', gradient: 'from-orange-500 to-red-500', iconName: 'Gamepad2' },
    { title: 'Innovation', desc: 'Solving real-world problems', gradient: 'from-amber-500 to-yellow-600', iconName: 'Lightbulb' },
    { title: 'Tech Office', desc: 'Professional lab setup', gradient: 'from-cyan-500 to-blue-600', iconName: 'Monitor' },
  ],
  studentGallery: [
    { name: 'Aarav Sharma', grade: 'Grade 8', school: 'DPS North Campus, Delhi', subject: 'AI & Python', project: 'Built a Gemini-powered chatbot', quote: 'I never thought I could build real AI until I joined Amara Nexa. Now I teach my friends!', achievement: 'Top Performer · Oct 2024', emoji: '🤖' },
    { name: 'Priya Reddy', grade: 'Grade 10', school: 'Oakridge Academy, Hyderabad', subject: 'Web Development', project: 'Launched her own portfolio website', quote: 'I built my first website in Week 3. My parents were speechless — it was live on the internet!', achievement: 'Student of the Month', emoji: '🌐' },
    { name: 'Rohan Menon', grade: 'Grade 9', school: 'Greenwood International, Bangalore', subject: 'Game Development', project: 'Created a 2D platformer game in Unity', quote: 'My game has 200+ plays on itch.io. I made that in just 6 weeks — unbelievable.', achievement: '200+ Game Downloads', emoji: '🎮' },
    { name: 'Sneha Kapoor', grade: 'Grade 7', school: 'Ryan International, Pune', subject: 'Robotics', project: 'Programmed an Arduino obstacle-avoiding robot', quote: 'My robot actually moves on its own now. I coded it myself using sensors and Arduino!', achievement: 'Science Fair 1st Place', emoji: '🤝' },
  ],
  mentors: [
    { name: 'Arjun Mehta', role: 'AI & Machine Learning Lead', exp: '6 years at Google Brain', avatar: 'https://i.pravatar.cc/300?u=mentor1', tags: ['Python', 'TensorFlow', 'LLMs'] },
    { name: 'Priya Nair', role: 'Full-Stack Web Expert', exp: '5 years at Flipkart', avatar: 'https://i.pravatar.cc/300?u=mentor2', tags: ['React', 'Node.js', 'UI/UX'] },
    { name: 'Rahul Sinha', role: 'Robotics & Hardware', exp: '4 years at ISRO', avatar: 'https://i.pravatar.cc/300?u=mentor3', tags: ['Arduino', 'C++', 'IoT'] },
    { name: 'Sneha Kapoor', role: 'Game Dev & Creative Tech', exp: '5 years at Ubisoft', avatar: 'https://i.pravatar.cc/300?u=mentor4', tags: ['Unity', 'C#', 'Game Design'] },
  ],
  faqs: [
    { q: 'What age group is Amara Nexa for?', a: 'Our programs are designed for students in Grade 5 through Grade 12 (ages 10–18). The curriculum scales with the student\'s level — beginners start with visual coding and HTML; advanced students dive into AI model training and full-stack apps.' },
    { q: 'Do students need a personal laptop?', a: 'No. Every Amara Nexa lab is equipped with high-performance RTX laptops at each workstation. Students only need to show up — all hardware, software, and accounts are set up and ready.' },
    { q: 'How does a school partner with Amara Nexa?', a: 'Schools fill out our partnership form or book a demo call. We visit the campus, assess a suitable room, and present a full lab setup proposal within 48 hours. Installation takes about 7 working days.' },
    { q: 'What does the monthly stipend program look like?', a: 'Students who maintain 90%+ attendance and complete their monthly project milestones receive a fixed stipend deposited to their UPI/bank account. This teaches financial responsibility alongside technical skills.' },
    { q: 'Is coding experience required to join?', a: 'Not at all. We start from absolute zero. Our first modules are visual and drag-based, designed to build intuition before introducing text-based code. Students progress at their own pace within a structured curriculum.' },
    { q: 'What happens after a student completes the program?', a: 'Students earn a Amara Nexa certification, build a portfolio of real projects, and gain access to our internship and startup incubation network. Top performers are referred directly to partner companies for internships.' },
  ],
  buildProjects: [
    { id: 'chatbot', label: 'AI Chatbot', emoji: '🤖', color: '#7c3aed', steps: [
      { icon: '📦', title: 'Set up Python environment', code: 'pip install google-generativeai' },
      { icon: '🔑', title: 'Connect to Gemini API', code: 'import google.generativeai as genai\\ngenai.configure(api_key="YOUR_KEY")' },
      { icon: '🧠', title: 'Create the AI model', code: 'model = genai.GenerativeModel("gemini-pro")\\nchat = model.start_chat()' },
      { icon: '💬', title: 'Send your first message', code: 'response = chat.send_message("Hello!")\\nprint(response.text)' },
      { icon: '🚀', title: 'Your chatbot is live!', code: '# 🎉 Running on localhost:3000\\n# Students built this in Week 2!' },
    ]},
    { id: 'game', label: '2D Game', emoji: '🎮', color: '#0ea5e9', steps: [
      { icon: '⚙️', title: 'Install Pygame', code: 'pip install pygame' },
      { icon: '🖥️', title: 'Create game window', code: 'import pygame\\nscreen = pygame.display.set_mode((800, 600))' },
      { icon: '🎨', title: 'Draw the player', code: 'player = pygame.Rect(400, 500, 50, 50)\\npygame.draw.rect(screen, (0,200,100), player)' },
      { icon: '🕹️', title: 'Add keyboard controls', code: 'keys = pygame.key.get_pressed()\\nif keys[pygame.K_LEFT]: player.x -= 5' },
      { icon: '🏆', title: 'Game is playable!', code: '# 🎉 Running at 60 FPS\\n# Students built this in Week 3!' },
    ]},
    { id: 'website', label: 'Live Website', emoji: '🌐', color: '#10b981', steps: [
      { icon: '📁', title: 'Create project folder', code: 'mkdir my-website && cd my-website\\nnpm create vite@latest .' },
      { icon: '🎨', title: 'Write your first component', code: 'export default function App() {\\n  return <h1>Hello World!</h1>\\n}' },
      { icon: '💅', title: 'Style with Tailwind CSS', code: '<h1 className="text-4xl font-bold\\n  text-blue-600 text-center">\\n  Hello World!\\n</h1>' },
      { icon: '⚡', title: 'Add interactivity', code: 'const [count, setCount] = useState(0)\\n<button onClick={() => setCount(c => c+1)}>\\n  Clicked {count} times\\n</button>' },
      { icon: '🌍', title: 'Deploy to the internet!', code: '# 🎉 Live at my-site.vercel.app\\n# Students built this in Week 4!' },
    ]},
    { id: 'ai-model', label: 'AI Image Classifier', emoji: '🧠', color: '#f59e0b', steps: [
      { icon: '📦', title: 'Install TensorFlow', code: 'pip install tensorflow numpy matplotlib' },
      { icon: '📸', title: 'Load training images', code: 'from tensorflow.keras.datasets import cifar10\\n(x_train, y_train), _ = cifar10.load_data()' },
      { icon: '🏗️', title: 'Build neural network', code: 'model = Sequential([\\n  Conv2D(32, (3,3), activation="relu"),\\n  MaxPooling2D(),\\n  Dense(10, activation="softmax")\\n])' },
      { icon: '🔥', title: 'Train the model', code: 'model.compile(optimizer="adam",\\n  loss="sparse_categorical_crossentropy")\\nmodel.fit(x_train, y_train, epochs=10)' },
      { icon: '✅', title: 'Model is classifying images!', code: '# 🎉 Accuracy: 94.2%\\n# Students built this in Week 6!' },
    ]},
  ],
  blogCategories: ['All Posts', 'Robotics', 'Artificial Intelligence', 'Science', 'Web Development', 'Drone', 'Machine Learning', 'Coding for Kids', 'STEM Education', 'Future of Tech', 'Student Projects'],
  announcement: {
    enabled: true,
    text: 'Limited school partnerships open for 2026 —',
    linkText: 'Reserve your slot →',
  },
};

export async function getHomeContent() {
  try {
    const content = await fetchPageContent('home');
    if (content) return content;
  } catch { /* fall through */ }
  return DEFAULT_HOME_CONTENT;
}

export async function saveHomeContent(content) {
  try {
    await savePageContent('home', content);
  } catch (err) {
    console.error('saveHomeContent error:', err);
  }
}

export async function updateHomeSection(section, data) {
  const content = await getHomeContent();
  const updated = { ...content, [section]: data };
  await saveHomeContent(updated);
  return updated;
}

// Sync version for initial render
export function getHomeContentSync() {
  return DEFAULT_HOME_CONTENT;
}
