// backend/scheduler.js
const cron = require('node-cron');
const Booking = require('../Models/Booking');
const Tourist = require('../Models/Tourist');
const Notification = require('../Models/Notification');
const sendGrid = require('@sendgrid/mail');

sendGrid.setApiKey('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'); // Replace with your SendGrid API key

const notifyUpcomingEvents = async () => {
  try {
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 5); // 1 day before the event

    const bookings = await Booking.find({
      eventDate: { $gte: new Date(), $lte: upcomingDate },
      status: 'confirmed' || 'pending'
    }).populate('tourist');
    for (const booking of bookings) {
      const tourist = booking.tourist;
      if (tourist) {
        console.log(tourist.email)
        const message = `Reminder: You have an upcoming event on ${booking.eventDate.toLocaleDateString()}.`;

        const notification = new Notification({ message });
        await notification.save();
        tourist.notifications.push(notification);
        await tourist.save();

        const emailData = {
            to: tourist.email,
            from: 'voyesta@outlook.com',
            subject: 'Notification',
            text: message,
            html: `<p>${message}</p>`,
        };

        sendGrid
        .send(emailData)
        .then(() => console.log('Email sent'))
        .catch((error) => {
            console.error('Error:', error);
        });
      }
    }
  } catch (error) {
    console.error('Error sending upcoming event notifications:', error.message);
  }
};

module.exports = notifyUpcomingEvents;