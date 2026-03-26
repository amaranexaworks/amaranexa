const { pool } = require('../config/database');

const MeetingBooking = {
  async create(data) {
    const { rows } = await pool.query(
      'INSERT INTO meeting_bookings (name, contact_no, email, designation, school_name, city) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
      [data.name, data.contactNo, data.email, data.designation, data.schoolName, data.city]
    );
    return rows[0];
  },

  async getAll() {
    const { rows } = await pool.query(
      'SELECT * FROM meeting_bookings ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const { rows } = await pool.query(
      'SELECT * FROM meeting_bookings WHERE id = $1', [id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    await pool.query(
      'UPDATE meeting_bookings SET status = $1 WHERE id = $2', [status, id]
    );
  },

  async delete(id) {
    await pool.query('DELETE FROM meeting_bookings WHERE id = $1', [id]);
  },
};

module.exports = MeetingBooking;
