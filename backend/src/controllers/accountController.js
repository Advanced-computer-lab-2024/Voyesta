const Tourist = require('../Models/Tourist');
const TourGuide = require('../Models/Tour Guide');
const Advertiser = require('../Models/Advertiser');
const TourismGovernor = require('../Models/tourismGovernor');
const Admin = require('../Models/Admin');
const Seller = require('../Models/Seller');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const Booking = require('../Models/Booking');

const changePassword = async (req, res) => {
  const { oldPassword, newPassword, confirmNewPassword } = req.body;
  const userId = req.user.id;
  const userType = req.user.type;

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

const setStatusToDeleted = async (req, res) => {
  const userId = req.user.id;
  const userType = req.user.type;

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

    if (userType === 'tourGuide' || userType === 'advertiser') {
      const upcomingBookings = await Booking.find({
        bookableModel: userType === 'tourGuide' ? 'Itinerary' : 'Activity',
        bookable: { $in: userType === 'tourGuide' ? await Itinerary.find({ createdBy: userId }).distinct('_id') : await Activity.find({ advertiser: userId }).distinct('_id') },
        eventDate: { $gte: new Date() }
      });

      if (upcomingBookings.length > 0) {
        return res.status(400).json({ message: 'Cannot delete user with upcoming booked activities or itineraries' });
      }
    }

    user.status = 'deleted';
    await user.save();

    res.status(200).json({ message: 'Status set to deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const setStatusToActive = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await Tourist.findById(id) ||
               await TourGuide.findById(id) ||
               await Advertiser.findById(id) ||
               await TourismGovernor.findById(id) ||
               await Admin.findById(id) ||
               await Seller.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.status = 'active';
    await user.save();

    res.status(200).json({ message: 'Status set to active successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await Tourist.findByIdAndDelete(id) ||
               await TourGuide.findByIdAndDelete(id) ||
               await Advertiser.findByIdAndDelete(id) ||
               await TourismGovernor.findByIdAndDelete(id) ||
               await Admin.findByIdAndDelete(id) ||
               await Seller.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (userType === 'tourGuide') {
      await Itinerary.deleteMany({ createdBy: id });
    } else if (userType === 'advertiser') {
      await Activity.deleteMany({ advertiser: id });
    }

    res.status(200).json({ message: 'Account deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getDeletedUsers = async (req, res) => {
  try {
    const tourists = await Tourist.find({ status: 'deleted' });
    const tourGuides = await TourGuide.find({ status: 'deleted' });
    const advertisers = await Advertiser.find({ status: 'deleted' });
    const tourismGovernors = await TourismGovernor.find({ status: 'deleted' });
    const admins = await Admin.find({ status: 'deleted' });
    const sellers = await Seller.find({ status: 'deleted' });

    const deletedUsers = [
      ...tourists,
      ...tourGuides,
      ...advertisers,
      ...tourismGovernors,
      ...admins,
      ...sellers
    ];

    res.status(200).json(deletedUsers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  changePassword,
  setStatusToDeleted,
  setStatusToActive,
  deleteAccount,
  getDeletedUsers,
};