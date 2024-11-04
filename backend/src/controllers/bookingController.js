// backend/src/controllers/bookingController.js
const Booking = require('../Models/Booking');
const Tourist = require('../Models/Tourist');
const Itinerary = require('../Models/Itinerary');
const Activity = require('../Models/Activity');

const createBooking = async (req, res) => {
    const { bookableModel, eventDate } = req.body;
    const touristId = req.user.id;
    const bookableId = req.params.id;

    if (!['Itinerary', 'Activity'].includes(bookableModel)) {
        return res.status(400).json({ error: 'Invalid bookable model' });
    }

    try {
        let amount;
        if (bookableModel === 'Itinerary') {
            const itinerary = await Itinerary.findById(bookableId);
            if (!itinerary) {
                return res.status(404).json({ error: 'Itinerary not found' });
            }
            amount = itinerary.tourPrice;
        } else if (bookableModel === 'Activity') {
            const activity = await Activity.findById(bookableId);
            if (!activity) {
                return res.status(404).json({ error: 'Activity not found' });
            }
            amount = activity.price; // Assuming the Activity model has a price field
        }

        const booking = new Booking({
            tourist: touristId,
            bookable: bookableId,
            bookableModel: bookableModel,
            eventDate: new Date(eventDate),
            amount: amount
        });

        await booking.save();

        // Update Tourist with the new booking
        await Tourist.findByIdAndUpdate(touristId, { $push: { bookings: booking._id } });

        res.status(201).json({ message: 'Booking created successfully', booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const getBookings = async (req, res) => {
    const touristId = req.user.id;

    try {
        const bookings = await Booking.find({ tourist: touristId }).populate('tourist').populate('bookable');
        res.status(200).json(bookings);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const cancelBooking = async (req, res) => {
    const { id } = req.params;
    const touristId = req.user.id;

    try {
        const booking = await Booking.findOne({ _id: id, tourist: touristId });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or you do not have access' });
        }

        const currentDate = new Date();
        const eventDate = new Date(booking.eventDate);
        const hoursDifference = (eventDate - currentDate) / (1000 * 60 * 60);

        if (hoursDifference < 48) {
            return res.status(400).json({ error: 'Bookings can only be cancelled at least 48 hours before the event date' });
        }

        booking.status = 'cancelled';
        await booking.save();

        res.status(200).json({ message: 'Booking cancelled successfully', booking });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

const payForBooking = async (req, res) => {
    const { id } = req.params;
    const touristId = req.user.id;

    try {
        const booking = await Booking.findOne({ _id: id, tourist: touristId });

        if (!booking) {
            return res.status(404).json({ error: 'Booking not found or you do not have access' });
        }

        if (booking.status !== 'pending') {
            return res.status(400).json({ error: 'Booking is not in a payable state' });
        }

        // Assume payment is successful
        booking.status = 'confirmed';
        await booking.save();

        // Calculate loyalty points based on tourist's level
        const amountPaid = booking.amount; // Assuming booking has an amount field
        const tourist = await Tourist.findById(touristId);
        let points = 0;

        switch (tourist.level) {
            case 1:
                points = amountPaid * 0.5;
                break;
            case 2:
                points = amountPaid * 1;
                break;
            case 3:
                points = amountPaid * 1.5;
                break;
            default:
                points = amountPaid * 0.5;
                break;
        }

        tourist.accumulatedPoints += points;
        tourist.currentPoints += points;

        // Update level based on accumulated points
        if (tourist.accumulatedPoints <= 100000) {
            tourist.level = 1;
        } else if (tourist.accumulatedPoints <= 500000) {
            tourist.level = 2;
        } else {
            tourist.level = 3;
        }

        await tourist.save();

        res.status(200).json({ message: 'Payment successful and points added', booking, tourist });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};

module.exports = { createBooking, getBookings, cancelBooking, payForBooking };