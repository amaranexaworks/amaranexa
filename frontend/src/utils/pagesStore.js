import { fetchPageContent, savePageContent } from './api';

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
    labsSubtitle: "We transform traditional classrooms into high-performance innovation hubs where students master robotics, AI, and coding.",
    labItems: [
      { id: 1, title: "Computer Lab Setup", desc: "Rows of high-performance workstations with RTX laptops, fiber internet, and ergonomic seating for every student.", image: "https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=800&q=80" },
      { id: 2, title: "AI & Coding Hub", desc: "High-end computing systems optimized for machine learning, coding projects, and software development.", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" },
    ],
    productsTitle: "Digital Products",
    productsSubtitle: "Custom-built software solutions to modernize school management and enhance student learning experiences.",
    products: [
      { id: 1, title: "Custom LMS", desc: "A powerful Learning Management System tailored to your school's curriculum and grading system.", icon: "LMS" },
      { id: 2, title: "School Apps", desc: "Native iOS and Android applications for seamless communication between parents, teachers, and students.", icon: "APP" },
      { id: 3, title: "Web Portals", desc: "Modern, responsive websites and administrative portals for efficient school operations.", icon: "WEB" },
    ],
    servicesTitle: "Ecosystem Services",
    services: [
      { id: 1, title: "National Competitions", desc: "We organize inter-school tech fests and national-level robotics challenges." },
      { id: 2, title: "Interactive Quizzes", desc: "Regular assessment through gamified quizzes to track student progress." },
      { id: 3, title: "Tech Exhibitions", desc: "Grand showcases where students present their AI and Robotics projects to parents and industry." },
    ],
    eventsCount: "15+",
    socialProofHeadline: "30+ schools trust our services for their students",
    contactHeadline: "Ready to Partner?",
    contactSubtitle: "Join the network of schools leading the tech revolution. Let's build the future together.",
    successStories: [
      { image: 'https://images.unsplash.com/photo-1580582932707-520aed937b7b?auto=format&fit=crop&w=600&q=80', school: 'Delhi Public School', location: 'Hyderabad', students: '500+', video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { image: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', school: 'Narayana School', location: 'Vizag', students: '350+', video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { image: 'https://images.unsplash.com/photo-1588072432836-e10032774350?auto=format&fit=crop&w=600&q=80', school: 'Sri Chaitanya School', location: 'Chennai', students: '420+', video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
    schoolTestimonials: [
      { name: 'Dr. Kavitha Reddy', role: 'Principal, DPS Hyderabad', quote: 'Students who once dreaded computer class now stay back after school to work on AI projects.', image: 'https://i.pravatar.cc/150?u=principal1', video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { name: 'Mr. Rajesh Nair', role: 'Coordinator, Narayana Vizag', quote: 'Enrollment inquiries doubled after we showcased the lab at our annual day.', image: 'https://i.pravatar.cc/150?u=principal2', video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
      { name: 'Mrs. Sunita Iyer', role: 'Director, Sri Chaitanya Chennai', quote: 'Within 10 days we had a fully operational lab. Students built their first robot in Week 2.', image: 'https://i.pravatar.cc/150?u=principal3', video: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    ],
    howItWorks: [
      { emoji: '🤝', title: 'School Partners With Us', desc: 'Your school signs a partnership agreement. We handle everything — hardware specs, curriculum, staffing. No upfront investment needed.' },
      { emoji: '🏗️', title: 'We Build the Lab', desc: 'Our team installs high-speed fiber, ergonomic workstations, and RTX laptops inside your existing classroom. Lab is live in 7 days.' },
      { emoji: '🚀', title: 'Students Start Building', desc: 'Professional mentors arrive on Day 1. Students immediately work on real AI and coding projects — no filler, no theory-only classes.' },
    ],
    servicesDropdown: [
      { label: 'National Competitions', desc: 'Inter-school tech fests & robotics challenges' },
      { label: 'Interactive Quizzes', desc: 'Gamified assessments to track student progress' },
      { label: 'Tech Exhibitions', desc: 'Grand showcases for students to present projects' },
    ],
  },
  summerCamps: {
    camps: [
      { id: 1, category: "ROBOTICS", title: "SUMMER CAMP", grades: "2nd to 12th", details: ["3D Design and Modeling", "Sensor Integration", "Electronics and Circuitry"], startDate: "9th March", image: "https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&w=800&q=80" },
      { id: 2, category: "PYTHON & AI", title: "SUMMER CAMP", grades: "6th to 12th", details: ["Logical Problem Solving", "AI & App Development", "Data Structures"], startDate: "9th March", image: "https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=800&q=80" },
      { id: 3, category: "GAME DEV", title: "SUMMER CAMP", grades: "4th to 12th", details: ["3D Game Design", "C# Programming", "Level Mechanics"], startDate: "15th March", image: "https://images.unsplash.com/photo-1550745165-9bc0b252726f?auto=format&fit=crop&w=800&q=80" },
    ],
    campStats: [
      { value: 5000, suffix: '+', label: 'Students Enrolled' },
      { value: 98, suffix: '%', label: 'Parent Satisfaction' },
      { value: 12, suffix: '+', label: 'Camp Tracks' },
      { value: 6, suffix: '+', label: 'Cities' },
    ],
    videoTestimonials: [
      { name: 'Arjun Sharma', role: 'Student, Grade 9', quote: 'I built my first AI model in just 5 days. This camp changed how I think about technology.', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', thumb: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { name: 'Priya Nair', role: 'Parent of Grade 7 Student', quote: 'My daughter came back confident, creative, and with a working robot she built herself. Worth every rupee.', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=200&q=80', thumb: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
      { name: 'Karan Mehta', role: 'Student, Grade 11', quote: 'The Game Dev camp was intense but amazing. I shipped my first Unity game and it is on my portfolio.', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', thumb: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=600&q=80', video: 'https://www.youtube.com/embed/dQw4w9WgXcQ' },
    ],
    advantages: [
      { title: 'Real Projects', desc: 'Students build working apps, robots, and AI models — not just theory.' },
      { title: 'Expert Mentors', desc: 'Learn from industry professionals with real product experience.' },
      { title: 'Small Batches', desc: 'Max 15 students per batch for personal attention and fast progress.' },
      { title: 'Certificates', desc: 'Industry-recognized certificates to boost college applications.' },
      { title: 'Pan-India Community', desc: 'Join a network of 5000+ young innovators across India.' },
      { title: 'Career Guidance', desc: 'One-on-one sessions on future tech careers and college prep.' },
    ],
    benefitsTitle: "Why Join Our Summer Camp?",
    benefits: [
      { id: 1, title: "Hands-on Hardware", desc: "Work with real sensors, microcontrollers, and mechanical parts." },
      { id: 2, title: "Expert Mentorship", desc: "Learn from IITians and industry experts with years of experience." },
      { id: 3, title: "Portfolio Building", desc: "Create working projects that you can showcase to schools and colleges." },
      { id: 4, title: "Global Community", desc: "Connect with like-minded young innovators from across the country." },
    ],
    testimonialsTitle: "What Parents Say About Us",
    testimonials: [
      { id: 1, name: "Sarah Johnson", role: "Parent of 7th Grader", content: "My son absolutely loved the Robotics camp! He learned so much about electronics and even built his own robot. The instructors were fantastic.", rating: 5 },
      { id: 2, name: "Michael Chen", role: "Parent of 9th Grader", content: "The Python & AI camp was a game-changer for my daughter. She's now building her own apps and is so excited about computer science.", rating: 5 },
      { id: 3, name: "Emily Davis", role: "Parent of 5th Grader", content: "A wonderful experience! The Game Dev camp was perfectly paced and very engaging. Highly recommend CodeOffice for summer activities.", rating: 5 },
    ],
  },
  blog: {
    categories: ['All Posts', 'Robotics', 'Artificial Intelligence', 'Science', 'Web Development', 'Drone', 'Machine Learning', 'Coding for Kids', 'STEM Education', 'Future of Tech', 'Student Projects'],
  },
};

export async function getPagesContent() {
  try {
    const content = await fetchPageContent('pages');
    if (content) return content;
  } catch { /* fall through */ }
  return DEFAULT_PAGES;
}

export async function savePagesContent(content) {
  try {
    await savePageContent('pages', content);
  } catch (err) {
    console.error('savePagesContent error:', err);
  }
}

export async function updatePage(page, data) {
  const content = await getPagesContent();
  const updated = { ...content, [page]: data };
  await savePagesContent(updated);
  return updated;
}

// Sync version for initial render
export function getPagesContentSync() {
  return DEFAULT_PAGES;
}
