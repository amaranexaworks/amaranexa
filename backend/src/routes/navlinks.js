const express = require('express');
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/navlinks — public: get all nav links
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM nav_links ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    console.error('Nav fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/navlinks — admin: create nav link
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { label, href, enabled = true } = req.body;
    if (!label || !href) return res.status(400).json({ error: 'Label and href required' });

    const [maxOrder] = await pool.query('SELECT COALESCE(MAX(sort_order), 0) as max_order FROM nav_links');
    const [result] = await pool.query(
      'INSERT INTO nav_links (label, href, enabled, sort_order) VALUES (?, ?, ?, ?)',
      [label, href, enabled ? 1 : 0, maxOrder[0].max_order + 1]
    );
    const [rows] = await pool.query('SELECT * FROM nav_links WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Nav create error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/navlinks/:id — admin: update nav link
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { label, href, enabled } = req.body;
    await pool.query(
      'UPDATE nav_links SET label=?, href=?, enabled=? WHERE id=?',
      [label, href, enabled ? 1 : 0, req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM nav_links WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Link not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Nav update error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/navlinks/reorder — admin: reorder all links
router.put('/reorder/all', authMiddleware, async (req, res) => {
  try {
    const { links } = req.body;
    if (!Array.isArray(links)) return res.status(400).json({ error: 'Links array required' });

    for (let i = 0; i < links.length; i++) {
      await pool.query('UPDATE nav_links SET sort_order = ? WHERE id = ?', [i, links[i].id]);
    }
    const [rows] = await pool.query('SELECT * FROM nav_links ORDER BY sort_order ASC');
    res.json(rows);
  } catch (err) {
    console.error('Nav reorder error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/navlinks/:id — admin: delete nav link
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM nav_links WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Link not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Nav delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
