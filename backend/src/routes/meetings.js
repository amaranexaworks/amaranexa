const express = require('express');
const router = express.Router();
const meetingController = require('../controllers/meetingController');

router.post('/', meetingController.create);
router.get('/', meetingController.getAll);
router.patch('/:id/status', meetingController.updateStatus);
router.delete('/:id', meetingController.delete);

module.exports = router;
