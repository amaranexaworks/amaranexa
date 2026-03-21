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
    videoUrl: "https://assets.mixkit.co/videos/preview/mixkit-children-learning-in-a-classroom-4240-large.mp4",
    stat1Label: "AI Accuracy",
    stat1Value: "99.8%",
    stat2Label: "Lab Uptime",
    stat2Value: "100%",
  },
  lifeSection: {
    title: "Life at Amara Nexa",
    videos: [
      "https://assets.mixkit.co/videos/preview/mixkit-children-learning-in-a-classroom-4240-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-little-girl-working-on-a-laptop-at-home-4241-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-boy-studying-with-a-laptop-at-home-4242-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-children-in-a-classroom-4244-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-student-working-on-a-laptop-in-a-library-4245-large.mp4",
      "https://assets.mixkit.co/videos/preview/mixkit-young-student-working-on-a-laptop-in-a-library-4246-large.mp4",
    ],
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
      {
        image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=800&q=80',
        tag: 'Web Development',
        caption: 'From Zero to Live Website',
        sub: 'Students ship their first portfolio in just 4 weeks',
      },
      {
        image: 'https://images.unsplash.com/photo-1571260899304-425eee4c7efc?auto=format&fit=crop&w=800&q=80',
        tag: 'AI & Python',
        caption: 'Coding the Future of AI',
        sub: 'Training real models with Python & TensorFlow',
      },
      {
        image: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?auto=format&fit=crop&w=800&q=80',
        tag: 'Collaborative Learning',
        caption: 'Teamwork Makes the Dream Work',
        sub: 'Students pair-program, review code, and grow together',
      },
    ],
  },
  cta: {
    badge: "Limited Partnerships 2026",
    headline: "Ready to build the",
    headlineAccent: "next generation?",
    subtitle: "Join the network of elite schools transforming education. Request a pilot lab setup for your institution today.",
    buttonText: "Book a Demo",
  },
};

const STORAGE_KEY = 'amaranexa_home_content_v3';

export function getHomeContent() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_HOME_CONTENT));
    return DEFAULT_HOME_CONTENT;
  } catch {
    return DEFAULT_HOME_CONTENT;
  }
}

export function saveHomeContent(content) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(content));
}

export function updateHomeSection(section, data) {
  const content = getHomeContent();
  const updated = { ...content, [section]: data };
  saveHomeContent(updated);
  return updated;
}
