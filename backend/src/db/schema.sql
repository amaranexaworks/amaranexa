-- ── Existing tables ──────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS meeting_bookings (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_no VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  designation VARCHAR(50) NOT NULL CHECK (designation IN ('Principal/Director', 'Teacher', 'Student', 'Parent')),
  school_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'done')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
  id SERIAL PRIMARY KEY,
  child_name VARCHAR(100) NOT NULL,
  parent_contact VARCHAR(50) NOT NULL,
  email VARCHAR(150) DEFAULT '',
  child_grade VARCHAR(20) NOT NULL,
  child_school VARCHAR(200) NOT NULL,
  interested_in VARCHAR(100),
  status VARCHAR(20) DEFAULT 'new' CHECK (status IN ('new', 'contacted', 'enrolled')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Admin users ─────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS admin_users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(50) NOT NULL UNIQUE,
  password_hash VARCHAR(255) NOT NULL,
  role VARCHAR(20) DEFAULT 'editor' CHECK (role IN ('admin', 'editor')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Media uploads ───────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS media (
  id SERIAL PRIMARY KEY,
  filename VARCHAR(255) NOT NULL,
  original_name VARCHAR(255) NOT NULL,
  mime_type VARCHAR(100) NOT NULL,
  size INT NOT NULL,
  url VARCHAR(500) NOT NULL,
  category VARCHAR(20) DEFAULT 'other' CHECK (category IN ('photo', 'video', 'other')),
  alt_text VARCHAR(255) DEFAULT '',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Blog posts ──────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS blog_posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  excerpt TEXT NOT NULL,
  image VARCHAR(500) DEFAULT '',
  category VARCHAR(100) DEFAULT '',
  read_time VARCHAR(50) DEFAULT '',
  comments INT DEFAULT 0,
  likes INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Page content (stores JSON blobs for each page section) ──────────────────
CREATE TABLE IF NOT EXISTS page_content (
  id SERIAL PRIMARY KEY,
  page_key VARCHAR(50) NOT NULL UNIQUE,
  content JSONB NOT NULL,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Nav links ───────────────────────────────────────────────────────────────
CREATE TABLE IF NOT EXISTS nav_links (
  id SERIAL PRIMARY KEY,
  label VARCHAR(100) NOT NULL,
  href VARCHAR(200) NOT NULL,
  enabled BOOLEAN DEFAULT true,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ── Triggers for updated_at ─────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS blog_posts_updated_at ON blog_posts;
CREATE TRIGGER blog_posts_updated_at
  BEFORE UPDATE ON blog_posts
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

DROP TRIGGER IF EXISTS page_content_updated_at ON page_content;
CREATE TRIGGER page_content_updated_at
  BEFORE UPDATE ON page_content
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
