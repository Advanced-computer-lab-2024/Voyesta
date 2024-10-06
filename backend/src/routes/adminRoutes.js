const express = require('express');
const _ = express.Router();

const adminController = require('../controllers/adminController');
const authenticate = require('../middleware/authenticate');

const {
    createActivityCategory, 
    getActivityCategory, 
    updateActivityCategory, 
    deleteActivityCategoryById
} = require('../controllers/activityCategoryController');

router.post('/createTourismGoverner', authenticate, adminController.createTourismGovernor);
router.post('/createAdmin', adminController.createAdmin);
router.patch('/updatePassword', adminController.updatePassword);
router.delete('/deleteAccount', adminController.deleteAccount);

module.exports = _;