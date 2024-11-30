const Notification = require('../Models/Notification');
const Tourist = require('../Models/Tourist');
const TourGuide = require('../Models/Tour Guide');
const Advertiser = require('../Models/Advertiser');
const Itinerary = require('../Models/Itinerary');
const sendGrid = require('@sendgrid/mail');
const Activity = require('../Models/Activity');

sendGrid.setApiKey('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');

const getNotifications = async (req, res) => {
    // const {userType} = req.body;
    const userId = req.user.id;
    const userType = req.user.type;

    try {
        let user;
        if (userType === 'tourist') {
            user = await Tourist.findById(userId).populate('notifications');
        } else if (userType === 'tourGuide') {
            user = await TourGuide.findById(userId).populate('notifications');
        } else if (userType === 'advertiser') {
            user = await Advertiser.findById(userId).populate('notifications');
        } else {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        res.status(200).json(user.notifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const sendNotification = async (req, res) => {
    const { userType, itemId, message } = req.body;

    try {
        let user;
        if (userType === 'tourist') {
            const itinerary = await Itinerary.findById(itemId).populate('createdBy');
            user = itinerary.createdBy;
        } else if (userType === 'tourGuide') {
            const itinerary = await Itinerary.findById(itemId).populate('createdBy');
            user = itinerary.createdBy;
        } else if (userType === 'advertiser') {
            const activity = await Activity.findById(itemId).populate('advertiser');
            user = activity.advertiser;
        } else {
            return res.status(400).json({ error: 'Invalid user type' });
        }

        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        const notification = new Notification({ message: message });
        await notification.save();

        if (!user.notifications) {
            user.notifications = [];
        }
        
        user.notifications.push(notification);
        await user.save();

        const emailData = {
            to: user.email,
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
            res.status(500).json({ message: 'Error sending message', error });
        });

        res.status(200).json({ message: 'Notification sent successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

const requestNotification = async (req, res) => {
    const userId = req.user.id;
    const { itemId, itemType } = req.body;
    console.log(req.body);
    try {
      let item;
      if (itemType === 'activity') {
        item = await Activity.findById(itemId);
      } else if (itemType === 'itinerary') {
        item = await Itinerary.findById(itemId);
      } else {
        return res.status(400).json({ error: 'Invalid item type' });
      }

      if (!item) {
        return res.status(404).json({ error: 'Item not found' });
      }

      if (!item.requestToBeNotified.includes(userId)) {
        item.requestToBeNotified.push(userId);
        await item.save();
      }
  
      res.status(200).json({ message: 'Notification request saved successfully' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };

  const notifyUsersForBookingEnabled = async (itemId, itemType) => {
    try {
      let item;
      if (itemType === 'activity') {
        item = await Activity.findById(itemId).populate('requestToBeNotified');
      } else if (itemType === 'itinerary') {
        item = await Itinerary.findById(itemId).populate('requestToBeNotified');
      } else {
        throw new Error('Invalid item type');
      }
  
      if (!item) {
        throw new Error('Item not found');
      }
  
      const usersToNotify = item.requestToBeNotified;

      for (const userId of usersToNotify) {
        const user = await Tourist.findById(userId);
        if (!user) continue;

        const message = `Booking for the ${itemType} you requested has been enabled.`;
        console.log(message);
        const notification = new Notification({ message: message });
        await notification.save();

        user.notifications.push(notification);
        user.requestToBeNotified = item.requestToBeNotified.filter(item => item.toString() !== itemId.toString());
        await user.save();

        const emailData = {
          to: user.email,
          from: 'voyesta@outlook.com',
          subject: 'Booking Enabled',
          text: message
        };

        await sendGrid.send(emailData);
      }

      // Clear the requestToBeNotified array after notifying users
      item.requestToBeNotified = [];
      await item.save();
    } catch (error) {
      console.error('Error notifying users:', error.message);
    }
  };

module.exports = { getNotifications, sendNotification, requestNotification, notifyUsersForBookingEnabled };