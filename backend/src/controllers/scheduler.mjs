// backend/scheduler.js
const cron = require('node-cron');
const Booking = require('../Models/Booking');
const Tourist = require('../Models/Tourist');
const Notification = require('../Models/Notification');
const sendGri
d = require('@sendgrid/mail');
const emailjs = require('emailjs');

sendGrid.setApiKey('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'); // Replace with your SendGrid API key

const server = emailjs.server.connect({
  user: "voyesta@outlook.com", // Your email address
  password: "GUC_1234", // Your email password or app-specific password
  host: 'smtp.gmail.com', // Your SMTP server
  ssl: true,
});

const notifyUpcomingEvents = async () => {
  try {
    const upcomingDate = new Date();
    upcomingDate.setDate(upcomingDate.getDate() + 365); // 1 day before the event

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

        server.send(emailData, (err, message) => {
          if (err) {
            console.error('Error sending email:', err);
          } else {
            console.log('Email sent:', message);
          }
        });
      }
    }
  } catch (error) {
    console.error('Error sending upcoming event notifications:', error.message);
  }
};

module.exports = notifyUpcomingEvents;