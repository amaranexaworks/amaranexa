const express = require('express');
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/content/:pageKey — public: get page content
router.get('/:pageKey', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM page_content WHERE page_key = ?', [req.params.pageKey]);
    if (rows.length === 0) return res.json({ page_key: req.params.pageKey, content: null });
    res.json(rows[0]);
  } catch (err) {
    console.error('Content fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/content/:pageKey — admin: upsert page content
router.put('/:pageKey', authMiddleware, async (req, res) => {
  try {
    const { content } = req.body;
    if (!content) return res.status(400).json({ error: 'Content required' });

    await pool.query(
      `INSERT INTO page_content (page_key, content) VALUES (?, ?)
       ON DUPLICATE KEY UPDATE content = VALUES(content)`,
      [req.params.pageKey, JSON.stringify(content)]
    );
    res.json({ success: true, page_key: req.params.pageKey });
  } catch (err) {
    console.error('Content save error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
