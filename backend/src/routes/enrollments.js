const express = require('express');
const router = express.Router();
const enrollmentController = require('../controllers/enrollmentController');

router.post('/', enrollmentController.create);
router.get('/', enrollmentController.getAll);
router.patch('/:id/status', enrollmentController.updateStatus);
router.delete('/:id', enrollmentController.delete);

module.exports = router;
