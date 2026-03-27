require('dotenv').config();
const express = require('express');
const path = require('path');
const cors = require('cors');
const { GoogleGenAI } = require('@google/genai');
const { testConnection } = require('./src/config/database');
const { initDatabase } = require('./src/db/init');
const meetingRoutes = require('./src/routes/meetings');
const enrollmentRoutes = require('./src/routes/enrollments');
const authRoutes = require('./src/routes/auth');
const blogRoutes = require('./src/routes/blog');
const contentRoutes = require('./src/routes/content');
const navlinkRoutes = require('./src/routes/navlinks');
const mediaRoutes = require('./src/routes/media');

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

const SYSTEM_PROMPT = `You are an AI assistant for Amara Nexa, a school coding and AI education program in India.
Your job is to help parents, students, and school administrators learn about Amara Nexa's offerings.

Key facts about Amara Nexa:
- Programs for Grade 5–12 students (ages 10–18)
- Courses include: Python, AI & Machine Learning, Web Development, Robotics, Game Development, Cybersecurity, Data Science
- Labs are set up inside partner schools — no need to travel
- High-performance RTX laptops provided at every workstation — students don't need their own laptop
- Students who maintain 90%+ attendance and complete project milestones receive a monthly stipend
- No prior coding experience required — starts from visual/drag-based coding
- Lab setup takes about 7 working days after signing the partnership
- Students earn Amara Nexa certification and build a real project portfolio
- Top performers get referred to internship and startup incubation networks
- School partnership: fill a form or book a demo call, get a proposal in 48 hours
- Contact: WhatsApp available on the website

Answer questions in a warm, helpful, and concise manner. If you don't know a specific detail (like exact fee), invite them to contact Amara Nexa directly via WhatsApp or the website. Never make up fees or locations you don't know.`;

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use(express.json({ limit: '50mb' }));

// Media files are served from Supabase Storage (no local uploads directory needed)

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/meetings', meetingRoutes);
app.use('/api/enrollments', enrollmentRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/content', contentRoutes);
app.use('/api/navlinks', navlinkRoutes);
app.use('/api/media', mediaRoutes);

// AI Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { message, history = [] } = req.body;
  if (!message) return res.status(400).json({ error: 'message is required' });

  try {
    const contents = [
      ...history
        .filter(m => m.role === 'user' || m.role === 'bot')
        .map(m => ({ role: m.role === 'bot' ? 'model' : 'user', parts: [{ text: m.text }] })),
      { role: 'user', parts: [{ text: message }] },
    ];

    const response = await ai.models.generateContent({
      model: 'gemini-2.0-flash',
      contents,
      config: { systemInstruction: SYSTEM_PROMPT },
    });

    res.json({ reply: response.text });
  } catch (err) {
    console.error('Gemini error:', err.message);
    res.status(500).json({ reply: 'Sorry, I\'m having trouble right now. Please reach us on WhatsApp!' });
  }
});

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend server is running', timestamp: new Date().toISOString() });
});

// Test DB connection
app.get('/test-connection', async (req, res) => {
  const isConnected = await testConnection();
  res.json({
    success: isConnected,
    message: isConnected ? 'Database connected successfully!' : 'Database connection failed!',
    timestamp: new Date().toISOString()
  });
});

app.listen(PORT, async () => {
  console.log(`Server running on port ${PORT}`);
  const connected = await testConnection();
  if (connected) {
    await initDatabase();
  }

  // Self-ping every 14 minutes to prevent Render free tier from sleeping
  // Also keeps Supabase connection alive
  setInterval(() => {
    fetch(`http://localhost:${PORT}/health`).catch(() => {});
  }, 14 * 60 * 1000);
});
