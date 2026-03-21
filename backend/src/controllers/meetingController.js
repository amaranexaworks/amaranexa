const MeetingBooking = require('../models/MeetingBooking');

const meetingController = {
  async create(req, res) {
    try {
      const { name, contactNo, designation, schoolName, city } = req.body;
      if (!name || !contactNo || !designation || !schoolName || !city) {
        return res.status(400).json({ success: false, message: 'All fields are required' });
      }
      const result = await MeetingBooking.create(req.body);
      res.status(201).json({ success: true, message: 'Meeting request submitted successfully', id: result.insertId });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const bookings = await MeetingBooking.getAll();
      res.json({ success: true, data: bookings });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      await MeetingBooking.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, message: 'Status updated' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await MeetingBooking.delete(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },
};

module.exports = meetingController;
