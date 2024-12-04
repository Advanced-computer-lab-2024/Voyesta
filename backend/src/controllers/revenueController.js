const Product = require('../Models/product');
const Purchase = require('../Models/Purchase');
const Booking = require('../Models/Booking');
const Activity = require('../Models/Activity');
const Itinerary = require('../Models/Itinerary');

const getRevenue = async (req, res) => {
  const userId = req.user.id;
  const userType = req.user.type;
  const { activityId, startDate, endDate, itineraryId, productId } = req.query;

  try {
    let data = {};

    if (userType === 'admin') {
      let query = {};

      if (productId) {
        query.productId = productId;
      }

      if (startDate && endDate) {
        query.purchaseDate = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const purchases = await Purchase.find(query).populate('productId');
      const bookings = await Booking.find({ status: 'confirmed' });

      const productRevenue = purchases.reduce((acc, purchase) => {
        const productPrice = purchase.productId.price;
        return acc + (productPrice * purchase.quantity);
      }, 0).toFixed(2);

      const activityRevenue = bookings
        .filter(booking => booking.bookableModel === 'Activity')
        .reduce((acc, booking) => acc + booking.amount, 0).toFixed(2);

      const itineraryRevenue = bookings
        .filter(booking => booking.bookableModel === 'Itinerary')
        .reduce((acc, booking) => acc + booking.amount, 0).toFixed(2);

      const totalRevenue = (parseFloat(productRevenue) + parseFloat(activityRevenue) + parseFloat(itineraryRevenue)).toFixed(2);
      const adminRevenue = (totalRevenue * 0.1).toFixed(2); // 10% of total revenue

      data = {
        productRevenue,
        activityRevenue,
        itineraryRevenue,
        totalRevenue,
        adminRevenue
      };
    } else if (userType === 'seller') {
      let query = { status: 'confirmed' };

      if (productId) {
        query.productId = productId;
      }

      if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const purchases = await Purchase.find(query).populate('productId');
      const sellerProducts = await Product.find({ createdBy: userId });

      const productRevenue = purchases.reduce((acc, purchase) => {
        const product = sellerProducts.find(p => p._id.equals(purchase.productId._id));
        if (product) {
          return acc + (product.price * purchase.quantity);
        }
        return acc;
      }, 0).toFixed(2);

      data = {
        productRevenue
      };
    } else if (userType === 'advertiser') {
      let query = { bookableModel: 'Activity', status: 'confirmed' };

      if (activityId) {
        query.bookable = activityId;
      }

      if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const bookings = await Booking.find(query).populate('bookable');
      const advertiserActivities = await Activity.find({ advertiser: userId });

      const activityRevenue = bookings.reduce((acc, booking) => {
        const activity = advertiserActivities.find(a => a._id.equals(booking.bookable._id));
        if (activity) {
          return acc + booking.amount;
        }
        return acc;
      }, 0).toFixed(2);

      data = {
        activityRevenue
      };
    } else if (userType === 'tourGuide') {
      let query = { bookableModel: 'Itinerary', status: 'confirmed' };

      if (itineraryId) {
        query.bookable = itineraryId;
      }

      if (startDate && endDate) {
        query.createdAt = { $gte: new Date(startDate), $lte: new Date(endDate) };
      }

      const bookings = await Booking.find(query).populate('bookable');
      const tourGuideItineraries = await Itinerary.find({ createdBy: userId });

      const itineraryRevenue = bookings.reduce((acc, booking) => {
        const itinerary = tourGuideItineraries.find(i => i._id.equals(booking.bookable._id));
        if (itinerary) {
          return acc + booking.amount;
        }
        return acc;
      }, 0).toFixed(2);

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

const getBookingsReport = async (req, res) => {
  const userId = req.user.id;
  const userType = req.user.type;
  const { activityId, itineraryId, month } = req.query;

  try {
    let data = {};

    if (userType === 'advertiser') {
      let query = { bookableModel: 'Activity', status: 'confirmed' };
      const advertiserActivities = await Activity.find({ advertiser: userId });

      if (activityId) {
        query.bookable = activityId;
      }

      if (month) {
        const startOfMonth = new Date(month);
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
      }

      const bookings = await Booking.find(query).populate('bookable');
      const activityBookings = bookings.reduce((acc, booking) => {
        const activity = advertiserActivities.find(a => a._id.equals(booking.bookable._id));
        if (activity) {
          return acc + 1;
        }
        return acc;
      }, 0).toFixed(0);

      data = {
        activityBookings
      };
    } else if (userType === 'tourGuide') {
      let query = { bookableModel: 'Itinerary', status: 'confirmed' };
      const tourGuideItineraries = await Itinerary.find({ createdBy: userId });

      if (itineraryId) {
        query.bookable = itineraryId;
      }

      if (month) {
        const startOfMonth = new Date(month);
        const endOfMonth = new Date(startOfMonth.getFullYear(), startOfMonth.getMonth() + 1, 0);
        query.createdAt = { $gte: startOfMonth, $lte: endOfMonth };
      }

      const bookings = await Booking.find(query).populate('bookable');
      const itineraryBookings = bookings.reduce((acc, booking) => {
        const itinerary = tourGuideItineraries.find(i => i._id.equals(booking.bookable._id));
        if (itinerary) {
          return acc + 1;
        }
        return acc;
      }, 0).toFixed(0);

      data = {
        itineraryBookings
      };
    }

    res.status(200).json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

module.exports = { getRevenue, getBookingsReport };