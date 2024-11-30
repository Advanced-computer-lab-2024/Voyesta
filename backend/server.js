// server.js
const app = require('./App');
const mongoose = require('mongoose');
require('dotenv').config();

const cron = require('node-cron');

const { checkBirthdaysAndGeneratePromoCodes } = require('./src/controllers/adminController'); // Adjust the path as necessary
cron.schedule('00 12 * * *', checkBirthdaysAndGeneratePromoCodes);
console.log('Cron job scheduled to run every day at 10:25 AM');
// Set the port from the environment variable or use 3000
const port = process.env.PORT || 3000;

 // Starting server
 app.listen(port, () => {
  console.log(`Listening to requests on http://localhost:${port}`);
})

