const express = require('express');
const { pool } = require('../config/database');

const router = express.Router();

// Default home page content
const DEFAULT_HOME = {
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
    { q: 'What age group is Amara Nexa for?', a: 'Our programs are designed for students in Grade 5 through Grade 12 (ages 10–18). The curriculum scales with the student\'s level.' },
    { q: 'Do students need a personal laptop?', a: 'No. Every Amara Nexa lab is equipped with high-performance RTX laptops at each workstation.' },
    { q: 'How does a school partner with Amara Nexa?', a: 'Schools fill out our partnership form or book a demo call. We visit the campus and present a proposal within 48 hours.' },
    { q: 'What does the monthly stipend program look like?', a: 'Students who maintain 90%+ attendance and complete project milestones receive a fixed stipend.' },
    { q: 'Is coding experience required to join?', a: 'Not at all. We start from absolute zero with visual and drag-based coding.' },
    { q: 'What happens after a student completes the program?', a: 'Students earn certification, build a portfolio, and gain access to our internship and startup incubation network.' },
  ],
  buildProjects: [
    { id: 'chatbot', label: 'AI Chatbot', emoji: '🤖', color: '#7c3aed', steps: [
      { icon: '📦', title: 'Set up Python environment', code: 'pip install google-generativeai' },
      { icon: '🔑', title: 'Connect to Gemini API', code: 'import google.generativeai as genai\ngenai.configure(api_key="YOUR_KEY")' },
      { icon: '🧠', title: 'Create the AI model', code: 'model = genai.GenerativeModel("gemini-pro")\nchat = model.start_chat()' },
      { icon: '💬', title: 'Send your first message', code: 'response = chat.send_message("Hello!")\nprint(response.text)' },
      { icon: '🚀', title: 'Your chatbot is live!', code: '# 🎉 Running on localhost:3000\n# Students built this in Week 2!' },
    ]},
    { id: 'game', label: '2D Game', emoji: '🎮', color: '#0ea5e9', steps: [
      { icon: '⚙️', title: 'Install Pygame', code: 'pip install pygame' },
      { icon: '🖥️', title: 'Create game window', code: 'import pygame\nscreen = pygame.display.set_mode((800, 600))' },
      { icon: '🎨', title: 'Draw the player', code: 'player = pygame.Rect(400, 500, 50, 50)\npygame.draw.rect(screen, (0,200,100), player)' },
      { icon: '🕹️', title: 'Add keyboard controls', code: 'keys = pygame.key.get_pressed()\nif keys[pygame.K_LEFT]: player.x -= 5' },
      { icon: '🏆', title: 'Game is playable!', code: '# 🎉 Running at 60 FPS\n# Students built this in Week 3!' },
    ]},
    { id: 'website', label: 'Live Website', emoji: '🌐', color: '#10b981', steps: [
      { icon: '📁', title: 'Create project folder', code: 'mkdir my-website && cd my-website\nnpm create vite@latest .' },
      { icon: '🎨', title: 'Write your first component', code: 'export default function App() {\n  return <h1>Hello World!</h1>\n}' },
      { icon: '💅', title: 'Style with Tailwind CSS', code: '<h1 className="text-4xl font-bold\n  text-blue-600 text-center">\n  Hello World!\n</h1>' },
      { icon: '⚡', title: 'Add interactivity', code: 'const [count, setCount] = useState(0)\n<button onClick={() => setCount(c => c+1)}>\n  Clicked {count} times\n</button>' },
      { icon: '🌍', title: 'Deploy to the internet!', code: '# 🎉 Live at my-site.vercel.app\n# Students built this in Week 4!' },
    ]},
    { id: 'ai-model', label: 'AI Image Classifier', emoji: '🧠', color: '#f59e0b', steps: [
      { icon: '📦', title: 'Install TensorFlow', code: 'pip install tensorflow numpy matplotlib' },
      { icon: '📸', title: 'Load training images', code: 'from tensorflow.keras.datasets import cifar10\n(x_train, y_train), _ = cifar10.load_data()' },
      { icon: '🏗️', title: 'Build neural network', code: 'model = Sequential([\n  Conv2D(32, (3,3), activation="relu"),\n  MaxPooling2D(),\n  Dense(10, activation="softmax")\n])' },
      { icon: '🔥', title: 'Train the model', code: 'model.compile(optimizer="adam",\n  loss="sparse_categorical_crossentropy")\nmodel.fit(x_train, y_train, epochs=10)' },
      { icon: '✅', title: 'Model is classifying images!', code: '# 🎉 Accuracy: 94.2%\n# Students built this in Week 6!' },
    ]},
  ],
  blogCategories: ['All Posts', 'Robotics', 'Artificial Intelligence', 'Science', 'Web Development', 'Drone', 'Machine Learning', 'Coding for Kids', 'STEM Education', 'Future of Tech', 'Student Projects'],
};

