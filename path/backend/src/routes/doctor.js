const express = require('express');
const router = express.Router();
const doctorController = require('../controllers/doctorController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('admin'), doctorController.createDoctor);
router.get('/', doctorController.getDoctors);
router.get('/:id', doctorController.getDoctor);
router.put('/:id', authorize('admin'), doctorController.updateDoctor);
router.delete('/:id', authorize('admin'), doctorController.deleteDoctor);

module.exports = router;