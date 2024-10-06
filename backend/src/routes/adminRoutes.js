const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');


router.post('/createTourismGoverner', authenticate, adminController.createTourismGovernor);
router.post('/createAdmin', adminController.createAdmin);
router.patch('/updatePassword', adminController.updatePassword);
router.delete('/deleteAccount', adminController.deleteAccount);

module.exports = router;