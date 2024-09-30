const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');

// POST route for creating a new tourism governor
router.post('/createTourismGoverner', adminController.createTourismGovernor);

module.exports = router;