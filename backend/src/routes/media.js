const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');

const router = express.Router();

// Ensure uploads directory exists
const UPLOAD_DIR = path.join(__dirname, '../../uploads');
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR, { recursive: true });

// Configure multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, UPLOAD_DIR),
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname);
    const name = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (req, file, cb) => {
  const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|svg/;
  const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = allowed.test(file.mimetype.split('/')[1]);
  cb(null, extOk || mimeOk);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 100 * 1024 * 1024 }, // 100 MB
});

// GET /api/media — public: list all media
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM media ORDER BY created_at DESC';
    let params = [];
    if (category) {
      query = 'SELECT * FROM media WHERE category = ? ORDER BY created_at DESC';
      params = [category];
    }
    const [rows] = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Media fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/media/upload — admin: upload file(s)
router.post('/upload', authMiddleware, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    const results = [];
    for (const file of req.files) {
      const isVideo = /video/.test(file.mimetype);
      const category = isVideo ? 'video' : 'photo';
      const url = `/uploads/${file.filename}`;

      const [result] = await pool.query(
        'INSERT INTO media (filename, original_name, mime_type, size, url, category, alt_text) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [file.filename, file.originalname, file.mimetype, file.size, url, category, req.body.alt_text || '']
      );

      results.push({
        id: result.insertId,
        filename: file.filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
        url,
        category,
      });
    }

    res.status(201).json(results);
  } catch (err) {
    console.error('Media upload error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/media/:id — admin: delete media
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM media WHERE id = ?', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Media not found' });

    // Delete file from disk
    const filePath = path.join(UPLOAD_DIR, rows[0].filename);
    if (fs.existsSync(filePath)) fs.unlinkSync(filePath);

    await pool.query('DELETE FROM media WHERE id = ?', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Media delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
