const express = require('express');
const bcrypt = require('bcryptjs');
const { pool } = require('../config/database');
const { generateToken, authMiddleware } = require('../middleware/auth');

const router = express.Router();

// POST /api/auth/login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    const { rows } = await pool.query('SELECT * FROM admin_users WHERE username = $1', [username]);
    if (rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = rows[0];
    const valid = await bcrypt.compare(password, user.password_hash);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error('Login error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/has-admin — check if any admin exists
router.get('/has-admin', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    res.json({ hasAdmin: parseInt(rows[0].count) > 0 });
  } catch (err) {
    console.error('Has-admin error:', err.message);
    res.json({ hasAdmin: false });
  }
});

// POST /api/auth/register — create first admin (only works if no admin exists)
router.post('/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    if (!username || !password) return res.status(400).json({ error: 'Username and password required' });

    // Check if admin already exists
    const { rows: existing } = await pool.query('SELECT COUNT(*) as count FROM admin_users');
    if (parseInt(existing[0].count) > 0) {
      return res.status(403).json({ error: 'Admin already exists. Use login instead.' });
    }

    const hash = await bcrypt.hash(password, 10);
    const { rows } = await pool.query(
      'INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3) RETURNING id, username, role',
      [username, hash, 'admin']
    );

    const user = rows[0];
    const token = generateToken({ id: user.id, username: user.username, role: user.role });
    res.json({ token, username: user.username, role: user.role });
  } catch (err) {
    console.error('Register error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// GET /api/auth/me — verify token
router.get('/me', authMiddleware, (req, res) => {
  res.json({ id: req.adminId, username: req.adminUsername });
});

module.exports = router;
