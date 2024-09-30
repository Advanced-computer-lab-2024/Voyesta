const adminModel = require('../models/adminModel');
//const bcrypt = require('bcrypt');
const {otpSender} = require('../services/generateOTPgenric');



// Create a new Admin profile
const createAdmin = async (req, res) => {
    const { email,username, password } = req.body;

    try {
        if(await adminModel.exists({ email })) {  // Check if an admin profile with the email already exists
            return res.status(400).json({ message: 'Admin already exists' });
        }
        if (await adminModel.exists({ username })) {  // Check if an admin profile with the username already exists
            return res.status(400).json({ message: 'Admin already exists' });
        }
        const admin = await adminModel.create({
            username,
            password, // Remember to hash the password before saving in production
        });
        res.status(201).json({ message: 'Admin profile created successfully', admin });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// update Password
const updatePassword = async (req, res) => {
    const { username } = req.params; // Extract username from URL parameters
    const { oldPassword,newPassword } = req.body; // Extract new password from request body

    try {
       const admin = await adminModel.findOne({ username });
       if(!admin) {
           return res.status(404).json({ message: 'Admin not found' });
       }

         // Check if the old password matches the one in the database
         if(oldPassword !== admin.password) {
            return res.status(400).json({ message: 'Old password is incorrect' });
        }

        admin.password = newPassword; // Update the password
        await admin.save(); // Save the updated admin profile
        res.json({ message: 'Password updated successfully', admin });

    }
     catch (error) {
        res.status(400).json({ error: error.message });
    }
};

// Delete an Admin profile
const deleteAdmin = async (req, res) => {
    const { username } = req.params; // Extract username from URL parameters

    try {
        const admin = await adminModel.findOneAndDelete({ username });  
        if(!admin) {
            return res.status(404).json({ message: 'Admin not found' });
        }
        res.json({ message: 'Admin profile deleted successfully', admin });
    }
    catch (error) {
        res.status(400).json({ error: error.message });
    }
}
// forget password endpoint
const sendOTPadmin = async (req, res) => {
    const { email } = req.body;
    try {
        const response = await otpSender(adminModel, email);
        res.json(response);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


module.exports = { createAdmin, updatePassword, deleteAdmin ,sendOTPadmin};