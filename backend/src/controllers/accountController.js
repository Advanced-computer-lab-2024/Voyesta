const Tourist = require('../Models/Tourist');
const TourGuide = require('../Models/Tour Guide');
const Advertiser = require('../Models/Advertiser');
const TourismGovernor = require('../Models/TourismGovernor');
const Admin = require('../Models/Admin');
const Seller = require('../Models/Seller');

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user.id;
  const userType = req.user.type;
  console.log(req.user);
  

  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'New passwords do not match' });
  }

  if (newPassword.length < 8) {
    return res.status(400).json({ message: 'New password must be at least 8 characters long' });
  }

  try {
    let user;
    switch (userType) {
      case 'tourist':
        user = await Tourist.findById(userId);
        break;
      case 'tourGuide':
        user = await TourGuide.findById(userId);
        break;
      case 'advertiser':
        user = await Advertiser.findById(userId);
        break;
      case 'tourismGovernor':
        user = await TourismGovernor.findById(userId);
        break;
      case 'admin':
        user = await Admin.findById(userId);
        break;
      case 'seller':
        user = await Seller.findById(userId);
        break;
      default:
        return res.status(400).json({ message: 'Invalid user type' });
    }

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    console.log(user.password);
    console.log(oldPassword);
    
    if (user.password !== oldPassword) {
      return res.status(400).json({ message: 'Incorrect old password' });
    }

    if (user.password === newPassword) {
      return res.status(400).json({ message: 'New password cannot be the same as the old password' });
    }

    user.password = newPassword;
    await user.save();

    res.status(200).json({ message: 'Password changed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  changePassword,
};