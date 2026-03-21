# CodeOffice - The Future of School Coding

## Project Overview
CodeOffice is a school coding platform built with React (Vite) on the frontend and Express.js + MySQL on the backend.

## Tech Stack
- **Frontend:** React 19, JavaScript (JSX), Vite, Tailwind CSS v4, React Router v7, Recharts, Lucide React, Motion
- **Backend:** Node.js, Express.js, MySQL2, dotenv
- **AI:** Google Gemini (`@google/genai`)

## Project Structure
```
/
├── .claude/            # Claude Code configuration
│   ├── CLAUDE.md       # This file — project instructions
│   └── skills.md       # Custom skills reference
├── backend/            # Express.js API server
│   ├── server.js       # Entry point (port 5000)
│   ├── .env.example    # DB config template
│   └── src/config/     # database.js connection config
├── src/                # React frontend source
├── index.html
├── vite.config.ts
└── package.json
```

## Environment Setup
Copy `backend/.env.example` to `backend/.env` and fill in your values:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=codeoffice
BACKEND_PORT=5000
```

## Dev Commands
```bash
# Frontend (port 3000)
npm run dev

# Backend (port 5000)
cd backend && npm run dev
```

## Backend API Endpoints
- `GET /health` — health check
- `GET /test-connection` — test DB connection

## Key Conventions
- Frontend uses JavaScript (`.js` / `.jsx`); backend uses CommonJS (`require`)
- Tailwind CSS v4 (no config file needed, import via Vite plugin)
- MySQL database named `codeoffice`
- Backend runs on port 5000, frontend on port 3000
