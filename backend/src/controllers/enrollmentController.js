const Enrollment = require('../models/Enrollment');

const enrollmentController = {
  async create(req, res) {
    try {
      const { childName, parentContact, childGrade, childSchool } = req.body;
      if (!childName || !parentContact || !childGrade || !childSchool) {
        return res.status(400).json({ success: false, message: 'All required fields must be filled' });
      }
      const result = await Enrollment.create(req.body);
      res.status(201).json({ success: true, message: 'Enrollment submitted successfully', id: result.insertId });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async getAll(req, res) {
    try {
      const enrollments = await Enrollment.getAll();
      res.json({ success: true, data: enrollments });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async updateStatus(req, res) {
    try {
      await Enrollment.updateStatus(req.params.id, req.body.status);
      res.json({ success: true, message: 'Status updated' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },

  async delete(req, res) {
    try {
      await Enrollment.delete(req.params.id);
      res.json({ success: true, message: 'Deleted successfully' });
    } catch (err) {
      res.status(500).json({ success: false, message: 'Server error', error: err.message });
    }
  },
};

module.exports = enrollmentController;
