# CodeOffice — Claude Skills & Commands

Custom slash commands for working on this project with Claude Code.

---

## /dev-setup
Set up the development environment from scratch.

Steps:
1. Run `npm install` in the root (frontend deps)
2. Run `cd backend && npm install` (backend deps)
3. Copy `backend/.env.example` to `backend/.env` and fill in DB credentials
4. Start MySQL and create the `codeoffice` database
5. Run `npm run dev` (frontend) and `cd backend && npm run dev` (backend) in separate terminals

---

## /add-api-route
Add a new Express API route to the backend.

Steps:
1. Create a new route file in `backend/src/routes/`
2. Define the router with `express.Router()`
3. Register it in `backend/server.js` with `app.use('/route-name', require('./src/routes/file'))`
4. Test with the `/health` endpoint pattern as reference

---

## /add-page
Add a new page to the React frontend.

Steps:
1. Create a new component in `src/pages/` (`.jsx` files)
2. Add the route in the router config (React Router v7)
3. Add a navigation link if needed using Lucide React icons
4. Style with Tailwind CSS utility classes

---

## /db-query
Write and test a MySQL query for the `codeoffice` database.

Steps:
1. Use the `mysql2` connection from `backend/src/config/database.js`
2. Use promise-based API: `connection.execute(sql, params)`
3. Always use parameterized queries — never string-interpolate user input
4. Test via the `/test-connection` endpoint first

---

## /review
Review changed code for quality, security, and consistency with project conventions.

Checks:
- No SQL injection (use parameterized queries)
- No XSS vulnerabilities in React components
- CommonJS `require` used in backend (not ESM `import`)
- Tailwind classes follow v4 conventions
- API responses follow `{ success, message, data, timestamp }` shape

---

## /env-check
Verify environment variables are correctly set.

Required for backend (`backend/.env`):
- `DB_HOST`
- `DB_PORT`
- `DB_USER`
- `DB_PASSWORD`
- `DB_NAME`
- `BACKEND_PORT`

Required for frontend (`.env.local`):
- `GEMINI_API_KEY`
