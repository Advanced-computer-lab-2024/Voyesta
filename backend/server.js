// server.js
const app = require('./App');

const notifyUpcomingEvents = require('../backend/src/controllers/scheduler'); 
const cron = require('node-cron');

const mongoose = require('mongoose');
require('dotenv').config();

// Set the port from the environment variable or use 3000
const port = process.env.PORT || 3000;

cron.schedule('0 0 * * *', notifyUpcomingEvents);
console.log('Scheduler started');

 // Starting server
 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);

})

