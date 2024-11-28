const Product = require('../Models/product');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');
const Purchase = require('../Models/Purchase');
const Booking = require('../Models/Booking');

const getRevenue = async (req, res) => {
  const userId = req.user.id;
  const userType = req.user.type;

  try {
    let data = {};

    if (userType === 'admin') {
      const purchases = await Purchase.find({});
      const bookings = await Booking.find({ status: 'confirmed' });

      const productRevenue = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);
      const activityRevenue = bookings
        .filter(booking => booking.bookableModel === 'Activity')
        .reduce((acc, booking) => acc + booking.amount, 0);
      const itineraryRevenue = bookings
        .filter(booking => booking.bookableModel === 'Itinerary')
        .reduce((acc, booking) => acc + booking.amount, 0);

      const totalRevenue = productRevenue + activityRevenue + itineraryRevenue;
      const adminRevenue = totalRevenue * 0.1; // 10% of total revenue

      data = {
        productRevenue,
        activityRevenue,
        itineraryRevenue,
        totalRevenue,
        adminRevenue
      };
    } else if (userType === 'seller') {
      const purchases = await Purchase.find({ sellerId: userId });
      const productRevenue = purchases.reduce((acc, purchase) => acc + purchase.amount, 0);

      data = {
        productRevenue
      };
    } else if (userType === 'advertiser') {
      const activities = await Activity.find({ createdBy: userId, bookableModel: 'Activity', status: 'confirmed' });
      const activityRevenue = activities.reduce((acc, activity) => acc + activity.price * activity.sold, 0);

      data = {
        activityRevenue
      };
    } else if (userType === 'tour guide') {
      const itineraries = await Itinerary.find({ createdBy: userId, bookableModel: 'Itinerary', status: 'confirmed' });
      const itineraryRevenue = itineraries.reduce((acc, itinerary) => acc + itinerary.price * itinerary.sold, 0);

      data = {
        itineraryRevenue
      };
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getRevenue };