/**
 * Create an admin user manually.
 * Usage: node create-admin.js <username> <password>
 */
require('dotenv').config();
const bcrypt = require('bcryptjs');
const { pool } = require('./src/config/database');

async function createAdmin() {
  const [username, password] = process.argv.slice(2);

  if (!username || !password) {
    console.error('Usage: node create-admin.js <username> <password>');
    process.exit(1);
  }

  if (password.length < 6) {
    console.error('Password must be at least 6 characters');
    process.exit(1);
  }

  try {
    const hash = await bcrypt.hash(password, 10);
    await pool.query(
      'INSERT INTO admin_users (username, password_hash, role) VALUES ($1, $2, $3)',
      [username, hash, 'admin']
    );
    console.log(`Admin user "${username}" created successfully.`);
  } catch (err) {
    if (err.code === '23505') {
      console.error(`Username "${username}" already exists.`);
    } else {
      console.error('Error:', err.message);
    }
  }
  process.exit(0);
}

createAdmin();
