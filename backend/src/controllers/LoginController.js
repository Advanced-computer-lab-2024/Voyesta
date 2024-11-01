const TourismGovernor = require('../Models/tourismGovernor');
const Admin = require('../Models/Admin');
const Seller = require('../Models/Seller'); // Import the Seller model
const TourGuide = require('../Models/Tour Guide'); // Import the TourGuide model
const Advertiser = require('../Models/Advertiser'); // Import the Advertiser model
const Tourist = require('../Models/Tourist');


const { generateToken } = require('../utils/jwt');


const Login = async (req, res) => {
    const { username, password } = req.body;

    try {

      let token = ""

      // Check in TourGuide Model
      const tourGuide = await TourGuide.findOne({ username });
      if (tourGuide) {
        if (tourGuide.password === password) {
          token = generateToken(tourGuide._id, 'tourGuide');
          return res.status(200).json({ message: 'Tour Guide login successful', token, userType: "tourGuide" });
        } 
      }


      // Check in TourismGovernor Model
      const governor = await TourismGovernor.findOne({ username });
      if (governor) {
        if (governor.password === password) {
          token = generateToken(governor._id, 'tourismGovernor');
          return res.status(200).json({ message: 'Governor login successful', token, userType: "tourismGovernor" });
        } 
      }
  
      // Check in Admin Model 
      const admin = await Admin.findOne({ username });
      if (admin) {
        if (admin.password === password) {
          token = generateToken(admin._id, 'admin');
          return res.status(200).json({ message: 'Admin login successful', token, userType: "admin" });
        } 
      }

      // Check in Seller Model 
      const seller = await Seller.findOne({ username });
      if (seller) {
        if (seller.password === password) {
          token = generateToken(seller._id, 'seller');
          return res.status(200).json({ message: 'Seller login successful', token, userType: "seller" });
        } 
      }

      // Check in Advertiser Model
      const advertiser = await Advertiser.findOne({ username });
      if (advertiser) {
          if (advertiser.password === password) {
              token = generateToken(advertiser._id, 'advertiser');
              return res.status(200).json({ message: 'Advertiser login successful', token, userType: "advertiser" });
          }
      }

      // Check in Tourist Model
      const tourist = await Tourist.findOne({ username });
      if (tourist) {
          if (tourist.password === password) {
              token = generateToken(tourist._id, 'tourist');
              return res.status(200).json({ message: 'Tourist login successful', token, userType: "tourist" });
          }
      }
      
      // If user not found in either models
      res.status(404).json({ message: 'User not found' });
  
    } catch (error) {
      res.status(500).json({ message: 'Server error', error });
    }
}

module.exports = { Login }