// Default pages content
const DEFAULT_PAGES = {
  courses: {
    headline: "OUR",
    headlineGradient: "CURRICULUM",
    subtitle: "Industry-vetted courses designed for the next generation of tech leaders.",
    items: [
      { id: 1, title: "Robotics & Coding", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80", desc: "Build and program real robots using industry-standard tools." },
      { id: 2, title: "Artificial Intelligence", image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80", desc: "Master neural networks, computer vision, and natural language processing." },
      { id: 3, title: "Game Development", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80", desc: "Create immersive 3D worlds and interactive gameplay experiences." },
      { id: 4, title: "Web Development", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80", desc: "Build modern, responsive websites using React and Next.js." },
      { id: 5, title: "Mobile App Dev", image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?auto=format&fit=crop&w=800&q=80", desc: "Design and develop native mobile applications for iOS and Android." },
      { id: 6, title: "Cyber Security", image: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&w=800&q=80", desc: "Protect systems and networks from digital attacks and vulnerabilities." },
      { id: 7, title: "Data Science", image: "https://images.unsplash.com/photo-1551288049-bbbda5366392?auto=format&fit=crop&w=800&q=80", desc: "Analyze complex data sets to discover patterns and insights." },
      { id: 8, title: "UI/UX Design", image: "https://images.unsplash.com/photo-1586717791821-3f44a563eb4c?auto=format&fit=crop&w=800&q=80", desc: "Create intuitive and beautiful user interfaces for digital products." },
      { id: 9, title: "Cloud Computing", image: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=800&q=80", desc: "Learn to deploy and manage applications on AWS and Google Cloud." },
    ],
  },
  schools: {
    heroHeadline: "Transform Your School",
    heroAccent: "Into a Tech Powerhouse",
    heroSubtitle: "We deliver an interactive, hands-on tech learning experience for grades 3-12, building future-ready skills.",
    heroImage: "https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=1200&q=80",
    labsTitle: "Advanced Computer Labs",
    labsSubtitle: "We transform traditional classrooms into high-performance innovation hubs.",
    labItems: [
      { id: 1, title: "Computer Lab Setup", desc: "Rows of high-performance workstations with RTX laptops, fiber internet, and ergonomic seating.", image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80" },
      { id: 2, title: "AI & Coding Hub", desc: "High-end computing systems optimized for machine learning and software development.", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" },
    ],
    productsTitle: "Digital Products",
    productsSubtitle: "Custom-built software solutions to modernize school management.",
    products: [
      { id: 1, title: "Custom LMS", desc: "A powerful Learning Management System tailored to your school.", icon: "LMS" },
      { id: 2, title: "School Apps", desc: "Native iOS and Android applications for seamless communication.", icon: "APP" },
      { id: 3, title: "Web Portals", desc: "Modern, responsive websites and administrative portals.", icon: "WEB" },
    ],
    servicesTitle: "Ecosystem Services",
    services: [
      { id: 1, title: "National Competitions", desc: "We organize inter-school tech fests and national-level robotics challenges." },
      { id: 2, title: "Interactive Quizzes", desc: "Regular assessment through gamified quizzes to track student progress." },
      { id: 3, title: "Tech Exhibitions", desc: "Grand showcases where students present their AI and Robotics projects." },
    ],
    contactHeadline: "Ready to Partner?",
    contactSubtitle: "Join the network of schools leading the tech revolution.",
  },
  summerCamps: {
    camps: [
      { id: 1, category: "ROBOTICS", title: "SUMMER CAMP", grades: "2nd to 12th", details: ["3D Design and Modeling", "Sensor Integration", "Electronics and Circuitry"], startDate: "9th March", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80" },
      { id: 2, category: "PYTHON & AI", title: "SUMMER CAMP", grades: "6th to 12th", details: ["Logical Problem Solving", "AI & App Development", "Data Structures"], startDate: "9th March", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" },
      { id: 3, category: "GAME DEV", title: "SUMMER CAMP", grades: "4th to 12th", details: ["3D Game Design", "C# Programming", "Level Mechanics"], startDate: "15th March", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" },
    ],
    benefitsTitle: "Why Join Our Summer Camp?",
    benefits: [
      { id: 1, title: "Hands-on Hardware", desc: "Work with real sensors, microcontrollers, and mechanical parts." },
      { id: 2, title: "Expert Mentorship", desc: "Learn from IITians and industry experts." },
      { id: 3, title: "Portfolio Building", desc: "Create working projects for your portfolio." },
      { id: 4, title: "Global Community", desc: "Connect with young innovators from across the country." },
    ],
    testimonialsTitle: "What Parents Say About Us",
    testimonials: [
      { id: 1, name: "Sarah Johnson", role: "Parent of 7th Grader", content: "My son absolutely loved the Robotics camp!", rating: 5 },
      { id: 2, name: "Michael Chen", role: "Parent of 9th Grader", content: "The Python & AI camp was a game-changer for my daughter.", rating: 5 },
      { id: 3, name: "Emily Davis", role: "Parent of 5th Grader", content: "A wonderful experience! The Game Dev camp was perfectly paced.", rating: 5 },
    ],
  },
};

// Default blog posts
const DEFAULT_BLOGS = [
  { title: 'Why Every School Needs a Coding Lab in 2026', excerpt: 'Discover how coding labs are transforming education and preparing students for the AI-driven future.', image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80', category: 'STEM Education', read_time: '5 min read' },
  { title: 'How AI is Changing the Way Kids Learn', excerpt: 'From personalized learning paths to AI tutors, explore the revolution in classroom technology.', image: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=800&q=80', category: 'Artificial Intelligence', read_time: '4 min read' },
  { title: 'Top 5 Robotics Projects for School Students', excerpt: 'Hands-on robotics projects that your students can build in just one semester.', image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80', category: 'Robotics', read_time: '6 min read' },
  { title: 'From Scratch to Full-Stack: A Student Journey', excerpt: 'Follow the incredible journey of a Grade 8 student who went from zero coding knowledge to deploying a live website.', image: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80', category: 'Web Development', read_time: '7 min read' },
  { title: 'Game Development for Kids: Where to Start', excerpt: 'A complete guide to introducing game development to young learners using Unity and Pygame.', image: 'https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80', category: 'Coding for Kids', read_time: '5 min read' },
  { title: 'The Future of STEM Education in India', excerpt: 'How Indian schools are embracing technology and what parents should know about the changing landscape.', image: 'https://images.unsplash.com/photo-1503676260728-1c00da094a0b?auto=format&fit=crop&w=800&q=80', category: 'Future of Tech', read_time: '6 min read' },
];

// POST /api/seed — seed the database with default content (run once)
router.post('/', async (req, res) => {
  try {
    const results = [];

    // Seed home page content
    const { rows: homeRows } = await pool.query('SELECT id FROM page_content WHERE page_key = $1', ['home']);
    if (homeRows.length === 0) {
      await pool.query(
        'INSERT INTO page_content (page_key, content) VALUES ($1, $2)',
        ['home', JSON.stringify(DEFAULT_HOME)]
      );
      results.push('home content seeded');
    } else {
      results.push('home content already exists');
    }

    // Seed pages content
    const { rows: pagesRows } = await pool.query('SELECT id FROM page_content WHERE page_key = $1', ['pages']);
    if (pagesRows.length === 0) {
      await pool.query(
        'INSERT INTO page_content (page_key, content) VALUES ($1, $2)',
        ['pages', JSON.stringify(DEFAULT_PAGES)]
      );
      results.push('pages content seeded');
    } else {
      results.push('pages content already exists');
    }

    // Seed blog posts
    const { rows: blogRows } = await pool.query('SELECT COUNT(*) as count FROM blog_posts');
    if (parseInt(blogRows[0].count) === 0) {
      for (const blog of DEFAULT_BLOGS) {
        await pool.query(
          'INSERT INTO blog_posts (title, excerpt, image, category, read_time) VALUES ($1, $2, $3, $4, $5)',
          [blog.title, blog.excerpt, blog.image, blog.category, blog.read_time]
        );
      }
      results.push(`${DEFAULT_BLOGS.length} blog posts seeded`);
    } else {
      results.push('blog posts already exist');
    }

    // Seed default nav links
    const { rows: navRows } = await pool.query('SELECT COUNT(*) as count FROM nav_links');
    if (parseInt(navRows[0].count) === 0) {
      const defaultLinks = [
        { label: 'Home', href: '/', sort_order: 0 },
        { label: 'Courses', href: '/courses', sort_order: 1 },
        { label: 'Schools', href: '/schools', sort_order: 2 },
        { label: 'Summer Camps', href: '/summer-camps', sort_order: 3 },
        { label: 'Blog', href: '/blog', sort_order: 4 },
      ];
      for (const link of defaultLinks) {
        await pool.query(
          'INSERT INTO nav_links (label, href, sort_order) VALUES ($1, $2, $3)',
          [link.label, link.href, link.sort_order]
        );
      }
      results.push(`${defaultLinks.length} nav links seeded`);
    } else {
      results.push('nav links already exist');
    }

    res.json({ success: true, results });
  } catch (err) {
    console.error('Seed error:', err.message);
    res.status(500).json({ error: 'Seed failed', details: err.message });
  }
});

module.exports = router;
