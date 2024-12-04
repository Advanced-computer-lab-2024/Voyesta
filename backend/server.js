// server.js
const app = require('./App');

const notifyUpcomingEvents = require('../backend/src/controllers/scheduler');

const mongoose = require('mongoose');
require('dotenv').config();

const cron = require('node-cron');
const { checkBirthdaysAndGeneratePromoCodes, checkProductStockLevels } = require('./src/controllers/adminController'); // Adjust the path as necessary


cron.schedule('58 23 * * *', checkBirthdaysAndGeneratePromoCodes);

cron.schedule('*/30 * * * *', checkProductStockLevels);

const port = process.env.PORT || 3000;

cron.schedule('0 0 * * *', notifyUpcomingEvents);
console.log('Scheduler started');

 // Starting server
 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);

})

