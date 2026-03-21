const { pool } = require('../config/database');

const MeetingBooking = {
  async create(data) {
    const [result] = await pool.execute(
      'INSERT INTO meeting_bookings (name, contact_no, email, designation, school_name, city) VALUES (?, ?, ?, ?, ?, ?)',
      [data.name, data.contactNo, data.email, data.designation, data.schoolName, data.city]
    );
    return result;
  },

  async getAll() {
    const [rows] = await pool.execute(
      'SELECT * FROM meeting_bookings ORDER BY created_at DESC'
    );
    return rows;
  },

  async getById(id) {
    const [rows] = await pool.execute(
      'SELECT * FROM meeting_bookings WHERE id = ?', [id]
    );
    return rows[0];
  },

  async updateStatus(id, status) {
    await pool.execute(
      'UPDATE meeting_bookings SET status = ? WHERE id = ?', [status, id]
    );
  },

  async delete(id) {
    await pool.execute('DELETE FROM meeting_bookings WHERE id = ?', [id]);
  },
};

module.exports = MeetingBooking;
