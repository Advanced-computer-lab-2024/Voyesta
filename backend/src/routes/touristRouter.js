const express = require("express");
const authenticate = require("../middleware/authenticate");
let _ = express.Router();
const { redeemPromoCode } = require('../controllers/touristController.js');

const { createTourist, getTourists, updateTourist, 
    deleteTourist, 
    redeemPoints , 
    searchFlights,
    searchHotels ,
    confirmFlightPrice,
    confirmHotelPrice,
    bookFlight,
    bookHotel,  
    searchHotelsByCity,
    createAddress,
    getAddresses,
    createOrder,
    getOrders,
    getOrder,
    cancelOrder,
    pay, 
    deleteAddresses,
    bookmarkActivity,
    unbookmarkActivity,
    bookmarkItinerary,
    unbookmarkItinerary,
    getBookmarkedItems,
    isBookmarked,
    clearCart} = require("../controllers/touristController");
const { get } = require("../controllers/museumsHistoricalPlacesController");
const activityController = require('../controllers/activityController');
const itineraryController = require('../controllers/itineraryController');
const productController = require('../controllers/productController');
const { getActivityCategory } = require('../controllers/activityCategoryController');
const { TourGuideComments, rateTourGuide, checkTourGuideRatingAndComment } = require('../controllers/tourGuideController');
const { getPreferenceTags } = require('../controllers/preferenceTagContoller');
const { createBooking, getBookings, cancelBooking, payForBooking ,viewAllPaidBookings } = require('../controllers/bookingController');
const { createComplaint, getComplaintById, getComplaints } = require('../controllers/complaintController');
const { changePassword, setStatusToDeleted } = require('../controllers/accountController');
const { requestNotification, getNotifications , getUnreadNotifications } = require('../controllers/NotificationController');
const { sendPaymentReceipt } = require('../controllers/purchaseController');

_.post("/add", createTourist);
_.get("/get", authenticate, getTourists);
_.put("/update", authenticate, updateTourist);
_.delete("/delete", authenticate, deleteTourist);

_.get('/getProducts', authenticate, productController.getProducts);
_.get('/getActivity', activityController.getActivity);
_.get('/getItinerary', authenticate, itineraryController.getItineraries);
_.get("/getPlaces", authenticate, get);
_.get('/getCategory', authenticate, getActivityCategory);
_.get('/getTags', authenticate, getPreferenceTags);

_.patch('/tourGuideComment/:id', authenticate, TourGuideComments);
_.patch('/tourGuideRate/:id', authenticate, rateTourGuide);
_.get('/checkTourGuideRatingAndComment/:id', authenticate, checkTourGuideRatingAndComment);

_.patch('/activityComment/:id', authenticate, activityController.addComment);
_.patch('/activityRate/:id', authenticate, activityController.addRating);
_.patch('/itineraryRate/:id', authenticate, itineraryController.addItineraryRating);
_.patch('/itineraryComment/:id', authenticate, itineraryController.addItineraryComment);

_.patch('/productRate/:id', authenticate, productController.rateProduct);
_.patch('/productReview/:id', authenticate, productController.reviewProduct);

_.get('/checkActivityRatingAndComment/:id', authenticate, activityController.checkActivityRatingAndComment);
_.get('/checkItineraryRatingAndComment/:id', authenticate, itineraryController.checkItineraryRatingAndComment);

_.post('/BookEvent/:id', authenticate, createBooking);
_.get('/getBookings', authenticate, getBookings);
_.patch('/cancelBooking/:id', authenticate, cancelBooking);
_.patch('/payForBooking/:id', authenticate, payForBooking);
_.get('/viewAllPaidBookings', authenticate, viewAllPaidBookings);
_.patch('/redeemPoints', authenticate, redeemPoints);

_.post('/createComplaint', authenticate, createComplaint);
_.get('/getComplaintById/:id', authenticate, getComplaintById);
_.get('/getComplaints', authenticate, getComplaints);

_.patch('/changePassword', authenticate, changePassword);
_.patch('/setStatusToDeleted', authenticate, setStatusToDeleted);

_.get('/searchFlights', authenticate, searchFlights);
_.get('/searchHotels', authenticate, searchHotelsByCity);
_.post('/confirmFlightPrice', authenticate, confirmFlightPrice);

_.get('/transportationActivities', authenticate, activityController.getTransportationActivities);

_.post('/createAddress', authenticate, createAddress);
_.get('/getAddresses', authenticate, getAddresses); 
_.post('/createOrder', authenticate, createOrder);
_.get('/getOrders', authenticate, getOrders);
_.get('/getOrder/:orderId', authenticate, getOrder);
_.patch('/cancelOrder/:orderId', authenticate, cancelOrder);
_.patch('/pay', authenticate, pay);
_.post('/addToCart', authenticate, productController.addCart);
_.delete('/removefromCart', authenticate, productController.removeCart);
_.post('/AddToWishList',authenticate,productController.addToWishlist);
_.get('/ViewList',authenticate,productController.getWishlist);
_.post('/deleteWish',authenticate,productController.removeFromWishlist);
_.post('/moveToCart', authenticate, productController.moveWishlistToCart);
_.get('/getCart', authenticate, productController.getCart);
_.post('/updateQuantity', authenticate, productController.updateCartQuantity);

_.delete('/deleteAddresses/:id', deleteAddresses);
_.post('/redeemPromoCode', authenticate, redeemPromoCode);

_.post('/bookmark', authenticate,bookmarkActivity);
_.delete('/bookmark/:id', authenticate,unbookmarkActivity);
_.post('/bookmarkItinerary', authenticate, bookmarkItinerary);
_.delete('/bookmarkItinerary', authenticate, unbookmarkItinerary);
_.get('/bookmarked-items', authenticate, getBookmarkedItems);
_.get('/isBookmarked/:id', authenticate, isBookmarked);

_.post('/requestNotification', authenticate, requestNotification);
_.get('/getNotifications', authenticate, getNotifications);
_.get('/getUnreadNotifications', authenticate, getUnreadNotifications);

_.post('/sendPaymentReceipt', authenticate, sendPaymentReceipt);
_.post('/clearCart', authenticate, clearCart);

module.exports = _;