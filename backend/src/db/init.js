const { pool } = require('../config/database');

async function initDatabase() {
  const conn = await pool.getConnection();
  try {
    // Admin users
    await conn.query(`CREATE TABLE IF NOT EXISTS admin_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(50) NOT NULL UNIQUE,
      password_hash VARCHAR(255) NOT NULL,
      role ENUM('admin', 'editor') DEFAULT 'editor',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Media uploads
    await conn.query(`CREATE TABLE IF NOT EXISTS media (
      id INT AUTO_INCREMENT PRIMARY KEY,
      filename VARCHAR(255) NOT NULL,
      original_name VARCHAR(255) NOT NULL,
      mime_type VARCHAR(100) NOT NULL,
      size INT NOT NULL,
      url VARCHAR(500) NOT NULL,
      category ENUM('photo', 'video', 'other') DEFAULT 'other',
      alt_text VARCHAR(255) DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    // Blog posts
    await conn.query(`CREATE TABLE IF NOT EXISTS blog_posts (
      id INT AUTO_INCREMENT PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      excerpt TEXT NOT NULL,
      image VARCHAR(500) DEFAULT '',
      category VARCHAR(100) DEFAULT '',
      read_time VARCHAR(50) DEFAULT '',
      comments INT DEFAULT 0,
      likes INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    // Page content (JSON blobs per page)
    await conn.query(`CREATE TABLE IF NOT EXISTS page_content (
      id INT AUTO_INCREMENT PRIMARY KEY,
      page_key VARCHAR(50) NOT NULL UNIQUE,
      content JSON NOT NULL,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )`);

    // Nav links
    await conn.query(`CREATE TABLE IF NOT EXISTS nav_links (
      id INT AUTO_INCREMENT PRIMARY KEY,
      label VARCHAR(100) NOT NULL,
      href VARCHAR(200) NOT NULL,
      enabled TINYINT(1) DEFAULT 1,
      sort_order INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`);

    console.log('All tables created successfully');
  } catch (err) {
    console.error('Database init error:', err.message);
    throw err;
  } finally {
    conn.release();
  }
}

module.exports = { initDatabase };
