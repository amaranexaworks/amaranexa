CREATE TABLE IF NOT EXISTS meeting_bookings (
  id INT AUTO_INCREMENT PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  contact_no VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  designation ENUM('Principal/Director', 'Teacher', 'Student', 'Parent') NOT NULL,
  school_name VARCHAR(200) NOT NULL,
  city VARCHAR(100) NOT NULL,
  status ENUM('new', 'contacted', 'done') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS enrollments (
  id INT AUTO_INCREMENT PRIMARY KEY,
  child_name VARCHAR(100) NOT NULL,
  parent_contact VARCHAR(20) NOT NULL,
  email VARCHAR(150) NOT NULL,
  child_grade VARCHAR(20) NOT NULL,
  child_school VARCHAR(200) NOT NULL,
  interested_in VARCHAR(100),
  status ENUM('new', 'contacted', 'enrolled') DEFAULT 'new',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
