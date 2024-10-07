const TourismGovernor = require('../Models/tourismGovernor');
const Admin = require('../Models/Admin');

const { generateToken } = require('../utils/jwt');


const Login = async (req, res) => {
    const { username, password } = req.body;

    try {
        // Check in TourismGovernor Model
        let token = ""
        const governor = await TourismGovernor.findOne({ username });
        if (governor) {
          if (governor.password === password) {
            token = generateToken(governor._id, 'tourismGovernor');
            return res.status(200).json({ message: 'Governor login successful', token, userType: "tourismGovernor" });
          } 
        }
    
        // Check in Admin Model if not found in TourismGovernor
        const admin = await Admin.findOne({ username });
        if (admin) {
          if (admin.password === password) {
            token = generateToken(admin._id, 'admin');
            return res.status(200).json({ message: 'Admin login successful', token, userType: "admin" });
          } 
        }
        
    
        // If user not found in either models
        res.status(404).json({ message: 'User not found' });
    
      } catch (error) {
        res.status(500).json({ message: 'Server error', error });
      }
}

module.exports = { Login }