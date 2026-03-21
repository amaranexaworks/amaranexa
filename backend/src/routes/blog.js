const express = require('express');
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// GET /api/blog — public: get all blog posts
router.get('/', async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM blog_posts ORDER BY created_at DESC');
    res.json(rows);
  } catch (err) {
    console.error('Blog fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/blog — admin: create post
router.post('/', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, image, category, read_time } = req.body;
    if (!title || !excerpt) return res.status(400).json({ error: 'Title and excerpt required' });

    const [result] = await pool.query(
      'INSERT INTO blog_posts (title, excerpt, image, category, read_time) VALUES (?, ?, ?, ?, ?)',
      [title, excerpt, image || '', category || '', read_time || '']
    );
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [result.insertId]);
    res.status(201).json(rows[0]);
  } catch (err) {
    console.error('Blog create error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// PUT /api/blog/:id — admin: update post
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const { title, excerpt, image, category, read_time } = req.body;
    await pool.query(
      'UPDATE blog_posts SET title=?, excerpt=?, image=?, category=?, read_time=? WHERE id=?',
      [title, excerpt, image || '', category || '', read_time || '', req.params.id]
    );
    const [rows] = await pool.query('SELECT * FROM blog_posts WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Post not found' });
    res.json(rows[0]);
  } catch (err) {
    console.error('Blog update error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/blog/:id — admin: delete post
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [result] = await pool.query('DELETE FROM blog_posts WHERE id = ?', [req.params.id]);
    if (result.affectedRows === 0) return res.status(404).json({ error: 'Post not found' });
    res.json({ success: true });
  } catch (err) {
    console.error('Blog delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
