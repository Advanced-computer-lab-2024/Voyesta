const adminModel = require('../Models/Admin');
const TourismGovernor = require('../Models/tourismGovernor');



// Create a new Admin profile
const createAdmin = async (req, res) => {
    const { username, password } = req.body;

    try {
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
const deleteAccount = async (req, res) => {
    const { username } = req.params; // Extract username from URL parameters

    try {
        const admin = await adminModel.findOneAndDelete({ username });  
        if(!admin) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json({ message: 'User profile deleted successfully', admin });
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

// Controller function to create a new tourism governor
const createTourismGovernor = async (req, res) => {
    const { username, password } = req.body;

    // Ensure username and password are provided
    if (!username || !password) {
        return res.status(400).json({ message: 'Username and password are required' });
    }

    try {
        // Create and save the new Tourism Governor
        const newGovernor = new TourismGovernor({ username, password });
        const savedGovernor = await newGovernor.save();
        
        return res.status(201).json({ message: 'Tourism Governor created successfully', governor: savedGovernor });
    } catch (error) {
        if (error.code === 11000) {
            // Handle duplicate username error
            return res.status(400).json({ message: 'Username already exists' });
        }
        return res.status(500).json({ message: 'Error creating Tourism Governor', error: error.message });
    }
};



module.exports = { createAdmin, updatePassword, deleteAccount ,sendOTPadmin, createTourismGovernor};