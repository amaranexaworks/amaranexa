const express = require('express');
const multer = require('multer');
const path = require('path');
const { pool } = require('../config/database');
const { authMiddleware } = require('../middleware/auth');
const { supabase, BUCKET } = require('../config/supabase');

const router = express.Router();

// Use memory storage — files go to Supabase, not disk
const upload = multer({
  storage: multer.memoryStorage(),
  fileFilter: (req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp|mp4|mov|avi|webm|svg/;
    const extOk = allowed.test(path.extname(file.originalname).toLowerCase());
    const mimeOk = allowed.test(file.mimetype.split('/')[1]);
    cb(null, extOk || mimeOk);
  },
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB (Supabase free tier friendly)
});

// GET /api/media — public: list all media
router.get('/', async (req, res) => {
  try {
    const category = req.query.category;
    let query = 'SELECT * FROM media ORDER BY created_at DESC';
    let params = [];
    if (category) {
      query = 'SELECT * FROM media WHERE category = $1 ORDER BY created_at DESC';
      params = [category];
    }
    const { rows } = await pool.query(query, params);
    res.json(rows);
  } catch (err) {
    console.error('Media fetch error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// POST /api/media/upload — admin: upload file(s) to Supabase Storage
router.post('/upload', authMiddleware, upload.array('files', 20), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ error: 'No files uploaded' });
    }

    if (!supabase) {
      return res.status(500).json({ error: 'Supabase storage not configured' });
    }

    const results = [];
    for (const file of req.files) {
      const ext = path.extname(file.originalname);
      const filename = `${Date.now()}-${Math.round(Math.random() * 1e6)}${ext}`;
      const isVideo = /video/.test(file.mimetype);
      const category = isVideo ? 'video' : 'photo';
      const storagePath = `${category}/${filename}`;

      // Upload to Supabase Storage
      const { error: uploadError } = await supabase.storage
        .from(BUCKET)
        .upload(storagePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (uploadError) {
        console.error('Supabase upload error:', uploadError.message);
        continue; // skip this file
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from(BUCKET).getPublicUrl(storagePath);
      const url = urlData.publicUrl;

      // Store metadata in database
      const { rows } = await pool.query(
        'INSERT INTO media (filename, original_name, mime_type, size, url, category, alt_text) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
        [filename, file.originalname, file.mimetype, file.size, url, category, req.body.alt_text || '']
      );

      results.push({
        id: rows[0].id,
        filename,
        original_name: file.originalname,
        mime_type: file.mimetype,
        size: file.size,
        url,
        category,
      });
    }

    if (results.length === 0) {
      return res.status(500).json({ error: 'All file uploads failed' });
    }

    res.status(201).json(results);
  } catch (err) {
    console.error('Media upload error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// DELETE /api/media/:id — admin: delete media from Supabase Storage
router.delete('/:id', authMiddleware, async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM media WHERE id = $1', [req.params.id]);
    if (rows.length === 0) return res.status(404).json({ error: 'Media not found' });

    if (supabase) {
      // Extract path from URL or reconstruct it
      const media = rows[0];
      const storagePath = `${media.category}/${media.filename}`;
      const { error: deleteError } = await supabase.storage.from(BUCKET).remove([storagePath]);
      if (deleteError) console.error('Supabase delete warning:', deleteError.message);
    }

    await pool.query('DELETE FROM media WHERE id = $1', [req.params.id]);
    res.json({ success: true });
  } catch (err) {
    console.error('Media delete error:', err.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
