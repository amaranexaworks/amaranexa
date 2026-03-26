const { pool } = require('../config/database');

const Enrollment = {
  async create(data) {
    const { rows } = await pool.query(
      'INSERT INTO enrollments (child_name, parent_contact, email, child_grade, child_school, interested_in) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.childName, data.parentContact, data.email, data.childGrade, data.childSchool, data.interestedIn || null]
    );
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM enrollments ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM enrollments WHERE id = $1', [id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    await pool.query(
      'UPDATE enrollments SET status = $1 WHERE id = $2', [status, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM enrollments WHERE id = $1', [id]);
  },
};

module.exports = Enrollment;
