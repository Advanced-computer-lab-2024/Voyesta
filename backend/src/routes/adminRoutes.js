const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST route for creating a new tourism governor
router.post('/createTourismGoverner', adminController.createTourismGovernor);
router.post('/createAdmin', adminController.createAdmin);
router.patch('/updatePassword', adminController.updatePassword);
router.delete('/deleteAccount', adminController.deleteAccount);

module.exports = router;