const { pool } = require('../config/database');

const Enrollment = {
  async create(data) {
    const [result] = await pool.execute(
      'INSERT INTO enrollments (child_name, parent_contact, email, child_grade, child_school, interested_in) VALUES (?, ?, ?, ?, ?, ?)',
      [data.childName, data.parentContact, data.email, data.childGrade, data.childSchool, data.interestedIn || null]
    );
    return result;
  },

  async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM enrollments ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM enrollments WHERE id = ?', [id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    await pool.execute(
      'UPDATE enrollments SET status = ? WHERE id = ?', [status, id]
    );
  },

  async delete(id) {
    await pool.execute('DELETE FROM enrollments WHERE id = ?', [id]);
  },
};

module.exports = Enrollment;
