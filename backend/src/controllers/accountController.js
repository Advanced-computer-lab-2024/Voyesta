const Tourist = require('../Models/Tourist');
const TourGuide = require('../Models/Tour Guide');
const Advertiser = require('../Models/Advertiser');
const TourismGovernor = require('../Models/tourismGovernor');
const Admin = require('../Models/Admin');
const Seller = require('../Models/Seller');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const Booking = require('../Models/Booking');
const OTP = require('../Models/OTP');
const sgMail = require('@sendgrid/mail');

sgMail.setApiKey('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');

const sendOtp = async (req, res) => {
  const { username } = req.body;
  try {
    let user;
    let email;

    // Check in all personas
    user = await Tourist.findOne({ username }) ||
           await TourGuide.findOne({ username }) ||
           await Advertiser.findOne({ username }) ||
           await TourismGovernor.findOne({ username }) ||
           await Admin.findOne({ username }) ||
           await Seller.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    email = user.email;

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    const existingOtp = await OTP.findOne({ email });
    if (existingOtp) {
      existingOtp.otp = otp;
      await existingOtp.save();
    } else {
      await OTP.create({ username, email, otp });
    }

    const resetPasswordUrl = `http://localhost:5173/reset-password?otp=${otp}`;

    const msg = {
      to: email, // Recipient
      from: 'voyesta@outlook.com', // Verified sender
      subject: 'Reset Your Password',
      text: `Your OTP code is ${otp}. Click the button below to reset your password.`,
      html: `<strong>Your OTP code is ${otp}</strong><br/><a href="${resetPasswordUrl}" style="background-color: #007BFF; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>`,
    };
    console.log(msg);
    sgMail
      .send(msg)
      .then(() => console.log('Email sent'))
      .catch((error) => {
        console.error('Error:', error);
        res.status(500).json({ message: 'Error sending OTP', error });
      });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

const resetPassword = async (req, res) => {
  const { otp, newPassword, confirmNewPassword } = req.body;
  if (newPassword !== confirmNewPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }
  try {
    const otpRecord = await OTP.findOne({ otp });
    if (!otpRecord) {
      return res.status(400).json({ message: 'Invalid OTP' });
    }

    let user;
    user = await Tourist.findOne({ username: otpRecord.username }) ||
           await TourGuide.findOne({ username: otpRecord.username }) ||
           await Advertiser.findOne({ username: otpRecord.username }) ||
           await TourismGovernor.findOne({ username: otpRecord.username }) ||
           await Admin.findOne({ username: otpRecord.username }) ||
           await Seller.findOne({ username: otpRecord.username });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    user.password = newPassword;
    await user.save();
    await OTP.deleteOne({ otp });
    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

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

const setStatusToRejected = async (req, res) => {
  const { id } = req.params;

  try {
    let user = await TourGuide.findById(id) ||
                await Advertiser.findById(id) ||
                await Seller.findById(id);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = 'rejected';
    await user.save();

    res.status(200).json({ message: 'Status set to rejected successfully' });
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
    let user;
    let userType;

    user = await Tourist.findByIdAndDelete(id);
    if (user) {
      userType = 'tourist';
    } else {
      user = await TourGuide.findByIdAndDelete(id);
      if (user) {
        userType = 'tourGuide';
      } else {
        user = await Advertiser.findByIdAndDelete(id);
        if (user) {
          userType = 'advertiser';
        } else {
          user = await TourismGovernor.findByIdAndDelete(id);
          if (user) {
            userType = 'tourismGovernor';
          } else {
            user = await Admin.findByIdAndDelete(id);
            if (user) {
              userType = 'admin';
            } else {
              user = await Seller.findByIdAndDelete(id);
              if (user) {
                userType = 'seller';
              }
            }
          }
        }
      }
    }

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
  setStatusToRejected,
  setStatusToActive,
  deleteAccount,
  getDeletedUsers,
  sendOtp,
  resetPassword
};